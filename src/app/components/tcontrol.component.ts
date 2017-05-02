import {Component, OnInit} from '@angular/core';
import {TControlService} from '../service/tcontrol.service';
import {PlacasService} from '../service/placas.service';

@Component({
    selector: 'app-tcontrol',
    templateUrl:'../views/tcontrol.component.html',
    styleUrls:['../styles/tcontrol.component.css']
})

export class TcontrolComponent implements OnInit{
     private errorMessage:string='';  //mensaje error del rest
    private isLoading: boolean = false;  

    displayAsignarTarjeta : boolean = false;
    val:number;
    placas:any[]=[]; //LISTA COMPLETA DE placas
    _placas:any[]=[]; //LISTA SEPARADA POR FECHA, RESULTADO DE BUSQUEDA POR FECHA
    
    _prId:number;

    //CAMPOS PARA LA CABECERA Y DETALLE 
    _TaCoId : number;
    _PuCoId : number;
    _RuId : number;
    _BuId : number;
    _TaCoFecha : string;
    _TaCoHoraSalida : string;
    _TaCoCuota : number; 
    _UsId : number;
    _UsFechaReg : string;
    _TaCoNroVuelta:number;

    //OBJETO CABECERA
    tarjeta:any={
        _TaCoId : this._TaCoId,
        _PuCoId : this._PuCoId,
        _RuId : this._RuId,
        _BuId :this._BuId,
        _TaCoNroVuelta:this._TaCoNroVuelta,
        _TaCoFecha :this._TaCoFecha,
        _TaCoHoraSalida :this._TaCoHoraSalida,
        _TaCoCuota :this._TaCoCuota,
        _UsId :this._UsId,
        _UsFechaReg :this._UsFechaReg
    }
    _tarjeta:any; 

    _allTarjetas:any[]=[]; //TODAS LAS TARJETAS PARA LA GRILLA
    
    allTarjControl:any[]=[]; //BORRAR, CONSULTA PROVICIONAL PARA GRILLA CABECERA
    _allTarjControl:any[]=[]; // REEEMPLAZAR, PARA MANDAR AL FORMULARIO
    
    puntosControl:any[]=[]; //PUNTOS DE CONTROL EN LA BD
    _puntosControl:any[]=[]; //PARA TABLA PUNTOS
     puntosControlDet :any[]=[];
     _puntosControlDet:any[]=[]; //NO ESTA EN USO

     idPunto:number = 0; //PUCOID 
     tcontrol:any;  //RECUPERA EL OBJ Q SE GUARDA EN LA BD, CABECERA PARA SACAR LA TACOID PARA USARLO PA GUARDAR EN EL DETALLE
//OBJETO DETALLE
    _TaCoDeId : number;
    //_UsFechaReg:string;
    //_TaCoId : number;
    _PuCoDeId:number;
    _TaCoDeFecha:string;
    _TaCoDeHora:string;
    _TaCoDeLatitud:number;
    _TaCoDeLongitud:number;
    _TaCoDeTiempo:string;
    _TaCoDeDescripcion:string;
    //_UsId:number;

    tarjetaDetalle:any={ 
        TaCoDeId:this._TaCoDeId,
        UsFechaReg:this._UsFechaReg,
        TaCoId: this._TaCoId,
        PuCoDeId:this._PuCoDeId,
        TaCoDeFecha:this._TaCoDeFecha,
        TaCoDeHora:this._TaCoDeHora,
        TaCoDeLatitud:this._TaCoDeLatitud,
        TaCoDeLongitud:this._TaCoDeLongitud,
        TaCoDeTiempo:this._TaCoDeTiempo,
        TaCoDeDescripcion:this._TaCoDeDescripcion
    }
    _tarjetaDetalle:any;    //PARA NUEVO DETALLE
    _tarjDetalleArray:any[]=[]; //PARA MANDARLO A LA BD
    
    //PROGRAMACION
    programacion:any[]=[];
    _programacion:any[]=[];
    progDetalle:any[]=[];
    _progDetalle:any[]=[];

    constructor(
                    private tcontrolservice: TControlService,
                    private placaService: PlacasService
                ){}

    ngOnInit(){
        //console.log(this.placas);
        this.getalltarjetacontrol(); 
        this.getallpuntocontrolbyemru(1,0); //PUNTOS DE CONTROL
        this.getallprogramacionbyem(1,0); //PROGRAMACION X EMP
        this.getallplacasbusbyemsuem(1,0); //PLACAS
      
        this.tarjeta._UsId = 1; //ARREGLAR ESOT PARA Q SEA GLOBAL, USUARIO
        this.tarjeta._UsFechaReg = "2017-05-01"; // CAPTURAR LA FECHA ACTUAL, CORREGIR ESTO
    }
    
    //CONSULTAR PROGRAMACION CABECERA, PARA OBTENER EL PRID NECESARIO PARA SACAR EL DETALLE
    getallprogramacionbyem(emId:number, anio: number){
        this.tcontrolservice.getAllProgramacionByEm(emId, anio).subscribe(
            data => {
                        this.programacion=data; 
                        console.log(this.programacion);
                        this.mgprogramacion();
                    }
        );
    }

    //CONSULTA PROG DETALLE PROGRAMACIONDETALLE(X FECHA)
    getallprogramacionbydate(PrId:number, Date: string){
        this.tcontrolservice.getAllProgramacionDetalleByPrFecha(PrId, Date).subscribe(
            data => {
                        this.progDetalle=data;
                        console.log(this.progDetalle);
                        this.mgprogDetalle();
                    }
        );
    }

    //GRILLA PROGRAMACION CABECERA
    mgprogramacion(){
        this._programacion=[];
        for(let prog of this.programacion){
            this._programacion.push({
                EmConsorcio:prog.EmConsorcio,
                PrAleatorio:prog.PrAleatorio,
                PrCantidadBuses:prog.PrCantidadBuses,
                PrFecha:prog.PrFecha,
                PrFechaFin:prog.PrFechaFin,
                PrFechaInicio:prog.PrFechaInicio,
                PrTipo:prog.PrTipo,
                dias:prog.dias,
                prDescripcion:prog.prDescripcion,
                prId:prog.prId
            });
        }
        //console.log(this.programacion);
        //console.log(this._programacion);
    }

    //GRILLA PROGRAMACION DETALLE 
    mgprogDetalle(){ 
        this._progDetalle=[];
        
        //i: PARA RECORRER EL ARRAY, SI Y NO: CUANTOS SE ENCONTRARON Y NO SE ENCONTRARON
        
        let i = 0; let j=0;  let si=0; let no=0; let cen = 0; let programacion=[];

        while (i<this.placas.length){
            while (j<this.progDetalle.length && cen==0){
                if      (this.progDetalle[i].BuId == this.placas[j].BuId){ 
                    //SI SON IGUALES CARGANDO EN OTRO ARRAY PARA PASAR A LA SIGUIENTE ETAPA
                    programacion.push({
                        BuId: this.progDetalle[i].BuId,
                        nroPlaca: this.placas[j].BuPlaca,
                        //UsId:this.progDetalle[i].UsId,
                        PrId:this.progDetalle[i].PrId,
                        PrDeOrden:this.progDetalle[i].PrDeOrden,
                        PrDeId: this.progDetalle[i].PrDeId,
                        PrDeAsignadoTarjeta:this.progDetalle[i].PrDeAsignadoTarjeta
                    });
                    //this.progDetalle[i].BuId = this.placas[j].BuPlaca;
                    cen = 1; 
                }else if(this.progDetalle[i].BuId != this.placas[j].BuId){
                      
                }
                j++;  
            }
            j=0;
            i++;
            cen = 0;
        }
        //console.log(programacion);
        
        //for(let progD of this.progDetalle){
        for(let progD of programacion){
            this._progDetalle.push({
                BuId:progD.BuId,
                nroPlaca:progD.nroPlaca,
                //UsFechaReg:progD.UsFechaReg,
                //UsId:progD.UsId,
                PrId:progD.PrId,
                //PrDeBase:progD.PrDeBase,
                PrDeOrden:progD.PrDeOrden,
                //PrDeFecha:progD.PrDeFecha,
                PrDeId:progD.PrDeId,
                PrDeAsignadoTarjeta:progD.PrDeAsignadoTarjeta
            });
        }
        console.log(this._progDetalle)//AQUI SE ACTUALIZA EL BUID POR SU PLACA
        
    }

    //CONSULTA RECUPERAR PLACAS
    getallplacasbusbyemsuem(emId : number, suemId : number){
        this.placaService.getAllPlacasBusByEmSuEm(1,0).subscribe(
            data => {this.placas = data; console.log(this.placas);}
        );
    }
    //CONSULTA RECUPERAR PUNTOS DE CONTROL  (1,0)
    getallpuntocontrolbyemru(emId:number, ruId:number){
        this.tcontrolservice.getAllPuntoControlByEmRu(emId,ruId).subscribe(
            data => {this.puntosControl=data; 
                console.log(this.puntosControl); 
                this.mgPuntosControl();}
        );
    }

    //CONSULTA PUNTOSDETALLE PARA INICIAR LA TARJETA CON EL PUNTO
    getallpuntocontroldetallebypuco(puCoId:number){
        this.tcontrolservice.getAllPuntoControlDetalleByPuCo(puCoId).subscribe(
            data => {
                        this.puntosControlDet=data; 
                        console.log(this.puntosControlDet);
                    }
        );
    }


    //CONSULTA PROVICIONAL-- REEMPLAZAR POR OTRA QUE PASE RONALD PARA MOSTRAR GRILLA
    getalltarjetacontrol(){
        this.tcontrolservice.getAllTarjetas().subscribe(
            data => {this.allTarjControl=data; 
                     console.log(this.allTarjControl); 
                     this.mgTarjetasControl();},
            err  => {this.errorMessage=err},
            ()   => this.isLoading=false
        );
    }

    //MOSTRAR PUNTOS DE CONTROL
    mgPuntosControl(){
        this._puntosControl=[];
        for(let puntos of this.puntosControl){
            this._puntosControl.push({
                EmId:puntos.EmId,
                PuCoClase:puntos.PuCoClase,
                PuCoId:puntos.PuCoId,
                PuCoTiempoBus:puntos.PuCoTiempoBus,
                RuDescripcion:puntos.RuDescripcion,
                RuId:puntos.RuId
            });
        }
        console.log(this._puntosControl);
    }

    //MOSTRANDO RESULTADO EN LA GRILLA CABECERA
    mgTarjetasControl(){
        this._allTarjControl = [];
        for(let TarjControl of this.allTarjControl){
            this._allTarjControl.push({
                TaCoFecha:TarjControl.TaCoFecha,
                TaCoHoraSalida:TarjControl.TaCoHoraSalida,
                TaCoCuota:TarjControl.TaCoCuota,
                BuId:TarjControl.BuId,
                UsFechaReg:TarjControl.UsFechaReg,
                TaCoId:TarjControl.TaCoId,
                UsId:TarjControl.UsId,
                RuId:TarjControl.RuId,
                PuCoId:TarjControl.PuCoId
            });
            
        }
        console.log(this._allTarjControl);
    }

    //CONSULTA TARJETAS DE CONTROL BY ID ---NO ESTA EN USO
    getalltarjetacontrolbyid(tacoid:number){
        this.tcontrolservice.getAllTarjetaControlById(tacoid).subscribe(
            data => {this._allTarjetas = data; 
                     console.log(this._allTarjetas);},
                     err => {this.errorMessage=err},
                        () => this.isLoading=false
        );
    }

    buscarxFecha(){
        console.log(this.tarjeta._TaCoFecha);
        //CAMBIANDO POSICION FECHA
        let fecha:string;
        let dia:string; let anio:string; let mes:string;
        
        dia = this.tarjeta._TaCoFecha[this.tarjeta._TaCoFecha.length-2]+this.tarjeta._TaCoFecha[this.tarjeta._TaCoFecha.length-1];
        mes = this.tarjeta._TaCoFecha[5]+this.tarjeta._TaCoFecha[6];
        anio= this.tarjeta._TaCoFecha[0]+this.tarjeta._TaCoFecha[1]+this.tarjeta._TaCoFecha[2]+this.tarjeta._TaCoFecha[3];
        
        //CONSULTA PROGRAMACION POR FECHA
        this.getallprogramacionbydate(this.tarjeta._prId, dia+"-"+mes+"-"+anio);
    }

    //ABRIR MODAL ASIGNAR NUEVA TARJETA CONTROL
    nuevaAsignaTarjeta(){
        this.tarjeta._TaCoId=0; //PONIENDO TACOID A CERO PARA INDICAR Q ES NUEVO REGISTRO
        console.log("nueva tarjeta =D");
        this.displayAsignarTarjeta = true;
        this.tcontrolservice.newTarjetaControl() //CABECERA
            .subscribe(
                data =>{this._tarjeta=data; 
                        //console.log(this._tarjeta);
                }
            );
        this.tcontrolservice.newTarjetaControlDetalle()
            .subscribe(
                data =>{this._tarjetaDetalle=data; 
                        //console.log(this._tarjetaDetalle);
                }
            );
    }

    //SE CANCELA TARJETA
    cancelarTarjeta(){
        this.displayAsignarTarjeta = false;
        console.log("cancelado =()");
    }

    //SELECCIONAR PROGRAMACION EXISTENTE
    onRowProgramacion(event){
        let id = event.data.prId;
        console.log("id prog: "+id);
        this.tarjeta._prId = id;
        //this.getallprogramacionbydate
    }

    //SELECCION UNA PLACA DEL DATATABLE
    onRowPlaca(event){    
        //let index = event.data.nro; //NRO DE PLACA EN LA LISTA
        //let index = this._progDetalle.indexOf(obj);
        //console.log("index: "+this._progDetalle.indexOf(obj));
        //this.val=this._progDetalle[index].PrDeAsignadoTarjeta;

        // val: valor 0:no asignado    1:asig    2: ausente
        let obj = event.data; //ID DE LA PLACA EN LA BD
        this.val=0;
        console.log(obj);
        this.tarjeta._BuId=obj.BuId;
        this.val = obj.PrDeAsignadoTarjeta;
    }

    //SELECCIONAR PUNTO DE CONTROL
    onRowPuntosControl(event){
        this.idPunto = event.data.PuCoId; 
        let ruID = event.data.RuId;

        console.log("punto seleccionado: "+this.idPunto);
        //console.log("ruid: "+ruID);

        //PASANDO DATOS AL OBJETO
        this.tarjeta._RuId = ruID;
        this.tarjeta._PuCoId = this.idPunto;

        //CONSULTANDO TODOS LOS PUNTOS DE CONTROL(DETALLE) USARLOS PARA INICIAR LA TAREJTADETALLE
        this.getallpuntocontroldetallebypuco(this.idPunto);
    }

    //SELECCIONAR TARJETA CONTROL (CABECERA- GRILLA)
    onRowSelectCabecera(event){
        this.tarjeta._TaCoId=0; 
        this.tarjeta._TaCoId = event.data.TaCoId;
        console.log(this.tarjeta._TaCoId);
    }


    //AQUI SE GUARDA TANTO CABECERA COMO DETALLE Y SE EDITA LA TABLA PROGRAMACIONDETALLE EL CAMPO ASIGNADO
    guardarTarjeta(){
        if(this.idPunto!=0){
            //AL GUARDAR LA TARJETA SE TIENE QUE CONSIDERAR EDITAR 
            //LA PROGRAMACIONDETALLE DE SU RESPECTIVA TABLA (LA PROGRAMACIONDETALLE) 
            
            //NUEVO REGISTRO
            if(this.tarjeta._TaCoId == 0){
                console.log("nuevo reg");
                console.log("guardar");
                //SUBIENDO DATOS AL OBJETO TARJETA
                    this._tarjeta ={
                        TaCoId : this.tarjeta._TaCoId,
                        PuCoId : this.tarjeta._PuCoId,
                        RuId : this.tarjeta._RuId,
                        BuId :this.tarjeta._BuId,
                        TaCoFecha :this.tarjeta._TaCoFecha,
                        TaCoHoraSalida :this.tarjeta._TaCoHoraSalida,
                        TaCoCuota :this.tarjeta._TaCoCuota,
                        UsId :this.tarjeta._UsId,
                        UsFechaReg :this.tarjeta._UsFechaReg,
                        TaCoNroVuelta : this.tarjeta._TaCoNroVuelta
                    }
                    console.log(this._tarjeta);
                    //return;
                //1ERO GUARDANDO LA CABECERA PARA OBTENER SU ID
                    this.tcontrolservice.saveTarjetaControl(this._tarjeta).subscribe(
                        data => {
                                    //RECUPERAR DE TCONTROL EL TACOID
                                    this.tarjeta=data;  //VER SI TCONTROL PUEDA SER LOCAL          
                                    console.log(this.tarjeta);                                                   
                                },
                        err => {this.errorMessage=err}
                    );

                //2DO GUARDANDO DETALLE DE TARJETA (INICIAR DE CERO)
                    //EL NUMERO DE PUNTOSCONTROLDETALLE TIENE Q SER IGUAL AL NUMERO DE OBJETOS EN EL ARRAY PARA LA BD
                    let array = [];
                    for(let obj of this.puntosControlDet){
                        array.push({
                            UsFechaReg : "2017-05-01",
                            TaCoId : this.tarjeta.TaCoId,
                            PuCoDeId : obj.PuCoDeId,
                            TaCoDeFecha : "",     
                            TaCoDeHora : 0, 
                            TaCoDeLatitud : 0.0,
                            TaCoDeLongitud : 0.0,
                            TaCoDeTiempo : 0,
                            TaCoDeDescripcion : obj.PuCoDeDescripcion,
                            UsId : 1,
                            TaCoDeId : 0
                        });
                    }
                    //this.puntosControlDet
                    console.log(array);
                //3ERO EDITAR LAS PLACAS EN PROGRAMACIONDETALLE,CAMPO ASIG NO ASIG AUSENTE
                    //this.progDetalle
                    //this.tcontrolservice.    FALTA UN PROCEDIMIENTO PARA HACER LA ACTUALIZACION
                //this.guardarTarjetaDetalle();

            //EDITANDO REGISTRO
            }else if(this.tarjeta._TaCoId != 0){
                console.log("editando reg");

            }

        }else if(this.idPunto ==0){
            //HACER UNA VENTANA MODAL CON ESTE MENSAJE
            console.log("NO SELECCIONO LISTA PUNTOS DE CONTROL");

        }
    }
   
    eliminarC(PuCoId :number){
        console.log(PuCoId);
        this.tcontrolservice.deleteTarjetaControl(PuCoId).subscribe(
            realizar =>{this.getalltarjetacontrol();},
            err => {console.log(err);}
        );
    }

    editarC(PuCoId: number){
        console.log(PuCoId);
        this.displayAsignarTarjeta=true;

        //RECUPERAR EL OBJETO DESDE LA BD PARA EDITARLO
        this.tcontrolservice.getAllTarjetaControlById(PuCoId).subscribe(
            data => {this.tarjeta=data; 
                console.log(this.tarjeta);},
            err => {this.errorMessage = err},
            () => this.isLoading=false    
        );
    }

}