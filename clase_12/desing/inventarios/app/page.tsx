"use client";

import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface Proveedor {
  id: number;
  nombre: string;
}

export default function Dashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/productos").then((r) => r.json()),
      fetch("/api/proveedores").then((r) => r.json()),
    ]).then(([prods, provs]) => {
      setProductos(prods);
      setProveedores(provs);
      setLoading(false);
    });
  }, []);

  const totalProductos = productos.length;
  const totalProveedores = proveedores.length;
  const precioPromedio =
    totalProductos > 0
      ? productos.reduce((sum, p) => sum + p.precio, 0) / totalProductos
      : 0;
  const stockPromedio =
    totalProductos > 0
      ? Math.round(
          productos.reduce((sum, p) => sum + p.stock, 0) / totalProductos
        )
      : 0;
  const mayorPrecio = productos.reduce(
    (max, p) => (p.precio > max.precio ? p : max),
    { precio: 0, nombre: "-", stock: 0, id: 0 }
  );
  const mayorStock = productos.reduce(
    (max, p) => (p.stock > max.stock ? p : max),
    { precio: 0, nombre: "-", stock: 0, id: 0 }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-[32px] text-on-surface-variant">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-sm mb-xl">
        <div className="flex items-center gap-sm">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="font-mono-data text-mono-data text-on-surface-variant uppercase tracking-widest">
            Dashboard General
          </span>
        </div>
        <h1 className="font-display-lg text-display-lg text-on-surface">
          Métricas de Inventario
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg w-full">
        {/* 1. Total Proveedores */}
        <div className="relative overflow-hidden bg-surface-container-lowest shadow-sm rounded-lg p-lg flex flex-col justify-between min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute -right-4 -bottom-8 opacity-[0.03] pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
            <span className="material-symbols-outlined text-[180px]">
              domain
            </span>
          </div>
          <div className="flex justify-between items-start z-10">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              Total Proveedores
            </span>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface text-[20px]">
                domain
              </span>
            </div>
          </div>
          <div className="mt-lg z-10 flex items-end justify-between">
            <div className="font-display-lg text-display-lg text-on-surface text-[64px] leading-none tracking-tighter">
              {totalProveedores}
            </div>
            <div className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-[16px]">
                arrow_upward
              </span>
              proveedores activos
            </div>
          </div>
        </div>

        {/* 2. Total Productos */}
        <div className="relative overflow-hidden bg-surface-container-lowest shadow-sm rounded-lg p-lg flex flex-col justify-between min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          <div className="flex justify-between items-start z-10">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              Total Productos
            </span>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[20px]">
                inventory_2
              </span>
            </div>
          </div>
          <div className="mt-lg z-10 flex items-end justify-between">
            <div className="font-display-lg text-display-lg text-on-surface text-[64px] leading-none tracking-tighter">
              {totalProductos.toLocaleString()}
            </div>
            <div className="w-16 h-8">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 30"
              >
                <path
                  className="text-primary opacity-80"
                  d="M0,30 L20,20 L40,25 L60,10 L80,15 L100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                <circle
                  className="text-primary"
                  cx="100"
                  cy="5"
                  fill="currentColor"
                  r="4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Precio Promedio */}
        <div className="relative overflow-hidden bg-surface-container-lowest shadow-sm rounded-lg p-lg flex flex-col justify-between min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col gap-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Precio Promedio
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface text-[20px]">
                payments
              </span>
            </div>
          </div>
          <div className="mt-lg z-10 flex flex-col gap-sm">
            <div className="font-display-lg text-display-lg text-on-surface text-[48px] leading-none tracking-tighter">
              <span className="text-[24px] text-on-surface-variant align-top mr-1">
                S/.
              </span>
              {precioPromedio.toFixed(2)}
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{
                  width: `${
                    totalProductos > 0
                      ? Math.min((precioPromedio / 500) * 100, 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 4. Stock Promedio */}
        <div className="relative overflow-hidden bg-surface-container-lowest shadow-sm rounded-lg p-lg flex flex-col justify-between min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start z-10">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              Stock Promedio
            </span>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface text-[20px]">
                stacked_bar_chart
              </span>
            </div>
          </div>
          <div className="mt-lg z-10 flex items-end justify-between">
            <div className="font-display-lg text-display-lg text-on-surface text-[64px] leading-none tracking-tighter">
              {stockPromedio}
            </div>
            <div className="flex gap-1 h-10 items-end">
              <div className="w-2 bg-surface-container h-[30%] rounded-t-sm" />
              <div className="w-2 bg-surface-container h-[50%] rounded-t-sm" />
              <div className="w-2 bg-primary h-[80%] rounded-t-sm" />
              <div className="w-2 bg-surface-container h-[60%] rounded-t-sm" />
              <div className="w-2 bg-surface-container h-[100%] rounded-t-sm" />
            </div>
          </div>
        </div>

        {/* 5. Mayor Precio */}
        <div className="relative overflow-hidden bg-surface-container-lowest shadow-sm rounded-lg p-lg flex flex-col justify-between min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary" />
          <div className="flex justify-between items-start z-10 pl-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">
                trending_up
              </span>
              Mayor Precio
            </span>
          </div>
          <div className="mt-lg z-10 pl-sm flex flex-col gap-xs">
            <h3 className="font-headline-md text-headline-md text-on-surface truncate">
              {mayorPrecio.nombre !== "-" ? mayorPrecio.nombre : "Sin datos"}
            </h3>
            <div className="font-display-lg text-display-lg text-primary">
              {mayorPrecio.nombre !== "-" ? (
                <>
                  <span className="text-[20px] align-top mr-1">S/.</span>
                  {mayorPrecio.precio.toLocaleString("es-PE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </>
              ) : (
                <span className="text-on-surface-variant text-[20px]">—</span>
              )}
            </div>
          </div>
        </div>

        {/* 6. Mayor Stock */}
        <div className="relative overflow-hidden bg-surface-container-lowest shadow-sm rounded-lg p-lg flex flex-col justify-between min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-surface-container-highest rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="flex justify-between items-start z-10">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">
                keyboard_double_arrow_up
              </span>
              Mayor Stock
            </span>
          </div>
          <div className="mt-lg z-10 flex items-center justify-between">
            <div className="flex flex-col gap-xs flex-1 min-w-0 pr-md">
              <h3 className="font-headline-md text-headline-md text-on-surface truncate">
                {mayorStock.nombre !== "-" ? mayorStock.nombre : "Sin datos"}
              </h3>
              {mayorStock.nombre !== "-" && (
                <div className="font-label-md text-label-md text-on-surface-variant">
                  Unidades en inventario
                </div>
              )}
            </div>
            <div className="flex flex-col items-end">
              <div className="font-display-lg text-display-lg text-on-surface text-[40px] leading-none tracking-tighter">
                {mayorStock.stock > 0
                  ? mayorStock.stock.toLocaleString()
                  : "—"}
              </div>
              {mayorStock.stock > 0 && (
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                  Unidades
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
