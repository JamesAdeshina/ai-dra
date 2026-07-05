import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  ClipboardList,
  Dumbbell,
  HeartHandshake,
  LayoutDashboard,
  MailPlus,
  Settings,
  Users,
} from "lucide-react";

export type AdminNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  separatorBefore?: boolean;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Survivors",
    href: "/admin/survivors",
    icon: Users,
  },
  {
    label: "Carers",
    href: "/admin/carers",
    icon: HeartHandshake,
  },
  {
    label: "Invitations",
    href: "/admin/invitations",
    icon: MailPlus,
  },
  {
    label: "Sessions",
    href: "/admin/sessions",
    icon: ClipboardList,
  },
  {
    label: "Exercises",
    href: "/admin/exercises",
    icon: Dumbbell,
    separatorBefore: true,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    separatorBefore: true,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];