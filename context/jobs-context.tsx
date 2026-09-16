"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Job } from "@/components/job-card";

interface JobsContextValue {
  jobs: Job[];
  addJob: (job: Omit<Job, "id">) => void;
}

const JobsContext = createContext<JobsContextValue | undefined>(undefined);

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Retail Operations Assistant",
    company: "Zak Consultancy",
    location: "Kochi, Kerala",
    pay: "₹50,000 - ₹1,00,000 a month",
    type: "Full-time",
    skills: ["Retail", "Operations", "Customer Service"],
    description:
      "Assist in managing daily retail operations, ensuring smooth workflow and excellent customer experience.",
    easilyApply: true,
    postedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Office Assistant",
    company: "Sunrise Hospital",
    location: "Kakkanad, Kochi, Kerala",
    pay: "From ₹15,000 a month",
    type: "Full-time",
    skills: ["Administration", "Office Management"],
    description:
      "Helping manage the office correspondence. Performing general clerical and administrative tasks.",
    easilyApply: true,
    postedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Office Administrator",
    company: "NAJATH PUBLIC SCHOOL KALAMASSERY",
    location: "Kochi, Kerala",
    pay: "₹27,000 - ₹37,000 a month",
    type: "Full-time",
    skills: ["Administration", "Communication"],
    description:
      "Managing school administration, coordinating with staff, and ensuring smooth day-to-day operations.",
    easilyApply: true,
    postedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Store Manager",
    company: "Lenskart.com",
    location: "Kochi, Kerala",
    pay: "Up to ₹45,000 a month",
    type: "Full-time",
    skills: ["Retail", "Management", "Sales"],
    description:
      "Leading store operations, managing team performance, and driving sales targets.",
    easilyApply: true,
    postedAt: new Date().toISOString(),
  },
];

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const addJob = (jobData: Omit<Job, "id">) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedAt: new Date().toISOString(),
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  return (
    <JobsContext.Provider value={{ jobs, addJob }}>{children}</JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
