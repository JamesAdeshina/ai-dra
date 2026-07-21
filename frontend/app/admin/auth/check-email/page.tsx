import { AuthLayout } from "@/features/auth/components/auth-layout";
import { CheckEmailCard } from "@/features/auth/components/check-email-card";

type CarerCheckEmailPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function AdminCheckEmailPage({
  searchParams,
}: CarerCheckEmailPageProps) {
  const { email } =
    await searchParams;

  return (
    <AuthLayout>
      <CheckEmailCard
        email={email ?? ""}
        loginHref="/admin/auth/login"
      />
    </AuthLayout>
  );
}