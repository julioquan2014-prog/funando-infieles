import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan credenciales." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
    }

    await createSession(user.id, user.role);

    return NextResponse.json({ message: "Inicio de sesión exitoso." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al iniciar sesión." }, { status: 500 });
  }
}
