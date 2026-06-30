import type { LucideIcon } from "lucide-react";
import {
  Bell,
  LayoutDashboard,
  Link2,
  Settings,
  Users,
} from "lucide-react";

export type CarerNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  separatorBefore?: boolean;
};

export const carerNavigationItems: CarerNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/carer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Survivors",
    href: "/carer/survivors",
    icon: Users,
  },
  {
    label: "Notifications",
    href: "/carer/notifications",
    icon: Bell,
  },
  {
    label: "Invite / Link Survivor",
    href: "/carer/invitations",
    icon: Link2,
    separatorBefore: true,
  },
  {
    label: "Settings",
    href: "/carer/settings",
    icon: Settings,
    separatorBefore: true,
  },
];
