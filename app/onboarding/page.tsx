"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, User, Briefcase, MapPin, DollarSign, Star } from "lucide-react";
import Button from "@/components/button";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    skills: "",
    experience: "",
    hourlyRate: "",
    companyName: "",
    industry: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-background font-sans">
      <nav className="sticky top-0 z-50 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-rust rounded-lg">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-wide">
                <span className="text-rust">LABOR</span> CONNECT
              </span>
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Skip for now
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-navy dark:text-white">Complete Your Profile</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 2</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
            <div
              className="bg-rust h-2 rounded-full transition-all"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-4">
                Choose your role
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("worker")}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 ${
                    role === "worker"
                      ? "border-rust bg-rust/10"
                      : "border-gray-200 dark:border-white/10 hover:border-rust/50"
                  }`}
                >
                  <User className={`h-8 w-8 mb-2 ${role === "worker" ? "text-rust" : "text-gray-400"}`} />
                  <span className="font-semibold text-sm text-navy dark:text-white">Worker</span>
                  <span className="text-xs text-gray-400 mt-1">Looking for jobs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 ${
                    role === "client"
                      ? "border-rust bg-rust/10"
                      : "border-gray-200 dark:border-white/10 hover:border-rust/50"
                  }`}
                >
                  <Briefcase className={`h-8 w-8 mb-2 ${role === "client" ? "text-rust" : "text-gray-400"}`} />
                  <span className="font-semibold text-sm text-navy dark:text-white">Client</span>
                  <span className="text-xs text-gray-400 mt-1">Hiring workers</span>
                </button>
              </div>

              {role === "worker" && (
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="Carpentry, Plumbing, Painting"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">Experience (years)</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">Hourly Rate (INR)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                        placeholder="500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === "client" && (
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="Construction"
                    />
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
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="button" onClick={next} disabled={!role}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-4">
                Additional Details
              </h2>

              {role === "worker" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">Bio</label>
                    <textarea
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              )}

              {role === "client" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">Company Description</label>
                    <textarea
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="Tell us about your company..."
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button type="button" variant="secondary" onClick={back}>
                  Back
                </Button>
                <Button type="submit">Save & Continue</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
