"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  ChevronDown,
  FileText,
  Info,
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react";

import type { SurvivorSharedNote } from "@/features/carer/types/shared-note";

type SurvivorNotesViewProps = {
  survivorId: string;
  survivorName: string;
  initialNotes: SurvivorSharedNote[];
};

type FeedbackMessage = {
  message: string;
  type: "success" | "error";
};

const INITIAL_VISIBLE_NOTES = 3;

function createCurrentDateLabel() {
  const currentDate = new Date();

  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(currentDate);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(currentDate);

  return `${date} • ${time}`;
}

export function SurvivorNotesView({
  survivorId,
  survivorName,
  initialNotes,
}: SurvivorNotesViewProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const [notes, setNotes] =
    useState<SurvivorSharedNote[]>(initialNotes);

  const [draft, setDraft] = useState("");
  const [editingNoteId, setEditingNoteId] =
    useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(
    INITIAL_VISIBLE_NOTES,
  );

  const [feedback, setFeedback] =
    useState<FeedbackMessage | null>(null);

  const [notePendingDeletion, setNotePendingDeletion] =
    useState<SurvivorSharedNote | null>(null);

  const isEditing = editingNoteId !== null;

  const visibleNotes = useMemo(
    () => notes.slice(0, visibleCount),
    [notes, visibleCount],
  );

  const hasOlderNotes = visibleCount < notes.length;

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [feedback]);

  function resetForm() {
    setDraft("");
    setEditingNoteId(null);
  }

  function handleSubmit() {
    const cleanContent = draft.trim();

    if (!cleanContent) {
      setFeedback({
        message: "Please enter a note before saving.",
        type: "error",
      });

      return;
    }

    if (editingNoteId) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                content: cleanContent,
                updatedAtLabel: "Edited just now",
              }
            : note,
        ),
      );

      setFeedback({
        message: "Note updated successfully.",
        type: "success",
      });

      resetForm();
      return;
    }

    const newNote: SurvivorSharedNote = {
      id: `shared-note-${Date.now()}`,
      survivorId,
      authorName: "Haruna Nayaya",
      content: cleanContent,
      createdAt: new Date().toISOString(),
      createdAtLabel: createCurrentDateLabel(),
    };

    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ]);

    setVisibleCount((currentCount) =>
      Math.max(
        INITIAL_VISIBLE_NOTES,
        currentCount,
      ),
    );

    setFeedback({
      message: "Note saved successfully.",
      type: "success",
    });

    resetForm();
  }

  function handleEdit(note: SurvivorSharedNote) {
    setDraft(note.content);
    setEditingNoteId(note.id);

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function confirmDelete() {
    if (!notePendingDeletion) {
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) =>
          note.id !== notePendingDeletion.id,
      ),
    );

    if (
      editingNoteId === notePendingDeletion.id
    ) {
      resetForm();
    }

    setNotePendingDeletion(null);

    setFeedback({
      message: "Note deleted successfully.",
      type: "success",
    });
  }

  return (
    <>
      {feedback ? (
        <div
          role="status"
          className={`fixed left-4 right-4 top-24 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg sm:left-auto sm:right-6 sm:w-[360px] ${
            feedback.type === "success"
              ? "border-[#BCE8CE] bg-[#ECFAF2] text-[#18774A]"
              : "border-[#F4C5C5] bg-[#FFF1F1] text-[#B72F2F]"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2
              size={20}
              className="shrink-0"
            />
          ) : (
            <Info
              size={20}
              className="shrink-0"
            />
          )}

          <p className="flex-1 text-sm font-medium">
            {feedback.message}
          </p>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
        <div
          ref={formRef}
          className="scroll-mt-28 p-4 sm:p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#292522]">
                {isEditing
                  ? "Edit Note"
                  : "Add New Note"}
              </h2>

              <p className="mt-1 text-xs text-[#746D68]">
                Shared Rehabilitation Note
              </p>
            </div>

            {isEditing ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#746D68] hover:text-[#592EBD]"
              >
                <X size={16} />
                Cancel editing
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex gap-3 rounded-xl bg-[#F3EFFF] px-4 py-3 text-sm leading-6 text-[#5A467E]">
            <Info
              size={19}
              className="mt-0.5 shrink-0 text-[#592EBD]"
            />

            <p>
              This note is intended to be shared with{" "}
              <strong>{survivorName}</strong>. The
              private yellow carer note remains visible
              only to the carer.
            </p>
          </div>

          <label
            htmlFor="shared-survivor-note"
            className="mt-4 block text-sm font-medium text-[#514B47]"
          >
            Note
          </label>

          <textarea
            id="shared-survivor-note"
            value={draft}
            onChange={(event) =>
              setDraft(event.target.value)
            }
            placeholder={`Write a note about ${survivorName}'s progress, support provided or general observations...`}
            rows={5}
            maxLength={1000}
            className="mt-2 w-full resize-y rounded-xl border border-[#DDD8D4] px-4 py-4 text-sm leading-6 text-[#332E2B] outline-none transition placeholder:text-[#A09A96] focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-[#8B837E]">
              {draft.length}/1000
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim()}
            className="mt-2 inline-flex min-h-12 min-w-[174px] items-center justify-center gap-2 rounded-full bg-[#592EBD] px-6 text-sm font-semibold text-white transition hover:bg-[#4B24A8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={17} />

            {isEditing
              ? "Save Edit"
              : "Save Note"}
          </button>
        </div>

        <div className="mx-4 border-t border-[#E8E4E0] sm:mx-5" />

        <div className="p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-[#292522]">
            Recent Notes
          </h2>

          {notes.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECFF] text-[#592EBD]">
                <FileText size={28} />
              </span>

              <h3 className="mt-4 text-lg font-semibold text-[#292522]">
                No shared notes yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#746D68]">
                Notes shared with {survivorName} will
                appear here after they are added.
              </p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-[#ECE8E4]">
              {visibleNotes.map((note) => (
                <article
                  key={note.id}
                  className="grid gap-4 py-4 sm:grid-cols-[52px_minmax(0,1fr)_96px]"
                >
                  <span className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-[#F5F2F0] text-[#625C57]">
                    <FileText size={20} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#292522]">
                      {note.createdAtLabel}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#817A75]">
                      {note.content}
                    </p>

                    <p className="mt-2 text-xs text-[#918A85]">
                      Added by {note.authorName}
                      {note.updatedAtLabel
                        ? ` • ${note.updatedAtLabel}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(note)
                      }
                      aria-label={`Edit note from ${note.createdAtLabel}`}
                      title="Edit note"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F2F1] text-[#514B47] transition hover:bg-[#E9E3F8] hover:text-[#592EBD]"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setNotePendingDeletion(note)
                      }
                      aria-label={`Delete note from ${note.createdAtLabel}`}
                      title="Delete note"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F2F1] text-[#514B47] transition hover:bg-[#FFF0F0] hover:text-[#D33B3B]"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {hasOlderNotes ? (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((current) =>
                  Math.min(
                    current + 3,
                    notes.length,
                  ),
                )
              }
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 border-t border-[#ECE8E4] pt-4 text-sm font-medium text-[#403B37] hover:text-[#592EBD]"
            >
              Load older notes
              <ChevronDown size={17} />
            </button>
          ) : null}
        </div>
      </section>

      {notePendingDeletion ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-note-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F0] text-[#F23636]">
              <Trash2 size={25} />
            </span>

            <h2
              id="delete-note-title"
              className="mt-5 text-xl font-semibold text-[#292522]"
            >
              Delete this note?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#746D68]">
              This will remove the shared note. This
              action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setNotePendingDeletion(null)
                }
                className="min-h-11 rounded-full border border-[#DDD8D4] px-6 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="min-h-11 rounded-full bg-[#F23636] px-6 text-sm font-semibold text-white hover:bg-[#D92D2D]"
              >
                Delete Note
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}