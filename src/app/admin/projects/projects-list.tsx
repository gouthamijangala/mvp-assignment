"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProjectStatus as ProjectStatusEnum } from "@prisma/client";

type Project = {
  id: string;
  status: ProjectStatusEnum;
  updatedAt: Date;
  property: {
    id: string;
    title: string;
    ownerName: string;
    ownerEmail: string;
  };
};

export function AdminProjectsList({
  projects,
  statusOptions,
  currentStatus,
}: {
  projects: Project[];
  statusOptions: { value: string; label: string }[];
  currentStatus: string;
}) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="status" className="text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status"
          value={currentStatus}
          onChange={(e) => {
            const v = e.target.value;
            router.push(v ? `/admin/projects?status=${encodeURIComponent(v)}` : "/admin/projects");
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-700">Property</th>
              <th className="px-4 py-3 font-medium text-slate-700">Owner</th>
              <th className="px-4 py-3 font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 font-medium text-slate-700">Updated</th>
              <th className="px-4 py-3 font-medium text-slate-700" />
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No projects match.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.property.title}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.property.ownerName} ({p.property.ownerEmail})
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                      {p.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="text-slate-700 hover:text-slate-900 underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
