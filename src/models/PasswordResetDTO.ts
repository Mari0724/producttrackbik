export interface SolicitudResetDTO {
  correo: string;
}

export interface ConfirmacionResetDTO {
  token: string;
  nuevaContrasena: string;
}