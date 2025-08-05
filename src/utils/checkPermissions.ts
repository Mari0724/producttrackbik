const permisos = {
  ver: ["ADMIN", "DESARROLLADOR", "USUARIO", "LECTOR", "COMENTARISTA", "EDITOR"],
  crear: ["ADMIN", "DESARROLLADOR", "USUARIO", "EDITOR"],
  editar: ["ADMIN", "DESARROLLADOR", "USUARIO", "EDITOR"],
  eliminar: ["ADMIN", "DESARROLLADOR", "USUARIO", "EDITOR"],
  comentar: ["ADMIN", "DESARROLLADOR", "USUARIO", "COMENTARISTA", "EDITOR"],
};

export function puede(accion: keyof typeof permisos, rol: string): boolean {
  return permisos[accion]?.includes(rol);
}