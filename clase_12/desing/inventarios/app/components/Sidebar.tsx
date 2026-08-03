"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/productos", label: "Productos", icon: "package_2" },
  { href: "/admin/categorias", label: "Categorías", icon: "category" },
  { href: "/admin/proveedores", label: "Proveedores", icon: "local_shipping" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface-container-low z-50 flex flex-col pt-lg pb-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] hidden lg:flex">
      <div className="px-lg mb-xl flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary text-[28px]">
          inventory_2
        </span>
        <span className="font-headline-md text-headline-md tracking-tight text-on-surface">
          Monolithic
        </span>
      </div>

      <nav className="flex-1 px-md space-y-xs">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex items-center px-md py-sm rounded-lg font-label-md transition-all group bg-primary text-on-primary shadow-sm"
                  : "flex items-center px-md py-sm rounded-lg text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all group"
              }
            >
              <span className="material-symbols-outlined mr-md text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-md pt-md border-t border-outline-variant/30">
        <a className="flex items-center px-md py-sm rounded-lg text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">
          <span className="material-symbols-outlined mr-md text-[20px]">
            settings
          </span>
          Configuración
        </a>
      </div>
    </aside>
  );
}
