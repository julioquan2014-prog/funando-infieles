import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const funas = await prisma.funa.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(funas);
  } catch (error) {
    return NextResponse.json({ error: "No se pudieron obtener las funas." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const nombre = formData.get("nombre");
    const ciudad = formData.get("ciudad");
    const descripcion = formData.get("descripcion");
    const etiquetas = formData.get("etiquetas");
    const file = formData.get("evidencia");

    let mediaUrl = "";

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      
      const result = await uploadToCloudinary(buffer, fileName);
      mediaUrl = result.secure_url;
    }

    const nuevaFuna = await prisma.funa.create({
      data: {
        nombre,
        ciudad,
        descripcion,
        etiquetas,
        mediaUrl,
      },
    });

    return NextResponse.json(nuevaFuna);
  } catch (error) {
    console.error("Error en POST /api/funas:", error);
    return NextResponse.json({ error: "Error al crear el reporte." }, { status: 500 });
  }
}
