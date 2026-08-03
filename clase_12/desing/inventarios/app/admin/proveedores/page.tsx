"use client";

import { useEffect, useState, FormEvent } from "react";
import { useToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { IconButton, LoadingSpinner, EmptyState } from "@/app/components/UI";

interface Proveedor {
  id: number;
  nombre: string;
  ruc: string;
  email: string;
  telefono?: string;
  ciudad?: string;
  productos: { id: number }[];
}

interface FormData {
  nombre: string;
  ruc: string;
  email: string;
  telefono: string;
}

const emptyForm: FormData = { nombre: "", ruc: "", email: "", telefono: "" };

export default function ProveedoresPage() {
  const { showToast } = useToast();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Proveedor | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await fetch("/api/proveedores");
    const data = await res.json();
    setProveedores(data);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const filtered = proveedores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.ruc.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalProductos = proveedores.reduce((sum, p) => sum + p.productos.length, 0);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!/^(10|20)\d{9}$/.test(form.ruc)) e.ruc = "RUC debe tener 11 dígitos y comenzar con 10 o 20";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email no válido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const url = editId ? `/api/proveedores/${editId}` : "/api/proveedores";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre.trim(),
        ruc: form.ruc.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim() || undefined,
      }),
    });

    if (res.ok) {
      showToast(editId ? "Proveedor actualizado" : "Proveedor creado");
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

  const handleEdit = (p: Proveedor) => {
    setForm({ nombre: p.nombre, ruc: p.ruc, email: p.email, telefono: p.telefono || "" });
    setEditId(p.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/proveedores/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Proveedor eliminado");
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-xl relative z-10">
        <div className="flex flex-col gap-xs relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-transparent blur-xl -z-10 rounded-full" />
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Gestión de Proveedores
          </h1>
          <p className="font-body-base text-body-base text-on-surface-variant flex items-center gap-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Administre sus socios comerciales y suministros
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) { cancelEdit(); } else { setShowForm(true); }
          }}
          className="group flex items-center justify-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-[0.98] whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">
            {showForm ? "close" : "add"}
          </span>
          <span className="font-label-md text-label-md">
            {showForm ? "Cerrar" : "Agregar Proveedor"}
          </span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm flex items-center gap-md relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0 z-10">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
          <div className="flex flex-col z-10">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Activos</span>
            <span className="font-display-lg text-display-lg text-on-surface">{proveedores.length}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm flex items-center gap-md relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0 z-10">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div className="flex flex-col z-10">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Prod. Vinculados</span>
            <span className="font-display-lg text-display-lg text-on-surface">{totalProductos.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm flex items-center gap-md relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-tertiary/5 rounded-full blur-2xl group-hover:bg-tertiary/10 transition-colors" />
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-tertiary shrink-0 z-10">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <div className="flex flex-col z-10">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Evaluación Prom.</span>
            <div className="flex items-center gap-xs">
              <span className="font-display-lg text-display-lg text-on-surface">4.8</span>
              <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split View on Large Screens */}
      <div className="flex flex-col lg:flex-row gap-lg">
        {/* Add/Edit Form Panel */}
        {showForm && (
          <div className="w-full lg:w-[400px] shrink-0 transition-all duration-300 animate-slide-in-right">
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm sticky top-[88px]">
              <div className="flex items-center justify-between mb-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface" id="form-title">
                  {editId ? "Editar Proveedor" : "Nuevo Proveedor"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                <div className="flex flex-col gap-base group">
                  <label className="font-label-sm text-label-sm text-on-surface-variant group-focus-within:text-primary transition-colors">
                    Nombre de la Empresa
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">apartment</span>
                    <input
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full bg-surface py-sm pl-xl pr-md rounded-lg text-body-sm font-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                      placeholder="Ej. TechCorp Industries S.A.C."
                      type="text"
                    />
                  </div>
                  {errors.nombre && <p className="text-xs text-error">{errors.nombre}</p>}
                </div>
                <div className="flex flex-col gap-base group">
                  <label className="font-label-sm text-label-sm text-on-surface-variant group-focus-within:text-primary transition-colors">
                    RUC (11 dígitos)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">pin</span>
                    <input
                      value={form.ruc}
                      onChange={(e) => setForm({ ...form, ruc: e.target.value })}
                      className="w-full bg-surface py-sm pl-xl pr-md rounded-lg text-body-sm font-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                      placeholder="20XXXXXXXXX"
                      maxLength={11}
                      type="text"
                    />
                  </div>
                  {errors.ruc && <p className="text-xs text-error">{errors.ruc}</p>}
                </div>
                <div className="flex flex-col gap-base group">
                  <label className="font-label-sm text-label-sm text-on-surface-variant group-focus-within:text-primary transition-colors">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">mail</span>
                    <input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-surface py-sm pl-xl pr-md rounded-lg text-body-sm font-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                      placeholder="contacto@empresa.com"
                      type="email"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-error">{errors.email}</p>}
                </div>
                <div className="flex flex-col gap-base group">
                  <label className="font-label-sm text-label-sm text-on-surface-variant group-focus-within:text-primary transition-colors">
                    Teléfono (Opcional)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">call</span>
                    <input
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      className="w-full bg-surface py-sm pl-xl pr-md rounded-lg text-body-sm font-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                      placeholder="+51 999 888 777"
                      type="tel"
                    />
                  </div>
                </div>
                <div className="mt-sm flex flex-col gap-sm">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-sm disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">save</span>
                    )}
                    {editId ? "Actualizar" : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="w-full py-sm bg-surface-container text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Data Table Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          {/* Table Controls */}
          <div className="p-md bg-surface-container-lowest flex items-center justify-between border-b border-surface-container gap-md flex-wrap">
            <div className="flex items-center gap-sm">
              <button className="p-xs text-on-surface-variant hover:text-primary rounded-md hover:bg-surface transition-colors flex items-center gap-xs">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                <span className="font-label-md text-label-md hidden sm:inline">Filtrar</span>
              </button>
              <div className="w-px h-4 bg-outline-variant/30" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Mostrando {filtered.length} de {proveedores.length}
              </span>
            </div>
            <div className="relative max-w-[240px] w-full sm:w-auto">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface text-body-sm font-body-sm pl-xl pr-md py-xs rounded-full focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="Buscar en tabla..."
                type="text"
              />
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className="overflow-x-auto w-full">
            {loading ? (
              <LoadingSpinner />
            ) : filtered.length === 0 ? (
              <EmptyState icon="local_shipping" message="No hay proveedores registrados" />
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface/50 border-b border-surface-container">
                    <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold w-12 text-center">
                      <input className="rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface" type="checkbox" />
                    </th>
                    <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Proveedor</th>
                    <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">RUC</th>
                    <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Contacto</th>
                    <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-center">Productos</th>
                    <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-right pr-lg">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container bg-surface-container-lowest">
                  {filtered.map((p, i) => (
                    <tr key={p.id} className={`${i % 2 === 1 ? "bg-surface/20" : ""} hover:bg-surface/50 transition-colors group`}>
                      <td className="p-md text-center">
                        <input className="rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface" type="checkbox" />
                      </td>
                      <td className="p-md">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 rounded bg-primary-fixed/20 flex items-center justify-center text-primary font-display-lg text-[14px]">
                            {p.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                              {p.nombre}
                            </div>
                            {p.ciudad && (
                              <div className="font-body-sm text-body-sm text-on-surface-variant">{p.ciudad}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-md">
                        <span className="font-mono-data text-mono-data text-on-surface bg-surface px-2 py-1 rounded">{p.ruc}</span>
                      </td>
                      <td className="p-md">
                        <a className="flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href={`mailto:${p.email}`}>
                          <span className="material-symbols-outlined text-[16px]">mail</span>
                          {p.email}
                        </a>
                      </td>
                      <td className="p-md text-center">
                        <div className="inline-flex items-center justify-center px-2 py-1 bg-surface rounded-full font-mono-data text-mono-data text-on-surface-variant">
                          {p.productos.length}
                        </div>
                      </td>
                      <td className="p-md text-right pr-lg">
                        <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconButton onClick={() => handleEdit(p)} title="Editar">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </IconButton>
                          <IconButton onClick={() => setDeleteTarget(p)} variant="danger" title="Eliminar">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="p-md bg-surface-container-lowest border-t border-surface-container flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:block">
                Mostrando 1 - {filtered.length} de {proveedores.length} resultados
              </span>
              <div className="flex items-center gap-xs w-full sm:w-auto justify-center sm:justify-end">
                <button className="p-xs text-on-surface-variant hover:text-primary rounded hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="flex items-center gap-xs px-sm">
                  <button className="w-8 h-8 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center">1</button>
                  <button className="w-8 h-8 rounded-full hover:bg-surface text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center transition-colors">2</button>
                  <button className="w-8 h-8 rounded-full hover:bg-surface text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center transition-colors">3</button>
                </div>
                <button className="p-xs text-on-surface-variant hover:text-primary rounded hover:bg-surface">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el proveedor "${deleteTarget?.nombre}"?`}
        warning={
          deleteTarget && deleteTarget.productos.length > 0
            ? `Este proveedor tiene <strong>${deleteTarget.productos.length}</strong> producto(s) asociado(s).`
            : undefined
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
