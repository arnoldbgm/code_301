import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function trimString(value: string): string {
  return value.trim();
}

type Params = Promise<{ id: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const proveedorId = parseInt(id);

  if (isNaN(proveedorId)) {
    return NextResponse.json(
      { error: "ID de proveedor inválido" },
      { status: 400 }
    );
  }

  try {
    const proveedor = await prisma.proveedores.findUnique({
      where: { id: proveedorId },
      include: { productos: true },
    });

    if (!proveedor) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(proveedor);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el proveedor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const proveedorId = parseInt(id);

  if (isNaN(proveedorId)) {
    return NextResponse.json(
      { error: "ID de proveedor inválido" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { nombre, ruc, email } = body;

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

    if (!ruc || typeof ruc !== "string") {
      return NextResponse.json(
        { error: "El campo RUC es obligatorio" },
        { status: 400 }
      );
    }

    const rucLimpio = trimString(ruc);

    if (rucLimpio === "") {
      return NextResponse.json(
        { error: "El campo RUC no puede estar vacío o contener solo espacios" },
        { status: 400 }
      );
    }

    if (!/^(10|20)\d{9}$/.test(rucLimpio)) {
      return NextResponse.json(
        {
          error:
            "El RUC debe tener exactamente 11 caracteres numéricos y comenzar con 10 o 20",
        },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "El campo email es obligatorio" },
        { status: 400 }
      );
    }

    const emailLimpio = trimString(email);

    if (emailLimpio === "") {
      return NextResponse.json(
        { error: "El campo email no puede estar vacío o contener solo espacios" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLimpio)) {
      return NextResponse.json(
        { error: "El formato del email no es válido" },
        { status: 400 }
      );
    }

    const rucExistente = await prisma.proveedores.findFirst({
      where: {
        ruc: rucLimpio,
        id: { not: proveedorId },
      },
    });

    if (rucExistente) {
      return NextResponse.json(
        { error: "Ya existe un proveedor con ese RUC" },
        { status: 409 }
      );
    }

    const emailExistente = await prisma.proveedores.findFirst({
      where: {
        email: emailLimpio,
        id: { not: proveedorId },
      },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "Ya existe un proveedor con ese email" },
        { status: 409 }
      );
    }

    const proveedor = await prisma.proveedores.update({
      where: { id: proveedorId },
      data: {
        nombre: nombreLimpio,
        ruc: rucLimpio,
        email: emailLimpio,
      },
    });

    return NextResponse.json(proveedor);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const proveedorId = parseInt(id);

  if (isNaN(proveedorId)) {
    return NextResponse.json(
      { error: "ID de proveedor inválido" },
      { status: 400 }
    );
  }

  try {
    const productosAsociados = await prisma.productos.count({
      where: { proveedor_id: proveedorId },
    });

    if (productosAsociados > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar el proveedor porque tiene productos asociados",
        },
        { status: 409 }
      );
    }

    await prisma.proveedores.delete({
      where: { id: proveedorId },
    });

    return NextResponse.json({ message: "Proveedor eliminado correctamente" });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar el proveedor" },
      { status: 500 }
    );
  }
}
