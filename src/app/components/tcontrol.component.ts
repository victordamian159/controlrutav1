import {Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {TControlService} from '../service/tcontrol.service';
import {RegRetenService} from '../service/registroReten.service';
import {PlacasService} from '../service/placas.service';
import {RutaService} from '../service/ruta.service';
import {PuntoControlService} from '../service/pcontrol.service'; 
import {ProgramacionService} from '../service/prog.service';
import {distribTiempoService} from '../service/distribTiempo.service';
import {RegDiarioService} from '../service/registrodiario.service';
import {DatosCompartidosService} from '../service/dataComunicationApp.service';
import {ConfiguraService} from '../service/configura.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import { BusService } from '../service/bus.service';
import {GlobalVars} from 'app/variables';

import {cCeroFechaForEditar,slash_posFecha,fechaActual2,ajustaHora,
        hora,_hora,_cCeroFecha,cCeroHora,guion_posFecha, corrigiendoHora,
        corrigiendoHoraString,fecha,_fecha1,fechaActual1,horaValida,
        editf1,horaAct,operSHoras,extFuncCorrecHora} from 'app/funciones';


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
        private displayAsignarTarjeta : boolean;
        private displayEditarTarjeta : boolean;
        private displayConfirmarEliminar : boolean;
        private displayErrorDatosProgxFecha : boolean;
        private displayNoProgEnFecha : boolean;
        private displayErrorNoHayPCModalNuevo : boolean;
        private displayHayPCModalNuevo : boolean;
        private displayNoTarjetasAsignadas : boolean;
        private displayNroTarjetas : boolean;
        private displayAsigMultiTarj : boolean;
        private displayMensajeNoRegDiario:boolean;
        private displayCuadroSalidas:boolean;
        private displayNoPuedeCrearMismaTarjeta:boolean;
        private displayTarjetaControlDetalle:boolean;
        private displayMsjEsperaGuardarTarjeta:boolean;
        private displayPasarSgteVuelta:boolean;
        private displayMnjNoPuedeCrearMulTarjEnPenultimaVuelta:boolean;
        private displayAsignarTarjetaSinProg:boolean;
        private displayAgregarPlacaSinProg:boolean;
        private displayCalRetenDP:boolean;

    /* OTRAS VARIABLES */
        private val:string;     //VALOR PARA ASIGNAR TARJETA (ASIGNADO O AUSENTE)
        private tpHoraS:string;  // TIPO ASIGNAR HORA SAL (MANUAL O AUTOMATICO)
        private actRadioButton:boolean=true;
        private nroTarjetas:number; 
        private MultiReten:string; /* TIEMPO INTERMEDIO (ASIGNAR MULTITARJETA) */
        
        private titulo : string; /*TITULO PANTALLAS */
        private tVueltaBus : string; /* TIEMPO RECORRIDO BUS */
        private timevueltadescrip:string; 
        private timevuelta:number; // SABER SI TIENE O NO UN TIEMPOSALIDA

        private mensaje : string; /*MENSAJE EN PANTALLA PARA CONFIRMAR*/
        private msjestadoplaca:string;
        private mnjNroTarjetaValido:string;
        private msjEsperaGuardando:string;
        private mensajesigvuelta:string;

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
    private placas:any[]=[]; //LISTA COMPLETA DE placas
    private _placas:any[]=[]; //LISTA SEPARADA POR FECHA, RESULTADO DE BUSQUEDA POR FECHA
    
    private _prId:number;
    private PrId:number;
    private _prDeId:number;
    private _ruId:number;
    private _pcId:number;

    //CAMPOS PARA LA CABECERA Y DETALLE 
    private _TaCoId : number;
    private  TaCoId:number;
    private _PuCoId : number;
    private _RuId : number;
    private _BuId : number;
    private _TaCoFecha : string;
    private _TaCoHoraSalida : string;
    private _TaCoCuota : number; 
    private _UsId : number;
    private _UsFechaReg : string;
    private _TaCoNroVuelta:number;
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
    private _tarjeta:any; 
    
    
    private puntoControl:{ EmId:0, PuCoClase:0, PuCoId:0, PuCoTiempoBus:"", RuDescripcion:"", RuId:0 };
    private puntosControl:any[]=[]; //PUNTOS DE CONTROL EN LA BD
    private _puntosControl:any[]=[]; //PARA TABLA PUNTOS
    private puntosControlDet :any[]=[];

     //idPunto:number = 0; //PUCOID 
     //tcontrol:any;  //RECUPERA EL OBJ Q SE GUARDA EN LA BD, CABECERA PARA SACAR LA TACOID PARA USARLO PA GUARDAR EN EL DETALLE
//OBJETO DETALLE
    private _TaCoDeId : number;
    //_UsFechaReg:string;
    //_TaCoId : number;
    private _PuCoDeId:number;
    private _TaCoDeFecha:string;
    private _TaCoDeHora:string;
    private _TaCoDeLatitud:number;
    private _TaCoDeLongitud:number;
    private _TaCoDeTiempo:string;
    private _TaCoDeDescripcion:string;
    private _tarjetaDetalle:any;    //PARA NUEVO DETALLE
    //_UsId:number;
    
    //PROGRAMACION
        private programacion:any[]=[];
        private _programacion:any[]=[];
        private progDetalle:any[]=[];
        private _progDetalle:any[]=[];
        private arrprogxfecha:any[]=[];
        private arrprogDiaLibre:any[]=[];
        private progD_BD:any[]=[];  //PROGRAMACION RECUPERADA DE LA BD
        private _progD_BD:any[]=[]; //PROGRAMACION PARA PASAR A LA GRILLA
        private _array:any[]=[];  //ARRAY COMO PARAMETRO A PROCEDIMIENTO SAVE TARJETA DETALLE 
        private selectedTarjCab:any[]=[]; /* ROW SELECCIONADOS DE DATATABLE CABECERA TARJETA */
        private selectedPlacaONE:any[]=[];
        private selectedPlacaMULTI:any[]=[];
        private selectedPlacaAddSinProg:any;
        private rutas:any=[];
        private ptsControl:any=[];
    
    // VARIABLES
        private HoraInitDiaLibre:string;
        private HoraSalidaRecEslavon:string
        private TiSaId:number;
        private TiSaObj:any;
        private selValTarjeta:any;
        private selTpHoraS:any;
        private PrDeAsignadoTarjeta:number;
        private ReDiDeNroVuelta:number;
        private ReDiTotalVuelta:number;
        private mensajeModal:string;
        private ReReTiempo:string;
        private ReDiDeId:number;
        private ReReId:number;
        private PrDeId:number;
        private estadoPlaca:number;
        private TaCoHoraSalida:string;
        private HoraLlegadaTarjAnterior:string;
        private HoraLlegadaTarjActual:string;
        private modoTarjeta:number;
        private validarTiempo:string;
        private campFormAsigUnaTarjeta: FormGroup;
        private nroMultiTarjetas:number;
        private ReDiId:number;
        private TaCoMultiple:number;
        private PrDescripcion:string;
        private CoId:number;
        private SuEmId:number;
        private HoraSalidaAnteriorDP:string;
        private HoraSalidaPlacaActualPreviewDP:string;
        private fechaApertura:string;

    //variables boolean, activar inputs de los formularios
        //una sola tarjeta
        private actInputTHora:boolean;
        private actInputReten:boolean;
        private actInputHoraSalida:boolean;
        private actInputBtnGuardar:boolean;

        private actInputHoraInitDiaLibre:boolean;

        //multitarjeta
        private actMInputPrimerReten:boolean;
        private actMInputRepeatReten:boolean;
        private actMInputHoraEslavon:boolean;

    //VARIABLES OBJETO
        private TarjetaBus_Anterior:any
        private objSelectedRowTableIndividual:any;
        private objSelectedRowTableMultiple:any;
    
    //objetos globales
        private objConfigSystem:any;

    /* VARIABLES GLOBALES*/
        private emID : number;
        private UsId:number;
        
    
    //ARRAYS
        private arrProgramaciones:any[];
        private arrValTarjeta:any[];
        private arrTpHoraS:any[];
        private arrCuadroSalidas:any[];
        private arrCuadro:any[]=[];
        private arrCuadroBusqueda:any[]=[];
        private headerTabCuadroNumber:any[]=[];
        private headerTabCuadroHoras:any[]=[];
        private arrTarjetasAsignadas:any[]=[];
        private arrTipoTarjeta:any[]=[];
        //private _tarjDetalleArray:any[]=[]; //PARA MANDARLO A LA BD
        private _allTarjetas:any[]=[]; //TODAS LAS TARJETAS PARA LA GRILLA
        private allTarjControl:any[]=[]; //BORRAR, CONSULTA PROVICIONAL PARA GRILLA CABECERA
        private _allTarjControl:any[]=[]; // REEEMPLAZAR, PARA MANDAR AL FORMULARIO
        private _allTarjDetalle:any[]=[]; //DETALLE TARJETA
        private arrSubEmp:any[]=[];
        private arrBuses:any[]=[];

    ngOnInit(){
        this.getallplacasbusbyemsuem(this.emID,0);
        this.getallprogramacionbyem(this.emID,0); //PROGRAMACION X EMP Y POR AÑO(ACLARAR ESTO)
        this.getAllRutaByEm(this.emID);
        this.getAllRegistroDiario(this.emID);
        //this.getallregistrovueltasdiariasbyemprfe(this.emID,0,slash_posFecha(fechaActual2()));
        
        this.procConsultarConfiguracionSistemaXPeriodo();
       
        //console.log(this.tarjeta._TaCoFecha);  console.log(editf1(fechaActual1()));  console.log(cCeroFechaForEditar(fechaActual2()));
        //this.deleteRegistroReten(23); no en uso //this.deleteRegistroDiarioDet(312);
    }
    
    constructor(    
        public  ClassGlobal : GlobalVars, 
        private tcontrolservice : TControlService,  
        private placaService : PlacasService, 
        private rutaService : RutaService, 
        private pcontrolService : PuntoControlService, 
        private progService : ProgramacionService,
        private disTiemservice : distribTiempoService, 
        private regdiarioService:RegDiarioService, 
        private regRetenService:RegRetenService,
        private empSubempservice : EmpSubEmpService,
        private busService: BusService,
        private router: Router, 
        private fb : FormBuilder, 
       
        public DatosGlobalService:DatosCompartidosService,
        private configService : ConfiguraService
    )
    {
        this.selValTarjeta={nomb:"", val:""};
        this.selTpHoraS={nomb:"", val:""};
        this.arrValTarjeta=[{nomb:"ASIGNAR", val:'01'},{nomb:"AUSENTE", val:'02'},{nomb:"CASTIGADO", val:'03'}];
        this.arrTpHoraS=[{nomb:"MANUAL", val:'01'},{nomb:"AUTOMATICO", val:'02'}];
        this.arrTipoTarjeta=[{nomb:'INDIVIDUAL', id:0},{nomb:'MULTIPLE',id:1}];
        this.emID=this.ClassGlobal.GetEmId();
        this.UsId=this.ClassGlobal.GetUsId();
        this.tpHoraS='x';
        this.tarjeta._UsId = this.UsId; //ARREGLAR ESTO
        this._ruId=0; /* INICIANDO RUID A CERO PARA DESACTIVAR EL BOTON ASIGNAR TARJETA */
        this.arrNTarjCabecera=[]; /*INICIANDO ARRAY A VACIO DE NUEVAS TARJETAS */
        this.TiSaObj={SuEmId:0, TiSaId:0, TiSaNombre:"", TiSaValor:""}
        this.arrCuadroSalidas=[];
        this.arrProgramaciones=[];
        this.arrCuadroBusqueda=[];
        this.estadoPlaca=-1;
        this.modoTarjeta=-1; //tarjeta modo asignado(tarjeta anterior)
        this.val='x';
        this.validarTiempo="";
        this.mnjNroTarjetaValido="";
        //this.TaCoMultiple=0; //tipo tarjeta individual(0)

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
            this.displayCuadroSalidas=false;
            this.displayNoPuedeCrearMismaTarjeta=false;
            this.displayTarjetaControlDetalle=false;
            this.displayMsjEsperaGuardarTarjeta=false;
            this.displayPasarSgteVuelta=false;
            this.displayMnjNoPuedeCrearMulTarjEnPenultimaVuelta=false;
            this.displayAsignarTarjetaSinProg=false;
            this.displayAgregarPlacaSinProg=false;
            this.displayCalRetenDP=false;

        //activar input form
            // for single tarj
                this.actInputTHora=true;
                this.actInputReten=true;
                this.actInputHoraSalida=true;
                this.actInputHoraInitDiaLibre=true;

            // for multi tarj
            this.actMInputPrimerReten=true;
            this.actMInputRepeatReten=true;
            this.actMInputHoraEslavon=true;

        //campos asignar una sola tarjeta
        this.campFormAsigUnaTarjeta=fb.group({ 
            tReten:['', Validators.required], 
            tHoraEslavon:['', Validators.required] 
        })

        this.getsubempresasbyemid(this.emID);
        this.SuEmId=null;

        this._PuCoId=0; this._prId=0; this.PrId=0; this.TaCoMultiple=-1;
        this.fechaApertura=editf1(fechaActual1());
    }

    funcFechaApertura(){
        console.log(this.fechaApertura);
    }

/* PROCEDURES */ 
    /* GETTERS */
        //consulta asignar tarjetas sin programacion
        getalltarjetacontrolbyemredide(EmId:number, reDiDe:number){
            let arrProgLibre:any[]=[];
                this.tcontrolservice.getalltarjetacontrolbyemredide(EmId, reDiDe).subscribe(
                    data => {arrProgLibre=data; this.mgProgramacionLibre(arrProgLibre);},
                    err => {this.errorMessage = err},
                    () => this.isLoading = false
                );
        }
        mgProgramacionLibre(arrProgLibre=[]){
            //arrprogLibre
            let arrprogdialibre:any[]=[];
            for(let proglibre of arrProgLibre){  
                arrprogdialibre.push({
                    TaCoId: proglibre.TaCoId,
                    RuId: proglibre.RuId,
                    ReDiDeId: proglibre.ReDiDeId,
                    TaCoAsignado: proglibre.TaCoAsignado,
                    PrId: proglibre.PrId,
                    BuId: proglibre.BuId,
                    PuCoId: proglibre.PuCoId,
                    TaCoHoraSalida: proglibre.TaCoHoraSalida,
                    UsId: proglibre.UsId,
                    PuCoTiempoBus: proglibre.PuCoTiempoBus,
                    TaCoCountMultiple: proglibre.TaCoCountMultiple,
                    TaCoFecha: proglibre.TaCoFecha,
                    UsFechaReg: proglibre.UsFechaReg,
                    TiSaId: proglibre.TiSaId,
                    TaCoTipoHoraSalida: proglibre.TaCoTipoHoraSalida,
                    TaCoFinish: proglibre.TaCoFinish,
                    TaCoMultiple: proglibre.TaCoMultiple,
                    TaCoCodEnvioMovil: proglibre.TaCoCodEnvioMovil,
                    TaCoCuota: proglibre.TaCoCuota,
                    TaCoNroVuelta: proglibre.TaCoNroVuelta,
                    BuPlaca: proglibre.BuPlaca,
                    PuCoDescripcion: proglibre.PuCoDescripcion
                })
            }
            //buscar la posicion en el array de la tabla de asignaciones de dia libre
        }
      
        procSaveTarjetaControlLibre(objTarjIndividual:any){
            this.tcontrolservice.asignarTarjetaControl(objTarjIndividual).subscribe(
                data => {console.log(data);},
                error=> {console.log(error);},
                ()  =>{}
            );
        }
        /* CONSULTA TODOS LOS BUSES POR EMPRESA Y SUBEMPRESA*/
            getallbusbyemidsuemid(emid:number, suemid:number){
                let arrBuses:any[]=[];
                this.busService.getAllBusByEmEmSu(emid, suemid).subscribe(
                    data => {arrBuses=data; this.mgBus(arrBuses);},
                    err => {this.errorMessage = err},
                    () => this.isLoading = false
                );
            }

            onRowAgregarPlacaBus(event){
                console.log(event.data);
            }

            mgBus(arrBuses=[]){
                //console.log(arrBuses);
                let _arrBuses:any[]=[];

                for(let i=0; i<arrBuses.length; i++){
                    if(arrBuses[i].BuActivo==true){
                        _arrBuses.push({
                            Nro:0,
                            BuActivo:arrBuses[i].BuActivo,
                            BuCapacidad:arrBuses[i].BuCapacidad,
                            BuDescripcion:arrBuses[i].BuDescripcion,
                            BuFechaIngreso:arrBuses[i].BuFechaIngreso,
                            BuId:arrBuses[i].BuId,
                            BuMarca:arrBuses[i].BuMarca,
                            BuPlaca:arrBuses[i].BuPlaca,
                            SuEmId:arrBuses[i].SuEmId,
                            SuEmRSocial:arrBuses[i].SuEmRSocial,
                        })
                    }
                }
                for(let i=0; i<_arrBuses.length; i++){
                    _arrBuses[i].Nro=i+1;
                }
                this.arrBuses=_arrBuses;
            }

        /* GET ALL SUBEMPRESAS POR EMID */
            getsubempresasbyemid(emid:number){
                let subemps:any[]=[];
                this.empSubempservice.getallsubempresasbyemid(emid).subscribe(
                    data => { subemps=data; this.mgsubempresas(subemps);},
                    err => {this.errorMessage=err},
                );
            }
            mgsubempresas(subemp=[]){
                let _subemp:any[]=[];
                for(let sub of subemp){
                    _subemp.push({
                        EmId:sub.EmId,
                        SuEmActivo:sub.SuEmActivo,
                        SuEmDireccion:sub.SuEmDireccion,
                        SuEmEmail:sub.SuEmEmail,
                        SuEmId:sub.SuEmId,
                        SuEmRSocial:sub.SuEmRSocial,
                        SuEmRuc:sub.SuEmRuc,
                        SuEmTelefono:sub.SuEmTelefono,
                        SuEmTiempoVuelta:sub.SuEmTiempoVuelta,
                        SuEmUbigeo:sub.SuEmUbigeo,
                        UsFechaReg:sub.UsFechaReg,
                        UsId:sub.UsId
                    })
                }
                this.arrSubEmp=_subemp;
            }

            funcCboSuEmId(){
                console.log(this.SuEmId);
                this.getallbusbyemidsuemid(this.emID, this.SuEmId);
            }

         //consulta por periodos
         procConsultarConfiguracionSistemaXPeriodo(){

            let añoActual=new Date().getFullYear().toString(), EmId=this.emID;
            //console.log(añoActual); console.log(EmId);
            this.configService.getAllConfiguraByEmPeriodo(EmId , añoActual).subscribe(
            data=>{
                    console.log(data); 
                    if(data.length!=0){
                      this.objConfigSystem=data[0];
                      this.CoId=this.objConfigSystem.CoId;
                    }else{
                        alert('Error, no se pudo descargar la configuracion del sistema');
                    }
                    
                  },
            error=>{alert('error al iniciar el periodo: '+error);},
            ()=>{}
            );
        }

        //tarjetas de control por fecha  GRILLA PRINCIPAL
        _getalltarjetacontrolbybuidfecha(buId:number, TaCoFecha:string){
            let arrTarjetasCreadas:any[]=[];
            let PuCoId:number=0;

            this.tcontrolservice.getalltarjetacontrolbybuidfecha(buId, TaCoFecha).subscribe(
                data=>{ //console.log(data); 
                        //this.arrTarjetasAsignadas=data;
                        arrTarjetasCreadas=data;
                        if(arrTarjetasCreadas.length!=0){
                            this.mgTarjetasControl(arrTarjetasCreadas);
                            //buscar y recuperar en q puntos de control esta actualmente
                            
                            /*PuCoId=this.funcPuntoControlFijoXVuelta(arrTarjetasCreadas);
                            if(PuCoId!=-1){
                                this.puntoControl=PuCoId;
                            }*/
                        }else if(arrTarjetasCreadas.length==0){
                            alert('No hay tarjetas creadas');
                            this._allTarjControl=[];
                        }
                      },
                erro=>{alert(erro+'error al hacer la consulta')},
                () => {}
            )
        }

        //tarjetas de control por fecha
        getalltarjetacontrolbybuidfecha(buId:number, TaCoFecha:string){
            this.tcontrolservice.getalltarjetacontrolbybuidfecha(buId, TaCoFecha).subscribe(
                data=>{ //console.log(data); 
                        this.arrTarjetasAsignadas=data;
                      },
                erro=>{alert(erro+'error al hacer la consulta')},
                () => {}
            )
        }

        //cuadro de salidas, consulta para sacar el cuadro grande de todas las salidas del dia
        getallregistrovueltasdiariasbyemprfe(emid:number, prid:number, fecha:string){
            let arrCuadro:any[]=[];
            this.tcontrolservice.getallregistrovueltasdiariasbyemprfe(emid,prid,fecha).subscribe(
                data => {
                            arrCuadro=data;
                            //console.log(arrCuadro);
                            if(arrCuadro.length!=0 && arrCuadro.length>0){
                                this.arrCuadro=arrCuadro;
                                this.arrCuadroBusqueda=arrCuadro; //para la busqueda y validacion de reten
                            }else{
                                console.log('Error la descarga del cuadro de salidas, vuelva a intentarlo');
                            }
                        },
                error=> {alert('Error en el cuadro de salidas, vuelva a intentarlo');},
                ()   => {}
            );
        }
        
        //tarjeta individual, refrescar la tabla de formulario asignar tarjeta
        actualizargetallregistrovueltasdiariasbyemprfeINDIVIDUAL(emid:number, prid:number, fecha:string, sigVuelta:number){
            let arrCuadro:any[]=[];
            let index:number;
            this.tcontrolservice.getallregistrovueltasdiariasbyemprfe(emid,prid,fecha).subscribe(
                data => {
                            arrCuadro=data;  //console.log(arrCuadro);
                            if(arrCuadro.length!=0 && arrCuadro.length>0){                                         
                                this.estadoPlaca=-1; //no hay placa seleccionada de la tabla
                                this.arrCuadro=arrCuadro;  
                                this.ReReTiempo=null; 
                                this.arrCuadroBusqueda=arrCuadro; //para la busqueda y validacion de reten
                                this.msjEsperaGuardando=''; 
                                this.displayMsjEsperaGuardarTarjeta=false;
                                //console.log('sigVuelta: '+sigVuelta);

                                if(sigVuelta==1){ //si fuera la ultima vuelta
                                    this.ReDiDeNroVuelta++; //pasando a la sgte vuelta
                                    this.ReDiDeId++;     //pasando a la sgte vuelta
                                    this.concatenarRegDiarioProgxFecha(this.mgprogDetalle(this.progDetalle), this.extraRegistroDiario(this.arrCuadro));

                                    //la ultima tarjeta de la ultima vuelta
                                    if(this.ReDiDeNroVuelta>this.ReDiTotalVuelta){
                                        this.ReDiDeNroVuelta--; this.ReDiDeId--;
                                        alert('se termino todas las vueltas');
                                        this.arrprogxfecha=[];
                                    }else if(this.ReDiDeNroVuelta<this.ReDiTotalVuelta){
                                        this.mensajesigvuelta='Termino la vuelta, pasando a la siguiente';  
                                        this.displayPasarSgteVuelta=true;                                           
                                    }

                                //no es la ultima vuelta
                                }else{                                    
                                    this.concatenarRegDiarioProgxFecha(this.mgprogDetalle(this.progDetalle), this.extraRegistroDiario(this.arrCuadro));   
                                    //voliendo a seleccionar el row datatable individual tarject
                                    index=this.buscarObjetoTablaIndividual(this.arrprogxfecha, this.objSelectedRowTableIndividual);
                                    this.selectedPlacaONE=this.arrprogxfecha[index];                                    
                                }                         
                            }else{
                                
                            }
                        },
                error=> {alert('Error en el cuadro de salidas, vuelva a intentarlo');},
                ()   => {}
            );
        }

        //tarjeta individual, refrescar la tabla de formulario asignar tarjeta
        actualizargetallregistrovueltasdiariasbyemprfeMULTIPLE(emid:number, prid:number, fecha:string){
            let arrCuadro:any[]=[];
            let index:number;
            this.tcontrolservice.getallregistrovueltasdiariasbyemprfe(emid,prid,fecha).subscribe(
                data => {
                            arrCuadro=data;  
                            if(arrCuadro.length!=0 && arrCuadro.length>0){                 
                                this.arrCuadro=arrCuadro;
                                this.arrCuadroBusqueda=arrCuadro; //para la busqueda y validacion de reten
                                this.concatenarRegDiarioProgxFecha(this.mgprogDetalle(this.progDetalle), this.extraRegistroDiario(this.arrCuadro));
                               
                                this.msjEsperaGuardando='';
                                this.displayMsjEsperaGuardarTarjeta=false;

                                //voliendo a seleccionar el row datatable multiple tarject
                                index=this.buscarObjetoTablaIndividual(this.arrprogxfecha, this.objSelectedRowTableMultiple);
                                this.selectedPlacaMULTI=this.arrprogxfecha[index];
                                this.estadoPlaca=-1; //no hay placa seleccionada de la tabla
                            }else{
                                
                            }
                        },
                error=> {alert('Error en el cuadro de salidas, vuelva a intentarlo');},
                ()   => {}
            );
        }
        
        getAllRegistroDiarioDetalle(ReDiId:number){
            let arrRegDet:any[]=[];
            this.regdiarioService.getAllregistrodiarioDetalleByPrId(ReDiId).subscribe(
                data => {   
                            arrRegDet=data; 
                            if(this.buscarRegDiarioDetalleActual(arrRegDet).ReDiDeNroVuelta!=-1){
                                this.mRegistroDiarioDetalle(this.buscarRegDiarioDetalleActual(arrRegDet));
                            }else if(this.buscarRegDiarioDetalleActual(arrRegDet).ReDiDeNroVuelta==-1){
                                console.log("No se encontro");
                            }
                        },
                error=> {console.log(error);}
            );
        }

        getAllRegDiarioDetalle(ReDiId:number){
            let arrRegDet:any[]=[];
            this.regdiarioService.getAllregistrodiarioDetalleByPrId(ReDiId).subscribe(
                data => { arrRegDet=data; 
                            //console.log(arrRegDet);
                            if(arrRegDet.length!=0){
                                this.actualizarVariables(arrRegDet);
                            }else{
                                alert('No se puedo actualizar las variables');
                            }
                            
                        },
                error=> {console.log(error);}
            );
        }
        //REGISTRO DIARIO DE VUELTAS
            getAllRegistroDiario(emId:number){
                let regDir:any[]=[];
                this.regdiarioService.getAllRegistroDiarionByemId(emId).subscribe(
                    data=>{
                                regDir=data; 
                                //console.log(regDir); 
                                this.mRegistroDiario(regDir);
                          },
                    err=>{console.log(err);}
                );
            }

        // todos los retenes por redideid
        // GET REGISTRO RETEN   /registroreten/getallregistroretenbyredide",params = {"reDiDeId"}
            getAllRegistroRetenByredide(reDiDeId:number){
                let regReten:any[]=[];
                this.regRetenService.getAllRegistroRetenByemId(reDiDeId).subscribe(
                    data=>{
                            regReten=data; 
                            //console.log(regReten);
                          },
                    err=>{console.log(err);}
                );
            }
            deleteRegistroReten(ReReId:number){
                this.regRetenService.deleteregistroRetenByid(ReReId).subscribe(
                    data=>{console.log(data);},
                    erro=>{console.log(erro);},
                    ()=>{}
                );
            }
            deleteRegistroDiarioDet(reDiDeId:number){
                this.regdiarioService.deleteregistrodiarioDetalleByPrId(reDiDeId).subscribe(
                    data=>{console.log(data);},
                    erro=>{console.log(erro);},
                    ()=>{}
                )
            }
            getRegistroRetenById(ReReId:number){
                this.regRetenService.getRegistroRetenById(ReReId).subscribe(
                    data => { console.log(data);},
                    err  => {this.errorMessage = err; console.log(err);}, 
                    ()   => this.isLoading = false
                );
            }

        // CONSULTAR TODAS LAS RUTAS EXISTENTES 
            getAllRutaByEm(emId: number){
                this.rutaService.getAllRutaByEm(emId).subscribe(
                    data => { this.rutas = data;},
                    err  => {this.errorMessage = err}, 
                    ()   => this.isLoading = false
                );
            }

        // CONSULTAR TODOS LOS PUNTOS DE CONTROL EXISTENTES 
            getAllPControlBy(emId: number, ruId:number){
                this.pcontrolService.getAllPuntoControlByEmRu(emId, ruId).subscribe(
                    data => {
                                /*this.ptsControl = data; 
                                this.puntosControl= this.ptsControl;*/
                                this.puntosControl= data;
                                this.mgPuntosControl();

                            },
                    err  => {this.errorMessage = err; alert('Error al cargar los puntos de control validos');},
                    ()   => this.isLoading = false
                );
            }
        
        //CONSULTAR PROGRAMACION CABECERA, PARA OBTENER EL PRID NECESARIO PARA SACAR EL DETALLE
            getallprogramacionbyem(emId:number, anio: number){
                let arrProg:any[]=[];
                this.tcontrolservice.getAllProgramacionByEm(emId, anio).subscribe(
                    data => {
                                this.programacion=data; arrProg=data;
                                this.getallregistrovueltasdiariasbyemprfe(this.emID,arrProg[0].prId,slash_posFecha(fechaActual2()));
                                this.mcobprogramacion(arrProg);
                            },
                    error=>{console.log(error); alert('Error al Iniciar la lista de programaciones validas');} ,
                    () => {}
                );
            }
            
        //CONSULTA PROG DETALLE PROGRAMACIONDETALLE(X FECHA)
            getallprogramacionbydate(PrId:number, fecha: string, nroTarjetas:number){
                this.progDetalle=[];
                this.tcontrolservice.getAllProgramacionDetalleByPrFecha(PrId, fecha).subscribe(
                    data => {  this.progDetalle=data;
                                if(this.progDetalle.length>0 ){
                                    //this.mgCuadroSalidas(this.ReDiTotalVuelta, this.progDetalle.length);
                                    this.concatenarRegDiarioProgxFecha(this.mgprogDetalle(this.progDetalle), this.extraRegistroDiario(this.arrCuadro));
                                    this.nuevaAsignaTarjeta();
                                }else if(this.progDetalle.length==0 ){
                                    this.mensaje="No hay programacion en la fecha indicada";
                                    this.displayNoProgEnFecha = true;
                                }
                            },
                        error=>{alert('Error al buscar la programacion por fecha, vuelta a intentarlo');}
                );
            }

        //CONSULTA RECUPERAR PLACAS
            getallplacasbusbyemsuem(emId : number, suemId : number){
                let arrplacas:any[]=[];
                this.placaService.getAllPlacasBusByEmSuEm(emId,suemId).subscribe(
                    data => { arrplacas=data; this.mgplacas(arrplacas);},
                    error=>{console.log(error); alert('Error al descargar la placas, vuelta a intentarlo');},
                    ()=>{}
                );
            }
            mgplacas(arrPlacas=[]){
                let _arrPlacas:any[]=[];
                this.placas=arrPlacas;
                return _arrPlacas;
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
                                        //console.log(this.tarjeta);
                                        this.displayEditarTarjeta=true;
                                    },
                            err => {this.errorMessage=err},
                                () => this.isLoading=false
                );
            }

        /* GET ALL TARJCTRLDET BY TACOID */
            procgetAllTarjCtrlDetBytaCoId(taCoId:number){
                let tarjDet:any[]=[];
                this.tcontrolservice.getAllTarjetaControlDetalleBytaCoId(taCoId).subscribe(
                    data => { 
                                tarjDet = data; 
                                if(tarjDet.length!=0){
                                    this.mgTarjetaDetalle(tarjDet);
                                    this.displayTarjetaControlDetalle=true;
                                }else{
                                    alert('No hay tarjeta de control creada');
                                }
                            },
                    error=>{alert('No se pudo encontrar el detalle');}
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
                            //console.log(data); 
                            this.ReReId=objReten.ReReId;
                            this.ReReTiempo=objReten.ReReTiempo;
                          },
                    error=>{console.log(error);}
                );
            }

        /* PROCEDURE ELIMINAR REGISTRO*/
            procDeleteTarjetaControl(TaCoId:number){
                /**/
                this.tcontrolservice.deleteTarjetaControl(TaCoId).subscribe(
                realizar =>{
                                //this.getalltarjetasbyemidpucoid(this.emID,this._pcId);
                                //this.getalltarjetacontrolbybuidfecha(0,cCeroFechaForEditar(fechaActual2()));
                                this._getalltarjetacontrolbybuidfecha(0,cCeroFechaForEditar(fechaActual2()));
                            },
                err => {console.log(err);}
                );
            }

        /* NO ASIGNADO VAL=0 , ASIGNADO VAL=1 */ /* AUSENTE VAL=2 */
        /* PROCEDURE ACTUALIZAR PROGRAMACIONDETALLE */
            updateProgDetalle(progUpdate : Object[]){
                this.tcontrolservice.actualizarProgDetalleAusente(progUpdate).subscribe
                                    (data => {
                                                this.borrarObjetos();
                                            }, 
                                    err => {this.errorMessage=err});
            }

        /*UNA SOLA TARJETA*/
            procAsigTarjCtrl(_tarjeta:any){
                console.log(_tarjeta);
                let sigVuelta:number;
                /* PROCEDURE ASIGNAR TARJETA (UNA SOLA) */
                this.tcontrolservice.asignarTarjetaControl(_tarjeta).subscribe(
                    data => {   
                                if(data==true){
                                    sigVuelta= this.buscarUltimaPlacaProgr(this.objSelectedRowTableIndividual, this.arrprogxfecha);                              
                                    this.actualizargetallregistrovueltasdiariasbyemprfeINDIVIDUAL(this.emID,this._prId,slash_posFecha(fechaActual2()), sigVuelta);
                                }                               
                            }, 
                    err  => {this.errorMessage=err}
                );
            }
            aceptarPasarSgteVuelta(){
                this.mensajesigvuelta='';
                this.displayPasarSgteVuelta=false;
            }
        /*VARIAS TARJETAS*/
            procAsigMultiTarjetas(tarjetaInicial:any,reten1:Date, reten2:Date){
                let index:number;
                //console.log(tarjetaInicial,reten1,reten2);
                this.tcontrolservice.asignarTarjetaMultiple(tarjetaInicial,reten1,reten2).subscribe(
                    data=>  {
                                //console.log(data);
                                if(data==true){                                    
                                    this.actualizargetallregistrovueltasdiariasbyemprfeMULTIPLE(this.emID,this._prId,slash_posFecha(fechaActual2()));
                                }else if(data==false){
                                    alert('no se pudo crear las tarjetas :c');
                                }
                            },
                    error=>{alert('no se pudo crear la multitarjeta'); console.log(error);},
                    ()=>{}
                );
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
                                //his.tpHoraS='01';
                                this.TiSaId=this._tarjeta.TiSaId;

                        }
            );
        }

    /* MOSTRAR DATOS */
        //extraer datos de tarjetas asignadas
        mTarjetasAsignadas(arrTarjAsignadas=[]){
            return arrTarjAsignadas;
        }

        //iniciando cuadro de salidas
            mgCuadroSalidas(nroVueltas:number, nroPlacasProg:number){
              
                let arrCuadroSalida:any[]=[]; let matrizSalidas:any[]=[]; let headerTabCuadro:any[]=[]; let headerNomColumns:any[]=[];

                for(let i=0; i<nroPlacasProg; i++){    
                    //arrCuadroSalida[i]=["00:00:00","00:00:00","00:00:00","00:00:00"]
                    arrCuadroSalida[i]=["________","________","__:__:__","__:__:__","__:__:__","__:__:__"]
                }   
                for(let i=0; i<nroVueltas; i++){
                    matrizSalidas[i]=arrCuadroSalida;
                }
                return matrizSalidas;
            }

            //adaptar a tabla de cuadro salidas
            matCuadroSalidas(arrCuadroSalida=[]){
                let matCuadro:any[]=[];
                return matCuadro;
            }

        //COMBO PROGRAMACION CABECERA (CARGA ARRAY PARA MOSTRAR OPCIONES EN EL COMBOBOX)
            mcobprogramacion(arrProgramacion=[]){
                this._programacion=[];
                let arrProg=[];
                for(let prog of arrProgramacion){
                    arrProg.push({
                        EmConsorcio:prog.EmConsorcio,
                        PrAleatorio:prog.PrAleatorio,
                        PrCantidadBuses:prog.PrCantidadBuses,
                        PrFecha:_fecha1(prog.PrFecha),
                        PrFechaFin:_fecha1(prog.PrFechaFin),
                        PrFechaInicio:_fecha1(prog.PrFechaInicio),
                        PrTipo:prog.PrTipo,
                        dias:prog.dias,
                        //PrDescripcion:prog.prDescripcion.substr(0,4) +" de "+_fecha1(prog.PrFechaInicio)+" a  "+_fecha1(prog.PrFechaFin) ,
                        PrDescripcion:_fecha1(prog.PrFechaInicio)+" a  "+_fecha1(prog.PrFechaFin) ,
                        PrId:prog.prId
                    });
                }
                this.arrProgramaciones=arrProg;
            }
            
        //cuadro de registro diario
            extraRegistroDiario(arrregdiario=[]){
                let arrreg:any[]=[];
                for(let reg of arrregdiario){
                    arrreg.push({
                        TaCoId:reg.TaCoId,
                        TaCoHoraSalida:reg.TaCoHoraSalida,
                        //PrDeOrden:reg.PrDeOrden,
                        ReDiId:reg.ReDiId,
                        ReDiDeId:reg.ReDiDeId,
                        ReReId:reg.ReReId,
                        BuId:reg.BuId,
                        PrDeId:reg.PrDeId,
                        TaCoAsignado:reg.TaCoAsignado,
                        BuPlaca:reg.BuPlaca,
                        ReDiDeNroVuelta:reg.ReDiDeNroVuelta,
                        HoraLlegada:reg.HoraLlegada,
                        ReReTiempo:reg.ReReTiempo,
                        PuCoTiempoBus:reg.PuCoTiempoBus                        
                    });
                      
                }
                //console.log(arrreg);
                return arrreg;
            }
        //GRILLA PROGRAMACION DETALLE  -  POR LA FECHA
            mgprogDetalle(arrProg=[]){ 
                //console.log(arrProg);
                this._progDetalle=[];  let _arrProg:any[]=[]; let programacion=[]; 
                programacion=this.cambianBuIdxNroPlaca(arrProg, this.placas);

                for(let progD of programacion){
                    _arrProg[progD.PrDeOrden-1]={
                        nro:0,
                        BuId:progD.BuId,
                        nroPlaca:progD.nroPlaca,
                        PrId:progD.PrId,
                        PrDeOrden:progD.PrDeOrden,
                        PrDeHoraBase:progD.PrDeHoraBase,
                        PrDeId:progD.PrDeId,
                        PrDeAsignadoTarjeta:progD.PrDeAsignadoTarjeta,
                        _PrDeAsignadoTarjeta:"x",
                        SuEmRSocial:progD.SuEmRSocial,
                        BuDescripcion:progD.BuDescripcion,
                        PrDeCountVuelta:progD.PrDeCountVuelta
                    }
                }
                
               //console.log(_arrProg);
                for(let k=0; k<_arrProg.length;k++){ 
                    _arrProg[k].nro=k+1; 
                    if(_arrProg[k].PrDeAsignadoTarjeta==1){
                        _arrProg[k]._PrDeAsignadoTarjeta="SI";
                    }else if(_arrProg[k].PrDeAsignadoTarjeta==0){
                        _arrProg[k]._PrDeAsignadoTarjeta="NO";
                    }
                }
                return _arrProg;
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
            mgTarjetasControl(arrTarjetasControl=[]){
                this._allTarjControl = [];
                //console.log(arrTarjetasControl);
                let j:number=0, k:number=0, cen:number=0, _arrTarjetasControl:any[]=[];

                //TARJETAS EXISTENTES
                for(let TarjControl of arrTarjetasControl){
                    _arrTarjetasControl.push({
                        Nro:0,
                        TaCoId: TarjControl.TaCoId,
                        UsFechaReg: TarjControl.UsFechaReg,
                        RuId: TarjControl.RuId,
                        ReDiDeId: TarjControl.ReDiDeId,
                        TaCoAsignado: TarjControl.TaCoAsignado,
                        PrId: TarjControl.PrId,
                        BuId: TarjControl.BuId,
                        PuCoId: TarjControl.PuCoId,
                        TaCoHoraSalida:_hora(TarjControl.TaCoHoraSalida),
                        UsId: TarjControl.UsId,
                        TaCoCountMultiple: TarjControl.TaCoCountMultiple,
                        TaCoFecha: _fecha1(TarjControl.TaCoFecha),
                        TaCoNroVuelta: TarjControl.TaCoNroVuelta,
                        TiSaId: TarjControl.TiSaId,
                        TaCoTipoHoraSalida: TarjControl.TaCoTipoHoraSalida,
                        TaCoFinish: TarjControl.TaCoFinish,
                        TaCoMultiple: TarjControl.TaCoMultiple,
                        TaCoCodEnvioMovil: TarjControl.TaCoCodEnvioMovil,
                        TaCoCuota: TarjControl.TaCoCuota,
                        BuPlaca: TarjControl.BuPlaca,
                        PuCoDescripcion: TarjControl.PuCoDescripcion,
                        PuCoTiempoBus: _hora(TarjControl.PuCoTiempoBus),

                        NomPuntosControl:'',
                        NomTaCoFinish:"",
                        NomTaCoAsignado:"",
                        NomTaCoMultiple:"",
                        NomTaCoNroVuelta:'',
                    });
                }
                
                //AGREGANDO CAMPOS ADICIONALES AL ARRAY, CAMBIANDO IDS POR SU DESCRIPCION
                for(let i=0; i<_arrTarjetasControl.length; i++){
                    _arrTarjetasControl[i].Nro = i+1;
                    if(_arrTarjetasControl[i].TaCoFinish==true){
                        _arrTarjetasControl[i].NomTaCoFinish='Si';
                    }else if(_arrTarjetasControl[i].TaCoFinish==false){
                        _arrTarjetasControl[i].NomTaCoFinish='No';
                    }

                    if(_arrTarjetasControl[i].TaCoAsignado==1){
                        _arrTarjetasControl[i].NomTaCoAsignado='Asignado';
                    }else if(_arrTarjetasControl[i].TaCoAsignado==2){
                        _arrTarjetasControl[i].NomTaCoAsignado='Ausente';
                    }else if(_arrTarjetasControl[i].TaCoAsignado==3){
                        _arrTarjetasControl[i].NomTaCoAsignado='Castigado';
                    }

                    if(_arrTarjetasControl[i].TaCoMultiple==0){
                        _arrTarjetasControl[i].NomTaCoMultiple='Individual'
                    }else if(_arrTarjetasControl[i].TaCoMultiple==1){
                        _arrTarjetasControl[i].NomTaCoMultiple='Multiple'
                    }
                    _arrTarjetasControl[i].NomPuntosControl=_arrTarjetasControl[i].PuCoDescripcion+' / '+_arrTarjetasControl[i].PuCoTiempoBus,
                    _arrTarjetasControl[i].NomTaCoNroVuelta=(_arrTarjetasControl[i].TaCoNroVuelta).toString()+'v';
                }
                //console.log(_arrTarjetasControl);
                this._allTarjControl=_arrTarjetasControl;
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
                this.ReDiId=this.buscarRegDiarioActual(arrReg).ReDiId;

                ReDiTotalVuelta=this.buscarRegDiarioActual(arrReg).ReDiTotalVuelta;
                //console.log(ReDiId); console.log(ReDiTotalVuelta); console.log(fechaActual2());

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
                //console.log(this.ReDiDeNroVuelta);
                //console.log(this.ReDiDeId);
                this.getAllRegistroRetenByredide(objRegDet.ReDiDeId);
            }

/* FUNCIONES */
    // FUNCIONES CONFIRMAR
        aceptarNoRegDiario(){
            this.displayMensajeNoRegDiario=false;
            this.router.navigate(['/regdiario']);
        }


    // FUNCIONES BUSQUEDA
       
        //buscarEstadoTarjeta, BUSCANDO VALOR DE TARJETA ANTERIOR A LA TARJETA SELECIONADA(TABLA INDIVIDUAL)
        buscarHoraSalidaAnterior(placa:string){
            let objSalidaAnterior:any;
            objSalidaAnterior=this.funcBuscarHoraSalidaAnterior(this.arrCuadroBusqueda, this.ReDiDeNroVuelta,placa);
            console.log(objSalidaAnterior);
            
            this.HoraSalidaAnteriorDP=_hora(objSalidaAnterior.TaCoHoraSalida);
        }

        funcBuscarHoraSalidaAnterior(arrCuadro=[], ReDiDeNroVuelta:number,Placa:string):any{
            //console.log(arrCuadro); console.log(ReDiDeNroVuelta); console.log(Placa);
            let i:number=0, cen:number=0;
            while(i<arrCuadro.length && cen==0){
                if(arrCuadro[i].ReDiDeNroVuelta==ReDiDeNroVuelta && arrCuadro[i].BuPlaca==Placa ){
                    cen=1;
                }else{
                    cen=0;
                    i++;
                }
            }
            //console.log('i: '+i); //console.log(arrCuadro[i-1]);
            return arrCuadro[i-1]
        }

        buscarRegDiarioActual(arrReg=[]){
            let ReDiId:any;
            let i:number=0, cen:boolean=false;
            //console.log(_fecha1(arrReg[1].ReDiFeha));   console.log(fechaActual2());  
            while(i<arrReg.length && cen==false){
                if(_fecha1(arrReg[i].ReDiFeha)===fechaActual2()){
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
            //objReturn=arrRegDet[0];
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
              
            }
            return objReturn;
        }
    /* FUNCIONES ONROWSELECT ASOCIADAS A FILAS DE DATATABLES */
            /* SELECCIONAR REGISTRO TARJETA CONTROL (CABECERA- GRILLA)*/
                onRowSelectCabecera(event){
                   // this.tarjeta._TaCoId=0; 
                    this.tarjeta._TaCoId = event.data.TaCoId; /* ACTUALIZA EL CAMPO PARA PODER USARLO SI ES CASO SE QUIERA EDITAR EL REGISTRO */ 
                    this.TaCoId=event.data.TaCoId;
                    //console.log(this.TaCoId);
                    this.procgetAllTarjCtrlDetBytaCoId(this.TaCoId);
                }

            // SELECCIONAR PLACA DE SORTEO (LISTA DE PLACAS DE SORTEO) 
                onRowPlaca(event){    
                    let TarjetaBus_Anterior:any;  
                    let BuPlaca:string=event.data.BuPlaca;
                    this.objSelectedRowTableIndividual=event.data;
                    this.objSelectedRowTableMultiple=event.data;
                    this._prDeId = event.data.PrDeId;
                    this._BuId=event.data.BuId;                    
                    this._TaCoNroVuelta=event.data.PrDeCountVuelta;  
                    this.PrDeAsignadoTarjeta=event.data.PrDeAsignadoTarjeta; 
                    this.estadoPlaca=event.data.TaCoAsignado;   
                    this.TaCoHoraSalida=event.data.TaCoHoraSalida;
                    this.HoraLlegadaTarjActual=event.data.HoraLlegada;
                    let nroRow=event.data.nro;
                 
                    if(this.ReDiDeNroVuelta>1){
                        this.buscarHoraSalidaAnterior(BuPlaca);
                        this.TarjetaBus_Anterior=this.estadoTarjetaAnterior(this.extraRegistroDiario(this.arrCuadro), this.ReDiDeNroVuelta, this._BuId);
                        if(this.TarjetaBus_Anterior.TaCoAsignado=='1'){
                            this.modoTarjeta=0; //cuando la anterior tarjcontrol es asignado        FORMULARIO ADAPTADO
                           
                        }else if(this.TarjetaBus_Anterior.TaCoAsignado=='2' || this.TarjetaBus_Anterior.TaCoAsignado=='3'){
                            this.modoTarjeta=1; //cuando la anterior tarjcontrol es ausente o castiga   FORMULARIO ADAPTADO 
                        }

                        this.HoraLlegadaTarjAnterior=_hora(this.TarjetaBus_Anterior.HoraLlegada); // para la segunda vuelta a más
                        //inputs formulario una sola tarjeta
                        //console.log(this.HoraLlegadaTarjAnterior);
                    }else if(this.ReDiDeNroVuelta==1){
                        if(nroRow>1){
                            this.buscarHoraSalidaAnterior(BuPlaca);
                        }
                        
                        this.modoTarjeta=2;

                    }

                    //activando o desactivando input segun el estado de la placa
                    if(this.estadoPlaca==0){
                        if(this.nroTarjetas==1){
                            this.ftnActivarInputFormUnaTarjeta(this.ReDiDeNroVuelta, this.modoTarjeta, this.val);
                        }else if(this.nroTarjetas>1){
                            this.ftnActivarInputFormMultiplesTarjeta(this.ReDiDeNroVuelta, this.modoTarjeta, this.estadoPlaca, this.val);
                        }
                    }else if(this.estadoPlaca==1 || this.estadoPlaca==2 || this.estadoPlaca==3){
                        this.ftnActivarInputFormMultiplesTarjeta(this.ReDiDeNroVuelta, this.modoTarjeta, this.estadoPlaca, this.val);
                    }

                    //mensaje nro maximo de tarjetas a crear
                    if(this.estadoPlaca==0){
                        this.nroMultiTarjetas=this.nroTarjetas;
                    }else if(this.estadoPlaca==1 || this.estadoPlaca==2 || this.estadoPlaca==3){
                        this.nroMultiTarjetas=this.nroTarjetas-1;
                    }
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
            funcCboRutaId(event:Event){
                //console.log(this._ruId);
                this.getAllPControlBy(this.emID,this._ruId);
                this._getalltarjetacontrolbybuidfecha(0,cCeroFechaForEditar(fechaActual2()));
            }

            funcCboTipoTarjeta(){
                //multiple
                if(this.TaCoMultiple==1){

                    //no permitir que se cree tarjetas desde la primera vuelta
                    if(this.ReDiDeNroVuelta==1 && (this.ReDiTotalVuelta-this.ReDiDeNroVuelta<2 )){
                        alert('no se puede crear tarjeta multiple desde la primera vuelta');
                        this.TaCoMultiple=-1;
                    }else {
                        this.nroTarjetas=this.ReDiTotalVuelta-this.ReDiDeNroVuelta+1;
                        this.procNewRegistroReten();
                        //input horas para multiples tarjeta
                        this.actMInputPrimerReten=true; this.actMInputRepeatReten=true;  this.actMInputHoraEslavon=true;
                        this.mensaje="";    this.estadoPlaca=-1;  this.mnjNroTarjetaValido="";
                        
                        this.tcontrolservice.getallregistrovueltasdiariasbyemprfe(this.emID,this._prId,cCeroFechaForEditar(fechaActual2()))
                        .subscribe(
                            data=>{
                                console.log(data);
                                this.getalltarjetacontrolbybuidfecha(0,cCeroFechaForEditar(fechaActual2())); //grilla principal :s
                                this.getallprogramacionbydate(this._prId,guion_posFecha(editf1(fechaActual1())), this.nroTarjetas); // tabla programacion
                            },
                            erro=>{
                                alert('error al verificar si existe tarjetas individuales');
                            }
                        );

                        
                    }
                    
                //individual
                }else if(this.TaCoMultiple==0){
                    this.nroTarjetas=1;
                    this.procNewRegistroReten();
                    //input horas para una sola tarjeta
                    this.actInputTHora=true;
                    this.actInputReten=true;
                    this.actInputHoraSalida=true;
                    this.mensaje="";  
                    this.estadoPlaca=-1;
                    this.mnjNroTarjetaValido="";
                    
                    this.getalltarjetacontrolbybuidfecha(0,cCeroFechaForEditar(fechaActual2())); //grilla principal :s
                    this.getallprogramacionbydate(this._prId,guion_posFecha(editf1(fechaActual1())), this.nroTarjetas); // tabla programacion
                }
            }

            //buscar el nombre de la programacion en funcionamiento
            mostrarNombreProgramacion(PrId:number, arrProgramas=[]):string{
                console.log(PrId); console.log(arrProgramas);
                let i:number=0, cen:number=0;
                while(i<arrProgramas.length && cen==0){
                    if(arrProgramas[i].PrId!=PrId){
                        i++; cen=0;
                    }else if(arrProgramas[i].PrId==PrId){
                        cen=1;
                    }
                }
                if(cen==1){
                    return arrProgramas[i].PrDescripcion;
                }else if(cen==0){
                    return '-1';
                }
            }

            /*SELECCIONAR PUNTOS DE CONTROL DEL COMBOBOX,  FORMULARIOS DE ASIGNAR TARJETA */
            funcCboPuntosControlId(event:Event){
                this.getallplacasbusbyemsuem(this.emID,0); //inciando las placas de la programacion
                //variables
                let PuCoId = this.puntoControl.PuCoId; let ruID = this.puntoControl.RuId;
                this.tVueltaBus=this.puntoControl.PuCoTiempoBus;   //tiempo total vuelta a la ruta
                this.selectedPlacaONE=[]; this.selectedPlacaMULTI=[];
              
                /* ID ULTIMA PROGRAMACION  - esto tiene que cambiar por la variable global*/
                //quitar esta parte, sustituirlo por algo mas comodo
                this._prId=this.arrProgramaciones[this.arrProgramaciones.length-1].PrId; this.PrId=this.arrProgramaciones[this.arrProgramaciones.length-1].PrId;
                
                //this.PrDescripcion=this.mostrarNombreProgramacion(this.PrId, this.arrProgramaciones);
                this.PrDescripcion=editf1(fechaActual1());

                //cuadro para la visuacion de todas las salidas
                this.getallregistrovueltasdiariasbyemprfe(this.emID,this._prId,slash_posFecha(fechaActual2()));
               
                //buscando redediid 
                if(this.ReDiDeNroVuelta!=1){
                    this.getAllRegDiarioDetalle(this.ReDiId);
                }

                this._RuId = ruID;  
                this._PuCoId = PuCoId;  
                //this.tarjeta._TaCoFecha=editf1(fechaActual1());
                this.getallpuntocontroldetallebypuco(PuCoId); //CONSULTANDO TODOS LOS PUNTOS DE CONTROL(DETALLE) USARLOS PARA INICIAR LA TAREJTADETALLE
            }

            /* SELECCIONAR PROGRAMACION COMBOBOX -> PROG ID */
            programacionId(event:Event){
                this.tarjeta._prId=this._prId;
            }

            actualizarVariables(arrRegDet=[]){
                //actualizar ReDiDeId y nroTotalvuelta + nrovueltaactual
                let i:number=0, cen:number=0;
                while(i<arrRegDet.length && cen==0){
                    if(arrRegDet[i].ReDiDeEstado!='2'){
                        i++;
                        cen=0;
                    }else{
                        cen=1;
                    }
                }
                if(cen==1){
                    this.ReDiDeId=arrRegDet[i].ReDiDeId;
                    this.ReDiDeNroVuelta=arrRegDet[i].ReDiDeNroVuelta;
                }
            }
    /* FUNCIONES ASIGNAR TARJETAS */
        // UNA SOLA TARJETA
            /* SOLA UNA TARJETA, AQUI SE GUARDA TANTO CABECERA COMO DETALLE Y 
                SE EDITA  LA   TABLA PROGRAMACION DETALLE EL CAMPO ASIGNADO*/
            guardarTarjeta( tiempoSalidaValid:any,  tiempoRetenValid:any ){
        
                // ASIGNAR VAL=01  ;   CASTIGADO VAL=03  AUSENTE VAL=02 
                let  PrDeAsignadoTarjeta:number, TaCoFinish:number=0, HoraSalidaRecEslavon:string, TaCoHoraSalida:string; 
                //console.log(this.campFormAsigUnaTarjeta.value.tReten);  console.log(tiempoSalidaValid);  console.log(tiempoRetenValid); console.log(this.estadoPlaca);  console.log(this.val);  console.log(this.ReDiDeNroVuelta);

                //primera vuelta
                if(this.ReDiDeNroVuelta==1){
                    if(this.val=='01'){
                        TaCoHoraSalida=this.TaCoHoraSalida;//recuperado de la onrowplaca (tabla pequeña)
                        TaCoFinish=0;
                        this.guardarObjetoTarjeta(TaCoHoraSalida, TaCoFinish);
                    }else if(this.val=='02' || this.val=='03'){
                        TaCoHoraSalida='00:00:00'; 
                        TaCoFinish=1;
                        this.guardarObjetoTarjeta(TaCoHoraSalida, TaCoFinish);
                    }
                //demas vueltas
                }else if(this.ReDiDeNroVuelta>1 && this.ReDiDeNroVuelta!=0){
                    //en caso de que se vuelva a asignar una tarjeta ausente o castigado
                    if(this.val=='02' || this.val=='03'){
                        TaCoHoraSalida='00:00:00'; 
                        TaCoFinish=1;
                        this.guardarObjetoTarjeta(TaCoHoraSalida, TaCoFinish);
                    // caso vuelve a aperturar una tarjeta
                    }else if(this.val=='01'){

                       //apertura una tarjeta
                        if(this.TarjetaBus_Anterior.TaCoAsignado=='1'){
                             //usar la hroa llegada anterior + reten -- tarjeta anterior asignado
                            if(tiempoRetenValid==true){
                                TaCoFinish=0;
                                //TaCoHoraSalida=this.calculoHoraSalida(this.ReReTiempo,this.tVueltaBus, _hora(this.TarjetaBus_Anterior.HoraLlegada));
                                
                                TaCoHoraSalida=operSHoras(this.ReReTiempo,this.HoraLlegadaTarjAnterior);
                                this.guardarObjetoTarjeta(TaCoHoraSalida, TaCoFinish);
                            }else if(tiempoRetenValid==false){
                                this.validarTiempo="Error al escribir el tiempo";
                            }

                        //tarjeta ausemte o castigado 
                        }else if(this.TarjetaBus_Anterior.TaCoAsignado=='2' || this.TarjetaBus_Anterior.TaCoAsignado=='3'){
                             //usar la horabasesalida del bus que salio antes de actual y ponerle una hora con unos minutos mas
                            if(tiempoSalidaValid==true){
                                TaCoHoraSalida=this.HoraSalidaRecEslavon;
                                TaCoFinish=0;
                                this.guardarObjetoTarjeta(TaCoHoraSalida, TaCoFinish);
                            }else if(tiempoSalidaValid==false){
                                this.validarTiempo="Error al escribir el tiempo";
                            }
                            
                        }
                    }
                }
                
            }

            //guardarObjeto una tarjeta
            guardarObjetoTarjeta(TaCoHoraSalida:string, TaCoFinish:number){
                let _tarjeta:any, tarjEncontrado:number , reten:any;   //console.log(TaCoHoraSalida); 
                
                _tarjeta={
                    TaCoId : this._TaCoId,
                    PuCoId : this._PuCoId,
                    RuId : Number(this._ruId),
                    BuId :this._BuId,
                    TaCoFecha :new Date(),
                    TaCoHoraSalida :hora(TaCoHoraSalida),
                    TaCoCuota :0,
                    UsId :this.UsId,
                    UsFechaReg :new Date(),
                    TaCoNroVuelta : this.ReDiDeNroVuelta,
                    PrId : Number(this.PrId),
                    TiSaId:this.TiSaObj.TiSaId,
                    TaCoAsignado :Number(this.val),
                    TaCoTipoHoraSalida:Number('01'), //manual o automatico
                    ReDiDeId:this.ReDiDeId,
                    TaCoFinish:TaCoFinish,
                    CoId:this.CoId,
                    TaCoCountMultiple: 1,
                    TaCoMultiple: this.TaCoMultiple,
                    TaCoCodEnvioMovil: 0,
                }; 
                
                //console.log(_tarjeta);
            
                tarjEncontrado=this.buscarTarjetaAsignada(_tarjeta); //console.log(tarjEncontrado); //buscar si esta asignado o no

                //PUEDE CREAR LA TARJETA existe uno que no esta terminado o la tarjeta no se a creado
                if(tarjEncontrado==1 || tarjEncontrado==-1 || tarjEncontrado==0){
                    this.msjEsperaGuardando='Guardando tarjeta, espere un momento';
                    this.displayMsjEsperaGuardarTarjeta=true;
                    //asignado
                    if(this.val=='01'){
    
                        //vuelta 2da a mas
                        if(this.ReDiDeNroVuelta>1 && this.ReDiDeNroVuelta!=0){

                            //anterior es ausente o castigado
                            if(this.TarjetaBus_Anterior.TaCoAsignado=='2' || this.TarjetaBus_Anterior.TaCoAsignado=='3'){
                                this.procAsigTarjCtrl(_tarjeta);

                            //anterior es asignado
                            }else if(this.TarjetaBus_Anterior.TaCoAsignado=='1'){

                                reten={
                                    ReDiDeId:this.ReDiDeId,
                                    ReReId:this.ReReId,
                                    PrDeId:this._prDeId,
                                    ReReTiempo:hora(this.ReReTiempo),
                                    UsId:this.UsId,
                                    UsFechaReg:new Date()
                                }
                                //console.log(reten);

                                this.regRetenService.saveregistroReten(reten).subscribe(
                                    data => { _tarjeta.ReDiDeId=data.ReDiDeId; this.procAsigTarjCtrl(_tarjeta);  },
                                    error=>{alert('No se pudo crear la tarjeta, Error R');console.log(error);}
                                );

                                //this.regRetenService.unsubcribe();
                            }

                        //1era vuelta
                        }else if(this.ReDiDeNroVuelta==1){
                            this.procAsigTarjCtrl(_tarjeta);
                        }

                    //ausente o castigado
                    }else if(this.val=='03' || this.val=='02'){
                        this.procAsigTarjCtrl(_tarjeta);
                    }

                }else{
                    alert("no puede crear la tarjeta");
                }
                this.validarTiempo="";
                this.val='x';

                //this.displayAsignarTarjeta = false;
                
            }

            //limpiando campos al guardar tarjeta
            limpiarCamposGuardarTarjeta(){
                this.selectedPlacaONE=[];
                this.val=null;
                this.mensaje="";
            }

        // MULTITARJETAS
            guardarMultiTarjetas(PrimerRetenValid, tmpEslavonValid, MulRetenValid){
                /*
                    console.log(PrimerRetenValid);
                    console.log(tmpEslavonValid);
                    console.log(MulRetenValid);
                    console.log(this.estadoPlaca);
                    console.log(this.modoTarjeta);
                    console.log(this.TaCoHoraSalida);// para primera vuelta
                    console.log(this.HoraLlegadaTarjAnterior);//hora para demas vueltas
                    console.log(this.tVueltaBus);
                    console.log(this.ReReTiempo);
                    console.log(this.HoraSalidaRecEslavon);
                    console.log(this.MultiReten);
                */
                //    console.log(this.ReDiDeId);
                let estadoTarjetaAnterior=this.modoTarjeta, estadoActualTarjeta=this.estadoPlaca, estadoNuevaTarjeta=this.val, 
                    ReDiDeNroVuelta=this.ReDiDeNroVuelta, objTarjeta:any, TaCoFinish=1;
                //objeto
                objTarjeta ={
                    TaCoId : this._TaCoId,
                    PuCoId : this._PuCoId,
                    RuId : this._RuId,
                    BuId :this._BuId,
                    TaCoFecha :new Date(),
                    TaCoHoraSalida :hora(this.TaCoHoraSalida),
                    TaCoCuota :0,
                    UsId :this.UsId,
                    UsFechaReg :new Date(), //   operSHoras
                    TaCoNroVuelta : this.ReDiDeNroVuelta,
                    PrId : Number(this.PrId),
                    TiSaId:this.TiSaObj.TiSaId,
                    TaCoAsignado :Number(this.val),
                    TaCoTipoHoraSalida:Number('01'), //manual o automatico
                    ReDiDeId:this.ReDiDeId,
                    TaCoFinish:TaCoFinish,
                    CoId:this.CoId,
                    TaCoCountMultiple: 0,
                    TaCoMultiple:this.TaCoMultiple,
                    TaCoCodEnvioMovil: 0,
                }

                // primera vuelta
                if(ReDiDeNroVuelta==1){

                    //asignado 
                    if(estadoActualTarjeta==1){
                        //creando nueva tarjeta como asignado         
                        
                        if(estadoNuevaTarjeta=='01'){
                            if(MulRetenValid==true && PrimerRetenValid==true && tmpEslavonValid==false){
    
                                objTarjeta.TaCoFinish=0;
                                objTarjeta.ReDiDeId++;
                                //console.log(objTarjeta.ReDiDeId);
                                objTarjeta.TaCoHoraSalida=operSHoras(this.ReReTiempo,this.HoraLlegadaTarjActual);
                                //console.log(objTarjeta.TaCoHoraSalida);
                                this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, this.ReReTiempo, this.MultiReten);
                            }else if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                //this.mnjNroValido="Esta hora no es valida";
                            }
                        //creando neuva tarjeta como ausente o castigado
                        }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                            if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                objTarjeta.ReDiDeId++;
                                objTarjeta.TaCoHoraSalida='00:00:00';
                                this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00', '00:00:00');
                            }else{
                                //mensaje error en los datos ingresados
                            }
                        }
                    //ausente o castigado 
                    }else if(estadoActualTarjeta==2 || estadoActualTarjeta==3){
                        //en caso de asignar tarjetas asignado
                        if(estadoNuevaTarjeta=='01'){
                            if(MulRetenValid==true && PrimerRetenValid==false && tmpEslavonValid==true){
                                objTarjeta.TaCoFinish=0;
                                objTarjeta.ReDiDeId++;
                                objTarjeta.TaCoHoraSalida=this.HoraSalidaRecEslavon;
                                this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00',this.MultiReten);
                            }else{
                                //mensaje error en los datos ingresados
                            }
                        //caso de poner a todas las tarjetas como no asignado
                        }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                            if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                objTarjeta.ReDiDeId++;
                                objTarjeta.TaCoHoraSalida='00:00:00';
                                this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00','00:00:00');
                            }else{
                                //mensaje error en los datos ingresados
                            }
                        }    
                        
                    //no asignado
                    }else if(estadoActualTarjeta==0){
                        //estado para nueva tarjeta: asignado
                        if(estadoNuevaTarjeta=='01'){
                            if(MulRetenValid==true && PrimerRetenValid==false && tmpEslavonValid==false){
                                objTarjeta.TaCoFinish=0;
                                objTarjeta.TaCoHoraSalida=this.TaCoHoraSalida;
                                this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas, '00:00:00', this.MultiReten);
                            }else{

                            }

                        //estado para nueva tarjeta: ausente o castigado
                        }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                            if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                objTarjeta.TaCoHoraSalida='00:00:00';
                                this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas, '00:00:00', '00:00:00');
                            }else{
                                
                            }
                        }
                        
                    }

                //si fuera despues de la primera
                }else if(ReDiDeNroVuelta>1 && ReDiDeNroVuelta!=0){
                    //estado anterior: asignado
                    if(estadoTarjetaAnterior==0){
                        //estado placa selecionada: asignado 
                        if(estadoActualTarjeta==1){
                            
                            // nueva tarjeta: asignado
                            if(estadoNuevaTarjeta=='01'){
                                //validacion
                                if(MulRetenValid==true && PrimerRetenValid==true && tmpEslavonValid==false){
                                    objTarjeta.TaCoFinish=0;
                                    objTarjeta.ReDiDeId++;
                                    objTarjeta.TaCoHoraSalida=operSHoras(this.ReReTiempo,this.HoraLlegadaTarjActual);
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, this.ReReTiempo, this.MultiReten);
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }
                            // nueva tarjeta: ausente castigado
                            }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                                //validacion
                                if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                    objTarjeta.ReDiDeId++;
                                    objTarjeta.TaCoHoraSalida='00:00:00';
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00', '00:00:00');
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }

                            }
                            
                        //estado placa selecionada: ausente o castigado
                        }else if(estadoActualTarjeta==2 || estadoActualTarjeta==3){
                            //nueva tarj= asignado
                            if(estadoNuevaTarjeta=='01'){
                                //validacion
                                if(MulRetenValid==true && PrimerRetenValid==false && tmpEslavonValid==false){
                                    objTarjeta.TaCoFinish=0;
                                    objTarjeta.ReDiDeId++;
                                    objTarjeta.TaCoHoraSalida=this.HoraSalidaRecEslavon;
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00', this.MultiReten);
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }
                            }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                                //validacion
                                if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                    objTarjeta.ReDiDeId++;
                                    objTarjeta.TaCoHoraSalida='00:00:00';
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00', '00:00:00');
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }
                            }
                            
                        //estado placa selecionada: no asignado
                        }else if(estadoActualTarjeta==0){
                            //nueva tarjeta: asignado
                            if(estadoNuevaTarjeta=='01'){
                                //console.log(this.ReReTiempo); console.log(this.HoraLlegadaTarjAnterior); console.log(this.MultiReten);
                                if(MulRetenValid==true && PrimerRetenValid==true && tmpEslavonValid==false){
                                    objTarjeta.TaCoFinish=0;
                                    objTarjeta.TaCoHoraSalida=extFuncCorrecHora(operSHoras(this.ReReTiempo,this.HoraLlegadaTarjAnterior));
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas, this.ReReTiempo, this.MultiReten);
                             
                                }else{
                                    //mensaje de error en la validacion
                                }

                            //nueva tarjeta: ausente o castigado
                            }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                                //validacion
                                if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                    objTarjeta.TaCoHoraSalida='00:00:00';
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas, '00:00:00', '00:00:00');
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }
                            }
                        }
                    //estado anterior: castigado o ausente
                    }else if(estadoTarjetaAnterior==1){
                        
                        //estado actual: asignado 
                        if(estadoActualTarjeta==1){
                                
                            // nueva tarjeta: asignado
                            if(estadoNuevaTarjeta=='01'){
                                //validacion
                                if(MulRetenValid==true && PrimerRetenValid==true && tmpEslavonValid==false){
                                    objTarjeta.TaCoFinish=0;
                                    objTarjeta.ReDiDeId++;
                                    objTarjeta.TaCoHoraSalida=operSHoras(this.ReReTiempo,this.HoraLlegadaTarjActual);
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, this.ReReTiempo, this.MultiReten);
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }

                            // nueva tarjeta: ausente castigado
                            }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                                //validacion
                                if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                    objTarjeta.TaCoFinish=0;
                                    objTarjeta.ReDiDeId++;
                                    objTarjeta.TaCoHoraSalida='00:00:00';
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00', '00:00:00');
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }
                            }
                                
                        //estado actual: ausente o castigado
                        }else if(estadoActualTarjeta==2 || estadoActualTarjeta==3){
                            //nueva tarj= asignado
                            if(estadoNuevaTarjeta=='01'){
                                //validacion
                                if(MulRetenValid==true && PrimerRetenValid==false && tmpEslavonValid==true){
                                    objTarjeta.TaCoFinish=0;
                                    objTarjeta.ReDiDeId++;
                                    objTarjeta.TaCoHoraSalida=this.HoraSalidaRecEslavon;
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00', this.MultiReten);

                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }

                            }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                                //validacion
                                if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                    objTarjeta.ReDiDeId++;
                                    objTarjeta.TaCoHoraSalida='00:00:00';
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas-1, '00:00:00', '00:00:00');
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }
                            }   
                        //estado actual: no asignado
                        }else if(estadoActualTarjeta==0){

                            //nueva tarjeta : asignado
                            if(estadoNuevaTarjeta=='01'){
                                //validacion
                                if(MulRetenValid==true && PrimerRetenValid==false && tmpEslavonValid==true){
                                    objTarjeta.TaCoFinish=0;
                                    //objTarjeta.TaCoHoraSalida=operSHoras(this.ReReTiempo,this.HoraLlegadaTarjAnterior);
                                    objTarjeta.TaCoHoraSalida=this.HoraSalidaRecEslavon;
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas, '00:00:00', this.MultiReten);
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }
                            //nueva tarjeta : ausente o castigado
                            }else if(estadoNuevaTarjeta=='02' || estadoNuevaTarjeta=='03'){
                                //validacion
                                if(MulRetenValid==false && PrimerRetenValid==false && tmpEslavonValid==false){
                                    objTarjeta.TaCoHoraSalida='00:00:00';
                                    this.guardarMultiTarjeta(objTarjeta, this.nroTarjetas, '00:00:00', '00:00:00');
                                //no valido
                                }else{
                                    //mensaje de error en la validacion
                                }    
                            }
                            
                        }
                    }
                }
            }

            //guardar objeto - mandar a procedimiento guardar multitarjeta
            guardarMultiTarjeta(objTarjetaInicial:any, nroTarjetasCrear:number, PrimerReten:string, MultiReten:string){
                objTarjetaInicial.TaCoCountMultiple=nroTarjetasCrear;
                objTarjetaInicial.TaCoHoraSalida=hora(objTarjetaInicial.TaCoHoraSalida);
                if(objTarjetaInicial.TaCoAsignado==2 || objTarjetaInicial.TaCoAsignado==3){
                    objTarjetaInicial.TaCoFinish=1;
                }else if(objTarjetaInicial.TaCoAsignado==1){
                    objTarjetaInicial.TaCoFinish=0;
                }
                
                //console.log(objTarjetaInicial.TaCoHoraSalida);
                console.log(objTarjetaInicial);
                console.log(nroTarjetasCrear);
                console.log(hora(PrimerReten));
                console.log(hora(MultiReten));
                console.log('=====================');

                if(this.verificarUltimaVuelta(this.ReDiDeNroVuelta, this.ReDiTotalVuelta)==false){
                    this.msjEsperaGuardando='Guardando tarjeta, espere un momento';
                    this.displayMsjEsperaGuardarTarjeta=true;
                    this.procAsigMultiTarjetas(objTarjetaInicial,hora(PrimerReten),hora(MultiReten));
                }else if(this.verificarUltimaVuelta(this.ReDiDeNroVuelta, this.ReDiTotalVuelta)==true){
                    this.mensajeModal="No puede crear una tarjeta multiple en la penultima vuelta ";
                    this.displayMnjNoPuedeCrearMulTarjEnPenultimaVuelta=true;
                }
            }
            
            //aceptar, no puede crear tarjeta en la penultima vuelta
            aceptarNoPuedeCrearMultiTarjeta(){
                this.mensajeModal='';
                this.displayMnjNoPuedeCrearMulTarjEnPenultimaVuelta=false;
            }
    /* FUNCIONES VARIADAS */
            //recuperando indice fila seleccionada datatable individual tarjeta
            buscarObjetoTablaIndividual(arrprog=[], objSel:any):number{
                let i:number=0,cen:number=0, index:number;
                while(i<arrprog.length && cen==0){
                    //console.log('BuPlaca: '+arrprog[i].BuPlaca+' ----- '+'ReDiDeNroVuelta: '+ arrprog[i].ReDiDeNroVuelta);
                    if(arrprog[i].BuId==objSel.BuId){
                        cen=1;
                    }else if(arrprog[i].BuId!=objSel.BuId){
                        i++; cen=0;
                    }
                }

                if(cen==1){
                    index=i;
                }else if(cen==0){
                    index=-1;
                }
                return index;
            }
            //buscando la placa en las tarjetas asignadas
            buscarTarjetaAsignada(objTarjeta:any):number{
                let resultado:number, arrTarjetas:any[]=[], cen=0, i=0, finish:number; 
                    arrTarjetas=this.mTarjetasAsignadas(this.arrTarjetasAsignadas);   //console.log(arrTarjetas);
                    while(i<arrTarjetas.length && cen==0){
                        if(arrTarjetas[i].BuId==objTarjeta.BuId){
                            cen=1;
                            //tarjeta encontrada y terminada
                            if(arrTarjetas[i].TaCoFinish==true){
                                finish=1;
                            //tarjeta encontrada y no terminada
                            }else if(arrTarjetas[i].TaCoFinish==false){
                                finish=0; //reponer
                                //finish=1;
                            }
                        }else if(arrTarjetas[i].BuId!=objTarjeta.BuId){
                            //tarjeta no encontrada
                            cen=0;
                        }
                        i++;
                    }

                    //tarjeta encontrada y no terminada
                    if(finish==0){
                        resultado=0;
                    //tarjeta encontrada y terminada
                    }else if(finish==1){
                        resultado=1;
                    //tarjeta no encontrada (se puese crear)
                    }else if(cen==0){
                        resultado=-1;
                    }
                return resultado;
            }

            //CAMBIANDO BUID X NROPLACA 
            cambianBuIdxNroPlaca(arrProg=[],arrPlaca=[]){            
                let result:any[]=[]; let i=0,j=0,cen=0,cen2=0; let progr:any[]=[], _arrPlacas:any[]=[]; 
                
                //sacando la no activas
                for(let i=0; i<arrPlaca.length; i++){ if(arrPlaca[i].BuActivo==true){_arrPlacas.push(arrPlaca[i]); } }
                
                //cambian buid por nroplaca
                while (i<_arrPlacas.length && cen2==0){
                    // BUSQUEDA 
                    while (j<arrProg.length && cen==0){
                        if (arrProg[i].BuId === _arrPlacas[j].BuId){ 
                            //console.log(arrProg[i].BuId +" >-----< "+ arrProg[i].PrDeOrden);
                            progr.push({
                                BuId: arrProg[i].BuId,
                                nroPlaca: _arrPlacas[j].BuPlaca,
                                PrId:arrProg[i].PrId,
                                PrDeOrden:arrProg[i].PrDeOrden,
                                PrDeId: arrProg[i].PrDeId,
                                PrDeBase: arrProg[i].PrDeBase,
                                PrDeHoraBase:arrProg[i].PrDeHoraBase,
                                PrDeFecha:arrProg[i].PrDeFecha,
                                PrDeAsignadoTarjeta:arrProg[i].PrDeAsignadoTarjeta,
                                PrDeCountVuelta:arrProg[i].PrDeCountVuelta,
                                SuEmRSocial:_arrPlacas[j].SuEmRSocial,
                                BuDescripcion:_arrPlacas[j].BuDescripcion
                            });
                            cen = 1; 
                        }else if(arrProg[i].BuId != _arrPlacas[j].BuId){}
                        j++;  
                    }
                    j=0; i++; cen = 0;
                    
                    // VERIFICANDO QUE SE ENCONTRARON TODAS BUID 
                    if(arrProg.length==progr.length){ cen2=1; }
                }
             
                result=progr.slice(0);
                return result;
            }


            /* BORRANDO NUEVOS OBJETOS CREADOS */
            borrarObjetos(){
                this._tarjeta={};
                this.arrNTarjCabecera=[];
                this._tarjetaDetalle={};
                this.arrNTarjDetalle=[];
                this._progDetalle=[]; /* VACIANDO PROGRAMACION EN LA FECHA INDICADA */
                this.mensaje="";
            }

            

    /* ORDENARLAS */
        //abrir cerrar cuadro de salidas
        abrirCuadroSalidas(){
            this.displayCuadroSalidas=true;
            //TABLA
            this.concatenarRegDiarioCuadroCompleto(this.mgprogDetalle(this.progDetalle), this.extraRegistroDiario(this.arrCuadro));
        }

        //contacatenar para cuadro completo
        concatenarRegDiarioCuadroCompleto(arrProgFecha=[], arrCuadroDiario=[]){
            let ReDiTotalVuelta=this.ReDiTotalVuelta, arrEncNumber:any[]=[] , arrEncHoras:any[]=[], i:number=0, j:number=0;
            let arrMatCuadro:any[]=[], matSalidas:any[]=[], _arrCuadroSalidas:any[]=[], _matSalidas:any[]=[];
           
            for(let i=0; i<arrCuadroDiario.length;i++){
                arrMatCuadro[i]={
                    nro:i+1,
                    ReDiId:arrCuadroDiario[i].ReDiId,
                    ReDiDeId:arrCuadroDiario[i].ReDiDeId,
                    ReReId:arrCuadroDiario[i].ReReId,
                    BuPlaca:arrCuadroDiario[i].BuPlaca,
                    TaCoAsignado:arrCuadroDiario[i].TaCoAsignado,
                    EstadoAsignado:"",
                    ReDiDeNroVuelta:arrCuadroDiario[i].ReDiDeNroVuelta,
                    TaCoHoraSalida:arrCuadroDiario[i].TaCoHoraSalida,
                    HoraSalida:_hora(arrCuadroDiario[i].TaCoHoraSalida),
                    NumHoraLlegada:arrCuadroDiario[i].HoraLlegada,
                    HoraLlegada:_hora(arrCuadroDiario[i].HoraLlegada),
                    ReReTiempo:arrCuadroDiario[i].ReReTiempo,
                    RetenTiempo:"",
                    PuCoTiempoBus:arrCuadroDiario[i].PuCoTiempoBus,
                    TiempoVuelta:"",

                    BuId:arrProgFecha[j].BuId,
                    PrDeOrden:arrProgFecha[j].PrDeOrden,
                    PrDeId:arrProgFecha[j].PrDeId,
                    PrId:arrProgFecha[j].PrId,
                    PrDeAsignadoTarjeta:arrProgFecha[j].PrDeAsignadoTarjeta,
                    PrDeCountVuelta:arrProgFecha[j].PrDeCountVuelta,
                    PrDeHoraBaseSalida:_hora(arrProgFecha[j].PrDeHoraBase),
                }
                
               

                if(arrMatCuadro[i].PuCoTiempoBus==null){
                    arrMatCuadro[i].TiempoVuelta='00:00:00';
                }else if(arrMatCuadro[i].PuCoTiempoBus!=null){
                    arrMatCuadro[i].TiempoVuelta=_hora(arrMatCuadro[i].PuCoTiempoBus);
                }

                if(arrMatCuadro[i].ReReTiempo==null){ 
                    arrMatCuadro[i].RetenTiempo='00:00:00';
                }else if(arrMatCuadro[i].ReReTiempo!=null){
                    arrMatCuadro[i].RetenTiempo=_hora(arrMatCuadro[i].ReReTiempo);
                }

                if(arrMatCuadro[i].TaCoAsignado=='1'){
                    arrMatCuadro[i].EstadoAsignado='Asignado';
                }else if(arrMatCuadro[i].TaCoAsignado=='2'){
                    arrMatCuadro[i].EstadoAsignado='Ausente';
                    arrMatCuadro[i].RetenTiempo='__:__:__';
                    arrMatCuadro[i].TiempoVuelta='__:__:__';
                    arrMatCuadro[i].HoraLlegada='__:__:__';
                    arrMatCuadro[i].HoraSalida='__:__:__';
                }else if(arrMatCuadro[i].TaCoAsignado=='3'){
                    arrMatCuadro[i].EstadoAsignado='Castigado';
                    arrMatCuadro[i].RetenTiempo='__:__:__';
                    arrMatCuadro[i].TiempoVuelta='__:__:__';
                    arrMatCuadro[i].HoraLlegada='__:__:__';
                    arrMatCuadro[i].HoraSalida='__:__:__';
                }else if(arrMatCuadro[i].TaCoAsignado==null){
                    arrMatCuadro[i].EstadoAsignado='No_Asig.';
                    arrMatCuadro[i].RetenTiempo='__:__:__';
                    arrMatCuadro[i].TiempoVuelta='__:__:__';
                    arrMatCuadro[i].HoraLlegada='__:__:__';
                    arrMatCuadro[i].HoraSalida='__:__:__';
                }

                if(i==arrProgFecha.length-1){
                    j=0;
                }else if(i<arrProgFecha.length-1){
                    j++;
                }
            }

            //dividiendo array en una matriz
            _matSalidas=this.matrizCuadroDiario(arrMatCuadro, arrProgFecha.length);  //console.log(_matSalidas);
           
                        
            //ENCABEZADO NUMERICO
            for(let i=0; i<ReDiTotalVuelta; i++){ arrEncNumber.push(i+1);}
            //ENCABEZADO STRING
            for(let i=0; i<ReDiTotalVuelta;i++){ arrEncHoras.push(['N°Placa', 'Etd_Tarj.',  'H.Reten', 'H.Salida', 'H.Vuelta' ,'H.Llegada']);  }

            this.headerTabCuadroNumber=arrEncNumber; this.headerTabCuadroHoras=arrEncHoras;
            _arrCuadroSalidas=this.mgCuadroSalidas(this.ReDiTotalVuelta,arrProgFecha.length);

    
            for(let i=0; i<_matSalidas.length; i++){  _arrCuadroSalidas[i]=_matSalidas[i]; }

           
            this.arrCuadroSalidas=_arrCuadroSalidas;
        }
       
        //dividiendo array en matriz
        matrizCuadroDiario(arrMatCuadro=[], longxArray){
            let resultado:any[]=[],   nroArraysMat=(arrMatCuadro.length)/longxArray,    
                i:number=0, j:number=0, k:number=0, mat:any[]=[[]];
            //console.log(nroArraysMat);  console.log(longxArray);  console.log(arrMatCuadro);
            
            //iniciar array de arrays en blanco
            for(let i=0; i<nroArraysMat; i++){  mat[i]=[];  }

            while(i<nroArraysMat){
                while(j<longxArray){
                    //console.log('i: '+i+' -- '+'j: '+j+' -- '+'k: '+k);
                    mat[i][j]=[arrMatCuadro[k].BuPlaca, arrMatCuadro[k].EstadoAsignado, arrMatCuadro[k].RetenTiempo,arrMatCuadro[k].HoraSalida,arrMatCuadro[k].TiempoVuelta,arrMatCuadro[k].HoraLlegada]; 
                    k++; j++;
                }
                j=0; i++;
            }
            resultado=mat;
            return resultado;
        }

        //concatenar par acuadro pequeño
        concatenarRegDiarioProgxFecha(arrProgFecha=[], arrCuadroDiario=[]){
            //console.log(arrProgFecha); console.log(this.ReDiDeNroVuelta); console.log(arrCuadroDiario); 
            let arrMatCuadro:any[]=[], arrCuadro:any[]=[];
            arrCuadro=this.sacarArrCuadroXNroVuelta(arrCuadroDiario, this.ReDiDeNroVuelta);
            //console.log(arrCuadro);
            for(let i=0; i<arrCuadro.length;i++){
                arrMatCuadro[i]={
                    nro:i+1,
                    PrDeOrden:arrProgFecha[i].PrDeOrden,
                    ReDiId:arrCuadro[i].ReDiId,
                    ReDiDeId:arrCuadro[i].ReDiDeId,
                    ReReId:arrCuadro[i].ReReId,
                    BuId:arrProgFecha[i].BuId,
                    BuPlaca:arrCuadro[i].BuPlaca,
                    PrDeId:arrProgFecha[i].PrDeId,
                    PrId:arrProgFecha[i].PrId,

                    PrDeAsignadoTarjeta:arrProgFecha[i].PrDeAsignadoTarjeta,
                    TaCoAsignado:arrCuadro[i].TaCoAsignado,
                    EstadoAsignado:"",

                    ReDiDeNroVuelta:arrCuadro[i].ReDiDeNroVuelta,
                    PrDeCountVuelta:arrProgFecha[i].PrDeCountVuelta,

                    PrDeHoraBaseSalida:_hora(arrProgFecha[i].PrDeHoraBase),
                    TaCoHoraSalida:_hora(arrCuadro[i].TaCoHoraSalida),
                    HoraLlegada:_hora(arrCuadro[i].HoraLlegada),
                    ReReTiempo:arrCuadro[i].ReReTiempo,
                    PuCoTiempoBus:_hora(arrCuadro[i].PuCoTiempoBus)
                }

                if(arrMatCuadro[i].TaCoAsignado==null){
                    arrMatCuadro[i].TaCoAsignado=0;
                    arrMatCuadro[i].EstadoAsignado="No Asignado";

                }else if(arrMatCuadro[i].TaCoAsignado=='1'){
                        arrMatCuadro[i].EstadoAsignado=arrMatCuadro[i].TaCoHoraSalida;

                }else if(arrMatCuadro[i].TaCoAsignado=='2'){
                    arrMatCuadro[i].EstadoAsignado="Ausente";

                }else if(arrMatCuadro[i].TaCoAsignado=='3'){
                    arrMatCuadro[i].EstadoAsignado="Castigado";

                }else{//EN CASO DE QUE PRDEASIGNADO=1 PERO TACOSIGNADO!=1 , 2 o 3
                    arrMatCuadro[i].EstadoAsignado="No Asignado";
                } 
            }
            this.arrprogxfecha=arrMatCuadro;
        }

        //buscar estado tarjeta anterior
        estadoTarjetaAnterior(arrCuadro=[], nroVueltaActual:number, BuId:number){
            this.extraRegistroDiario(this.arrCuadro); 
            //console.log(arrCuadro); //console.log(BuId); console.log(nroVueltaActual);
            let i=0, TaCoAsignado:string,HoraLlegada:any, resultado:any, _BuId:number, Placa:number, cen:number=0; 
            while(i<arrCuadro.length && cen==0){
                if(arrCuadro[i].ReDiDeNroVuelta==(nroVueltaActual-1) && arrCuadro[i].BuId==BuId){
                    TaCoAsignado=arrCuadro[i].TaCoAsignado;
                    HoraLlegada=arrCuadro[i].HoraLlegada;
                    _BuId=arrCuadro[i].BuId;
                    Placa=arrCuadro[i].BuPlaca;
                    cen=1;
                }else{
                    cen=0;
                }
                i++;
            }
            resultado={
                TaCoAsignado:TaCoAsignado,
                IndiceRegAnterior:i-1,
                HoraLlegada:HoraLlegada,
                BuId:_BuId,
                Placa:Placa
            }
            //console.log(resultado);
            return resultado;
        }

        sacarArrCuadroXNroVuelta(arrCuadro=[], vueltaActual:number){
            //console.log(arrCuadro);
            //console.log(vueltaActual);
            let result:any[]=[], arrMat:any[]=[];

                for(let i=0; i<arrCuadro.length;i++){
                    //console.log(arrCuadro[i].ReDiDeNroVuelta);
                    if(arrCuadro[i].ReDiDeNroVuelta==vueltaActual){
                        arrMat.push(arrCuadro[i]);
                    }
                }
                //console.log(arrMat);
                result=arrMat.slice(0);
            return result;
        }

        //cerrar cerrar cuadro de salidas
        cerrarCuadroSalidas(){
            this.displayCuadroSalidas=false;
            //vaciar variable
        }

        //cerrar ventana modal tarjeta de control
        cerrarTarjetaControl(){
            this.displayTarjetaControlDetalle=false;
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
            console.log("aceptarHayPC");
            this.displayHayPCModalNuevo=false;
        }
        
        /* ERROR, FALTO DATOS NECESARIOS PARA BUSCAR POR FECHA */
        errorBuscarxFecha(){
            this.mensaje="";
            this.displayErrorDatosProgxFecha=false;
        }

        

        /* VENTANA ELEGIR ENTRE ASIGNAR UNA O VARIAS TARJETAS A LA VEZ   DIA CON PRGORAMACION */
        formAsignarTarjetas(){
            //this.nroTarjetas=1; 
            this.displayAsignarTarjeta=true;
            this.getallplacasbusbyemsuem(this.emID,0);
            
            //BORRANDO VARIABLES
            this.puntoControl=null;
            this._prId=null;
        }
        /* VENTANA ELEGIR ENTRE ASIGNAR UNA O VARIAS TARJETAS A LA VEZ   DIA SIN PRGORAMACION */
        formAsignarTarjetasSinProg(){
            this.displayAsignarTarjetaSinProg=true;
        }

        //cargar las placas que estan llegando en dia sin programacion
        iniciarPrimeraVuelta(){ 
            this.displayAgregarPlacaSinProg=true;
        }
        cancelNroAsigTarjetas(){
            this.mensaje="";
            this.displayNroTarjetas=false;
            this.nroTarjetas=1; /* VALOR POR DEFECTO */
        }

        /*SE CANCELA NRO TARJETA IGUAL A UNO*/
        cancelarMultiTarjeta(){
            this.displayAsignarTarjeta = false;
            this._getalltarjetacontrolbybuidfecha(0,cCeroFechaForEditar(fechaActual2()));
            // BORRANDO OBJETOS Y VARIABLES CREADOS
            this.borrarObjetos();
            this.val='x';
            this.TaCoMultiple=null;
            //this.estadoPlaca=0; this.nroTarjetas=1;
            this.estadoPlaca=-1;
        }

        /*SE CANCELA NRO TARJETA IGUAL A UNO*/
        cancelarTarjeta(){
            this.displayAsignarTarjeta = false;
            this._getalltarjetacontrolbybuidfecha(0,cCeroFechaForEditar(fechaActual2()));
            this.borrarObjetos();
            this.val='x';
            this.TaCoMultiple=null;
            //this.estadoPlaca=0;
            this.estadoPlaca=-1;
        }

        cancelarEditarTarjeta(){
            this.displayEditarTarjeta = false;
        }
        funEstTarjApertura(){
            //console.log(this.val);  console.log(this.nroTarjetas);  console.log(this.modoTarjeta);
            if(this.nroTarjetas==1){
                this.ftnActivarInputFormUnaTarjeta(this.ReDiDeNroVuelta, this.modoTarjeta, this.val);
            }else if(this.nroTarjetas>1){
                this.ftnActivarInputFormMultiplesTarjeta(this.ReDiDeNroVuelta, this.modoTarjeta, this.estadoPlaca, this.val);
            }
            
        }

        ftnActivarInputFormUnaTarjeta(ReDiDeNroVuelta:number, estadoTarjetaAnterior:number, estadoTarjetaApertura:string){
            //console.log(ReDiDeNroVuelta);  console.log(estadoTarjetaAnterior);  console.log(estadoTarjetaApertura);
            
            if(ReDiDeNroVuelta!=0 && estadoTarjetaAnterior!=-1 && estadoTarjetaApertura!='x'){
                //primera vuelta, no existe estadoAnterior
                if(ReDiDeNroVuelta==1 && estadoTarjetaAnterior==2 && 
                    (estadoTarjetaApertura=='01' || estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03')){
                    this.actInputTHora=true; 
                    this.actInputReten=true; 
                    this.actInputHoraSalida=true;

                //vuelta mayor a 1 && estadoanterior asignado
                }else if(ReDiDeNroVuelta>1 && estadoTarjetaAnterior==0){
                    if(estadoTarjetaApertura=='01'){
                        this.actInputTHora=false; this.actInputReten=false; this.actInputHoraSalida=true;
                    }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                        this.actInputTHora=true; this.actInputReten=true; this.actInputHoraSalida=true;
                    }

                //vuelta mayor a 1 && estadoanteriro ausente o castigado
                }else if(ReDiDeNroVuelta>1 && estadoTarjetaAnterior==1){
                    //asignado
                    if(estadoTarjetaApertura=='01'){
                        this.actInputTHora=true; this.actInputReten=true; this.actInputHoraSalida=false;
                    //ausente o castigado
                    }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                        this.actInputTHora=true; this.actInputReten=true; this.actInputHoraSalida=true;
                    }
                }
            }
            
        }
       
        //asctivando inputs para multiple tarjeta
        ftnActivarInputFormMultiplesTarjeta(ReDiDeNroVuelta:number, estadoTarjetaAnterior:number, estadoTarjetaActual:number, estadoTarjetaApertura:string){
            //console.log(ReDiDeNroVuelta);  console.log(estadoTarjetaAnterior);  console.log(estadoTarjetaApertura);
            
            if(ReDiDeNroVuelta!=0 && estadoTarjetaAnterior!=-1 && estadoTarjetaApertura!='x'){
                //ReDiDeNroVuelta   :  vuelta actual de todo el dia
                //estadoTarjetaAnterior : tipo de tarjeta creada anterior a la vuelta actual (0: asignado, 1: ausente o castigado)
                //estadoTarjetaApertura :   tipo de tarjeta a crear ('01': asignado, '02': ausente o  '03' : castigado)
                //estadoTarjetaActual

                //primera vuelta y no hay estadoanterior
                if(ReDiDeNroVuelta==1  && estadoTarjetaAnterior==2){
                    //estado actual tarjeta = asignado
                    if(estadoTarjetaActual==1){
                        //asignado (creando tarjeta)
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=false; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=true;

                        //ausente o castigado (creando tarjeta)
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    
                    //estado actual tarjeta = ausente o castigado
                    }else if(estadoTarjetaActual==2 || estadoTarjetaActual==3){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //estado actual tarjeta = no asignado
                    }else if(estadoTarjetaActual==0){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=true;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    }

                //vuelta mayor a 1 && estadoanterior = asignado
                }else if(ReDiDeNroVuelta>1 && estadoTarjetaAnterior==0){
                    //asignado anterior
                    if(estadoTarjetaActual==1){
                        //asignado a asignar
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=false; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=true;

                        //ausente o castigado a asignar
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //castigado ausente
                    }else if(estadoTarjetaActual==2 || estadoTarjetaActual==3){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //no asignado
                    }else if(estadoTarjetaActual==0){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=false; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=true;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    }

                //vuelta mayor a 1 && estadoanteriro = ausente o castigado
                }else if(ReDiDeNroVuelta>1 && estadoTarjetaAnterior==1){
                    //tarjeta asignada
                    if(estadoTarjetaActual==1){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //tarjeta ausente o castigado
                    }else if(estadoTarjetaActual==2 || estadoTarjetaActual==3){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //tarjeta no asignado
                    }else if(estadoTarjetaActual==0){                
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    }

                }

            }
            
        }

        //buscar si es la ultima placa de la programacion del dia
        buscarUltimaPlacaProgr(objSelec:any, arrProgAct=[]):number{
            //console.log(objSelec); console.log(arrProgAct);
            let i:number=0, cen:number=0, result:number, ultIndice=arrProgAct.length-1;
            //pasa a la sgte vuelta
            if(arrProgAct[ultIndice].BuId==objSelec.BuId){
                result=1;
            //no pasa a la siguiente
            }else if(arrProgAct[ultIndice].BuId!=objSelec.BuId){
                result=-1;
            }
            return result;
        }


        //validar si la tarjeta selecionada es una tarjeta multiple
        verificarTipoTarjeta(objRowSelect:any){
            //si la tarjeta seleccionada es individual, se puede continuar creando tarjetas individuales 
            //si es multiple, ya no se puede crear tarjeta multiple
            
        }

        //verificar si se encuentra en la ultima vuelta
        verificarUltimaVuelta(ReDiDeNroVuelta:number, ReDiTotalVuelta:number):boolean{
            //si se encuentra en la ultima vuelta, no se 
            //puede seguir seando tarjetas multiple, solo individual
            let result:boolean;
            console.log('diferencia: '+(ReDiTotalVuelta-ReDiDeNroVuelta));
            if(ReDiTotalVuelta-ReDiDeNroVuelta>=2){
                result=false;
            }else if(ReDiTotalVuelta-ReDiDeNroVuelta==0 || ReDiTotalVuelta-ReDiDeNroVuelta==1 ){
                result=true;
            }
            return result;
        }

        //establecer un punto de control por cada vuelta
        funcPuntoControlFijoXVuelta(arrTarjetasCreadas=[]):number{
            console.log(this.ReDiDeNroVuelta);
            //console.log(this.arrprogxfecha);
            console.log(arrTarjetasCreadas);
            let i:number=0, cen=0, result:number;
            while(i<arrTarjetasCreadas.length && cen==0){
                if(arrTarjetasCreadas[i].TaCoNroVuelta!=this.ReDiDeNroVuelta){
                    i++; cen=0;
                }else if(arrTarjetasCreadas[i].TaCoNroVuelta==this.ReDiDeNroVuelta){
                    cen=1;
                }
            }
            /*
                this.tVueltaBus
                this.PrId
                this.ReDiId
                this._RuId  
                this._PuCoId 
                this.ReDiDeId
            */
            if(cen==1){
                result=arrTarjetasCreadas[i].PuCoId;
            }else if(cen==0){
                result=-1;
            }
            return result;
        }

        //abrir formulario calcular reten
        formCalcularRetenDP(){
            this.displayCalRetenDP=true;
        }

        aceptarRetenCalculadoDP(ReReTiempo:string){
            this.displayCalRetenDP=false;
            this.HoraSalidaPlacaActualPreviewDP='';
            this.ReReTiempo=ReReTiempo;
        }

        cancelarRetenCalculadoDP(){
            this.displayCalRetenDP=false;
            this.HoraSalidaPlacaActualPreviewDP='';
            this.ReReTiempo='';
        }

        //funcion calcular reten DP USANDO BOTON ENTER
        calcularValidarRetenDP(ReReTiempoValid:boolean){
            //console.log(ReReTiempoValid);
            if(ReReTiempoValid==true){
                //console.log(this.HoraSalidaAnteriorDP); console.log(this.ReReTiempo); console.log(this.HoraLlegadaTarjAnterior);
                let nuevaHoraSalida=operSHoras(this.ReReTiempo, this.HoraLlegadaTarjAnterior);
                //console.log(nuevaHoraSalida);
                this.HoraSalidaPlacaActualPreviewDP=nuevaHoraSalida;
            }else if(ReReTiempoValid==false){
                alert('Error en el reten ingresado');
            }
        }

//asignar tarjetas para dia libre
        //FUNCION AGREGAR UNA PLACA A LA PROGRAMACION LIBRE(SERA LA BASE DE TODO EL DIA)
        agregarPlaca(){
            console.log(this.selectedPlacaAddSinProg);
            let BuId=this.selectedPlacaAddSinProg.BuId, 
                BuPlaca=this.selectedPlacaAddSinProg.BuPlaca;
            let objAddPlaca={
                nro:0,
                PrDeOrden:0,
                ReDiId:0,
                ReDiDeId:0,
                ReReId:0,
                BuId:BuId,
                BuPlaca:BuPlaca,
                //PrDeId:0,
                //PrId:0,
                //PrDeAsignadoTarjeta:0,
                TaCoAsignado:0,
                EstadoAsignado:'No Asignado',
                ReDiDeNroVuelta:0,
                //PrDeCountVuelta:arrProgFecha[i].PrDeCountVuelta,
                //PrDeHoraBaseSalida:_hora(arrProgFecha[i].PrDeHoraBase),
                TaCoHoraSalida:'',
                HoraLlegada:'', 
                ReReTiempo:'',
                //PuCoTiempoBus:_hora(arrCuadro[i].PuCoTiempoBus)
            }

            this.arrprogDiaLibre.push(objAddPlaca);
            this.displayAgregarPlacaSinProg=false;
        }


        // UNA SOLA TARJETA
        /* SOLA UNA TARJETA, AQUI SE GUARDA TANTO CABECERA COMO DETALLE Y 
        SE EDITA  LA   TABLA PROGRAMACION DETALLE EL CAMPO ASIGNADO*/
        //INDIVIDUAL
        //guardarTarjetaDiaLibre(horaInitDL.valid, tmpRetenDL.valid, tmpSalidaDL.valid)"
        guardarTarjetaDiaLibre(horaInitDLValid:any, tiempoRetenValid:any, tiempoSalidaValid:any ){

            // ASIGNAR VAL=01  ;   CASTIGADO VAL=03  AUSENTE VAL=02 
            let  PrDeAsignadoTarjeta:number, TaCoFinish:number=0, HoraSalidaRecEslavon:string, TaCoHoraSalida:string; 
            //console.log(this.campFormAsigUnaTarjeta.value.tReten);  
            //console.log(tiempoSalidaValid);  console.log(tiempoRetenValid); 
            //console.log(this.estadoPlaca);  console.log(this.val);  
            //console.log(this.ReDiDeNroVuelta);

            //primera vuelta
            if(this.ReDiDeNroVuelta==1){
                //nueva tarjeta inicial = asignado
                if(this.val=='01'){
                    if(horaInitDLValid==true){
                        TaCoHoraSalida=this.HoraInitDiaLibre;//recuperado de la onrowplaca (tabla pequeña)
                        TaCoFinish=0;
                        this.guardarObjetoTarjetaDiaLibre(TaCoHoraSalida, TaCoFinish);

                    }else if(horaInitDLValid==false){

                    }
                    

                //nueva tarjeta inicial = ausente o castigado
                }else if(this.val=='02' || this.val=='03'){
                    TaCoHoraSalida='00:00:00'; 
                    TaCoFinish=1;
                    this.guardarObjetoTarjetaDiaLibre(TaCoHoraSalida, TaCoFinish);
                }
            //demas vueltas
            }else if(this.ReDiDeNroVuelta>1 && this.ReDiDeNroVuelta!=0){
                //en caso de que se vuelva a asignar una tarjeta ausente o castigado
                if(this.val=='02' || this.val=='03'){
                    TaCoHoraSalida='00:00:00'; 
                    TaCoFinish=1;
                    this.guardarObjetoTarjetaDiaLibre(TaCoHoraSalida, TaCoFinish);

                // caso vuelve a aperturar una tarjeta
                }else if(this.val=='01'){

                    //apertura una tarjeta
                    if(this.TarjetaBus_Anterior.TaCoAsignado=='1'){
                            //usar la hroa llegada anterior + reten -- tarjeta anterior asignado
                        if(tiempoRetenValid==true){
                            TaCoFinish=0;
                            //TaCoHoraSalida=this.calculoHoraSalida(this.ReReTiempo,this.tVueltaBus, _hora(this.TarjetaBus_Anterior.HoraLlegada));
                            
                            TaCoHoraSalida=operSHoras(this.ReReTiempo,this.HoraLlegadaTarjAnterior);
                            this.guardarObjetoTarjetaDiaLibre(TaCoHoraSalida, TaCoFinish);
                        }else if(tiempoRetenValid==false){
                            this.validarTiempo="Error al escribir el tiempo";
                        }

                    //tarjeta ausemte o castigado 
                    }else if(this.TarjetaBus_Anterior.TaCoAsignado=='2' || this.TarjetaBus_Anterior.TaCoAsignado=='3'){
                            //usar la horabasesalida del bus que salio antes de actual y ponerle una hora con unos minutos mas
                        if(tiempoSalidaValid==true){
                            TaCoHoraSalida=this.HoraSalidaRecEslavon;
                            TaCoFinish=0;
                            this.guardarObjetoTarjetaDiaLibre(TaCoHoraSalida, TaCoFinish);
                        }else if(tiempoSalidaValid==false){
                            this.validarTiempo="Error al escribir el tiempo";
                        }
                        
                    }
                }
            }
            
        }

        //guardarObjeto una tarjeta  INDIVIDUAL
        guardarObjetoTarjetaDiaLibre(TaCoHoraSalida:string, TaCoFinish:number){
            let _tarjeta:any, tarjEncontrado:number , reten:any;   //console.log(TaCoHoraSalida); 
            
            _tarjeta={
                TaCoId : 0,
                PuCoId : this._PuCoId,
                RuId : Number(this._ruId),
                BuId :this._BuId,
                TaCoFecha :new Date(),
                TaCoHoraSalida :hora(TaCoHoraSalida),
                TaCoCuota :0,
                UsId :this.UsId,
                UsFechaReg :new Date(),
                TaCoNroVuelta : this.ReDiDeNroVuelta,
                PrId : 0,
                TiSaId:this.TiSaObj.TiSaId,
                TaCoAsignado :Number(this.val),
                TaCoTipoHoraSalida:Number('01'), //manual o automatico
                ReDiDeId:this.ReDiDeId,
                TaCoFinish:TaCoFinish,
                CoId:this.CoId,
                TaCoCountMultiple: 1,
                TaCoMultiple: this.TaCoMultiple,
                TaCoCodEnvioMovil: 0,
            }; 
        
            tarjEncontrado=this.buscarTarjetaAsignada(_tarjeta); //si ya esta asignada (grilla principal)

            //PUEDE CREAR LA TARJETA existe uno que no esta terminado o la tarjeta no se a creado
            if(tarjEncontrado==1 || tarjEncontrado==-1 || tarjEncontrado==0){

                //this.msjEsperaGuardando='Guardando tarjeta, espere un momento';
                //this.displayMsjEsperaGuardarTarjeta=true;

                //asignado - nueva tarjeta
                if(this.val=='01'){
                    //vuelta 2da a mas
                    if(this.ReDiDeNroVuelta>1 && this.ReDiDeNroVuelta!=0){
                        //anterior es ausente o castigado
                        if(this.TarjetaBus_Anterior.TaCoAsignado=='2' || this.TarjetaBus_Anterior.TaCoAsignado=='3'){
                            this.procAsigTarjCtrlDiaLibre(_tarjeta);

                        //anterior es asignado
                        }else if(this.TarjetaBus_Anterior.TaCoAsignado=='1'){
                            reten={
                                ReDiDeId:this.ReDiDeId,
                                ReReId:this.ReReId,
                                PrDeId:0,
                                ReReTiempo:hora(this.ReReTiempo),
                                UsId:this.UsId,
                                UsFechaReg:new Date()
                            }
                            console.log(reten);
                            console.log(_tarjeta);
                            this.regRetenService.saveregistroReten(reten).subscribe(
                                data => { 
                                    _tarjeta.ReDiDeId=data.ReDiDeId; 
                                    this.procAsigTarjCtrlDiaLibre(_tarjeta);  
                                },
                                error=>{
                                    alert('No se pudo crear la tarjeta, Error R');
                                    console.log(error);
                                }
                            );
                        }
                    //1era vuelta
                    }else if(this.ReDiDeNroVuelta==1){
                        this.procAsigTarjCtrlDiaLibre(_tarjeta);
                    }

                //ausente o castigado  - nueva tarjeta
                }else if(this.val=='03' || this.val=='02'){
                    this.procAsigTarjCtrlDiaLibre(_tarjeta);
                }

            }else{
                alert("no puede crear la tarjeta");
            }
            this.validarTiempo=""; this.val='x';
        }
    
        //limpiando campos al guardar tarjeta
        limpiarCamposGuardarTarjetaDiaLibre(){
            this.selectedPlacaONE=[];
            this.val=null;
            this.mensaje="";
        }

        onRowPlacaDiaLibre(event){
            console.log(event.data);
            let TarjetaBus_Anterior:any;  
            let BuPlaca:string=event.data.BuPlaca;
            this.objSelectedRowTableIndividual=event.data;
            this.objSelectedRowTableMultiple=event.data;
            this._prDeId = event.data.PrDeId;
            this._BuId=event.data.BuId;                    
            this._TaCoNroVuelta=event.data.PrDeCountVuelta;  
            this.PrDeAsignadoTarjeta=event.data.PrDeAsignadoTarjeta; 
            this.estadoPlaca=event.data.TaCoAsignado;   
            this.TaCoHoraSalida=event.data.TaCoHoraSalida;
            this.HoraLlegadaTarjActual=event.data.HoraLlegada;
        
            this.buscarHoraSalidaAnterior(BuPlaca);
            
            console.log(this.ReDiDeNroVuelta);
            if(this.ReDiDeNroVuelta>1){

                this.TarjetaBus_Anterior=this.estadoTarjetaAnterior(this.extraRegistroDiario(this.arrCuadro), this.ReDiDeNroVuelta, this._BuId);
                if(this.TarjetaBus_Anterior.TaCoAsignado=='1'){
                    this.modoTarjeta=0; //cuando la anterior tarjcontrol es asignado        FORMULARIO ADAPTADO
                    
                }else if(this.TarjetaBus_Anterior.TaCoAsignado=='2' || this.TarjetaBus_Anterior.TaCoAsignado=='3'){
                    this.modoTarjeta=1; //cuando la anterior tarjcontrol es ausente o castiga   FORMULARIO ADAPTADO 
                }

                this.HoraLlegadaTarjAnterior=_hora(this.TarjetaBus_Anterior.HoraLlegada); // para la segunda vuelta a más
                //inputs formulario una sola tarjeta
                //console.log(this.HoraLlegadaTarjAnterior);
            }else if(this.ReDiDeNroVuelta==1){
                this.modoTarjeta=2;
            }

            console.log(this.estadoPlaca);
            //activando o desactivando input segun el estado de la placa
            if(this.estadoPlaca==0){
                console.log(this.nroTarjetas);
                if(this.nroTarjetas==1){
                    console.log(this.ReDiDeNroVuelta);
                    console.log(this.modoTarjeta);
                    console.log(this.val);
                    this.ftnActivarInputFormUnaTarjetaDiaLibre(this.ReDiDeNroVuelta, this.modoTarjeta, this.val);
                }else if(this.nroTarjetas>1){
                    this.ftnActivarInputFormMultiplesTarjetaDiaLibre(this.ReDiDeNroVuelta, this.modoTarjeta, this.estadoPlaca, this.val);
                }
            }else if(this.estadoPlaca==1 || this.estadoPlaca==2 || this.estadoPlaca==3){
                this.ftnActivarInputFormMultiplesTarjetaDiaLibre(this.ReDiDeNroVuelta, this.modoTarjeta, this.estadoPlaca, this.val);
            }

            //mensaje nro maximo de tarjetas a crear
            if(this.estadoPlaca==0){
                this.nroMultiTarjetas=this.nroTarjetas;
            }else if(this.estadoPlaca==1 || this.estadoPlaca==2 || this.estadoPlaca==3){
                this.nroMultiTarjetas=this.nroTarjetas-1;
            }
        }

        funCboEstTarjAperturaDiaLibre(){
            //console.log(this.val);   console.log(this.modoTarjeta);
            console.log(this.nroTarjetas); 
            if(this.nroTarjetas==1){
                
                this.ftnActivarInputFormUnaTarjetaDiaLibre(this.ReDiDeNroVuelta, this.modoTarjeta, this.val);
            }else if(this.nroTarjetas>1){
                this.ftnActivarInputFormMultiplesTarjetaDiaLibre(this.ReDiDeNroVuelta, this.modoTarjeta, this.estadoPlaca, this.val);
            }   
        }

        ftnActivarInputFormUnaTarjetaDiaLibre(
                        ReDiDeNroVuelta:number, 
                        estadoTarjetaAnterior:number, 
                        estadoTarjetaApertura:string){

            //console.log(ReDiDeNroVuelta);  
            //console.log(estadoTarjetaAnterior);  
            //console.log(estadoTarjetaApertura);
            
            if(ReDiDeNroVuelta!=0 && estadoTarjetaAnterior!=-1 && estadoTarjetaApertura!='x'){
                //primera vuelta, no existe estadoAnterior
                if(ReDiDeNroVuelta==1 && estadoTarjetaAnterior==2 && 
                    (estadoTarjetaApertura=='01' || estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03')){
                    this.actInputTHora=true; 
                    this.actInputReten=true; 
                    this.actInputHoraSalida=true;
                    this.actInputHoraInitDiaLibre=false;

                //vuelta mayor a 1 && estadoanterior asignado
                }else if(ReDiDeNroVuelta>1 && estadoTarjetaAnterior==0){
                    if(estadoTarjetaApertura=='01'){
                        this.actInputTHora=false; 
                        this.actInputReten=false; 
                        this.actInputHoraSalida=true;
                        this.actInputHoraInitDiaLibre=true;
                    }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                        this.actInputTHora=true; 
                        this.actInputReten=true; 
                        this.actInputHoraSalida=true;
                        this.actInputHoraInitDiaLibre=true;
                    }

                //vuelta mayor a 1 && estadoanteriro ausente o castigado
                }else if(ReDiDeNroVuelta>1 && estadoTarjetaAnterior==1){
                    //asignado
                    if(estadoTarjetaApertura=='01'){
                        this.actInputTHora=true; 
                        this.actInputReten=true; 
                        this.actInputHoraSalida=false;
                        this.actInputHoraInitDiaLibre=true;
                    //ausente o castigado
                    }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                        this.actInputTHora=true; 
                        this.actInputReten=true; 
                        this.actInputHoraSalida=true;
                        this.actInputHoraInitDiaLibre=true;
                    }
                }
            }
            
        }
            
        //asctivando inputs para multiple tarjeta
        ftnActivarInputFormMultiplesTarjetaDiaLibre(ReDiDeNroVuelta:number, estadoTarjetaAnterior:number, estadoTarjetaActual:number, estadoTarjetaApertura:string){
            //console.log(ReDiDeNroVuelta);  console.log(estadoTarjetaAnterior);  console.log(estadoTarjetaApertura);
            
            if(ReDiDeNroVuelta!=0 && estadoTarjetaAnterior!=-1 && estadoTarjetaApertura!='x'){
                //ReDiDeNroVuelta   :  vuelta actual de todo el dia
                //estadoTarjetaAnterior : tipo de tarjeta creada anterior a la vuelta actual (0: asignado, 1: ausente o castigado)
                //estadoTarjetaApertura :   tipo de tarjeta a crear ('01': asignado, '02': ausente o  '03' : castigado)
                //estadoTarjetaActual

                //primera vuelta y no hay estadoanterior
                if(ReDiDeNroVuelta==1  && estadoTarjetaAnterior==2){
                    //estado actual tarjeta = asignado
                    if(estadoTarjetaActual==1){
                        //asignado (creando tarjeta)
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=false; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=true;

                        //ausente o castigado (creando tarjeta)
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    
                    //estado actual tarjeta = ausente o castigado
                    }else if(estadoTarjetaActual==2 || estadoTarjetaActual==3){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //estado actual tarjeta = no asignado
                    }else if(estadoTarjetaActual==0){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=true;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    }

                //vuelta mayor a 1 && estadoanterior = asignado
                }else if(ReDiDeNroVuelta>1 && estadoTarjetaAnterior==0){
                    //asignado anterior
                    if(estadoTarjetaActual==1){
                        //asignado a asignar
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=false; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=true;

                        //ausente o castigado a asignar
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //castigado ausente
                    }else if(estadoTarjetaActual==2 || estadoTarjetaActual==3){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //no asignado
                    }else if(estadoTarjetaActual==0){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=false; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=true;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    }

                //vuelta mayor a 1 && estadoanteriro = ausente o castigado
                }else if(ReDiDeNroVuelta>1 && estadoTarjetaAnterior==1){
                    //tarjeta asignada
                    if(estadoTarjetaActual==1){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //tarjeta ausente o castigado
                    }else if(estadoTarjetaActual==2 || estadoTarjetaActual==3){
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    //tarjeta no asignado
                    }else if(estadoTarjetaActual==0){                
                        //asignado
                        if(estadoTarjetaApertura=='01'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=false; 
                            this.actMInputHoraEslavon=false;

                        //ausente o castigado
                        }else if(estadoTarjetaApertura=='02' || estadoTarjetaApertura=='03'){
                            this.actMInputPrimerReten=true; 
                            this.actMInputRepeatReten=true; 
                            this.actMInputHoraEslavon=true;
                        }
                    }

                }

            }
            
        }

        funcCboPuntosControlIdDiaLibre(event:Event){
            let PuCoId = this.puntoControl.PuCoId, ruID = this.puntoControl.RuId;
            this.tVueltaBus=this.puntoControl.PuCoTiempoBus; this.PrDescripcion=editf1(fechaActual1());

            //cuadro para la visuacion de todas las salidas
            //this.getallregistrovueltasdiariasbyemprfe(this.emID,this._prId,slash_posFecha(fechaActual2()));
            
            //buscando redediid 
            if(this.ReDiDeNroVuelta!=1){
                this.getAllRegDiarioDetalle(this.ReDiId);
            }

            this._RuId = ruID; this._PuCoId = PuCoId;  

        }

        funcCboTipoTarjetaDiaLibre(){
            //multiple
            if(this.TaCoMultiple==1){
                this.nroTarjetas=this.ReDiTotalVuelta-this.ReDiDeNroVuelta+1;
                this.procNewRegistroReten();
                    //input horas para multiples tarjeta
                    this.actMInputPrimerReten=true;
                    this.actMInputRepeatReten=true;
                    this.actMInputHoraEslavon=true;

            //individual
            }else if(this.TaCoMultiple==0){
                this.nroTarjetas=1;
                this.procNewRegistroReten();
                //input horas para una sola tarjeta
                this.actInputTHora=true;
                this.actInputReten=true;
                this.actInputHoraSalida=true;
            }
            
            this.mensaje="";  
            this.estadoPlaca=-1;
            this.mnjNroTarjetaValido="";
            
            this.getalltarjetacontrolbybuidfecha(0,cCeroFechaForEditar(fechaActual2())); //grilla principal :s
    
        }

            /*UNA SOLA TARJETA*/
        procAsigTarjCtrlDiaLibre(_tarjeta:any){
            console.log(_tarjeta);
            let sigVuelta:number;
            /* PROCEDURE ASIGNAR TARJETA (UNA SOLA) */
            this.tcontrolservice.asignarTarjetaControl(_tarjeta).subscribe(
                data => {   
                            if(data==true){
                                //sigVuelta= this.buscarUltimaPlacaProgr(this.objSelectedRowTableIndividual, this.arrprogxfecha);                              
                                this.updateGetAllTarjetaControlbyEmRedideIndividualDiaLibre(this.emID,this.ReDiDeId, sigVuelta);
                            }                               
                        }, 
                err  => {this.errorMessage=err}
            );
        }

        aceptarPasarSgteVueltaDiaLibre(){
            this.mensajesigvuelta='';
            this.displayPasarSgteVuelta=false;
        }


        //tarjeta individual, refrescar la tabla de formulario asignar tarjeta DIA LIBRE
        updateGetAllTarjetaControlbyEmRedideIndividualDiaLibre(emid:number,reDiDe:number, sigVuelta:number){
            let arrCuadroDL:any[]=[], index:number;
            this.tcontrolservice.getalltarjetacontrolbyemredide(emid,reDiDe).subscribe(
                data => {
                    arrCuadroDL=data;  
                    console.log(arrCuadroDL);

                    /*if(arrCuadro.length!=0 && arrCuadro.length>0){                                         
                        this.estadoPlaca=-1; //no hay placa seleccionada de la tabla
                        this.arrCuadro=arrCuadro;  this.ReReTiempo=null; this.arrCuadroBusqueda=arrCuadro; //para la busqueda y validacion de reten
                        this.msjEsperaGuardando=''; this.displayMsjEsperaGuardarTarjeta=false;
                                    
                        //console.log(this.ReDiDeNroVuelta); console.log(this.ReDiId);
                        console.log('sigVuelta: '+sigVuelta);
                        if(sigVuelta==1){ //si fuera la ultima vuelta

                            this.ReDiDeNroVuelta++; //pasando a la sgte vuelta
                            this.ReDiDeId++;     //pasando a la sgte vuelta

                            if(this.ReDiDeNroVuelta>this.ReDiTotalVuelta){
                                this.ReDiDeNroVuelta--; this.ReDiDeId--;
                                alert('se termino todas las vueltas');
                            }else if(this.ReDiDeNroVuelta<this.ReDiTotalVuelta){
                                this.mensajesigvuelta='Termino la vuelta, pasando a la siguiente';  
                                this.displayPasarSgteVuelta=true;
                                this.concatenarRegDiarioProgxFecha(this.mgprogDetalle(this.progDetalle), this.extraRegistroDiario(this.arrCuadro));   
                            }
                            
                        //no es la ultima vuelta
                        }else{                                    
                            this.concatenarRegDiarioProgxFecha(this.mgprogDetalle(this.progDetalle), this.extraRegistroDiario(this.arrCuadro));   
                            //voliendo a seleccionar el row datatable individual tarject
                            index=this.buscarObjetoTablaIndividual(this.arrprogxfecha, this.objSelectedRowTableIndividual);
                            this.selectedPlacaONE=this.arrprogxfecha[index];                                    
                        }                         
                    }else{
                        
                    }*/

                        },
                error=> {alert('Error en el cuadro de salidas, vuelva a intentarlo');},
                ()   => {}
            );
        }
}