import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export default function AdminLoginPage() {
  return (
    <AuthLayout>
      <LoginForm
        intendedRole="ADMIN"
        forgotPasswordHref="/admin/auth/forgot-password"
        registerHref={null}
        title="Welcome back"
        description="Sign in to continue to the admin portal."
      />
    </AuthLayout>
  );
}