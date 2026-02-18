import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { SignOutButton } from "../../sign-out-button";
import { ProjectDetail } from "./project-detail";

export const dynamic = "force-dynamic";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: {
      property: { include: { listing: true } },
      applications: { include: { freelancer: { include: { user: true } } } },
      assignments: { include: { freelancer: { include: { user: true } } } },
    },
  });

  if (!project) notFound();

  const listing = project.property.listing ?? null;
  const photos = (project.property.photos as string[]) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/admin/projects" className="text-slate-600 hover:text-slate-900">
            ← Projects
          </Link>
          <SignOutButton />
        </div>
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        <ProjectDetail
          project={project}
          listing={listing}
          photos={photos}
        />
      </main>
    </div>
  );
}
