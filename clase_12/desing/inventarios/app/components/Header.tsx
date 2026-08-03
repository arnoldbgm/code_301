"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 w-full h-16 bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-lg shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-md">
        <button className="lg:hidden p-xs text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      <div className="flex items-center gap-lg">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            className="bg-surface-container-high text-body-sm font-body-sm pl-xl pr-md py-xs rounded-full w-64 focus:outline-none focus:ring-1 focus:ring-primary/20"
            placeholder="Buscar inventario..."
            type="text"
          />
        </div>
        <button className="relative p-xs text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[24px]">
            notifications
          </span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>

        {session ? (
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium text-on-surface leading-tight">
                {session.user?.name || "Usuario"}
              </span>
              <span className="text-xs text-on-surface-variant leading-tight">
                {session.user?.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-xs p-xs text-on-surface-variant hover:text-on-surface transition-colors"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </a>
        )}
      </div>
    </header>
  );
}
