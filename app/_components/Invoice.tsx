"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const themes = [
  { name: "black", color: "bg-black" },
  { name: "orange", color: "bg-orange-500" },
  { name: "blue", color: "bg-blue-600" },
  { name: "green", color: "bg-green-500" },
  { name: "red", color: "bg-red-600" },
];

const templates = [
  { name: "Standard", active: true },
  { name: "Spreadsheet" },
  { name: "Compact" },
  { name: "+80 more templates" },
];

export default function InvoiceLayout() {
  const [currentColor, setCurrentColor] = useState(themes[0]);
  return (
    <div className="w-full py-10 px-6">
      <div className="mx-auto max-w-6xl justify-center flex gap-2">
        {/* LEFT - Invoice Section */}
        <div className="flex-2">
          <Card className="p-6 max-w-3xl shadow-sm border bg-white">
            <CardContent className="space-y-6 p-0">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="w-32 h-20 border border-dashed rounded flex items-center justify-center text-xs text-gray-400">
                    Upload Logo
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">Your Company</p>
                    <p>Your Name</p>
                    <p>Company’s Address</p>
                    <p>City, State Zip</p>
                    <p>U.S.A</p>
                  </div>
                </div>

                <h2 className="text-3xl font-light tracking-wide">INVOICE</h2>
              </div>

              {/* Billing */}
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">Bill To:</p>
                  <p>Your Client’s Company</p>
                  <p>Client’s Address</p>
                  <p>City, State Zip</p>
                  <p>U.S.A</p>
                </div>

                <div className="text-right space-y-1">
                  <p>
                    <span className="font-medium">Invoice#</span> INV-12
                  </p>
                  <p>
                    <span className="font-medium">Invoice Date</span> Apr 14,
                    2026
                  </p>
                  <p>
                    <span className="font-medium">Due Date</span> Apr 14, 2026
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="border rounded">
                <div className={`grid grid-cols-5 ${currentColor.color} text-white text-sm p-2`}>
                  <p className="col-span-2">Item Description</p>
                  <p>Qty</p>
                  <p>Rate</p>
                  <p>Amount</p>
                </div>

                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-5 text-sm p-2 border-t"
                  >
                    <p className="col-span-2 text-gray-500">
                      Enter item name/description
                    </p>
                    <p>1</p>
                    <p>0.00</p>
                    <p>0.00</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sub Total</span>
                    <span>200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (12%)</span>
                    <span>24.00</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total</span>
                    <span>$224.00</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium text-gray-800">Notes</p>
                <p>It was great doing business with you.</p>
              </div>

              {/* Terms */}
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium text-gray-800">Terms & Conditions</p>
                <p>Please make the payment by the due date.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT - Sticky Panel */}
        <div className="relative flex-1">
          <div className="sticky top-20">
            <Card className="p-5 border-0! ring-0! shadow-none!">
              <CardContent className="p-0 space-y-6">
                {/* Header */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Download Invoice
                  </h3>
                  <div className="h-px bg-gray-200 mt-3" />
                </div>

                {/* Theme */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Theme</p>

                  <div className="flex items-center gap-3">
                    {themes.map((t, i) => (
                      <div
                        key={t.name}
                        onClick={() => {
                          setCurrentColor(t);
                        }}
                        className="relative"
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full cursor-pointer",
                            t.color
                          )}
                        />

                        {/* Selected state */}
                        {t.name === currentColor.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-gray-200" />
                </div>

                {/* Templates */}
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((t, i) => (
                    <div key={t.name} className="text-center space-y-2">
                      <div
                        className={cn(
                          "rounded-lg border p-3 h-28 flex items-center justify-center bg-gray-100 cursor-pointer transition",
                          t.active
                            ? "border-blue-500 ring-1 ring-blue-500"
                            : "border-gray-300 hover:border-blue-400"
                        )}
                      >
                        {/* Fake preview UI */}
                        <div className="w-full h-full flex flex-col gap-2">
                          <div className="h-2 bg-gray-300 w-1/3 rounded" />
                          <div className="h-2 bg-gray-300 w-1/4 rounded" />
                          <div className="flex-1 border rounded bg-white" />
                        </div>
                      </div>

                      <p
                        className={cn(
                          "text-sm",
                          t.active
                            ? "text-blue-600 font-medium"
                            : "text-gray-600"
                        )}
                      >
                        {t.name}
                        {t.name.includes("more") && (
                          <ExternalLink className="inline w-3 h-3 ml-1" />
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Info Box */}
                <div className="bg-gray-100 rounded-lg p-4 flex gap-3 text-sm text-gray-700">
                  <Info className="w-4 h-4 mt-0.5" />
                  <p>
                    Access other fully customizable invoice templates.{" "}
                    <span className="text-blue-600 cursor-pointer">
                      Try it now
                      <ExternalLink className="inline w-3 h-3 ml-1" />
                    </span>
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200" />

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save and Send
                  </Button>

                  <Button variant="outline" className="flex-1">
                    Download/Print ▾
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
