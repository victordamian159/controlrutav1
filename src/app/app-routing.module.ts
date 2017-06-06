import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//llamando clases de los componentes .ts
import {RutaComponent} from './components/ruta.component';
import {PcontrolComponent} from './components/pcontrol.component';
import {ProgComponent} from './components/prog.component';
import {RegtimeComponent} from './components/regtime.component';
import {TcontrolComponent} from './components/tcontrol.component';


import {BusComponent} from './components/bus.component';
import {EmpComponent} from './components/empresa.component';
import {PersComponent} from './components/personal.component';


//estableciencido las path para los componentes del aplicativo
const app_routes: Routes = [
      {path: 'ruta', component: RutaComponent},
      {path: 'pcontrol', component: PcontrolComponent},
      {path: 'prog', component: ProgComponent},
      {path: 'regtime', component: RegtimeComponent},
      {path: 'tcontrol', component:TcontrolComponent },

      {path: 'regpersonal', component:PersComponent },
      {path: 'regbus', component:BusComponent },
      {path: 'regempresa', component:EmpComponent }
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
