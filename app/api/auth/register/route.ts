import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import sendEmail from "@/lib/email";
import {otpTemplate} from '@/lib/templates';
import { Otptype } from "@prisma/client";
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const verifySchema = registerSchema.extend({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const validation = registerSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json( { success: false, message: validation.error.issues[0].message }, { status: 400 });
//     }

//     const { name, email, password } = validation.data;

//     const existingUser = await prisma.user.findUnique({ where: { email } });

//     if (existingUser) {
//       return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 } );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.user.create({ data: { name, email, password: hashedPassword } });

//     return NextResponse.json( { success: true, message: "User registered successfully" }, { status: 201 } );

//   } catch {
//     return NextResponse.json( { success: false, message: "Internal server error" }, { status: 500 } );
//   }
// }


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const step = String(body.step);

    /**
     * =========================
     * STEP 1: SEND OTP
     * =========================
     */
    if (step === "sent_otp") {
      const validation = registerSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { success: false, message: validation.error.issues[0].message },
          { status: 400 }
        );
      }

      const { name, email, password } = validation.data;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 409 }
        );
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // 🔥 store OTP in DB
      await prisma.otp.upsert({
        where: {
          email_type: {
            email,
            type: Otptype.VERIFY_EMAIL,
          },
        },
        update: {
          code: otp,
          expiresAt,
        },
        create: {
          email,
          code: otp,
          type: Otptype.VERIFY_EMAIL,
          expiresAt,
        },
      });
      sendEmail(email,"Otp For Verification",otpTemplate(otp,"VERIFY_EMAIL",))
      console.log(`OTP for ${email}: ${otp}`);

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
      });
    }

    /**
     * =========================
     * STEP 2: VERIFY OTP + REGISTER
     * =========================
     */
    if (step === "verify_otp") {
      const validation = verifySchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { success: false, message: validation.error.issues[0].message },
          { status: 400 }
        );
      }

      const { name, email, password, otp } = validation.data;

      const otpRecord = await prisma.otp.findUnique({
        where: {
          email_type: {
            email,
            type: Otptype.VERIFY_EMAIL,
          },
        },
      });

      if (!otpRecord) {
        return NextResponse.json(
          { success: false, message: "OTP not found" },
          { status: 404 }
        );
      }

      if (otpRecord.code !== otp) {
        return NextResponse.json(
          { success: false, message: "Invalid OTP" },
          { status: 400 }
        );
      }

      if (otpRecord.expiresAt < new Date()) {
        return NextResponse.json(
          { success: false, message: "OTP expired" },
          { status: 410 }
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 409 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      await prisma.otp.delete({
        where: {
          email_type: {
            email,
            type: Otptype.VERIFY_EMAIL,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "User registered successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid step" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}