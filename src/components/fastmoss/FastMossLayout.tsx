import { FastMossSidebar } from "./FastMossSidebar";
import { FastMossHeader } from "./FastMossHeader";

interface FastMossLayoutProps {
  children: React.ReactNode;
}

export function FastMossLayout({ children }: FastMossLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <FastMossSidebar />
      <div className="pl-64">
        <FastMossHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
