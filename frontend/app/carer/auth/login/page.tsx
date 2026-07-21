import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export default function CarerLoginPage() {
  return (
    <AuthLayout>
      <LoginForm
        intendedRole="CARER"
        forgotPasswordHref="/carer/auth/forgot-password"
        registerHref="/carer/auth/register"
        title="Welcome back"
        description="Sign in to continue to the carer portal."
      />
    </AuthLayout>
  );
}