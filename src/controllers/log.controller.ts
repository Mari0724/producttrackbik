import { Body, Controller, Post, Route, Tags } from "tsoa";
import { validarCredenciales } from "../services/log.service";
import { LoginRequest, LoginResponse } from "../interfaces/log.interface";
import { LogService } from "../services/log.service";
import { SolicitudResetDTO, ConfirmacionResetDTO } from "../models/PasswordResetDTO";

@Route("auth")
@Tags("Autenticación")
export class LogController extends Controller {

  /**
   * Inicia sesión en el sistema con correo y contraseña.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/log.controller)
   * 
   * @param body Datos de inicio de sesión.
   * @returns Token de autenticación y datos del usuario.
   *
   */
  @Post("login")
  public async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const { user, token, requiereCompletarPerfil } = await validarCredenciales(
      body.correo,
      body.password
    );

    return {
      token,
      requiereCompletarPerfil,
      user: {
        idUsuario: user.idUsuario,
        username: user.username,
        correo: user.correo,
        rol: user.rol,
        tipoUsuario: user.tipoUsuario,
        rolEquipo: user.rolEquipo || "",
        perfilCompleto: user.perfilCompleto,
        empresaId: user.empresaId,
      },
    };
  }

  /**
   * Solicita el restablecimiento de contraseña.
   *
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/log.controller)
   */
  @Post("solicitar-reset")
  public async solicitarReset(
    @Body() body: SolicitudResetDTO
  ): Promise<{ mensaje: string }> {
    const service = new LogService();
    return await service.solicitarReset(body.correo);
  }

  /**
   * Confirma el restablecimiento de contraseña con el token recibido.
   *
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/log.controller)
   */
  @Post("confirmar-reset")
  public async confirmarReset(
    @Body() body: ConfirmacionResetDTO
  ): Promise<{ mensaje: string }> {
    const service = new LogService();
    return await service.confirmarReset(body.token, body.nuevaContrasena);
  }
}