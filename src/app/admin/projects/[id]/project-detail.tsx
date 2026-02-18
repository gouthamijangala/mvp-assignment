import Image from "next/image";
import {
  approveProject,
  rejectProject,
  setProjectStatusFromForm,
  updatePropertyFromForm,
  updateNotesFromForm,
  assignFreelancer,
} from "./actions";
import { ProjectStatus } from "@prisma/client";

type ProjectWithRelations = {
  id: string;
  status: string;
  notes: string | null;
  property: {
    id: string;
    title: string;
    description: string;
    address: string;
    ownerName: string;
    ownerEmail: string;
    baseNightlyRate: number;
    maxGuests: number;
    status: string;
    listing: {
      id: string;
      slug: string;
      title: string;
      description: string;
      nightlyRate: number;
      cleaningFee: number;
      maxGuests: number;
      status: string;
    } | null;
  };
  applications: {
    id: string;
    message: string | null;
    status: string;
    freelancer: { id: string; user: { name: string | null; email: string } };
  }[];
  assignments: {
    id: string;
    freelancer: { id: string; user: { name: string | null; email: string } };
  }[];
};

export function ProjectDetail({
  project,
  listing,
  photos,
}: {
  project: ProjectWithRelations;
  listing: ProjectWithRelations["property"]["listing"];
  photos: string[];
}) {
  const prop = project.property;
  const canApprove = project.status === ProjectStatus.INTAKE && prop.status === "PENDING_REVIEW";
  const canReject = project.status === ProjectStatus.INTAKE;
  const canAssign = project.status === ProjectStatus.WAITING_FREELANCER && project.applications.some((a) => a.status === "APPLIED");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">{prop.title}</h1>
        <div className="flex gap-2">
          {canApprove && (
            <form action={approveProject.bind(null, project.id)}>
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Approve
              </button>
            </form>
          )}
          {canReject && (
            <form action={rejectProject.bind(null, project.id)}>
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Reject
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Status */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-medium text-slate-700 mb-2">Project status</h2>
        <form action={setProjectStatusFromForm} className="flex items-center gap-2">
          <input type="hidden" name="projectId" value={project.id} />
          <select
            name="status"
            defaultValue={project.status}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {Object.values(ProjectStatus).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-slate-200 px-3 py-2 text-sm hover:bg-slate-300">
            Update
          </button>
        </form>
      </section>

      {/* Property info */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-medium text-slate-700 mb-3">Property</h2>
        <form action={updatePropertyFromForm} className="space-y-3">
          <input type="hidden" name="propertyId" value={prop.id} />
          <div>
            <label className="block text-xs text-slate-500 mb-1">Title</label>
            <input name="title" defaultValue={prop.title} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Description</label>
            <textarea name="description" defaultValue={prop.description} rows={3} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Address</label>
            <input name="address" defaultValue={prop.address} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nightly rate</label>
              <input name="baseNightlyRate" type="number" defaultValue={prop.baseNightlyRate} className="w-28 rounded border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Max guests</label>
              <input name="maxGuests" type="number" defaultValue={prop.maxGuests} className="w-28 rounded border px-3 py-2 text-sm" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Owner: {prop.ownerName} ({prop.ownerEmail})</p>
          <button type="submit" className="rounded-lg bg-slate-800 text-white px-4 py-2 text-sm">
            Save property
          </button>
        </form>
      </section>

      {/* Photos */}
      {photos.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-medium text-slate-700 mb-2">Photos</h2>
          <div className="flex flex-wrap gap-2">
            {photos.map((url, i) => (
              <div key={i} className="relative w-32 h-32 rounded-lg overflow-hidden bg-slate-100">
                <Image src={url} alt="" fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Notes */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-medium text-slate-700 mb-2">Notes</h2>
        <form action={updateNotesFromForm} className="space-y-2">
          <input type="hidden" name="projectId" value={project.id} />
          <textarea name="notes" defaultValue={project.notes ?? ""} rows={2} className="w-full rounded border px-3 py-2 text-sm" placeholder="Operator notes" />
          <button type="submit" className="rounded-lg bg-slate-200 px-3 py-2 text-sm hover:bg-slate-300">Save notes</button>
        </form>
      </section>

      {/* Applications & assign */}
      {project.applications.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-medium text-slate-700 mb-2">Applications</h2>
          <ul className="space-y-2">
            {project.applications.map((app) => (
              <li key={app.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <p className="font-medium text-slate-900">{app.freelancer.user.name ?? app.freelancer.user.email}</p>
                  <p className="text-xs text-slate-500">{app.freelancer.user.email}</p>
                  {app.message && <p className="text-sm text-slate-600 mt-1">{app.message}</p>}
                </div>
                {canAssign && app.status === "APPLIED" && (
                  <form action={assignFreelancer.bind(null, project.id, app.id)}>
                    <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700">
                      Assign
                    </button>
                  </form>
                )}
                {app.status !== "APPLIED" && <span className="text-xs text-slate-500">{app.status}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Assigned freelancer */}
      {project.assignments.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-medium text-slate-700 mb-2">Assigned</h2>
          <p className="text-slate-700">
            {project.assignments[0].freelancer.user.name ?? project.assignments[0].freelancer.user.email}
          </p>
        </section>
      )}
    </div>
  );
}
