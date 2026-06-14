// app/page.tsx

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4F2] px-4">
      <div className="w-full max-w-[460px] rounded-[32px] bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Image
            src="/images/logo.svg"
            alt="AI-DRA"
            width={120}
            height={50}
          />
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-[42px] font-semibold text-[#1E1E1E]">
            AI-DRA
          </h1>

          <p className="mt-0 text-[18px] leading-relaxed text-[#757575]">
            AI-Powered Stroke Rehabilitation
          </p>

          <p className="mt-2 text-[16px] leading-relaxed text-[#9E9E9E]">
            Helping you practise upper-limb exercises,
            track recovery progress, and stay motivated.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <Link href="/auth/register">
            <button className="h-[60px] w-full rounded-full bg-[#5B2ECF] text-[18px] font-medium text-white transition hover:bg-[#4B22B6]">
              Get Started
            </button>
          </Link>

          <Link href="/auth/login">
            <button className="h-[60px] mt-2 w-full rounded-full border border-[#E5E5E5] bg-white text-[18px] font-medium text-[#1E1E1E]">
              Already have an account? Log in
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Image
          src="/images/university_of_derby.svg"
          alt="University of Derby"
          width={80}
          height={80}
          className="mx-auto"
        />

        <p className="mt-0 text-[15px] text-[#757575]">
          A University of Derby Research Project
        </p>
      </div>
    </main>
  );
}