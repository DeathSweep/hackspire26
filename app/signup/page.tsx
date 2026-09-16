"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, User, Mail, Lock, Eye, EyeOff, Briefcase, HardHat, MapPin, CheckCircle, ShieldCheck } from "lucide-react";
import Button from "@/components/button";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    location: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields");
      return;
    }
    setError("");
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
            Connecting Labor & Hiring Opportunities
          </h1>
          <p className="text-lg text-gray-300 mb-12 max-w-md">
            A platform built for reliability, efficiency, and finding the perfect match for your next project.
          </p>
          <div className="space-y-8">
              { [
                { icon: CheckCircle, title: "Verified Workers", desc: "Skilled, certified pool with reliable performance ratings." },
                { icon: Briefcase, title: "Efficient Job Matching", desc: "Quick job postings, location-based search, and skill-based hiring." },
                { icon: ShieldCheck, title: "Secure Payments", desc: "Integrated billing system with escrow protection and transparency." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <item.icon className="h-7 w-7 text-rust flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
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

      <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-background">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-navy dark:text-white mb-2">Create an Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Join the network of top professionals and clients.</p>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
              Account created successfully! Redirecting...
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy dark:text-white">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "worker" })}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${
                    formData.role === "worker"
                      ? "border-rust bg-rust/10 text-navy dark:text-white"
                      : "border-gray-200 dark:border-white/10 hover:border-rust/50 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <HardHat className={`h-8 w-8 mb-2 ${formData.role === "worker" ? "text-rust" : "text-gray-400"}`} />
                  <span className="font-semibold text-sm">Find Work</span>
                  <span className="text-xs text-gray-400 mt-1">I am a skilled worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "client" })}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${
                    formData.role === "client"
                      ? "border-rust bg-rust/10 text-navy dark:text-white"
                      : "border-gray-200 dark:border-white/10 hover:border-rust/50 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Briefcase className={`h-8 w-8 mb-2 ${formData.role === "client" ? "text-rust" : "text-gray-400"}`} />
                  <span className="font-semibold text-sm">Hire Workers</span>
                  <span className="text-xs text-gray-400 mt-1">I am a client</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-navy dark:text-white mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-white mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-white mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-white mb-1">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                    placeholder="City, State or Zip Code"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth>
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-rust font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}


