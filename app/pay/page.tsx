"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LucideCopy } from "lucide-react";
import { toast } from "sonner";

export default function PayPage() {
  const params = useSearchParams();

  const pa = params.get("pa") || "";
  const pn = params.get("pn") || "";
  const am = params.get("am") || "";
  const cu = params.get("cu") || "INR";

  const [showFallback, setShowFallback] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const upiLink = `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=Payment of ${pn}`;

  useEffect(() => {
    const ua = navigator.userAgent;

    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isDesktopDevice = !isAndroid && !isIOS;

    setIsDesktop(isDesktopDevice);

    if (isDesktopDevice) {
      setShowFallback(true);
      return;
    }

    // 🚀 Attempt redirect
    if (isAndroid) {
      const intentUrl = `intent://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}#Intent;scheme=upi;end`;

      window.location.href = intentUrl;

      setTimeout(() => {
        window.location.href = upiLink;
        setShowFallback(true);
      }, 1500);
    }

    if (isIOS) {
      window.location.href = upiLink;

      setTimeout(() => {
        setShowFallback(true);
      }, 2000);
    }
  }, []);

  const copyUpi = async () => {
    await navigator.clipboard.writeText(pa);
    toast.success("UPI ID Copied Successfully")
  };

  return (
    <>
      <div className="sm:min-h-[80vh] min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
        <Navbar />
        <div className="w-full max-w-md rounded-2xl shadow-xl border border-emerald-100 bg-white p-6 text-center space-y-5">
          {/* Header */}
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Complete Payment
            </h1>
            <p className="text-sm text-gray-500">Paying to {pn}</p>
          </div>

          {/* Loader / redirect message */}
          {!showFallback && !isDesktop && (
            <div className="space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500">Opening your UPI app...</p>
            </div>
          )}

          {/* Desktop OR fallback UI */}
          {(showFallback || isDesktop) && (
            <>
              {/* QR Section */}
              <div className="flex justify-center">
                <div className="p-3 bg-white border border-emerald-200 shadow-inner">
                  <QRCodeSVG value={upiLink} size={200} level="H" />
                </div>
              </div>

              {/* UPI ID */}
              <div className="space-y-0.5">
                <p className="text-xs text-gray-400">UPI ID</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-normal text-sm text-gray-800">{pa}</span>
                  <button
                    onClick={copyUpi}
                    className="text-xs px-2 py-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                  >
                    <LucideCopy size={14}/>
                  </button>
                </div>
              </div>
              <div className="">
                <p className="text-xs text-gray-400">Amount</p>
              <div className="text-lg font-semibold text-emerald-600">
                Rs. {am}/-
              </div>
              </div>

              {/* Mobile fallback CTA */}
              {!isDesktop && (

              <div className="btn-wrapper">
                <button onClick={() => (window.location.href = upiLink)} className="btn">
                  <span className="btn-txt">Tap To Pay</span>
                  <div className="dot pulse"></div>
                </button>
              </div>
            )}

              {/* Instruction */}
              <p className="text-xs text-gray-400">
                Scan QR using any UPI app like Google Pay, PhonePe or Paytm
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
