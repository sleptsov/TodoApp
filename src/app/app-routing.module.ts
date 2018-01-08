import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Error404Component } from './core/error404/error404.component';
const routes: Routes = [
  {
    path: 'todo',
    loadChildren: 'app/todo/todo.module#TodoModule'
  },
  { path: '', redirectTo: 'todo', pathMatch: 'full' },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
