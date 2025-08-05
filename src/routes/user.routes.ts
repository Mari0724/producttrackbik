import express, { Request, Response } from 'express';
import { uploadPerfiles } from "../middleware/allCloudinaryUploads";
import { createUser, updateUser } from "../services/user.service";
import { zodValidate } from "../utils/zodValidate";
import { userSchema } from "../models/UserModel";

const router = express.Router();

router.post("/usuarios", uploadPerfiles.single("fotoPerfil"), async (req: Request, res: Response) => {
  try {
    const customReq = req as Request & { file?: Express.Multer.File };
    const body = customReq.body;
    const foto = customReq.file?.path ?? "";

    // Validación con Zod
    const parsed = zodValidate(userSchema, body);
    let datosValidados;
    if (!parsed.success) {
      res.status(400).json({
        message: "Datos inválidos",
        detalles: parsed.error,
      });
      return; // ✅ este sí evita el error en .data
    } else {
      datosValidados = parsed.data;
    }

    // Crear usuario (si no es obligatoria la imagen, esto está bien)
    const usuario = await createUser({
      ...parsed.data,
      fotoPerfil: foto,
    });

    res.status(201).json({ message: "Usuario creado correctamente", data: usuario });
  } catch (error: unknown) {
    // 🔧 Cast para acceder a error.message si existe
    const err = error as Error;
    console.error(err.message || error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});



router.put("/usuarios/:id/foto", uploadPerfiles.single("fotoPerfil"), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    console.log("aqui");
    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
    } else {
      const customReq = req as Request & { file?: Express.Multer.File };
      console.log(customReq.file);
      if (!customReq.file || !customReq.file.path) {
        res.status(400).json({ message: "No se recibió la imagen" });
      } else {
        const imageUrl = customReq.file.path;

        await updateUser(id, { fotoPerfil: imageUrl });

        res.status(200).json({ message: "Foto de perfil actualizada", url: imageUrl });
      }
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la imagen" });
  }
});



export default router;