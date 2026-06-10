import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const supportItems = [
  {
    icon: "🏥",
    title: "NHS Stroke Recovery Information",
  },
  {
    icon: "📞",
    title: "Contact Your Physiotherapist",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Contact Caregiver",
  },
  {
    icon: "📚",
    title: "Recovery Tips",
  },
];

export function SupportModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
      <div className="flex h-[554px] w-[388px] flex-col items-center rounded-[24px] bg-white px-6 py-[30px]">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#F5F5F5] text-[64px]">
            😔
          </div>

          <div className="text-center">
            <h2 className="text-[18px] font-medium leading-[150%] text-[#1E1E1E]">
              Need Extra Support?
            </h2>
            <p className="mt-1 text-[14px] font-medium leading-[150%] text-[#9E9E9E]">
              It&apos;s okay if today&apos;s exercise felt difficult. You may
              find these resources helpful:
            </p>
          </div>

          <div className="w-full">
            {supportItems.map((item) => (
              <button
                key={item.title}
                type="button"
                className="flex h-[52px] w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-[#F5F5F5] text-[14px]">
                    {item.icon}
                  </div>

                  <span className="text-[14px] font-medium leading-[150%] text-[#424242]">
                    {item.title}
                  </span>
                </div>

                <div className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-[#F5F5F5] text-[#424242]">
                  <ArrowUpRight size={15} />
                </div>
              </button>
            ))}
          </div>

          <Link href="/dashboard" className="w-full">
            <Button
              variant="outline"
              className="h-[56px] w-full rounded-[53px] border-[#E0E0E0] text-[16px] font-normal text-[#1E1E1E]"
            >
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}