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
        <main className="min-h-screen bg-slate-50">
          <div className="border-b border-slate-200 bg-white px-4 py-4">
            <div className="mx-auto max-w-2xl">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">← Back to home</Link>
            </div>
          </div>
          <div className="mx-auto max-w-2xl px-4 py-10">
            <h1 className="text-2xl font-semibold text-slate-900">Open projects</h1>
            <DbUnavailableMessage />
          </div>
        </main>
      );
    }
    throw e;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">← Back to home</Link>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Open projects</h1>
        <p className="mt-1 text-slate-600 text-sm">
          Apply to projects below. The operator will review your application and assign you if it’s a fit.
        </p>
        <FreelancerProjectList projects={projects} />
      </div>
    </main>
  );
}
