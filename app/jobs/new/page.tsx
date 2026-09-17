"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, MapPin, DollarSign, Calendar, X } from "lucide-react";
import Button from "@/components/button";
import { createClient } from "@/lib/supabase/client"; // adjust path if needed

export default function NewJobPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    budget: "",
    description: "",
    deadline: "",
    skillsInput: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const skill = formData.skillsInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setFormData({ ...formData, skillsInput: "" });
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Job title is required");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("You must be logged in to post a job");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("jobs").insert({
        client_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        budget: formData.budget ? Number(formData.budget) : null,
        location: formData.location.trim() || null,
        skills: skills.length > 0 ? skills : null,
        status: "open",
        deadline: formData.deadline || null,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      router.push("/jobs");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">
          Post a New Job
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Fill in the details below to create a new job listing.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                placeholder="e.g. Office Assistant"
              />
            </div>

            {/* Location */}
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
                  placeholder="e.g. Kochi, Kerala"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                Budget
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                  placeholder="e.g. 35000"
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                Deadline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.skillsInput}
                  onChange={(e) =>
                    setFormData({ ...formData, skillsInput: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                  placeholder="Add a skill and press Enter"
                />
                <Button type="button" onClick={addSkill} variant="secondary">
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 bg-rust/10 text-rust text-xs px-3 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-rust/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                placeholder="Describe the job responsibilities, requirements, etc."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/jobs">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Job"}
            </Button>
          </div>
        </form>
      </div>
  );
}