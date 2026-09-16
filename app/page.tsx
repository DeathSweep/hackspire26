import Link from "next/link";
import { CheckCircle, Briefcase, ShieldCheck, ChevronRight, Users, Zap, Lock } from "lucide-react";
import Button from "@/components/button";

export default function Home() {
  return (
    // Added a global gradient background and relative positioning for background blobs
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-200 dark:from-navy dark:to-slate-900">
      
      {/* Background Decorative Blobs to make the glass effect pop */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rust/30 dark:bg-rust/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-300/40 dark:bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-purple-300/40 dark:bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          {/* Hero Glass Panel */}
          <div className="bg-white/40 dark:bg-navy/30 backdrop-blur-lg border border-white/50 dark:border-white/10 rounded-3xl p-10 md:p-20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy dark:text-white tracking-tight">
              Connecting Labor & <span className="text-rust">Hiring</span> Opportunities
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              A platform built for reliability, efficiency, and finding the perfect match for your next project.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-white/50 backdrop-blur-md border-white/60" size="lg" variant="secondary">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 relative z-10">
        <h2 className="text-3xl font-bold text-center text-navy dark:text-white mb-12">
              Why Us?
            </h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Verified Workers",
                desc: "Skilled, certified pool with reliable performance ratings.",
              },
              {
                icon: Zap,
                title: "Efficient Matching",
                desc: "Quick job postings, location-based search, and skill-based hiring.",
              },
              {
                icon: Lock,
                title: "Secure Payments",
                desc: "Integrated billing system with escrow protection and transparency.",
              },
            ].map((item, i) => (
              <div
                key={i}
                // Glassmorphism Card Classes
                className="bg-white/40 dark:bg-navy/40 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] text-center transition-transform hover:-translate-y-1 duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-rust/20 dark:bg-rust/30 backdrop-blur-sm rounded-xl mb-4 border border-rust/10">
                  <item.icon className="h-8 w-8 text-rust dark:text-rust-light" />
                </div>
                <h3 className="text-lg font-semibold text-navy dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Glass Wrapper for Section */}
          <div className="bg-white/30 dark:bg-black/20 backdrop-blur-lg border border-white/40 dark:border-white/10 rounded-3xl p-10 md:p-16 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-navy dark:text-white mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Create a Profile", desc: "Sign up and build your professional profile." },
                { step: "2", title: "Find or Post Jobs", desc: "Browse opportunities or post your requirements." },
                { step: "3", title: "Get Hired", desc: "Connect, collaborate, and complete the job securely." },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-rust/90 backdrop-blur-md shadow-lg shadow-rust/20 text-white font-bold text-xl mb-6 border border-rust/50">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-navy dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative z-10 mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-rust/10 to-blue-500/10 dark:from-rust/20 dark:to-blue-900/20 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
            <h2 className="text-3xl font-bold text-navy dark:text-white mb-4">Ready to get started?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Join Labor Connect today and find your next opportunity.
            </p>
            <Link href="/signup">
              <Button className="shadow-lg shadow-rust/30" size="lg">Create Free Account</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}