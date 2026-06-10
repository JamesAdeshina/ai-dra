import {
  AlertTriangle,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export function HelpSupportSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">
          Help & Support
        </h1>

        <p className="mt-1 text-[20px] text-[#424242]">
          Find answers, report issues, and access support resources.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        <div className="rounded-2xl bg-white p-8">
          <h2 className="mb-6 text-[28px] font-semibold">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              "How do I start exercise sessions?",
              "How is my score calculated?",
              "Can I track my progress over time?",
              "How do reminders work?",
              "How do I contact my therapist?",
            ].map((faq) => (
              <button
                key={faq}
                className="flex w-full items-center justify-between rounded-xl border p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={18} />
                  <span>{faq}</span>
                </div>

                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-[#FF3B3B] p-6 text-white">
            <AlertTriangle size={24} />

            <h3 className="mt-4 text-xl font-semibold">
              Emergency Notice
            </h3>

            <p className="mt-2 text-sm">
              If you experience pain, dizziness, discomfort, or feel
              unwell during exercise, stop immediately and contact your
              healthcare professional.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h3 className="text-xl font-semibold">
              Contact Research Team
            </h3>

            <p className="mt-2 text-sm text-[#757575]">
              Have a question about AI-DRA or need additional support?
            </p>

            <button className="mt-6 h-14 w-full rounded-full border">
              Contact Research Team
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h3 className="text-xl font-semibold">Report an Issue</h3>

            <p className="mt-2 text-sm text-[#757575]">
              Report technical issues, bugs, or unexpected behaviour.
            </p>

            <button className="mt-6 h-14 w-full rounded-full border">
              Report Issue
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h3 className="text-xl font-semibold">
              Rehabilitation Resources
            </h3>

            <p className="mt-2 text-sm text-[#757575]">
              Access trusted rehabilitation information.
            </p>

            <button className="mt-6 h-14 w-full rounded-full border">
              View Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}