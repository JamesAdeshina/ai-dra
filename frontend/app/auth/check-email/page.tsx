import { AuthLayout } from "@/features/auth/components/auth-layout";
import { CheckEmailCard } from "@/features/auth/components/check-email-card";

type CheckEmailPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const { email } = await searchParams;

  return (
    <AuthLayout>
      <CheckEmailCard email={email ?? ""} />
    </AuthLayout>
  );
}