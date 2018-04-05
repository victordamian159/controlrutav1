import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//llamando clases de los componentes .ts
import {RutaComponent} from './components/ruta.component';
import {PcontrolComponent} from './components/pcontrol.component';
import {ProgComponent} from './components/prog.component';
import {RegtimeComponent} from './components/regtime.component';
import {TcontrolComponent} from './components/tcontrol.component';
import {distribTiempoComponent} from './components/distribTiempo.component';
import {menuComponent} from './components/menu.component';
import {BusComponent} from './components/bus.component';
import {EmpPerComponent} from './components/empresapersonal.component';
import {EmpSubEmpComponent} from './components/empSubemp.component';
import {PersComponent} from './components/personal.component';
import {loginUserComponent} from './components/loginUser.component';
import {RegistroDiarioComponent} from './components/registrodiario.component';
//import {AppComponent} from './app.component';

import {reportPersonas} from './components/reportPersonas.component';
import {reportBuses} from './components/reportBus.component';

import {consulVistaEnLineaComponent} from './components/vistaEnLinea.component';
import {consulAlertNotifComponent} from './components/alertNotificacion.component';
import {consulIncidenciaComponent} from './components/incidencia.component';
import {csl_TrackByPlacaComponent} from './components/trackerByPlaca.component';
/*
  import {LoginComponent} from './login/_login/_login.component'; import { RegisterComponent } from './login/register/register.component';
  //COMPONENTES PARA EL LOGIN 
  import { HomeComponent } from './home/index'; import { LoginComponent } from './login/index';
  import { RegisterComponent } from './register/index'; import { AuthGuard } from './login/guards/auth.guard';
*/
import {AuthGuard} from './components/auth.guard';

//estableciencido las path para los componentes del aplicativo
const app_routes: Routes = [
      {path: 'ruta', component: RutaComponent,canActivate: [AuthGuard]},
      {path: 'pcontrol', component: PcontrolComponent,canActivate: [AuthGuard]},
      {path: 'prog', component: ProgComponent,canActivate: [AuthGuard]},
      {path: 'regtime', component: RegtimeComponent,canActivate: [AuthGuard]},
      {path: 'tcontrol', component:TcontrolComponent,canActivate: [AuthGuard]},
      {path: 'regpersonal', component:PersComponent,canActivate: [AuthGuard]},
      {path: 'regbus', component:BusComponent,canActivate: [AuthGuard]}, 
      {path: 'menu',   component:menuComponent,canActivate: [AuthGuard]}, /* ISNTRUCCIONES??*/
      {path: 'regempper', component:EmpPerComponent,canActivate: [AuthGuard]}, 
      {path: 'regempsubemp',component:EmpSubEmpComponent,canActivate: [AuthGuard]},
      {path: 'disttiempo',component:distribTiempoComponent,canActivate: [AuthGuard]},
      {path: 'reportPers', component:reportPersonas,canActivate: [AuthGuard]}, 
      {path: 'reportBus', component:reportBuses,canActivate: [AuthGuard]}, 
      {path: 'regdiario', component:RegistroDiarioComponent,canActivate:[AuthGuard]},

      {path: 'consVistaEnLinea', component:consulVistaEnLineaComponent,canActivate: [AuthGuard]},
      {path: 'consTrackByPlaca', component:csl_TrackByPlacaComponent,canActivate: [AuthGuard]}, 
      {path: 'consAlertNotific', component:consulAlertNotifComponent,canActivate: [AuthGuard]}, 
      {path: 'consIncidencias', component:consulIncidenciaComponent,canActivate: [AuthGuard]}, 

      {path: 'login', component:loginUserComponent },
      {path: '**', redirectTo: 'login' } /* __ ** : SI ESCRIBE CUALQUIER COSA MANDA AL LOGIN*/
];

@NgModule({
  imports: [RouterModule.forRoot(app_routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

