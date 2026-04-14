import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const recentInvoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const groupStats = await prisma.invoice.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    let totalOutstanding = 0;
    let totalPaid = 0;
    let pendingDrafts = 0;

    groupStats.forEach((group) => {
      if (group.status === 'SENT' || group.status === 'OVERDUE') {
        totalOutstanding += group._sum.totalAmount || 0;
      }
      if (group.status === 'PAID') {
        totalPaid += group._sum.totalAmount || 0;
      }
      if (group.status === 'DRAFT') {
        pendingDrafts += group._count.id;
      }
    });

    return NextResponse.json({
      success: true,
      recentInvoices,
      stats: {
        totalOutstanding,
        totalPaid,
        pendingDrafts,
      }
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}