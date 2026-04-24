"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      router.push("/user");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/user" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Log in to manage your invoices</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="name@company.com"
                className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                required
              />
            </div>
          </div>

          <button 
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center h-11 bg-[#FF4F33] hover:bg-[#E6472E] text-white font-bold rounded-lg transition-all shadow-md shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
          </button>
        </form>

        <div className="mt-8 mb-6 flex items-center justify-center space-x-4">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
          className="w-full flex items-center justify-center h-11 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </>
          )}
        </button>
        
        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-xs font-bold tracking-widest uppercase text-slate-400">
        By Arinova Studio
      </div>
    </div>
  );
}