import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registro } from '../Models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'http://localhost:3000/registros';

  constructor(private http: HttpClient) {}

  // CREATE - Agregar nuevo registro
  crearRegistro(registro: Registro): Observable<{ id: number }> {
    const payload = { ...registro } as any;
    // ensure fecha is ISO string date only
    if (payload.fecha instanceof Date) {
      payload.fecha = payload.fecha.toISOString().substring(0, 10);
    }
    return this.http.post<{ id: number }>(this.apiUrl, payload);
  }

  // READ - Obtener todos los registros
  obtenerRegistros(): Observable<Registro[]> {
    return this.http.get<Registro[]>(this.apiUrl);
  }

  // READ - Obtener un registro por ID
  obtenerRegistroById(id: number): Observable<Registro> {
    return this.http.get<Registro>(`${this.apiUrl}/${id}`);
  }

  // UPDATE - Actualizar un registro
  actualizarRegistro(id: number, registro: Registro): Observable<{ message: string }> {
    const payload = { ...registro } as any;
    if (payload.fecha instanceof Date) {
      payload.fecha = payload.fecha.toISOString().substring(0, 10);
    }
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, payload);
  }

  // DELETE - Eliminar un registro
  eliminarRegistro(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
