/*COMPONENTES ANGULAR 2*/ 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HashLocationStrategy, LocationStrategy}	from '@angular/common';


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
import {loginUserComponent} from './components/loginUser.component';
import {distribTiempoComponent} from './components/distribTiempo.component';
import { AuthGuard } from './components/auth.guard';

//MANTENIMIENTO
import {RegistroDiarioComponent} from './components/registrodiario.component';
//OPERACIONES

/* MENU CONSULTAS */
import {consulVistaEnLineaComponent} from './components/vistaEnLinea.component';
import {consulAlertNotifComponent} from './components/alertNotificacion.component';
import {consulIncidenciaComponent} from './components/incidencia.component';

/* MENU REPORTES */
import {reportPersonas} from './components/reportPersonas.component';
import {reportBuses} from './components/reportBus.component';

//OTROS COMPONENTES

/* VAR AND FUNCTION GLOBALES */
import {GlobalVars} from './variables';
import {classDataUsuario} from './DataUsuario'
//import {classDataUsuario} from './DataUsuario';


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
import {TeleMovilService} from './service/telefono.service';
import {UserSystemService} from './service/usuarioSistema.service';
import {distribTiempoService} from './service/distribTiempo.service';
import {ConfiguraService} from './service/configura.service';
import {DatosCompartidosService} from './service/dataComunicationApp.service';


    //SERVICE MANTENIMIENTO
        import {RegDiarioService} from './service/registrodiario.service';
    //SERVICE OPERACIONES
        import {RegRetenService} from './service/registroReten.service';
    //SERVICE CONSULTAS 
        import {servAlertNotifService} from './service/alertNotificacion.service';
        import {servIncidenciaService} from './service/incidencia.service';
        import {servVistaEnLineaService} from './service/vistaEnLinea.service';
    //SERVICE REPORTES


/* PARA EL LOGIN   BORRAR DESPUES DE TERMINAR DE PROGRAMARLO
import { AlertComponent } from './login/_directives/alert.component';
/*import { AuthGuard } from './login/guards/auth.guard';
import { AlertService} from './login/services/alert.service';
import { AuthenticationService } from './login/services/authentication.service';
import { UserService } from './login/services/user.service';
import { LoginComponent} from "./login/_login/_login.component";
import { RegisterComponent } from "./login/register/register.component";*/

// used to create fake backend
/*import { fakeBackendProvider } from './login/helper/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';*/
/*  
  import { RegisterComponent } from './register/index';
  import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
  import { InMemoryDataService }  from './in-memory-data.service';
*/

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
    loginUserComponent,
    distribTiempoComponent,
    RegistroDiarioComponent,
    reportPersonas,
    reportBuses,
    consulVistaEnLineaComponent,
    consulAlertNotifComponent,
    consulIncidenciaComponent
  ],
  
  /*MODULOS FRAMWORK PRIMENG*/
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
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
      {provide:LocationStrategy, useClass: HashLocationStrategy},
      RutaService, 
      PuntoControlService,
      ProgramacionService,
      PlacasService,
      TControlService,
      AuthGuard,
      /*AlertService,
      AuthenticationService,
      UserService,*/
      BusService,
      EmpPerService,
      EmpSubEmpService,
      PersService,
      distribTiempoService,
      ConfiguraService,
      TeleMovilService,
      UserSystemService,
      GlobalVars,  /* CLASS GLOBAL :s */
      classDataUsuario,
      DatosCompartidosService,
      //classDataUsuario,
      servAlertNotifService,
      servIncidenciaService,
      servVistaEnLineaService,
      RegDiarioService,
      RegRetenService
      /* fake backend
      fakeBackendProvider,
      MockBackend,
      BaseRequestOptions*/
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }


 /*
        LoginComponent,
        RegisterComponent,
        AlertComponent,
        //InMemoryWebApiModule.forRoot()
        //InMemoryWebApiModule.forRoot(InMemoryDataService)
    */
    
    /* REPORTES */