export interface HistorialInventarioDTO {
  id: number;
  productoId: number;
  nombreProducto: string;
  accion: string;
  cantidad_anterior: number;
  cantidad_nueva: number;
  precio_anterior: number;
  precio_nuevo: number;
  fechaCambio: Date;
  usuario: {
    nombreCompleto: string;
    tipoUsuario: string;
    empresaId?: number;
  };
}