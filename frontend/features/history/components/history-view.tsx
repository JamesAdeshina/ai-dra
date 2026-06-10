import { HistoryEmptyState } from "./history-empty-state";
import { HistoryTable } from "./history-table";

type HistoryViewProps = {
  hasData?: boolean;
};

export function HistoryView({ hasData = false }: HistoryViewProps) {
  return (
    <main className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E1E1E]">
            Session History
          </h1>
          <p className="mt-1 text-[20px] text-[#1E1E1E]">
            Review previous rehabilitation sessions and performance.
          </p>
        </div>

        <div className="flex gap-2">
          {["7 Days", "30 Days", "3 Months", "All Time"].map((label) => (
            <button
              key={label}
              className={`h-[56px] rounded-xl border px-8 text-[14px] font-medium ${
                label === "30 Days"
                  ? "border-[#7875FB] bg-[#7875FB] text-white"
                  : "border-[#06C7A8] bg-transparent text-[#1E1E1E]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-0">
        {hasData ? <HistoryTable /> : <HistoryEmptyState />}
      </div>
    </main>
  );
}