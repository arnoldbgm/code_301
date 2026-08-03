"use client";

import { useEffect, useState, FormEvent } from "react";
import { useToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { StockBadge, IconButton, LoadingSpinner, EmptyState } from "@/app/components/UI";

interface Categoria {
  id: number;
  nombre: string;
  productos: { id: number }[];
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria_id: number;
  proveedor_id: number;
  categoria: { id: number; nombre: string };
  proveedor: { id: number; nombre: string };
}

interface FormData {
  nombre: string;
  precio: string;
  stock: string;
  categoria_id: string;
  proveedor_id: string;
}

const emptyForm: FormData = { nombre: "", precio: "", stock: "", categoria_id: "", proveedor_id: "" };

export default function ProductosPage() {
  const { showToast } = useToast();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null);

  const fetchData = async () => {
    const [prods, cats, provs] = await Promise.all([
      fetch("/api/productos").then((r) => r.json()),
      fetch("/api/categorias").then((r) => r.json()),
      fetch("/api/proveedores").then((r) => r.json()),
    ]);
    setProductos(prods);
    setCategorias(cats);
    setProveedores(provs);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido";
    const precio = parseFloat(form.precio);
    if (isNaN(precio) || precio <= 0) e.precio = "Precio debe ser mayor a 0";
    const stock = parseInt(form.stock);
    if (isNaN(stock) || stock <= 0) e.stock = "Stock debe ser un entero mayor a 0";
    if (!form.categoria_id) e.categoria_id = "Selecciona una categoría";
    if (!form.proveedor_id) e.proveedor_id = "Selecciona un proveedor";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const body = {
      nombre: form.nombre.trim(),
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      categoria_id: parseInt(form.categoria_id),
      proveedor_id: parseInt(form.proveedor_id),
    };

    const url = editId ? `/api/productos/${editId}` : "/api/productos";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      showToast(editId ? "Producto actualizado" : "Producto creado");
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchData();
    } else {
      const data = await res.json();
      showToast(data.error || "Error al guardar", "error");
    }
    setSubmitting(false);
  };

  const handleEdit = (p: Producto) => {
    setForm({
      nombre: p.nombre,
      precio: p.precio.toString(),
      stock: p.stock.toString(),
      categoria_id: p.categoria_id.toString(),
      proveedor_id: p.proveedor_id.toString(),
    });
    setEditId(p.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/productos/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Producto eliminado");
      fetchData();
    } else {
      const data = await res.json();
      showToast(data.error || "Error al eliminar", "error");
    }
    setDeleteTarget(null);
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-lg relative">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="z-10">
          <h1 className="text-display-lg font-display-lg text-on-surface">
            Gestión de Productos
          </h1>
          <p className="text-body-base font-body-base text-on-surface-variant mt-xs">
            Administra tu catálogo, controla inventario y actualiza precios.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) { cancelEdit(); } else { setShowForm(true); }
          }}
          className="z-10 bg-primary text-on-primary px-lg py-sm rounded-full text-label-md font-label-md flex items-center gap-sm hover:opacity-90 transition-opacity shadow-md"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showForm ? "close" : "add"}
          </span>
          {showForm ? "Cerrar" : "Agregar Producto"}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-container rounded-xl shadow-sm p-lg mb-lg transition-all duration-300 transform origin-top relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-secondary-container rounded-bl-full opacity-50 pointer-events-none" />
          <h2 className="text-headline-md font-headline-md text-on-surface mb-md">
            {editId ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md relative z-10">
            <div className="space-y-xs">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Nombre del Producto</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full bg-surface text-body-sm font-body-sm text-on-surface px-md py-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Ej. Zapatillas Nike Air Max"
                type="text"
              />
              {errors.nombre && <p className="text-xs text-error">{errors.nombre}</p>}
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Precio (S/.)</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-body-sm font-body-sm">S/</span>
                <input
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="w-full bg-surface text-body-sm font-body-sm text-on-surface pl-10 pr-md py-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                />
              </div>
              {errors.precio && <p className="text-xs text-error">{errors.precio}</p>}
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Stock Inicial</label>
              <input
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-surface text-body-sm font-body-sm text-on-surface px-md py-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="0"
                type="number"
              />
              {errors.stock && <p className="text-xs text-error">{errors.stock}</p>}
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Categoría</label>
              <div className="relative">
                <select
                  value={form.categoria_id}
                  onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  className="w-full bg-surface text-body-sm font-body-sm text-on-surface px-md py-sm rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
              {errors.categoria_id && <p className="text-xs text-error">{errors.categoria_id}</p>}
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Proveedor</label>
              <div className="relative">
                <select
                  value={form.proveedor_id}
                  onChange={(e) => setForm({ ...form, proveedor_id: e.target.value })}
                  className="w-full bg-surface text-body-sm font-body-sm text-on-surface px-md py-sm rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
              {errors.proveedor_id && <p className="text-xs text-error">{errors.proveedor_id}</p>}
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-end justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full lg:w-auto bg-primary text-on-primary px-lg py-sm rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-xs disabled:opacity-50"
              >
                {submitting ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">save</span>
                )}
                {editId ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface rounded-xl shadow-sm overflow-hidden flex-1 relative">
        <div className="absolute -right-20 bottom-0 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none" />
        <div className="overflow-x-auto relative z-10">
          {loading ? (
            <LoadingSpinner />
          ) : productos.length === 0 ? (
            <EmptyState icon="inventory_2" message="No hay productos registrados" />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-variant">
                  <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Producto</th>
                  <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider w-32">Precio</th>
                  <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider w-32">Stock</th>
                  <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                  <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Proveedor</th>
                  <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider w-24 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-body-sm font-body-sm">
                {productos.map((p, i) => (
                  <tr key={p.id} className={`${i % 2 === 1 ? "bg-surface-container-lowest" : ""} hover:bg-surface-container transition-colors group`}>
                    <td className="px-md py-sm text-on-surface font-medium flex items-center gap-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">package_2</span>
                      </div>
                      <span className="truncate">{p.nombre}</span>
                    </td>
                    <td className="px-md py-sm text-mono-data font-mono-data text-on-surface-variant">S/ {p.precio.toFixed(2)}</td>
                    <td className="px-md py-sm">
                      <StockBadge stock={p.stock} />
                    </td>
                    <td className="px-md py-sm text-on-surface-variant hidden sm:table-cell">{p.categoria?.nombre}</td>
                    <td className="px-md py-sm text-on-surface-variant hidden md:table-cell">{p.proveedor?.nombre}</td>
                    <td className="px-md py-sm text-right">
                      <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconButton onClick={() => handleEdit(p)} title="Editar">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </IconButton>
                        <IconButton onClick={() => setDeleteTarget(p)} variant="danger" title="Eliminar">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && productos.length > 0 && (
          <div className="px-md py-sm border-t border-surface-variant flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant bg-surface-container-lowest relative z-10">
            <span>Mostrando {productos.length} producto{productos.length !== 1 ? "s" : ""}</span>
            <div className="flex items-center gap-xs">
              <button className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <span className="px-2 py-1 bg-surface-container rounded font-medium text-on-surface">1</span>
              <button className="p-1 rounded hover:bg-surface-container transition-colors text-on-surface">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el producto "${deleteTarget?.nombre}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
