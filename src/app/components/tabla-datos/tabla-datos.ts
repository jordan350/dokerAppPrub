import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para el *ngFor
import { Registro } from '../../Models/registro.model';

@Component({
  selector: 'app-tabla-datos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-datos.html'
})
export class TablaDatosComponent {
  // Lista que simula los datos de la base de datos relacional [cite: 15, 18]
  listaRegistros: Registro[] = [
    { id: 1, nombre: 'Ejemplo 1', fecha: new Date(), esActivo: true, categoria: 'A', cantidad: 10, descripcion: 'Prueba Docker' },
  ];
}