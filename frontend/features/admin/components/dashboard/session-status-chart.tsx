import type { AdminSessionStatus } from "@/features/admin/types";

type SessionStatusChartProps = {
  data: AdminSessionStatus[];
};

export function SessionStatusChart({ data }: SessionStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentPercentage = 0;

  const gradientSections = data.map((item) => {
    const start = currentPercentage;
    const percentage = total === 0 ? 0 : (item.value / total) * 100;
    const end = start + percentage;

    currentPercentage = end;

    return `${item.colour} ${start}% ${end}%`;
  });

  const gradient =
    total === 0
      ? "#EEEAE6"
      : `conic-gradient(${gradientSections.join(", ")})`;

  return (
    <article className="rounded-2xl border border-[#E8E4E1] bg-white p-5 shadow-[0_2px_10px_rgba(35,30,28,0.035)]">
      <div>
        <h2 className="text-base font-semibold text-[#282422]">
          Session Status
        </h2>

        <p className="mt-1 text-sm text-[#7D7671]">
          Current demo session outcomes.
        </p>
      </div>

      <div className="mt-7 flex flex-col items-center gap-8 sm:flex-row xl:flex-col 2xl:flex-row">
        <div
          className="relative h-48 w-48 shrink-0 rounded-full"
          style={{ background: gradient }}
          aria-label={`${total} sessions represented in the status chart`}
        >
          <div className="absolute inset-[31%] flex flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="text-2xl font-bold text-[#25211F]">{total}</span>
            <span className="text-[11px] text-[#817A75]">sessions</span>
          </div>
        </div>

        <div className="w-full space-y-4">
          {data.map((item) => {
            const percentage =
              total === 0 ? 0 : Math.round((item.value / total) * 100);

            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.colour }}
                  />

                  <span className="text-sm text-[#625C58]">{item.label}</span>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-[#2A2623]">
                    {item.value}
                  </p>

                  <p className="text-xs text-[#8C8580]">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-[#EEEAE6] pt-4">
        <p className="text-sm text-[#625C58]">
          Total sessions:{" "}
          <span className="font-semibold text-[#282422]">{total}</span>
        </p>
      </div>
    </article>
  );
}