"use client";

import { use } from "react";
import Link from "next/link";
import { Layers, ArrowLeft } from "lucide-react";
import { useJobs } from "@/context/jobs-context";
import JobDetail from "@/components/job-detail";
import Button from "@/components/button";

export default function JobDetailClient({ id }: { id: string }) {
  const { jobs } = useJobs();
  const job = jobs.find((j) => j.id === id) ?? null;

  if (!job) {
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
            </div>
          </div>
        </nav>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-navy dark:text-white mb-4">Job Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/jobs" className="flex items-center text-sm text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <JobDetail job={job} onApply={() => {}} />
      </div>
    </div>
  );
}
