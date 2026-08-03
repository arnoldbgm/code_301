"use client";

import { useEffect, useState, FormEvent } from "react";
import { useToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { IconButton, LoadingSpinner, EmptyState } from "@/app/components/UI";

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  productos: { id: number }[];
}

export default function CategoriasPage() {
  const { showToast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [errors, setErrors] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Categoria | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await fetch("/api/categorias");
    const data = await res.json();
    setCategorias(data);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const filtered = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrors("El nombre es requerido");
      return;
    }
    setSubmitting(true);
    setErrors("");

    const url = editId ? `/api/categorias/${editId}` : "/api/categorias";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombre.trim(), descripcion: descripcion.trim() || undefined }),
    });

    if (res.ok) {
      showToast(editId ? "Categoría actualizada" : "Categoría creada");
      setNombre("");
      setDescripcion("");
      setEditId(null);
      fetchData();
    } else {
      const data = await res.json();
      setErrors(data.error || "Error al guardar");
    }
    setSubmitting(false);
  };

  const handleEdit = (c: Categoria) => {
    setNombre(c.nombre);
    setDescripcion(c.descripcion || "");
    setEditId(c.id);
    setErrors("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/categorias/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Categoría eliminada");
      fetchData();
    } else {
      const data = await res.json();
      showToast(data.error || "Error al eliminar", "error");
    }
    setDeleteTarget(null);
  };

  const totalActivas = categorias.filter((c) => c.productos.length > 0).length;
  const sinProductos = categorias.filter((c) => c.productos.length === 0).length;

  return (
    <div className="flex flex-col w-full relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-xl gap-md relative z-10">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs tracking-tight">
            Gestión de Categorías
          </h1>
          <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
            Organiza tu catálogo estructurando los productos en familias lógicas. Las categorías ayudan a tus clientes a navegar más rápido y mejoran el SEO.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl relative z-10">
        <div className="bg-surface-container rounded-xl p-lg shadow-sm flex items-center justify-between overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Total Categorías</p>
            <p className="font-display-lg text-display-lg text-on-surface">{categorias.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[24px]">category</span>
          </div>
        </div>
        <div className="bg-surface-container rounded-xl p-lg shadow-sm flex items-center justify-between overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary/5 rounded-full blur-xl" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Categorías Activas</p>
            <p className="font-display-lg text-display-lg text-on-surface">{totalActivas}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-[24px]">check_circle</span>
          </div>
        </div>
        <div className="bg-surface-container rounded-xl p-lg shadow-sm flex items-center justify-between overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-error/5 rounded-full blur-xl" />
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Sin Productos</p>
            <p className="font-display-lg text-display-lg text-on-surface">{sinProductos}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-error text-[24px]">warning</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl relative z-10">
        {/* List View */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Filters & Search */}
          <div className="bg-surface-container rounded-xl p-md flex flex-col md:flex-row gap-md items-center justify-between shadow-sm">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface text-on-surface font-body-sm text-body-sm pl-xl pr-md py-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                placeholder="Buscar categoría..."
                type="text"
              />
            </div>
            <div className="flex gap-sm w-full md:w-auto">
              <button className="flex items-center gap-xs bg-surface text-on-surface px-md py-sm rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filtros
              </button>
              <button className="flex items-center gap-xs bg-surface text-on-surface px-md py-sm rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">sort</span>
                Ordenar
              </button>
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-surface-container rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              {loading ? (
                <LoadingSpinner />
              ) : filtered.length === 0 ? (
                <EmptyState icon="category" message="No hay categorías registradas" />
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-outline-variant/20">
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nombre</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Productos Asoc.</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-center">Estado</th>
                      <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant/10">
                    {filtered.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-container-high transition-colors group">
                        <td className="p-md">
                          <div className="flex items-center gap-md">
                            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shadow-sm">
                              <span className="material-symbols-outlined text-outline-variant text-[24px]">label</span>
                            </div>
                            <div>
                              <p className="font-label-md text-label-md text-on-surface">{c.nombre}</p>
                              {c.descripcion && (
                                <p className="font-body-sm text-body-sm text-on-surface-variant">{c.descripcion}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-md text-right font-mono-data text-mono-data text-on-surface-variant">
                          {c.productos.length.toLocaleString()}
                        </td>
                        <td className="p-md text-center">
                          {c.productos.length > 0 ? (
                            <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm">
                              <span className="w-2 h-2 rounded-full bg-primary" /> Activa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-surface text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30">
                              <span className="w-2 h-2 rounded-full bg-outline-variant" /> Inactiva
                            </span>
                          )}
                        </td>
                        <td className="p-md text-right">
                          <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <IconButton onClick={() => handleEdit(c)} title="Editar">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </IconButton>
                            <IconButton onClick={() => setDeleteTarget(c)} variant="danger" title="Eliminar">
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
            {!loading && filtered.length > 0 && (
              <div className="p-md border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Mostrando {filtered.length} de {categorias.length}
                </p>
                <div className="flex gap-xs">
                  <button className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded-md flex items-center justify-center bg-primary text-on-primary font-label-sm text-label-sm">1</button>
                  <button className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm">2</button>
                  <button className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm">3</button>
                  <button className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Form / Structure Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-surface-container rounded-xl shadow-sm p-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md">
              {editId ? "Editar Categoría" : "Agregar Rápida"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-md relative z-10">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface">Nombre de Categoría</label>
                <input
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setErrors(""); }}
                  className="bg-surface text-on-surface font-body-sm text-body-sm px-md py-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm w-full"
                  placeholder="Ej. Zapatillas Deportivas"
                  type="text"
                />
                {errors && <p className="text-xs text-error">{errors}</p>}
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface">Categoría Padre (Opcional)</label>
                <select className="bg-surface text-on-surface font-body-sm text-body-sm px-md py-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm w-full appearance-none">
                  <option value="">Ninguna (Nivel Superior)</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="bg-surface text-on-surface font-body-sm text-body-sm px-md py-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm w-full resize-none"
                  placeholder="Breve descripción para SEO..."
                  rows={3}
                />
              </div>
              <div className="flex gap-sm">
                {editId && (
                  <button
                    type="button"
                    onClick={() => { setEditId(null); setNombre(""); setDescripcion(""); setErrors(""); }}
                    className="flex-1 bg-surface-container text-on-surface px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 mt-sm bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors shadow-sm w-full flex items-center justify-center gap-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">save</span>
                  )}
                  {editId ? "Actualizar" : "Guardar Categoría"}
                </button>
              </div>
            </form>
          </div>

          {/* Visualization / Hierarchy */}
          <div className="bg-surface-container rounded-xl shadow-sm p-lg flex flex-col items-center justify-center text-center py-xl relative">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-md shadow-sm">
                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">account_tree</span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">Vista de Árbol</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md max-w-[200px]">
                Visualiza la jerarquía completa de tu catálogo.
              </p>
              <button className="text-primary font-label-md text-label-md hover:underline decoration-primary/50 underline-offset-4">
                Abrir Explorador
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar la categoría "${deleteTarget?.nombre}"?`}
        warning={
          deleteTarget && deleteTarget.productos.length > 0
            ? `Esta categoría contiene <strong>${deleteTarget.productos.length}</strong> producto(s) asociado(s). Deberás reasignarlos o se quedarán sin categoría.`
            : undefined
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
