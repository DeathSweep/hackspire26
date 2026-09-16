import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">
              © {new Date().getFullYear()} Labor Connect. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/jobs" className="text-sm text-gray-300 hover:text-white transition-colors">
              Jobs
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/signup" className="text-sm text-gray-300 hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
