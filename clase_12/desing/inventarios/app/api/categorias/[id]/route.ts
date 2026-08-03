import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function trimString(value: string): string {
  return value.trim();
}

type Params = Promise<{ id: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const categoriaId = parseInt(id);

  if (isNaN(categoriaId)) {
    return NextResponse.json(
      { error: "ID de categoría inválido" },
      { status: 400 }
    );
  }

  try {
    const categoria = await prisma.categorias.findUnique({
      where: { id: categoriaId },
      include: { productos: true },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener la categoría" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const categoriaId = parseInt(id);

  if (isNaN(categoriaId)) {
    return NextResponse.json(
      { error: "ID de categoría inválido" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { nombre } = body;

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

    const existente = await prisma.categorias.findFirst({
      where: {
        nombre: nombreLimpio,
        id: { not: categoriaId },
      },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Ya existe una categoría con ese nombre" },
        { status: 409 }
      );
    }

    const categoria = await prisma.categorias.update({
      where: { id: categoriaId },
      data: { nombre: nombreLimpio },
    });

    return NextResponse.json(categoria);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar la categoría" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const categoriaId = parseInt(id);

  if (isNaN(categoriaId)) {
    return NextResponse.json(
      { error: "ID de categoría inválido" },
      { status: 400 }
    );
  }

  try {
    const productosAsociados = await prisma.productos.count({
      where: { categoria_id: categoriaId },
    });

    if (productosAsociados > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar la categoría porque tiene productos asociados",
        },
        { status: 409 }
      );
    }

    await prisma.categorias.delete({
      where: { id: categoriaId },
    });

    return NextResponse.json({ message: "Categoría eliminada correctamente" });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar la categoría" },
      { status: 500 }
    );
  }
}
