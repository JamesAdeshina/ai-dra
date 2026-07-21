import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();

  const isRecoveryFlow =
    cookieStore.get(
      "ai_dra_password_recovery"
    )?.value === "true";

  if (!isRecoveryFlow) {
    redirect(
      "/auth/forgot-password?error=reset_link_required"
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/forgot-password?error=invalid_or_expired_link"
    );
  }

  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}