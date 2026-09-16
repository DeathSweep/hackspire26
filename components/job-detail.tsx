"use client";

import { Bookmark, Share2, MapPin, DollarSign, Briefcase } from "lucide-react";
import { Job } from "./job-card";
import Button from "./button";

interface JobDetailProps {
  job: Job;
  onApply?: () => void;
}

export default function JobDetail({ job, onApply }: JobDetailProps) {
  return (
    <div className="bg-white dark:bg-navy/50 border border-gray-200 dark:border-white/10 rounded-xl p-6 min-h-[500px]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy dark:text-white">{job.title}</h2>
          <p className="text-rust font-medium mt-1">{job.company}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{job.location}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{job.pay}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button size="md" onClick={onApply}>
          Apply
        </Button>
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
        <h3 className="text-lg font-semibold text-navy dark:text-white mb-4">Job details</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">Pay</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{job.pay}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">Job type</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{job.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">Location</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 mt-6 pt-6">
        <h3 className="text-lg font-semibold text-navy dark:text-white mb-3">
          Full job description
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {job.description}
        </p>
      </div>

      {job.skills.length > 0 && (
        <div className="border-t border-gray-200 dark:border-white/10 mt-6 pt-6">
          <h3 className="text-lg font-semibold text-navy dark:text-white mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
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
