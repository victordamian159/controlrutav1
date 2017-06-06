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

import {BusComponent} from './components/bus.component';
import {EmpComponent} from './components/empresa.component';
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
import {EmpService} from './service/empresa.service';
import {PersService}  from './service/personal.service';


//import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
//import { InMemoryDataService }  from './in-memory-data.service';


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
    EmpComponent,
    PersComponent
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

  ],

  /*SERVICIOS*/
  providers: [
      RutaService, 
      PuntoControlService,
      ProgramacionService,
      PlacasService,
      TControlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
