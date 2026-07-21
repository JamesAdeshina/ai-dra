import Image from "next/image";

import {
  ChevronRight,
  FileText,
} from "lucide-react";

export function AboutSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E] dark:text-white">
          About AI-DRA
        </h1>

        <p className="mt-1 text-[20px] text-[#424242] dark:text-[#C7C9CE]">
          Learn more about the project, contributors, and supporting organisations.
        </p>
      </div>

      <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-8 text-center dark:bg-[#1C1E22]">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#ECE8FF]">
              <Image
                src="/images/logo.svg"
                alt="AI-DRA logo"
                width={72}
                height={72}
                priority
                className="h-[72px] w-[72px] object-contain"
              />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-[#1E1E1E] dark:text-white">
              AI-DRA
            </h2>

            <p className="text-[#757575] dark:text-[#C7C9CE]">
              Digital Rehabilitation Assistant
            </p>

            <p className="mt-2 text-sm font-medium text-[#1E1E1E] dark:text-white">
              Version 1.0.1
            </p>

            <p className="mt-8 text-left text-sm leading-[165%] text-[#616161] dark:text-[#C7C9CE]">
              AI-DRA is an AI-powered rehabilitation assistant designed to support stroke survivors through guided rehabilitation exercises and progress monitoring.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-[#1C1E22]">
            <h3 className="font-semibold text-[#1E1E1E] dark:text-white">
              Research Project
            </h3>

            <p className="mt-2 text-[#616161] dark:text-[#C7C9CE]">
              University of Derby
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-[#1C1E22]">
            <h3 className="font-semibold text-[#1E1E1E] dark:text-white">
              Credits
            </h3>

            <div className="mt-4 space-y-3 text-sm text-[#1E1E1E] dark:text-[#E7E8EA]">
              <p>Dr Mojisola Grace Asogbon</p>
              <p>Dr Oluwarotimi W. Samuel</p>
              <p>James O. Adeshina</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-[#1C1E22]">
            <h3 className="font-semibold text-[#1E1E1E] dark:text-white">
              Project Status
            </h3>

            <p className="mt-2 text-[#616161] dark:text-[#C7C9CE]">
              Research Prototype
            </p>
          </div>
        </div>

        <div className="h-fit rounded-2xl bg-white p-8 dark:bg-[#1C1E22]">
          <h2 className="mb-8 text-[28px] font-semibold text-[#1E1E1E] dark:text-white">
            More About AI-DRA
          </h2>

          <div className="space-y-6">
            {[
              "Acknowledgements",
              "Terms of Use",
              "Privacy Policy",
            ].map((item) => (
              <button
                key={item}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-[#E7E7E7] p-5 text-left transition hover:bg-[#FAFAFA] dark:border-[#34373D] dark:hover:bg-[#24272C]"
              >
                <div className="flex items-center gap-4">
                  <FileText
                    size={18}
                    className="text-[#592EBD]"
                  />

                  <span className="text-[#1E1E1E] dark:text-white">
                    {item}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-[#424242] dark:text-[#C7C9CE]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
