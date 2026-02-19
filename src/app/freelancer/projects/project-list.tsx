"use client";

import Link from "next/link";
import { useActionState } from "react";
import { applyToProject } from "./actions";
import { ApplyForm } from "./apply-form";

type Project = {
  id: string;
  property: {
    id: string;
    title: string;
    description: string;
    address: string;
    baseNightlyRate: number;
  };
};

export function FreelancerProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50/70 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-sky-500 shadow-sm">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">No open projects right now</h2>
        <p className="mt-2 text-sm text-slate-700">
          Operators will post new properties here once owner submissions are ready for freelance support. Check back soon.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-sky-700 hover:text-sky-900"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 space-y-6">
      {projects.map((project) => (
        <li
          key={project.id}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">{project.property.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{project.property.address}</p>
          <p className="mt-3 text-sm text-slate-700 line-clamp-3">
            {project.property.description}
          </p>
          <p className="mt-3 text-sm font-medium text-slate-700">
            Est. nightly rate: ₹{project.property.baseNightlyRate.toLocaleString("en-IN")}
          </p>
          <ApplyForm projectId={project.id} action={applyToProject} />
        </li>
      ))}
    </ul>
  );
}
