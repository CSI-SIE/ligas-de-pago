import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: '**',
    redirectTo: '/inicio',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
