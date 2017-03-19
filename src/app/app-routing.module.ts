import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//llamando clases de los componentes .ts
import {RutaComponent} from './components/ruta.component';
import {PcontrolComponent} from './components/pcontrol.component';
import {ProgComponent} from './components/prog.component';
import {RegtimeComponent} from './components/regtime.component';
import {TcontrolComponent} from './components/tcontrol.component';

//estableciencido las path para los componentes del aplicativo
const app_routes: Routes = [
      {path: 'ruta', component: RutaComponent},
      {path: 'pcontrol', component: PcontrolComponent},
      {path: 'prog', component: ProgComponent},
      {path: 'regtime', component: RegtimeComponent},
      {path: 'tcontrol', component:TcontrolComponent }
];



@NgModule({
  imports: [
        RouterModule.forRoot(app_routes)
  ],

  exports: [
        RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }
