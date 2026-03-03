import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Registro } from '../../Models/registro.model';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-tabla-datos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-datos.html'
})
export class TablaDatosComponent implements OnInit {
  listaRegistros: Registro[] = [];
  cargando: boolean = false;
  mensaje: string = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  constructor(
    private registroService: RegistroService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.cargando = true;
    this.registroService.obtenerRegistros().subscribe({
      next: (data) => {
        console.log('Registros cargados:', data);
        // Si la API devolviera un objeto en lugar de un arreglo, convertirlo
        let registrosArray: Registro[] = [];
        if (Array.isArray(data)) {
          registrosArray = data;
        } else if (data && typeof data === 'object') {
          registrosArray = [data as Registro];
        }
        this.listaRegistros = registrosArray.map(reg => ({
          ...reg,
          fecha: new Date(reg.fecha)
        }));
        this.cargando = false;
        console.log('cargando flag after update:', this.cargando);
        this.cdr.detectChanges();
        this.mensaje = '';
      },
      error: (err) => {
        console.error('Error al cargar registros:', err);
        this.mensaje = 'Error al cargar los registros: ' + (err.error?.error || err.message || 'Error desconocido');
        this.tipoMensaje = 'error';
        this.cargando = false;
      }
    });
  }

  editar(id: number | undefined) {
    if (id) {
      // navegar mostrando el parámetro en la url para que el usuario lo vea
      // usamos navigateByUrl para evitar que Angular suprima la query si ya estamos
      // en la misma ruta.
      this.router.navigateByUrl(`/registro?id=${id}`);
    }
  }

  eliminar(id: number | undefined) {
    if (!id) return;

    if (!confirm('¿Está seguro de que desea eliminar este registro?')) {
      return;
    }

    this.registroService.eliminarRegistro(id).subscribe({
      next: () => {
        this.mensaje = 'Registro eliminado correctamente';
        this.tipoMensaje = 'exito';
        this.cargarRegistros();
        setTimeout(() => {
          this.mensaje = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.mensaje = 'Error al eliminar el registro';
        this.tipoMensaje = 'error';
      }
    });
  }

  crearNuevo() {
    this.router.navigate(['/registro']);
  }
}