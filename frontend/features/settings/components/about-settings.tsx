import { ChevronRight, FileText } from "lucide-react";


export function AboutSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">
          About AI-DRA
        </h1>

        <p className="mt-1 text-[20px] text-[#424242]">
          Learn more about the project, contributors, and supporting
          organisations.
        </p>
      </div>

      <div className="grid grid-cols-[420px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-8 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-[#ECE8FF]" />

            <h2 className="mt-4 text-2xl font-bold">AI-DRA</h2>

            <p className="text-[#757575]">
              Digital Rehabilitation Assistant
            </p>

            <p className="mt-2 text-sm font-medium">
              Version 1.0.1
            </p>

            <p className="mt-8 text-left text-sm text-[#616161]">
              AI-DRA is an AI-powered rehabilitation assistant
              designed to support stroke survivors through guided
              rehabilitation exercises and progress monitoring.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h3 className="font-semibold">Research Project</h3>

            <p className="mt-2 text-[#616161]">
              University of Derby
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h3 className="font-semibold">Credits</h3>

            <div className="mt-4 space-y-3 text-sm">
              <p>Dr. Mojisola Grace Asogbon</p>
              <p>Dr. Oluwarotimi W. Samuel</p>
              <p>James O. Adeshina</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h3 className="font-semibold">Project Status</h3>

            <p className="mt-2 text-[#616161]">
              Research Prototype
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8">
          <h2 className="mb-8 text-[28px] font-semibold">
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
                className="flex w-full items-center justify-between rounded-xl border p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <FileText size={18} />
                  <span>{item}</span>
                </div>

                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}