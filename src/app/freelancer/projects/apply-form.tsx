"use client";

import { useActionState } from "react";
import type { ApplyState } from "./actions";

const initialState: ApplyState = {};

export function ApplyForm({
  projectId,
  action,
}: {
  projectId: string;
  action: (prev: ApplyState, formData: FormData) => Promise<ApplyState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  if (state?.success) {
    return (
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="font-medium text-green-800">Application submitted</p>
        <p className="mt-0.5 text-sm text-green-700">The operator will review and get in touch if you’re assigned.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4 border-t border-slate-200 pt-6">
      <input type="hidden" name="projectId" value={projectId} />
      <p className="text-sm font-medium text-slate-700">Apply to this project</p>
      <div>
        <label htmlFor={`name-${projectId}`} className="input-label">Your name</label>
        <input
          id={`name-${projectId}`}
          name="name"
          type="text"
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor={`email-${projectId}`} className="input-label">Email</label>
        <input
          id={`email-${projectId}`}
          name="email"
          type="email"
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor={`message-${projectId}`} className="input-label">Message (optional)</label>
        <textarea
          id={`message-${projectId}`}
          name="message"
          rows={2}
          className="input-field resize-y"
          placeholder="Why you’re a good fit, availability, etc."
        />
      </div>
      {state?.error && (
        <p className="error-text" role="alert">{state.error}</p>
      )}
      <button
        type="submit"
        className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        Submit application
      </button>
    </form>
  );
}
