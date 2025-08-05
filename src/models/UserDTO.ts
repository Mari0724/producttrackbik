export interface UserDTO {
  username: string;
  correo: string;
  password: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  fotoPerfil?: string;
  tipoUsuario?: "INDIVIDUAL" | "EMPRESARIAL";
  nombreEmpresa?: string;
  nit?: string;
  rol: "USUARIO" | "EQUIPO" | "ADMIN" | "DESARROLLADOR";
  rolEquipo?: "LECTOR" | "COMENTARISTA" | "EDITOR";
  estado?: "activo" | "inactivo";
  empresaId?: number;
  perfilCompleto?: boolean;
}

import { IsInt, IsString, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class ChangePasswordDTO {
  @IsInt()
  @Type(() => Number)
  id!: number;

  @IsString()
  @MinLength(6)
  currentPassword!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}