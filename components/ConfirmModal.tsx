"use client";

import { useState, useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
  requireInput?: string; 
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  isDanger = false,
  requireInput,
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) setInputValue("");
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmDisabled = requireInput ? inputValue !== requireInput : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8">
          <h3 className={`text-xl font-bold mb-2 ${isDanger ? "text-red-600" : "text-slate-900"}`}>
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            {message}
          </p>

          {requireInput && (
            <div className="mb-6">
              <label className="text-[12px] uppercase tracking-wider font-bold text-slate-500 mb-2 block">
                Type <span className="text-slate-900 select-none">"{requireInput}"</span> to confirm
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all outline-none font-bold text-slate-900"
                placeholder={requireInput}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              disabled={isConfirmDisabled}
              className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}