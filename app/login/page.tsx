"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Button from "@/components/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      // 1. Authenticate against Supabase Auth (auth.users)
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        // Common friendly messages
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        }
        if (signInError.message.includes("Email not confirmed")) {
          throw new Error(
            "Please confirm your email before signing in. Check your inbox for the confirmation link."
          );
        }
        throw signInError;
      }

      if (!authData.user) {
        throw new Error("Authentication failed. Please try again.");
      }

      // 2. Verify the user has a matching profile row (profiles.id = auth.users.id)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, role, location, avatar_url")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        // Profile should be created by a trigger on signup.
        // If missing, sign the user out and surface a clear error.
        await supabase.auth.signOut();
        throw new Error(
          "Your account exists but the profile is missing. Please contact support or try signing up again."
        );
      }

      // Optional: respect "Remember me" by adjusting session persistence.
      // Supabase browser client already persists the session in localStorage by default.
      // If rememberMe is false you could call signOut on tab close, but that is usually
      // handled at the app level. We keep the default secure session here.

      setSubmitted(true);

      // Redirect after a short delay so the success message is visible
      setTimeout(() => {
        // Route based on role if you want (e.g. workers → /dashboard/worker)
        const primaryRole = Array.isArray(profile.role)
          ? profile.role[0]
          : profile.role;
        if (primaryRole === "worker") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-[#0B1120] font-sans selection:bg-rust/30 selection:text-rust">
      {/* Left Panel - Branding & Features */}
      <div className="md:w-5/12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden shadow-2xl z-10">
        
        {/* Decorative background blurs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[50%] rounded-full bg-rust/20 blur-[120px]" />
          <div className="absolute top-[60%] -right-[20%] w-[80%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <Link href="/" className="flex items-center space-x-3 mb-16 group w-fit">
            <div className="p-2.5 bg-gradient-to-br from-rust to-orange-600 rounded-xl shadow-lg shadow-rust/20 group-hover:shadow-rust/40 transition-all duration-300">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              LABOR CONNECT
            </span>
          </Link>
          
          <div className="mt-auto mb-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white drop-shadow-sm">
              Welcome Back
            </h1>
            <p className="text-lg text-blue-100/80 mb-12 max-w-md font-light leading-relaxed">
              Sign in to manage your jobs, applications, and professional profile with ease.
            </p>
            
            <div className="space-y-8">
              {[
                {
                  icon: CheckCircle,
                  title: "Verified Workers",
                  desc: "Skilled, certified pool with reliable ratings.",
                },
                {
                  icon: Briefcase,
                  title: "Efficient Matching",
                  desc: "Location-based search and skill-based hiring.",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Platform",
                  desc: "Protected transactions and data privacy.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-5 group">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors duration-300">
                    <item.icon className="h-6 w-6 text-rust flex-shrink-0" />
                  </div>
                  <div className="mt-1">
                    <h3 className="text-base font-semibold text-white tracking-wide">{item.title}</h3>
                    <p className="text-sm text-blue-100/60 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
        <div className="max-w-md w-full mx-auto relative z-10">
          
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Sign In
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Welcome back to Labor Connect. Let's get to work.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-800 dark:text-red-200 flex items-center shadow-sm">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-center shadow-sm">
              <span className="block sm:inline font-medium">Login successful! Redirecting…</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900/50 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:border dark:border-slate-800">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors duration-200 ${errors.email ? "text-red-400" : "text-slate-400 group-focus-within:text-rust"}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={`block w-full pl-11 pr-4 py-3.5 border rounded-xl text-sm transition-all duration-200 outline-none shadow-sm
                    bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white
                    focus:bg-white dark:focus:bg-slate-900
                    ${
                    errors.email
                      ? "border-red-400 focus:ring-4 focus:ring-red-400/20"
                      : "border-slate-200 dark:border-slate-800 focus:border-rust focus:ring-4 focus:ring-rust/20 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 font-medium pl-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors duration-200 ${errors.password ? "text-red-400" : "text-slate-400 group-focus-within:text-rust"}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={`block w-full pl-11 pr-12 py-3.5 border rounded-xl text-sm transition-all duration-200 outline-none shadow-sm
                    bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white
                    focus:bg-white dark:focus:bg-slate-900
                    ${
                    errors.password
                      ? "border-red-400 focus:ring-4 focus:ring-red-400/20"
                      : "border-slate-200 dark:border-slate-800 focus:border-rust focus:ring-4 focus:ring-rust/20 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 font-medium pl-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 checked:border-rust checked:bg-rust transition-all"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                  Remember me
                </span>
              </label>
              <Link href="#" className="text-sm font-medium text-rust hover:text-orange-600 transition-colors hover:underline underline-offset-4">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" fullWidth disabled={loading} className="py-4 rounded-xl font-bold shadow-lg shadow-rust/20 hover:shadow-rust/30 transition-all">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>

            <div className="pt-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-rust font-bold hover:text-orange-600 transition-colors hover:underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}