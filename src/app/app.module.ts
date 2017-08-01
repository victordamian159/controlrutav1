/*COMPONENTES ANGULAR 2*/ 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/toPromise';

//COmponentes primefaces// Esto lo uso para la grilla
import {GMapModule,DataTableModule,SharedModule,DataListModule} from 'primeng/primeng';
import {ButtonModule,DialogModule,OverlayPanelModule,TabViewModule} from 'primeng/primeng';
import {ConfirmDialogModule,GrowlModule,CodeHighlighterModule} from 'primeng/primeng';
import {MultiSelectModule, PickListModule, RadioButtonModule, DropdownModule} from 'primeng/primeng';
import {InputTextModule,CalendarModule} from 'primeng/primeng';

import { AppComponent } from './app.component';

//IMPORTANDO CLASES DE LOS COMPONENTES .ts DEL APLICATIVO
import { RutaComponent } from './components/ruta.component';
import { PcontrolComponent} from './components/pcontrol.component';
import { ProgComponent } from './components/prog.component';
import {RegtimeComponent} from './components/regtime.component';
import {TcontrolComponent} from './components/tcontrol.component';
import {menuComponent} from './components/menu.component' ; 
import {BusComponent} from './components/bus.component';
import {EmpSubEmpComponent} from './components/empSubemp.component';
import {EmpPerComponent} from './components/empresapersonal.component';
import {PersComponent} from './components/personal.component';



//ROUTING MODULE
import {AppRoutingModule} from './app-routing.module';

//LLAMANDO A LOS PROVEEDORES DE SERVICIO
import {RutaService} from './service/ruta.service';
import {ProgramacionService} from './service/prog.service';
import {PuntoControlService} from './service/pcontrol.service';
import {PlacasService} from './service/placas.service';
import {TControlService}  from './service/tcontrol.service';
import {BusService} from './service/bus.service';
import {EmpPerService} from './service/empresapersonal.service';
import {PersService}  from './service/personal.service';
import {EmpSubEmpService} from './service/empSubemp.service';




/*  
  import { RegisterComponent } from './register/index';
  import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
  import { InMemoryDataService }  from './in-memory-data.service';
*/
/* PARA EL LOGIN*/
import { AlertComponent } from './login/_directives/alert.component';
import { AuthGuard } from './login/guards/auth.guard';
import { AlertService} from './login/services/alert.service';
import { AuthenticationService } from './login/services/authentication.service';
import { UserService } from './login/services/user.service';
import { LoginComponent} from "./login/_login/_login.component";
import { RegisterComponent } from "./login/register/register.component";

// used to create fake backend
/*import { fakeBackendProvider } from './login/helper/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';*/

@NgModule({
  //MODULOS DEL APLICATIVO
  declarations: [
    AppComponent,
    RutaComponent,
    PcontrolComponent,
    ProgComponent,
    RegtimeComponent,
    TcontrolComponent,
    BusComponent,
    EmpSubEmpComponent,
    EmpPerComponent,
    PersComponent,
    menuComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent
    //InMemoryWebApiModule.forRoot()
    //InMemoryWebApiModule.forRoot(InMemoryDataService)
  ],
  
  /*MODULOS FRAMWORK PRIMENG*/
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    AppRoutingModule,
    
    //componentes de primeng
      DataTableModule,
      GMapModule,
      TabViewModule,
      CodeHighlighterModule,
      SharedModule,
      ButtonModule,
      DialogModule,
      DataListModule,
      OverlayPanelModule,
      ConfirmDialogModule,
      GrowlModule,
      MultiSelectModule,
      PickListModule,
      RadioButtonModule,
      DropdownModule,
      InputTextModule,
      CalendarModule
    /* MODULO LOGIN*/
  ],

  /*SERVICIOS*/
  providers: [
      RutaService, 
      PuntoControlService,
      ProgramacionService,
      PlacasService,
      TControlService,
      AuthGuard,
      AlertService,
      AuthenticationService,
      UserService,
      BusService,
      EmpPerService,
      EmpSubEmpService,
      PersService
      /* fake backend
      fakeBackendProvider,
      MockBackend,
      BaseRequestOptions*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
