"use client";

import { Bookmark, Share2, MapPin, DollarSign, Calendar, Tag } from "lucide-react";
import { Job } from "./job-card";

interface JobDetailProps {
  job: Job;
  onApply?: () => void;
}

function formatBudget(budget: number | null) {
  if (budget == null) return "Not specified";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(budget);
}

function formatStatus(status: Job["status"]) {
  if (!status) return "Open";
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JobDetail({ job, onApply }: JobDetailProps) {
  const skills = job.skills ?? [];

  return (
    <div className="bg-white dark:bg-navy/50 border border-gray-200 dark:border-white/10 rounded-xl p-6 min-h-[500px]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy dark:text-white">
            {job.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {job.location || "Location not specified"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatBudget(job.budget)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onApply}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-rust text-white text-sm font-semibold hover:bg-rust/90 transition"
        >
          Submit Bid
        </button>
        <button
          aria-label="Bookmark job"
          className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <Bookmark className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <button
          aria-label="Share job"
          className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 mt-6 pt-6">
        <h3 className="text-lg font-semibold text-navy dark:text-white mb-4">
          Job details
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">
                Budget
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatBudget(job.budget)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">
                Status
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatStatus(job.status)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">
                Location
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {job.location || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">
                Deadline
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(job.deadline)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">
                Posted
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(job.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 mt-6 pt-6">
        <h3 className="text-lg font-semibold text-navy dark:text-white mb-3">
          Full job description
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {job.description || "No description provided."}
        </p>
      </div>

      {skills.length > 0 && (
        <div className="border-t border-gray-200 dark:border-white/10 mt-6 pt-6">
          <h3 className="text-lg font-semibold text-navy dark:text-white mb-3">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
