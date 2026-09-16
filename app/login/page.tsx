"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "@/components/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans">
      <div className="md:w-5/12 bg-navy text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center space-x-3 mb-16">
            <div className="p-2 bg-rust rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-wide">LABOR CONNECT</span>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-300 mb-12 max-w-md">
            Sign in to manage your jobs, applications, and profile.
          </p>
          <div className="space-y-6">
            {[
              { icon: CheckCircle, title: "Verified Workers", desc: "Skilled, certified pool with reliable ratings." },
              { icon: Briefcase, title: "Efficient Matching", desc: "Location-based search and skill-based hiring." },
              { icon: ShieldCheck, title: "Secure Platform", desc: "Protected transactions and data privacy." },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <item.icon className="h-6 w-6 text-rust flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block mt-16 text-sm text-gray-500">
          © {new Date().getFullYear()} Labor Connect. All rights reserved.
        </div>
      </div>

      <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-background">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-navy dark:text-white mb-2">Sign In</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome back to Labor Connect.</p>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
              Login successful (demo)
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white ${
                    errors.email ? "border-red-500" : "border-gray-300 dark:border-white/10"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white ${
                    errors.password ? "border-red-500" : "border-gray-300 dark:border-white/10"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-rust focus:ring-rust"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-rust hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth>
              Sign In
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-rust font-semibold hover:underline">
                Sign up
              </Link>
            </p>
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
      strokeWidth="2"
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
      strokeWidth="2"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
