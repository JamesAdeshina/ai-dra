import {
  ChevronRight,
  HelpCircle,
  Info,
  Shield,
  User,
  LockKeyhole,
  Users,
} from "lucide-react";

export type SettingsTab =
  | "Personal Information"
  | "Change Password"
  | "Accessibility"
  | "Preferences"
  | "Help & Support"
  | "About";

const items = [
  { label: "Personal Information", icon: User },
  { label: "Change Password", icon: LockKeyhole },
  { label: "Accessibility", icon: Shield },
  { label: "Preferences", icon: Users },
  { label: "Help & Support", icon: HelpCircle },
  { label: "About", icon: Info },
] as const;

type SettingsSidebarProps = {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
};

export function SettingsSidebar({ active, onChange }: SettingsSidebarProps) {
  return (
    <aside className="overflow-hidden rounded-2xl bg-white">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.label === active;

        return (
          <button
            key={item.label}
            onClick={() => onChange(item.label)}
            className={`flex h-[72px] w-full items-center justify-between border-b px-4 last:border-b-0 ${
              isActive ? "bg-[#ECE8FF]" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5]">
                <Icon size={18} className="text-[#424242]" />
              </div>

              <span className="text-[16px] text-[#1E1E1E]">{item.label}</span>
            </div>

            <ChevronRight size={18} className="text-[#424242]" />
          </button>
        );
      })}
    </aside>
  );
}