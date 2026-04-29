"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { City, Country, State } from "country-state-city";
import { Plus, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { RefObject, useState } from "react";
import validator from "validator";
import { InlineInput, InlineTextarea } from "./InlineComponents";

interface Props {
  invoiceRef: RefObject<HTMLDivElement | null>;
  tapToPayRef: RefObject<HTMLButtonElement | null>;
  invoice: any;
  setInvoice: any;

  logoPreview: string | null;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;

  handleItemChange: (
    index: number,
    field: string,
    value: string | number
  ) => void;

  currentColor: {
    color: string;
  };

  selectedCurrency: {
    symbol: string;
    code: string;
  };

  totals: {
    subTotal: number;
    taxTotal: number;
    total: number;
  };
  pdfMode: boolean;
}

export default function InvoiceForm({
  invoiceRef,
  invoice,
  setInvoice,
  logoPreview,
  handleLogoUpload,
  handleChange,
  handleItemChange,
  currentColor,
  selectedCurrency,
  totals,
  pdfMode,
  tapToPayRef,
}: Props) {
  const [senderZipError, setSenderZipError] = useState("");
  const [clientZipError, setClientZipError] = useState("");
  const addItem = () => {
    setInvoice((prev: any) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, rate: 0, taxRate: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (invoice.items.length === 1) return;
    setInvoice((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: any, i: number) => i !== index),
    }));
  };
  return (
    <div className="flex-2 w-full lg:max-w-3xl">
      <Card className="rounded-xl border bg-white p-10 shadow-lg">
        <CardContent
          className={cn(
            "flex flex-col space-y-4 p-0",
            pdfMode ? "min-h-[1000px]! bg-white" : ""
          )}
          ref={invoiceRef}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="w-1/2 space-y-1 text-sm text-gray-800">
              {
                <label className="mb-4 flex h-20 w-32 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-gray-300 transition-colors hover:bg-gray-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="h-full w-full object-fit"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">
                      {!pdfMode ? "Upload Logo" : "No Logo Provided!"}
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              }

              {(!pdfMode || invoice.senderCompany) && (
                <InlineInput
                  name="senderCompany"
                  value={invoice.senderCompany}
                  onChange={handleChange}
                  placeholder="Your Company"
                  className="text-base font-semibold"
                />
              )}

              {(!pdfMode || invoice.senderName) && (
                <InlineInput
                  name="senderName"
                  placeholder="Your Name"
                  value={invoice.senderName}
                  onChange={handleChange}
                />
              )}

              {(!pdfMode || invoice.senderAddress) && (
                <InlineInput
                  name="senderAddress"
                  placeholder="Company's Address"
                  value={invoice.senderAddress}
                  onChange={handleChange}
                />
              )}

              {(!pdfMode || invoice.senderGSTIN) && (
                <InlineInput
                  name="senderGSTIN"
                  placeholder="Company's GSTIN"
                  value={invoice.senderGSTIN}
                  onChange={handleChange}
                />
              )}

              {(!pdfMode || invoice.senderCountry) &&
                (pdfMode ? (
                  <div className="w-full rounded px-1 text-gray-700">India</div>
                ) : (
                  <select
                    name="senderCountry"
                    value="IN"
                    onChange={handleChange}
                    className={cn(
                      "w-full bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 text-gray-700",
                      "pr-6"
                    )}
                  >
                    <option value="IN">India</option>
                  </select>
                ))}
              {/* State Dropdown */}
              {(!pdfMode || invoice.senderState) &&
                (pdfMode ? (
                  <div className="px-1 text-gray-700">
                    {
                      State.getStatesOfCountry(invoice.senderCountry).find(
                        (s) => s.isoCode === invoice.senderState
                      )?.name
                    }
                  </div>
                ) : (
                  <select
                    name="senderState"
                    value={invoice.senderState}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded bg-transparent px-1 text-gray-700 hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50",
                      "pr-6"
                    )}
                  >
                    <option value="">Select State</option>

                    {State.getStatesOfCountry(invoice.senderCountry).map(
                      (state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      )
                    )}
                  </select>
                ))}
              {/* City Dropdown */}
              {(!pdfMode || invoice.senderCity) &&
                (pdfMode ? (
                  <div className="w-full rounded px-1 text-gray-700">
                    {invoice.senderCity}
                  </div>
                ) : (
                  <select
                    name="senderCity"
                    value={invoice.senderCity}
                    onChange={handleChange}
                    disabled={!invoice.senderState}
                    className={cn(
                      "w-full bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 text-gray-700 disabled:opacity-50",
                      "pr-6"
                    )}
                  >
                    <option value="">Select City</option>

                    {City.getCitiesOfState(
                      invoice.senderCountry,
                      invoice.senderState
                    ).map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                ))}

              {(!pdfMode || invoice.senderZip) && (
                <div>
                  <InlineInput
                    name="senderZip"
                    placeholder="Your ZIP / Postal Code"
                    value={invoice.senderZip}
                    onChange={handleChange}
                    onBlur={() => {
                      if (!invoice.senderZip || !invoice.senderCountry) {
                        setSenderZipError("");
                        return;
                      }
                      try {
                        const isValid = validator.isPostalCode(
                          invoice.senderZip,
                          invoice.senderCountry as any
                        );
                        if (!isValid) {
                          setSenderZipError("Invalid ZIP / Postal Code");
                        } else {
                          setSenderZipError("");
                        }
                      } catch (error: any) {
                        setSenderZipError("Invalid ZIP / Postal Code");
                      }
                    }}
                    className={cn(
                      senderZipError
                        ? "border border-red-400 focus:ring-red-500"
                        : ""
                    )}
                  />

                  {senderZipError && (
                    <p className="text-xs text-red-500 mt-1">
                      {senderZipError}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="text-right w-1/2">
              <InlineInput
                name="title"
                value={invoice.title}
                onChange={handleChange}
                className="text-4xl font-light tracking-wide text-right uppercase mb-4 text-gray-800"
                placeholder="INVOICE"
              />
            </div>
          </div>

          {/* Bill To */}
          <div className="mt-4 flex justify-between text-sm">
            <div className="w-1/2 space-y-1 pr-4">
              {/* {(!pdfMode ||
                invoice.clientCompany ||
                invoice.clientName ||
                invoice.clientAddress) && ( */}
              <p className="mb-1 font-semibold text-gray-800">Bill To:</p>
              {/* )} */}

              {(!pdfMode || invoice.clientCompany) && (
                <InlineInput
                  name="clientCompany"
                  value={invoice.clientCompany}
                  onChange={handleChange}
                  placeholder="Client Company"
                  className="font-medium"
                />
              )}

              {(!pdfMode || invoice.clientName) && (
                <InlineInput
                  name="clientName"
                  value={invoice.clientName}
                  onChange={handleChange}
                  placeholder="Client Name"
                />
              )}

              {(!pdfMode || invoice.clientAddress) && (
                <InlineInput
                  name="clientAddress"
                  value={invoice.clientAddress}
                  onChange={handleChange}
                  placeholder="Client Address"
                />
              )}

              {(!pdfMode || invoice.clientGSTIN) && (
                <InlineInput
                  name="clientGSTIN"
                  value={invoice.clientGSTIN}
                  onChange={handleChange}
                  placeholder="Client GSTIN"
                />
              )}
              {(!pdfMode || invoice.clientCountry) &&
                (pdfMode ? (
                  <div className="w-full rounded px-1 text-gray-700">India</div>
                ) : (
                  <select
                    name="clientCountry"
                    value="IN"
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded bg-transparent px-1 text-gray-700 hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50",
                      "pr-6"
                    )}
                  >
                    <option value="IN">India</option>
                  </select>
                ))}
              {(!pdfMode || invoice.clientState) &&
                (pdfMode ? (
                  <div className="w-full rounded px-1 text-gray-700">
                    {
                      State.getStatesOfCountry(invoice.clientCountry).find(
                        (state) => state.isoCode === invoice.clientState
                      )?.name
                    }
                  </div>
                ) : (
                  <select
                    name="clientState"
                    value={invoice.clientState}
                    onChange={handleChange}
                    disabled={!invoice.clientCountry}
                    className={cn(
                      "w-full rounded bg-transparent px-1 text-gray-700 hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50",
                      "pr-6"
                    )}
                  >
                    <option value="">Select State</option>

                    {State.getStatesOfCountry(invoice.clientCountry).map(
                      (state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      )
                    )}
                  </select>
                ))}

              {(!pdfMode || invoice.clientCity) &&
                (pdfMode ? (
                  <div className="w-full rounded px-1 text-gray-700">
                    {invoice.clientCity}
                  </div>
                ) : (
                  <select
                    name="clientCity"
                    value={invoice.clientCity}
                    onChange={handleChange}
                    disabled={!invoice.clientState}
                    className={cn(
                      "w-full rounded bg-transparent px-1 text-gray-700 hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50",
                      "pr-6"
                    )}
                  >
                    <option value="">Select City</option>

                    {City.getCitiesOfState(
                      invoice.clientCountry,
                      invoice.clientState
                    ).map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                ))}

              {(!pdfMode || invoice.clientZip) && (
                <div>
                  <InlineInput
                    name="clientZip"
                    value={invoice.clientZip}
                    onChange={handleChange}
                    placeholder="ZIP / Postal Code"
                    className={cn(
                      clientZipError &&
                        "border border-red-400 focus:ring-red-500"
                    )}
                    onBlur={() => {
                      if (!invoice.clientZip || !invoice.clientCountry) {
                        setClientZipError("");
                        return;
                      }

                      try {
                        const valid = validator.isPostalCode(
                          invoice.clientZip,
                          invoice.clientCountry as any
                        );

                        setClientZipError(
                          valid ? "" : "Invalid ZIP / Postal Code"
                        );
                      } catch {
                        setClientZipError("Invalid ZIP / Postal Code");
                      }
                    }}
                  />

                  {clientZipError && (
                    <p className="mt-1 text-xs text-red-500">
                      {clientZipError}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="w-[220px] space-y-2 text-right">
              {(!pdfMode || invoice.invoiceNumber) && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Invoice#</span>

                  <InlineInput
                    name="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={handleChange}
                    className="w-24 text-right"
                  />
                </div>
              )}

              {(!pdfMode || invoice.issueDate) && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Date</span>

                  <InlineInput
                    type="date"
                    name="issueDate"
                    value={invoice.issueDate}
                    onChange={handleChange}
                    className="w-32 text-right"
                  />
                </div>
              )}

              {(!pdfMode || invoice.dueDate) && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Due Date</span>

                  <InlineInput
                    type="date"
                    name="dueDate"
                    value={invoice.dueDate}
                    onChange={handleChange}
                    className="w-32 text-right"
                  />
                </div>
              )}
            </div>
          </div>
          {(!pdfMode || invoice.clientState) && (
            <div className="space-y-1 flex gap-2 items-center max-w-sm">
              <p className="text-xs whitespace-nowrap font-medium uppercase tracking-wide text-gray-500">
                Place of Supply
              </p>

              {pdfMode ? (
                <div className="w-full rounded px-1 text-gray-700">
                  {
                    State.getStatesOfCountry(invoice.clientCountry).find(
                      (state) => state.isoCode === invoice.clientState
                    )?.name
                  }
                </div>
              ) : (
                <select
                  name="clientState"
                  value={invoice.clientState}
                  onChange={handleChange}
                  disabled={!invoice.clientCountry}
                  className={cn(
                    "w-full rounded bg-transparent px-1 text-gray-700 hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50",
                    "pr-6"
                  )}
                >
                  <option value="">Select State</option>

                  {State.getStatesOfCountry(invoice.clientCountry).map(
                    (state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    )
                  )}
                </select>
              )}
            </div>
          )}
          {/* Table */}
          <div className="mt-3 overflow-hidden rounded-sm">
            <div
              className={`grid grid-cols-13 items-center px-4 py-2 text-sm font-medium text-white ${currentColor.color}`}
            >
              {/* Description */}
              <div className="col-span-5 pr-2">
                <input
                  name="tableDescLabel"
                  value={invoice.tableDescLabel}
                  onChange={handleChange}
                  placeholder="Item Description"
                  className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full placeholder-white/70"
                />
              </div>

              {/* Qty */}
              <div className="col-span-1 text-center">
                <input
                  name="tableQtyLabel"
                  value={invoice.tableQtyLabel}
                  onChange={handleChange}
                  placeholder="Qty"
                  className={cn(
                    "bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-center placeholder-white/70",
                    pdfMode ? "text-center!" : ""
                  )}
                />
              </div>

              {/* Rate */}
              <div className="col-span-2 text-right px-1">
                <input
                  name="tableRateLabel"
                  value={invoice.tableRateLabel}
                  onChange={handleChange}
                  placeholder="Rate"
                  className={cn(
                    "bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70",
                    pdfMode ? "text-center!" : ""
                  )}
                />
              </div>

              {/* Tax */}
              <div className="col-span-2 text-center">
                <input
                  name="tableTaxLabel"
                  value={invoice.tableTaxLabel}
                  onChange={handleChange}
                  placeholder="Tax %"
                  className={cn(
                    "bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-center placeholder-white/70",
                    pdfMode ? "text-center!" : ""
                  )}
                />
              </div>

              {/* HSN */}
              <div className="col-span-1 text-center px-1">
                <input
                  name="tableHsnLabel"
                  value={invoice.tableHsnLabel}
                  onChange={handleChange}
                  placeholder="HSN"
                  className={cn(
                    "bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-center placeholder-white/70",
                    pdfMode ? "text-center!" : ""
                  )}
                />
              </div>

              {/* Amount */}
              <div className="col-span-2 text-right pl-2">
                <input
                  name="tableAmountLabel"
                  value={invoice.tableAmountLabel}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70"
                />
              </div>
            </div>

            {invoice.items.map((item: any, i: number) => {
              const showRow = !pdfMode || item.description;

              if (!showRow) return null;

              return (
                <div
                  key={i}
                  className="grid grid-cols-13 items-start border-t px-4 py-2 text-sm group"
                >
                  <div className="col-span-5 pr-2">
                    <InlineTextarea
                      rows={2}
                      className={cn("resize-y!", pdfMode ? "resize-none!" : "")}
                      value={item.description}
                      onChange={(e: any) =>
                        handleItemChange(i, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                  </div>

                  <div className="col-span-1 px-1">
                    <InlineInput
                      type="number"
                      value={item.quantity}
                      onChange={(e: any) =>
                        handleItemChange(i, "quantity", Number(e.target.value))
                      }
                      className={cn(
                        "text-right!",
                        pdfMode ? "appearance-none" : ""
                      )}
                    />
                  </div>

                  <div className={cn("col-span-2 px-1")}>
                    <InlineInput
                      type="number"
                      value={item.rate}
                      onChange={(e: any) =>
                        handleItemChange(i, "rate", Number(e.target.value))
                      }
                      className={cn(
                        "text-right!",
                        pdfMode ? "appearance-none" : ""
                      )}
                    />
                  </div>

                  <div className={cn("col-span-2 px-1")}>
                    <InlineInput
                      type="number"
                      value={item.taxRate}
                      onChange={(e: any) =>
                        handleItemChange(i, "taxRate", Number(e.target.value))
                      }
                      className={cn(
                        "text-right!",
                        pdfMode ? "appearance-none" : ""
                      )}
                    />
                  </div>

                  <div className="col-span-1 px-1">
                    <InlineInput
                      value={item.hsn}
                      onChange={(e: any) =>
                        handleItemChange(i, "hsn", e.target.value)
                      }
                      placeholder="HSN"
                      className="text-right"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2 py-1 text-right">
                    <span className="font-medium text-gray-800">
                      {(
                        item.quantity *
                        item.rate *
                        (1 + item.taxRate / 100)
                      ).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeItem(i)}
                      className="w-4 text-red-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={addItem}
            className="print:hidden flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            <Plus className="h-4 w-4" />
            Add Line Item
          </button>
          <div
            className={cn(
              "flex items-end justify-between gap-6",
              pdfMode ? "flex-1" : ""
            )}
          >
            <div className="flex-1 flex min-h-[120px]">
              <div className="flex flex-col gap-3 w-full">
                {(!pdfMode || invoice.termsTitle) && (
                  <InlineInput
                    name="termsTitle"
                    value={invoice.termsTitle}
                    onChange={handleChange}
                    className="font-medium text-gray-800 mb-1"
                    placeholder="Terms & Conditions"
                    emptyHidePrint
                  />
                )}
                {(!pdfMode || invoice.terms) && (
                  <InlineTextarea
                    name="terms"
                    value={invoice.terms}
                    onChange={handleChange}
                    className={cn(
                      "text-sm resize-y! text-gray-600 flex-1 h-full",
                      pdfMode ? "resize-none!" : "min-h-[60px]"
                    )}
                    placeholder="Add terms and conditions..."
                    emptyHidePrint
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {invoice.paymentMethod === "bank" && (
                <div className="ml-auto w-[290px] rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
                  <p className="font-semibold text-gray-800">Bank Details</p>

                  {invoice.bankName && (
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Bank</span>
                      <span className="font-medium text-right">
                        {invoice.bankName}
                      </span>
                    </div>
                  )}

                  {invoice.accountNumber && (
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">A/C No.</span>
                      <span className="font-medium text-right">
                        {invoice.accountNumber}
                      </span>
                    </div>
                  )}

                  {invoice.ifscCode && (
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">IFSC</span>
                      <span className="font-medium text-right">
                        {invoice.ifscCode}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {/* QR */}
              {(!pdfMode || (invoice.includeQrCode && invoice.paymentUpiId)) &&
                invoice.includeQrCode &&
                invoice.paymentUpiId && (
                  <div className="mt-6 flex justify-end">
                    <div className=" rounded-2xl p-4 pb-2 bg-white">
                      {/* Top Row */}
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 font-normal text-sm uppercase w-full text-center">
                          Scan to Pay
                        </p>
                      </div>

                      {/* QR + Button */}
                      <div className="float-right max-w-[150px] flex-col items-center justify-between">
                        <div className="bg-white rounded-lg mb-3">
                          <QRCodeSVG
                            value={`upi://pay?pa=${
                              invoice.paymentUpiId
                            }&pn=${encodeURIComponent(
                              invoice.senderCompany || invoice.senderName
                            )}&am=${totals.total.toFixed(2)}&cu=${
                              selectedCurrency.code
                            }`}
                            size={162}
                            level="H"
                          />
                        </div>
                        <p className="text-gray-500 break-all font-mono text-xs text-center mb-3">
                          {invoice.paymentUpiId}
                        </p>
                        <button
                          ref={tapToPayRef}
                          type="button"
                          onClick={() => {
                            const upiLink = `upi://pay?pa=${encodeURIComponent(
                              invoice.paymentUpiId
                            )}&pn=${encodeURIComponent(
                              invoice.senderCompany || invoice.senderName
                            )}&am=${totals.total.toFixed(
                              2
                            )}&cu=INR&tn=${encodeURIComponent(
                              `Payment of ${
                                invoice.senderCompany || invoice.senderName
                              }`
                            )}`;

                            const isMobile = /Android|iPhone|iPad|iPod/i.test(
                              navigator.userAgent
                            );

                            if (isMobile) {
                              // open UPI app on mobile
                              window.location.href = upiLink;
                            } else {
                              // fallback for desktop
                              alert(
                                "UPI payment links work on mobile devices. Please scan QR or open on your phone."
                              );
                            }
                          }}
                          className="
                          bg-orange-500
                          hover:bg-orange-600
                          text-white
                          text-sm
                          font-medium
                          px-13
                          py-2.5
                          rounded-md
                          cursor-pointer
                          border
                          border-orange-400
                          transition-all
                          duration-300
                          whitespace-nowrap
                          shadow-[6px_6px_12px_rgba(180,120,40,0.25),-6px_-6px_12px_rgba(255,255,255,0.9)]
                          active:shadow-[inset_4px_4px_12px_rgba(180,120,40,0.25),inset_-4px_-4px_12px_rgba(255,255,255,0.8)]
                          active:text-orange-100
  "
                        >
                          Tap to Pay
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              {/* Totals */}
              <div className="ml-auto w-[290px] space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span>
                    {selectedCurrency.symbol}
                    {totals.subTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax Total</span>
                  <span>
                    {selectedCurrency.symbol}
                    {totals.taxTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>
                    {selectedCurrency.symbol}
                    {totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1 border-t justify-self-end border-gray-300">
            <div className="flex items-center justify-center gap-5 mt-2">
              {/* Created By Text */}
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold tracking-[0.18em] text-gray-700 uppercase">
                  Created By
                </span>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-400 " />

              {/* Logo */}
              <div className="flex items-center">
                <img
                  src="/logo_transparent.png"
                  alt="Logo"
                  width={160}
                  height={50}
                  className="h-8  w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
