import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//llamando clases de los componentes .ts
import {RutaComponent} from './components/ruta.component';
import {PcontrolComponent} from './components/pcontrol.component';
import {ProgComponent} from './components/prog.component';
import {RegtimeComponent} from './components/regtime.component';
import {TcontrolComponent} from './components/tcontrol.component';

import {menuComponent} from './components/menu.component';
import {BusComponent} from './components/bus.component';
import {EmpPerComponent} from './components/empresapersonal.component';
import {EmpSubEmpComponent} from './components/empSubemp.component';
import {PersComponent} from './components/personal.component';
import {LoginComponent} from './login/_login/_login.component';
import { RegisterComponent } from './login/register/register.component';


/*COMPONENTES PARA EL LOGIN */
//import { HomeComponent } from './home/index';
//import { LoginComponent } from './login/index';
//import { RegisterComponent } from './register/index';
import { AuthGuard } from './login/guards/auth.guard';

//estableciencido las path para los componentes del aplicativo
const app_routes: Routes = [
      {path: 'ruta', component: RutaComponent},
      {path: 'pcontrol', component: PcontrolComponent},
      {path: 'prog', component: ProgComponent},
      {path: 'regtime', component: RegtimeComponent},
      {path: 'tcontrol', component:TcontrolComponent},
      {path: 'regpersonal', component:PersComponent},

      {path: 'regbus', component:BusComponent}, 
      {path: 'menu',   component:menuComponent}, /* ISNTRUCCIONES??*/
      {path: 'regempper', component:EmpPerComponent }, 
      {path: 'regempsubemp',component:EmpSubEmpComponent},
      {path: 'login', component:LoginComponent },
      {path: 'regusersystem', component:RegisterComponent},
      { path: '**', redirectTo: 'login' } /* __ ** : SI ESCRIBE CUALQUIER COSA MANDA AL LOGIN*/



      /*{path: 'ruta', component: RutaComponent,canActivate: [AuthGuard]},
      {path: 'pcontrol', component: PcontrolComponent,canActivate: [AuthGuard]},
      {path: 'prog', component: ProgComponent,canActivate: [AuthGuard]},
      {path: 'regtime', component: RegtimeComponent,canActivate: [AuthGuard]},
      {path: 'tcontrol', component:TcontrolComponent,canActivate: [AuthGuard] },
      {path: 'regpersonal', component:PersComponent,canActivate: [AuthGuard] },

      {path: 'regbus', component:BusComponent, canActivate: [AuthGuard] }, 
      {path: 'menu',   component:menuComponent,canActivate: [AuthGuard] }, 
      {path: 'regemp', component:EmpComponent }, 

      {path: 'login', component:LoginComponent },
      {path: 'regusersystem', component:RegisterComponent},
      { path: '**', redirectTo: 'login' } */


      /*FOR LOGGER */
      //{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
      //{ path: 'login', component: LoginComponent },
      //{ path: 'register', component: RegisterComponent },
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
