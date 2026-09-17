"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/components/job-card";

interface BidModalProps {
  job: Job;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BidModal({ job, open, onClose, onSuccess }: BidModalProps) {
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setAmount("");
      setProposal("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      setError("Please enter a valid amount (≥ 0).");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to submit a bid.");
      setLoading(false);
      return;
    }

    // Prevent bidding on own job
    if (job.client_id === user.id) {
      setError("You cannot bid on your own job.");
      setLoading(false);
      return;
    }

    // Only allow bidding on open jobs
    if (job.status && job.status !== "open") {
      setError("This job is no longer open for bids.");
      setLoading(false);
      return;
    }

    // Insert bid
    const { error: insertError } = await supabase.from("bids").insert({
      job_id: job.id,
      worker_id: user.id,
      amount: numericAmount,
      proposal: proposal.trim() || null,
      status: "pending",
    });

    if (insertError) {
      // Handle unique constraint violation (already bid)
      if (insertError.code === "23505") {
        setError("You have already submitted a bid for this job.");
      } else {
        setError(insertError.message || "Failed to submit bid. Please try again.");
      }
      setLoading(false);
      return;
    }

    // Success
    setLoading(false);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bid-modal-title"
        className="relative w-full max-w-md bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <div>
            <h2
              id="bid-modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Submit your bid
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[280px]">
              {job.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Amount */}
          <div>
            <label
              htmlFor="bid-amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Bid amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₹
              </span>
              <input
                id="bid-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1800"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-navy/50 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rust/40 focus:border-rust transition"
                required
                autoFocus
              />
            </div>
            {job.budget != null && (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Client budget: ₹{Number(job.budget).toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Proposal */}
          <div>
            <label
              htmlFor="bid-proposal"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Proposal{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="bid-proposal"
              rows={4}
              placeholder="Explain why you are suitable for this job..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-navy/50 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rust/40 focus:border-rust transition resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-rust text-white text-sm font-semibold hover:bg-rust/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Submitting…" : "Submit Bid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
