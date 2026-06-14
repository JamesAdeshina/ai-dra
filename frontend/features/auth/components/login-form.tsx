import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  return (
    <div>
      <h1 className="text-[30px] font-bold text-[#010E0E]">Welcome back</h1>

      <p className="mt-2 text-[16px] text-[#757575]">
        Sign in to continue your rehabilitation.
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <label className="text-sm">Phone number</label>
          <Input
            className="mt-2 h-16 rounded-xl"
            placeholder="Enter your phone number"
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

      <Link
        href="/auth/forgot-password"
        className="mt-4 block text-[15px] font-medium text-blue-600"
      >
        Forgot Password?
      </Link>

      <Link href="/dashboard">
        <Button className="mt-8 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]">
          Sign in
        </Button>
      </Link>

      <p className="mt-7 text-center text-[16px]">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-blue-600">
          Create Account
        </Link>
      </p>
    </div>
  );
}