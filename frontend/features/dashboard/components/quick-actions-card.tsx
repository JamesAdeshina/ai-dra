import Link from "next/link";
import { Bell, Grid2X2, Play, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const actions = [
  {
    title: "Continue Last Exercise",
    subtitle: "Shoulder Flexion",
    href: "/session",
    icon: Play,
  },
  {
    title: "View Progress",
    subtitle: "See your improvement",
    href: "/progress",
    icon: BarChart3,
  },
  {
    title: "Exercise Library",
    subtitle: "Shoulder Flexion",
    href: "/exercises",
    icon: Grid2X2,
  },
  {
    title: "Reminders",
    subtitle: "Manage your reminders",
    href: "/reminders",
    icon: Bell,
  },
];

export function QuickActionsCard() {
  return (
    <Card className="h-[581px] w-full rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[20px] font-semibold leading-[140%] text-[#1E1E1E]">
        Quick Actions
      </h2>

      <div className="mt-[30px] grid grid-cols-2 gap-x-6 gap-y-9">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex h-[217px] flex-col justify-between rounded-lg bg-[#592EBD]/[0.06] p-3 transition hover:bg-[#592EBD]/10"
            >
              <div className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-[#592EBD] text-white">
                <Icon size={24} fill={action.icon === Play ? "white" : "none"} />
              </div>

              <div>
                <h3 className="text-[20px] font-semibold leading-[140%] text-[#1E1E1E]">
                  {action.title}
                </h3>
                <p className="mt-2 text-[14px] font-medium leading-[150%] text-[#424242]">
                  {action.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}