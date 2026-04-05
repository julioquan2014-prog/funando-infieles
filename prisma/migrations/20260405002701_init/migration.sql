-- CreateTable
CREATE TABLE "Funa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "etiquetas" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
