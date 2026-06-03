type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="min-h-screen bg-[#f7f4f2] px-8 py-10">
      <div className="mx-auto max-w-[1500px]">{children}</div>
    </main>
  );
}