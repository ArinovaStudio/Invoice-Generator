"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { City, Country, State } from "country-state-city";
import { Plus, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { RefObject, useEffect, useRef, useState } from "react";
import validator from "validator";
import { InlineInput, InlineTextarea } from "./InlineComponents";
import { handleKeyDown } from "@/lib/InputKeyDown";

interface Props {
  invoiceRef: RefObject<HTMLDivElement | null>;
  tapToPayRef: RefObject<HTMLButtonElement | null>;
  invoice: any;
  setInvoice: any;
  isLoggedIn: boolean;
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
  clients: any[];
  selectedCurrency: {
    symbol: string;
    code: string;
  };
  handleClientSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
  clients,
  isLoggedIn,
  handleClientSelect,
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
  
  // const clientRef = useRef(null)
  // const senderRef = useRef(null)

const resizeTextarea = (el: HTMLTextAreaElement | null) => {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
};

useEffect(() => {
  const textareas = document.querySelectorAll(
    ".auto-resize"
  ) as NodeListOf<HTMLTextAreaElement>;

  textareas.forEach((el) => resizeTextarea(el));
}, [invoice?.senderAddress, invoice?.clientAddress, ]);


  return (
    <div className="flex-2 w-full lg:max-w-3xl">
      <Card
        className={cn(
          `rounded-xl border bg-white px-10 shadow-lg`,
          pdfMode ? "" : "py-5"
        )}
      >
        <CardContent
          className={cn(
            "flex flex-col space-y-4 p-0",
            pdfMode ? "min-h-[1000px]! bg-white" : ""
          )}
          ref={invoiceRef}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="w-1/2 space-y-1 text-[13px] text-gray-800">
              <label className="mb-3 flex h-18 w-28 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-gray-300 transition-colors hover:bg-gray-50">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] text-gray-400">
                    {!pdfMode ? "Upload Logo" : "No Logo"}
                  </span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>

              {(!pdfMode || invoice.senderCompany) && (
                <InlineInput
                  name="senderCompany"
                  value={invoice.senderCompany}
                  onChange={handleChange}
                  placeholder="Your Company"
                  className="text-sm font-semibold"
                />
              )}

              {(!pdfMode || invoice.senderName) && (
                <InlineInput
                  name="senderName"
                  placeholder="Your Name"
                  value={invoice.senderName}
                  onChange={handleChange}
                  className="text-sm"
                />
              )}

              {(!pdfMode || invoice.senderGSTIN) && (
                <div className="flex justify-start items-center gap-2">
                  <p>GST IN</p>
                  <InlineInput
                    name="senderGSTIN"
                    placeholder="Company's GSTIN"
                    value={invoice.senderGSTIN}
                    onChange={handleChange}
                    className="text-sm w-2/3"
                  />
                </div>
              )}

              {(!pdfMode || invoice.senderAddress) && (
                <InlineTextarea
                  name="senderAddress"
                  placeholder="Company's Address"
                  value={invoice.senderAddress}
                  onChange={(e: any) => {
                    handleChange(e), resizeTextarea(e.target);
                  }}
                  className="text-sm auto-resize"
                />
              )}

              {/* Country */}
              {(!pdfMode || invoice.senderCountry) &&
                (pdfMode ? (
                  <div className="px-1 text-gray-700 text-[12px]">India</div>
                ) : (
                  <select
                    name="senderCountry"
                    value="IN"
                    onChange={handleChange}
                    className="w-full bg-transparent rounded px-1 text-sm text-gray-700"
                  >
                    <option value="IN">India</option>
                  </select>
                ))}

              {/* State */}
              {(!pdfMode || invoice.senderState) &&
                (pdfMode ? (
                  <div className="px-1 text-gray-700 text-[12px]">
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
                    className="w-full rounded bg-transparent px-1 text-sm text-gray-700 disabled:opacity-50"
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

              {/* City */}
              {(!pdfMode || invoice.senderCity) &&
                (pdfMode ? (
                  <div className="px-1 text-gray-700 text-sm">
                    {invoice.senderCity}
                  </div>
                ) : (
                  <select
                    name="senderCity"
                    value={invoice.senderCity}
                    onChange={handleChange}
                    disabled={!invoice.senderState}
                    className="w-full rounded bg-transparent px-1 text-sm text-gray-700 disabled:opacity-50"
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

              {/* ZIP */}
              {(!pdfMode || invoice.senderZip) && (
                <div>
                  <InlineInput
                    name="senderZip"
                    placeholder="ZIP / Postal Code"
                    value={invoice.senderZip?.slice(0, 6)}
                    onChange={handleChange}
                    onKeyDownCapture={handleKeyDown}
                    className={cn(
                      "text-sm",
                      senderZipError && "border border-red-400"
                    )}
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
                        setSenderZipError(
                          isValid ? "" : "Invalid ZIP / Postal Code"
                        );
                      } catch {
                        setSenderZipError("Invalid ZIP / Postal Code");
                      }
                    }}
                  />

                  {senderZipError && (
                    <p className="text-[11px] text-red-500 mt-1">
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
          <div className="mt-3 flex justify-between text-[13px] gap-4">
            <div className="w-1/2 space-y-1 pr-3">
              {/* <p className="mb-1 font-semibold text-gray-800 text-sm">
                  Bill To:
                </p> */}

              {/* Client Selector */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between">
                  <p className="mb-1 font-semibold text-gray-800 text-sm">
                    Bill To:
                  </p>
                </div>
                {!pdfMode && isLoggedIn && clients.length > 0 && (
                  <select
                    value={invoice.clientId ?? ""}
                    onChange={handleClientSelect}
                    className="text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="">-- Select saved client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {(!pdfMode || invoice.clientCompany) && (
                <InlineInput
                  name="clientCompany"
                  value={invoice.clientCompany}
                  onChange={handleChange}
                  placeholder="Client Company"
                  className="font-medium text-sm"
                />
              )}

              {(!pdfMode || invoice.clientName) && (
                <InlineInput
                  name="clientName"
                  value={invoice.clientName}
                  onChange={handleChange}
                  placeholder="Client Name"
                  className="text-sm"
                />
              )}

              {(!pdfMode || invoice.clientAddress) && (
                <InlineTextarea
                  name="clientAddress"
                  value={invoice.clientAddress}
                  onChange={(e: any) => {
                    handleChange(e), resizeTextarea(e.target);
                  }}
                  placeholder="Client Address"
                  className="text-sm resize-none auto-resize"
                />
              )}

              {(!pdfMode || invoice.clientGSTIN) && (
                <div className="flex justify-start items-center gap-1">
                  <p>GST IN</p>
                  <InlineInput
                    name="clientGSTIN"
                    value={invoice.clientGSTIN || ""}
                    onChange={handleChange}
                    placeholder="Client GSTIN"
                    className="text-sm w-2/3 font-semibold"
                  />
                </div>
              )}

              {/* Country */}
              {(!pdfMode || invoice.clientCountry) &&
                (pdfMode ? (
                  <div className="px-1 text-gray-700 text-[12px]">India</div>
                ) : (
                  <select
                    name="clientCountry"
                    value="IN"
                    onChange={handleChange}
                    className="text-sm w-full bg-transparent px-1 text-gray-700"
                  >
                    <option value="IN">India</option>
                  </select>
                ))}

              {/* State */}
              {(!pdfMode || invoice.clientState) &&
                (pdfMode ? (
                  <div className="px-1 text-gray-700 text-sm">
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
                    className="text-sm w-full bg-transparent px-1 text-gray-700 disabled:opacity-50"
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

              {/* City */}
              {(!pdfMode || invoice.clientCity) &&
                (pdfMode ? (
                  <div className="px-1 text-gray-700 text-[12px]">
                    {invoice.clientCity}
                  </div>
                ) : (
                  <select
                    name="clientCity"
                    value={invoice.clientCity}
                    onChange={handleChange}
                    disabled={!invoice.clientState}
                    className="text-sm w-full bg-transparent px-1 text-gray-700 disabled:opacity-50"
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

              {/* ZIP */}
              {(!pdfMode || invoice.clientZip) && (
                <div>
                  <InlineInput
                    name="clientZip"
                    value={invoice.clientZip?.slice(0, 6)}
                    onKeyDownCapture={handleKeyDown}
                    onChange={handleChange}
                    placeholder="ZIP / Postal Code"
                    className={cn(
                      "text-sm",
                      clientZipError && "border border-red-400"
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
                    <p className="mt-1 text-[11px] text-red-500">
                      {clientZipError}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right side (Invoice details) */}
            <div className="w-[200px] space-y-1 text-right text-[13px]">
              {(!pdfMode || invoice.invoiceNumber) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Invoice#</span>
                  <InlineInput
                    name="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={handleChange}
                    className="w-24 text-right text-sm"
                  />
                </div>
              )}

              {(!pdfMode || invoice.issueDate) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date</span>
                  <InlineInput
                    type="date"
                    name="issueDate"
                    value={invoice.issueDate}
                    onChange={handleChange}
                    className="w-28 text-right text-sm"
                  />
                </div>
              )}

              {(!pdfMode || invoice.dueDate) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Due Date</span>
                  <InlineInput
                    type="date"
                    name="dueDate"
                    value={invoice.dueDate}
                    onChange={handleChange}
                    className="w-28 text-right text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {(!pdfMode || invoice.clientState) && (
            <div className="flex items-center gap-2 max-w-sm">
              <p className="text-[11px] whitespace-nowrap font-medium uppercase tracking-wide text-gray-500">
                Place of Supply
              </p>

              {pdfMode ? (
                <div className="w-full px-1 text-gray-700 text-[12px]">
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
                    "w-full text-[12px] rounded bg-transparent px-1 py-0 text-gray-700",
                    "hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50"
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
              <div className="col-span-4 pr-2">
                <input
                  name="tableDescLabel"
                  value={invoice.tableDescLabel}
                  onChange={handleChange}
                  placeholder="Item Description"
                  className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full placeholder-white/70 text-sm"
                />
              </div>

              {/* Qty */}
              <div className="col-span-1 text-right">
                <input
                  name="tableQtyLabel"
                  value={invoice.tableQtyLabel}
                  onChange={handleChange}
                  placeholder="Qty"
                  className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70 text-sm"
                />
              </div>

              {/* Rate */}
              <div className="col-span-2 text-right px-1">
                <input
                  name="tableRateLabel"
                  value={invoice.tableRateLabel}
                  onChange={handleChange}
                  placeholder="Rate"
                  className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70 text-sm"
                />
              </div>

              {/* Tax */}
              <div className="col-span-2 text-right">
                <input
                  name="tableTaxLabel"
                  value={invoice.tableTaxLabel}
                  onChange={handleChange}
                  placeholder="Tax %"
                  className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70 text-sm"
                />
              </div>

              {/* HSN */}
              <div className="col-span-2 text-right px-1">
                <input
                  name="tableHsnLabel"
                  value={invoice.tableHsnLabel}
                  onChange={handleChange}
                  placeholder="HSN"
                  className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70 text-sm"
                />
              </div>

              {/* Amount */}
              <div className="col-span-2 text-right pl-2">
                <input
                  name="tableAmountLabel"
                  value={invoice.tableAmountLabel}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70 text-sm"
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
                  <div className="col-span-4 pr-2">
                    <InlineTextarea
                      rows={2}
                      className={cn(
                        "resize-y!",
                        pdfMode ? "resize-none!" : "",
                        "text-sm leading-snug auto-resize"
                      )}
                      value={item.description}
                      onChange={(e: any) => {
                        handleItemChange(i, "description", e.target.value);
                        resizeTextarea(e.target);
                      }}
                      placeholder="Description"
                    />
                  </div>

                  <div className="col-span-1 px-1">
                    <InlineInput
                      type="text"
                      onKeyDownCapture={handleKeyDown}
                      value={item.quantity}
                      onChange={(e: any) =>
                        handleItemChange(i, "quantity", Number(e.target.value))
                      }
                      className={cn(
                        "text-right! text-sm",
                        pdfMode ? "appearance-none resize-none" : ""
                      )}
                    />
                  </div>

                  <div className="col-span-2 px-1">
                    <InlineInput
                      type="text"
                      onKeyDownCapture={handleKeyDown}
                      value={item.rate}
                      onChange={(e: any) =>
                        handleItemChange(i, "rate", Number(e.target.value))
                      }
                      className={cn(
                        "text-right! text-sm",
                        pdfMode ? "appearance-none" : ""
                      )}
                    />
                  </div>

                  <div className="col-span-2 px-1">
                    <InlineInput
                      type="text"
                      onKeyDownCapture={handleKeyDown}
                      value={item.taxRate}
                      onChange={(e: any) =>
                        handleItemChange(i, "taxRate", Number(e.target.value))
                      }
                      className={cn(
                        "text-right! text-sm",
                        pdfMode ? "appearance-none" : ""
                      )}
                    />
                  </div>

                  <div className="col-span-2 px-1">
                    <InlineInput
                      value={item.hsn?.slice(0, 8)}
                      onChange={(e: any) =>
                        handleItemChange(i, "hsn", e.target.value)
                      }
                      placeholder="HSN"
                      className="text-right text-sm"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2 py-1 text-right text-sm">
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

          {!pdfMode && (
            <button
              onClick={addItem}
              className="print:hidden flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
            >
              <Plus className="h-4 w-4" />
              Add Line Item
            </button>
          )}
          <div
            className={cn(
              "flex items-end justify-between gap-6",
              pdfMode ? "flex-1" : ""
            )}
          >
            <div className="flex-1 flex min-h-[100px]">
              <div className="flex flex-col gap-2 w-full">
                {(!pdfMode || invoice.termsTitle) && (
                  <InlineInput
                    name="termsTitle"
                    value={invoice.termsTitle}
                    onChange={handleChange}
                    className="font-medium text-gray-800 text-sm mb-1"
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
                      "text-[13px] text-gray-600 resize-y!",
                      pdfMode ? "resize-none! min-h-[50px]" : "min-h-[60px]"
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
                      <span className="font-medium text-right break-all">
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
              {invoice.paymentUpiId && invoice.paymentMethod === "upi" && (
                <div className="mt-3 flex items-end justify-end">
                  <div className=" rounded-2xl pb-2 bg-white">
                    {/* Top Row */}
                    <div className="flex items-end justify-between">
                      <p className="text-gray-400 font-bold text-[11px] uppercase w-full text-center">
                        Scan to Pay
                      </p>
                    </div>

                    {/* QR + Button */}
                    <div className="float-right max-w-[200px] flex flex-col items-center gap-2">
                      <div className="bg-white p-1 rounded-md">
                        <QRCodeSVG
                          value={`upi://pay?pa=${invoice.paymentUpiId}&pn=${invoice.senderCompany}&am=${totals.total}&cu=${selectedCurrency.code}&tn=Payment of ${invoice.senderCompany}`}
                          size={160}
                          level="H"
                        />
                      </div>

                      <p className="text-gray-500 break-all font-mono text-[0.55rem] text-center leading-tight">
                        {invoice.paymentUpiId}
                      </p>

                      <button
                        ref={tapToPayRef}
                        type="button"
                        onClick={() => {
                          const base = process.env.NEXT_PUBLIC_URL;

                          const url = `${base}/pay?pa=${encodeURIComponent(
                            invoice.paymentUpiId
                          )}&pn=${encodeURIComponent(
                            invoice.senderCompany
                          )}&am=${encodeURIComponent(
                            totals.total
                          )}&tn=${encodeURIComponent(
                            `Payment of ${invoice.senderCompany}`
                          )}`;

                          window.location.href = url;
                        }}
                        className="
      bg-orange-500
      text-white
      rounded-lg
      text-xs
      font-medium
      px-3
      py-1.5
      rounded-full
      mt-2
      border
      border-orange-400
      whitespace-nowrap
      w-full!
    "
                      >
                        Tap to Pay
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Totals */}
              <div className="ml-auto w-[260px] space-y-2 text-[13px]">
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

                <div className="flex justify-between border-t pt-2 text-sm font-bold">
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
