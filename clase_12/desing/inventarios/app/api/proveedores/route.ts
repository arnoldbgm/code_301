import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function trimString(value: string): string {
  return value.trim();
}

export async function GET() {
  try {
    const proveedores = await prisma.proveedores.findMany({
      include: { productos: true },
    });
    return NextResponse.json(proveedores);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los proveedores" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      where: { ruc: rucLimpio },
    });

    if (rucExistente) {
      return NextResponse.json(
        { error: "Ya existe un proveedor con ese RUC" },
        { status: 409 }
      );
    }

    const emailExistente = await prisma.proveedores.findFirst({
      where: { email: emailLimpio },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "Ya existe un proveedor con ese email" },
        { status: 409 }
      );
    }

    const proveedor = await prisma.proveedores.create({
      data: {
        nombre: nombreLimpio,
        ruc: rucLimpio,
        email: emailLimpio,
      },
    });

    return NextResponse.json(proveedor, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el proveedor" },
      { status: 500 }
    );
  }
}
