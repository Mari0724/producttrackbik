"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permitirRolesYRolEquipo = permitirRolesYRolEquipo;
function permitirRolesYRolEquipo(rolesPermitidos, rolesEquipoPermitidos, requiereTipoEmpresarial = false // nuevo parámetro
) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(403).json({ mensaje: "Acceso no autorizado" });
        }
        if (!rolesPermitidos.includes(user.rol)) {
            return res.status(403).json({ mensaje: "Rol no permitido" });
        }
        if (requiereTipoEmpresarial && user.tipoUsuario !== "EMPRESARIAL") {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo las empresas pueden crear usuarios de equipo." });
        }
        if (user.rol === "EQUIPO" && rolesEquipoPermitidos &&
            (!user.rolEquipo || !rolesEquipoPermitidos.includes(user.rolEquipo))) {
            return res.status(403).json({ mensaje: "Rol de equipo no permitido" });
        }
        next();
    };
}
