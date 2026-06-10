import { Logo } from "@/components/shared/logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#F7F4F2] px-6 pt-14">
      <Logo />

      <div className="mt-16 w-full max-w-[520px] rounded-2xl bg-white p-10">
        {children}
      </div>
    </main>
  );
}