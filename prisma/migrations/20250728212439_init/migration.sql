-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('INDIVIDUAL', 'EMPRESARIAL');

-- CreateEnum
CREATE TYPE "rol" AS ENUM ('USUARIO', 'EQUIPO', 'ADMIN', 'DESARROLLADOR');

-- CreateEnum
CREATE TYPE "rolEquipo" AS ENUM ('LECTOR', 'COMENTARISTA', 'EDITOR');

-- CreateEnum
CREATE TYPE "EstadoProducto" AS ENUM ('DISPONIBLE', 'AGOTADO', 'RESERVADO', 'VENCIDO', 'ELIMINADO');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('STOCK_BAJO', 'PRODUCTO_VENCIDO', 'ACTUALIZACION_APP', 'COMENTARIO_EQUIPO', 'REPOSICION_RECOMENDADA', 'PRODUCTO_POR_VENCER', 'RECOMENDACION');

-- CreateEnum
CREATE TYPE "EstadoRecordatorio" AS ENUM ('PENDIENTE', 'ENVIADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoComentario" AS ENUM ('pendiente', 'revisado');

-- CreateEnum
CREATE TYPE "AccionHistorial" AS ENUM ('agregado', 'modificado', 'eliminado');

-- CreateTable
CREATE TABLE "users" (
    "idUsuario" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "fotoPerfil" TEXT,
    "nombreEmpresa" TEXT,
    "nit" TEXT,
    "estado" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "tipoUsuario" "TipoUsuario" DEFAULT 'INDIVIDUAL',
    "rolEquipo" "rolEquipo",
    "perfilCompleto" BOOLEAN NOT NULL DEFAULT false,
    "empresaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "passwordReset" (
    "idSeguridad" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "passwordReset_pkey" PRIMARY KEY ("idSeguridad")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "idNotificacion" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("idNotificacion")
);

-- CreateTable
CREATE TABLE "preferenciasNotificaciones" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "stockBajo" BOOLEAN NOT NULL DEFAULT true,
    "productoVencido" BOOLEAN NOT NULL DEFAULT true,
    "comentarios" BOOLEAN NOT NULL DEFAULT true,
    "reposicion" BOOLEAN NOT NULL DEFAULT true,
    "actualizacion" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "preferenciasNotificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "codigoBarras" TEXT,
    "codigoQR" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fechaAdquisicion" TIMESTAMP(3) NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "estado" "EstadoProducto" NOT NULL,
    "imagen" TEXT NOT NULL,
    "categoria" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eliminadoEn" TIMESTAMP(3),

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recorStock" (
    "idRecordatorio" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidadMinima" INTEGER NOT NULL,
    "fechaRecordatorio" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoRecordatorio" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recorStock_pkey" PRIMARY KEY ("idRecordatorio")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "idComentario" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "fechaComentario" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoComentario" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("idComentario")
);

-- CreateTable
CREATE TABLE "NutriScan" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "esAlimento" BOOLEAN NOT NULL,
    "consulta" TEXT NOT NULL,
    "respuesta" JSONB NOT NULL,
    "tipoAnalisis" TEXT NOT NULL,
    "fechaAnalisis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "isTest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NutriScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "histInv" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "accion" "AccionHistorial" NOT NULL,
    "cantidad_anterior" INTEGER NOT NULL,
    "cantidad_nueva" INTEGER NOT NULL,
    "precio_anterior" DECIMAL(65,30) NOT NULL,
    "precio_nuevo" DECIMAL(65,30) NOT NULL,
    "fechaCambio" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "histInv_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_correo_key" ON "users"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "users_nit_key" ON "users"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "preferenciasNotificaciones_idUsuario_key" ON "preferenciasNotificaciones"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigoBarras_key" ON "productos"("codigoBarras");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigoQR_key" ON "productos"("codigoQR");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "users"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passwordReset" ADD CONSTRAINT "passwordReset_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "users"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "users"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferenciasNotificaciones" ADD CONSTRAINT "preferenciasNotificaciones_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "users"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recorStock" ADD CONSTRAINT "recorStock_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "users"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutriScan" ADD CONSTRAINT "NutriScan_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histInv" ADD CONSTRAINT "histInv_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histInv" ADD CONSTRAINT "histInv_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
