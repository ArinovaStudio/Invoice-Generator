"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "RESET_PASSWORD" }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp, type: "RESET_PASSWORD" }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden py-12">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-2xl z-10 relative">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo_transparent.png" 
            alt="Arinvoice Logo" 
            className="h-16 w-auto object-contain mb-6 drop-shadow-sm" 
          />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter Code"}
            {step === 3 && "New Password"}
            {step === 4 && "All Set!"}
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium text-center">
            {step === 1 && "Enter your email to receive a reset code."}
            {step === 2 && `We sent a 6-digit code to ${email}`}
            {step === 3 && "Create a secure new password."}
            {step === 4 && "Your password has been successfully updated."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-sm font-semibold text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <button 
              disabled={isLoading}
              className="w-full flex items-center justify-center h-11 bg-[#FF4F33] hover:bg-[#E6472E] text-white font-bold rounded-lg transition-all shadow-md shadow-orange-500/20 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* OTP Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">6-Digit Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm tracking-widest font-mono transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <button 
              disabled={isLoading || otp.length !== 6}
              className="w-full flex items-center justify-center h-11 bg-[#FF4F33] hover:bg-[#E6472E] text-white font-bold rounded-lg transition-all shadow-md shadow-orange-500/20 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Change Email
            </button>
          </form>
        )}

        {/* New Password Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={6}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5 pb-2">
              <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={6}
                  required
                />
              </div>
            </div>
            <button 
              disabled={isLoading}
              className="w-full flex items-center justify-center h-11 bg-[#FF4F33] hover:bg-[#E6472E] text-white font-bold rounded-lg transition-all shadow-md shadow-orange-500/20 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
            </button>
          </form>
        )}

        {/* Success State */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-4 space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <Link 
              href="/login"
              className="w-full flex items-center justify-center h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all shadow-md"
            >
              Return to Login
            </Link>
          </div>
        )}

        {/* Back to Login Link */}
        {step === 1 && (
          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}