"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, MapPin, DollarSign, Briefcase, X } from "lucide-react";
import Button from "@/components/button";
import { JobsProvider, useJobs } from "@/context/jobs-context";

function NewJobForm() {
  const router = useRouter();
  const { addJob } = useJobs();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    pay: "",
    type: "Full-time",
    description: "",
    skillsInput: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.location || !formData.pay) {
      setError("Please fill in all required fields");
      return;
    }
    addJob({
      title: formData.title,
      company: formData.company,
      location: formData.location,
      pay: formData.pay,
      type: formData.type,
      description: formData.description || "No description provided.",
      skills,
      easilyApply: true,
      postedAt: new Date().toISOString(),
    });
    router.push("/jobs");
  };

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
            <Link href="/jobs" className="text-sm text-gray-300 hover:text-white transition-colors">
              Cancel
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">Post a New Job</h1>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Job Title *</label>
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

            <div>
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                placeholder="e.g. Sunrise Hospital"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Location *</label>
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
                  placeholder="e.g. Kochi, Kerala"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Pay Range *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="pay"
                  value={formData.pay}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                  placeholder="e.g. ₹30,000 - ₹50,000 a month"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Job Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-rust focus:border-rust outline-none bg-white dark:bg-navy/50 text-gray-900 dark:text-white"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Skills</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.skillsInput}
                  onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy dark:text-white mb-1">Description</label>
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
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit">Publish Job</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewJobPage() {
  return (
    <JobsProvider>
      <NewJobForm />
    </JobsProvider>
  );
}
