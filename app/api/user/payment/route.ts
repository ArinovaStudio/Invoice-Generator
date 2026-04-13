import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const paymentDetails = await prisma.paymentDetails.findUnique({ where: { userId: user.id } });

    return NextResponse.json({ success: true, paymentDetails: paymentDetails || {} }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

const paymentSchema = z.object({
  upiId: z.string().max(50, "UPI ID is too long").optional().nullable(),
  bankName: z.string().max(100, "Bank name is too long").optional().nullable(),
  accountNumber: z.string().max(30, "Account number is too long").optional().nullable(),
  ifscCode: z.string().max(20, "IFSC code is too long").optional().nullable(),
  accountHolderName: z.string().max(100, "Name is too long").optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validation = paymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 } );
    }

    const { upiId, bankName, accountNumber, ifscCode, accountHolderName } = validation.data;

    await prisma.paymentDetails.upsert({
      where: { userId: user.id },
      update: {
        upiId: upiId || null,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        ifscCode: ifscCode || null,
        accountHolderName: accountHolderName || null,
      },
      create: {
        userId: user.id,
        upiId: upiId || null,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        ifscCode: ifscCode || null,
        accountHolderName: accountHolderName || null,
      }
    });

    return NextResponse.json({ success: true, message: "Payment details saved successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}