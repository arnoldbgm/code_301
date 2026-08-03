"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AUTH_ROUTES = ["/login", "/register"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[240px]">
        <Header />
        <main className="w-full min-h-[calc(100vh-64px)] p-lg lg:p-xl bg-surface-container-lowest">
          {children}
        </main>
      </div>
    </>
  );
}
