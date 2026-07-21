import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function AdminForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm
        loginHref="/admin/auth/login"
        registerHref={null}
      />
    </AuthLayout>
  );
}