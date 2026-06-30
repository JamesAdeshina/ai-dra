import { ChevronDown } from "lucide-react";

import type { WeeklyProgressPoint } from "@/features/carer/types";

type WeeklyProgressCardProps = {
  points: WeeklyProgressPoint[];
};

export function WeeklyProgressCard({
  points,
}: WeeklyProgressCardProps) {
  const chartWidth = 660;
  const chartHeight = 180;
  const horizontalPadding = 22;
  const topPadding = 20;
  const bottomPadding = 35;
  const minValue = 55;
  const maxValue = 85;
  const usableHeight = chartHeight - topPadding - bottomPadding;
  const step =
    (chartWidth - horizontalPadding * 2) / Math.max(points.length - 1, 1);

  const coordinates = points.map((point, index) => {
    const x = horizontalPadding + index * step;
    const y =
      topPadding +
      ((maxValue - point.value) / (maxValue - minValue)) * usableHeight;

    return { ...point, x, y };
  });

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${
    coordinates[coordinates.length - 1]?.x ?? horizontalPadding
  } ${chartHeight - bottomPadding} L ${coordinates[0]?.x ?? horizontalPadding} ${
    chartHeight - bottomPadding
  } Z`;

  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold text-[#332E2B]">
          Weekly Progress Summary (All Survivors)
        </h2>

        <button
          type="button"
          className="flex h-10 w-fit items-center gap-4 rounded-xl border border-[#DEDAD6] px-4 text-sm font-medium text-[#4A4541]"
        >
          This Week
          <ChevronDown size={17} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_130px] lg:items-center">
        <div className="min-w-0 overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-[210px] min-w-[560px] w-full"
            role="img"
            aria-label="Weekly average rehabilitation completion chart"
          >
            <defs>
              <linearGradient id="carer-progress-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BDA9F2" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#EDE7FB" stopOpacity="0.12" />
              </linearGradient>
            </defs>

            {[60, 70, 80].map((value) => {
              const y =
                topPadding +
                ((maxValue - value) / (maxValue - minValue)) * usableHeight;

              return (
                <g key={value}>
                  <line
                    x1={horizontalPadding}
                    x2={chartWidth - horizontalPadding}
                    y1={y}
                    y2={y}
                    stroke="#EEEAE6"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y={y + 4}
                    fill="#9A928D"
                    fontSize="10"
                  >
                    {value}%
                  </text>
                </g>
              );
            })}

            <path d={areaPath} fill="url(#carer-progress-fill)" />
            <path
              d={linePath}
              fill="none"
              stroke="#592EBD"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {coordinates.map((point, index) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={index === coordinates.length - 1 ? 5 : 4}
                  fill={index === coordinates.length - 1 ? "white" : "#592EBD"}
                  stroke="#592EBD"
                  strokeWidth={index === coordinates.length - 1 ? 3 : 1}
                />
                <text
                  x={point.x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fill="#817A75"
                  fontSize="11"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <aside className="rounded-2xl bg-[#F3EEFC] p-4 lg:min-h-[125px]">
          <p className="text-sm font-medium text-[#443C4D]">This Week</p>
          <p className="mt-2 text-[38px] font-bold leading-none text-[#5322E3]">
            76%
          </p>
          <p className="mt-4 text-xs leading-5 text-[#817A75]">
            Average Completion
          </p>
        </aside>
      </div>
    </section>
  );
}
