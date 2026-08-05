"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

const faqs = [
  {
    question: "How do I start exercise sessions?",
    answer:
      "Go to Exercises, choose an exercise from your library, review the exercise details, then watch the demo video. When you are ready, select Start Exercise and follow the on-screen instructions. Make sure your upper body is visible to the camera before beginning.",
  },
  {
    question: "How is my score calculated?",
    answer:
      "AI-DRA uses the device camera to estimate movement quality during each exercise. The prototype shows movement, accuracy, and speed feedback to help guide practice. These scores are supportive prototype indicators and should not be treated as a clinical assessment.",
  },
  {
    question: "Can I track my progress over time?",
    answer:
      "Yes. Your dashboard and progress areas summarise completed sessions, recent activity, and exercise performance so you and your linked carer can review how practice is going over time.",
  },
  {
    question: "How do reminders work?",
    answer:
      "Reminders help you remember planned exercise sessions. In this prototype, reminders can show in-app alerts, browser notifications, and email alerts while the app is open and reminder checks are active.",
  },
  {
    question: "How do I contact my therapist?",
    answer:
      "This prototype does not directly message a therapist from inside the app. Use the Contact Research Team option for project support, or contact your usual healthcare professional through your normal care pathway.",
  },
];

export function HelpSupportSettings() {
  const [openFaq, setOpenFaq] = useState<string | null>(
    faqs[0]?.question ?? null
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#1E1E1E] sm:text-[40px]">
          Help & Support
        </h1>

        <p className="mt-1 text-[20px] text-[#424242]">
          Find answers, report issues, and access support resources.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-[28px] font-semibold">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.question;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : faq.question)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle
                        size={18}
                        className="shrink-0 text-[#592EBD]"
                      />
                      <span className="font-medium text-[#1E1E1E]">
                        {faq.question}
                      </span>
                    </div>

                    {isOpen ? (
                      <ChevronDown
                        size={18}
                        className="shrink-0 text-[#592EBD]"
                      />
                    ) : (
                      <ChevronRight
                        size={18}
                        className="shrink-0 text-neutral-500"
                      />
                    )}
                  </button>

                  {isOpen ? (
                    <div className="border-t bg-[#F8F7FC] px-4 py-4">
                      <p className="text-[15px] leading-[160%] text-[#424242]">
                        {faq.answer}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
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

            <a
              href="mailto:M.Asogbon@derby.ac.uk?subject=AI-DRA%20Research%20Team%20Support"
              className="mt-6 flex h-14 w-full items-center justify-center rounded-full border text-center font-medium transition hover:bg-neutral-50"
            >
              Contact Research Team
            </a>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h3 className="text-xl font-semibold">Report an Issue</h3>

            <p className="mt-2 text-sm text-[#757575]">
              Report technical issues, bugs, or unexpected behaviour.
            </p>

            <a
              href="mailto:jamesadeshina413@gmail.com?subject=AI-DRA%20Issue%20Report"
              className="mt-6 flex h-14 w-full items-center justify-center rounded-full border text-center font-medium transition hover:bg-neutral-50"
            >
              Report Issue
            </a>
          </div>

          {/*
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
          */}
        </div>
      </div>
    </div>
  );
}