import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json();

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está registrado." }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Asignar rol ADMIN si el correo coincide con el root
    const role = email.toLowerCase() === "julioquan2014@gmail.com" ? "ADMIN" : "USER";

    const newUser = await prisma.user.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        role: role,
      },
    });

    return NextResponse.json({ message: "Usuario creado exitosamente." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al registrar el usuario." }, { status: 500 });
  }
}
