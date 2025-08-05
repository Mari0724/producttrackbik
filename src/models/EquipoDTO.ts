export interface EquipoDTO {
  username: string;
  correo: string;
  password: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  fotoPerfil?: string;
  rolEquipo: "LECTOR" | "COMENTARISTA" | "EDITOR";
  estado?: "activo" | "inactivo";
  empresaId?: number;
  perfilCompleto?: boolean;
}