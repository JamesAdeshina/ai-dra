import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function CarerForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm
        loginHref="/carer/auth/login"
        registerHref="/carer/auth/register"
      />
    </AuthLayout>
  );
}