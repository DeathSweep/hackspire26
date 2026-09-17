"use client";

import { Bookmark } from "lucide-react";

export interface Job {
  id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  budget: number | null;
  location: string | null;
  skills: string[] | null;
  status: "open" | "in_progress" | "completed" | "closed" | null;
  deadline: string | null; // date
  created_at: string | null;
  updated_at: string | null;
}

interface JobCardProps {
  job: Job;
  selected?: boolean;
  onSelect?: () => void;
  onBookmark?: () => void;
  bookmarked?: boolean;
}

function formatBudget(budget: number | null) {
  if (budget == null) return "Budget not set";
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

export default function JobCard({
  job,
  selected = false,
  onSelect,
  onBookmark,
  bookmarked = false,
}: JobCardProps) {
  return (
    <div
      className={`bg-white dark:bg-navy/50 border rounded-lg p-4 cursor-pointer transition-colors relative ${
        selected
          ? "border-rust ring-1 ring-rust"
          : "border-gray-200 dark:border-white/10 hover:border-navy/30"
      }`}
      onClick={onSelect}
    >
      <button
        aria-label="Bookmark job"
        onClick={(e) => {
          e.stopPropagation();
          onBookmark?.();
        }}
        className={`absolute top-4 right-4 p-1 rounded-md transition-colors ${
          bookmarked ? "text-rust" : "text-gray-400 hover:text-rust"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      </button>

      {job.status === "open" && (
        <span className="inline-block bg-rust/10 text-rust text-xs font-semibold px-2 py-0.5 rounded mb-2">
          Open
        </span>
      )}

      <h3 className="text-sm font-semibold text-navy dark:text-white pr-8">
        {job.title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {job.location || "Location not specified"}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
          {formatBudget(job.budget)}
        </span>
        <span className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
          {formatStatus(job.status)}
        </span>
      </div>
    </div>
  );
}