import { Construction } from "lucide-react";

type CarerPagePlaceholderProps = {
  title: string;
  description: string;
};

export function CarerPagePlaceholder({
  title,
  description,
}: CarerPagePlaceholderProps) {
  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[420px] max-w-5xl items-center justify-center rounded-2xl border border-[#E4E0DC] bg-white p-8 text-center shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
        <div className="max-w-lg">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEE9FB] text-[#592EBD]">
            <Construction size={25} />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-[#211E1C]">{title}</h2>
          <p className="mt-2 leading-7 text-[#6C6662]">{description}</p>
        </div>
      </div>
    </section>
  );
}
