import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SorteoComponent } from './components/sorteo/sorteo.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { HomeComponent } from './pages/home/home.component';
import { TerminosCondicionesComponent } from './pages/terminos-condiciones/terminos-condiciones.component';

export const routes: Routes = [
  { path: '', component: SorteoComponent },
  { path: 'acerca-de', component: AcercaDeComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'terminos', component: TerminosCondicionesComponent },
  { path: '', redirectTo: '', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '' } // Cualquier otra ruta redirige a sorteo
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }