import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {ProgramacionService} from '../service/prog.service';
import {PlacasService} from '../service/placas.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {ConfiguraService} from '../service/configura.service';
import {RegDiarioService} from '../service/registrodiario.service';
import {GlobalVars} from 'app/variables';
import {ProgBaseService} from '../service/programacionBase.service';
import {hora,formatFechInArr,_fnroDias,fecha,cCeroFechaForEditar,arrABI,arrANBI,_hora, 
        tipoAnio,_fecha1,_fecha2,slash_posFecha,guion_posFecha,horaValida,
        formatFech,addDays,operSHoras,_addDays,editf1,
        fechaActual1,fechaMayor, cambianBuIdxNroPlaca,numRandom} from 'app/funciones';


declare var jsPDF: any; //PARA PASAR HTML A PDF 
@Component({
    selector: 'app-prog',
    templateUrl	: '../views/prog.component.html',
    styleUrls: ['../styles/prog.component.css']
})

export class ProgComponent implements OnInit{
    /* OBJETOS */
        private progMaestro: any={
            PrId:0,     //oculto
            EmId:0,     //oculto
            PrCantidadBuses:0,
            PrDescripcion:"",
            PrFecha:"",     //oculto
            PrFechaInicio:"",
            PrFechaFin:"",
            PrTipo:"",      
            PrAleatorio:true,
            UsId:0,        //oculto
            UsFechaReg:""   //oculto
        }
        private progDetalle: any={
            PrId:23,     //oculto
            BuId:0,     //oculto
            PrDeFecha:"", //oculto
            PrDeBase:true, //oculto (true)
            PrDeOrden:0, //placas sorteo manual
            UsId:0,     //oculto
            UsFechaReg:"",//oculto
        }

    /* VARIABLES */
        private PrDescripcion:string;
        private PrFecha:Date;
        private PrBaDiasIncluidos:string;
        private PrBaHoraBase:string;
        private PrBaId:number;
        private PrBaDescripcion:string;
        private PrBaFechaInicio:string;
        private PrBaFechaFin:string;
        private PrFechaInicio:string;
        private PrFechaFin:string;
        private indexPlacaTabHSal:number;
        private nroTotalMinibuses:number;
        private nroMiniBus:number;
        private horaBase:string;
        private horaIncremento:string;
        private emid:number;
        private userid:number;
        private PrId:number;
        private valSuEmIdCreateProg:boolean;
        private mnjValSuEmIdCreateProg:string;
        private disabledbutton: boolean = false;
        private errorMessage:string='';  //mensaje error del rest
        private isLoading: boolean = false;  
        private _progrMaestro:any; /* SALVA OBJETO PROGCABECERA DE GETPROGRAMACIONBYID() */
        private progDescripcion:string; /* PARA EDITAR PROGRAMACION */
        private lengthProgDet:number;
        //objeto maestro para Mandar al rest
        private objProgVentanaUno : any; // objeto para almacenar datos 1era ventana modal para mandarlo o borrar del sistema al cancelar o guardar
        //objeto detalle para mandar al rest
        private objProgVentanaDos : any; //nuevo detalle 
        private nroColumn:number;
        private bAct:number; //NRO BUSES ACTIVOS
        //private bNAct:number; //NRO DE BUSES NO ACTIVOS
        private tipoProg:number;    //MANUAL O AUTOMATICA
        private formaProg:string;   //ESCALA O PESCADITO
        private titArchivoPDF:string;
        private nomArchivoPDF:string;
        private primerHSal:string;
        private PrDiasIncluidos:string;
         //para seleccionar una fila de la tabla
        //private idFilaSeleccionada: number;  CLICK SOBRE REG GRILLA
        private iDReg:number;       //CLICK BOTON DE FILA ELIMINAR
        private PrCantidadBuses: number;
        private dias: number;
        private titleNuevoProgPrimerModal:string;  
        private mensaje:string;     //MENSAJE CONFIRMACION MODAL 
        private mensajeEspera:string;
        private mensajeProcesando:string;
        private resBusUnidades:string; /* PARA EL FORMULARIO DE NUEVA PROGRAMACION */
        private modEdit:boolean; /* modEdit=1: editando registro  modEdit=0: no se esta editando registro */
        private placaEditarCelda:number;
        private progValida:string;
        /* ARRAYS */
        //private arrHoraBase:any[]=[];
        private selectedPlacas: string[] = []; /* NO USO */
        private placas:any[]=[]; //se utiliza para almacenar lo q devuelve el rest de las placas
        private placasComplet:any[]=[];
        //datos para la picklist (prog base)
        private arrayPlacas:any[] = []; //ESTATICO
        private _arrayPlacas:any[] = []; //DINAMICO
        private ordenSorteo:any[] = []; 
        //private programacionMaestroArrayMemoria :any[]=[]; /* NO USO */
        private programacionMaestroArrayHTML :any[] = [];  //array para la grilla HTML
        private arrAllProgmByPrBa:any[]= [];/* NO USO */
        private progDetalleArray:any[]=[];/* NO USO */
        private programacionArrayDetalleBD:any[]=[]; //array objetos detalle para mandar al rest
        private _programacionArrayDetalleBD:any[]=[];
        private _tipoProg:any[]=[];
        private _formaProg:any[]=[];
        private diasSemana:any[]=[];
        private dtSelectDias:any[]=[];
        //variables, se recupera las programaciones desde el servidor rest
        private progRest:any[]=[];
        //private progRestMaestro:any[]=[]; /* NO USO */
        private progBDDetalle:any[]=[]; // para recoger resultado de la BD
        //private _progBDDetalle:any[]=[]; /* NO USO */
        private arrAllSubEmpAgrup:any[]=[];
        private nroMiniBusHeader:number;
        private modo:string; 

    // COLUMNAS DEL DATATABLE PRIMENG
        private columnas:any[]=[];
        private _columnas : SelectItem[];
        private _detalle:any[]=[];
        private nroDias:any[]=[];
        private calendario:any[]=[]; /* CALENDARIO NUMERICO  QUITAR ESTO*/
        private calendarioNumeric:any[]=[]; /* CALENDARIO NUMERICO - NO EN USO */
        private calendarioString:any[]=[]; /*  CALENDARIO EN DIAS DE LA SEMANA */
        private calNumb:any[]=[];
        private calString:any[]=[];
        private anio:number;
        private arrHoraBaseSal:any[]=[];
        private arrSubEmp:any[]=[];
        private SuEmId:number;
        private CoSiId:number;
        private CoNroMaxVueltas:number;
        private CoId:number;
        private objConfigSystem:any;
        private arrAllSubEmp:any[]=[];
        private arrAllSubEmpByDays:any[]=[];
        private arrAllProgBase:any[]=[];
    /* DISPLAY VENTANAS MODALES */
        private displayConfDelProgram:boolean =false;
        private displayNuevaProgramacion: boolean = false;
        private displayProgramacionBase: boolean = false;
        private displayProgramacion: boolean = false;
        private displayNuevaSubProg:boolean=false;
        private displayConfDelProgBase: boolean = false; /* CONFIRMAR ELIMINAR REG PROGRAMACION */
        private displayAvisoNoPuedeBorrarProg:boolean=false;
        private displayAceptarProgNueva : boolean = false;
        private displayIniciandoProgramacion:boolean=false;
        private displayErrorDatos : boolean = false; // PRIMERA VENTANA MODAL PROGRAMACION
        private displayErrorTablaProgramacion : boolean=false; // ERROR EN LA TABLA DE PROGRAMACION
        private displayFaltanPlacas : boolean = false;
        private displayDescargaProg : boolean = false;
        private displayEditProgC : boolean = false;
        private displayDatosPDF:boolean=false;
        private displayFormHorasBase:boolean=false;
        private displayErrorCargarPlacas=false;
        private displayTerminoTodoGenerarProg=false;
        private displayMensajeEspera=false;
        private displayErrorFechIngrFormUno=false;
        private displayNewProgmBase=false;
        private displayOrdSubEmpBaseRegDiario=false;
        private displaySorteoProg=false;
        
    ngOnInit(){
        /*console.log(fechaSgte("2017/02/07",32));*/  /* TERMINAR ESTO */
        this.ordenSorteo = [];
        //this.getAllPlacasBusByEmSuEm(this.emid,0); 
        //this.getAllProgramacionByEm(this.emid,this.anio); /* EMID + AÑO */
       this.getAllProgramacionBaseByEm(this.emid,this.anio);
        //console.log(this.descartarFechas(this.calendarioNumerico('2017-11-13', '2017-12-13'), '1,1,1,0,1,0,1'));
    }
    
    constructor(private programacionService: ProgramacionService, 
                private empSubEmpService:EmpSubEmpService,
                private placasservice: PlacasService,
                private configService : ConfiguraService,
                private progBaseService:ProgBaseService,
                private regDiarioService:RegDiarioService,
                public ClassGlobal:GlobalVars){
        this.emid=this.ClassGlobal.GetEmId();
        this.userid=this.ClassGlobal.GetUsId();
        this.lengthProgDet=0;
        this.anio=0;
        this.PrBaId=0;
        this.PrId=0;
        this.progMaestro.EmId = 1; /* ELIMINAR ESTO */
        this._tipoProg =[ {id:0,nTipo:"automatico"},{id:1,nTipo:"manual"} ];
        this._formaProg=[ {id:"01", nForma:"pescadito"},{id:"02", nForma:"escala"}];
        this.nroMiniBus=0;
        this.nroMiniBusHeader=0;
        this.nroTotalMinibuses=0;
        this.diasSemana=[
            {id:0,nro:1, nomb:'Lunes',value:1},
            {id:1,nro:2, nomb:'Martes',value:2},
            {id:2,nro:3, nomb:'Miercoles',value:3},
            {id:3,nro:4, nomb:'Jueves',value:4},
            {id:4,nro:5, nomb:'Viernes',value:5},
            {id:5,nro:6, nomb:'Sabado',value:6},
            {id:6,nro:7, nomb:'Domingo',value:0},
        ];
        this.valSuEmIdCreateProg=false;
        this.mnjValSuEmIdCreateProg='';
    }
    
    funcCboAllBusBySuEmId(){
        console.log("SuEmId: "+this.SuEmId);
        this.valSuEmIdCreateProg=this.funcBuscarSuEmId(this.arrAllSubEmpAgrup,this.SuEmId);
        
        if(this.valSuEmIdCreateProg==true){
            this.resBusUnidades='';
            this.mnjValSuEmIdCreateProg='Ya esta asignada';
        }else if(this.valSuEmIdCreateProg==false){
            this.mnjValSuEmIdCreateProg='';
            this.placasservice.getAllPlacasBusByEmSuEm(this.emid,this.SuEmId).subscribe(
                data=>{
                    this.unidadesEstado(data);
                },error=>{},
                ()=>{}
            );
        }
        
    }

    funcBuscarSuEmId(arrSubEmp=[], suemid:number):boolean{
        let cen:number=0, i:number=0, result:boolean;
        while(i<arrSubEmp.length && cen==0){
            if(arrSubEmp[i].SuEmId!=suemid){
                i++; cen=0;
            }else if(arrSubEmp[i].SuEmId==suemid){
                cen=1;
            }
            
        }
        if(cen==1){
            result=true;
        }else if(cen==0){
            result=false;
        }
        return result;
    }
    funcCalendarioNumerico(refFecha1:string, refFecha2:string){
        let diaHoy = new Date(); 
        let arrCalendar:any[]=[]; 
        let i:number=1; 

        let f1=refFecha1.split('-'); 
        let f2=refFecha2.split('-'); 
        let nf1, nf2;
        
        nf1=_fnroDias(f1); nf2=_fnroDias(f2); 
        

        let nroDias:number=nf2 - nf1; 
        let initfecha = fecha(refFecha1);

       
        let arrDaysSemana:any[]=[];
        arrCalendar[0]=fecha(refFecha1).getTime();
        while(i<nroDias){ 
            arrCalendar[i]=new Date( arrCalendar[0]+(i*(24*60*60*1000)) + 24*60*60*1000);  
            i++; 
        }
        arrCalendar[0]=new Date(arrCalendar[0]);
        return arrCalendar;
    }
            
    //QUITAR DIAS DE LA SEMANA DE TODO EL CALENDARIO
    descartarFechas(arrFechas=[], diasValidos:string){
        let fechasValidas=[], arrDiasValidos=diasValidos.split(',');
        let i:number=0, j=0, _arrDiasValidos=[];
        console.log(diasValidos);

        while(j<arrDiasValidos.length){

            if(arrDiasValidos[j]=='1'){
                if(j>=0 && j<6){
                    _arrDiasValidos.push(j+1);
                }else if(j==6){ 
                    _arrDiasValidos.push(0) 
                }
            }
            j++;

        }
        console.log(_arrDiasValidos);

        while(i<arrFechas.length){
            if(this.validarFechaCalendario(arrFechas[i],_arrDiasValidos) == 1 ){
                fechasValidas.push(arrFechas[i]);
            } else if(this.validarFechaCalendario(arrFechas[i],_arrDiasValidos) == 0 ){

            }
            i++;
        }
        
        //console.log(fechasValidas);
        return fechasValidas;
    }

    validarFechaCalendario(fecha:Date, arrDiasValidos=[]):number{
        let i=0;  let cen=0; let _arrDiasValidos=arrDiasValidos;
        
        while(i<arrDiasValidos.length && cen==0){
            if(fecha.getDay()==_arrDiasValidos[i]){
                cen=1;
            }else if(fecha.getDay()!=_arrDiasValidos[i]){
                i++;
                cen=0;
            }
        }
        return cen;
    }

    /* FUNCION VALIDAR FECHA DE INICIO DE LA PROGRAMACION */
    funcValidaFIni(fant:string, fini:string):boolean{
        let arrfant=fant.split("-"), arrfini=fini.split("-"), resp:boolean;
        /* A_ANT: año anterior, A_INI: año inicio */
        /* M_ANT: mes anterior, M_INI: mes inicio */
        /* D_ANT: dia anterior, D_INI: dia inicio */

        /* A_ANT MENOR A A_INI */
        if(arrfant[0]<arrfini[0] ){
            resp=true;
        /* A_ANT IGUALES A_INI */
        }else if( arrfant[0]==arrfini[0]  ){
            /* M_ANT MENOR A M_INI */
            if(arrfant[1]<arrfini[1]){
                resp=true;
            /* M_ANT IGUALES A M_INI */
            }else if(arrfant[1]==arrfini[1]){
                /* D_ANT MENOR A D_INI */
                if(arrfant[2]<arrfini[2]){
                    resp=true;
                /* D_ANT IGUALES A D_INI */
                }else if(arrfant[2]==arrfini[2]){
                    resp=false;
                /* D_ANT MAYOR A D_INI */
                }else if(arrfant[2]>arrfini[2]){
                    resp=false;
                }

            /* M_ANT MAYOR A M_INI */
            }else if(arrfant[1]>arrfini[1]){
                resp=true;
            }
            
        /* A_ANT MAYOR A A_INI */
        }else if(arrfant[0]>arrfini[0]){
            resp=false;
        }

        return resp;
    }
    
    /* OBTENER ULTIMA FECHA PARA VALIDAR FECHAS DE LA SIGUEINTE PROGRAMACION */
    ultFecha(arrAllProg=[]):string{
        let f:string;
        f=_fecha1(arrAllProg[arrAllProg.length - 1].PrFechaFin);
        f=formatFech(slash_posFecha(f));
        return f;
    }

    fcboTipoProg(){
        console.log(this.tipoProg);
    }

    formaProgramacion($event){
        console.log(this.formaProg);
    }

    /* PROCEDURES */
        /* ACTUALIZACION */
            /* NUEVO */
                procNuevaProgrC(){
                    let _finicio = editf1(fechaActual1());
                    let _ffinal  = editf1(addDays(editf1(fechaActual1()),30));

                    this.programacionService.newProgramacion().subscribe(
                        data => { this.progMaestro=data; 
                                  this.progMaestro.PrDescripcion="Programacion";
                                  this.progMaestro.PrFechaInicio=_finicio;
                                  this.progMaestro.PrFechaFin=_ffinal;
                                }
                    );
                }
            /* NUEVA PROG DETALLE */
                nuevaProgramacionDetalleRest(){
                    this.programacionService.newProgramacionDetalle()
                        .subscribe(data => {this.objProgVentanaDos = data});
                }
            /* GUARDAR */
                /* CABECERA */
                procSaveProgramacion(objProg:Object){
                    this.programacionService.saveProgramacion(objProg).subscribe( 
                        data => {this.progMaestro=data;  //RECUPERANDO OBJETO PARA SACAR EL PRID
                                    this.PrId=data.PrId;
                                 if(this.modEdit==true){
                                    this.getAllProgramacionByEm(this.emid,this.anio);
                                    this.mostrargrillaProgramacionMaestro(this.progMaestro) ;
                                 }else if(this.modEdit==false){
                                    this.getAllProgramacionByEm(this.emid,this.anio);
                                    this.mostrargrillaProgramacionMaestro(this.progMaestro) ;
                                 }
                                
                        }, 
                        err => {this.errorMessage = err});
                }
                /* DETALLE */
            /* ELIMINAR */
                procEliminarProgr(prid:number){
                    this.programacionService.deleteProgramacionByid(prid).subscribe(
                        realizar => {
                                        this.getAllProgramacionByEm(this.emid,this.anio); 
                                        this.displayConfDelProgBase=false;
                                    },
                        err => {this.mensaje="No puede borrar esta programacion, esta siendo utilizada";
                                this.displayAvisoNoPuedeBorrarProg=true;    
                                this.displayConfDelProgBase=false;
                                console.log(err);}
                    );
                }
        /* GETTERS -> RECUPERANDO DATOS */
            /*consulta programaciones base */
            getAllProgramacionBaseByEm(EmId:number,anio:number){
                this.progBaseService.getAllProgramacionBaseByEm(EmId,anio).subscribe(
                    data=>{
                        this.mgAllProgramacionBaseByEm(data);
                        let añoActual=new Date().getFullYear().toString();             
                        this.configService.getAllConfiguraByEmPeriodo(this.emid,añoActual).subscribe(
                        data=>{     
                            this.CoSiId=data[0].CoSiId;            
                            this.CoNroMaxVueltas=data[0].CoNroMaxVueltas;                       
                            //empresa con varias subempresas
                            if(this.CoSiId==2){
                                this.empSubEmpService.getallsubempresasbyemid(this.emid).subscribe(
                                    data=>{
                        
                                        //agrupando programaciones por fechas - retorna array de arrays de programaciones
                                        this.arrAllSubEmpAgrup=this.funcAgruparProgByFechas(this.progRest);

                                        //validar nro de programaciones por subempresa creadas
                                        console.log(this.arrAllSubEmpAgrup); 
                                        
                                        //validando el ultimo grupo de programaciones
                                        this.funcValidAllProgByFechas(this.arrAllSubEmpAgrup[this.arrAllSubEmpAgrup.length-1]);
                                    },error=>{

                                    },()=>{}
                                );
                                

                            //empresa con una sola subempresa
                            }else if(this.CoSiId==1){

                            }
                            
                        },error=>{

                        },()=>{})
                    },
                );
            }
            mgAllProgramByPrBa(arrProgByPrBa=[]){
                let arrProgm:any[]=[]
                for(let progm of arrProgByPrBa){
                    arrProgm.push({
                        Nro:0,
                        EmConsorcio:progm.EmConsorcio,
                        PrBaId:progm.PrBaId,
                        PrCantidadBuses:progm.PrCantidadBuses,
                        PrDiasIncluidos:progm.PrDiasIncluidos,
                        PrFecha:progm.PrFecha,
                        PrFechaFin:progm.PrFechaFin,
                        PrFechaInicio:progm.PrFechaInicio,
                        PrTipo:progm.PrTipo,
                        _PrTipo:"",
                        PrAleatorio:progm.PrAleatorio,
                        _PrAleatorio:"",
                        SuEmId:progm.SuEmId,
                        SuEmRSocial:progm.SuEmRSocial,
                        dias:progm.dias,
                        prDescripcion:progm.prDescripcion,
                        PrId:progm.prId
                    });
                }
                for(let i=0; i<arrProgm.length; i++){
                    arrProgm[i].Nro=i+1;
                    if(arrProgm[i].PrTipo=='0'){
                        arrProgm[i]._PrTipo="Pescadito";
                    }else{
                        arrProgm[i]._PrTipo="Escala";
                    }
                    if(arrProgm[i].PrAleatorio==true){
                        arrProgm[i]._PrAleatorio="Automatico";
                    }else{
                        arrProgm[i]._PrAleatorio="Manual";
                    }
                }
                this.arrAllProgmByPrBa=arrProgm;
            }

            mgAllProgramacionBaseByEm(arrProgBase=[]){
                let arrAllProgBase:any[]=[]; 
                for(let progBase of arrProgBase){
                    arrAllProgBase.push({
                        Nro:0,
                        EmConsorcio:progBase.EmConsorcio,
                        EmId:progBase.EmId,
                        PrBaDescripcion:progBase.PrBaDescripcion,
                        _PrBaFecha:_fecha1(progBase.PrBaFecha),
                        _PrBaFechaFin:_fecha1(progBase.PrBaFechaFin),
                        _PrBaFechaInicio:_fecha1(progBase.PrBaFechaInicio),
                        PrBaFecha:progBase.PrBaFecha,
                        PrBaFechaFin:progBase.PrBaFechaFin,
                        PrBaFechaInicio:progBase.PrBaFechaInicio,
                        PrBaId:progBase.PrBaId,
                        PrDiasIncluidos:progBase.PrDiasIncluidos,
                        _PrDiasIncluidos:this.convertDiasIncluidos(progBase.PrDiasIncluidos),
                        dias:progBase.dias,
                    });
                }
                for(let i=0; i<arrAllProgBase.length;i++){
                    arrAllProgBase[i].Nro=i+1;
                }
                this.arrAllProgBase=arrAllProgBase;
            }
            /*CONSULTA PROGRAMACION DETALLE*/
            getallprogramaciondetallebyprid(_prid:number, arrPlacaSorteo=[]){
                this.programacionService.getAllProgramacionDetalleByPrId(_prid).subscribe(
                    data => {
                        this.progBDDetalle = data; 
                        this.lengthProgDet=this.progBDDetalle.length;

                        if(this.lengthProgDet!=0){
                            this.nroMiniBus=0; 
                            this.nroTotalMinibuses=-1;
                            this.mensajeProcesando="Procesando nueva programacion";
            
                            this.cargarPrDeId(arrPlacaSorteo,this.progBDDetalle);
                        }else if(this.lengthProgDet==0){
                            this.mensaje="Se encontro un error, elimine y vuelva a generarlo";
                            this.lengthProgDet=1;
                        }
                    },
                    err => {this.errorMessage=err},
                    () => this.isLoading=false
                );
            }

            //CARGAR PRDEID para guardar horabasesalida
            cargarPrDeId(arrProgBase=[], arrProg=[]){
                
                for(let i=0; i<this.ordenSorteo.length ; i++){
                    arrProgBase[i].PrDeHoraBase=hora(this.ordenSorteo[i].HoraBase);
                } 

                for(let i=0; i<arrProgBase.length; i++){
                    arrProgBase[i].PrDeId=arrProg[i].PrDeId;
                }
                this.programacionService.saveProgDetalleHsalida(arrProgBase).subscribe(
                    realizar => {   console.log(realizar);
                                    if(realizar==true){
                                        this.lengthProgDet=0;
                                        this.displayTerminoTodoGenerarProg=true;
                                        this.mensaje="Se Genero Correctamente La Programacion";
                                    }else if(realizar==false){
                                        this.lengthProgDet=0;
                                        this.displayTerminoTodoGenerarProg=true;
                                        this.mensaje="Hubo un problema al generar la programaicon";
                                    }
                    },
                    error => {},
                    () => {}
                );
            }

            aceptarGenProgComplet(){
                this.mensaje="";
                this.displayTerminoTodoGenerarProg=false;
            }

            /* CONSULTA PROGRAMACION CABECERA POR SU ID - USANDO EN EDITAR PROGRAMACION */
            getProgramacionById(prid : number){
                this.programacionService.getProgramacionById(prid).subscribe(
                    data => {
                            this._progrMaestro = data;
                            this.progDescripcion = this._progrMaestro.PrDescripcion;
                            //console.log(this._progrMaestro);
                    },
                    err => {this.errorMessage=err},
                    () => this.isLoading=false
                );
            }

            //CONSULTA RECUPERAR BUSES POR empId(id de empresa)  suemId(subempresa id) SOLO DA LOS BUSES ACTIVOS
            getAllPlacasBusByEmSuEm(empId: number, suemId : number){
                let arrPlacas:any[]=[];
                this.placasservice.getAllPlacasBusByEmSuEm(empId, suemId)
                    .subscribe(
                        data => {   
                                    arrPlacas=data;
                                    if(arrPlacas.length>0){
                                        this.extrayendoPlacasBus(arrPlacas,'nuevaprog'); 
                                        this.placas = arrPlacas; 
                                    }else 
                                    if(arrPlacas.length==0 && arrPlacas.length<0 ){
                                        this.mensaje="Error al descargar las placas, compruebe su conexion a internet";
                                        this.displayErrorCargarPlacas=true;
                                    }
                                },
                        err  => {
                                    this.errorMessage = err;
                                    this.mensaje="Error al descargar las placas, compruebe su conexion a internet";
                                    this.displayErrorCargarPlacas=true;
                                },
                        () =>{this.isLoading = false}
                    );
            }
            /* all programaciones base */

            /*TODAS LAS PROGRAMACIONES POR EMPRESA Y AÑO*/
            getAllProgramacionByEm( empId: number, anio: number){
                //let añoActual=new Date().getFullYear().toString();
                this.programacionService.getAllProgramacionByEm(empId, anio).subscribe(
                        datos => { 
                            this.progRest = datos;            
                                let añoActual=new Date().getFullYear().toString();             
                                this.configService.getAllConfiguraByEmPeriodo(this.emid,añoActual).subscribe(
                                data=>{     
                                    this.CoSiId=data[0].CoSiId;            
                                    this.CoNroMaxVueltas=data[0].CoNroMaxVueltas;                       
                                    //empresa con varias subempresas
                                    if(this.CoSiId==2){
                                        this.empSubEmpService.getallsubempresasbyemid(empId).subscribe(
                                            data=>{
                                
                                                //agrupando programaciones por fechas - retorna array de arrays de programaciones
                                                this.arrAllSubEmpAgrup=this.funcAgruparProgByFechas(this.progRest);

                                                //validar nro de programaciones por subempresa creadas
                                                console.log(this.arrAllSubEmpAgrup); 
                                                
                                                //validando el ultimo grupo de programaciones
                                                this.funcValidAllProgByFechas(this.arrAllSubEmpAgrup[this.arrAllSubEmpAgrup.length-1]);
                                            },error=>{

                                            },()=>{}
                                        );
                                        

                                    //empresa con una sola subempresa
                                    }else if(this.CoSiId==1){

                                    }
                                    this.mostrargrillaProgramacionMaestro(datos); 
                                },error=>{

                                },()=>{})
                            
                        }, err => {this.errorMessage = err}, 
                        () =>this.isLoading = false
                    );
                
            }

            funcValidAllProgByFechas(arrProgByDate=[]){
                let arrSubEmp=[];
                this.empSubEmpService.getallsubempresasbyemid(this.emid).subscribe(
                    data=>{
                        for(let subemp of data){
                            arrSubEmp.push(subemp);
                        }
                        
                        //si numero de programaciones es igual al nro de subempresas
                        if(arrProgByDate.length==arrSubEmp.length){
                            this.progValida="";
                        }else if(arrProgByDate.length!=arrSubEmp.length){
                            this.progValida="Error en el numero de programaciones creadas";
                        }
                        
                    },error=>{},
                    ()=>{}
                );
            }
        
            //agrupando programaciones creadas entre fechas
            funcAgruparProgByFechas(arrAllProg=[]){
                let arrProgByFechas=[], i:number=0,j:number=0, _arrAllProg=arrAllProg, objBuscar:any, cen=0;
                //recorrer todas las programaciones para validar si es igual o no
                
                for(let i=0; i<arrAllProg.length;i++){
                    arrProgByFechas.push([]);
                }

                while(_arrAllProg.length>1 && j<arrAllProg.length){
                        objBuscar=_arrAllProg[0];

                        //buscando dentro del array de programaciones
                        while(i<_arrAllProg.length){
                        
                            if( objBuscar.dias==_arrAllProg[i].dias &&  objBuscar.PrDiasIncluidos==_arrAllProg[i].PrDiasIncluidos && 
                                objBuscar.PrFechaFin==_arrAllProg[i].PrFechaFin &&  objBuscar.PrFechaInicio==_arrAllProg[i].PrFechaInicio){
                                    console.log('j: '+j+'---'+'i: '+i);
                                    //guardo elemento donde corresponde
                                    arrProgByFechas[j].push(_arrAllProg[i]);
                                    //elimino elemento del array de busqueda
                                    _arrAllProg.splice(i,1);
                                    i=0;
                                    
                            }else{
                                i++;
                            }
                            
                        }
                        cen=0;
                        i=0;
                        j++;
                  
                }

                i=0
                while(i<arrProgByFechas.length){
                    if(arrProgByFechas[i].length==0){
                        arrProgByFechas.splice(i,1);
                        i=0;
                    }else{
                        i++;
                    }
                }
               
                //buscar posicion de ultimo elemento restante
                if(_arrAllProg.length==1){
                    if(arrProgByFechas.length==1){
                        objBuscar=_arrAllProg[0];
                        
                        //si el ultimo elemento es igual a uno del unico grupo
                        if(objBuscar.dias==arrProgByFechas[0][0].dias &&  
                            objBuscar.PrDiasIncluidos==arrProgByFechas[0][0].PrDiasIncluidos && 
                            objBuscar.PrFechaFin==arrProgByFechas[0][0].PrFechaFin && 
                            objBuscar.PrFechaInicio==arrProgByFechas[0][0].PrFechaInicio){
                            arrProgByFechas[0].push(objBuscar);
                        }else{
                            arrProgByFechas.push(_arrAllProg);                
                        }
                    
                    }else if(arrProgByFechas.length>1){
                
                        //buscar posicion
                        j=0;i=0; let cen=0;
                        while(j<arrProgByFechas.length && cen==0){
                            objBuscar=_arrAllProg[0];
        
                            while(i<arrProgByFechas[j].length){
                                //son iguales : nrodias, diasincluidos, fechainicio, fechafinal
                                if( objBuscar.dias==arrProgByFechas[j][i].dias &&  
                                    objBuscar.PrDiasIncluidos==arrProgByFechas[j][i].PrDiasIncluidos && 
                                    objBuscar.PrFechaFin==arrProgByFechas[j][i].PrFechaFin && 
                                    objBuscar.PrFechaInicio==arrProgByFechas[j][i].PrFechaInicio){
                                        //guardo elemento donde corresponde
                                        arrProgByFechas[j].push(objBuscar);
                                        cen=1;
                                        
                                }else{
                                    cen=0;
                                }
                                i++;
                            }
                            cen=0;
                            i=0;
                            j++;
                        }
                        if(cen==0){
                            arrProgByFechas.push(_arrAllProg[0])
                        }
                    }
                }else{

                }
    
                return arrProgByFechas;

            }
            
            //funcion para verificar si hay un elemento diferente
            /*funcValidarIgualdadElemento(arrData=[]){
                let _arrData=arrData.join('');
            }*/
    funcBtnNewProgmBase(){
        this.displayNewProgmBase=true;
    }
    
    funcBtnNewSubProgm(){
        let añoActual=new Date().getFullYear().toString();
        this.modEdit=false;
        this.procNuevaProgrC();
        this.ordenSorteo=[]; //SORTEO DE PLACAS
        this.resBusUnidades='';
        //consulta por periodos
  
            this.configService.getAllConfiguraByEmPeriodo(this.emid , añoActual).subscribe(
            data=>{
                    //console.log(data); 
                    if(data.length!=0){
                        this.objConfigSystem=data[0];
                        this.CoId=this.objConfigSystem.CoId;
                        this.CoSiId=this.objConfigSystem.CoSiId;
                        //console.log(this.objConfigSystem);

                        this.displayNuevaSubProg=true;        
                        this.progBDDetalle=[]; 
                        this.lengthProgDet=0; 
                        this.dtSelectDias=[];
                        this.tipoProg=0; //PROGRAMACION POR DEFECTO: MANUAL
                        this.formaProg="01"; /* (1)MANUAL O (2)AUTOMATICO */

                        //por todas las empresas
                        if(this.CoSiId==1){
                            this.placasservice.getAllPlacasBusByEmSuEm(this.emid,0).subscribe(
                                data=>{
                                    this.unidadesEstado(this.extrayendoPlacasBus(data,'nuevaprog'));
                                },
                                error=>{console.log(error);},
                                ()=>{}
                            );
                    
                        //por subempresa
                        }else if(this.CoSiId==2){
                            this.empSubEmpService.getallsubempresasbyemid(this.emid).subscribe(
                                data=>{
                                    this.arrSubEmp=[]; 
                                    for(let subemp of data){
                                        this.arrSubEmp.push(subemp);
                                    }
                                    //console.log(this.arrSubEmp);
                                },
                                error=>{},
                                ()=>{}
                            );
                        }
                        
                    }else{
                        console.log('Error, no se pudo descargar la configuracion del sistema');
                    }
                    
                  },
            error=>{alert('error al iniciar el periodo: '+error);},
            ()=>{}
            );
        
       
    }

    
    //1ERA VENTANA MODAL aqui recien se guarda la tabla MAESTRO en el REST 
    guardarProgCabecera(){
        let progCab:any,
            fIni=this.progMaestro.PrFechaInicio, 
            fFin=this.progMaestro.PrFechaFin,
            placas=[];
      
        //let placas=this.extrayendoPlacasBus(this.placas,'nuevaprog');
        
        //todos son una sola empresa
        if(this.CoSiId==1){
            this.SuEmId=0;
        }


        //buscando todas las placas
        this.placasservice.getAllPlacasBusByEmSuEm(this.emid, this.SuEmId).subscribe(
            data=>{
                console.log(data);
                placas=data;
                console.log(this.PrFechaInicio);
                console.log(this.PrFechaFin);
                console.log('CoSiId: '+this.CoSiId);
                console.log(this.PrDiasIncluidos);
                this.PrCantidadBuses=this.bAct;
                this.dtSelectDias=this.funcDiasIncluidosSemana(this.PrDiasIncluidos);
                let valTotalNumDiasProg=this.validandoFechas(this.PrFechaInicio,this.PrFechaFin), validFechInit:boolean;                                
                console.log(this.diasSemana);
                console.log(this.dtSelectDias);

                //prgoramacion por subempresas
                    if(this.CoSiId==2){
                        
                        validFechInit=this.fechaInicioXDiasSemana(this.PrFechaInicio,this.diasSemana,this.dtSelectDias);
                //programacion por empresa
                    }else if(this.CoSiId==1){
                        //el valor de validFechInit, no cambiara
                        
                        validFechInit=this.validarProgFechaInicio(this.PrFechaInicio, this.arrAllProgBase, this.diasSemana);
                    }

                console.log("validFechInit: "+validFechInit);
                console.log("valTotalNumDiasProg: "+valTotalNumDiasProg);
                //validando el numero de dias de entre las fechas de la nueva programacion
                if(valTotalNumDiasProg==1){
                    //validando fecha de inicio
                    if(validFechInit==true){
                        this.tipoProgramacion(placas,placas.length,this.tipoProg );//FORMA SORTEO
        
                        /*progCab = {
                            PrId : this.progMaestro.PrId, //number
                            EmId : this.emid, //number
                            PrCantidadBuses : this.bAct, //number
                            PrDescripcion : this.progMaestro.PrDescripcion, //string
                            PrFecha : new Date(), //string
                            PrFechaInicio : fecha(this.progMaestro.PrFechaInicio), //string
                            PrFechaFin : fecha(this.progMaestro.PrFechaFin), //string
                            PrTipo : Number(this.formaProg), //string escala pescadito
                            PrAleatorio : Number(this.tipoProg), //string manual automatico(aleatorio)
                            PrDiasIncluidos:this.diasIncluidos(this.dtSelectDias),
                            UsId : this.userid, //number
                            SuEmId:this.SuEmId,
                            UsFechaReg : new Date() //string
                        }
        
                        console.log(progCab);
                        this.procSaveProgramacion(progCab);*/
                        
                        console.log(this.arrayPlacas);
                        console.log(this.ordenSorteo);
                        this.displayNuevaSubProg=false; //cerrar 1era ventana
                        this.displaySorteoProg=true; //abrir 2da ventana

                    }else if(validFechInit==false){
                        this.displayErrorFechIngrFormUno=true;
                        this.mensaje="La fecha de inicio ("+this.PrFechaInicio+"), interfiere en la ultima programacion o no esta dentro de los dias de trabajo";
                    }
                    
            
                }else if(valTotalNumDiasProg==0){
                    this.displayErrorFechIngrFormUno=true;
                    this.mensaje="Error en las fechas ingresada, es menos de  7 dias o mayor a 62 dias";
        
                }
            },
            error=>{

            },
            ()=>{}
        );

       
        
    }

    funcDiasIncluidosSemana(diasSemInclu:string){
        let arrDias=diasSemInclu.split(","), arrDiasSemana=this.diasSemana;
        let i:number=0, _arrDias=[];
        while(i<arrDias.length){
            if(arrDias[i]=="1"){
                _arrDias.push({
                    value:arrDiasSemana[i].value
                });
            }
            i++;
        }
        return _arrDias;
    }

    aceptarErrorFechasValidas(){
        this.mensaje="";
        this.displayErrorFechIngrFormUno=false;
    }

    //BORRAR ARR arrPrDiasIncluidos
    diasIncluidos(arrDias=[]):string{
        let dias:string; let i:number=0; let arrPrDiasIncluidos=[0,0,0,0,0,0,0];
        //{id:0,nro:1, nomb:'Lunes'},
        while(i<arrDias.length){
            arrPrDiasIncluidos[arrDias[i].id] = 1;
            i++;
        }
        
        dias=arrPrDiasIncluidos.join(',');
        //console.log(dias);
        return dias;
    }

   
    /* FUNCION -> FORMA DE SORTEO MANUAL O AUTOMATICO */
    tipoProgramacion(_arrayplacas=[], long:number, tprog:number){
        
        this.ordenSorteo=[]; let arrayplacas=[];
        for(let i=0; i<_arrayplacas.length; i++){
            
            if(_arrayplacas[i].BuActivo==true){
                arrayplacas.push({                    
                    BuActivo:_arrayplacas[i].BuActivo,
                    BuCapacidad:_arrayplacas[i].BuCapacidad,
                    BuDescripcion:_arrayplacas[i].BuDescripcion,
                    BuFechaIngreso:_arrayplacas[i].BuFechaIngreso,
                    BuId:_arrayplacas[i].BuId,
                    BuMarca:_arrayplacas[i].BuMarca,
                    BuPlaca:_arrayplacas[i].BuPlaca,
                    SuEmId:_arrayplacas[i].SuEmId,
                    SuEmRSocial:_arrayplacas[i].SuEmRSocial,
                    HoraBase:"HH:MM:SS"
                });
            }
            
        }
        
        /* AUTOMATICO*/
        if(tprog==0){ 
            let array = ["c"],nro, i=0, j=0, cen=0; 
            
            //ALGORITMO NROS ALEATORIOS
            while(i<arrayplacas.length ){
                nro = Math.floor(Math.random()*arrayplacas.length);//NUMEROS ALEATORIOS ENTRE 0 Y LONG
                while(j<array.length ){
                    if(array[j]!=nro){
                        cen=0;
                    }else if(array[j]==nro){ 
                        cen=1; j=array.length;
                    }
                    j++;
                }
                if(cen==0){  
                    array[i]=nro;   
                    i++;    
                }
                cen=0; j=0;
            }
            console.log(array);
            //APLICANDO ALGORITMO, BUSCANDO INDICES CON ARRAY DE PLACAS
            i=0; nro=0;_arrayplacas=[]; 
            while(i<array.length){
                _arrayplacas.push(arrayplacas[array[i]]);
                i++;
            }
            this.ordenSorteo=[];
            this.ordenSorteo=_arrayplacas;
            
            this.arrayPlacas=[];
        /* MANUAL*/
        }else if(tprog==1){
            console.log("manual");
            this.arrayPlacas=arrayplacas;
        }
        
    }
 
    //ARRAY DIAS PROGRAMACION//      1 : NO BISIESTO    2017-05-02   0 : BISIESTO
    calendarioProg(f1 : string, f2 : string, diasIncl:string){
        let i=0, arrCalNumber:any[]=[], arrCalString:any[]=[];
        let calendario= this.descartarFechas(this.funcCalendarioNumerico(f1,f2), diasIncl);
        console.log(calendario);
        //EXTRAENDO NUMERICO
        while(i<calendario.length){
            arrCalNumber[i]=calendario[i].getDate();
            i++;
        }

        //EXTRAENDO DIAS SEMANA
        i=0;
        while(i<calendario.length){
            if(calendario[i].getDay()==1){
                arrCalString[i]='lu';
            }else if(calendario[i].getDay()==2){
                arrCalString[i]='ma';
            }else if(calendario[i].getDay()==3){
                arrCalString[i]='mi';
            }else if(calendario[i].getDay()==4){
                arrCalString[i]='ju';
            }else if(calendario[i].getDay()==5){
                arrCalString[i]='vi';
            }else if(calendario[i].getDay()==6){
                arrCalString[i]='sa';
            }else if(calendario[i].getDay()==0){
                arrCalString[i]='do';
            }
            i++;
        }
        this.calNumb=arrCalNumber.slice(0);
        this.calString=arrCalString.slice(0);
    }

   
    //CERRAR MENSAJE DE SE ENCONTRO ERROR EN LOS DATOS INGRESADOS
    errorDatos(){
        this.mensaje="";
        this.displayErrorDatos=false;
    }

    //VALIDANDO FECHAS
    validandoFechas(f1:string, f2 :string) : number{
        let val1: number,val2: number,result : number,  _f1, _f2,i:number,j:number;
        _f1 = f1.split('-'); _f2 = f2.split('-');

        for(i=0; i<_f1; i++){
            _f1[i] = this.quitandoCerosIzq(_f1[i]);
        }
        for(i=0; i<_f2; i++){ 
            _f2[i] = this.quitandoCerosIzq(_f2[i]);
        }

        _f1 = _f1.toString(); _f2 = _f2.toString();
        val1 = this.fnroDias(_f1); val2 = this.fnroDias(_f2);

        let ndias = val2 - val1 + 1;
        console.log('ndias: '+ndias);
        //console.log(ndias);
        if(ndias>6  &&  ndias<=62){
            result = 1 ; //LAS FECHAS SON CORRECTAS
            return result;
        }else{
            console.log('ndias: '+ndias);
            result = 0 ; //LAS FECHAS NO SON CORRECTAS
            return result;
        }
        
    }

    //NUMERO DE DIAS DESDE 1970, PARA TENER COMO REFERENCIA AL MOMENTO DE RESTAR Y SACAR EL NRO DE DIAS EXISTENTE
    fnroDias(f : string) : number{
        let n: number; 
        let minute = 1000 * 60; let hour = minute * 60; let day = hour * 24; 
        let date = new Date(f);
        var time = date.getTime();
        n = Math.round(time/day);
        return n;
    }

    //DETERMINAR SI ES AÑO BISIESTO
    bisiesto(anio: string):string{
        let r : string;
         if(Number(anio) %4!=0 || (Number(anio)%100==0  &&  Number(anio) %400 !=0)){
                r= '1'; //NO BISIESTO
            }else {
                r= '0'; //BISIESTO
        }
        return r;
    }

    //QUITANDO PRIMER CERO IZQ  
    quitandoCerosIzq(str: string):string{
        let ret
        
        if(str == '00'){
            ret = '0';
        }else if(str=='01'){
            ret = '1';
        }else if(str=='02'){
            ret = '2';
        }else if(str=='03'){
            ret = '3';
        }else if(str=='04'){
            ret = '4';
        }else if(str=='05'){
            ret = '5';
        }else if(str=='06'){
            ret = '6';
        }else if(str=='07'){
            ret = '7';
        }else if(str=='08'){
            ret = '8';
        }else if(str=='09'){
            ret = '9';
        }

        return ret;
    }

    //CONSULTA NUMERO DE BUSES ACTIVOS Y NO ACTIVOS
    unidadesEstado(arrayPlacas=[]){
        let i=0; let bAct=0; let bNAct=0;;
        
        while(i<arrayPlacas.length){
            if(arrayPlacas[i].BuActivo==true){
                bAct++;
            }else if(arrayPlacas[i].BuActivo==false){
                bNAct++;
            }
            i++;
        }
        
        this.bAct = bAct;
        //this.bNAct= bNAct;
        this.resBusUnidades="  En Sorteo: "+this.bAct;
        console.log("buses activos: "+this.bAct);
    }


    //2DA VENTANA MODAL(boton continuar)
    //BOTON GENERAR PROGRAMACION 
    programacionSegundoModal(){
        let arrProgDetalle=[];
        //this.programacionArrayDetalleBD=[];
        //console.log(this.PrCantidadBuses);
        //console.log(this.ordenSorteo);

        if(this.PrCantidadBuses!=this.ordenSorteo.length){
            this.mensaje="Error en las Placas Del Sorteo";
            this.displayFaltanPlacas=true;

        }else if(this.PrCantidadBuses == this.ordenSorteo.length){

            this.displayProgramacionBase=false; 
              
            this.placaEditarCelda=this.ordenSorteo[0].BuPlaca;
            this.progDetalle.PrDeFecha = new Date();
            
            
            //console.log(arrProgDetalle);
            //this._programacionArrayDetalleBD=arrProgDetalle.slice(0);  // SEPARO ESTO PARA DESPUES CARGARLO CON LOS PRDEID
            
            
            let objProg={
                SuEmId: this.SuEmId,
                PrId: 0,
                PrFechaInicio: fecha(this.PrFechaInicio),
                PrFechaFin: fecha(this.PrFechaFin),
                PrDiasIncluidos: this.PrDiasIncluidos,
                PrBaId: this.PrBaId,
                UsFechaReg: new Date(),
                UsId: this.userid,
                EmId: this.emid,
                PrDescripcion: this.PrDescripcion,
                PrCantidadBuses: this.PrCantidadBuses,
                PrFecha: new Date(),
                PrTipo: this.tipoProg.toString(),
                PrAleatorio: Number(this.formaProg)
            };
            console.log(objProg);
            //CARGAR EN ARRAY DE OBJETOS PARA MANDAR A LA BD
             
            //this.procSaveProgramacion(objProg);
            //this.guardarProgDetalle(arrProgDetalle, this.emid, this.PrId, true);
            this.programacionService.saveProgramacion(objProg).subscribe(
                data=>{
                    console.log(data);
                    this.PrId=data.PrId; 
                    for(let i=0; i<this.ordenSorteo.length ; i++){
                        arrProgDetalle.push({
                            PrId : this.PrId,
                            BuId : this.ordenSorteo[i].BuId,
                            PrDeFecha: new Date(),
                            PrDeBase: true,
                            PrDeOrden: i+1,
                            UsId: this.userid,
                            UsFechaReg: new Date(),
        
                            PrDeId:0,
                            PrDeAsignadoTarjeta:0,
                            PrDeCountVuelta:0,
                            PrDeHoraBase:0
                        });  
                    }
                    /*console.log(arrProgDetalle);
                    console.log(this.emid);
                    console.log(this.PrId);   */                                                                              
                    this.programacionService.saveProgramacionDetalle(arrProgDetalle,this.emid,this.PrId,true).subscribe(
                        data=>{
                            console.log(data);
                            this.programacionService.getAllProgramacionByPrBa(this.PrBaId).subscribe(
                                data=>{this.mgAllProgramByPrBa(data); this.displaySorteoProg=false;},error=>{}
                            );  
                        },error=>{}
                    );                    
                },error=>{},()=>{}
            )

            for(let i=0; i<this.ordenSorteo.length; i++){
                this.ordenSorteo[i].nro=i+1;
            }
            this.nroTotalMinibuses=this.ordenSorteo.length;
        }
    }
    
    buscarPrimerHMS(arrSorteo=[]):number{
            let index:number; let strBuscado="HH:MM:SS"; let cen=0; let i=0;            
            while(i<arrSorteo.length && cen==0){
                if(arrSorteo[i].HoraBase=="HH:MM:SS"){
                    cen=1;
                }else if(arrSorteo[i].HoraBase!="HH:MM:SS"){
                    i++; cen=0;
                }
            }            
            index=i;
            return index;
    }

    buscarUltimoHMS(arrSorteo=[]):number{
        let index:number; let strBuscado:string="HH:MM:SS"; let cen=0; let i:number=arrSorteo.length-1;

            while(0<=i && cen==0){
                if(arrSorteo[i].HoraBase==strBuscado){
                    cen=0; i--;
                }else if(arrSorteo[i].HoraBase!=strBuscado){
                    cen=1;
                }
            }
            index=i+1;
            return index;
    }

    buscarSigtePosicion(arrSorteo=[]):number{
            let i:number=0; let result:number; let cen=0;
            while(i<arrSorteo.length && cen==0){
                if(arrSorteo[i].HoraBase!='HH:MM:SS'){
                    cen=1;
                }else if(arrSorteo[i].HoraBase=='HH:MM:SS'){
                    cen=0; 
                }
                i++;
            }

            if(i==0){
                result=0;
            }else if(i>=0){
                result=this.buscarPrimerHMS(arrSorteo);
            }

            return result;
    }

    conteoHBAgregadas(arrSorteo=[]):number{
            let result:number; let i:number=0, j:number=0;
            while(i<arrSorteo.length){
                if(arrSorteo[i].HoraBase!='HH:MM:SS'){
                    j++;
                    
                }
                i++;
            }
            result=j;
            return result;
    }

    AgregarHBase(hBaseValid:boolean, hIncrementoValid:boolean){
        
        if(hBaseValid==true && hIncrementoValid==true){    
            if(this.nroMiniBus<this.nroTotalMinibuses){         
                let indicePorInicio=this.buscarPrimerHMS(this.ordenSorteo);
                console.log('indicePorInicio: '+indicePorInicio);
                //cargando hora base a la tabla 
                if(indicePorInicio>0){
                    let horaBaseSgte=operSHoras(this.horaBase,this.horaIncremento); this.horaBase=horaBaseSgte;
                    //console.log(horaBaseSgte);
                }else if(indicePorInicio==0){

                }
                //console.log(this.ordenSorteo);
                //console.log(indicePorInicio);
                this.ordenSorteo[indicePorInicio].HoraBase=this.horaBase;
                this.nroMiniBus=this.conteoHBAgregadas(this.ordenSorteo);
                this.nroMiniBusHeader=this.nroMiniBus;
                
                let indexNextPos=this.buscarSigtePosicion(this.ordenSorteo);
            
                if(indexNextPos-indicePorInicio==1){
                    if(this.nroTotalMinibuses==indexNextPos){
                        this.placaEditarCelda=this.ordenSorteo[indicePorInicio].BuPlaca;
                    }else{
                        this.placaEditarCelda=this.ordenSorteo[indexNextPos].BuPlaca;
                    }
                }else if(indexNextPos-indicePorInicio>1){
                    this.placaEditarCelda=this.ordenSorteo[indicePorInicio].BuPlaca;  
                }
                
                if(this.nroMiniBus==this.nroTotalMinibuses){
                    this.nroMiniBusHeader--;
                }

            }else if(this.nroMiniBus==this.nroTotalMinibuses){
                
                console.log("programacion terminada");
            }
        }else{
            alert('Verifique Hora Salida e Incremento');
        }
    }

    generarProgramacionDetalle(){

        for(let i=0; i<this.ordenSorteo.length ; i++){
            this._programacionArrayDetalleBD[i].PrDeHoraBase=hora(this.ordenSorteo[i].HoraBase);
        } 
    
        this.tablahorabase(this._programacionArrayDetalleBD);
     
    }

    //guardar programacion base- programacion detalle()
    guardarProgDetalle(arrProg=[], emid:number, prid:number, base:boolean){
        /*console.log(arrProg);
        console.log(emid);
        console.log(prid);
        console.log(base);*/
        this.mensajeEspera="Iniciando la Programacion...";
        this.displayMensajeEspera= true; 
        
        this.programacionService.saveProgramacionDetalle(arrProg,emid,prid,base)
            .subscribe( 
                realizar => {   
                    if(realizar==true){
                        this.mensajeEspera="";
                        this.displayMensajeEspera= false; 
                        this.displayFormHorasBase=true;
                    }else if(realizar==false){
                        this.mensajeEspera="Error al iniciar la Programacion";
                        this.displayAceptarProgNueva= true; 
                    }    
                    //this.getallprogramaciondetallebyprid(prid); 
                }, 
                err => {
                    this.errorMessage = err;
                    console.log(err);
                    this.mensajeEspera="Error al iniciar la Programacion";
                    this.displayAceptarProgNueva= true; 
                },
                () =>{this.lengthProgDet=0; console.log('guardado');}
        );
    }

    //cargar tabla hora base
    tablahorabase(arrplacaSorteo=[]){
        this.ordenSorteo=[];
        this.displayFormHorasBase=false;
        this.getallprogramaciondetallebyprid(this.PrId, arrplacaSorteo); 
        //this.guardarProgDetalle(arrplacaSorteo, this.emid, this.PrId, true);
    }

    cargarHoraBaseSalida(){
        //this.guardarProgDetalle(arrplacaSorteo, this.emid, this.PrId, true);
    }

    //MENSAJE FALTAN PLACAS
    faltanPlacas(){
        this.mensaje="";
        this.displayFaltanPlacas=false;
    }

    aceptarNuevaProg(){
        this.mensaje="";
        this.displayAceptarProgNueva=false;
    }

    aceptarErrorPlacas(){
        this.mensaje="";
        this.displayErrorCargarPlacas=false;
    }

    //deshabilitando botones
    disabledButtonForm(){
        this.disabledbutton = false;
        return this.disabledbutton;
    }
    
    //CERRAR PROG 1ER MODAL
    cancelNuevaSubProg(){
         this.displayNuevaSubProg=false;
         this.progMaestro={};
         
    }

    //CERRAR 2 MODALES (1ER Y 2DO MODAL ) cerrar ventanas new programacion (2do Modal)
    cancelarProgBaseSegundoModal(){
        this.displayNuevaSubProg=false; //1era MODAL
        this.displaySorteoProg=false;  //2da MODAL
    }

    cancelarProgBaseTercerModal(){
        this.displayFormHorasBase=false;
        this.horaBase="";
        this.nroMiniBus=0;
        this.nroTotalMinibuses=-1;
    }

    //datos para grilla HTML Maestro (consulta especialmente hecha para mostrar en el res)
    mostrargrillaProgramacionMaestro(arrProg=[]){
        
        let arrAllProgrm=[];
      
        for(let prog of arrProg){
            arrAllProgrm.push({
                nro:0,
                tipo:"",
                EmConsorcio : prog.EmConsorcio,
                PrCantidadBuses : prog.PrCantidadBuses,
                PrFecha : prog.PrFecha,
                PrFechaInicio : _fecha1(prog.PrFechaInicio),
                PrFechaFin : _fecha1(prog.PrFechaFin),
                PrAleatorio : "0"+prog.PrAleatorio, 
                PrTipo : "0"+prog.PrTipo,
                dias : prog.dias,
                prDescripcion : prog.prDescripcion,
                prId : prog.prId,
                PrDiasIncluidosNumber:prog.PrDiasIncluidos,
                PrDiasIncluidosString:0,
                SuEmId:prog.SuEmId,
                SuEmRSocial:prog.SuEmRSocial
            });
        }

        arrAllProgrm=this.arrAllProgramacion(arrAllProgrm);

        this.programacionMaestroArrayHTML=arrAllProgrm.slice(0);
    }

    arrAllProgramacion(arrAllProg=[]){
        let arrResult:any[]=[]; let dias:string
        //DIAS INCLUIDOS    
        for(let i=0; i<arrAllProg.length; i++){
            arrAllProg[i].PrDiasIncluidosString=this.convertDiasIncluidos(arrAllProg[i].PrDiasIncluidosNumber);
        }
        
        //ENUMERAR REGISTRO
        for(let i=0; i<arrAllProg.length; i++){arrAllProg[i].nro=i+1;}
        
        //MANUAL O AUTOMATICO PROGRAMACION
        for(let i=0; i<arrAllProg.length; i++){
            if(arrAllProg[i].SuEmId==0){
                arrAllProg[i].SuEmRSocial="Todas Sub-Empresas";
            }
            if(arrAllProg[i].PrTipo=="02"){
                arrAllProg[i].tipo="Manual";
            }else if(arrAllProg[i].PrTipo=="01"){
                arrAllProg[i].tipo="Automatico";
            }
        }

        arrResult=arrAllProg.slice();
        
        return arrResult;
    }

    convertDiasIncluidos(diasIncluidos:string):string{
        let resultado:string; let arrDias:any[]; let _arrDias:any[]=[];
        arrDias=diasIncluidos.split(',');   let arrDiasSem=['Lu','Ma','Mr','Ju','Vi','Sa','Do'];
        

        for(let i=0; i<arrDias.length; i++){
            if(arrDias[i]==1){
                arrDias[i]=arrDiasSem[i];
            }
        }

        for(let i=0; i<arrDias.length;i++){
            if(arrDias[i]!=0){
                _arrDias.push(arrDias[i]);
            }
        }
        resultado =_arrDias.join('-');
        return resultado;
    }

    //extraer placas y el ID de los buses OPTIMIZAR ESTE CODIGO, MUCHAS VECES SE ESTA USANDO EN EL FUNCIONAMIENTO DEL PROGRAMA
    extrayendoPlacasBus(placas=[], modo:string){
        this.arrayPlacas=[];
        let arrPlacas:any[]=[];
        let i =0;

        if(modo=='tablavista'){
            while( i<placas.length){
               
                arrPlacas.push({
                    nro:0,
                    nroPlaca: placas[i].BuPlaca,
                    BuId: placas[i].BuId,
                    BuActivo:placas[i].BuActivo,
                    HoraBase:'HH:MM:SS'
                });
                
                i++;
            }
            for(let i=0; i<arrPlacas.length; i++){
                arrPlacas[i].nro=i+1;
            }

        }else if(modo=='nuevaprog'){
            while( i<placas.length){
                if(placas[i].BuActivo==true){
                    arrPlacas.push({
                        nro:0,
                        nroPlaca: placas[i].BuPlaca,
                        BuId: placas[i].BuId,
                        BuActivo:placas[i].BuActivo,
                        HoraBase:'HH:MM:SS'
                    });
                }else if(placas[i].BuActivo==false){}
                i++;
            }
            for(let i=0; i<arrPlacas.length; i++){
                arrPlacas[i].nro=i+1;
            }
        }
        
        return arrPlacas;
        
    }

    onRowSelArrAllProgBase(event){    
        this.PrFechaInicio=cCeroFechaForEditar(slash_posFecha(event.data._PrBaFechaInicio));
        this.PrFechaFin=cCeroFechaForEditar(slash_posFecha(event.data._PrBaFechaFin));
        this.PrDiasIncluidos=event.data.PrDiasIncluidos;
        this.PrBaId=event.data.PrBaId;
        this.PrDescripcion=event.data.PrBaDescripcion;
        this.PrFecha=event.data.PrBaFecha;
        this.programacionService.getAllProgramacionByPrBa(this.PrBaId).subscribe(
            data=>{
                //console.log(data);
                this.mgAllProgramByPrBa(data);
                
            },error=>{

            }
        );
      
    }

    //seleccionar fila de la tabla - mostrar la programacion
    onRowSelProgram(event){
        let fi, ff , prId , PrDiasIncluidosNumber:string;

        prId = event.data.prId;  
        this.PrCantidadBuses = event.data.PrCantidadBuses; 
        PrDiasIncluidosNumber=event.data.PrDiasIncluidosNumber; //no se para que es :s
        this.dias = event.data.dias; //total dias programacion
        this.PrFechaInicio=formatFech(event.data.PrFechaInicio);
        this.PrFechaFin=formatFech(event.data.PrFechaFin);

        this.modo='tablavista';
        
        fi = this.formatoCal(event.data.PrFechaInicio);  
        ff = this.formatoCal(event.data.PrFechaFin);
        
        this.getAllPlacasBusByEmSuEm(this.emid,0);
        //this.calendarioProg(fi,ff,PrDiasIncluidosNumber);
        

        //LIMPIANDO VARIABLES   this.columnas : COLUMNAS    this._columnas : ITEMS COLUMNAS DATATABLE
        this.columnas=[]; 
        this._columnas=[]; 
        this.progBDDetalle=[]; 
        this.arrayPlacas=[];

        //CONSULTA PROGRAMACION DETALLE
        this.programacionService.getAllProgramacionDetalleByPrId(prId).subscribe(
            data => {
                        this.progBDDetalle = data; 
                        if(this.progBDDetalle.length!=0){

                            this.extraerHoraBase(this.progBDDetalle, this.PrCantidadBuses);
                            //console.log(this.arrHoraBaseSal);
                            this.calendarioProgramacion(this.progBDDetalle,this.PrCantidadBuses, this.dias);
                           
                            this.tablaProgramaciones(this.progBDDetalle, this.PrCantidadBuses, this.dias, this.extrayendoPlacasBus(this.placas,'tablavista'));
                        }else if(this.progBDDetalle.length==0){
                            this.mensaje="Error al Generar la Programacion, Vuelva a Generarlo";
                            this.displayErrorTablaProgramacion=true;
                        }
                    },
            err => {this.errorMessage=err},
            () => this.isLoading=false
        );
    }

    extraerHoraBase(arrProg=[], nroRows:number){
        let i:number=0; let arrHoraBase:any[]=[];

        while(i<nroRows){
            if(arrProg[i].PrDeBase==true && arrProg[i].PrDeOrden==(i+1)){
                arrHoraBase.push({
                    BuId:arrProg[i].BuId,
                    PrDeBase:arrProg[i].PrDeBase,
                    PrDeHoraBase:_hora(arrProg[i].PrDeHoraBase),
                    PrDeOrden:arrProg[i].PrDeOrden
                });
                i++;
            }
        }
        this.arrHoraBaseSal=arrHoraBase;
    }

    onEditCompleteHB(event){
        let hBSal=event.data.HoraBase; let index=event.data.nro-1;
        
        if( horaValida(hBSal)==false ){
            this.ordenSorteo[index].HoraBase='HH:MM:SS'
            
        }else if(horaValida(hBSal)==true){
            //this.nroMiniBus=this.nroMiniBus+1;
            if(this.nroMiniBus < this.nroTotalMinibuses){
                let indice=this.buscarPrimerHMS(this.ordenSorteo);
                this.placaEditarCelda=this.ordenSorteo[indice].nroPlaca;
                this.nroMiniBus=this.conteoHBAgregadas(this.ordenSorteo);
            }else if(this.nroMiniBus == this.nroTotalMinibuses){
                //console.log(this.nroMiniBus); console.log(this.nroTotalMinibuses);
                this.placaEditarCelda=this.ordenSorteo[this.indexPlacaTabHSal].nroPlaca;
                //console.log(this.ordenSorteo);
            }
        }
    }

    onEditCancelHB(event){
        let index=event.data.nro-1;
        console.log(event.data.HoraBase);
        this.ordenSorteo[index].HoraBase='HH:MM:SS';
        this.nroMiniBus=this.nroMiniBus-1;
    }
    
    onEditInitHB(event){
        this.placaEditarCelda=event.data.nroPlaca;
        this.indexPlacaTabHSal=event.data.nro-1;
    }

    formatoCal(fi:string) : string{
        let _fi,aux;
        _fi=fi.split("/");
        //INVIRTIENDO POSICION fi
        aux=_fi[0]; _fi[0]=_fi[2]; _fi[2]=aux;
        _fi=_fi.join("-"); 
        return _fi;
    }
    
    //TABLA PROGRAMACIONES, VERIFICA SI LA PROGRAMACION ESTA COMPLETA
    tablaProgramaciones(progBDDetalle=[], nroBuses:number, nroDias:number, arrPlacas=[]){
        /*console.log(progBDDetalle);
        console.log(nroBuses);
        console.log(nroDias);*/
        
        if(  (progBDDetalle.length > nroBuses )){
    
                //1ERA MATRIZ
                let a1 :any[]=[]; let a2 :any[]=[]; let a3 :any[]=[]; let i=0; let j=0; let k=0;       

                while(i<nroDias){
                    while(j<(progBDDetalle.length) && k<nroBuses){
                        a2.push(progBDDetalle[j].BuId);j++; k++;
                    }
                    a3[i]=a2; k=0; i++; a2=[];
                }
                
                //2DA MATRIZ (TRANSPUESTA DE LA 1ERA)
                let a4: any[]=[]; let a5: any[]=[]; let l=0; let m=0; let n=0; let aux=0;

                //TRANSPUESTA 
                //INICIANDO MATRIZ - CREANDO LA MATRIZ PARA LA TABLA
                while(l<nroBuses){
                    while(m<nroDias){
                        a4.push(0);  m++;
                    }
                    a5[l]=a4; m=0; l++; a4=[];
                }
             
                l=0; m=0;
                //MOVIENDO 
                while(l<nroBuses){
                    while(m<nroDias){
                        a5[l][m]=a3[m][l]; m++; 
                    }
                    l++; m=0;
                }
                
                this._detalle=cambianBuIdxNroPlaca(a5,arrPlacas);
                
                // INSERTANDO EL NRO DE DE FILA EN LA TABLA 
                for(i=0; i<this._detalle.length;i++){ (this._detalle[i]).splice(0,0,(i+1).toString());}
                
                let progrVista=this.insertHoraSalidaBaseVista(this.arrHoraBaseSal,this._detalle);
              
                this._detalle=progrVista
                this.calNumb.unshift(" "); 
                this.calString.unshift(" "); 
                this.calNumb.unshift(" "); 
                this.calString.unshift(" "); 
                this.nroColumn=nroDias;
                    
                this.displayProgramacion = true;
                
        }else if(progBDDetalle.length == nroBuses || progBDDetalle.length < nroBuses){
                this.mensaje="Error al Generar la Programacion, Vuelva a Generarlo";
                this.displayErrorTablaProgramacion=true;
        }
        
    }

    //obtener calendario - recuperar calendario de la programacion detalle que me devuelve del servicio
    calendarioProgramacion(arrProgramacion=[],PrCantidadBuses, NroDias:number){
        let i:number=0,nrod:number; 
        nrod=arrProgramacion.length/PrCantidadBuses; 
        let arrCalendarioBase:any[]=[];
        let arrcalendarioNumerico:any[]=[];
        let arrcalendarioString:any[]=[];
        let _arrcalendarioString:any[]=[];
      
        for(let i=0; i<nrod; i++){
            arrCalendarioBase.push(new Date(arrProgramacion[i*PrCantidadBuses].PrDeFecha));
        }

        for(let i=0; i<arrCalendarioBase.length; i++){
            arrcalendarioNumerico.push(arrCalendarioBase[i].getDate());
        }

        for(let i=0; i<arrCalendarioBase.length; i++){
            _arrcalendarioString.push(arrCalendarioBase[i].getDay());
        }
        for(let i=0; i<_arrcalendarioString.length;i++){
            if(_arrcalendarioString[i]==0){
                arrcalendarioString.push('Do');
            }else if(_arrcalendarioString[i]==1){
                arrcalendarioString.push('Lu');
            }else if(_arrcalendarioString[i]==2){
                arrcalendarioString.push('Ma');
            }else if(_arrcalendarioString[i]==3){
                arrcalendarioString.push('Mr');
            }else if(_arrcalendarioString[i]==4){
                arrcalendarioString.push('Ju');
            }else if(_arrcalendarioString[i]==5){
                arrcalendarioString.push('Vi');
            }else if(_arrcalendarioString[i]==6){
                arrcalendarioString.push('Sa');
            }
        }

        /*console.log(arrCalendarioBase);
        console.log(arrcalendarioNumerico);
        console.log(_arrcalendarioString);
        console.log(arrcalendarioString);*/

        this.calNumb=arrcalendarioNumerico;
        this.calString=arrcalendarioString;
    }


    errorTablaProgramacion(){
        this.mensaje="";
        this.displayErrorTablaProgramacion=false;
    }
    
    /*EDITAR CABECERA*/
    editarCabecera(reg){
        this.displayEditProgC=true;
        this.getProgramacionById(reg.prId);
    }

    /* PARA EL CASO DE EDITAR LA PROGRAMACION CREADA, SOLO NOMBRE DE LA PROGRAMACION*/
    EditarProgCabecera(){
        let obj:any;

        this._progrMaestro.PrAleatorio=0;
        /* CARGANDO OBJETO */
        obj = {
            EmId:this.emid,
            PrAleatorio:this._progrMaestro.PrAleatorio,
            PrCantidadBuses:this._progrMaestro.PrCantidadBuses,
            PrDescripcion:this.progDescripcion,
            PrFecha:new Date(this._progrMaestro.PrFecha),
            PrFechaFin:new Date(this._progrMaestro.PrFechaFin),
            PrFechaInicio:new Date(this._progrMaestro.PrFechaInicio),
            PrId:Number(this._progrMaestro.PrId),
            PrTipo:this._progrMaestro.PrTipo,
            UsFechaReg:new Date(),
            UsId:this.userid
        }
        this.displayEditProgC=false;
        //console.log(obj);
        this.programacionService.saveProgramacion(obj)
            .subscribe( 
                data => {this.progMaestro=data;  //RECUPERANDO OBJETO PARA SACAR EL PRID
                   
                         this.progDescripcion="";
                         this.mostrargrillaProgramacionMaestro(this.progMaestro) ;
                         this.getAllProgramacionByEm(this.emid,this.anio);
                         this.displayEditProgC = false;
                }, 
                err => {this.errorMessage = err}
        );
    }

     /* CANCELAR EDITAR PROGRAMACION CABECERA */
    canEditarProgC(){
        this.displayEditProgC=false;
        this._progrMaestro = null;
        this.progDescripcion="";
        //console.log(this._progrMaestro);
    }

    //BOTON ELIMINAR REGISTRO 
    dtDelRegProgram(_PrId : number){
        this.mensaje = "¿Esta Seguro de Eliminar Este Registro de la Tabla?";
        this.displayConfDelProgram = true
        //this.iDReg = _PrId;
        this.PrId=_PrId;
    }

    //PROCEDIMIENTO ALMACENADO PARA ELIMINAR
    borrarRegProgBase(){
         this.programacionService.deleteProgramacionByid(this.PrId).subscribe(
            realizar => {   //this.getAllProgramacionBaseByEm(this.emid,this.anio); 
                            this.programacionService.getAllProgramacionByPrBa(this.PrBaId).subscribe(
                                data=>{
                                    this.mgAllProgramByPrBa(data);
                                    this.iDReg=0;
                                    this.displayConfDelProgram=false;
                                },error=>{}
                            );                                                    
                },err => {this.mensaje="No puede borrar esta programacion, esta siendo utilizada";
                    this.displayAvisoNoPuedeBorrarProg=true;    
                    this.displayConfDelProgBase=false;
                    console.log(err);}
         );
    }
    OkProgNoPuedoBorrar(){
        this.mensaje="";
        this.displayAvisoNoPuedeBorrarProg=false;  
    }
    //CERRAR VENTANA MODAL PROGRAMACION TABLA 
    cerrarProg(){
        this.displayProgramacion=false;
    }

    datosGenerarArchivo(){
        this.displayDatosPDF=true;
        this.displayProgramacion=false;
    }

    cancelarDatosGenerarArchivo(){
        this.displayDatosPDF=false;
    }
    
    generarArchivo(){
        let nroDias=this.calNumb.length-1; //DESCONTANDO PRIMER ESPACIO EN BLANCO
        this.getAllPlacasBusByEmSuEm(this.emid,0);
    
        this.nomArchivoPDF='programacion de '+this.PrFechaInicio+' al '+this.PrFechaFin;
        this.titArchivoPDF='CUADRO DE UBICACION DE SALIDAS DE LA ';
        this.calNumb.shift(); 
        this.calString.shift();
        this.descargarProgramacion(this.nomArchivoPDF, this.titArchivoPDF, this.calNumb,this.calString, this.PrCantidadBuses , nroDias, this.progBDDetalle, this.extrayendoPlacasBus(this.placas,'tablavista') );
        this.displayDatosPDF=false;
    }
    
    //DESCARGAR LA PROGRAMACION EN FORMATO PDF 
    descargarProgramacion(nombreArchivo:string, tituloArchivo:string,calNumb=[],calString=[],nroBuses:number,nroDias:number, progBDDetalle=[], arrayPlacas=[] ){
        //VARIABLES 
            //HOJAS
                var doc = new jsPDF('l','pt','a4');  let arr0=[], i:number =0,j=0,k=0 , arr1=[], nrosalto:number=0, arrprog=[]; 
                let ncol:number, r, dividendo=nroDias, c=1;
            
            //CALENDARIO
                let arrCalendario:any[]=[], __arrCalendario:any[]=[]; let arrCalendarioString:any[]=[], __arrCalendarioString:any[]=[];
                __arrCalendario=this.calNumb.slice(0); __arrCalendario.splice(0,1);  __arrCalendarioString=this.calString.slice(0); __arrCalendarioString.splice(0,1);

            //NUMERO DE ARRAYS(FILAS) DE TODA LA TABLA
                //while(i<this.nroBusesFilaSelect){   
                while(i<nroBuses){  
                    arr0[i]=arr1; i++;
                } 
                arr1=[[],[],[],[],[],[],[]]; //NRO DE HOJAS EN TOTAL Q SE PUEDE DIVIDIR EL CALENDARIO

        //ALGORITMOS

            // ARRAY DE PROG (SOLO PLACAS) 

                arrprog=this.placasProgramacion(progBDDetalle,arrayPlacas); //CAMBIANDO PROG DE BUID A NROPLACAS
                i=0; let arrAux=[],arrborrar2=[];

            // ARRAY DE ARRAYCOLUMNAS - PREPARANDO PROGRAMACION (no dividido por hojas)
                while(i<nroBuses){
                    while(j<nroDias && i+nrosalto<arrprog.length){
                        arr0[i][j]=arrprog[i+nrosalto]; nrosalto=nrosalto+nroBuses; j++;
                    }
                    arrAux.push(arr0[i].slice(0)); i++;  nrosalto=0;  j=0;
                }
                arr0=arrAux;
            // AJUSTANDO EL NRO DE COLUMNAS A LA HOJA = 15 X HOJA
                    i=j=0; ncol = 15; 
                //1ER RESIDUO, SABER SI EL TOTAL DE COLUMNAS ES MENOR O IGUAL QUE EL MAXIMO DE COLUMNAS PERMITIDO 
                    r = dividendo - ncol;
                //DIVIDIENDO AL ARRAYS EN ARRAY DE MATRICES(CADA MATRIZ ES UNA HOJA)
                
      
        // HAY 2 A MAS HOJAS 
        if(r>0){
            //r: RESIDUO TOTAL(ULTIMA HOJA) ,  C: COCIENTE(NRO DE HOJAS)
                while( r > ncol ){  
                    dividendo = r; 
                    r = dividendo - ncol;  
                    dividendo = r;  
                    c++; 
                }

            //DIVIDIENDO EN ARRAYS (ARRAY DE CALENDARIO)    c:nro de veces en q debe dividirse en otros arrays
            //HOJAS DEL ARCHIVO
                //VARIABLES
                let calendarionumber:any[]=[];  calendarionumber=__arrCalendario.slice(0); 
                //DIVIDIENDO EL CALENDARIO
                while(i<=c){ 
                    while( k<ncol &&  (j<15*(i+1) && j<calendarionumber.length )  ){ 
                        arr1[i][k]=calendarionumber[j]; j++; k++; 
                    } 
                    k=0; i++; 
                }
                
                // arr0: MATRIZ DE PLACAS(PROGRAMACION)  
                // arr1: MATRIZ CALENDARIO NUMERICO 
                arr0=this.hojasProgracion(arr0,ncol,__arrCalendarioString ,c);
                arr1=this.insertEspacio(arr1,c+1, 'arrArr');
                arr0=this.insertEspacio(arr0,c+1, 'arrMat');

                j=i=0;
                while(i<c+1){arr0[i]=this.insertNumbRows(arr0[i]); i++;}
                while(j<c+1){arr0[j]=this.insertHoraSalidaBase(this.arrHoraBaseSal,arr0[j]);j++;}

                //GENERANDO EL ARCHIVO PDF
                i=j=0;
                //INICIANDO LAS HOJAS DEL PDF
                while(arr1[i].length != 0 && j<(c)){ 
                    doc.setFontSize(10)
                    doc.text(40, 40, tituloArchivo+' RUTA 13');
                    doc.autoTable(arr1[i],arr0[i],{ 
                        styles: {fontSize: 8,halign: 'center',cellPadding: 1},   
                        margin: {top: 60, right: 10, bottom: 10, left: 11},
                        theme: 'grid',
                        columnWidth: 'auto',
                        valign: 'top',
                    });
                    doc.addPage();
                    i++;
                    j++;
                }           

                // PDF ULTIMA HOJA  -> INTEGRAR EL RESTO DE LAS COLUMNAS QUE FALTAN, USAR EL RESIDUO DE LA DIVISION 
                doc.text(40, 40, tituloArchivo+' RUTA 13');
                doc.autoTable(arr1[c], arr0[i],{ 
                        styles: { fontSize: 8, halign: 'center', cellPadding: 1,columnWidth: 48 },   
                        margin: {top: 60, right: 10, bottom: 10, left: 11},
                        theme: 'grid',
                        columnWidth: 'auto',
                        valign: 'top',
                });
        

        //UNA SOLA HOJA (RESIDUO ES MENOR A CERO)
        }else if(r<=0){
            arr0.unshift(__arrCalendarioString); 
            doc.setFontSize(10); doc.text(40, 40, tituloArchivo+' RUTA 13');

            __arrCalendario=this.insertEspacio(__arrCalendario,1, 'arr');
            arr0=this.insertEspacio(arr0,1, 'mat');

            arr0=this.insertNumbRows(arr0);
            arr0=this.insertHoraSalidaBase(this.arrHoraBaseSal,arr0);

            doc.autoTable(__arrCalendario, arr0,{ 
                styles: { fontSize: 8, halign: 'center', cellPadding: 1},   
                margin: {top: 60, right: 10, bottom: 10, left: 11},
                theme: 'grid',
                columnWidth: 60,
                valign: 'top',
            });
            
        }

        //GUARDANDO ARCHIVO CON NOMBRE 
            doc.save(nombreArchivo+''+'.pdf');
            this.mensaje="Se Descargo La Programacion";
            this.displayProgramacion=false;
            this.displayDescargaProg=true;
        
    }

    //insertando espacios vacios
    insertEspacio(arr=[], nroRep:number, tipo: string){
        if(tipo==='arr'){
            let i:number=0; let _arr=arr.slice(0);
            while(i<nroRep){
                _arr.splice(0,0,' ',' ');
                i++;
            }
            return _arr;
        }else if(tipo==='mat'){
            let i:number=0; let mat=arr.slice(0);
            
             while(i<nroRep){
                
                 mat[0].splice(0,0,' ',' ');
                 i++;
             }
             return mat;
        
        }else if(tipo==='arrArr'){
            let i:number=0; let _arr=arr.slice(0);
            while(i<nroRep){
                _arr[i].splice(0,0,' ',' ');
                i++;
            }
            return _arr;
        }else if(tipo==='arrMat'){
            let i:number=0; let mat=arr.slice(0);
           
            while(i<nroRep){
               
                mat[i][0].splice(0,0,' ',' ');
                i++;
            }
            return mat;
        }
    }

    //INSERTAR NUMERACION
    insertNumbRows(arrProg=[]){
        let result:any[]=[];let i=1;
        //arrProg[0].unshift(''); arrProg[0].unshift('');
        while(i<arrProg.length){
            arrProg[i].unshift(i.toString());
            i++;
        }
        result=arrProg;
        return result;
    }

    //INSERTAR HORA BASE DE SALIDAS
    insertHoraSalidaBase(arrHSal=[], arrProg=[]){
        let result; let i:number=0, j:number=0; let _arrProg=arrProg.slice(0);
        //console.log(_arrProg);
        while(i<arrHSal.length){
            //_arrProg[i+1][1]=arrHSal[i].PrDeHoraBase;
            _arrProg[i+1].splice(1,0,arrHSal[i].PrDeHoraBase);
            i++;
        }
       result=_arrProg;
        return result;
    }

    insertHoraSalidaBaseVista(arrHSal=[], arrProg=[]){
        let result; let i:number=0, j:number=0; let _arrProg=arrProg.slice(0);
        //console.log(_arrProg);
        while(i<arrHSal.length){
            //_arrProg[i+1][1]=arrHSal[i].PrDeHoraBase;
            _arrProg[i].splice(1,0,arrHSal[i].PrDeHoraBase);
            i++;
        }
       result=_arrProg;
        return result;
    }

    // DESCOMPONIENDO MATRIZ EN ARRAY DE MATRICES(HOJAS)
    hojasProgracion(arrprog=[], ncol:number, arrCalStr=[] , nrohojas:number){
        let arrResult:any[]=[];
            //console.log(arrprog); 
            
        //variables
            let i=0, j=0; let nroRowArr:number;//VARIABLES SIMPLE
            let _arrcalnum=[], _arrcalstr=[], arrmatprog=[]; //ARRAYS

        //algoritmos
            //iniciando arrays
                    //_arrcalnum=this.initarrays(nrohojas,1); //calendario numerico
                    _arrcalstr=this.initarrays(nrohojas,1); //calendario string
                //matriz programacion
                    nroRowArr=arrprog.length;
                    arrmatprog=this.initarrays(nrohojas,nroRowArr);
            //DIVIENDO
                    //_arrcalnum=this.diviendoarrays(ncol, arrCalNum, _arrcalnum, 1, nrohojas); // calendario numerico
                    _arrcalstr=this.diviendoarrays(ncol, arrCalStr, _arrcalstr, 1, nrohojas); // CALENDARIO STRING
                    arrmatprog=this.diviendoarrays(ncol, arrprog, arrmatprog, 2, nrohojas);
                    

            //UNIENDO MATRIZPROG + ARRAYCALSTRING
            if(_arrcalstr.length==arrmatprog.length){
                i=0;
                while(i<_arrcalstr.length){
                    arrmatprog[i].unshift(_arrcalstr[i]);
                    i++;
                }
            }
            arrResult=arrmatprog.slice(0);
            //console.log(arrmatprog);
        return arrResult;
    }

    //iniciando arrays
    initarrays(nrohojas:number, nroRowArr:number){
        //console.log(nroRowArr);
        let _arrrest1=[]; let _arrrest2=[];
        let i=0; let j=0; nrohojas++;

        //arr lineal
        if(nroRowArr==1){
            while(i<nrohojas){
                _arrrest1[i]=[];
                i++;
            }
            return _arrrest1;

        //arr multi
        }else if(nroRowArr>1){
            while(i<nrohojas){
                _arrrest2[i]=[];
                while(j<nroRowArr){
                    _arrrest2[i][j]=[];
                    j++;
                }
                j=0;
                i++;
            }

            return _arrrest2;
        }    
    }

    //DIVIDE LOS ARRAY INGRESADOS EN MATRIZ O ARRAYS
    diviendoarrays(ncol:number, arrcont=[], arrresul=[] , tipoarr:number, nrohojas:number){
        let i=0; let j=0; let k=0;  let resto:number; let l:number;
        //console.log(arrcont);
        
        //LINEAL
        if(tipoarr==1){
            resto=arrcont.length-ncol*nrohojas;
      
            //DIVIDIR ARRAY
            while(i<nrohojas){
                while(j<ncol){
                    arrresul[i][j]=arrcont[k]; k++; j++;
                }
                j=0; i++;
            }

            if(resto!=0){
                while(i<nrohojas+1){
                    while(j<resto){
                        arrresul[i][j]=arrcont[k];
                        k++; j++;
                    }
                    j=0; i++;
                }
            }
            return arrresul;
        //MATRIZ
        }else if(tipoarr==2){
            //i: filas;     j: nro hojas prog;      k: nro columnas;  l:salto entre hojas(indices filas)
            i=0; j=0; k=0; l=0;  resto=arrcont[0].length-ncol*nrohojas;

            //HOJAS ENTERAS
                while(j<nrohojas){//HOJAS PROG
                    while(k<ncol*(j+1)){//NRO COLM
                        while(i<arrcont.length){//NRO FILAS MAT
                            arrresul[j][i][l]=arrcont[i][k];
                            i++;
                        }
                        l++; i=0; k++;
                    }
                    l=0; j++;
                }
            
            //HORAS RESIDUO
            //console.log(resto); console.log(j); console.log(k);
            if(resto!=0){
                while(j<(nrohojas+1)){//HOJAS PROG
                    //console.log( (ncol*(j+1))+resto);
                    //console.log( (ncol*j)+resto);
                    while( k < (ncol*j)+resto) {//NRO COLM

                        while(i<arrcont.length){//NRO FILAS MAT
                            arrresul[j][i][l]=arrcont[i][k];
                            i++;
                        }
                        l++; i=0; k++;
                    }
                    l=0; 
                    j++;

                }
            }

            //console.log(arrresul);
            return arrresul;
        }
        
    }

    //BOTON ACEPTAR DESCARGA PROGRAMACION
    descargaProg(){
        this.mensaje="";
        this.displayDescargaProg=false;
    }

    /* CAMBIANDO BUID POR PLACA (TODA LA PROGRAMACION) */
    placasProgramacion(arr1 = [],arrplacas = []) {
        let arrbuid=[{}], arrplacasprog=[];
        let i,j,k,cen=0;
        /*SEPARANDO BUID PARA CAMBIARLO POR SUS PLACAS*/
        for(let i=0; i<arr1.length; i++){
            arrbuid[i]=arr1[i].BuId;
        }
        /*CAMBIAR BUID POR SU PLACA RESPECTIVA*/
        i=0; j=0; k=0;
        while(i<arr1.length){
                while(j<arrplacas.length && cen==0){
                    if(arrbuid[i]==arrplacas[j].BuId){
                        arrplacasprog.push(arrplacas[j].nroPlaca);
                        cen=1;
                    }else if(arrbuid[i]!=arrplacas[j].BuId){
                        j++;
                    }
                }
                j=0;
                cen=0;
            i++;
        }
        return arrplacasprog;
    }

    //validando fecha 
    validarProgFechaInicio(PrFechaInicio:string, arrProg=[], arrDiasSemana=[]):boolean{
        let resultado:boolean, fechaAnt:string;
        
      
        if(arrProg.length!=0){
            fechaAnt=arrProg[arrProg.length-1].PrFechaFin;
            let validFechaInit=fechaMayor(formatFech(fechaAnt),PrFechaInicio);
            let diaValido=this.fechaInicioXDiasSemana(PrFechaInicio,arrDiasSemana,this.dtSelectDias);
            let validez=validFechaInit && diaValido;
          
            resultado=validez;
        }else if(arrProg.length==0){
            resultado=true;
        }
     
        return resultado;
    }

    /* fecha inicio dentro de dias de la semana 
                            (yyyy-mm-dd)    1,2,3,4,5,6,0    
    */
    fechaInicioXDiasSemana(fechaInicio:string,arrDiasSemana=[],dtSelectDias=[]):boolean{
        //console.log(dtSelectDias);  console.log(fecha(fechaInicio).getDay()); console.log(arrDiasSemana);
        let i:number=0, cen:number=0,  dia=fecha(fechaInicio).getDay(), result:boolean;
        while(i<dtSelectDias.length && cen==0){
            if(dia!=dtSelectDias[i].value){
                i++; cen=0;
            }else if(dia==dtSelectDias[i].value){
                cen=1;
            }
        }
        if(cen==0){
            result=false;
        }else if(cen==1){
            result=true;
        }
        return result;
    }

    /* formulario 1 
        nuevo CREAR PROGRAMACION BASE */
        // btn Next
        private funcFormOneNextProgBase():void{
            this.PrBaDiasIncluidos=this.diasIncluidos(this.dtSelectDias)
            this.displayFormHorasBase=true;

            let calendar=this.funcCalendarioNumerico(this.PrBaFechaInicio,this.PrBaFechaFin), _calendar=[], arrCalSubEmp=[];
            for(let i=0; i<calendar.length; i++){
                _calendar.push(_fecha1(calendar[i]));
            }

            this.empSubEmpService.getallsubempresasbyemid(this.emid).subscribe(
                data=>{
                    console.log(data);
                    let arrSubEmp=data, longArrSubEmp=data.length;

                    //iniciando array de fechas + sorteo aleatorio
                    for(let i=0; i<_calendar.length; i++){
                        this.arrAllSubEmp.push({
                            fecha:_calendar[i],
                            arrSubEmps:[],
                            Estado:'Si'
                        })
                    }

                    let j=0, i=0,randomNum=[];
                    while(i<this.arrAllSubEmp.length){
                        randomNum=numRandom(longArrSubEmp)       
                        while(j<longArrSubEmp){                                                  
                            this.arrAllSubEmp[i].arrSubEmps.push({  
                                                                    Id:j, 
                                                                    SuEmId:arrSubEmp[j].SuEmId, 
                                                                    SuEmRSocial:arrSubEmp[j].SuEmRSocial, 
                                                                    SuEmSorteo:randomNum[j] 
                                                                });     
                            j++;
                        }
                        j=0;
                        i++;
                    }

                    this.placasservice.getAllPlacasBusByEmSuEm(this.emid,0).subscribe(
                            data=>{
                                this.nroTotalMinibuses=data.length
                                for(let i=0; i<data.length;i++){
                                    this.ordenSorteo.push({
                                        nro:i+1,
                                        HoraBase:'HH:MM:SS'
                                    })
                                }
                            });
                    

                });
        
        }
        // btn cancel
        private funcFormOneCancelProgBase():void{
            this.displayNewProgmBase=false;
        }

    /* formulario 2 agregando horas base */
        // btn Next
        private funcFormTwoNextProgBaseHb():void{
            this.displayOrdSubEmpBaseRegDiario=true;
            //console.log(this.arrAllSubEmp);
            //console.log(this.ordenSorteo);
            let arrHB=[], PrBaHoraBase:string;
            for(let i=0;i<this.ordenSorteo.length;i++){ 
                arrHB.push(this.ordenSorteo[i].HoraBase);
            }
            PrBaHoraBase=arrHB.join(',');
            console.log(PrBaHoraBase);
            this.PrBaHoraBase=PrBaHoraBase
            this.arrAllSubEmpByDays=this.arrAllSubEmp[0].arrSubEmps;
        }

        // btn cancel
        private funcFormTwoCancelProgBaseHb():void{
            this.displayOrdSubEmpBaseRegDiario=false;
        }

    /* formulario 3
        orden de las subempresas - generar todos los registros diarios
    */
        funcBtnOkOrderSubEmpAperRegDiario(){
            let objProgBase={
                PrBaId: this.PrBaId,
                UsFechaReg: new Date(),
                UsId: this.userid,
                EmId: this.emid,
                PrBaDescripcion: this.PrBaDescripcion,
                PrBaFecha: new Date(),
                PrBaFechaInicio: fecha(this.PrBaFechaInicio),
                PrBaFechaFin: fecha(this.PrBaFechaFin),
                PrBaDiasIncluidos: this.PrBaDiasIncluidos,
                PrBaHoraBase: this.PrBaHoraBase
            }
            this.progBaseService.saveProgBase(objProgBase).subscribe(
                data=>{
                    let arrObjInitRegDays=[], arrHoraBase=[];
                    //arrHoraBase=this.funcGetHoraBase(this.PrBaHoraBase);
                   
                    //tomar el id de data para crear un array de objetos para registro diario
                    for(let i=0; i<this.arrAllSubEmp.length;i++){
                        arrObjInitRegDays.push({
                            ReDiFeha: fecha(guion_posFecha(cCeroFechaForEditar(this.arrAllSubEmp[i].fecha))), //sacar del array del combo
                            ReDiOrdenSubEmpresa: this.funcGetOrderArrProgSubEmp(this.arrAllSubEmp,i),//sacar del array del combo
                            ReDiTotalVuelta: this.CoNroMaxVueltas,
                            ReDiId: 0,
                            PrBaId: data.PrBaId,
                            UsFechaReg: new Date(),
                            UsId: this.userid,
                            EmId: this.emid,
                            ReDiHoraInicioDiario:hora("04:28:00") //este campo se tiene que eliminar ya que este es la primera salida del hora base
                        });
                    }
                    console.log(arrObjInitRegDays);
                    this.regDiarioService.generarofprogramacionbase(arrObjInitRegDays).subscribe(
                        data=>{console.log(data);}
                    );
                },error=>{
                },()=>{}
            );   
        }
        /*funcGetHoraBase(PrBaHoraBase:string){
            let _PrBaHoraBase=PrBaHoraBase.split(','),__PrBaHoraBase:any[]=[];
            
            for(let i=0;i<_PrBaHoraBase.length;i++){
                __PrBaHoraBase.push(hora(_PrBaHoraBase[i]));
            }
            return __PrBaHoraBase;
        }*/
        //sacar orden de subempresas de dias de programacion
        funcGetOrderArrProgSubEmp(arrAllSubEmp=[],pos:number):string{
            let orderSubEmp:string,
                longArrSuEmId=arrAllSubEmp[pos].arrSubEmps.length, 
                arrSubEmp=[], arrAux=[],aux:number, _arrSorteo=[];
                
                for(let i=0; i<longArrSuEmId; i++){ 
                    _arrSorteo.push(arrAllSubEmp[pos].arrSubEmps[i].SuEmSorteo);
                }

                //ordenar sorteo
                for(let i=0; i<longArrSuEmId;i++){
                    for(let j=0; j<longArrSuEmId;j++){
                        if(_arrSorteo[j]>_arrSorteo[j+1]){
                            aux=_arrSorteo[j];
                            _arrSorteo[j]=_arrSorteo[j+1];
                            _arrSorteo[j+1]=aux;
                        }
                    }
                }
                //ordenar las subempresas por el sorteo(ordenado)  - algoritmo busqueda
                let i=0,j=0,cen=0;
                while(i<_arrSorteo.length){
                    while(j<longArrSuEmId&&cen==0){
                        if(_arrSorteo[i]==arrAllSubEmp[pos].arrSubEmps[j].SuEmSorteo){
                            _arrSorteo[i]=arrAllSubEmp[pos].arrSubEmps[j].SuEmId;
                            cen=1;
                        }else{
                            cen=0; j++;
                        }
                    }
                    cen=0;
                    i++;
                    j=0;
                }

                orderSubEmp=_arrSorteo.join(',');
               
            return orderSubEmp;
        }

        funcBtnCancelOrderSubEmpAperRegDiario(){

        }
        funcCboFechProg(){

        }
        onEditCompleteFieldOrderSubEmp(event){
            console.log('cathy');
                console.log(event);
        }
        //cuando cancelo con escape
        onEditCancelFieldOrderSubEmp(event){
                console.log('linares');
                console.log(event);
        }
        //cuando hago clic sobre la celda
        onEditInitFieldOrderSubEmp(event){
                console.log('rojas');
                console.log(event);
        }
        funcBtnDTProgm(PrBaId:number){
            console.log(PrBaId); 
            this.progBaseService.deleteProgBaseById(PrBaId).subscribe(
                data=>{
                    this.progBaseService.getAllProgramacionBaseByEm(this.emid,this.anio).subscribe(
                        data=>{this.mgAllProgramacionBaseByEm(data);}
                    );
                }
            );
        }


}
