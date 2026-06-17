export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>Sidebar (Day 4)</aside>
      <main>{children}</main>
    </div>
  );
}
