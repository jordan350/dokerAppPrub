export interface Registro {
  id?: number;          // Entero
  nombre: string;       // Carácter/Varchar
  fecha: Date | string; // Fecha (puede ser ISO string para binding)
  esActivo: boolean;    // Booleano
  categoria: string;    // Carácter
  cantidad: number;     // Entero
  descripcion: string;  // Carácter
}