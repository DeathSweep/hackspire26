import { notFound } from "next/navigation";
import { JobsProvider } from "@/context/jobs-context";
import JobDetailClient from "./job-detail-client";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  return (
    <JobsProvider>
      <JobDetailClient id={params.id} />
    </JobsProvider>
  );
}
