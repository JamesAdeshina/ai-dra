type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="min-h-[calc(100vh-86px)] bg-[#F7F4F2] px-6 py-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1440px]">{children}</div>
    </main>
  );
}