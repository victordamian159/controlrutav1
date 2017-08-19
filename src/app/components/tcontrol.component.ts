import {Component, OnInit} from '@angular/core';
import {TControlService} from '../service/tcontrol.service';
import {PlacasService} from '../service/placas.service';
import {RutaService} from '../service/ruta.service';
import {PuntoControlService} from '../service/pcontrol.service'; 
import {ProgramacionService} from '../service/prog.service';
import {GlobalVars} from 'app/variables'
import {hora,_hora,_cCeroFecha,cCeroHora,corrigiendoHora,fecha,_fecha,fechaActual1,editf1,horaAct} from 'app/funciones';


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
        displayNroTarjetas : boolean = false;
        displayAsigMultiTarj : boolean = false;

    /* OTRAS VARIABLES */
    private val:number;
    private actRadioButton:boolean=true;
    private nroTarjetas:number; 
    private timeInter:string; /* TIEMPO INTERMEDIO (ASIGNAR MULTITARJETA) */
    private mensaje : string; /*MENSAJE EN PANTALLA PARA CONFIRMAR*/
    private titulo : string; /*TITULO PANTALLAS */
    private tVueltaBus : string; /* TIEMPO RECORRIDO BUS */

    private arrNTarjCabecera : any[] = []; /* ARRAY NUEVAS TARJETAS DE CONTROL (MULTITARJETAS) */
    private arrNTarjDetalle : any[] = []; /* ARRAY NUEVAS TARJETAS DE CONTROL DETALLE (MULTITARJETAS) */

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

    

    private rutas:any=[];
    private ptsControl:any=[];
    
    /* VARIABLES */
        private emID : number;
        private UsId:number;

    constructor(    public ClassGlobal:GlobalVars, private tcontrolservice: TControlService,
                    private placaService: PlacasService, private rutaService: RutaService,
                    private pcontrolService : PuntoControlService, private progService :ProgramacionService
                ){
                    this.emID=this.ClassGlobal.GetEmId();
                    this.UsId=this.ClassGlobal.GetUsId();

                    this.tarjeta._UsId = this.UsId; //ARREGLAR ESTO
                    this._ruId=0; /* INICIANDO RUID A CERO PARA DESACTIVAR EL BOTON ASIGNAR TARJETA */
                    this.arrNTarjCabecera=[]; /*INICIANDO ARRAY A VACIO DE NUEVAS TARJETAS */
                }

    ngOnInit(){
        /*this.emID = 1;*/
        this.getallplacasbusbyemsuem(this.emID,0); /*TODAS LAS PLACAS POR EMID, EL CERO ES PARA TODOS LOS SUEMID*/
        this.getallprogramacionbyem(this.emID,0); //PROGRAMACION X EMP Y POR AÑO(ACLARAR ESTO)
        this.getAllRutaByEm(this.emID);
        console.log(editf1(fechaActual1()));
    }
    

/* PROCEDURES */ 
    /* CONSULTAR TODAS LAS RUTAS EXISTENTES */
    getAllRutaByEm(emId: number){
        this.rutaService.getAllRutaByEm(emId).subscribe(
            data => { this.rutas = data;},
            err  => {this.errorMessage = err}, 
            ()   => this.isLoading = false
        );
    }

    /* CONSULTAR TODOS LOS PUNTOS DE CONTROL EXISTENTES */
    getAllPControlBy(emId: number, ruId:number){
        this.pcontrolService.getAllPuntoControlByEmRu(emId, ruId).subscribe(
            data => {/*this.ptsControl = data; 
                     this.puntosControl= this.ptsControl;*/
                     this.puntosControl= data;
                     this.mgPuntosControl();},
            err  => {this.errorMessage = err},
            ()   => this.isLoading = false
        );
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
    
    //CONSULTAR PROGRAMACION CABECERA, PARA OBTENER EL PRID NECESARIO PARA SACAR EL DETALLE
    getallprogramacionbyem(emId:number, anio: number){
        this.tcontrolservice.getAllProgramacionByEm(emId, anio).subscribe(
            data => {
                        this.programacion=data; 
                        this.mcobprogramacion();
                    }
        );
    }

    //CONSULTA PROG DETALLE PROGRAMACIONDETALLE(X FECHA)
    getallprogramacionbydate(PrId:number, Date: string){
        this.tcontrolservice.getAllProgramacionDetalleByPrFecha(PrId, Date).subscribe(
            data => {
                        this.progDetalle=data;
                        if(this.progDetalle.length>0 ){
                            //this.getallplacasbusbyemsuem(this.emID,0);
                            this.mgprogDetalle(); /*GRILLA PROG POR FECHA*/
                        }else if(this.progDetalle.length==0 ){
                            this.mensaje="No hay programacion en la fecha indicada";
                            this.displayNoProgEnFecha = true;
                        }
                    }
        );
    }

    //CONSULTA RECUPERAR PLACAS
    getallplacasbusbyemsuem(emId : number, suemId : number){
        this.placaService.getAllPlacasBusByEmSuEm(emId,suemId).subscribe(
            data => {this.placas = data; 
                ;}
        );
    }

    /* PROCEDURE ELIMINAR REGISTRO - NO EN USO*/
    _eliminarC(){
         this.tcontrolservice.deleteTarjetaControl(this._TaCoId).subscribe(
            realizar =>{
                        this.displayConfirmarEliminar = false;    
                        this.getalltarjetasbyemidpucoid(this.emID,this._pcId);
                    },
            err => {console.log(err);}
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

    //CONSULTA TARJETAS DE CONTROL BY ID 
    getalltarjetacontrolbyid(tacoid:number){
        this.tcontrolservice.getAllTarjetaControlById(tacoid).subscribe(
                     data => {/*this._allTarjetas = data;  console.log(this._allTarjetas);*/
                                this.tarjeta=data; 
                                console.log(this.tarjeta);
                                this.displayEditarTarjeta=true;
                                /* CARGANDO OBJETOS VENTANA EDITAR */
                                /* REFRESCAR GRILLA */
                             },
                     err => {this.errorMessage=err},
                        () => this.isLoading=false
        );
        /* 
            //RECUPERAR EL OBJETO DESDE LA BD PARA EDITARLO
            this.tcontrolservice.getAllTarjetaControlById(taCoId).subscribe(
                data => {this.tarjeta=data; 
                        this.displayEditarTarjeta=true;
                        
                        },
                err => {this.errorMessage = err},
                () => this.isLoading=false    
            );

            //CARGAR LOS OBJETOS
            //this.tarjeta._TaCoCuota = 9;
        
        */
    }

    /* NO ASIGNADO VAL=0 , ASIGNADO VAL=1 */ /* AUSENTE VAL=2 */
    /* PROCEDURE ACTUALIZAR PROGRAMACIONDETALLE      progUpdate ={PrDeId : this._prDeId, PrDeAsignadoTarjeta : this.val */
    updateProgDetalle(progUpdate : Object[]){
        this.tcontrolservice.actualizarProgDetalleAusente(progUpdate).subscribe
                            (data => {
                                        if(this.val==0){
                                            console.log("La tarjeta no fue asignada");
                                        }else if(this.val==1){
                                            console.log("La tarjeta fue asignada");
                                        }else if(this.val==2){
                                            console.log("El chofer esta ausente");
                                        }
                                        this.borrarObjetos();
                                    }, 
                              err => {this.errorMessage=err});
    }

    //ABRIR MODAL ASIGNAR NUEVA TARJETA CONTROL
    nuevaAsignaTarjeta(){
        //this.tarjeta._TaCoId=0; PONIENDO TACOID A CERO PARA INDICAR Q ES NUEVO REGISTRO
        console.log(horaAct());

        /* PROCEDURE NUEVA TARJETA CABECERA UNA O MULTIPLE */
        this.tcontrolservice.newTarjetaControl() .subscribe(
                data =>{ 
                            this._tarjeta=data;
                            this.tarjeta={
                                _TaCoId : this._tarjeta.TaCoId,
                                _PuCoId : this._tarjeta.PuCoId,
                                _RuId : this._tarjeta.RuId,
                                _BuId :this._tarjeta.BuId,
                                _PrId :this._tarjeta.PrId,
                                _TaCoNroVuelta:this._tarjeta.TaCoNroVuelta,
                                _TaCoFecha :"",
                                _TaCoHoraSalida :horaAct(),
                                _TaCoCuota :this._tarjeta.TaCoCuota,
                                _UsId :this._tarjeta.UsId,
                                _UsFechaReg :this._tarjeta.UsFechaReg
                            }
                       }
        );
    }

/* MOSTRAR DATOS */
        //COMBO PROGRAMACION CABECERA (CARGA ARRAY PARA MOSTRAR OPCIONES EN EL COMBOBOX)
        mcobprogramacion(){
            this._programacion=[];
            for(let prog of this.programacion){
                this._programacion.push({
                    EmConsorcio:prog.EmConsorcio,
                    PrAleatorio:prog.PrAleatorio,
                    PrCantidadBuses:prog.PrCantidadBuses,
                    PrFecha:_fecha(prog.PrFecha),
                    PrFechaFin:_fecha(prog.PrFechaFin),
                    PrFechaInicio:_fecha(prog.PrFechaInicio),
                    PrTipo:prog.PrTipo,
                    dias:prog.dias,
                    prDescripcion:prog.prDescripcion.substr(0,4) +" de "+_fecha(prog.PrFechaInicio)+" a  "+_fecha(prog.PrFechaFin) ,
                    prId:prog.prId
                });
            }
        }

        //GRILLA PROGRAMACION DETALLE  -  POR LA FECHA
        mgprogDetalle(){ 
            this._progDetalle=[];
            //i: PARA RECORRER EL ARRAY, SI Y NO: CUANTOS SE ENCONTRARON Y NO SE ENCONTRARON
            let i = 0; let j=0;  let si=0; let no=0; let cen = 0, cen2=0; let programacion=[]; let longProg = this.progDetalle.length;

            /* BUSCANDO POR PLACAS */
            while (i<this.placas.length && cen2==0){
                /* BUSQUEDA */
                while (j<this.progDetalle.length && cen==0){
                    /* CONDICIONAL BUSQUEDA */
                    if (this.progDetalle[i].BuId == this.placas[j].BuId){ 
                        //SI SON IGUALES CARGANDO EN OTRO ARRAY PARA PASAR A LA SIGUIENTE ETAPA
                        programacion.push({
                            BuId: this.progDetalle[i].BuId,
                            nroPlaca: this.placas[j].BuPlaca,
                            PrId:this.progDetalle[i].PrId,
                            PrDeOrden:this.progDetalle[i].PrDeOrden,
                            PrDeId: this.progDetalle[i].PrDeId,
                            PrDeAsignadoTarjeta:this.progDetalle[i].PrDeAsignadoTarjeta
                        });
                        cen = 1; 
                    }else if(this.progDetalle[i].BuId != this.placas[j].BuId){
                        /* CONTRARIO CONDICIONAL  */
                    }
                    j++;  
                }
                j=0;
                i++;
                cen = 0;
                /* VERIFICANDO QUE SE ENCONTRARON TODAS BUID */
                if(longProg==programacion.length){
                    cen2=1;
                }
            }

            //AQUI SE ACTUALIZA EL BUID POR SU PLACA
            for(let progD of programacion){
                //FILTRANDO SI ESTA ASIGNADO, SI LO ESTA NO SE PUEDE MOSTRAR
                if(progD.PrDeAsignadoTarjeta != 1){
                    this._progDetalle.push({
                        nro:0,
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

            /* ENUMERANDO FILAS DE LA TABLA DE PROG, TABLA ASIG NUEVA PROGRAMACION */
            for(let k=0; k<this._progDetalle.length;k++){
                this._progDetalle[k].nro=k+1;
            }
        }

        //MOSTRAR PUNTOS DE CONTROL COMBOBOX
        mgPuntosControl(){
            this._puntosControl=[];
            for(let puntos of this.puntosControl){
                this._puntosControl.push({
                    EmId:puntos.EmId,
                    PuCoClase:puntos.PuCoClase,
                    PuCoId:puntos.PuCoId,
                    PuCoTiempoBus:_hora(puntos.PuCoTiempoBus),
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
                    TaCoFecha:_fecha(TarjControl.TaCoFecha),
                    TaCoHoraSalida:_hora(TarjControl.TaCoHoraSalida),
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

        /*MOSTRAR RESULTADO DETALLE EN GRILLA*/
        mgTarjetaDetalle(){
            this._allTarjDetalle = [];
            for(let tDetalle of this._tarjetaDetalle){
                this._allTarjDetalle.push({
                    nro:0,
                    PuCoDeId:tDetalle.PuCoDeId, 
                    TaCoDeDescripcion:tDetalle.TaCoDeDescripcion, 
                    TaCoDeFecha:tDetalle.TaCoDeFecha, 
                    TaCoDeHora: _hora(tDetalle.TaCoDeHora), 
                    TaCoDeId:tDetalle.TaCoDeId, 
                    TaCoDeLatitud:tDetalle.TaCoDeLatitud, 
                    TaCoDeLongitud:tDetalle.TaCoDeLongitud, 
                    TaCoDeTiempo: _hora(tDetalle.TaCoDeTiempo), 
                    TaCoId:tDetalle.TaCoId, 
                    UsFechaReg:tDetalle.UsFechaReg, 
                    UsId:tDetalle.UsId
                });
            }
            //ASIGNADO SU NUMERACION
            for(let i=0; i<this._allTarjDetalle.length; i++){
                this._allTarjDetalle[i].nro = i+1;
            }
            console.log(this._allTarjDetalle);
        }


/* FUNCIONES */
    /* FUNCIONES ASOCIADAS A FILAS DE DATATABLES */
            /*SELECCIONAR REGISTRO TARJETA CONTROL (CABECERA- GRILLA)*/
            onRowSelectCabecera(event){
                this.tarjeta._TaCoId=0; 
                this.tarjeta._TaCoId = event.data.TaCoId; /* ACTUALIZA EL CAMPO PARA PODER USARLO SI ES CASO SE QUIERA EDITAR EL REGISTRO */ 

                this.tcontrolservice.getAllTarjetaControlDetalleBytaCoId(this.tarjeta._TaCoId).subscribe(
                    data => { this._tarjetaDetalle = data; console.log(this._tarjetaDetalle);  
                            this.mgTarjetaDetalle();  }
                );
            }

            /* SELECCIONAR PLACA DE SORTEO (LISTA DE PLACAS DE SORTEO) */
            onRowPlaca(event){    
                let obj = event.data; //ID DE LA PLACA EN LA BD
                this.actRadioButton=false; /* ACTIVANDO RADIO BUTTONS, NO ASIGNADO - ASIGNAR - AUSENTE */
                this.val=0; /* REINICIANDO A CERO EL VALOR DEL RADIO BUTTON */
                this._prDeId = obj.PrDeId; /* PROGRAMACIONDETALLE ID */
                this.tarjeta._BuId=obj.BuId; /* ID DE LA PLACA SELCCIONADA */
                this.val = obj.PrDeAsignadoTarjeta; /* VALOR DE RADIOBUTTON SELECCIONADO */
            }

    /* FUNCIONES DE COMBOBOX */
            /* FUNCION ASOCIADA A COMBO DE RUTAS */
            rutaId(event:Event){
                /*console.log(this._ruId);*/
                this.getAllPControlBy(this.emID,this._ruId);
            }

            /* FUNCION ASOCIADA COMBO PUNTO CONTROL */
            pControlId(event:Event){
                /*console.log(this._pcId);*/
                this.getalltarjetasbyemidpucoid(this.emID,this._pcId);
            }

            /*SELECCIONAR PUNTOS DE CONTROL DEL COMBOBOX, HACE CONSULTA PARA GRILLA PRINCIPAL*/
            puntosControlId(event:Event){
                /* AL HACER CLIC SOBRE EL COMBO DEVUELVE UN OBJETO SEGUN OPCION SELECCIONADA  -> this.puntoControl */
                this._pcId=this.puntoControl.PuCoId;
                this.idPunto = this.puntoControl.PuCoId;
                let ruID = this.puntoControl.RuId;
                this.tVueltaBus=this.puntoControl.PuCoTiempoBus

                //PASANDO DATOS AL OBJETO
                    this.tarjeta._RuId = ruID;
                    this.tarjeta._PuCoId = this.idPunto;
                    this.tarjeta._TaCoFecha=editf1(fechaActual1());
                //CONSULTANDO TODOS LOS PUNTOS DE CONTROL(DETALLE) USARLOS PARA INICIAR LA TAREJTADETALLE
                    this.getallpuntocontroldetallebypuco(this.idPunto);
            }

            /* SELECCIONAR PROGRAMACION COMBOBOX -> PROG ID */
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


    /* FUNCIONES ASIGNAR TARJETAS */
            /*-> SOLA UNA TARJETA, AQUI SE GUARDA TANTO CABECERA COMO DETALLE Y SE EDITA  LA 
                TABLA PROGRAMACION DETALLE EL CAMPO ASIGNADO*/
            guardarTarjeta(){
                let progUpdate : any = {PrDeId : 0,PrDeAsignadoTarjeta : 0}

                this.tarjeta._TaCoHoraSalida=corrigiendoHora(this.tarjeta._TaCoHoraSalida);

                /* OBJETO A MANDAR AL SERVIDOR --- SUBIENDO DATOS AL OBJETO TARJETA this.tarjeta._prId = id;*/
                this._tarjeta ={
                    TaCoId : this.tarjeta._TaCoId,
                    PuCoId : this.tarjeta._PuCoId,
                    RuId : this.tarjeta._RuId,
                    BuId :this.tarjeta._BuId,
                    PrId : Number(this.tarjeta._prId),
                    TaCoFecha :fecha(this.tarjeta._TaCoFecha),
                    TaCoHoraSalida :this.tarjeta._TaCoHoraSalida,
                    TaCoCuota :this.tarjeta._TaCoCuota,
                    UsId :this.tarjeta._UsId,
                    UsFechaReg :new Date(),
                    TaCoNroVuelta : this.tarjeta._TaCoNroVuelta = 1
                }

                /*NUEVA TARJETA*/
                if(this._tarjeta.TaCoId == 0){
                    progUpdate ={ PrDeId : this._prDeId, 
                            PrDeAsignadoTarjeta : this.val} 

                    /* ASIGNADO TARJETA VAL=1  */
                    if(this.val==1){
                        console.log(this._tarjeta);
                        /* PROCEDURE ASIGNAR TARJETA (UNA SOLA) */
                        this.tcontrolservice.asignarTarjetaControl(this._tarjeta).subscribe(
                            data => { this.updateProgDetalle(progUpdate);/* PROCEDURE UPDATE PROGDETALLE */   
                                    console.log(this.emID); console.log(this._pcId);
                                    this.getalltarjetasbyemidpucoid(this.emID,this._pcId); }, 
                            err  => {this.errorMessage=err}
                        );
                    /* NO ASIGNADO VAL=0*/
                    }else if(this.val==0){
                        /*ACTUALIZAR PROGRAAMCION DETALLE EN EL CAMPO ASIGNADO, SALE COMO ausente SI NO VINO NO SE LE ASIGNA TARJETA*/
                        this.updateProgDetalle(progUpdate);
                    /* AUSENTE VAL=2 */
                    }else if(this.val==2){
                        /*ACTUALIZAR PROGRAAMCION DETALLE EN EL CAMPO ASIGNADO, SALE COMO ausente SI NO VINO NO SE LE ASIGNA TARJETA*/
                        this.updateProgDetalle(progUpdate);
                    }        
                }
                this.displayAsignarTarjeta = false;
            }
        
            /* -> GUARDAR MULTIPLES TARJETAS*/
            guardarMultiTarjetas(){
                /* PARA ACTUALIZAR PROGRAMACIONDETALLE */
                let progUpdate : any = {PrDeId : 0, PrDeAsignadoTarjeta : 0}
                let arrHSalida=[];/* ARRAY HORAS SALIDA PARA LA MISMA PLACA */
                let arrObj = []; /* ARRAY OBJETOS A MANDAR AL SERVIDOR */
                
                /* OBJETO A MANDAR AL SERVIDOR */
                this._tarjeta ={
                    TaCoId : this.tarjeta._TaCoId,
                    PuCoId : this.tarjeta._PuCoId,
                    RuId : this.tarjeta._RuId,
                    BuId :this.tarjeta._BuId,
                    PrId : Number(this.tarjeta._prId),
                    TaCoFecha :fecha(this.tarjeta._TaCoFecha),
                    TaCoHoraSalida :this.tarjeta._TaCoHoraSalida, /* TIEMPO REFERENCIA */
                    TaCoCuota :this.tarjeta._TaCoCuota,
                    UsId :this.tarjeta._UsId,
                    UsFechaReg :new Date(), /* VER SI ES NECESARIO QUE SE ACTUALICE :s */ 
                    TaCoNroVuelta : this.tarjeta._TaCoNroVuelta = 1
                }

                /* CONIDCIONAL TACOID IGUAL CERO, NUEVOS REGISTRO */
                if(this._tarjeta.TaCoId==0){
                    /* CALCULANDO LAS HORA DE SALIDA */
                        arrHSalida=this.calHorasSalida(this._tarjeta.TaCoHoraSalida,this.tVueltaBus ,this.timeInter, this.nroTarjetas).slice(0);
                    
                    /* CARGANDO ARRAY DE OBJETOS PARA SUBIRLO A LA NUBE */ 
                    for(let i=0; i< this.nroTarjetas; i++){
                        arrObj.push({
                            BuId:this._tarjeta.BuId,
                            PrId:this._tarjeta.PrId,
                            PuCoId:this._tarjeta.PuCoId,
                            RuId:this._tarjeta.RuId,
                            TaCoCuota:this._tarjeta.TaCoCuota,
                            TaCoFecha:this._tarjeta.TaCoFecha,
                            TaCoHoraSalida:this._tarjeta.TaCoHoraSalida,
                            TaCoId:this._tarjeta.TaCoId,
                            TaCoNroVuelta:this._tarjeta.TaCoNroVuelta,
                            UsFechaReg:this._tarjeta.UsFechaReg,
                            UsId:this._tarjeta.UsId,
                        });
                    }
                
                    for(let i=0; i<this.nroTarjetas; i++){
                        arrObj[i].TaCoHoraSalida=hora(arrHSalida[i]);
                    }

                    /* PROCEDURE ASIGNAR TARJETA (RESIVE UN ARRAY, NORMAL FUNCIONA EN CASO DE UN SOLO OBJETO)) */
                    progUpdate ={ PrDeId : this._prDeId,  PrDeAsignadoTarjeta : 1}  /*  */ 

                    for(let i=0; i<this.nroTarjetas; i++){
                        this.tcontrolservice.asignarTarjetaControl(arrObj[i]).subscribe(
                            data => {this.displayAsigMultiTarj=false}, 
                            err => {this.errorMessage=err}
                        );
                    }
                    this.updateProgDetalle(progUpdate);
                }

            }


    /* FUNCIONES VARIADAS */
            /* FUNCION ESCOGER VENTANA DE SOLO UNA TARJETA O VENTANA VARIAS TARJETAS A LA VEZ */
            funcNroTarjetas(){
                /* CONDICION MAXIMO Y MINIMO NROTARJETAS ASIGNAR PERMITIDOS */
                if(this.nroTarjetas>=1 && this.nroTarjetas<=5){
                    /* CONDICION NRO DE TARJETAS */
                    if(this.nroTarjetas==1){
                        /* ABRIENDO MODAL UNA SOLA TARJETA */
                        this.displayAsignarTarjeta=true;
                        this.displayNroTarjetas=false;
                        console.log(this.nroTarjetas);
                        this.nroTarjetas=1; /* DEJANDO EN VALOR POR DEFECTO */
                        this.nuevaAsignaTarjeta();/* INICIANDO NUEVO OBJETO CABECERA - DETALLE */

                    }else if(this.nroTarjetas>1){
                        /* ABRIENDO MODAL VARIAS TARJETAS */
                        console.log("En Programacion");
                        console.log(this.nroTarjetas);
                        this.titulo="Asignando Multiples Tarjetas :  "+this.nroTarjetas;

                        /* ABRIENDO MODAL MULTITARJETA */
                        this.displayAsigMultiTarj=true;
                        this.displayNroTarjetas=false;

                        /* CREANDO MULTIPLES TARJETAS VACIAS SEGUN NROTARJETAS - PROCEDURE CABECERA */
                        this.nuevaAsignaTarjeta();

                    }else if(this.nroTarjetas==0){
                        /* EN CASO PONGA NUMERO CERO */
                        console.log("TERMINAR DE PROGRAMAR");
                        this.cancelNroAsigTarjetas();
                        this.nroTarjetas=1; /* DEJANDO EN VALOR POR DEFECTO */
                    }
                }

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

            /* BOTON ATRAS (REGRESA AL MODAL NRO DE TARJETAS A ASIGNAR), MODAL ASIGNAR MULTITARJETA NROTARJ QUEDA IGUAL */
            btnAtrasMultiTarj(){
                console.log(this.nroTarjetas);
                this.mensaje="Elija el N° de Tarjetas";
                if(this.nroTarjetas==1){
                    this.displayAsignarTarjeta=false;
                    this.displayNroTarjetas=true;
                    this.nroTarjetas=1;
                }else if(this.nroTarjetas>1){
                    this.displayAsigMultiTarj=false;
                    this.displayNroTarjetas=true;
                    this.nroTarjetas=1;
                }
                /* BORRANDO OBJETOS Y VARIABLES CREADOS*/
                this.borrarObjetos();
            }

            /* BORRANDO NUEVOS OBJETOS CREADOS */
            borrarObjetos(){
                this._tarjeta={};
                this.arrNTarjCabecera=[];
                this._tarjetaDetalle={};
                this.arrNTarjDetalle=[];
                this._progDetalle=[]; /* VACIANDO PROGRAMACION EN LA FECHA INDICADA */
                this.val=null; /* BORRANDO VALOR DE VARIABLE(PASADA A OBJETO) - ESTADO DE TARJETA */
                this.actRadioButton=true; /* DESACTIVANDO RADIO BUTTONS ESTA DE TARJETA */
            }

            /* CALCULANDO HORAS DE SALIDA, PARA MULTITARJETAS, ESTA FUNCION DEVUELVE UN ARRAY  */
            calHorasSalida(hInicio:string ,tvuelta:string ,hIntermedio:string, nroTarjetas:number) {
                /* VARIABLES, ARRAYS DE TIEMPOS*/
                let arrH:any[]=[], tRes:any[]=[];
                let arrTInicio = hInicio.split(":"), _arrTInicio:any=[]; let arrTRecorrido = tvuelta.split(":"), _arrTRecorrido:any=[]; let arrTInter = hIntermedio.split(":"), _arrTInter:any=[];

                /* PASANDO A NRO LAS HS-MN-SS DE LA HORA SALIDA */
                for(let i=0; i<arrTInicio.length; i++){_arrTInicio[i]=Number(arrTInicio[i]);}
                
                /* PASANDO A NRO LAS HS-MN-SS TIEMPO RECORRIDO DEL BUS */
                for(let i=0; i<arrTRecorrido.length; i++){_arrTRecorrido[i]=Number(arrTRecorrido[i]);}

                /* PASANDO A NRO LAS HS-MN-SS TIEMPO INTERMEDIO ENTRE TARJETAS */
                for(let i=0; i<arrTInter.length; i++){_arrTInter[i]=Number(arrTInter[i]);}

                /* INICIANDO ARRAY DE HORAS CON ARRAYS VACIOS PARA Q EXISTAN */
                for(let i=0; i<nroTarjetas ; i++){arrH[i]=[];}

                /* SUMANDO TIEMPO RECORRIDO MAS TIEMPO INTERMEDIO*/
                tRes[0]=_arrTRecorrido[0] + _arrTInter[0]; tRes[1]=_arrTRecorrido[1] + _arrTInter[1]; tRes[2]=_arrTRecorrido[2] + _arrTInter[2];

                arrH[0]=_arrTInicio; /* INICIANDO ARRAY TARJETAS CON LA 1ERA HORA SALIDA */

                let j=0, i=1;
                
                /* CALCULANDO LAS HORAS DE SALIDA DE LAS TARJETAS*/
                while(i<nroTarjetas){
                    while(j<3){
                        arrH[i][j]=arrH[i-1][j]+tRes[j];    
                        j++;
                    }
                    j=0;
                    i++;
                }

                /* AJUSTANDO LAS HORAS A 24 HORAS 00:00:00   ---> arrH*/
                j=0; i=1; let auxS,_auxS,auxM,_auxM,auxH,_auxH;
                while(i<nroTarjetas){
                    /* SEGUNDOS*/
                    if(arrH[i][2]>59){
                        if(arrH[i][2]%60==0){
                            auxS = arrH[i][2];
                            arrH[i][2]=0;
                            arrH[i][1]=arrH[i][1]+(auxS/60);
                        }else if(arrH[i][2]%60>0){
                            auxS = arrH[i][2];
                            arrH[i][2] = arrH[i][2]%60;
                            arrH[i][1] = arrH[i][1]+((auxS-auxS%60)/60);
                        }
                    }else if(arrH[i][2]<=59){
                        /* NO HACE NADA */
                    }
                        
                    /* MINUTOS */
                    if(arrH[i][1]>59){
                        if(arrH[i][1]%60==0){
                            auxM = arrH[i][1];
                            arrH[i][1]=0;
                            arrH[i][0]=arrH[i][0]+(auxM/60);
                        }else if(arrH[i][1]%60>0){
                            auxM = arrH[i][1];
                            arrH[i][1] = arrH[i][1]%60;
                            arrH[i][0] = arrH[i][0]+((auxM-auxM%60)/60) ; /* SUMANDO A LA HORA */
                        }
                    }else if(arrH[i][1]<=59){
                        /* NO HACE NADA */
                    }

                    /* HORAS */
                    if(arrH[i][0]>23){
                        /*PASA AL SIGUIENTE DIA */
                        if(arrH[i][0]%24==0){
                            arrH[i][0]=0;
                            /* arrH[i][3]= arrH[i][0]/24 */
                        }else if(arrH[i][0]%24>0){
                            arrH[i][0]=arrH[i][0]%24;
                            /* arrH[i][3] = arrH[i][3]+(arrH[i][0]-arrH[i][0]%24)/60 ; */
                        }
                    }else if(arrH[i][0]<=23){
                        /* NO HACE NADA */
                    }
                    i++;
                }

                /* COMPLETANDO CEROS */
                i=0;
                while(i<nroTarjetas){
                    arrH[i]=arrH[i].join(":");
                    arrH[i]=cCeroHora(arrH[i]);
                    i++;
                }
                return arrH;
            }



    /* NO HAY TARJETAS DE CONTROL ASIGNADAS */
    aceptarNoAsigTarjeta(){
        this.mensaje="";
        this.displayNoTarjetasAsignadas=false;
    }

    /* ERROR, NO PROGRAMACION EN LA FECHA BUSCADA*/
    errorBusquedaProg(){
        this.mensaje="";
        this.displayNoProgEnFecha = false;
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
    
    /* ERROR, FALTO DATOS NECESARIOS PARA BUSCAR POR FECHA */
    errorBuscarxFecha(){
        this.mensaje="";
        this.displayErrorDatosProgxFecha=false;
    }

    

    /* VENTANA ELEGIR ENTRE ASIGNAR UNA O VARIAS TARJETAS A LA VEZ*/
    nroAsigTarjetas(){
        this.mensaje="Elija el N° de Tarjetas";
        this.nroTarjetas=1;
        this.displayNroTarjetas=true;
    }

    cancelNroAsigTarjetas(){
        this.mensaje="";
        this.displayNroTarjetas=false;
        this.nroTarjetas=1; /* VALOR POR DEFECTO */
    }

    

    

    /*SE CANCELA NRO TARJETA IGUAL A UNO*/
    cancelarMultiTarjeta(){
        this.displayAsigMultiTarj = false;
        this.nroTarjetas=1;/*NRO TARJ POR DEFECTO */
        /* BORRANDO OBJETOS Y VARIABLES CREADOS*/
        this.borrarObjetos();
    }

    /*SE CANCELA NRO TARJETA IGUAL A UNO*/
    cancelarTarjeta(){
        this.displayAsignarTarjeta = false;
        this.nroTarjetas=1;/*NRO TARJ POR DEFECTO */
        /* BORRANDO OBJETO Y VARIABLES*/
        this.borrarObjetos();
    }

    

    cancelarEditarTarjeta(){
        this.displayEditarTarjeta = false;
    }

    /* BOTON ELIMINAR REGISTRO*/
    eliminarC(TaCoId :number){
        console.log(TaCoId);
        this._TaCoId = TaCoId;

        this.displayConfirmarEliminar = true;
       this.mensaje ="¿Esta Seguro de Eliminar el Registro?";
    }

    

    /* BOTON CANCELAR ELIMINAR*/
    cancelar_eliminarC(){
        this._PuCoId = 0;
        this.displayConfirmarEliminar = false;
    }
    
    /* BOTON EDITAR REGISTRO CABECERA */
    editarC(taCoId: number){
        this.getalltarjetacontrolbyid(taCoId);   
    }

    /* NO ESTA EN USO */
    editarDetalle(pucodeid:number){
        console.log(pucodeid);
    }

    




    



    /* EN OBSERVACION */
    //CONVERTIR DATE A STRING DE BD A FORMULARIO HORAS
    _ho_ra(fecha : Date) :string{
        let hora : string; let _hora : string; let _fecha = new Date(fecha);
        _hora =  (_fecha.getHours()).toString();
        
            hora = _hora + ":"+_fecha.getMinutes()+":"+_fecha.getSeconds();
            hora = cCeroHora(hora);
        return hora;
    }
    /* EN OBSERVACION */
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

/* PONER EN UNA CLASE GLOBAL*/
    /* COMPLETAR LA HORA EN CASO NECESARIO (PUEDEN BORRAR LOS SEGUNDOS) 
    corrigiendoHora(hora:string):Date{
         let thoy:Date,  otra:Date, horaTarjeta:string;
            thoy=new Date();          
            //COMPLETANDO LOS SEGUNDOS SI ES NECESARIO
            if(hora.length<=5){
                hora = hora+":00"; 
            }
            horaTarjeta=hora;
            let resultado=horaTarjeta.split(':');
            otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
            console.log(otra);
        return otra;
    }*/
    //CONVERTIR STRING A DATE FORMULARIO A BD  HORAS
    /*hora(fecha : string) : Date{
        //FECHA               
        let thoy:Date,  otra:Date, horaTarjeta:string;
        thoy=new Date();
        if(fecha.length<=5){ fecha = fecha+":00"; }
        horaTarjeta=fecha;
        let resultado=horaTarjeta.split(':');
        otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
        //console.log(otra);
        return otra; 
        
    }*/
    //COMPLETANDO CEROS EN CASO DE NECESITAR PARA HORAS Y FECHAS   2017/
    /*cCeroHora(h:string) :string{
            //DIVIDIRLO EN PARTES Y COMPLETAR LOS CEROS PARA QUE LOS ELEMENTOS SEAN TODOS PARES
            let hora : string, _hora :string, resultado, i=0;
            resultado = h.split(':');
            while(i<resultado.length){
                if(resultado[i].length%2 != 0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _hora=resultado[0]+":"+resultado[1]+":"+resultado[2];
        return _hora;
    }*/

    
  
    //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD   2017/03/31  2017-03-31
    /*fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1])-1 ,  Number(resultado[2]));
        return _thoy;
    }*/

    //CONVERTIR DATE A STRING PARA FECHA  - ---   BD A GRILLA
    /*_fecha(fecha: Date) :string{
        let fechaProg : string; let _fechaProg : string; let _fecha = new Date(fecha);  
        _fechaProg=(_fecha.getFullYear()).toString() +" / "+ (_fecha.getMonth()+1 ).toString() +" / "+(_fecha.getDate()).toString() ;
        _fechaProg=this.cCeroFecha(_fechaProg);
        return  _fechaProg;
    }*/

}


   