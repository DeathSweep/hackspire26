"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import JobCard, { Job } from "@/components/job-card";
import JobDetail from "@/components/job-detail";

const filters = ["Budget", "Location", "Skills", "Status", "Deadline", "Date posted"];

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Fetch jobs from Supabase
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("jobs")
        .select(
          `
          id,
          client_id,
          title,
          description,
          budget,
          location,
          skills,
          status,
          deadline,
          created_at,
          updated_at
        `
        )
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching jobs:", fetchError);
        setError(fetchError.message);
        setJobs([]);
      } else {
        const list = (data as Job[]) || [];
        setJobs(list);
        // Auto-select the first job on desktop
        if (list.length > 0) {
          setSelectedJobId(list[0].id);
        }
      }

      setLoading(false);
    }

    fetchJobs();
  }, []);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;

  const filtered = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      job.title.toLowerCase().includes(q) ||
      (job.description?.toLowerCase().includes(q) ?? false) ||
      (job.skills?.some((s) => s.toLowerCase().includes(q)) ?? false);

    const matchLocation =
      !location ||
      (job.location?.toLowerCase().includes(location.toLowerCase()) ?? false);

    return matchSearch && matchLocation;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Search bar */}
      <div className="border-b border-gray-200 dark:border-white/10 bg-white dark:bg-navy/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
            <div className="flex-1 flex items-center bg-gray-50 dark:bg-navy/50 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Job title, description, or skills"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full"
              />
            </div>
            <div className="flex-1 flex items-center bg-gray-50 dark:bg-navy/50 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="City, state, or region"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full"
              />
            </div>
            <button className="bg-rust text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-rust/90 transition-colors">
              Find jobs
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-rust/50 transition-colors"
              >
                {filter}
                <SlidersHorizontal className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            Loading jobs…
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-rust underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: job list */}
            <div className="w-full lg:w-[440px] flex-shrink-0">
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filtered.length} job{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="space-y-3">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    selected={job.id === selectedJobId}
                    onSelect={() => setSelectedJobId(job.id)}
                    onBookmark={() => toggleBookmark(job.id)}
                    bookmarked={bookmarks.has(job.id)}
                  />
                ))}

                {filtered.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                    No jobs found. Try adjusting your filters.
                  </p>
                )}
              </div>
            </div>

            {/* Right: job detail (desktop) */}
            <div className="flex-1 hidden lg:block">
              {selectedJob ? (
                <JobDetail job={selectedJob} onApply={() => {}} />
              ) : (
                <div className="bg-white dark:bg-navy/50 border border-gray-200 dark:border-white/10 rounded-xl p-12 text-center min-h-[500px] flex items-center justify-center">
                  <p className="text-gray-400">Select a job to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}