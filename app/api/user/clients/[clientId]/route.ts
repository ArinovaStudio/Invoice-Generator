import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { z } from "zod";

export async function GET( req: NextRequest, { params }: { params: Promise<{ clientId: string }> } ) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { clientId } = await params;

    const client = await prisma.client.findUnique({ where: { id: clientId, userId: user.id } });

    if (!client) {
      return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, client }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

const updateClientSchema = z.object({
  companyName: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { clientId } = await params;
    const body = await req.json();
    const validation = updateClientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const existingClient = await prisma.client.findUnique({ where: { id: clientId, userId: user.id } });

    if (!existingClient) {
      return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
    }

    await prisma.client.update({
      where: { id: clientId },
      data: validation.data,
    });

    return NextResponse.json({ success: true, message: "Client updated successfully"  }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { clientId } = await params;

    const client = await prisma.client.findUnique({ where: { id: clientId, userId: user.id } });

    if (!client) {
      return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
    }

    await prisma.client.delete({ where: { id: clientId } });

    return NextResponse.json({ success: true, message: "Client deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}