import { Component } from '@angular/core';

// Componentes de primefaces
import {DataTableModule,SharedModule, DataListModule} from 'primeng/primeng';
import {ButtonModule,DialogModule,OverlayPanel} from 'primeng/primeng';
import {ConfirmDialogModule,ConfirmationService, GrowlModule, Message} from 'primeng/primeng';

import { RutaService } from './ruta.service';

@Component({
  selector: 'ruta-selector',
  templateUrl: './ruta.component.html'  
})
export class RutaComponent {
    
    private usId:number;
    private usFechaReg:Date;

    private rutas:any=[];
    private rutasPresentar:any = [];	
    private ruta:any;
    private selectedRutaPresentar: any;
    
    //mesage de error 
    private isLoading: boolean = false;  
    private errorMessage:string='';

    constructor(private _rutaService: RutaService){ 


    }
    ngOnInit(){
      this.usId=1; // este usuario es obtenido del login
      this.usFechaReg=new Date();
      this.getAllRutaByEm(1);//this.usFechaReg.getMonth()
    }
    getAllRutaByEm(emId: number) {
      this._rutaService.getAllRutaByEm(emId)
        .subscribe(
        data => { this.rutas = data;			 
              this.mostrarGrillaRuta();},//lo llamo aqui xq sino le pierde el estado
        err => { this.errorMessage = err },
        () => this.isLoading = false
        );

    }
    mostrarGrillaRuta(){
      this.rutasPresentar=[];
      let _valorTipo:string="";
      
      for(let ruta of this.rutas ){
        if(ruta.EmTipo=0)
          _valorTipo="EMPRESA"
        else
          _valorTipo="CONSORCIO"
        this.rutasPresentar.push(
          {
            RuId: 
                  ruta.RuId, 
                  RuDescripcion: ruta.RuDescripcion, 
                  RuFechaCreacion: ruta.RuFechaCreacion,
                  RuKilometro: ruta.RuKilometro,
                  EmConsorcio: ruta.EmConsorcio, 
                  EmTipo: _valorTipo  
          }
        );

      }  
    }
}