import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const search = req.nextUrl.searchParams.get("search");

    const whereClause: any = { userId: user.id };
    
    if (search) {
      whereClause.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, clients }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

const clientSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Email is required"),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  country: z.string().default("India").optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validation = clientSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json( { success: false, message: validation.error.issues[0].message }, { status: 400 } );
    }

    const { companyName, email, address, city, state, zip, country } = validation.data;

    const existingClient = await prisma.client.findFirst({ where: { userId: user.id, companyName } });

    if (existingClient) {
      return NextResponse.json({ success: false, message: "Client already exists" }, { status: 409 });
    }

    await prisma.client.create({
      data: { userId: user.id, companyName, email, address, city, state, zip, country }
    });

    return NextResponse.json({ success: true, message: "Client saved successfully" }, { status: 201 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}