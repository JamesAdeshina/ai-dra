import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  return (
    <div>
      <h1 className="text-[40px] font-bold text-[#010E0E]">Reset Password</h1>

      <p className="mt-2 text-[16px] text-[#757575]">
        Enter your email address and we&apos;ll send you a reset link.
      </p>

      <div className="mt-8">
        <label className="text-sm">Email Address</label>
        <Input
          className="mt-2 h-16 rounded-xl"
          placeholder="Enter your email address"
        />
      </div>

      <Button className="mt-24 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]">
        Send Reset Link
      </Button>

      <p className="mt-6 text-center">
        <Link href="/auth/login" className="font-semibold text-blue-600">
          Back to login
        </Link>
      </p>
    </div>
  );
}