"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  Check,
  NotebookPen,
  Pencil,
} from "lucide-react";

import { survivorStatusGuide } from "@/features/carer/data/carer-survivors-data";
import type { DirectorySurvivorStatus } from "@/features/carer/types";
import type { SurvivorDetail } from "@/features/carer/types/survivor-detail";
import { cn } from "@/lib/utils";

type SurvivorDetailSidebarProps = {
  survivor: SurvivorDetail;
};

const statusPresentation: Record<
  DirectorySurvivorStatus,
  {
    indicatorClassName: string;
  }
> = {
  ON_TRACK: {
    indicatorClassName: "bg-[#37B976]",
  },
  NEEDS_SUPPORT: {
    indicatorClassName: "bg-[#F2B322]",
  },
  AT_RISK: {
    indicatorClassName: "bg-[#F23636]",
  },
};

function SurvivorStatusGuide() {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex items-center justify-between border-b border-[#EEEAE6] px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F0F8] text-[#592EBD]">
            <Bell size={18} />
          </span>

          <h2 className="truncate font-semibold text-[#332E2B]">
            Survivor Status Guide
          </h2>
        </div>

        <button
          type="button"
          className="shrink-0 text-xs font-semibold text-[#3478EA] hover:underline"
        >
          View all
        </button>
      </div>

      <div className="divide-y divide-[#F0ECE8] px-4">
        {survivorStatusGuide.map((item) => {
          const presentation =
            statusPresentation[item.status];

          return (
            <article
              key={item.status}
              className="flex gap-3 py-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F3F1]">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full",
                    presentation.indicatorClassName,
                  )}
                >
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </span>

              <div>
                <h3 className="text-sm font-medium text-[#3A3532]">
                  {item.label}
                </h3>

                <p className="mt-1 text-xs leading-5 text-[#817A75]">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CaregiverNotesCard({
  survivor,
}: {
  survivor: SurvivorDetail;
}) {
  const [note, setNote] = useState(
    survivor.carerNote.content,
  );

  const [savedNote, setSavedNote] = useState(
    survivor.carerNote.content,
  );

  const [lastUpdated, setLastUpdated] = useState(
    survivor.carerNote.lastUpdatedLabel,
  );

  const noteChanged = note.trim() !== savedNote.trim();

  function saveNote() {
    setSavedNote(note);
    setLastUpdated("Just now");
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex items-center justify-between border-b border-[#EEEAE6] px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F0F8] text-[#592EBD]">
            <NotebookPen size={18} />
          </span>

          <h2 className="font-semibold leading-5 text-[#332E2B]">
            Caregiver Notes
            <span className="block">(Private)</span>
          </h2>
        </div>

        <Link
          href={`/carer/survivors/${survivor.id}/notes`}
          className="shrink-0 text-xs font-semibold text-[#3478EA] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="p-3">
        <div className="relative min-h-[205px] rounded-xl bg-[#FFF2BE] p-3">
          <label
            htmlFor={`sidebar-note-${survivor.id}`}
            className="sr-only"
          >
            Private note about {survivor.name}
          </label>

          <textarea
            id={`sidebar-note-${survivor.id}`}
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            placeholder="Add a note..."
            rows={7}
            className="w-full resize-none bg-transparent pr-7 text-sm leading-6 text-[#443E39] outline-none placeholder:text-[#5E5752]"
          />

          <Pencil
            size={17}
            className="absolute bottom-3 right-3 text-[#47413C]"
          />

          <div className="mt-3 flex flex-col gap-3">
            <p className="pr-6 text-xs text-[#756D67]">
              Last Updated: {lastUpdated}
            </p>

            {noteChanged ? (
              <button
                type="button"
                onClick={saveNote}
                className="inline-flex min-h-9 w-fit items-center justify-center gap-2 rounded-full bg-[#592EBD] px-4 text-xs font-semibold text-white transition hover:bg-[#4B24A8]"
              >
                <Check size={14} />
                Save Note
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SurvivorDetailSidebar({
  survivor,
}: SurvivorDetailSidebarProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-[118px]">
      <SurvivorStatusGuide />
      <CaregiverNotesCard survivor={survivor} />
    </aside>
  );
}