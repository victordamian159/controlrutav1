import {Component, OnInit} from '@angular/core';
import {TControlService} from '../service/tcontrol.service';
import {PlacasService} from '../service/placas.service';
import {RutaService} from '../service/ruta.service';
import {PuntoControlService} from '../service/pcontrol.service'


@Component({
    selector: 'app-tcontrol',
    templateUrl:'../views/tcontrol.component.html',
    /*styleUrls:['./styles.css']*/
    styleUrls:['../styles/tcontrol.component.css'] 
})

export class TcontrolComponent implements OnInit{
     private errorMessage:string='';  //mensaje error del rest
    private isLoading: boolean = false;  

    /* DISPLAY VENTANAS MODAL*/
        displayAsignarTarjeta : boolean = false;
        displayEditarTarjeta : boolean = false;
        displayConfirmarEliminar : boolean = false;
        displayErrorDatosProgxFecha : boolean = false;
        displayNoProgEnFecha : boolean = false;
        displayErrorNoHayPCModalNuevo : boolean = false;
        displayHayPCModalNuevo : boolean = false;
        displayNoTarjetasAsignadas : boolean = false;

    /* OTRAS VARIABLES */
    val:number;
    actRadioButton:boolean=true;

    //OBEJTO PLACA PARA EL COMBO DE PLACAS DE LA PROGRAMACION POR FECHA
    placa:{
        BuId:0,
        PrDeAsignadoTarjeta:0,
        PrDeId:0,
        PrDeOrden:0,
        PrId:0,
        nroPlaca:0
    }; 
    placas:any[]=[]; //LISTA COMPLETA DE placas
    _placas:any[]=[]; //LISTA SEPARADA POR FECHA, RESULTADO DE BUSQUEDA POR FECHA
    
    _prId:number;
    _prDeId:number;
    _ruId:number;
    _pcId:number;

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
    
    _allTarjDetalle:any[]=[]; //DETALLE TARJETA
    
    puntoControl:{
        EmId:0,
        PuCoClase:0,
        PuCoId:0,
        PuCoTiempoBus:"",
        RuDescripcion:"",
        RuId:0
    };
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
    progD_BD:any[]=[];  //PROGRAMACION RECUPERADA DE LA BD
    _progD_BD:any[]=[]; //PROGRAMACION PARA PASAR A LA GRILLA
    _array:any[]=[];  //ARRAY COMO PARAMETRO A PROCEDIMIENTO SAVE TARJETA DETALLE 

    mensaje : string; //MENSAJE EN PANTALLA PARA CONFIRMAR

    private rutas:any=[];
    private ptsControl:any=[];
    private emID : number;

    constructor(
                    private tcontrolservice: TControlService,
                    private placaService: PlacasService,
                    private rutaService: RutaService,
                    private pcontrolService : PuntoControlService
                ){}

    ngOnInit(){
        this.emID = 1;
        //console.log(this.placas);
        this.getallplacasbusbyemsuem(this.emID,0); //PLACAS

        //this.getallpuntocontrolbyemru(this.emID,51); PUNTOS DE CONTROL

        /*this.getalltarjetacontrol(); */
        
        this.getallprogramacionbyem(this.emID,0); //PROGRAMACION X EMP
        this.getAllRutaByEm(this.emID);
      
        this.tarjeta._UsId = 1; //ARREGLAR ESOT PARA Q SEA GLOBAL, USUARIO
    }
    

/* FUNCIONES */ 

    /* CONSULTAR TODAS LAS RUTAS EXISTENTES */
    getAllRutaByEm(emId: number){
        this.rutaService.getAllRutaByEm(emId).subscribe(
            data => { this.rutas = data;},
            err  => {this.errorMessage = err}, 
            ()   => this.isLoading = false
        );
    }

    /*/CONSULTA RECUPERAR PUNTOS DE CONTROL  (1,0)
    getallpuntocontrolbyemru(emId:number, ruId:number){
        this.tcontrolservice.getAllPuntoControlByEmRu(emId,ruId).subscribe(
            data => {this.puntosControl=data; 
                    console.log(this.puntosControl);
                this.mgPuntosControl();}
        );
    }*/

    /* FUNCION ASOCIADA A COMBO DE RUTAS */
    rutaId(event:Event){
        /*console.log(this._ruId);*/
        this.getAllPControlBy(this.emID,this._ruId);
    }

    /* CONSULTAR TODOS LOS PUNTOS DE CONTROL EXISTENTES */
    getAllPControlBy(emId: number, ruId:number){
        this.pcontrolService.getAllPuntoControlByEmRu(emId, ruId).subscribe(
            data => {this.ptsControl = data; 
                     this.puntosControl= this.ptsControl;
                     this.mgPuntosControl();},
            err  => {this.errorMessage = err},
            ()   => this.isLoading = false
        );
    }

    /* COMBO PUNTO CONTROL */
    pControlId(event:Event){
        this.getalltarjetasbyemidpucoid(this.emID,this._pcId);
    }

    /* CONSULTA PARA GIRLLA PRINCIPAL */
    getalltarjetasbyemidpucoid(emId:number, PuCoId : number){
        this.tcontrolservice.getAllTarjetaControlByempuco(emId, PuCoId).subscribe(
            data => {
                      this.allTarjControl=data;

                      /* CONDICIONAL SI HAY TARJETAS ASIGNADAS MANDAR UN MENSAJE SI ES IGUAL A CERO */
                      if(this.allTarjControl.length>0){
                          this.mgTarjetasControl();
                      }else if(this.allTarjControl.length==0){
                          this.mensaje="No hay tarjetas de control asignadas";
                          this.displayNoTarjetasAsignadas=true;
                      }
                    },
            err  => {this.errorMessage=err},
            ()   => this.isLoading=false
        );
    }

    /* NO HAY TARJETAS DE CONTROL ASIGNADAS */
    aceptarNoAsigTarjeta(){
        this.mensaje="";
        this.displayNoTarjetasAsignadas=false;
    }

    //CONSULTAR PROGRAMACION CABECERA, PARA OBTENER EL PRID NECESARIO PARA SACAR EL DETALLE
    getallprogramacionbyem(emId:number, anio: number){
        this.tcontrolservice.getAllProgramacionByEm(emId, anio).subscribe(
            data => {
                        this.programacion=data; 
                        //console.log(this.programacion);
                        this.mgprogramacion();
                    }
        );
    }

    //CONSULTA PROG DETALLE PROGRAMACIONDETALLE(X FECHA)
    getallprogramacionbydate(PrId:number, Date: string){
        this.tcontrolservice.getAllProgramacionDetalleByPrFecha(PrId, Date).subscribe(
            data => {
                        this.progDetalle=data;
                        if(this.progDetalle.length>0 ){
                            this.mgprogDetalle(); /*GRILLA PROG POR FECHA*/
                        }else if(this.progDetalle.length==0 ){
                            this.mensaje="No hay programacion en la fecha indicada";
                            this.displayNoProgEnFecha = true;
                        }
                    }
        );
    }

    /* ERROR, NO PROGRAMACION EN LA FECHA BUSCADA*/
    errorBusquedaProg(){
        this.mensaje="";
        this.displayNoProgEnFecha = false;
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
        /* AGREGAR LA FECHA DE INICIO 
           Y FINAL DE LA PROGRAMACION */
    }

    //GRILLA PROGRAMACION DETALLE  -  POR LA FECHA
    mgprogDetalle(){ 
        this._progDetalle=[];
        console.log("this.progDetalle :"+this.progDetalle);

        //i: PARA RECORRER EL ARRAY, SI Y NO: CUANTOS SE ENCONTRARON Y NO SE ENCONTRARON
        
        let i = 0; let j=0;  let si=0; let no=0; let cen = 0; let programacion=[];

        while (i<this.placas.length){
            /* BUSQUEDA */
            while (j<this.progDetalle.length && cen==0){
                /* CONDICIONAL BUSQUEDA */
                if (this.progDetalle[i].BuId == this.placas[j].BuId){ 
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
                    /* CONTRARIO CONDICIONAL  */
                }
                j++;  
            }
            j=0;
            i++;
            cen = 0;
        }

        //for(let progD of this.progDetalle){  //console.log(this._progDetalle)//AQUI SE ACTUALIZA EL BUID POR SU PLACA
        for(let progD of programacion){
            //FILTRANDO SI ESTA ASIGNADO, SI LO ESTA NO SE PUEDE MOSTRAR
            if(progD.PrDeAsignadoTarjeta != 1){
                this._progDetalle.push({
                    BuId:progD.BuId,
                    nroPlaca:progD.nroPlaca,
                    PrId:progD.PrId,
                    PrDeOrden:progD.PrDeOrden,
                    PrDeId:progD.PrDeId,
                    PrDeAsignadoTarjeta:progD.PrDeAsignadoTarjeta
                    /*
                        PrDeFecha:progD.PrDeFecha,
                        UsFechaReg:progD.UsFechaReg,
                        UsId:progD.UsId,
                        PrDeBase:progD.PrDeBase,
                    */
                });
            }
        }
    }

    //CONSULTA RECUPERAR PLACAS
    getallplacasbusbyemsuem(emId : number, suemId : number){
        this.placaService.getAllPlacasBusByEmSuEm(1,0).subscribe(
            data => {this.placas = data; 
                //console.log(this.placas)
                ;}
        );
    }



    //CONSULTA PUNTOSDETALLE PARA INICIAR LA TARJETA CON EL PUNTO
    getallpuntocontroldetallebypuco(puCoId:number){
        this.tcontrolservice.getAllPuntoControlDetalleByPuCo(puCoId).subscribe(
            data => {
                        this.puntosControlDet=data; 
                        if(this.puntosControlDet.length==0){
                            this.mensaje="No Hay Puntos de Control";
                            this.displayErrorNoHayPCModalNuevo=true;
                        }else if(this.puntosControlDet.length>0){
                            this.mensaje="Puntos de Control Correcto";
                            this.displayHayPCModalNuevo=true;
                        }
                    }
        );
    }

    /* LISTA DE PC ESTA VACIO, MODAL NUEVA ASIGNACION DE TARJETA */
    aceptarErrorNoHayPC(){
        this.mensaje="";
        this.displayErrorNoHayPCModalNuevo=false;
    }

    /* LISTA DE PC CORRECTO, MODAL NUEVA ASIGNACION DE TARJETA */
    aceptarHayPC(){
        this.mensaje="";
        this.displayHayPCModalNuevo=false;
    }

    //MOSTRAR PUNTOS DE CONTROL COMBOBOX
    mgPuntosControl(){
        this._puntosControl=[];
        for(let puntos of this.puntosControl){
            this._puntosControl.push({
                EmId:puntos.EmId,
                PuCoClase:puntos.PuCoClase,
                PuCoId:puntos.PuCoId,
                PuCoTiempoBus:puntos.PuCoTiempoBus,
                /*RuDescripcion:puntos.RuDescripcion,*/
                RuId:puntos.RuId,
                PuCoDescripcion:puntos.PuCoDescripcion
            });
        }
    }

    //MOSTRANDO RESULTADO EN LA GRILLA CABECERA
    mgTarjetasControl(){
        this._allTarjControl = [];
        let j : number = 0; let k : number = 0; let cen : number =0;

        //TARJETAS EXISTENTES
        for(let TarjControl of this.allTarjControl){
            this._allTarjControl.push({
                nro:0,
                BuPlaca:TarjControl.BuPlaca,
                BuDescripcion:TarjControl.BuDescripcion,
                TaCoFecha:this._fecha(TarjControl.TaCoFecha),
                TaCoHoraSalida:this._hora(TarjControl.TaCoHoraSalida),
                TaCoId:TarjControl.TaCoId,
                PuCoId:TarjControl.PuCoId
            });
            
        }
        
        //AGREGANDO CAMPOS ADICIONALES AL ARRAY, CAMBIANDO IDS POR SU DESCRIPCION
        //ORDEN
        for(let i=0; i<this._allTarjControl.length; i++){
            this._allTarjControl[i].nro = i+1;
        }
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
        /* VERIFICAR SI LOS DATOS ESTAN CORRECTOS */
        if(this.puntoControl!=undefined && this._prId!=undefined){
            //CAMBIANDO POSICION FECHA console.log(this.tarjeta._TaCoFecha);
            let fecha:string;
            let dia:string; let anio:string; let mes:string;
            
            dia = this.tarjeta._TaCoFecha[this.tarjeta._TaCoFecha.length-2]+this.tarjeta._TaCoFecha[this.tarjeta._TaCoFecha.length-1];
            mes = this.tarjeta._TaCoFecha[5]+this.tarjeta._TaCoFecha[6];
            anio= this.tarjeta._TaCoFecha[0]+this.tarjeta._TaCoFecha[1]+this.tarjeta._TaCoFecha[2]+this.tarjeta._TaCoFecha[3];
            
            //CONSULTA PROGRAMACION POR FECHA
            this.getallprogramacionbydate(this.tarjeta._prId, dia+"-"+mes+"-"+anio);
        }else if(this.puntoControl==undefined || this._prId==undefined){
            //console.log("Error, Revise Bien El Punto de Control y La Programacion");
            this.mensaje="Error, Revise Bien El Punto de Control y La Programacion";
            this.displayErrorDatosProgxFecha=true;
        }  
    }

    /* ERROR, FALTO DATOS NECESARIOS PARA BUSCAR POR FECHA */
    errorBuscarxFecha(){
        this.mensaje="";
        this.displayErrorDatosProgxFecha=false;
    }

    //ABRIR MODAL ASIGNAR NUEVA TARJETA CONTROL
    nuevaAsignaTarjeta(){
        this.tarjeta._TaCoId=0; //PONIENDO TACOID A CERO PARA INDICAR Q ES NUEVO REGISTRO
        this.displayAsignarTarjeta = true;
        
        /* PROCEDURE NUEVA TARJETA CABECERA */
        this.tcontrolservice.newTarjetaControl() 
            .subscribe(
                data =>{this._tarjeta=data;                      
                       // console.log(this._tarjeta);
                }
            );
        
        /* PROCEDURE NUEVA TARJETA DETALLE */
        this.tcontrolservice.newTarjetaControlDetalle()
            .subscribe(
                data =>{this._tarjetaDetalle=data; 
                       // console.log(this._tarjetaDetalle);
                }
            );
    }

    //SE CANCELA TARJETA
    cancelarTarjeta(){
        this.displayAsignarTarjeta = false;
        console.log("cancelado =(");
    }

    cancelarEditarTarjeta(){
        this.displayEditarTarjeta = false;
    }

    /*SELECCIONAR REGISTRO TARJETA CONTROL (CABECERA- GRILLA)*/
    onRowSelectCabecera(event){
        this.tarjeta._TaCoId=0; 
        this.tarjeta._TaCoId = event.data.TaCoId;

        this.tcontrolservice.getAllTarjetaControlDetalleBytaCoId(this.tarjeta._TaCoId).subscribe(
            data => { this._tarjetaDetalle = data;  
                      console.log(this._tarjetaDetalle);
                      this.mgTarjetaDetalle();  }
        );
    }

    /*MOSTRAR RESULTADO DETALLE EN GRILLA*/
    mgTarjetaDetalle(){
        this._allTarjDetalle = [];
        for(let tDetalle of this._tarjetaDetalle){
        this._allTarjDetalle.push({
                nro:0,
                PuCoDeId:tDetalle.PuCoDeId, 
                TaCoDeDescripcion:tDetalle.TaCoDeDescripcion, 
                TaCoDeFecha:tDetalle.TaCoDeFecha, 
                TaCoDeHora: this._hora(tDetalle.TaCoDeHora), 
                TaCoDeId:tDetalle.TaCoDeId, 
                TaCoDeLatitud:tDetalle.TaCoDeLatitud, 
                TaCoDeLongitud:tDetalle.TaCoDeLongitud, 
                TaCoDeTiempo: this._hora(tDetalle.TaCoDeTiempo), 
                TaCoId:tDetalle.TaCoId, 
                UsFechaReg:tDetalle.UsFechaReg, 
                UsId:tDetalle.UsId
            });
        }
        //ASIGNADO SU NUMERACION
        for(let i=0; i<this._allTarjDetalle.length; i++){
            this._allTarjDetalle[i].nro = i+1;
        }
    }

    /*AQUI SE GUARDA TANTO CABECERA COMO DETALLE Y SE EDITA 
      LA TABLA PROGRAMACION DETALLE EL CAMPO ASIGNADO*/
    guardarTarjeta(){
            //NUEVO REGISTRO
            if(this.tarjeta._TaCoId == 0){
                //SUBIENDO DATOS AL OBJETO TARJETA this.tarjeta._prId = id;
                    //HORA SALIDA               
                    {
                        let thoy:Date,  otra:Date, horaTarjeta:string;
                        thoy=new Date();          
                        //COMPLETANDO LOS SEGUNDOS SI ES NECESARIO
                        if(this.tarjeta._TaCoHoraSalida.length<=5){
                            this.tarjeta._TaCoHoraSalida = this.tarjeta._TaCoHoraSalida+":00"; }
                        horaTarjeta=this.tarjeta._TaCoHoraSalida;
                        let resultado=horaTarjeta.split(':');
                        otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
                        this.tarjeta._TaCoHoraSalida=otra;
                    }
                    
                    /* OBJETO A MANDAR AL SERVIDOR */
                    this._tarjeta ={
                        TaCoId : this.tarjeta._TaCoId,
                        PuCoId : this.tarjeta._PuCoId,
                        RuId : this.tarjeta._RuId,
                        BuId :this.tarjeta._BuId,
                        PrId : this.tarjeta._prId,
                        TaCoFecha :this.fecha(this.tarjeta._TaCoFecha),
                        TaCoHoraSalida :this.tarjeta._TaCoHoraSalida,
                        TaCoCuota :this.tarjeta._TaCoCuota,
                        UsId :this.tarjeta._UsId,
                        UsFechaReg :new Date(),
                        TaCoNroVuelta : this.tarjeta._TaCoNroVuelta = 1
                    }

                    console.log(this._tarjeta); /* OBJETO A MANDAR AL SERVIDOR */
                    console.log(this.val);      /* VALOR ASIGNACION 0 , 1 , 2 */

                    /* */
                    if(this.val==1 || this.val==0){
                        this.tcontrolservice.asignarTarjetaControl(this._tarjeta).
                        subscribe(data => {},   
                            err => {this.errorMessage=err}
                        );
                    
                    /* */
                    }else if(this.val==2){
                        /*ACTUALIZAR PROGRAAMCION DETALLE EN EL CAMPO ASIGNADO, 
                          SALE COMO ausente SI NO VINO NO SE LE ASIGNA TARJETA*/
                        console.log("ausente");
                        this._tarjeta ={
                            PrDeId : this._prDeId,
                            PrDeAsignadoTarjeta : this.val
                        }
                        this.tcontrolservice.actualizarProgDetalleAusente(this._tarjeta).
                        subscribe(data => {}, err => {this.errorMessage=err});
                    }        
    
            //EDITANDO REGISTRO
            }else if(this.tarjeta._TaCoId != 0){
                console.log("editando reg");

            }

        this.displayAsignarTarjeta = false;
    }
   
    /* BOTON ELIMINAR REGISTRO*/
    eliminarC(TaCoId :number){
        console.log(TaCoId);
        this._TaCoId = TaCoId;

        this.displayConfirmarEliminar = true;
       this.mensaje ="¿Esta Seguro de Eliminar el Registro?";
    }

    /* PROCEDURE ELIMINAR REGISTRO*/
    _eliminarC(){
         this.tcontrolservice.deleteTarjetaControl(this._TaCoId).subscribe(
            realizar =>{
                        this.displayConfirmarEliminar = false;    
                        this.getalltarjetasbyemidpucoid(this.emID,this._pcId);
                    },
            err => {console.log(err);}
        );
    }

    /* BOTON CANCELAR ELIMINAR*/
    cancelar_eliminarC(){
        this._PuCoId = 0;
        this.displayConfirmarEliminar = false;
    }
    
    /* BOTON EDITAR REGISTRO CABECERA */
    editarC(taCoId: number){
        this.displayEditarTarjeta=true;
        //RECUPERAR EL OBJETO DESDE LA BD PARA EDITARLO
        this.tcontrolservice.getAllTarjetaControlById(taCoId).subscribe(
            data => {this.tarjeta=data; 
                    /* REFRESCAR GRILLA */
                    },
            err => {this.errorMessage = err},
            () => this.isLoading=false    
        );
        //CARGAR LOS OBJETOS
        //this.tarjeta._TaCoCuota = 9;
    }

    /*SELECCIONAR PUNTOS DE CONTROL DEL COMBOBOX, 
      HACE CONSULTA PARA GRILLA PRINCIPAL*/
    puntosControlId(event:Event){
        this.idPunto = this.puntoControl.PuCoId;
        let ruID = this.puntoControl.RuId;

        //PASANDO DATOS AL OBJETO
            this.tarjeta._RuId = ruID;
            this.tarjeta._PuCoId = this.idPunto;
        //CONSULTANDO TODOS LOS PUNTOS DE CONTROL(DETALLE) USARLOS PARA INICIAR LA TAREJTADETALLE
            this.getallpuntocontroldetallebypuco(this.idPunto);
    }

    //SELECCIONAR PROGRAMACION COMBOBOX
    programacionId(event:Event){
        this.tarjeta._prId=this._prId;
    }

    //SELECCIONAR PLACA DE BUS COMBOBOX
    placaObj(event : Event){
        this.val=0;
        this._prDeId = this.placa.PrDeId;
        this.tarjeta._BuId=this.placa.BuId;
        this.val = this.placa.PrDeAsignadoTarjeta;
    }

    editarDetalle(pucodeid:number){
        console.log(pucodeid);
    }

    onRowPlaca(event){    
        let obj = event.data; //ID DE LA PLACA EN LA BD
        this.actRadioButton=false;
        this.val=0;
        this._prDeId = obj.PrDeId;
        this.tarjeta._BuId=obj.BuId;
        this.val = obj.PrDeAsignadoTarjeta;
    }

/* PONER EN UNA CLASE GLOBAL*/
    //CONVERTIR STRING A DATE FORMULARIO A BD  HORAS
    hora(fecha : string) : Date{
        //FECHA               
        let thoy:Date,  otra:Date, horaTarjeta:string;
        thoy=new Date();
        if(fecha.length<=5){ fecha = fecha+":00"; }
        horaTarjeta=fecha;
        let resultado=horaTarjeta.split(':');
        otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
        //console.log(otra);
        return otra; 
        
    }

    //CONVERTIR DATE A STRING DE BD A FORMULARIO HORAS
    _hora(fecha : Date) :string{
        let hora : string; let _hora : string; let _fecha = new Date(fecha);
        _hora =  (_fecha.getHours()).toString();
            hora = _hora + ":"+_fecha.getMinutes()+":"+_fecha.getSeconds();

            hora = this.cCeroHora(hora);
        return hora;
    }

    //COMPLETANDO CEROS EN CASO DE NECESITAR PARA HORAS Y FECHAS   2017/
    cCeroHora(h:string) :string{
            //DIVIDIRLO EN PARTES Y COMPLETAR LOS CEROS PARA QUE LOS ELEMENTOS SEAN TODOS PARES
            let hora : string, _hora :string, resultado, i=0;
            resultado = h.split(':');
            while(i<resultado.length){
                if(resultado[i].length%2!=0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _hora=resultado[0]+":"+resultado[1]+":"+resultado[2];
        return _hora;
    }

    cCeroFecha(f : string) :string{
        let fecha:string, _fecha:string, resultado, i=0;
        resultado = f.split('/');
        while(i<resultado.length){
            resultado[i]=resultado[i].trim(); //BORRANDO ESPACIOS EN BLANCO
            if(resultado[i].length%2!=0){
                resultado[i]="0"+resultado[i];
            }
            i++;
        }
        //CONCATENANDO
        _fecha=resultado[0]+"/"+resultado[1]+"/"+resultado[2];
        
        return _fecha
    }
  
    //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD   2017/03/31  2017-03-31
    fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1])-1 ,  Number(resultado[2]));
        return _thoy;
    }

    //CONVERTIR DATE A STRING PARA FECHA  - ---   BD A GRILLA
    _fecha(fecha: Date) :string{
        let fechaProg : string; let _fechaProg : string; let _fecha = new Date(fecha);  
        _fechaProg=(_fecha.getFullYear()).toString() +" / "+ (_fecha.getMonth()+1 ).toString() +" / "+(_fecha.getDate()).toString() ;
        _fechaProg=this.cCeroFecha(_fechaProg);
        return  _fechaProg;
    }

}


   