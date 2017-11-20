import {Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';

import {TControlService} from '../service/tcontrol.service';
import {RegRetenService} from '../service/registroReten.service';
import {PlacasService} from '../service/placas.service';
import {RutaService} from '../service/ruta.service';
import {PuntoControlService} from '../service/pcontrol.service'; 
import {ProgramacionService} from '../service/prog.service';
import {distribTiempoService} from '../service/distribTiempo.service';
import {RegDiarioService} from '../service/registrodiario.service'

import {GlobalVars} from 'app/variables'
import {fechaActual2,ajustaHora,hora,_hora,_cCeroFecha,cCeroHora,corrigiendoHora,corrigiendoHoraString,fecha,_fecha1,fechaActual1,editf1,horaAct} from 'app/funciones';


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
        displayAsignarTarjeta : boolean;
        displayEditarTarjeta : boolean;
        displayConfirmarEliminar : boolean;
        displayErrorDatosProgxFecha : boolean;
        displayNoProgEnFecha : boolean;
        displayErrorNoHayPCModalNuevo : boolean;
        displayHayPCModalNuevo : boolean;
        displayNoTarjetasAsignadas : boolean;
        displayNroTarjetas : boolean;
        displayAsigMultiTarj : boolean;
        displayMensajeNoRegDiario:boolean;
    /* OTRAS VARIABLES */
        private val:string;     //VALOR PARA ASIGNAR TARJETA (ASIGNADO O AUSENTE)
        private tpHoraS:number;  // TIPO ASIGNAR HORA SAL (MANUAL O AUTOMATICO)
        private actRadioButton:boolean=true;
        private nroTarjetas:number; 
        private timeInter:string; /* TIEMPO INTERMEDIO (ASIGNAR MULTITARJETA) */
        private mensaje : string; /*MENSAJE EN PANTALLA PARA CONFIRMAR*/
        private titulo : string; /*TITULO PANTALLAS */
        private tVueltaBus : string; /* TIEMPO RECORRIDO BUS */
        private timevueltadescrip:string; 
        private timevuelta:number; // SABER SI TIENE O NO UN TIEMPOSALIDA
        private msjestadoplaca:string;

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
    TaCoId:number;
    _PuCoId : number;
    _RuId : number;
    _BuId : number;
    _TaCoFecha : string;
    _TaCoHoraSalida : string;
    _TaCoCuota : number; 
    _UsId : number;
    _UsFechaReg : string;
    _TaCoNroVuelta:number;
    private TaCoAsignado:number;

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
        _UsFechaReg :this._UsFechaReg,
        TaCoAsignado:this.TaCoAsignado
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
        arrprogxfecha:any[]=[];
        progD_BD:any[]=[];  //PROGRAMACION RECUPERADA DE LA BD
        _progD_BD:any[]=[]; //PROGRAMACION PARA PASAR A LA GRILLA
        _array:any[]=[];  //ARRAY COMO PARAMETRO A PROCEDIMIENTO SAVE TARJETA DETALLE 
        selectedTarjCab:any[]=[]; /* ROW SELECCIONADOS DE DATATABLE CABECERA TARJETA */
        selectedPlacaONE:any[]=[];
        selectedPlacaMULTI:any[]=[];

    private rutas:any=[];
    private ptsControl:any=[];
    
    // VARIABLES
        private TiSaId:number;
        private TiSaObj:any;
        private selValTarjeta:any;
        private selTpHoraS:any;
        private PrDeAsignadoTarjeta:number;
        private ReDiDeNroVuelta:string;
        private ReDiTotalVuelta:number;
        private mensajeModal:string;
        private ReReTiempo:string;
        private ReDiDeId:number;
        private ReReId:number;
        private PrDeId:number;
        
    /* VARIABLES GLOBALES*/
        private emID : number;
        private UsId:number;
    
    //ARRAYS
        private arrValTarjeta:any[];
        private arrTpHoraS:any[];

    constructor(    public  ClassGlobal : GlobalVars,
                    private tcontrolservice : TControlService,
                    private placaService : PlacasService, 
                    private rutaService : RutaService,
                    private pcontrolService : PuntoControlService, 
                    private progService : ProgramacionService,
                    private disTiemservice : distribTiempoService,
                    private regdiarioService:RegDiarioService,
                    private regRetenService:RegRetenService,
                    private router: Router
                ){
                    this.selValTarjeta={nomb:"", val:""};
                    this.selTpHoraS={nomb:"", val:""};
                    this.arrValTarjeta=[{nomb:"ASIGNAR", val:'01'},{nomb:"AUSENTE", val:'02'},{nomb:"CASTIGADO", val:'03'}];
                    this.arrTpHoraS=[{nomb:"MANUAL", val:'01'},{nomb:"AUTOMATICO", val:'02'}];
                    this.emID=this.ClassGlobal.GetEmId();
                    this.UsId=this.ClassGlobal.GetUsId();
                    this.tpHoraS=2;
                    this.tarjeta._UsId = this.UsId; //ARREGLAR ESTO
                    this._ruId=0; /* INICIANDO RUID A CERO PARA DESACTIVAR EL BOTON ASIGNAR TARJETA */
                    this.arrNTarjCabecera=[]; /*INICIANDO ARRAY A VACIO DE NUEVAS TARJETAS */
                    this.TiSaObj={SuEmId:0, TiSaId:0, TiSaNombre:"", TiSaValor:""}

                    //DISPLAY
                    this.displayAsignarTarjeta = false;
                    this.displayEditarTarjeta = false;
                    this.displayConfirmarEliminar = false;
                    this.displayErrorDatosProgxFecha = false;
                    this.displayNoProgEnFecha = false;
                    this.displayErrorNoHayPCModalNuevo = false;
                    this.displayHayPCModalNuevo = false;
                    this.displayNoTarjetasAsignadas = false;
                    this.displayNroTarjetas = false;
                    this.displayAsigMultiTarj = false;
                    this.displayMensajeNoRegDiario =false;
                }

    ngOnInit(){
        this.getallplacasbusbyemsuem(this.emID,0); /*TODAS LAS PLACAS POR EMID, EL CERO ES PARA TODOS LOS SUEMID*/
        this.getallprogramacionbyem(this.emID,0); //PROGRAMACION X EMP Y POR AÑO(ACLARAR ESTO)
        this.getAllRutaByEm(this.emID);
        this.getAllRegistroDiario(this.emID);
    }
    

/* PROCEDURES */ 
    /* GETTERS */
        /* CONSULTANDO TIEMPO SALIDA DE CADA PLACA 
        getvalorsalidabyembu(emid:number, buid:number){
            let objvalor:any[]=[];
            this.disTiemservice.getvalorsalidabyembu(emid, buid).subscribe(
                data => {objvalor=data; this.mvalortiempoplaca(objvalor);},
                err => {this.errorMessage=err},
                () => this.isLoading=false
            );  
        }*/

        getAllRegistroDiarioDetalle(ReDiId:number){
            let arrRegDet:any[]=[];
            this.regdiarioService.getAllregistrodiarioDetalleByPrId(ReDiId).subscribe(
                data => { arrRegDet=data; 
                          //console.log(this.buscarRegDiarioDetalleActual(arrRegDet));
                          if(this.buscarRegDiarioDetalleActual(arrRegDet).ReDiDeNroVuelta!=-1){
                            this.mRegistroDiarioDetalle(this.buscarRegDiarioDetalleActual(arrRegDet));
                          }else if(this.buscarRegDiarioDetalleActual(arrRegDet).ReDiDeNroVuelta==-1){
                            console.log("No se encontro");
                          }
                        },
                error=> {console.log(error);}
            );
        }

        //REGISTRO DIARIO DE VUELTAS
            getAllRegistroDiario(emId:number){
                let regDir:any[]=[];
                this.regdiarioService.getAllRegistroDiarionByemId(emId).subscribe(
                    data=>{regDir=data; this.mRegistroDiario(regDir);},
                    err=>{console.log(err);}
                );
            }

        // GET REGISTRO RETEN   /registroreten/getallregistroretenbyredide",params = {"reDiDeId"}
            getAllRegistroRetenByredide(reDiDeId:number){
                let regReten:any[]=[];
                this.regRetenService.getAllRegistroRetenByemId(reDiDeId).subscribe(
                    data=>{regReten=data; console.log(regReten);},
                    err=>{console.log(err);}
                );
            }

            getRegistroRetenById(ReReId:number){
                this.regRetenService.getRegistroRetenById(ReReId).subscribe(
                    data => { console.log(data);},
                    err  => {this.errorMessage = err; console.log(err);}, 
                    ()   => this.isLoading = false
                );
            }

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
                                    this._allTarjControl=[];
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
            getallprogramacionbydate(PrId:number, Date: string, nroTarjetas:number){

                this.tcontrolservice.getAllProgramacionDetalleByPrFecha(PrId, Date).subscribe(
                    data => {  this.progDetalle=data; console.log(this.progDetalle);

                                if(this.progDetalle.length>0 ){
                                    //this.getallplacasbusbyemsuem(this.emID,0);
                                    this.mgprogDetalle(); /*GRILLA PROG POR FECHA*/
                                    //CASO ABRIR MODAL ASIG_TARJ
                                    if(nroTarjetas==1){
                                        this.displayAsignarTarjeta=true; this.displayNroTarjetas=false;
                                        this.mgprogDetalle();
                                        this.nroTarjetas=1; /* DEJANDO EN VALOR POR DEFECTO */
                                        this.nuevaAsignaTarjeta();/* INICIANDO NUEVO OBJETO CABECERA - DETALLE */
                                    }else if(nroTarjetas>1){

                                    }
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

        //CONSULTA PUNTOSDETALLE PARA INICIAR LA TARJETA CON EL PUNTO
            getallpuntocontroldetallebypuco(puCoId:number){
                this.tcontrolservice.getAllPuntoControlDetalleByPuCo(puCoId).subscribe(
                    data => {
                                this.puntosControlDet=data; 
                                if(this.puntosControlDet.length==0){
                                    this.mensaje="No Hay Puntos de Control";
                                    this.displayHayPCModalNuevo=true;
                                    this.displayErrorNoHayPCModalNuevo=false;
                                }else if(this.puntosControlDet.length>0){
                                    this.mensaje="Puntos de Control Correcto";
                                    this.displayErrorNoHayPCModalNuevo=true;
                                    this.displayHayPCModalNuevo=false;
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

        /* GET ALL TARJCTRLDET BY TACOID */
            procgetAllTarjCtrlDetBytaCoId(taCoId:number){
                let tarjDet:any[]=[];
                this.tcontrolservice.getAllTarjetaControlDetalleBytaCoId(taCoId).subscribe(
                    data => { tarjDet = data; 
                            this.mgTarjetaDetalle(tarjDet);  }
                );
            }

    /* MANTENIMIENTO */
        //  RETEN
            procDeleteRegistroReten(ReReId:number){
                this.regRetenService.deleteregistroRetenByid(ReReId).subscribe(
                    realizar => {/* REFRESCAR */},
                    error => {console.log(error);}
                );
            }
            procSaveRegistroReten(ObjReten:any){
                this.regRetenService.saveregistroReten(ObjReten).subscribe(
                    realizar => {/* REFRESCAR */},
                    error => {console.log(error);}
                );
            }

            procNewRegistroReten(){
                let objReten:any;
                this.regRetenService.newregistroReten().subscribe(
                    data=>{ objReten=data;
                            console.log(data); 
                            this.ReReId=objReten.ReReId;
                            this.ReReTiempo=objReten.ReReTiempo;
                          },
                    error=>{console.log(error);}
                );
            }

        /* PROCEDURE ELIMINAR REGISTRO - NO EN USO*/
            procDeleteTarjetaControl(TaCoId:number){
                /**/
                this.tcontrolservice.deleteTarjetaControl(TaCoId).subscribe(
                realizar =>{this.getalltarjetasbyemidpucoid(this.emID,this._pcId);},
                err => {console.log(err);}
                );
            }

        /* NO ASIGNADO VAL=0 , ASIGNADO VAL=1 */ /* AUSENTE VAL=2 */
        /* PROCEDURE ACTUALIZAR PROGRAMACIONDETALLE */
            updateProgDetalle(progUpdate : Object[]){
                this.tcontrolservice.actualizarProgDetalleAusente(progUpdate).subscribe
                                    (data => {
                                                /*if(this.val==0){
                                                    console.log("La tarjeta no fue asignada");
                                                }else if(this.val==1){
                                                    console.log("La tarjeta fue asignada");
                                                }else if(this.val==2){
                                                    console.log("El chofer esta ausente");
                                                }*/
                                                this.borrarObjetos();
                                            }, 
                                    err => {this.errorMessage=err});
            }

        /*UNA SOLA TARJETA*/
            procAsigTarjCtrl(_tarjeta:any, progUpdate:any){
                console.log(_tarjeta);
                /* PROCEDURE ASIGNAR TARJETA (UNA SOLA) */
                this.tcontrolservice.asignarTarjetaControl(_tarjeta).subscribe(
                    data => { this.updateProgDetalle(progUpdate);/* PROCEDURE UPDATE PROGDETALLE */   
                            this.getalltarjetasbyemidpucoid(this.emID,this._PuCoId); }, 
                    err  => {this.errorMessage=err}
                );
            }
        /*VARIAS TARJETAS*/
            procAsigMulTarj(){

            }

        //ABRIR MODAL ASIGNAR NUEVA TARJETA CONTROL
        nuevaAsignaTarjeta(){
            //this.tarjeta._TaCoId=0; PONIENDO TACOID A CERO PARA INDICAR Q ES NUEVO REGISTRO
            this._progDetalle=[];
            this._TaCoId=0;
            /* PROCEDURE NUEVA TARJETA CABECERA UNA O MULTIPLE */
            this.tcontrolservice.newTarjetaControl() .subscribe(
                    data =>{ 
                                this._tarjeta=data;
                                //console.log(this._tarjeta);
                                this.tarjeta={
                                    _TaCoId : this._tarjeta.TaCoId,
                                    
                                    

                                    _BuId :this._tarjeta.BuId,
                                    _PrId :this._tarjeta.PrId,
                                    _PuCoId : this._tarjeta.PuCoId,
                                    _RuId : this._tarjeta.RuId,
                                    

                                    _TaCoNroVuelta:this._tarjeta.TaCoNroVuelta,
                                    _TaCoFecha :"",
                                    _TaCoHoraSalida :horaAct(),
                                    _TaCoCuota :this._tarjeta.TaCoCuota,
                                    _UsId :this._tarjeta.UsId,
                                    TaCoAsignado:this._tarjeta.TaCoAsignado,
                                    _UsFechaReg :this._tarjeta.UsFechaReg
                                }
                                this.tpHoraS=2;
                                this.TiSaId=this._tarjeta.TiSaId;

                        }
            );
        }

/* MOSTRAR DATOS */
        //VALOR TIPO TIEMPO SALIDA
            /*
            mvalortiempoplaca(objvalor=[]){
                let _objvalor:any;
                //console.log(objvalor);

                if(objvalor.length!=0){
                    _objvalor={
                        SuEmId:objvalor[0].SuEmId,
                        TiSaId:objvalor[0].TiSaId,
                        TiSaNombre:objvalor[0].TiSaNombre,
                        TiSaValor:_hora(objvalor[0].TiSaValor)
                    }  
                    this.timevuelta=1; //TIENE TISA
                    this.timevueltadescrip='\t'+_hora(objvalor[0].TiSaValor);
                }else if(objvalor.length==0){
                    this.timevuelta=0; //NO TIENE TISA
                    this.timevueltadescrip='\t'+"No Tiene";
                }
                this.TiSaObj=_objvalor;
                //console.log(_objvalor);
            }
            */
        
        //COMBO PROGRAMACION CABECERA (CARGA ARRAY PARA MOSTRAR OPCIONES EN EL COMBOBOX)
            mcobprogramacion(){
                this._programacion=[];
                for(let prog of this.programacion){
                    this._programacion.push({
                        EmConsorcio:prog.EmConsorcio,
                        PrAleatorio:prog.PrAleatorio,
                        PrCantidadBuses:prog.PrCantidadBuses,
                        PrFecha:_fecha1(prog.PrFecha),
                        PrFechaFin:_fecha1(prog.PrFechaFin),
                        PrFechaInicio:_fecha1(prog.PrFechaInicio),
                        PrTipo:prog.PrTipo,
                        dias:prog.dias,
                        prDescripcion:prog.prDescripcion.substr(0,4) +" de "+_fecha1(prog.PrFechaInicio)+" a  "+_fecha1(prog.PrFechaFin) ,
                        prId:prog.prId
                    });
                }
            }

        //GRILLA PROGRAMACION DETALLE  -  POR LA FECHA
            mgprogDetalle(){ 
                this._progDetalle=[];
                //i: PARA RECORRER EL ARRAY, SI Y NO: CUANTOS SE ENCONTRARON Y NO SE ENCONTRARON
                let i = 0; let j=0;  let si=0; let no=0; let cen = 0, cen2=0; 
                let programacion=[]; let longProg = this.progDetalle.length;

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
                                PrDeAsignadoTarjeta:this.progDetalle[i].PrDeAsignadoTarjeta,
                                PrDeCountVuelta:this.progDetalle[i].PrDeCountVuelta,
                                SuEmRSocial:this.placas[j].SuEmRSocial,
                                BuDescripcion:this.placas[j].BuDescripcion
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
                //programacion: array con 1era parte de la programacion
                for(let progD of programacion){
                    /*/FILTRANDO SI ESTA ASIGNADO, SI LO ESTA NO SE PUEDE MOSTRAR
                    if(progD.PrDeAsignadoTarjeta != 1){}*/
                        this._progDetalle.push({
                            nro:0,
                            BuId:progD.BuId,
                            nroPlaca:progD.nroPlaca,
                            PrId:progD.PrId,
                            PrDeOrden:progD.PrDeOrden,
                            PrDeId:progD.PrDeId,
                            PrDeAsignadoTarjeta:progD.PrDeAsignadoTarjeta,
                            SuEmRSocial:progD.SuEmRSocial,
                            BuDescripcion:progD.BuDescripcion,
                            PrDeCountVuelta:progD.PrDeCountVuelta
                            /*
                                PrDeFecha:progD.PrDeFecha,
                                UsFechaReg:progD.UsFechaReg,
                                UsId:progD.UsId,
                                PrDeBase:progD.PrDeBase,
                            */
                        });
                    
                }

                /* ENUMERANDO FILAS DE LA TABLA DE PROG, TABLA ASIG NUEVA PROGRAMACION */
                for(let k=0; k<this._progDetalle.length;k++){
                    this._progDetalle[k].nro=k+1;
                }
                //console.log(this._progDetalle);
                this.arrprogxfecha=this._progDetalle.slice(0);
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
                        TaCoFecha:_fecha1(TarjControl.TaCoFecha),
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
            mgTarjetaDetalle(arrtarj=[]){
                this._allTarjDetalle = [];
                for(let tDetalle of arrtarj){
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
            }
        
        //MOSTRAR RESULTADO EN ASIGNAR TABLAS - NRO VUELTAS POR EL DIA
            mRegistroDiario(arrReg=[]){
                let ReDiId:number; let ReDiTotalVuelta:number;
                
                ReDiId=this.buscarRegDiarioActual(arrReg).ReDiId;
                ReDiTotalVuelta=this.buscarRegDiarioActual(arrReg).ReDiTotalVuelta;
                
                if(ReDiId!=-1 && ReDiTotalVuelta!=-1){
                    this.ReDiTotalVuelta=ReDiTotalVuelta;
                    this.getAllRegistroDiarioDetalle(ReDiId);
                }else if(ReDiId==-1 && ReDiTotalVuelta==-1){
                    this.mensajeModal="No Se Creo Un Registro Diario, Necesita Crear un Registro Diario";
                    this.displayMensajeNoRegDiario=true;
                }
            }
            mRegistroDiarioDetalle(objRegDet:any){
                this.ReDiDeNroVuelta=objRegDet.ReDiDeNroVuelta;
                this.ReDiDeId=objRegDet.ReDiDeId;
                this.getAllRegistroRetenByredide(objRegDet.ReDiDeId);
            }

/* FUNCIONES */
    // FUNCIONES CONFIRMAR
        aceptarNoRegDiario(){
            this.displayMensajeNoRegDiario=false;
            this.router.navigate(['/regdiario']);
        }
    // FUNCIONES BUSQUEDA
        buscarRegDiarioActual(arrReg=[]){
            let ReDiId:any;
            let i:number=0, cen:boolean=false;
            
            //console.log(_fecha1(arrReg[1].ReDiFeha));  //console.log(fechaActual2());
            
            while(i<arrReg.length && cen==false){
                //console.log('i: '+i);
                //console.log(_fecha1(arrReg[i].ReDiFeha)+' --- '+fechaActual2());
                if(_fecha1(arrReg[i].ReDiFeha)==fechaActual2()){
                    cen=true;
                }else if(_fecha1(arrReg[i].ReDiFeha)!=fechaActual2()){
                    i++; cen=false;
                }
            }
            if(cen==true){
                ReDiId=arrReg[i];
            }else if(cen==false){
                ReDiId={ReDiId:-1, 
                        ReDiTotalVuelta:-1};
            }
            return ReDiId;
        }
        buscarRegDiarioDetalleActual(arrRegDet=[]){
            let objReturn:any; let i:number=0, cen:boolean=false;
            objReturn=arrRegDet[0];
            while(i<arrRegDet.length && cen==false){
                if(arrRegDet[i].ReDiDeEstado=='02'){
                    cen=true;
                }else if(arrRegDet[i].ReDiDeEstado!='02'){
                    i++; cen=false;
                }
            }
            if(cen==true){
                objReturn=arrRegDet[i];
            }else if(cen==false){
                objReturn={
                    ReDiId:-1,
                    ReDiDeNroVuelta:-1
                };
                //ReDiId":4,"ReDiDeNroVuelta":3,"ReDiDeNombreVuelta":"VUELTA3","ReDiDeEstado":"01","ReDiDeId"
            }
            return objReturn;
        }
    /* FUNCIONES ONROWSELECT ASOCIADAS A FILAS DE DATATABLES */
            /* SELECCIONAR REGISTRO TARJETA CONTROL (CABECERA- GRILLA)*/
                onRowSelectCabecera(event){
                    this.tarjeta._TaCoId=0; 
                    this.tarjeta._TaCoId = event.data.TaCoId; /* ACTUALIZA EL CAMPO PARA PODER USARLO SI ES CASO SE QUIERA EDITAR EL REGISTRO */ 
                    this.TaCoId=event.data.TaCoId;
                    console.log(this.TaCoId);
                    this.procgetAllTarjCtrlDetBytaCoId(this.TaCoId);
                }

            /* SELECCIONAR PLACA DE SORTEO (LISTA DE PLACAS DE SORTEO) */
                onRowPlaca(event){    
                    /*this.val=2;  REINICIANDO A CERO EL VALOR DEL RADIO BUTTON */
                    this._prDeId = event.data.PrDeId; /* PROGRAMACIONDETALLE ID */
                    this._BuId=event.data.BuId;
                    this._TaCoNroVuelta=event.data.PrDeCountVuelta;
                    this.PrDeAsignadoTarjeta=event.data.PrDeAsignadoTarjeta;
                    //let val=event.data.PrDeAsignadoTarjeta;
                    console.log(event.data);
                    
                    //this.getvalorsalidabyembu(this.emID, this._BuId);
                    /*this.tarjeta._BuId=obj.BuId;  ID DE LA PLACA SELCCIONADA */
                    
                    /* SI VAL=0 RADIOBUTTONS HABILITADOS 
                    if(this.PrDeAsignadoTarjeta==0){
                        this.val=1; 
                        this.actRadioButton=false; 
                        this.msjestadoplaca='\t'+"No Asignado";
                    }else if(this.PrDeAsignadoTarjeta==1 || this.PrDeAsignadoTarjeta==2){
                        this.val=val;
                        this.actRadioButton=true;
                        this.msjestadoplaca='\t'+"Asignada";
                    }
                    */
                }
            /* FUNCION ROW BTNELIMINAR CABECERA*/
                /* BOTON ELIMINAR REGISTRO  BTN ROW CABECERA*/
                    eliminarC(TaCoId :number){
                        /*console.log(TaCoId);*/
                        this._TaCoId = TaCoId;

                        this.displayConfirmarEliminar = true;
                        this.mensaje ="¿Esta Seguro de Eliminar el Registro?";
                    }
                /* ACEPTAR ELIMINAR EL REGISTRO */
                    aceptar_eliminarC(){
                        this.mensaje="";
                        this.procDeleteTarjetaControl(this._TaCoId);
                        this.displayConfirmarEliminar = false;  
                    }
                /* BOTON CANCELAR ELIMINAR*/
                    cancelar_eliminarC(){
                        this.mensaje ="";
                        this._PuCoId=null;
                        this.displayConfirmarEliminar = false;
                    }

    /* FUNCIONES DE COMBOBOX */
            /* FUNCION ASOCIADA A COMBO DE RUTAS */
            rutaId(event:Event){
                /*console.log(this._ruId);*/
                this.getAllPControlBy(this.emID,this._ruId);
            }

            /* FUNCION ASOCIADA COMBO PUNTO CONTROL HACE CONSULTA PARA GRILLA PRINCIPAL */
            pControlId(event:Event){
                /*this._pcId    :    VARIABLE ASOCIADA A ESTE COMBO*/
                this._allTarjControl=[];
                this._allTarjDetalle=[];
                this.selectedTarjCab=[];

                this.getalltarjetasbyemidpucoid(this.emID,this._pcId);
            }

            /*SELECCIONAR PUNTOS DE CONTROL DEL COMBOBOX,  FORMULARIOS DE ASIGNAR TARJETA */
            puntosControlId(event:Event){
                /* AL HACER CLIC SOBRE EL COMBO DEVUELVE UN OBJETO SEGUN OPCION SELECCIONADA  -> this.puntoControl */
                /*this._pcId=this.puntoControl.PuCoId;*/
                /*this.idPunto = this.puntoControl.PuCoId;*/
                let PuCoId = this.puntoControl.PuCoId;
                let ruID = this.puntoControl.RuId;
                this.tVueltaBus=this.puntoControl.PuCoTiempoBus
                this.selectedPlacaONE=[];
                this.selectedPlacaMULTI=[];
                this._prId=this._programacion[this._programacion.length-1].prId; /* ID ULTIMA PROGRAMACION */
                this.tarjeta._prId=this._prId;

                
                //PASANDO DATOS AL OBJETO
                    this._RuId = ruID;
                    this._PuCoId = PuCoId;
                    //console.log(this._PuCoId);
                    this.tarjeta._TaCoFecha=editf1(fechaActual1());
                //CONSULTANDO TODOS LOS PUNTOS DE CONTROL(DETALLE) USARLOS PARA INICIAR LA TAREJTADETALLE
                    /* this.getallpuntocontroldetallebypuco(this.idPunto); */
                    this.getallpuntocontroldetallebypuco(PuCoId);
            }

            /* SELECCIONAR PROGRAMACION COMBOBOX -> PROG ID */
            programacionId(event:Event){
                this.tarjeta._prId=this._prId;
            }

            //SELECCIONAR PLACA DE BUS COMBOBOX
            /*placaObj(event : Event){
                this.val=0;
                this._prDeId = this.placa.PrDeId;
                this.tarjeta._BuId=this.placa.BuId;
                this.val = this.placa.PrDeAsignadoTarjeta;
            }*/


    /* FUNCIONES ASIGNAR TARJETAS */

            /* SOLA UNA TARJETA, AQUI SE GUARDA TANTO CABECERA COMO DETALLE Y SE EDITA  LA 
               TABLA PROGRAMACION DETALLE EL CAMPO ASIGNADO*/
            guardarTarjeta(){
                let _tarjeta:any; let reten:any; let UsFechaReg=new Date();
                let progUpdate : any = {PrDeId : 0,PrDeAsignadoTarjeta : 0}

                console.log(this.TiSaObj);
                //OBJETO RETEN
                reten={
                    ReDiDeId:this.ReDiDeId,
                    ReReId:this.ReReId,
                    PrDeId:this._prDeId,
                    ReReTiempo:hora(this.ReReTiempo),
                    UsId:this.UsId,
                    UsFechaReg:UsFechaReg
                }
                //OBJETO TARJETA TaCoFecha :fecha(this.tarjeta._TaCoFecha),
                _tarjeta ={
                    TaCoId : this._TaCoId,
                    PuCoId : this._PuCoId,
                    RuId : Number(this._ruId),
                    BuId :this._BuId,
                    TaCoFecha :UsFechaReg,
                    TaCoHoraSalida :corrigiendoHora(this.tarjeta._TaCoHoraSalida),
                    TaCoCuota :0,
                    UsId :this.UsId,
                    UsFechaReg :UsFechaReg,
                    TaCoNroVuelta : this._TaCoNroVuelta+1,
                    PrId : Number(this._prId),
                    TiSaId:this.TiSaObj.TiSaId,
                    TaCoAsignado :Number(this.val),
                    TaCoTipoHoraSalida:Number(this.tpHoraS),
                    ReDiDeId:this.ReDiDeId
                }
                console.log(reten);
                
                
                

                /*NUEVA TARJETA*/
                progUpdate ={  PrDeId : this._prDeId,  PrDeAsignadoTarjeta : this.val }         
                
                
                // ASIGNAR VAL=01  ;   CASTIGADO VAL=03  
                if(this.val=='01' || this.val=='03'){
                    this.regRetenService.saveregistroReten(reten).subscribe(
                        data =>{
                                console.log(data);
                                _tarjeta.ReDiDeId=data.ReDiDeId;
                                console.log(_tarjeta);
                                
                                this.procAsigTarjCtrl(_tarjeta,progUpdate);
                                },
                        error=>{console.log(error);}
                    );
                    

                // AUSENTE VAL=2 
                }else if(this.val=='02'){
                    //ACTUALIZAR PROGRAAMCION DETALLE EN EL CAMPO ASIGNADO, SALE COMO ausente SI NO VINO NO SE LE ASIGNA TARJETA
                    this.updateProgDetalle(progUpdate);

                // NO ASIGNADO VAL=0  NO SE HACE ALGO :s 
                }else if(this.val=='00'){}        
                
                this.displayAsignarTarjeta = false;
            }
        
            /* -> GUARDAR MULTIPLES TARJETAS*/
            guardarMultiTarjetas(){
                /* PARA ACTUALIZAR PROGRAMACIONDETALLE */
                let progUpdate : any = {PrDeId : 0, PrDeAsignadoTarjeta : 0}, _tarjeta:any;
                let arrHSalida=[];/* ARRAY HORAS SALIDA PARA LA MISMA PLACA */ let arrObj = []; /* ARRAY OBJETOS A MANDAR AL SERVIDOR */
                
                /* OBJETO A MANDAR AL SERVIDOR */
                _tarjeta ={
                    TaCoId : this._TaCoId,
                    PuCoId : this._PuCoId,
                    RuId : this._RuId,
                    BuId :this._BuId,
                    PrId : Number(this._prId),
                    TaCoFecha :new Date(),
                    TaCoHoraSalida :this.tarjeta._TaCoHoraSalida, /* TIEMPO REFERENCIA */
                    TaCoCuota :this.tarjeta._TaCoCuota,
                    UsId :this.UsId,
                    UsFechaReg :new Date(), /* VER SI ES NECESARIO QUE SE ACTUALICE :s */ 
                    TaCoNroVuelta : this.tarjeta._TaCoNroVuelta = 1,
                    TaCoAsignado :1,
                    TiSaId:this.TiSaObj.TiSaId,
                    TaCoTipoHoraSalida:1
                }

                /* CALCULANDO LAS HORA DE SALIDA */
                let tsalida=corrigiendoHoraString(_tarjeta.TaCoHoraSalida);
                let tvuelta=corrigiendoHoraString(this.tVueltaBus);
                /*let tvuelta="01:59:59";*/
                let timeInter=corrigiendoHoraString(this.timeInter);
                //console.log(tvuelta);

                arrHSalida=this.calHorasSalida(tsalida,tvuelta,timeInter, this.nroTarjetas).slice(0);
                //console.log(arrHSalida);

                /* CARGANDO ARRAY DE OBJETOS */ 
                for(let i=0; i< this.nroTarjetas; i++){
                    arrObj.push({
                        BuId:_tarjeta.BuId,
                        PrId:_tarjeta.PrId,
                        PuCoId:_tarjeta.PuCoId,
                        RuId:_tarjeta.RuId,
                        TaCoCuota:_tarjeta.TaCoCuota,
                        TaCoFecha:_tarjeta.TaCoFecha,
                        TaCoHoraSalida:_tarjeta.TaCoHoraSalida,
                        TaCoId:_tarjeta.TaCoId,
                        TaCoNroVuelta:_tarjeta.TaCoNroVuelta,
                        UsFechaReg:_tarjeta.UsFechaReg,
                        UsId:_tarjeta.UsId,

                        aCoAsignado :_tarjeta.aCoAsignado,
                        TiSaId:_tarjeta.TiSaId,
                        TaCoTipoHoraSalida:_tarjeta.TaCoTipoHoraSalida
                    });
                }
                
                for(let i=0; i<this.nroTarjetas; i++){
                    arrObj[i].TaCoHoraSalida=hora(arrHSalida[i]);
                }

                /* PROCEDURE ASIGNAR TARJETA (RESIVE UN ARRAY, NORMAL FUNCIONA EN CASO DE UN SOLO OBJETO)) */
                progUpdate ={ PrDeId : this._prDeId,  PrDeAsignadoTarjeta : 1}  /*  */ 
                //console.log(progUpdate);
                /*console.log(arrObj); 
                this.displayAsigMultiTarj=false;*/
                
                for(let i=0; i<this.nroTarjetas; i++){
                    this.tcontrolservice.asignarTarjetaControl(arrObj[i]).subscribe(
                        data => {this.displayAsigMultiTarj=false; 
                                if(i=this.nroTarjetas-1){
                                    this.getalltarjetasbyemidpucoid(this.emID,this._PuCoId);
                                    this._pcId=this._PuCoId;
                                    this.updateProgDetalle(progUpdate);
                                }}, 
                        err => {this.errorMessage=err}
                    );
                }

            }


    /* FUNCIONES VARIADAS */
            /* FUNCION ESCOGER VENTANA DE SOLO UNA TARJETA O VENTANA VARIAS TARJETAS A LA VEZ */
            funcNroTarjetas(){
                this.mensaje="";

                /* CONDICION MAXIMO Y MINIMO NROTARJETAS ASIGNAR PERMITIDOS */
                if(this.nroTarjetas>=1 && this.nroTarjetas<=5){
                    /* CONDICION NRO DE TARJETAS */
                    if(this.nroTarjetas==1){
                        // console.log(this._progDetalle); 
                        
                        this.getallprogramacionbydate(this._prId, fechaActual1(), this.nroTarjetas);
                    }else if(this.nroTarjetas>1){
                        /* ABRIENDO MODAL VARIAS TARJETAS */
                        this.titulo="Asignando Multi-Tarjeta :  "+this.nroTarjetas;

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

            /*buscarxFecha(){
                if(this.puntoControl!=undefined && this._prId!=undefined){
                    this.getallprogramacionbydate(this._prId, fechaActual1());
                }else if(this.puntoControl==undefined || this._prId==undefined){
                    this.mensaje="Error, Revise Bien El Punto de Control y La Programacion";
                    this.displayErrorDatosProgxFecha=true;
                }  
            }*/
            
            /* BOTON ATRAS (REGRESA AL MODAL NRO DE TARJETAS A ASIGNAR), MODAL ASIGNAR MULTITARJETA NROTARJ QUEDA IGUAL */
            btnAtrasMultiTarj(){
                console.log(this.nroTarjetas);
                
                
                
                if(this.nroTarjetas==1){
                    this.displayAsignarTarjeta=false;
                    this.displayNroTarjetas=true;
                    this.nroTarjetas=1; //VOLVIENDO A 1 TARJ
            
                }else if(this.nroTarjetas>1){
                    this.displayAsigMultiTarj=false;
                    this.displayNroTarjetas=true;
                    this.nroTarjetas=1;
                }
                /* BORRANDO OBJETOS Y VARIABLES CREADOS*/
                this.borrarObjetos();
                this.tarjeta._TaCoFecha=editf1(fechaActual1()); //INGR FECHA ACT
            }

            /* BORRANDO NUEVOS OBJETOS CREADOS */
            borrarObjetos(){
                this._tarjeta={};
                this.arrNTarjCabecera=[];
                this._tarjetaDetalle={};
                this.arrNTarjDetalle=[];
                this._progDetalle=[]; /* VACIANDO PROGRAMACION EN LA FECHA INDICADA */
                this.val='00'; /* BORRANDO VALOR DE VARIABLE(PASADA A OBJETO) - ESTADO DE TARJETA */
                this.actRadioButton=true; /* DESACTIVANDO RADIO BUTTONS ESTA DE TARJETA */
            }

            /* CALCULANDO HORAS DE SALIDA, PARA MULTITARJETAS, ESTA FUNCION DEVUELVE UN ARRAY  */
            calHorasSalida(hInicio:string ,tvuelta:string ,hIntermedio:string, nroTarjetas:number) {
                /* VARIABLES, ARRAYS DE TIEMPOS*/
                let arrH:any[]=[], tTotEntreTarj:any[]=[];  let _arrTInicio:any=[], arrTInicio = hInicio.split(":");
                let _arrTRecorrido:any=[],arrTRecorrido = tvuelta.split(":"); let _arrTInter:any=[], arrTInter = hIntermedio.split(":");

                /* PASANDO A NRO LAS HS-MN-SS DE LA HORA SALIDA */
                for(let i=0; i<arrTInicio.length; i++){  _arrTInicio[i]=Number(arrTInicio[i]);}
                
                /* PASANDO A NRO LAS HS-MN-SS TIEMPO RECORRIDO DEL BUS */
                for(let i=0; i<arrTRecorrido.length; i++){ _arrTRecorrido[i]=Number(arrTRecorrido[i]);}

                /* PASANDO A NRO LAS HS-MN-SS TIEMPO INTERMEDIO ENTRE TARJETAS */
                for(let i=0; i<arrTInter.length; i++){ _arrTInter[i]=Number(arrTInter[i]);}

                /* INICIANDO ARRAY DE HORAS CON ARRAYS VACIOS PARA Q EXISTAN */
                for(let i=0; i<nroTarjetas ; i++){arrH[i]=[0,0,0];}
         
                /* SUMANDO TIEMPO RECORRIDO MAS TIEMPO INTERMEDIO  HORA(0) MINUTO(1) SEGUNDOS(2)*/
                tTotEntreTarj[0]=_arrTRecorrido[0] + _arrTInter[0]; tTotEntreTarj[1]=_arrTRecorrido[1] + _arrTInter[1]; tTotEntreTarj[2]=_arrTRecorrido[2] + _arrTInter[2];
           
                arrH[0]=_arrTInicio; /* INICIANDO ARRAY TARJETAS CON LA 1ERA HORA SALIDA */

                let j=0, i=1; 
                /* CALCULANDO LAS HORAS DE SALIDA DE LAS TARJETAS*/
                while(i<nroTarjetas){
                    while(j<3){ 
                        arrH[i][j]=arrH[i-1][j]+tTotEntreTarj[j]; 
                        j++; }
                    j=0; i++;
                }

                /* CORRIGIENDO LOS HOUR MIN SEG */
                arrH=ajustaHora(arrH,nroTarjetas);

                /* COMPLETANDO CEROS */
                i=0;
                while(i<nroTarjetas){ arrH[i]=arrH[i].join(":"); arrH[i]=cCeroHora(arrH[i]);  i++; }
                return arrH;
            }

    /* ORDENARLAS */

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
            console.log("aceptarHayPC");
            this.displayHayPCModalNuevo=false;
        }
        
        /* ERROR, FALTO DATOS NECESARIOS PARA BUSCAR POR FECHA */
        errorBuscarxFecha(){
            this.mensaje="";
            this.displayErrorDatosProgxFecha=false;
        }

        

        /* VENTANA ELEGIR ENTRE ASIGNAR UNA O VARIAS TARJETAS A LA VEZ*/
            nroAsigTarjetas(){
                //this.mensaje="Elija el N° de Tarjetas";
                this.nroTarjetas=1; /*X DEFECTO */
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

    
    
    

}

