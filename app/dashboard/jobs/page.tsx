"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  ChevronRight,
  Plus,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/button";
import Card from "@/components/card";

type Job = {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  location: string | null;
  skills: string[] | null;
  status: string | null;
  deadline: string | null;
  created_at: string | null;
  bid_count?: number;
};

function formatBudget(budget: number | null) {
  if (budget == null) return "Not specified";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(budget);
}

function formatStatus(status: string | null) {
  if (!status) return "Open";
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function statusColor(status: string | null) {
  switch (status) {
    case "open":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "in_progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyJobs() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to view your jobs.");
        setLoading(false);
        return;
      }

      // Fetch client's jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select(
          `
          id,
          title,
          description,
          budget,
          location,
          skills,
          status,
          deadline,
          created_at
        `
        )
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (jobsError) {
        setError(jobsError.message);
        setJobs([]);
        setLoading(false);
        return;
      }

      const jobList = (jobsData as Job[]) || [];

      // Fetch bid counts for each job
      if (jobList.length > 0) {
        const jobIds = jobList.map((j) => j.id);

        const { data: bidsData } = await supabase
          .from("bids")
          .select("job_id")
          .in("job_id", jobIds);

        const countMap: Record<string, number> = {};
        (bidsData || []).forEach((b: { job_id: string }) => {
          countMap[b.job_id] = (countMap[b.job_id] || 0) + 1;
        });

        jobList.forEach((job) => {
          job.bid_count = countMap[job.id] || 0;
        });
      }

      setJobs(jobList);
      setLoading(false);
    }

    fetchMyJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-rust/30 border-t-rust rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading your jobs…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <p className="text-sm font-medium text-rust tracking-wide uppercase mb-1">
              Client
            </p>
            <h1 className="text-3xl font-extrabold text-navy dark:text-white tracking-tight">
              My Jobs
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your job postings and review bids
            </p>
          </div>
          <Link href="/jobs/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <Card accent>
            <div className="p-12 text-center">
              <div className="w-14 h-14 bg-rust/10 text-rust rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-semibold text-navy dark:text-white mb-2">
                No jobs yet
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Post your first job to start receiving bids from skilled workers.
              </p>
              <Link href="/jobs/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                accent
                className="transition-transform hover:-translate-y-0.5"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="text-lg font-bold text-navy dark:text-white truncate">
                          {job.title}
                        </h2>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor(
                            job.status
                          )}`}
                        >
                          {formatStatus(job.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          {formatBudget(job.budget)}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {job.bid_count ?? 0} bid
                          {(job.bid_count ?? 0) !== 1 ? "s" : ""} received
                        </span>
                        {job.created_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Posted{" "}
                            {new Date(job.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link href={`/jobs/${job.id}/bids`}>
                      <Button variant="secondary" className="whitespace-nowrap">
                        View Bids
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
