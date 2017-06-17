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
import {EmpComponent} from './components/empresa.component';
import {PersComponent} from './components/personal.component';
import {LoginComponent} from './login/login/login.component';

/*COMPONENTES PARA EL LOGIN */
//import { HomeComponent } from './home/index';
//import { LoginComponent } from './login/index';
//import { RegisterComponent } from './register/index';
import { AuthorizatedGuard } from './login/core/guards/authorizated.guard';

//estableciencido las path para los componentes del aplicativo
const app_routes: Routes = [
      {path: 'ruta', component: RutaComponent,canActivate: [AuthorizatedGuard]},
      {path: 'pcontrol', component: PcontrolComponent,canActivate: [AuthorizatedGuard]},
      {path: 'prog', component: ProgComponent,canActivate: [AuthorizatedGuard]},
      {path: 'regtime', component: RegtimeComponent,canActivate: [AuthorizatedGuard]},
      {path: 'tcontrol', component:TcontrolComponent,canActivate: [AuthorizatedGuard] },
      {path: 'regpersonal', component:PersComponent,canActivate: [AuthorizatedGuard] },
      {path: 'regbus', component:BusComponent,canActivate: [AuthorizatedGuard] },
      {path: 'menu', component:menuComponent,canActivate: [AuthorizatedGuard]  },
      {path: 'regemp', component:EmpComponent,canActivate: [AuthorizatedGuard] },
      {path: 'login', component:LoginComponent },
      /*FOR LOGGER */
      //{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
      //{ path: 'login', component: LoginComponent },
      //{ path: 'register', component: RegisterComponent },
      
      // ** : SI ESCRIBE CUALQUIER COSA QUE NO SEA UNA EXISTENTE MANDA AL regempresa
      { path: '**', redirectTo: 'login' }
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
