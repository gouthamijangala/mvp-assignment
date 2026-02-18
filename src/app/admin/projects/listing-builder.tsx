"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveListingFromForm, publishListing } from "./[id]/actions";

type Project = {
  id: string;
  property: {
    id: string;
    title: string;
    description: string;
    baseNightlyRate: number;
    maxGuests: number;
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
};

export function ListingBuilder({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const listing = selectedProject?.property.listing ?? null;
  const prop = selectedProject?.property;

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.set("projectId", selectedProjectId);
    try {
      await saveListingFromForm(formData);
      setSuccessMessage("Listing saved successfully!");
      router.refresh();
    } catch (error) {
      setSuccessMessage("Error saving listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedProjectId || !listing) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await publishListing(selectedProjectId);
      setSuccessMessage("Listing published successfully!");
      router.refresh();
    } catch (error) {
      setSuccessMessage("Error publishing listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Create or Edit Listing</h2>
        <p className="text-sm text-slate-600">
          Select a project to create or edit its listing. Once saved, you can publish it to make it visible to guests.
        </p>
      </div>

      <div>
        <label htmlFor="project-select" className="block text-sm font-medium text-slate-700 mb-2">
          Select Project
        </label>
        <select
          id="project-select"
          value={selectedProjectId}
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            setSuccessMessage(null);
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">Choose a project...</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.property.title} {p.property.listing ? "(has listing)" : "(no listing)"}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && prop && (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
              Slug (URL)
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={listing?.slug ?? prop.title.replace(/\s+/g, "-").toLowerCase()}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="property-name"
            />
            <p className="text-xs text-slate-500 mt-1">Used in the public URL: /stays/[slug]</p>
          </div>

          <div>
            <label htmlFor="listingTitle" className="block text-sm font-medium text-slate-700 mb-1">
              Listing Title
            </label>
            <input
              id="listingTitle"
              name="listingTitle"
              defaultValue={listing?.title ?? prop.title}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label htmlFor="listingDescription" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="listingDescription"
              name="listingDescription"
              defaultValue={listing?.description ?? prop.description}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="nightlyRate" className="block text-sm font-medium text-slate-700 mb-1">
                Nightly Rate ($)
              </label>
              <input
                id="nightlyRate"
                name="nightlyRate"
                type="number"
                defaultValue={listing?.nightlyRate ?? prop.baseNightlyRate}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label htmlFor="cleaningFee" className="block text-sm font-medium text-slate-700 mb-1">
                Cleaning Fee ($)
              </label>
              <input
                id="cleaningFee"
                name="cleaningFee"
                type="number"
                defaultValue={listing?.cleaningFee ?? 0}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label htmlFor="maxGuests" className="block text-sm font-medium text-slate-700 mb-1">
                Max Guests
              </label>
              <input
                id="maxGuests"
                name="maxGuests"
                type="number"
                defaultValue={listing?.maxGuests ?? prop.maxGuests}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="guestPhotos" className="block text-sm font-medium text-slate-700 mb-1">
              Guest Photos (optional)
            </label>
            <input
              id="guestPhotos"
              name="guestPhotos"
              type="file"
              accept="image/*"
              multiple
              className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-slate-800"
            />
            <p className="text-xs text-slate-500 mt-1">
              Upload photos that will be shown on the public stay page. These replace the original property photos if provided.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-800 text-white px-4 py-2 text-sm font-medium hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Draft"}
            </button>
            {listing && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || listing.status === "PUBLISHED"}
                className="rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {listing.status === "PUBLISHED" ? "Published" : "Publish"}
              </button>
            )}
          </div>

          {successMessage && (
            <div
              className={`rounded-lg p-3 text-sm ${
                successMessage.includes("Error")
                  ? "bg-red-50 text-red-800"
                  : "bg-green-50 text-green-800"
              }`}
            >
              {successMessage}
            </div>
          )}
        </form>
      )}

      {selectedProjectId && !selectedProject && (
        <p className="text-sm text-slate-500">Project not found.</p>
      )}
    </div>
  );
}
