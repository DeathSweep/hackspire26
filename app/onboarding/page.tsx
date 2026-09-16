"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Briefcase, MapPin, DollarSign, Loader2 } from "lucide-react";
import Button from "@/components/button";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"worker" | "client" | "">("");
  const [formData, setFormData] = useState({
    fullName: "",
    skills: "",
    experience: "",
    hourlyRate: "",
    companyName: "",
    industry: "",
    location: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Ensure the user is authenticated before allowing onboarding
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      // Load profile and decide if onboarding is still needed
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, role, bio, location, skills, hourly_rate")
        .eq("id", user.id)
        .maybeSingle();

      const isComplete = (() => {
        if (!profile || !profile.full_name) return false;
        if (!Array.isArray(profile.role) || profile.role.length === 0)
          return false;

        const primaryRole = profile.role[0];

        if (primaryRole === "worker") {
          // Worker needs skills (non-empty array) and hourly_rate
          const hasSkills =
            Array.isArray(profile.skills) && profile.skills.length > 0;
          const hasRate =
            profile.hourly_rate !== null && profile.hourly_rate !== undefined;
          return hasSkills && hasRate;
        }

        if (primaryRole === "client") {
          // Client needs at least a location (company/name already covered by full_name)
          return Boolean(profile.location);
        }

        // Unknown role → treat as incomplete
        return false;
      })();

      if (isComplete) {
        router.replace("/dashboard");
        return;
      }

      setCheckingAuth(false);
    };

    checkUser();
  }, [supabase, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !role) return;

    setError(null);
    setLoading(true);

    try {
      // Build the payload that matches the profiles schema
      const skillsArray =
        role === "worker" && formData.skills.trim()
          ? formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : null;

      const hourlyRateNum =
        role === "worker" && formData.hourlyRate
          ? Number(formData.hourlyRate)
          : null;

      // For clients we store company + industry inside bio for now
      // (schema has no dedicated company_name / industry columns)
      let bioValue = formData.bio.trim() || null;
      if (role === "client") {
        const parts = [
          formData.companyName && `Company: ${formData.companyName}`,
          formData.industry && `Industry: ${formData.industry}`,
          formData.bio && formData.bio,
        ].filter(Boolean);
        bioValue = parts.length ? parts.join("\n") : null;
      }

      const payload = {
        id: userId,
        full_name:
          role === "worker"
            ? formData.fullName.trim() || null
            : formData.companyName.trim() || null,
        role: [role],
        bio: bioValue,
        location: formData.location.trim() || null,
        skills: skillsArray,
        hourly_rate:
          hourlyRateNum !== null && !Number.isNaN(hourlyRateNum)
            ? hourlyRateNum
            : null,
        updated_at: new Date().toISOString(),
      };

      // Upsert so it works whether a row was created by a trigger or not
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (upsertError) {
        console.error("Profile upsert error:", upsertError);
        throw new Error(
          upsertError.message.includes("permission") ||
            upsertError.code === "42501"
            ? "You don't have permission to update your profile. Check RLS policies on the profiles table."
            : `Could not save profile: ${upsertError.message}`
        );
      }

      router.push("/dashboard");
      router.refresh();
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

  const next = () => {
    if (!role) return;
    // Basic validation before advancing
    if (role === "worker") {
      if (
        !formData.fullName.trim() ||
        !formData.skills.trim() ||
        !formData.experience.trim() ||
        !formData.hourlyRate.trim()
      ) {
        setError("Please fill in all required worker fields.");
        return;
      }
    }
    if (role === "client") {
      if (
        !formData.companyName.trim() ||
        !formData.industry.trim() ||
        !formData.location.trim()
      ) {
        setError("Please fill in all required client fields.");
        return;
      }
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const back = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rust" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <nav className="sticky top-0 z-50 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-navy dark:text-white">
              Complete Your Profile
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {step} of 2
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
            <div
              className="bg-rust h-2 rounded-full transition-all"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

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
                  <User
                    className={`h-8 w-8 mb-2 ${
                      role === "worker" ? "text-rust" : "text-gray-400"
                    }`}
                  />
                  <span className="font-semibold text-sm text-navy dark:text-white">
                    Worker
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Looking for jobs
                  </span>
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
                  <Briefcase
                    className={`h-8 w-8 mb-2 ${
                      role === "client" ? "text-rust" : "text-gray-400"
                    }`}
                  />
                  <span className="font-semibold text-sm text-navy dark:text-white">
                    Client
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Hiring workers
                  </span>
                </button>
              </div>

              {role === "worker" && (
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Full Name
                    </label>
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
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Skills (comma separated)
                    </label>
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
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Experience (years)
                    </label>
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
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Hourly Rate (INR)
                    </label>
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
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Company Name
                    </label>
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
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Industry
                    </label>
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
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Location
                    </label>
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
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="Tell us about yourself, your experience, and the kind of work you're looking for..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === "client" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                      Company Description
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                      placeholder="Tell us about your company and the kind of workers you typically hire..."
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={back}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    "Save & Continue"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
