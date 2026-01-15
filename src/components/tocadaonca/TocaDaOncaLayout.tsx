import { TocaDaOncaSidebar } from "./TocaDaOncaSidebar";
import { TocaDaOncaHeader } from "./TocaDaOncaHeader";

interface TocaDaOncaLayoutProps {
  children: React.ReactNode;
}

export function TocaDaOncaLayout({ children }: TocaDaOncaLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TocaDaOncaSidebar />
      <div className="pl-64">
        <TocaDaOncaHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
