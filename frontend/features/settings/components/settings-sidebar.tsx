import {
  ChevronRight,
  HelpCircle,
  Info,
  LockKeyhole,
  Settings2,
  Shield,
  User,
  Users,
} from "lucide-react";

export type SettingsTab =
  | "Personal Information"
  | "Change Password"
  | "Linked Carer"
  | "Accessibility"
  | "Preferences"
  | "Help & Support"
  | "About";

const items = [
  {
    label: "Personal Information",
    icon: User,
  },
  {
    label: "Change Password",
    icon: LockKeyhole,
  },
  {
    label: "Linked Carer",
    icon: Users,
  },
  {
    label: "Accessibility",
    icon: Shield,
  },
  {
    label: "Preferences",
    icon: Settings2,
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
  },
  {
    label: "About",
    icon: Info,
  },
] as const;

type SettingsSidebarProps = {
  active: SettingsTab;
  onChange: (
    tab: SettingsTab
  ) => void;
};

export function SettingsSidebar({
  active,
  onChange,
}: SettingsSidebarProps) {
  return (
    <aside className="h-fit overflow-hidden rounded-2xl bg-white dark:bg-[#1C1E22]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.label === active;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() =>
              onChange(item.label)
            }
            className={`flex h-[72px] w-full items-center justify-between border-b border-[#EEEEEE] px-4 text-left transition last:border-b-0 dark:border-[#34373D] ${
              isActive
                ? "bg-[#ECE8FF] dark:bg-[#33275A]"
                : "bg-white hover:bg-[#FAFAFA] dark:bg-[#1C1E22] dark:hover:bg-[#24272C]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] dark:bg-[#2A2D32]">
                <Icon
                  size={18}
                  className="text-[#424242] dark:text-[#E7E8EA]"
                />
              </div>

              <span className="text-[16px] text-[#1E1E1E] dark:text-white">
                {item.label}
              </span>
            </div>

            <ChevronRight
              size={18}
              className="text-[#424242] dark:text-[#C7C9CE]"
            />
          </button>
        );
      })}
    </aside>
  );
}
