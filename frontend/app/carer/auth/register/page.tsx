import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function CarerRegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm
        accountRole="CARER"
        loginHref="/carer/auth/login"
        checkEmailHref="/carer/auth/check-email"
        title="Create Your Carer Account"
        description="Create an account to support linked survivors."
      />
    </AuthLayout>
  );
}