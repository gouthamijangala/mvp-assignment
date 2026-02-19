import Link from "next/link";
import { db } from "@/server/db";
import { ProjectStatus } from "@prisma/client";
import { FreelancerProjectList } from "./project-list";

export const dynamic = "force-dynamic";

function DbUnavailableMessage() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <p className="font-medium">Cannot connect to the database</p>
      <p className="mt-1 text-sm">
        Check that <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> is set correctly. For Supabase, add{" "}
        <code className="rounded bg-amber-100 px-1">?sslmode=require</code> and ensure the project is not paused.
      </p>
    </div>
  );
}

export default async function FreelancerProjectsPage() {
  let projects;
  try {
    projects = await db.project.findMany({
      where: { status: ProjectStatus.WAITING_FREELANCER },
      include: { property: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Can't reach database server") || msg.includes("P1001")) {
      return (
        <main className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-white">
          <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                ← Back to home
              </Link>
              <span className="hidden rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 sm:inline-flex">
                Freelancers · Project board
              </span>
            </div>
          </div>
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-slate-900">Open projects</h1>
            <DbUnavailableMessage />
          </div>
        </main>
      );
    }
    throw e;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-white">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Back to home
          </Link>
          <span className="hidden rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 sm:inline-flex">
            Freelancers · Apply to real properties
          </span>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Open projects</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            These projects come from real owner submissions. Apply with your details and the operator will confirm
            if you’re assigned.
          </p>
        </div>
        <FreelancerProjectList projects={projects} />
      </div>
    </main>
  );
}
