"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, Briefcase, Send, DollarSign, UserCheck, Plus } from "lucide-react";
import Button from "@/components/button";
import Card from "@/components/card";

export default function DashboardPage() {
  const stats = [
    { label: "Active Jobs", value: "12", icon: Briefcase },
    { label: "Applications Sent", value: "8", icon: Send },
    { label: "Earnings", value: "₹45K", icon: DollarSign },
    { label: "Profile Completion", value: "75%", icon: UserCheck },
  ];

  const recentActivity = [
    { title: "Applied to Office Assistant", company: "Sunrise Hospital", time: "2 hours ago" },
    { title: "Profile viewed by Lenskart", company: "Lenskart.com", time: "5 hours ago" },
    { title: "New job match: Retail Assistant", company: "Zak Consultancy", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-navy dark:text-white">Dashboard</h1>
          <div className="flex gap-3">
            <Link href="/jobs/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="secondary">Browse Jobs</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} accent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-navy dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-rust/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-rust" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card accent>
            <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between border-b border-gray-100 dark:border-white/5 pb-3 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-navy dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.company}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card accent>
            <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Job Matches</h2>
            <div className="space-y-4">
              {[
                { title: "Office Assistant", company: "Sunrise Hospital", match: "92%" },
                { title: "Store Manager", company: "Lenskart.com", match: "87%" },
                { title: "Retail Operations", company: "Zak Consultancy", match: "78%" },
              ].map((job, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-navy dark:text-white">{job.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{job.company}</p>
                  </div>
                  <span className="text-xs font-semibold text-rust">{job.match} match</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
