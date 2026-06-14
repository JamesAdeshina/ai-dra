import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  return (
    <div>
      <h1 className="text-[30px] font-bold leading-tight text-[#010E0E]">
        Create Your Account
      </h1>

      <p className="mt-2 text-[16px] text-[#757575]">
        Let&apos;s get you ready for your rehabilitation journey.
      </p>

      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">First name</label>
            <Input
              className="mt-2 h-16 rounded-xl"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="text-sm">Last name</label>
            <Input
              className="mt-2 h-16 rounded-xl"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label className="text-sm">Email Address</label>
          <Input
            className="mt-2 h-16 rounded-xl"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label className="text-sm">Password</label>

          <div className="relative mt-2">
            <Input
              className="h-16 rounded-xl pr-16"
              type="password"
              placeholder="Enter your password"
            />

            <button
              type="button"
              className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold"
            >
              Show
            </button>
          </div>
        </div>
      </div>

      <Link href="/onboarding">
        <Button className="mt-10 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]">
          Create Account
        </Button>
      </Link>

      <p className="mt-7 text-center text-[16px]">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-blue-600">
          Log in
        </Link>
      </p>
    </div>
  );
}