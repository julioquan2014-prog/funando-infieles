import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Función auxiliar para subir el archivo a Cloudinary
const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "evidencias",
        public_id: fileName.split('.')[0],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export async function GET() {
  try {
    const funas = await prisma.funa.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(funas);
  } catch (error) {
    console.error("Error en GET /api/funas:", error);
    return NextResponse.json({ error: "No se pudieron obtener los reportes." }, { status: 500 });
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
        nombre: nombre?.toString() || "",
        ciudad: ciudad?.toString() || "",
        descripcion: descripcion?.toString() || "",
        etiquetas: etiquetas?.toString() || "",
        mediaUrl,
      },
    });

    return NextResponse.json(nuevaFuna);
  } catch (error) {
    console.error("Error en POST /api/funas:", error);
    return NextResponse.json({ error: "Error al crear el reporte." }, { status: 500 });
  }
}
