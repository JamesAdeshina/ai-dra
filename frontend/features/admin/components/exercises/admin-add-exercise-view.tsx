"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  Info,
  Upload,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AdminExerciseDraft,
} from "@/features/admin/types/admin-exercise";
import { cn } from "@/lib/utils";

const steps = [
  "Basic Information",
  "Difficulty & Level",
  "Instructions & Steps",
  "Benefits & Activities",
  "Demonstration & Media",
  "Status & Visibility",
  "Advanced Settings",
];

const initialDraft: AdminExerciseDraft = {
  title: "",
  slug: "",
  description: "",
  category: "",
  exerciseType: "",
  aratDomain: "",
  trackingType: "",
  requiresObject: "",

  level: "",
  difficulty: "",
  progressionOrder: "",
  targetRepetitions: "",
  estimatedDuration: "",
  holdDuration: "",
  primaryMovementFocus: "",
  secondaryMovementFocus: "",

  shortInstruction: "",
  detailedInstructions: "",
  exerciseSteps: "",
  safetyNotes: "",
  coachingCues: "",

  benefits: "",
  activities: "",

  thumbnailName: "",
  startImageName: "",
  activeImageName: "",
  demonstrationVideoName: "",
  demoFallbackIcon: "",
  demoHelperText: "",
  demoCaption: "",

  publicationStatus: "Draft",
  visibilityScope: "All survivors",
  availableFrom: "",
  availableUntil: "",

  confidenceThreshold: "",
  minimumRangeOfMotion: "",
  minimumHoldTime: "",
  maximumMovementSpeed: "",
  compensationSensitivity: "",
};

export function AdminAddExerciseView() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] =
    useState<AdminExerciseDraft>(initialDraft);
  const [message, setMessage] =
    useState<string | null>(null);
  const [created, setCreated] = useState(false);

  const currentStepValid = useMemo(
    () => validateStep(step, draft),
    [step, draft]
  );

  const update = <K extends keyof AdminExerciseDraft>(
    key: K,
    value: AdminExerciseDraft[K]
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage(null);
  };

  const nextStep = () => {
    if (!currentStepValid) {
      setMessage(
        "Complete the required fields before continuing."
      );
      return;
    }

    setStep((current) => Math.min(7, current + 1));
    setMessage(null);
  };

  const previousStep = () => {
    setStep((current) => Math.max(1, current - 1));
    setMessage(null);
  };

  const saveDraft = () => {
    window.localStorage.setItem(
      "ai-dra-admin-exercise-draft",
      JSON.stringify(draft)
    );

    setMessage(
      "The prototype draft has been saved in this browser."
    );
  };

  const createExercise = () => {
    if (!validateAll(draft)) {
      setMessage(
        "Some required fields are incomplete. Review the earlier steps."
      );
      return;
    }

    setCreated(true);
    setMessage(
      "Prototype exercise prepared successfully. It has not been written to Supabase."
    );
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1650px]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#201D1B]">
              Add Exercise
            </h1>

            <p className="mt-2 text-sm text-[#68615D] sm:text-base">
              Create a rehabilitation exercise prototype and
              prepare its catalogue, tracking and engagement
              details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/exercises"
              className="inline-flex h-11 items-center rounded-xl border border-[#DDD8D4] bg-white px-5 text-sm font-semibold text-[#514B47]"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-5 text-sm font-semibold text-[#514B47]"
            >
              <Bookmark size={17} />
              Save as Draft
            </button>

            {step > 1 ? (
              <button
                type="button"
                onClick={previousStep}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-5 text-sm font-semibold text-[#514B47]"
              >
                <ArrowLeft size={17} />
                Back
              </button>
            ) : null}

            {step < 7 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white"
              >
                Next Step
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                type="button"
                onClick={createExercise}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white"
              >
                Create Exercise
                <Check size={17} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-7 overflow-x-auto rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
          <div className="flex min-w-[1050px] items-start justify-between gap-4">
            {steps.map((label, index) => {
              const number = index + 1;
              const completed = number < step;
              const active = number === step;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (number <= step) {
                      setStep(number);
                    }
                  }}
                  className="flex min-w-32 flex-1 items-start gap-3 text-left"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                      completed || active
                        ? "border-[#592EBD] bg-[#592EBD] text-white"
                        : "border-[#D8D2CE] bg-white text-[#77706B]"
                    )}
                  >
                    {completed ? (
                      <Check size={16} />
                    ) : (
                      number
                    )}
                  </span>

                  <span>
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        active
                          ? "text-[#592EBD]"
                          : "text-[#393432]"
                      )}
                    >
                      {label}
                    </span>

                    <span className="mt-1 block text-xs text-[#817A75]">
                      Step {number} of 7
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {message ? (
          <div className="mt-5 flex gap-3 rounded-xl border border-[#D9D0F0] bg-[#FAF8FF] p-4 text-sm text-[#625A6D]">
            <Info
              size={19}
              className="shrink-0 text-[#592EBD]"
            />
            {message}
          </div>
        ) : null}

        {created ? (
          <div className="mt-5 flex gap-3 rounded-xl border border-[#BFE8D1] bg-[#F0FBF5] p-4">
            <CheckCircle2
              size={20}
              className="shrink-0 text-[#20A663]"
            />

            <div>
              <p className="font-semibold text-[#176B43]">
                Exercise prototype ready
              </p>

              <p className="mt-1 text-sm text-[#3E6E57]">
                Database creation will be enabled after the
                exercise schema and administrator permissions
                are finalised.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          {step === 1 ? (
            <BasicInformation
              draft={draft}
              update={update}
            />
          ) : null}

          {step === 2 ? (
            <DifficultyLevel
              draft={draft}
              update={update}
            />
          ) : null}

          {step === 3 ? (
            <InstructionsSteps
              draft={draft}
              update={update}
            />
          ) : null}

          {step === 4 ? (
            <BenefitsActivities
              draft={draft}
              update={update}
            />
          ) : null}

          {step === 5 ? (
            <DemonstrationMedia
              draft={draft}
              update={update}
            />
          ) : null}

          {step === 6 ? (
            <StatusVisibility
              draft={draft}
              update={update}
            />
          ) : null}

          {step === 7 ? (
            <AdvancedReview
              draft={draft}
              update={update}
            />
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-[#EEEAE6] pt-5">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 1}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-5 text-sm font-semibold disabled:opacity-40"
            >
              <ArrowLeft size={17} />
              Previous Step
            </button>

            {step < 7 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white"
              >
                Next Step
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                type="button"
                onClick={createExercise}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white"
              >
                Create Exercise
                <Check size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type UpdateDraft = <
  K extends keyof AdminExerciseDraft
>(
  key: K,
  value: AdminExerciseDraft[K]
) => void;

type StepProps = {
  draft: AdminExerciseDraft;
  update: UpdateDraft;
};

function BasicInformation({
  draft,
  update,
}: StepProps) {
  return (
    <>
      <StepHeading
        number={1}
        title="Basic Information"
        description="Provide the essential catalogue and tracking details."
      />

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <InputField
          label="Exercise Title"
          required
          value={draft.title}
          onChange={(value) => {
            update("title", value);

            if (!draft.slug) {
              update(
                "slug",
                value
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")
              );
            }
          }}
          placeholder="e.g. Target Touch"
        />

        <InputField
          label="Exercise Slug"
          required
          value={draft.slug}
          onChange={(value) => update("slug", value)}
          placeholder="e.g. target-touch"
        />
      </div>

      <div className="mt-5">
        <TextAreaField
          label="Description"
          required
          value={draft.description}
          onChange={(value) =>
            update("description", value)
          }
          placeholder="Describe the purpose and overall goal."
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SelectField
          label="Category"
          required
          value={draft.category}
          onChange={(value) =>
            update("category", value)
          }
          options={[
            "Functional Upper Limb Task",
            "Functional Hand Task",
            "Functional Object Task",
            "Hand and Finger Exercise",
            "Fine Motor Task",
          ]}
        />

        <SelectField
          label="Exercise Type"
          required
          value={draft.exerciseType}
          onChange={(value) =>
            update("exerciseType", value)
          }
          options={[
            "Gross Arm Movement",
            "Grasp / Grip",
            "Grip / Pinch",
            "Fine Dexterity",
            "Object Manipulation",
          ]}
        />

        <SelectField
          label="ARAT Domain"
          required
          value={draft.aratDomain}
          onChange={(value) =>
            update("aratDomain", value)
          }
          options={[
            "Gross Arm Movement",
            "Grasp",
            "Grip",
            "Pinch",
          ]}
        />

        <SelectField
          label="Tracking Type"
          required
          value={draft.trackingType}
          onChange={(value) =>
            update("trackingType", value)
          }
          options={[
            "Pose Tracking",
            "Hand Tracking",
            "Pose + Object Task",
            "Fine Hand Tracking",
          ]}
        />
      </div>

      <div className="mt-5 rounded-xl border border-[#E4DFDB] p-5">
        <p className="font-semibold text-[#393432]">
          Requires a physical object or prop?
        </p>

        <div className="mt-4 flex flex-wrap gap-5">
          <RadioOption
            label="Yes, requires an object"
            checked={draft.requiresObject === "yes"}
            onChange={() =>
              update("requiresObject", "yes")
            }
          />

          <RadioOption
            label="No, bodyweight only"
            checked={draft.requiresObject === "no"}
            onChange={() =>
              update("requiresObject", "no")
            }
          />
        </div>
      </div>
    </>
  );
}

function DifficultyLevel({
  draft,
  update,
}: StepProps) {
  return (
    <>
      <StepHeading
        number={2}
        title="Difficulty & Level"
        description="Define progression, dosage and movement focus."
      />

      <div className="mt-7 grid gap-5 md:grid-cols-3">
        <SelectField
          label="Level"
          required
          value={draft.level}
          onChange={(value) =>
            update("level", value)
          }
          options={["Level 1", "Level 2", "Level 3"]}
        />

        <SelectField
          label="Difficulty"
          required
          value={draft.difficulty}
          onChange={(value) =>
            update(
              "difficulty",
              value as AdminExerciseDraft["difficulty"]
            )
          }
          options={["Easy", "Medium", "Hard"]}
        />

        <InputField
          label="Progression Order"
          value={draft.progressionOrder}
          onChange={(value) =>
            update("progressionOrder", value)
          }
          placeholder="e.g. 1"
        />
      </div>

      <h3 className="mt-8 font-bold text-[#282422]">
        Recommended Dosage
      </h3>

      <div className="mt-4 grid gap-5 md:grid-cols-3">
        <InputField
          label="Target Repetitions"
          required
          value={draft.targetRepetitions}
          onChange={(value) =>
            update("targetRepetitions", value)
          }
          placeholder="e.g. 10"
        />

        <InputField
          label="Estimated Duration (minutes)"
          required
          value={draft.estimatedDuration}
          onChange={(value) =>
            update("estimatedDuration", value)
          }
          placeholder="e.g. 5"
        />

        <InputField
          label="Hold Duration (seconds)"
          value={draft.holdDuration}
          onChange={(value) =>
            update("holdDuration", value)
          }
          placeholder="e.g. 2"
        />
      </div>

      <h3 className="mt-8 font-bold text-[#282422]">
        Movement Focus
      </h3>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <InputField
          label="Primary Movement Focus"
          required
          value={draft.primaryMovementFocus}
          onChange={(value) =>
            update("primaryMovementFocus", value)
          }
          placeholder="e.g. Controlled reaching"
        />

        <InputField
          label="Secondary Movement Focus"
          value={draft.secondaryMovementFocus}
          onChange={(value) =>
            update("secondaryMovementFocus", value)
          }
          placeholder="Optional"
        />
      </div>
    </>
  );
}

function InstructionsSteps({
  draft,
  update,
}: StepProps) {
  return (
    <>
      <StepHeading
        number={3}
        title="Instructions & Steps"
        description="Add clear instructions, safety information and coaching cues."
      />

      <div className="mt-7 space-y-5">
        <InputField
          label="Short Instruction"
          required
          value={draft.shortInstruction}
          onChange={(value) =>
            update("shortInstruction", value)
          }
          placeholder="e.g. Reach forward and touch the target."
        />

        <TextAreaField
          label="Detailed Instructions"
          required
          value={draft.detailedInstructions}
          onChange={(value) =>
            update("detailedInstructions", value)
          }
          placeholder="Explain how the exercise should be performed."
        />

        <TextAreaField
          label="Exercise Steps"
          required
          value={draft.exerciseSteps}
          onChange={(value) =>
            update("exerciseSteps", value)
          }
          placeholder="Enter one step per line."
        />

        <TextAreaField
          label="Safety Notes"
          value={draft.safetyNotes}
          onChange={(value) =>
            update("safetyNotes", value)
          }
          placeholder="Add relevant safety guidance."
        />

        <TextAreaField
          label="Coaching Cues"
          value={draft.coachingCues}
          onChange={(value) =>
            update("coachingCues", value)
          }
          placeholder="Enter one coaching cue per line."
        />
      </div>
    </>
  );
}

function BenefitsActivities({
  draft,
  update,
}: StepProps) {
  return (
    <>
      <StepHeading
        number={4}
        title="Benefits & Activities"
        description="Explain the functional purpose and real-life relevance."
      />

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <TextAreaField
          label="Key Benefits"
          required
          value={draft.benefits}
          onChange={(value) =>
            update("benefits", value)
          }
          placeholder="Enter one benefit per line."
          rows={12}
        />

        <TextAreaField
          label="Real-Life Activities"
          required
          value={draft.activities}
          onChange={(value) =>
            update("activities", value)
          }
          placeholder="Enter one activity per line."
          rows={12}
        />
      </div>
    </>
  );
}

function DemonstrationMedia({
  draft,
  update,
}: StepProps) {
  return (
    <>
      <StepHeading
        number={5}
        title="Demonstration & Media"
        description="Prepare visual and video resources for the exercise."
      />

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <FileField
          label="Thumbnail Image"
          required
          value={draft.thumbnailName}
          onChange={(value) =>
            update("thumbnailName", value)
          }
        />

        <FileField
          label="Start State Image"
          value={draft.startImageName}
          onChange={(value) =>
            update("startImageName", value)
          }
        />

        <FileField
          label="Active State Image"
          value={draft.activeImageName}
          onChange={(value) =>
            update("activeImageName", value)
          }
        />

        <FileField
          label="Demonstration Video"
          value={draft.demonstrationVideoName}
          onChange={(value) =>
            update("demonstrationVideoName", value)
          }
        />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <InputField
          label="Fallback Icon"
          value={draft.demoFallbackIcon}
          onChange={(value) =>
            update("demoFallbackIcon", value)
          }
          placeholder="e.g. Target icon"
        />

        <TextAreaField
          label="Demo Helper Text"
          value={draft.demoHelperText}
          onChange={(value) =>
            update("demoHelperText", value)
          }
          placeholder="Short supportive text."
          rows={4}
        />

        <TextAreaField
          label="Demo Caption"
          value={draft.demoCaption}
          onChange={(value) =>
            update("demoCaption", value)
          }
          placeholder="Optional media caption."
          rows={4}
        />
      </div>

      <div className="mt-6 flex gap-3 rounded-xl border border-[#D9D0F0] bg-[#FAF8FF] p-4 text-sm text-[#625A6D]">
        <Info
          size={19}
          className="shrink-0 text-[#592EBD]"
        />

        Files selected here are only represented by
        filename in the frontend prototype. Supabase Storage
        upload will be connected later.
      </div>
    </>
  );
}

function StatusVisibility({
  draft,
  update,
}: StepProps) {
  return (
    <>
      <StepHeading
        number={6}
        title="Status & Visibility"
        description="Define how the exercise should appear in the platform."
      />

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <SelectField
          label="Publication Status"
          required
          value={draft.publicationStatus}
          onChange={(value) =>
            update(
              "publicationStatus",
              value as "Draft" | "Published"
            )
          }
          options={["Draft", "Published"]}
        />

        <SelectField
          label="Visibility Scope"
          required
          value={draft.visibilityScope}
          onChange={(value) =>
            update("visibilityScope", value)
          }
          options={[
            "All survivors",
            "Selected survivors",
            "Research team only",
          ]}
        />

        <InputField
          label="Available From"
          type="date"
          value={draft.availableFrom}
          onChange={(value) =>
            update("availableFrom", value)
          }
        />

        <InputField
          label="Available Until"
          type="date"
          value={draft.availableUntil}
          onChange={(value) =>
            update("availableUntil", value)
          }
        />
      </div>

      <div className="mt-6 flex gap-3 rounded-xl border border-[#F1D89C] bg-[#FFF9EB] p-4 text-sm leading-6 text-[#73551A]">
        <Info size={19} className="shrink-0" />

        Publication controls are prototype-only. No exercise
        will become visible to survivors until database and
        role safeguards are connected.
      </div>
    </>
  );
}

function AdvancedReview({
  draft,
  update,
}: StepProps) {
  return (
    <>
      <StepHeading
        number={7}
        title="Advanced Settings & Review"
        description="Review tracking thresholds and the complete exercise prototype."
      />

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <InputField
          label="Confidence Threshold"
          value={draft.confidenceThreshold}
          onChange={(value) =>
            update("confidenceThreshold", value)
          }
          placeholder="e.g. 0.60"
        />

        <InputField
          label="Minimum Range of Motion"
          value={draft.minimumRangeOfMotion}
          onChange={(value) =>
            update("minimumRangeOfMotion", value)
          }
          placeholder="e.g. 60°"
        />

        <InputField
          label="Minimum Hold Time"
          value={draft.minimumHoldTime}
          onChange={(value) =>
            update("minimumHoldTime", value)
          }
          placeholder="e.g. 1 second"
        />

        <InputField
          label="Maximum Movement Speed"
          value={draft.maximumMovementSpeed}
          onChange={(value) =>
            update("maximumMovementSpeed", value)
          }
          placeholder="e.g. Normal"
        />

        <InputField
          label="Compensation Sensitivity"
          value={draft.compensationSensitivity}
          onChange={(value) =>
            update(
              "compensationSensitivity",
              value
            )
          }
          placeholder="e.g. Medium"
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ReviewCard title="Basic Information">
          <ReviewLine
            label="Title"
            value={draft.title}
          />
          <ReviewLine
            label="Slug"
            value={draft.slug}
          />
          <ReviewLine
            label="Category"
            value={draft.category}
          />
          <ReviewLine
            label="Type"
            value={draft.exerciseType}
          />
          <ReviewLine
            label="Tracking"
            value={draft.trackingType}
          />
        </ReviewCard>

        <ReviewCard title="Difficulty & Dosage">
          <ReviewLine
            label="Level"
            value={draft.level}
          />
          <ReviewLine
            label="Difficulty"
            value={draft.difficulty}
          />
          <ReviewLine
            label="Repetitions"
            value={draft.targetRepetitions}
          />
          <ReviewLine
            label="Duration"
            value={
              draft.estimatedDuration
                ? `${draft.estimatedDuration} minutes`
                : ""
            }
          />
        </ReviewCard>

        <ReviewCard title="Content">
          <ReviewLine
            label="Short Instruction"
            value={draft.shortInstruction}
          />
          <ReviewLine
            label="Benefits"
            value={`${lineCount(
              draft.benefits
            )} items`}
          />
          <ReviewLine
            label="Activities"
            value={`${lineCount(
              draft.activities
            )} items`}
          />
          <ReviewLine
            label="Steps"
            value={`${lineCount(
              draft.exerciseSteps
            )} steps`}
          />
        </ReviewCard>

        <ReviewCard title="Status & Media">
          <ReviewLine
            label="Publication"
            value={draft.publicationStatus}
          />
          <ReviewLine
            label="Visibility"
            value={draft.visibilityScope}
          />
          <ReviewLine
            label="Thumbnail"
            value={
              draft.thumbnailName ||
              "Not selected"
            }
          />
          <ReviewLine
            label="Video"
            value={
              draft.demonstrationVideoName ||
              "Not selected"
            }
          />
        </ReviewCard>
      </div>
    </>
  );
}

function StepHeading({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#282422]">
        {number}. {title}
      </h2>

      <p className="mt-2 text-sm text-[#77706B]">
        {description}
      </p>
    </div>
  );
}

function InputField({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#393432]">
        {label}
        {required ? (
          <span className="text-[#F23636]"> *</span>
        ) : null}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
      />
    </label>
  );
}

function SelectField({
  label,
  required = false,
  value,
  onChange,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#393432]">
        {label}
        {required ? (
          <span className="text-[#F23636]"> *</span>
        ) : null}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
      >
        <option value="">Select an option</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#393432]">
        {label}
        {required ? (
          <span className="text-[#F23636]"> *</span>
        ) : null}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full resize-y rounded-xl border border-[#DDD8D4] bg-white px-4 py-3 text-sm outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
      />
    </label>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-[#514B47]">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#592EBD]"
      />
      {label}
    </label>
  );
}

function FileField({
  label,
  required = false,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#393432]">
        {label}
        {required ? (
          <span className="text-[#F23636]"> *</span>
        ) : null}
      </span>

      <span className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#BFB5D8] bg-[#FAF8FF] px-5 text-center">
        <Upload
          size={24}
          className="text-[#592EBD]"
        />

        <span className="mt-3 text-sm font-semibold text-[#393432]">
          {value || "Select a file"}
        </span>

        <span className="mt-1 text-xs text-[#77706B]">
          Frontend prototype only
        </span>

        <input
          type="file"
          className="sr-only"
          onChange={(event) =>
            onChange(
              event.target.files?.[0]?.name ?? ""
            )
          }
        />
      </span>
    </label>
  );
}

function ReviewCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E4DFDB] p-5">
      <h3 className="font-bold text-[#282422]">
        {title}
      </h3>

      <dl className="mt-4 space-y-3">
        {children}
      </dl>
    </section>
  );
}

function ReviewLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 text-sm sm:grid-cols-[130px_minmax(0,1fr)]">
      <dt className="text-[#77706B]">
        {label}
      </dt>

      <dd className="font-semibold text-[#393432]">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

function lineCount(value: string): number {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function validateStep(
  step: number,
  draft: AdminExerciseDraft
): boolean {
  if (step === 1) {
    return Boolean(
      draft.title &&
        draft.slug &&
        draft.description &&
        draft.category &&
        draft.exerciseType &&
        draft.aratDomain &&
        draft.trackingType &&
        draft.requiresObject
    );
  }

  if (step === 2) {
    return Boolean(
      draft.level &&
        draft.difficulty &&
        draft.targetRepetitions &&
        draft.estimatedDuration &&
        draft.primaryMovementFocus
    );
  }

  if (step === 3) {
    return Boolean(
      draft.shortInstruction &&
        draft.detailedInstructions &&
        draft.exerciseSteps
    );
  }

  if (step === 4) {
    return Boolean(
      draft.benefits &&
        draft.activities
    );
  }

  if (step === 5) {
    return Boolean(draft.thumbnailName);
  }

  if (step === 6) {
    return Boolean(
      draft.publicationStatus &&
        draft.visibilityScope
    );
  }

  return true;
}

function validateAll(
  draft: AdminExerciseDraft
): boolean {
  return [1, 2, 3, 4, 5, 6].every((step) =>
    validateStep(step, draft)
  );
}