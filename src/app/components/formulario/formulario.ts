import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Registro } from '../../Models/registro.model';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-formulario',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.scss']
})
export class FormularioComponent implements OnInit {
  // treat fecha as ISO date string for the input control
  nuevoRegistro: Registro = {
    nombre: '',
    fecha: '' as any,
    esActivo: true,
    categoria: '',
    cantidad: 0,
    descripcion: ''
  };

  editandoId: number | null = null;
  cargando: boolean = false;
  mensaje: string = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  constructor(
    private registroService: RegistroService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Verificar si estamos editando (se pasa el ID como parámetro de ruta o query)
    // Primero intentamos obtenerlo de los route params (:id), luego de query params (?id=)
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.cargarRegistro(Number(params['id']));
      }
    });
    
    // También escuchamos queryParams por retrocompatibilidad
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['id'] && !this.editandoId) {
        this.cargarRegistro(Number(params['id']));
      }
    });
  }

  cargarRegistro(id: number) {
    console.log('cargarRegistro called with id', id);
    this.cargando = true;
    this.registroService.obtenerRegistroById(id).subscribe({
      next: (data) => {
        console.log('registro recibido del servidor', data);
        // Convertir fecha a cadena ISO yyyy-MM-dd para el input
        if (data && data.fecha) {
          const d = new Date(data.fecha);
          data.fecha = d.toISOString().substring(0, 10) as any;
        }
        this.nuevoRegistro = data;
        this.editandoId = id;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el registro:', err);
        this.mensaje = 'Error al cargar el registro';
        this.tipoMensaje = 'error';
        this.cargando = false;
      }
    });
  }

  enviarDatos() {
    if (!this.validarFormulario()) {
      return;
    }

    this.cargando = true;

    if (this.editandoId) {
      // Actualizar registro existente
      // convertimos fecha a Date para el backend si viene en texto
      const payload = {
        ...this.nuevoRegistro,
        fecha: typeof this.nuevoRegistro.fecha === 'string' ? new Date(this.nuevoRegistro.fecha) : this.nuevoRegistro.fecha
      } as Registro;
      this.registroService.actualizarRegistro(this.editandoId, payload).subscribe({
        next: (response) => {
          this.mensaje = 'Registro actualizado correctamente';
          this.tipoMensaje = 'exito';
          this.cargando = false;
          this.limpiarFormulario();
          setTimeout(() => {
            this.router.navigate(['/visualizar']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.mensaje = 'Error al actualizar el registro';
          this.tipoMensaje = 'error';
          this.cargando = false;
        }
      });
    } else {
      // Crear nuevo registro
      const payload = {
        ...this.nuevoRegistro,
        fecha: typeof this.nuevoRegistro.fecha === 'string' ? new Date(this.nuevoRegistro.fecha) : this.nuevoRegistro.fecha
      } as Registro;
      this.registroService.crearRegistro(payload).subscribe({
        next: (response) => {
          this.mensaje = 'Registro creado correctamente';
          this.tipoMensaje = 'exito';
          this.cargando = false;
          this.limpiarFormulario();
          setTimeout(() => {
            this.router.navigate(['/visualizar']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.mensaje = 'Error al crear el registro';
          this.tipoMensaje = 'error';
          this.cargando = false;
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.nuevoRegistro.nombre.trim()) {
      this.mensaje = 'El nombre es requerido';
      this.tipoMensaje = 'error';
      return false;
    }
    if (!this.nuevoRegistro.categoria) {
      this.mensaje = 'La categoría es requerida';
      this.tipoMensaje = 'error';
      return false;
    }
    if (!this.nuevoRegistro.fecha) {
      this.mensaje = 'La fecha es requerida';
      this.tipoMensaje = 'error';
      return false;
    }
    if (this.nuevoRegistro.cantidad < 0) {
      this.mensaje = 'La cantidad no puede ser negativa';
      this.tipoMensaje = 'error';
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.nuevoRegistro = {
      nombre: '',
      fecha: '' as any,
      esActivo: true,
      categoria: '',
      cantidad: 0,
      descripcion: ''
    };
    this.editandoId = null;
  }

  cancelar() {
    this.limpiarFormulario();
    this.router.navigate(['/visualizar']);
  }
}