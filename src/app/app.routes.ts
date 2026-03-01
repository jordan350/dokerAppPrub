import { Routes } from '@angular/router';
import { FormularioComponent } from './components/formulario/formulario';
import { TablaDatosComponent } from './components/tabla-datos/tabla-datos';

export const routes: Routes = [
  { path: 'registro', component: FormularioComponent },
  { path: 'visualizar', component: TablaDatosComponent },
  { path: '', redirectTo: '/registro', pathMatch: 'full' } // Ruta por defecto
];