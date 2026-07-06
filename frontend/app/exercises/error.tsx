"use client";

import { AppLayout } from "@/components/layout/app-layout";

type ExercisesErrorProps = {
  reset: () => void;
};

export default function ExercisesError({
  reset,
}: ExercisesErrorProps) {
  return (
    <AppLayout>
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10">
        <h1 className="text-3xl font-bold text-red-900">
          Exercise library unavailable
        </h1>

        <p className="mt-2 max-w-2xl text-lg text-red-800">
          We could not load the rehabilitation
          exercises. Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-[#592EBD] px-5 py-3 font-semibold text-white transition hover:bg-[#4B24A8]"
        >
          Try Again
        </button>
      </div>
    </AppLayout>
  );
}