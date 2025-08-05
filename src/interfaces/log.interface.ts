export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  requiereCompletarPerfil: boolean;
  user: {
    idUsuario: number;
    username: string;
    correo: string;
    rol: string;
    tipoUsuario: string | null;
    rolEquipo: string;
    perfilCompleto: boolean;
    empresaId: number | null;
  };
}