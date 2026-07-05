import type { AdminTrendPoint } from "@/features/admin/types";

type SessionTrendChartProps = {
  data: AdminTrendPoint[];
};

const chartWidth = 760;
const chartHeight = 280;
const padding = {
  top: 24,
  right: 20,
  bottom: 44,
  left: 48,
};

const series = [
  {
    key: "sessionsStarted",
    label: "Sessions Started",
    colour: "#592EBD",
  },
  {
    key: "sessionsCompleted",
    label: "Sessions Completed",
    colour: "#F4A623",
  },
  {
    key: "activeSurvivors",
    label: "Active Survivors",
    colour: "#9A8BE8",
  },
] as const;

export function SessionTrendChart({ data }: SessionTrendChartProps) {
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maximumValue = Math.max(
    ...data.flatMap((point) => [
      point.sessionsStarted,
      point.sessionsCompleted,
      point.activeSurvivors,
    ]),
    1
  );

  const roundedMaximum = Math.max(10, Math.ceil(maximumValue / 5) * 5);

  const getX = (index: number) => {
    if (data.length <= 1) return padding.left;

    return padding.left + (index / (data.length - 1)) * innerWidth;
  };

  const getY = (value: number) =>
    padding.top + innerHeight - (value / roundedMaximum) * innerHeight;

  const createPath = (
    key: "sessionsStarted" | "sessionsCompleted" | "activeSurvivors"
  ) =>
    data
      .map((point, index) => {
        const command = index === 0 ? "M" : "L";

        return `${command} ${getX(index)} ${getY(point[key])}`;
      })
      .join(" ");

  const gridValues = Array.from({ length: 5 }, (_, index) =>
    Math.round((roundedMaximum / 4) * index)
  );

  return (
    <article className="rounded-2xl border border-[#E8E4E1] bg-white p-5 shadow-[0_2px_10px_rgba(35,30,28,0.035)]">
      <div>
        <h2 className="text-base font-semibold text-[#282422]">
          Sessions During the Last 7 Days
        </h2>

        <p className="mt-1 text-sm text-[#7D7671]">
          Demo engagement activity across the platform.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-[#EEEAE6] bg-[#FCFBFA] p-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {series.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-2 text-xs text-[#77706B]"
            >
              <span
                className="h-0.5 w-7 rounded-full"
                style={{ backgroundColor: item.colour }}
              />
              {item.label}
            </div>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label="Sessions started, sessions completed and active survivors during the last seven days"
            className="min-w-[620px] w-full"
          >
            {gridValues.map((value) => {
              const y = getY(value);

              return (
                <g key={value}>
                  <line
                    x1={padding.left}
                    x2={chartWidth - padding.right}
                    y1={y}
                    y2={y}
                    stroke="#EAE6E2"
                    strokeWidth="1"
                  />

                  <text
                    x={padding.left - 12}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#928A85"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {data.map((point, index) => {
              const x = getX(index);

              return (
                <g key={point.label}>
                  <line
                    x1={x}
                    x2={x}
                    y1={padding.top}
                    y2={padding.top + innerHeight}
                    stroke="#F0ECE9"
                    strokeWidth="1"
                  />

                  <text
                    x={x}
                    y={chartHeight - 14}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#817A75"
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}

            {series.map((item) => (
              <path
                key={item.key}
                d={createPath(item.key)}
                fill="none"
                stroke={item.colour}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {series.flatMap((item) =>
              data.map((point, index) => (
                <circle
                  key={`${item.key}-${point.label}`}
                  cx={getX(index)}
                  cy={getY(point[item.key])}
                  r="4"
                  fill={item.colour}
                  stroke="white"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              ))
            )}
          </svg>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#817A75]">
        Showing prototype activity for the current seven-day demo period.
      </p>
    </article>
  );
}