"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Send,
  DollarSign,
  UserCheck,
  Plus,
  MapPin,
  Wrench,
  Edit3,
  Clock,
  Star
} from "lucide-react";
import Button from "@/components/button";
import Card from "@/components/card";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  full_name: string | null;
  role: string[] | null;
  bio: string | null;
  location: string | null;
  skills: string[] | null;
  hourly_rate: number | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && profileData) {
        setProfile(profileData as Profile);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-rust/30 border-t-rust rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading your workspace…</p>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-rust/10 text-rust rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-navy dark:text-white">Almost there!</h2>
          <p className="text-gray-500">We need a few more details to tailor your dashboard.</p>
          <Link href="/profile/edit" className="block mt-6">
            <Button className="w-full">Complete Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isClient = profile.role?.includes("client") ?? false;
  const isWorker = profile.role?.includes("worker") ?? false;
  const completionRate = calculateCompletion(profile);

  const stats = [
    isClient && {
      label: "Active Jobs",
      value: "—",
      icon: Briefcase,
    },
    isWorker && {
      label: "Bids Sent",
      value: "—",
      icon: Send,
    },
    isWorker && {
      label: "Hourly Rate",
      value: profile.hourly_rate ? `₹${profile.hourly_rate.toLocaleString()}` : "Not set",
      icon: DollarSign,
    },
  ].filter(Boolean) as { label: string; value: string; icon: any }[];

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <p className="text-sm font-medium text-rust tracking-wide uppercase mb-1">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy dark:text-white tracking-tight">
              Welcome back{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {isClient && (
              <Link href="/jobs/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </Link>
            )}
            <Link href="/jobs">
              <Button variant="secondary">Browse Jobs</Button>
            </Link>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Activity & Stats (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Dynamic Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <Card key={i} accent className="transition-transform hover:-translate-y-1">
                    <div className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-rust/10 rounded-xl">
                        <stat.icon className="h-6 w-6 text-rust" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-navy dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Feeds */}
            <Card accent>
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-rust" />
                    Recent Activity
                  </h2>
                </div>
                <div className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Your activity feed will appear here once jobs and bids are connected.
                  </p>
                </div>
              </div>
            </Card>

            <Card accent>
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-rust" />
                    Suggested Matches
                  </h2>
                </div>
                <div className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Job matches based on your skills will populate this area.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Profile Sidebar (1/3 width) */}
          <div className="space-y-8">
            <Card accent className="sticky top-8">
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-8">
                  <h2 className="text-lg font-bold text-navy dark:text-white">Profile Identity</h2>
                  <Link href="/profile/edit">
                    <button className="p-2 text-gray-400 hover:text-rust hover:bg-rust/10 rounded-full transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                {/* Identity Snapshot */}
                <div className="space-y-5 mb-8">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Full Name</p>
                    <p className="font-medium text-navy dark:text-gray-200">{profile.full_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Role</p>
                    <p className="font-medium text-navy dark:text-gray-200 capitalize">{profile.role?.join(" • ") ?? "No role set"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Location</p>
                    <p className="font-medium text-navy dark:text-gray-200 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-rust" />
                      {profile.location || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Bio</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {profile.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                {/* Completion Progress Bar */}
                <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-navy dark:text-white">Completion</span>
                    <span className="text-sm font-bold text-rust">{completionRate}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rust rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
                    <Wrench className="h-4 w-4 text-gray-400" />
                    Skills
                  </h3>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-rust/10 text-rust border border-rust/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skills added.{" "}
                      <Link href="/profile/edit" className="text-rust hover:underline">
                        Add some now
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateCompletion(profile: Profile): number {
  const fields = [
    profile.full_name,
    profile.bio,
    profile.location,
    profile.skills && profile.skills.length > 0,
    profile.hourly_rate,
    profile.avatar_url,
    profile.role && profile.role.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}