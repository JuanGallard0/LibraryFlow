import { ReactNode } from "react";
import { Navbar } from "../components/Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
