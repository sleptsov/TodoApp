import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { Error404Component } from './error404/error404.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CollapseModule.forRoot()
  ],
  declarations: [
    NavComponent,
    Error404Component,
    LoaderComponent
  ],
  exports: [
    NavComponent,
    Error404Component,
    LoaderComponent
  ],
  providers: [
    LoaderService
  ]
})
export class CoreModule { }
