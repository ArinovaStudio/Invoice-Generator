import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { uploadImage } from "@/lib/uploads";
import { z } from "zod";

export async function GET() {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        invoiceNumber: true,
        clientName: true,
        issueDate: true,
        dueDate: true,
        totalAmount: true,
        status: true,
      }
    });

    return NextResponse.json({ success: true, invoices }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  quantity: z.number().min(1),
  rate: z.number().min(0),
  taxRate: z.number().min(0).default(0),
});

const invoiceSchema = z.object({
  clientId: z.string().optional().nullable(),

  title: z.string().default("INVOICE"),
  paymentUpiId: z.string().optional().nullable(),
  includeQrCode: z.boolean().default(false),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().transform((str) => new Date(str)),
  dueDate: z.string().transform((str) => new Date(str)),
  
  senderName: z.string().optional(),
  senderAddress: z.string().optional().nullable(),
  senderCity: z.string().optional().nullable(),
  senderState: z.string().optional().nullable(),
  senderZip: z.string().optional().nullable(),
  senderCountry: z.string().optional().nullable(),

  clientName: z.string().optional(),
  clientAddress: z.string().optional().nullable(),
  clientCity: z.string().optional().nullable(),
  clientState: z.string().optional().nullable(),
  clientZip: z.string().optional().nullable(),
  clientCountry: z.string().optional().nullable(),

  notesTitle: z.string().default("Notes"),
  notes: z.string().optional().nullable(),
  termsTitle: z.string().default("Terms & Conditions"),
  terms: z.string().optional().nullable(),

  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const rawData = formData.get("data") as string | null;
    const logoFile = formData.get("logo") as File | null;

    if (!rawData) {
      return NextResponse.json({ success: false, message: "Missing invoice data" }, { status: 400 });
    }

    const parsedData = JSON.parse(rawData);
    const validation = invoiceSchema.safeParse(parsedData);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const data = validation.data;

    const existingInvoice = await prisma.invoice.findUnique({
      where: { userId_invoiceNumber: { userId: user.id, invoiceNumber: data.invoiceNumber } }
    });

    if (existingInvoice) {
      return NextResponse.json({ success: false, message: "Invoice number already exists" }, { status: 409 });
    }

    let calculatedSubTotal = 0;
    let calculatedTaxTotal = 0;

    const processedItems = data.items.map(item => {
      const itemBaseAmount = item.quantity * item.rate;
      const itemTaxAmount = itemBaseAmount * (item.taxRate / 100);
      const finalItemAmount = itemBaseAmount + itemTaxAmount;

      calculatedSubTotal += itemBaseAmount;
      calculatedTaxTotal += itemTaxAmount;

      return {
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        taxRate: item.taxRate,
        amount: finalItemAmount,
      };
    });

    const calculatedTotalAmount = calculatedSubTotal + calculatedTaxTotal;

    let finalLogoUrl = user.logoUrl;
    
    if (logoFile && logoFile.size > 0) {
      const { url, error: uploadError } = await uploadImage(logoFile, "invoices");
      if (uploadError || !url) {
        return NextResponse.json({ success: false, message: uploadError }, { status: 500 });
      }
      finalLogoUrl = url;
    }

    let dbClient = null;
    if (data.clientId) {
      dbClient = await prisma.client.findUnique({ where: { id: data.clientId, userId: user.id } });
    }

    await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: data.clientId,
        title: data.title,
        paymentUpiId: data.paymentUpiId,
        includeQrCode: data.includeQrCode,
        invoiceNumber: data.invoiceNumber,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        
        senderLogoUrl: finalLogoUrl,
        senderName: data.senderName || user.companyName || user.name || "Unknown Sender",
        senderAddress: data.senderAddress || user.companyAddress,
        senderCity: data.senderCity || user.city,
        senderState: data.senderState || user.state,
        senderZip: data.senderZip || user.zip,
        senderCountry: data.senderCountry || user.country || "India",

        clientName: dbClient?.companyName || data.clientName || "Unknown Client",
        clientAddress: dbClient?.address || data.clientAddress,
        clientCity: dbClient?.city || data.clientCity,
        clientState: dbClient?.state || data.clientState,
        clientZip: dbClient?.zip || data.clientZip,
        clientCountry: dbClient?.country || data.clientCountry || "India",

        subTotal: calculatedSubTotal,
        taxTotal: calculatedTaxTotal,
        totalAmount: calculatedTotalAmount,

        notesTitle: data.notesTitle,
        notes: data.notes,
        termsTitle: data.termsTitle,
        terms: data.terms,

        items: { create: processedItems }
      }
    });

    return NextResponse.json({ success: true, message: "Invoice created successfully" }, { status: 201 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}