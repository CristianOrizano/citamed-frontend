export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  email: string;
  perfil: string;
  permisos: string;
  area: string;
  territorio: string;
  region: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export type DialogMode = 'create' | 'edit' | 'view';
