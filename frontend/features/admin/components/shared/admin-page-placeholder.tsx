import { CheckCircle2, Construction } from "lucide-react";

type AdminPlaceholderItem = {
  title: string;
  description: string;
};

type AdminPagePlaceholderProps = {
  title: string;
  description: string;
  statusLabel?: string;
  items: AdminPlaceholderItem[];
  note?: string;
};

export function AdminPagePlaceholder({
  title,
  description,
  statusLabel = "Frontend Prototype",
  items,
  note,
}: AdminPagePlaceholderProps) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="overflow-hidden rounded-3xl border border-[#E9E5E1] bg-white shadow-[0_8px_30px_rgba(32,29,27,0.04)]">
          <div className="border-b border-[#EEEAE6] bg-gradient-to-r from-[#F8F5FF] to-white px-6 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E9E3F8] px-3 py-1.5 text-xs font-semibold text-[#592EBD]">
                  <Construction size={14} aria-hidden="true" />
                  {statusLabel}
                </span>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#211E1C] sm:text-3xl">
                  {title}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#68615D] sm:text-base">
                  {description}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E9E3F8] bg-[#FBF9FF] px-5 py-4 lg:max-w-sm">
                <p className="text-sm font-semibold text-[#592EBD]">
                  AI-DRA Admin / Research Portal
                </p>

                <p className="mt-1 text-sm leading-5 text-[#6C6570]">
                  This page is part of the research-monitoring frontend and will
                  later connect to verified Supabase data.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 lg:px-10">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[#ECE8E4] bg-[#FCFBFA] p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E9E3F8] text-[#592EBD]">
                      <CheckCircle2 size={17} aria-hidden="true" />
                    </span>

                    <div>
                      <h3 className="font-semibold text-[#2A2623]">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 text-sm leading-5 text-[#746D68]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {note ? (
              <div className="mt-7 rounded-2xl border border-dashed border-[#CFC5E7] bg-[#FAF8FF] px-5 py-4">
                <p className="text-sm leading-6 text-[#625A6D]">{note}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}