"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  User,
  CheckCircle2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/button";
import Card from "@/components/card";

type Job = {
  id: string;
  title: string;
  budget: number | null;
  status: string | null;
  client_id: string;
};

type WorkerProfile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  skills: string[] | null;
  hourly_rate: number | null;
  avatar_url: string | null;
};

type Bid = {
  id: string;
  job_id: string;
  worker_id: string;
  amount: number;
  proposal: string | null;
  status: string;
  created_at: string;
  worker?: WorkerProfile;
};

function formatBudget(amount: number | null) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    accepted:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    withdrawn:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    map[status] ||
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
  );
}

export default function JobBidsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Accept modal state
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    async function load() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      // Fetch job (must belong to current user via RLS)
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("id, title, budget, status, client_id")
        .eq("id", jobId)
        .single();

      if (jobError || !jobData) {
        setError(jobError?.message || "Job not found or you do not have access.");
        setLoading(false);
        return;
      }

      // Extra safety check
      if (jobData.client_id !== user.id) {
        setError("You can only view bids on your own jobs.");
        setLoading(false);
        return;
      }

      setJob(jobData as Job);

      // Fetch bids for this job
      const { data: bidsData, error: bidsError } = await supabase
        .from("bids")
        .select(
          `
          id,
          job_id,
          worker_id,
          amount,
          proposal,
          status,
          created_at
        `
        )
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (bidsError) {
        setError(bidsError.message);
        setLoading(false);
        return;
      }

      const bidList = (bidsData as Bid[]) || [];

      // Fetch worker profiles for the bids
      if (bidList.length > 0) {
        const workerIds = [...new Set(bidList.map((b) => b.worker_id))];

        const { data: profilesData } = await supabase
          .from("profiles")
          .select(
            "id, full_name, bio, location, skills, hourly_rate, avatar_url"
          )
          .in("id", workerIds);

        const profileMap: Record<string, WorkerProfile> = {};
        (profilesData || []).forEach((p: WorkerProfile) => {
          profileMap[p.id] = p;
        });

        bidList.forEach((bid) => {
          bid.worker = profileMap[bid.worker_id];
        });
      }

      setBids(bidList);
      setLoading(false);
    }

    load();
  }, [jobId]);

  const openAcceptModal = (bid: Bid) => {
    setSelectedBid(bid);
    setAcceptError(null);
    setAcceptModalOpen(true);
  };

  const handleAccept = async () => {
    if (!selectedBid) return;

    setAccepting(true);
    setAcceptError(null);

    const supabase = createClient();

    // Call the atomic RPC
    const { error: rpcError } = await supabase.rpc("accept_bid", {
      bid_id: selectedBid.id,
    });

    if (rpcError) {
      setAcceptError(rpcError.message || "Failed to accept bid.");
      setAccepting(false);
      return;
    }

    // Success – refresh local state
    setAccepting(false);
    setAcceptModalOpen(false);
    setSelectedBid(null);

    // Update UI to reflect new statuses
    setBids((prev) =>
      prev.map((b) => {
        if (b.id === selectedBid.id) return { ...b, status: "accepted" };
        if (b.status === "pending") return { ...b, status: "rejected" };
        return b;
      })
    );
    setJob((prev) => (prev ? { ...prev, status: "in_progress" } : prev));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-rust/30 border-t-rust rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading bids…</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error || "Something went wrong."}
        </p>
        <Link href="/dashboard/jobs">
          <Button variant="secondary">Back to My Jobs</Button>
        </Link>
      </div>
    );
  }

  const isOpen = job.status === "open";
  const hasAccepted = bids.some((b) => b.status === "accepted");

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back + Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center text-sm text-gray-500 hover:text-rust transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to My Jobs
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white tracking-tight">
            Bids for &ldquo;{job.title}&rdquo;
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Budget: {formatBudget(job.budget)} · Status:{" "}
            <span className="capitalize">{job.status?.replace("_", " ")}</span>
          </p>
        </div>

        {bids.length === 0 ? (
          <Card accent>
            <div className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No bids yet.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <Card key={bid.id} accent>
                <div className="p-5 sm:p-6">
                  {/* Worker header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-rust/10 text-rust flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {bid.worker?.avatar_url ? (
                          <img
                            src={bid.worker.avatar_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-navy dark:text-white truncate">
                          {bid.worker?.full_name || "Worker"}
                        </p>
                        {bid.worker?.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {bid.worker.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0 ${statusBadge(
                        bid.status
                      )}`}
                    >
                      {bid.status}
                    </span>
                  </div>

                  {/* Skills */}
                  {bid.worker?.skills && bid.worker.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {bid.worker.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bid amount */}
                  <p className="text-lg font-bold text-navy dark:text-white mb-2">
                    Bid: {formatBudget(bid.amount)}
                  </p>

                  {/* Proposal */}
                  {bid.proposal && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                      &ldquo;{bid.proposal}&rdquo;
                    </p>
                  )}

                  {/* Meta + actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
                    <p className="text-xs text-gray-400">
                      Submitted{" "}
                      {new Date(bid.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {bid.worker?.hourly_rate != null && (
                        <> · Rate: ₹{bid.worker.hourly_rate}/hr</>
                      )}
                    </p>

                    <div className="flex gap-2">
                      {bid.worker && (
                        <Link href={`/profile/${bid.worker.id}`}>
                          <Button variant="secondary" className="text-sm py-1.5 px-3">
                            View Profile
                          </Button>
                        </Link>
                      )}

                      {isOpen &&
                        !hasAccepted &&
                        bid.status === "pending" && (
                          <Button
                            className="text-sm py-1.5 px-3"
                            onClick={() => openAcceptModal(bid)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                            Accept Bid
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Accept confirmation modal */}
      {acceptModalOpen && selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !accepting && setAcceptModalOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Accept this bid?
              </h2>
              <button
                type="button"
                onClick={() => !accepting && setAcceptModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-navy dark:text-white">
                    Worker:
                  </span>{" "}
                  {selectedBid.worker?.full_name || "Worker"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-navy dark:text-white">
                    Bid:
                  </span>{" "}
                  {formatBudget(selectedBid.amount)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p className="font-medium text-navy dark:text-white mb-2">
                  Accepting this bid will:
                </p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Assign this worker to the job</li>
                  <li>Reject the other pending bids</li>
                  <li>Start the job (status → in progress)</li>
                </ul>
              </div>

              {acceptError && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {acceptError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  disabled={accepting}
                  onClick={() => setAcceptModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={accepting}
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rust text-white text-sm font-semibold hover:bg-rust/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {accepting ? "Accepting…" : "Accept Bid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
