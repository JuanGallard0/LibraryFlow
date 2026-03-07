import { ReactNode } from "react";
import { Navbar } from "../components/Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4">{children}</main>
    </div>
  );
}
