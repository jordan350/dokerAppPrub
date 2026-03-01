export interface Registro {
  id?: number;          // Entero
  nombre: string;       // Carácter/Varchar
  fecha: Date;          // Fecha
  esActivo: boolean;    // Booleano
  categoria: string;    // Carácter
  cantidad: number;     // Entero
  descripcion: string;  // Carácter
}