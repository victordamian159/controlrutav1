import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/toPromise';

//COmponentes primefaces// Esto lo uso para la grilla
import {GMapModule,DataTableModule,SharedModule,DataListModule} from 'primeng/primeng';
import {ButtonModule,DialogModule,OverlayPanelModule,TabViewModule} from 'primeng/primeng';
import {ConfirmDialogModule,GrowlModule,CodeHighlighterModule} from 'primeng/primeng';
import {MultiSelectModule, PickListModule} from 'primeng/primeng';

import { AppComponent } from './app.component';


//importando clases de los componentes .ts
import { RutaComponent } from './components/ruta.component';
import { PcontrolComponent} from './components/pcontrol.component';
import { ProgComponent } from './components/prog.component';
import {RegtimeComponent} from './components/regtime.component';
import {TcontrolComponent} from './components/tcontrol.component';

//para el routing
import {AppRoutingModule} from './app-routing.module';

//proveedor ruta service
import {RutaService} from './service/ruta.service';

import {PuntoControlService} from './service/pcontrol.service';

//import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
//import { InMemoryDataService }  from './in-memory-data.service';


@NgModule({
  //modulos del aplicativo
  declarations: [
    AppComponent,
    RutaComponent,
    PcontrolComponent,
    ProgComponent,
    RegtimeComponent,
    TcontrolComponent,
    //InMemoryWebApiModule.forRoot()
    //InMemoryWebApiModule.forRoot(InMemoryDataService)
  ],
  //modulos de los frameworks
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
      PickListModule

  ],
  providers: [RutaService, PuntoControlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
