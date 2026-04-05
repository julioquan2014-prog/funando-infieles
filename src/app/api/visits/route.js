import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();
    
    // Intentar obtener la IP de varios headers comunes en Vercel/Proxies
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    
    let ip = "127.0.0.1"; // Fallback para local
    
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
      ip = realIp;
    }

    // Registrar la visita si la IP no existe
    try {
      await prisma.visit.upsert({
        where: { ip },
        update: {}, // No hacemos nada si ya existe
        create: { ip }
      });
    } catch (e) {
      // Ignorar errores de duplicados o de escritura silenciosamente para no romper la app
      console.error("Error al registrar visita:", e);
    }

    // Obtener el conteo total de visitas únicas
    const totalVisits = await prisma.visit.count();

    return NextResponse.json({ totalVisits });
  } catch (error) {
    console.error("Error en API de visitas:", error);
    return NextResponse.json({ error: "No se pudo procesar la visita." }, { status: 500 });
  }
}
