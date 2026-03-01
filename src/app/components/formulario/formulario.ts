import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para pipes y directivas básicas
import { FormsModule } from '@angular/forms'; // ¡para los inputs!
import { Registro } from '../../Models/registro.model';

@Component({
  selector: 'app-formulario',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.scss']
})
export class FormularioComponent {
  nuevoRegistro: Registro = {
    nombre: '',
    fecha: new Date(),
    esActivo: true,
    categoria: '',
    cantidad: 0,
    descripcion: ''
  };

  enviarDatos() {
    console.log('Datos a enviar:', this.nuevoRegistro);
    alert('¡Registro capturado!');
  }
}