import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function trimString(value: string): string {
  return value.trim();
}

type Params = Promise<{ id: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const productoId = parseInt(id);

  if (isNaN(productoId)) {
    return NextResponse.json(
      { error: "ID de producto inválido" },
      { status: 400 }
    );
  }

  try {
    const producto = await prisma.productos.findUnique({
      where: { id: productoId },
      include: { categoria: true, proveedor: true },
    });

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(producto);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const productoId = parseInt(id);

  if (isNaN(productoId)) {
    return NextResponse.json(
      { error: "ID de producto inválido" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { nombre, precio, stock, categoria_id, proveedor_id } = body;

    if (!nombre || typeof nombre !== "string") {
      return NextResponse.json(
        { error: "El campo nombre es obligatorio" },
        { status: 400 }
      );
    }

    const nombreLimpio = trimString(nombre);

    if (nombreLimpio === "") {
      return NextResponse.json(
        { error: "El campo nombre no puede estar vacío o contener solo espacios" },
        { status: 400 }
      );
    }

    if (precio === undefined || precio === null || typeof precio !== "number") {
      return NextResponse.json(
        { error: "El campo precio es obligatorio y debe ser un número" },
        { status: 400 }
      );
    }

    if (precio <= 0) {
      return NextResponse.json(
        { error: "El precio debe ser mayor a cero" },
        { status: 400 }
      );
    }

    const decimales = precio.toString().split(".")[1];
    if (decimales && decimales.length > 2) {
      return NextResponse.json(
        { error: "El precio solo puede tener hasta 2 decimales" },
        { status: 400 }
      );
    }

    if (stock === undefined || stock === null || typeof stock !== "number" || !Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "El campo stock es obligatorio y debe ser un número entero" },
        { status: 400 }
      );
    }

    if (stock <= 0) {
      return NextResponse.json(
        { error: "El stock debe ser un número entero mayor a cero" },
        { status: 400 }
      );
    }

    if (!categoria_id || typeof categoria_id !== "number" || isNaN(categoria_id)) {
      return NextResponse.json(
        { error: "El campo categoria_id es obligatorio y debe ser un número válido" },
        { status: 400 }
      );
    }

    if (!proveedor_id || typeof proveedor_id !== "number" || isNaN(proveedor_id)) {
      return NextResponse.json(
        { error: "El campo proveedor_id es obligatorio y debe ser un número válido" },
        { status: 400 }
      );
    }

    const categoriaExiste = await prisma.categorias.findUnique({
      where: { id: categoria_id },
    });

    if (!categoriaExiste) {
      return NextResponse.json(
        { error: "La categoría especificada no existe" },
        { status: 404 }
      );
    }

    const proveedorExiste = await prisma.proveedores.findUnique({
      where: { id: proveedor_id },
    });

    if (!proveedorExiste) {
      return NextResponse.json(
        { error: "El proveedor especificado no existe" },
        { status: 404 }
      );
    }

    const producto = await prisma.productos.update({
      where: { id: productoId },
      data: {
        nombre: nombreLimpio,
        precio,
        stock,
        categoria_id,
        proveedor_id,
      },
      include: { categoria: true, proveedor: true },
    });

    return NextResponse.json(producto);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const productoId = parseInt(id);

  if (isNaN(productoId)) {
    return NextResponse.json(
      { error: "ID de producto inválido" },
      { status: 400 }
    );
  }

  try {
    await prisma.productos.delete({
      where: { id: productoId },
    });

    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
