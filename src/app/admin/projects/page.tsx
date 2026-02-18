import Link from "next/link";
import { db } from "@/server/db";
import { ProjectStatus } from "@prisma/client";
import { SignOutButton } from "../sign-out-button";
import { AdminProjectsList } from "./projects-list";
import { ListingBuilder } from "./listing-builder";

const statusOptions: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: ProjectStatus.INTAKE, label: "Intake" },
  { value: ProjectStatus.WAITING_FREELANCER, label: "Waiting freelancer" },
  { value: ProjectStatus.ASSIGNED, label: "Assigned" },
  { value: ProjectStatus.READY_TO_LIST, label: "Ready to list" },
  { value: ProjectStatus.LISTED, label: "Listed" },
];

export const dynamic = "force-dynamic";

function DbUnavailableMessage() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <p className="font-medium">Cannot connect to the database</p>
      <p className="text-sm mt-1">
        Check <code className="bg-amber-100 px-1 rounded">DATABASE_URL</code>. For Supabase, add{" "}
        <code className="bg-amber-100 px-1 rounded">?sslmode=require</code> and ensure the project is not paused.
      </p>
    </div>
  );
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus =
    status && Object.values(ProjectStatus).includes(status as ProjectStatus)
      ? (status as ProjectStatus)
      : undefined;

  let projects;
  try {
    projects = await db.project.findMany({
      where: filterStatus ? { status: filterStatus } : undefined,
      include: {
        property: {
          include: {
            listing: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Can't reach database server") || msg.includes("P1001")) {
      return (
        <div className="min-h-screen bg-slate-50">
          <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-slate-900">Projects</h1>
              <SignOutButton />
            </div>
          </header>
          <main className="p-6">
            <DbUnavailableMessage />
          </main>
        </div>
      );
    }
    throw e;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Projects</h1>
          <SignOutButton />
        </div>
      </header>
      <main className="p-6 space-y-6">
        <AdminProjectsList
          projects={projects}
          statusOptions={statusOptions}
          currentStatus={status ?? ""}
        />
        <ListingBuilder projects={projects} />
      </main>
    </div>
  );
}
