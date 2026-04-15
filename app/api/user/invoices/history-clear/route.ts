import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { deleteImage } from "@/lib/uploads";

export async function DELETE() {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const invoicesWithLogos = await prisma.invoice.findMany({
      where: { 
        userId: user.id,
        senderLogoUrl: { not: null }
      },
      select: { senderLogoUrl: true }
    });

    const deletePromises = invoicesWithLogos.filter(inv => inv.senderLogoUrl && inv.senderLogoUrl !== user.logoUrl)
    .map(inv => deleteImage(inv.senderLogoUrl as string) );

    await Promise.all(deletePromises);

    await prisma.invoice.deleteMany({ where: { userId: user.id } });

    return NextResponse.json( { success: true, message: "Invoice history cleared" }, { status: 200 } );

  } catch {
    return NextResponse.json( { success: false, message: "Failed to clear history." }, { status: 500 });
  }
}