import { TopNavigation } from "@/components/navigation/top-navigation";
import { PageContainer } from "./page-container";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <TopNavigation />
      <PageContainer>{children}</PageContainer>
    </>
  );
}