import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function trimString(value: string): string {
  return value.trim();
}

export async function GET() {
  try {
    const categorias = await prisma.categorias.findMany({
      include: { productos: true },
    });
    return NextResponse.json(categorias);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener las categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      where: { nombre: nombreLimpio },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Ya existe una categoría con ese nombre" },
        { status: 409 }
      );
    }

    const categoria = await prisma.categorias.create({
      data: { nombre: nombreLimpio },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear la categoría" },
      { status: 500 }
    );
  }
}
