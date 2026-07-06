import { AppLayout } from "@/components/layout/app-layout";

export default function ExercisesLoading() {
  return (
    <AppLayout>
      <main
        className="space-y-8"
        aria-busy="true"
        aria-label="Loading exercises"
      >
        <div>
          <div className="h-12 w-72 animate-pulse rounded-xl bg-neutral-200" />
          <div className="mt-3 h-7 w-[420px] max-w-full animate-pulse rounded-lg bg-neutral-200" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-5 rounded-2xl bg-white p-4 lg:grid-cols-[112px_minmax(0,1fr)_180px_160px_48px] lg:items-center lg:gap-6"
              >
                <div className="h-[112px] w-[112px] animate-pulse rounded-2xl bg-neutral-200" />

                <div className="space-y-3">
                  <div className="h-7 w-52 animate-pulse rounded-lg bg-neutral-200" />
                  <div className="h-5 w-full animate-pulse rounded-lg bg-neutral-200" />
                  <div className="h-4 w-44 animate-pulse rounded-lg bg-neutral-200" />
                </div>

                <div className="h-[60px] animate-pulse rounded-2xl bg-neutral-200" />

                <div className="space-y-2">
                  <div className="h-8 w-24 animate-pulse rounded-lg bg-neutral-200" />
                  <div className="h-5 w-28 animate-pulse rounded-lg bg-neutral-200" />
                </div>

                <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200" />
              </div>
            )
          )}
        </div>
      </main>
    </AppLayout>
  );
}