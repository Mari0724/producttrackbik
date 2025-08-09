"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const allCloudinaryUploads_1 = require("../middleware/allCloudinaryUploads");
const user_service_1 = require("../services/user.service");
const zodValidate_1 = require("../utils/zodValidate");
const UserModel_1 = require("../models/UserModel");
const router = express_1.default.Router();
router.post("/usuarios", allCloudinaryUploads_1.uploadPerfiles.single("fotoPerfil"), async (req, res) => {
    try {
        const customReq = req;
        const body = customReq.body;
        const foto = customReq.file?.path ?? "";
        // Validación con Zod
        const parsed = (0, zodValidate_1.zodValidate)(UserModel_1.userSchema, body);
        let datosValidados;
        if (!parsed.success) {
            res.status(400).json({
                message: "Datos inválidos",
                detalles: parsed.error,
            });
            return; // ✅ este sí evita el error en .data
        }
        else {
            datosValidados = parsed.data;
        }
        // Crear usuario (si no es obligatoria la imagen, esto está bien)
        const usuario = await (0, user_service_1.createUser)({
            ...parsed.data,
            fotoPerfil: foto,
        });
        res.status(201).json({ message: "Usuario creado correctamente", data: usuario });
    }
    catch (error) {
        // 🔧 Cast para acceder a error.message si existe
        const err = error;
        console.error(err.message || error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
router.put("/usuarios/:id/foto", allCloudinaryUploads_1.uploadPerfiles.single("fotoPerfil"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        console.log("aqui");
        if (isNaN(id)) {
            res.status(400).json({ message: "ID inválido" });
        }
        else {
            const customReq = req;
            console.log(customReq.file);
            if (!customReq.file || !customReq.file.path) {
                res.status(400).json({ message: "No se recibió la imagen" });
            }
            else {
                const imageUrl = customReq.file.path;
                await (0, user_service_1.updateUser)(id, { fotoPerfil: imageUrl });
                res.status(200).json({ message: "Foto de perfil actualizada", url: imageUrl });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la imagen" });
    }
});
exports.default = router;
