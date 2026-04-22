import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/uploads";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ invoiceId: string }> }) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { invoiceId } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId: user.id },
      include: { items: true }
    });

    if (!invoice){
        return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, invoice }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

const updateInvoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  quantity: z.number().min(1),
  rate: z.number().min(0),
  taxRate: z.number().min(0).default(0),
});

const updateInvoiceSchema = z.object({
  clientId: z.string().optional().nullable(),
  title: z.string().optional(),
  paymentUpiId: z.string().optional().nullable(),
  includeQrCode: z.boolean().optional(),
  invoiceNumber: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  issueDate: z.string().transform((str) => new Date(str)).optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
  
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

  notesTitle: z.string().optional(),
  notes: z.string().optional().nullable(),
  termsTitle: z.string().optional(),
  terms: z.string().optional().nullable(),

  tableDescLabel: z.string().optional(),
  tableQtyLabel: z.string().optional(),
  tableRateLabel: z.string().optional(),
  tableTaxLabel: z.string().optional(),
  tableAmountLabel: z.string().optional(),

  items: z.array(updateInvoiceItemSchema).optional(),
});


export async function PUT(req: NextRequest, { params }: { params: Promise<{ invoiceId: string }> }) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { invoiceId } = await params;

    const existingInvoice = await prisma.invoice.findUnique({ where: { id: invoiceId, userId: user.id }});

    if (!existingInvoice){
        return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const rawData = formData.get("data") as string | null;
    const logoFile = formData.get("logo") as File | null;

    let data: any = {};
    if (rawData) {
      const parsedData = JSON.parse(rawData);
      const validation = updateInvoiceSchema.safeParse(parsedData);
      if (!validation.success) {
        return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
      }
      data = validation.data;
    }

    if (data.invoiceNumber && data.invoiceNumber !== existingInvoice.invoiceNumber) {
      const duplicateCheck = await prisma.invoice.findUnique({
        where: { userId_invoiceNumber: { userId: user.id, invoiceNumber: data.invoiceNumber } }
      });
      if (duplicateCheck) return NextResponse.json({ success: false, message: "Invoice number already in use" }, { status: 409 });
    }

    // logo update
    let updatedLogoUrl = existingInvoice.senderLogoUrl;
    
    if (logoFile && logoFile.size > 0) {
      const { url, error: uploadError } = await uploadImage(logoFile, "invoices");
      if (uploadError || !url){
        return NextResponse.json({ success: false, message: uploadError }, { status: 500 });
      }
      
      if (existingInvoice.senderLogoUrl && existingInvoice.senderLogoUrl !== user.logoUrl) {
        await deleteImage(existingInvoice.senderLogoUrl);
      }
      
      updatedLogoUrl = url;
    }

    let itemsUpdateConfig = undefined;
    let newSubTotal = existingInvoice.subTotal;
    let newTaxTotal = existingInvoice.taxTotal;
    let newTotalAmount = existingInvoice.totalAmount;

    if (data.items && data.items.length > 0) {
      newSubTotal = 0;
      newTaxTotal = 0;

      const processedItems = data.items.map((item: any) => {
        const itemBase = item.quantity * item.rate;
        const itemTax = itemBase * (item.taxRate / 100);
        newSubTotal += itemBase;
        newTaxTotal += itemTax;

        return {
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          taxRate: item.taxRate,
          amount: itemBase + itemTax,
        };
      });

      newTotalAmount = newSubTotal + newTaxTotal;

      itemsUpdateConfig = {
        deleteMany: {}, 
        create: processedItems
      };
    }

    await prisma.invoice.update({
      where: { id: invoiceId, userId: user.id },
      data: {
        ...data,
        items: undefined,
        senderLogoUrl: updatedLogoUrl,
        subTotal: newSubTotal,
        taxTotal: newTaxTotal,
        totalAmount: newTotalAmount,
        ...(itemsUpdateConfig && { items: itemsUpdateConfig })
      }
    });

    return NextResponse.json({ success: true, message: "Invoice updated" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ invoiceId: string }> }) {
  try {
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { invoiceId } = await params;

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId, userId: user.id } });
    if (!invoice){
        return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    }

    if (invoice.senderLogoUrl && invoice.senderLogoUrl !== user.logoUrl) {
      await deleteImage(invoice.senderLogoUrl);
    }

    await prisma.invoice.delete({ where: { id: invoiceId, userId: user.id } });

    return NextResponse.json({ success: true, message: "Invoice deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}