import { deleteSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ message: "Sesión cerrada exitosamente." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo cerrar la sesión." }, { status: 500 });
  }
}
