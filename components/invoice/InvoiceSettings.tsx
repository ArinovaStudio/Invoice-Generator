"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { themes, templates } from "@/lib/InvoiceConfig";
type Theme = { name: string; color: string };
interface Props {
  invoice: any;
  setInvoice: any;

  currentColor: Theme;
  setCurrentColor: (theme: Theme) => void;

  // clients: any[];
  isLoggedIn: boolean;
  hasSavedUpi: boolean;

  mode: "create" | "update";

  isSaving: boolean;
  isEmailing: boolean;
  isDeleting: boolean;
  isAnyActionProcessing: boolean;

  // handleClientSelect: (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => void;

  handleEmailClick: () => void;
  handleDownloadPDF: () => void;
  handleDelete: () => void;
  handleSaveClick: () => void;
}
export default function InvoiceSettings({
  isSaving,
  hasSavedUpi,
  invoice,
  setInvoice,
  mode,
  isLoggedIn,
  // clients,
  // handleClientSelect,
  currentColor,
  setCurrentColor,
  handleDelete,
  handleDownloadPDF,
  handleEmailClick,
  handleSaveClick,
  isAnyActionProcessing,
  isDeleting,
  isEmailing,
}: Props) {
  return (
    <div className="relative w-full self-start lg:w-80">
      <div className="sticky top-10">
        <Card className="p-6 border shadow-sm bg-white rounded-xl">
          <CardContent className="p-0 space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Invoice Settings
              </h3>
              <div className="h-px bg-gray-100 mt-4" />
            </div>
            {/* Theme */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Theme Color</p>
              <div className="flex items-center gap-3">
                {themes.map((t) => (
                  <div
                    key={t.name}
                    onClick={() => setCurrentColor(t)}
                    className="relative"
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-transform",
                        t.color
                      )}
                    />
                    {t.name === currentColor.name && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="h-px bg-gray-100" />
            </div>
            <div className="relative pt-2">
              {/* Original Templates Grid */}
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t) => (
                  <div key={t.name} className="text-center space-y-2">
                    <div
                      className={cn(
                        "rounded-2xl border p-2.5 h-24 flex items-center justify-center cursor-pointer transition-all bg-[hsl(var(--card))]",
                        t.active
                          ? "border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary)/0.35)] shadow-sm"
                          : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.45)] hover:bg-[hsl(var(--accent))]"
                      )}
                    >
                      <div className="w-full h-full flex flex-col gap-1.5 opacity-80">
                        <div className="h-1.5 rounded-full w-1/3 bg-[hsl(var(--muted-foreground)/0.35)]" />
                        <div className="h-1.5 rounded-full w-1/4 bg-[hsl(var(--muted-foreground)/0.28)]" />

                        <div className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] mt-1" />
                      </div>
                    </div>

                    <p
                      className={cn(
                        "text-xs font-medium flex items-center justify-center gap-1",
                        t.active
                          ? "text-[hsl(var(--primary))]"
                          : "text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      {t.name}

                      {t.name.includes("more") && (
                        <ExternalLink className="w-3 h-3" />
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Transparent Glass Overlay */}
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-[1.5px] border border-white/20 flex items-center justify-center">
                  <div className="px-8 py-3 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 shadow-sm">
                    <p className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
                      Coming Soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* UPI / QR Code Section */}
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium text-gray-700">
                Payment Options
              </p>

              {isLoggedIn ? (
                // hasSavedUpi ? (
                //   <label className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600 transition-colors hover:bg-gray-100">
                //     <input
                //       type="checkbox"
                //       checked={invoice.includeQrCode}
                //       onChange={(e) =>
                //         setInvoice((p: any) => ({
                //           ...p,
                //           includeQrCode: e.target.checked,
                //         }))
                //       }
                //       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                //     />
                //     Include UPI QR Code
                //   </label>
                // ) : (
                  <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    {/* Payment Mode Dropdown */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">
                        Select Payment Method
                      </label>

                      <select
                        value={invoice.paymentMethod || ""}
                        onChange={(e) =>
                          setInvoice((p: any) => ({
                            ...p,
                            paymentMethod: e.target.value
                          }))
                        }
                        className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Don't Attact</option>
                        <option value="upi">UPI</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>

                    {/* UPI Fields */}
                    {(invoice.paymentMethod || "") === "upi" && (
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-600">
                          UPI ID for Payment QR
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. yourname@upi"
                          className="w-full rounded-md border-gray-200 bg-white p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                          value={invoice.paymentUpiId}
                          onChange={(e) =>
                            setInvoice((p: any) => ({
                              ...p,
                              paymentUpiId: e.target.value,
                              includeQrCode: !!e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}

                    {/* Bank Fields */}
                    {invoice.paymentMethod === "bank" && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            placeholder="HDFC Bank"
                            value={invoice.bankName || ""}
                            onChange={(e) =>
                              setInvoice((p: any) => ({
                                ...p,
                                bankName: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Account Number
                          </label>
                          <input
                            type="text"
                            placeholder="XXXXXXXXXX"
                            value={invoice.accountNumber || ""}
                            onChange={(e) =>
                              setInvoice((p: any) => ({
                                ...p,
                                accountNumber: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            IFSC Code
                          </label>
                          <input
                            type="text"
                            placeholder="HDFC0001234"
                            value={invoice.ifscCode || ""}
                            onChange={(e) =>
                              setInvoice((p: any) => ({
                                ...p,
                                ifscCode: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              // )
               : (
                <div className="space-y-3">
                  <label
                    className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-400 opacity-70"
                    title="Please login to enable payment options"
                  >
                    <Lock className="h-4 w-4" />
                    <input
                      type="checkbox"
                      disabled
                      className="cursor-not-allowed rounded border-gray-300"
                    />
                    Payment Options Locked
                  </label>

                  <div
                    className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 opacity-70"
                    title="Please login to enable payment options"
                  >
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-400">
                      <Lock className="h-4 w-4" />
                      UPI / Bank Details
                    </label>

                    <input
                      type="text"
                      disabled
                      placeholder="Login required"
                      className="w-full cursor-not-allowed rounded-md border-gray-200 bg-white p-2 text-sm"
                    />
                  </div>

                  <p className="text-center text-xs text-gray-500">
                    Please Login to enable Payment QR and Bank Transfer
                    features.
                  </p>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <>
                {/* Save / Update */}
                <div
                  className={
                    !isLoggedIn ? "cursor-not-allowed relative" : "relative"
                  }
                  title={!isLoggedIn ? "Please login to use this feature" : ""}
                >
                  <Button
                    onClick={handleSaveClick}
                    disabled={!isLoggedIn || isAnyActionProcessing}
                    className="
          w-full h-11 rounded-2xl
          bg-[hsl(var(--primary))]
          text-[hsl(var(--primary-foreground))]
          hover:opacity-90
          font-medium
          shadow-sm
          transition-all
          disabled:cursor-not-allowed
          disabled:opacity-60
          flex items-center justify-center gap-2
        "
                  >
                    {!isLoggedIn && <Lock className="w-4 h-4" />}

                    {isSaving
                      ? "Saving..."
                      : mode === "update"
                      ? "Update Invoice"
                      : "Save Invoice"}
                  </Button>
                </div>

                {/* Email */}
                <div
                  className={
                    !isLoggedIn ? "cursor-not-allowed relative" : "relative"
                  }
                  title={!isLoggedIn ? "Please login to use this feature" : ""}
                >
                  <Button
                    onClick={handleEmailClick}
                    disabled={!isLoggedIn || isAnyActionProcessing}
                    variant="outline"
                    className="
          w-full h-11 rounded-2xl
          border-[hsl(var(--border))]
          bg-[hsl(var(--card))]
          text-[hsl(var(--foreground))]
          hover:bg-[hsl(var(--accent))]
          hover:text-[hsl(var(--accent-foreground))]
          transition-all
          disabled:cursor-not-allowed
          disabled:opacity-60
          flex items-center justify-center gap-2
        "
                  >
                    {!isLoggedIn && <Lock className="w-4 h-4" />}

                    {isEmailing ? "Sending..." : "Send Email"}
                  </Button>
                </div>

                {!isLoggedIn && (
                  <p className="text-xs text-center text-[hsl(var(--muted-foreground))] mt-1">
                    Please login to enable Payments option and Send Email
                    feature.
                  </p>
                )}
              </>

              {/* Download PDF */}
              <Button
                variant="outline"
                onClick={() => handleDownloadPDF()}
                disabled={isAnyActionProcessing}
                className="
      w-full h-11 rounded-2xl
      border-[hsl(var(--border))]
      bg-[hsl(var(--card))]
      text-[hsl(var(--foreground))]
      hover:bg-[hsl(var(--accent))]
      hover:text-[hsl(var(--accent-foreground))]
      transition-all
    "
              >
                Download PDF
              </Button>

              {/* Delete */}
              {mode === "update" && (
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isAnyActionProcessing}
                  className="
        w-full h-11 rounded-2xl
        border-[hsl(var(--destructive)/0.25)]
        bg-[hsl(var(--card))]
        text-[hsl(var(--destructive))]
        hover:bg-[hsl(var(--destructive)/0.08)]
        hover:text-[hsl(var(--destructive))]
        transition-all
      "
                >
                  {isDeleting ? "Deleting..." : "Delete Invoice"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
