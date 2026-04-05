import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos de administrador." }, { status: 403 });
    }

    const { id } = await params;
    const idInt = parseInt(id);

    const funa = await prisma.funa.findUnique({ where: { id: idInt } });
    if (!funa) {
      return NextResponse.json({ error: "Reporte no encontrado." }, { status: 404 });
    }

    // Borrar de Cloudinary si existe mediaUrl
    if (funa.mediaUrl) {
      try {
        // Extraer public_id de la URL de Cloudinary
        // Ejemplo: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/public_id.jpg
        const splitUrl = funa.mediaUrl.split('/');
        const lastPart = splitUrl[splitUrl.length - 1];
        const publicId = `evidencias/${lastPart.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId, {
          resource_type: funa.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? "video" : "image"
        });
      } catch (err) {
        console.error("Error al borrar de Cloudinary:", err);
      }
    }

    await prisma.funa.delete({
      where: { id: idInt },
    });

    return NextResponse.json({ message: "Reporte eliminado exitosamente." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar el reporte." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos de administrador." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nombre, ciudad, descripcion, etiquetas } = body;

    const updatedFuna = await prisma.funa.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        ciudad,
        descripcion,
        etiquetas: etiquetas || "",
      },
    });

    return NextResponse.json(updatedFuna);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar el reporte." }, { status: 500 });
  }
}
