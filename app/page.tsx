import Link from "next/link";
import { CheckCircle, Briefcase, ShieldCheck, ChevronRight, Users, Zap, Lock } from "lucide-react";
import Button from "@/components/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="bg-white dark:bg-navy/30 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy dark:text-white tracking-tight">
            Connecting Labor & <span className="text-rust">Hiring</span> Opportunities
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A platform built for reliability, efficiency, and finding the perfect match for your next project.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
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
                className="bg-white dark:bg-navy/50 border border-gray-200 dark:border-white/10 rounded-xl p-8 shadow-sm text-center"
              >
                <div className="inline-flex items-center justify-center p-3 bg-rust/10 rounded-full mb-4">
                  <item.icon className="h-8 w-8 text-rust" />
                </div>
                <h3 className="text-lg font-semibold text-navy dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-navy/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-rust text-white font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-navy dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy dark:text-white mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join Labor Connect today and find your next opportunity.
          </p>
          <Link href="/signup">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
