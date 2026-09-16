import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  accent?: boolean;
}

export default function Card({ children, accent = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-navy/50 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm ${
        accent ? "border-t-4 border-t-rust" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
