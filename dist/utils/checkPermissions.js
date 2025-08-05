"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.puede = puede;
const permisos = {
    ver: ["ADMIN", "DESARROLLADOR", "USUARIO", "LECTOR", "COMENTARISTA", "EDITOR"],
    crear: ["ADMIN", "DESARROLLADOR", "USUARIO", "EDITOR"],
    editar: ["ADMIN", "DESARROLLADOR", "USUARIO", "EDITOR"],
    eliminar: ["ADMIN", "DESARROLLADOR", "USUARIO", "EDITOR"],
    comentar: ["ADMIN", "DESARROLLADOR", "USUARIO", "COMENTARISTA", "EDITOR"],
};
function puede(accion, rol) {
    return permisos[accion]?.includes(rol);
}
