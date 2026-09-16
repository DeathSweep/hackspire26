"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Menu, X, Sun, Moon } from "lucide-react";
import { createClient } from "@/lib/supabase/client"; // adjust path if needed
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Find Jobs" },
  { href: "/jobs/new", label: "Post Jobs" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  const supabase = createClient();

  // Theme
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark, mounted]);

  // Auth state
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Prefer full_name from profiles, fall back to email
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        setDisplayName(profile?.full_name || user.email?.split("@")[0] || "User");
      } else {
        setDisplayName(null);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Re-fetch name on auth change
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setDisplayName(
              data?.full_name || session.user.email?.split("@")[0] || "User"
            );
          });
      } else {
        setDisplayName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Extract first name for the UI
  const firstName = displayName ? displayName.split(" ")[0] : "";

  // Prevent hydration mismatch on icons
  if (!mounted) return <div className="h-16 sticky top-0 bg-transparent" />;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="p-1.5 bg-gradient-to-br from-rust to-orange-600 rounded-xl shadow-sm group-hover:shadow-rust/20 transition-all duration-300">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rust to-orange-600">LABOR</span> CONNECT
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rust dark:hover:text-rust transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth / theme */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rust transition-colors"
              >
                Welcome, <span className="font-bold text-slate-900 dark:text-white">{firstName}</span>!
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rust dark:hover:text-rust transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rust dark:hover:bg-rust dark:hover:text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 shadow-xl absolute w-full">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-rust dark:hover:text-rust transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col space-y-3 pt-4 pb-2 mt-2 border-t border-slate-100 dark:border-slate-800">
              {user ? (
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                  onClick={() => setOpen(false)}
                >
                  Welcome, <span className="font-bold text-slate-900 dark:text-white">{firstName}</span>!
                </Link>
              ) : (
                <div className="flex flex-col space-y-2 px-3">
                  <Link
                    href="/login"
                    className="w-full py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 text-center hover:text-rust transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rust dark:hover:bg-rust dark:hover:text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-all duration-300"
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}