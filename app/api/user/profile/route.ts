import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { deleteImage, uploadImage } from "@/lib/uploads";

export async function GET() {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const profileData = {
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      companyAddress: user.companyAddress,
      city: user.city,
      state: user.state,
      zip: user.zip,
      country: user.country,
      logoUrl: user.logoUrl,
    };

    return NextResponse.json({ success: true, profile: profileData }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    
    const companyName = formData.get("companyName") as string | null;
    const companyAddress = formData.get("companyAddress") as string | null;
    const city = formData.get("city") as string | null;
    const state = formData.get("state") as string | null;
    const zip = formData.get("zip") as string | null;
    const country = formData.get("country") as string | null;

    const logoFile = formData.get("logo") as File | null;
    let logoUrl = user.logoUrl; 

    if (logoFile && logoFile.size > 0) {
      const { url, error: uploadError } = await uploadImage(logoFile, "logos");
      
      if (uploadError || !url) {
        return NextResponse.json({ success: false, message: uploadError }, { status: 500 });
      }

      if (user.logoUrl) {
        const isLogoInUse = await prisma.invoice.findFirst({
          where: { 
            userId: user.id,
            senderLogoUrl: user.logoUrl 
          }
        });

        if (!isLogoInUse) {
          await deleteImage(user.logoUrl);
        }
      }
      
      logoUrl = url;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(companyName !== null && { companyName }),
        ...(companyAddress !== null && { companyAddress }),
        ...(city !== null && { city }),
        ...(state !== null && { state }),
        ...(zip !== null && { zip }),
        ...(country !== null && { country }),
        logoUrl,
      }
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        logoUrl: true,
        invoices: { select: { senderLogoUrl: true } },
      },
    });

    if (!userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const urlsToDelete = new Set<string>();
    
    if (userData.logoUrl) {
      urlsToDelete.add(userData.logoUrl);
    }
    
    userData.invoices.forEach((invoice) => {
      if (invoice.senderLogoUrl) {
        urlsToDelete.add(invoice.senderLogoUrl);
      }
    });

    if (urlsToDelete.size > 0) {
      const deletePromises = Array.from(urlsToDelete).map((url) => deleteImage(url));
      await Promise.all(deletePromises);
    }

    await prisma.user.delete({ where: { id: user.id } });

    return NextResponse.json( { message: "Account permanently deleted" }, { status: 200 } );
  } catch {
    return NextResponse.json( { success: false, message: "Internal Server Error" }, { status: 500 } );
  }
}