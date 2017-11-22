import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {ProgramacionService} from '../service/prog.service'
import {PlacasService} from '../service/placas.service'
import {GlobalVars} from 'app/variables'
import {hora,formatFechInArr,_fnroDias,fecha,arrABI,arrANBI,_hora, tipoAnio,_fecha1,_fecha2,slash_posFecha,horaValida,
        formatFech,addDays,_addDays,editf1,fechaActual1, cambianBuIdxNroPlaca} from 'app/funciones';


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
        private nroTotalMinibuses:number;
        private nroMiniBus:number;
        private horaBase:string;
        private emid:number;
        private userid:number;
        private PrId:number;
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
        private bNAct:number; //NRO DE BUSES NO ACTIVOS
        private tipoProg:string;    //MANUAL O AUTOMATICA
        private formaProg:string;   //ESCALA O PESCADITO
        private titArchivoPDF:string;
        private nomArchivoPDF:string;
        private primerHSal:string;
        private PrDiasIncluidos:string;
         //para seleccionar una fila de la tabla
        //private idFilaSeleccionada: number;  CLICK SOBRE REG GRILLA
        private iDReg:number;       //CLICK BOTON DE FILA ELIMINAR
        private nroBusesFilaSelect: number;
        private nroDiasFilaSelect: number;
        private titleNuevoProgPrimerModal:string;  
        private mensaje:string;     //MENSAJE CONFIRMACION MODAL 
        private mensajeEspera:string;
        private mensajeProcesando:string;
        private resBusUnidades:string; /* PARA EL FORMULARIO DE NUEVA PROGRAMACION */
        private modEdit:boolean; /* modEdit=1: editando registro  modEdit=0: no se esta editando registro */
        private placaEditarCelda:number;
        /* ARRAYS */
        private selectedPlacas: string[] = []; /* NO USO */
        private placas:any[]=[]; //se utiliza para almacenar lo q devuelve el rest de las placas
        private placasComplet:any[]=[];
        //datos para la picklist (prog base)
        private arrayPlacas:any[] = []; //ESTATICO
        private _arrayPlacas:any[] = []; //DINAMICO
        private ordenSorteo:any[] = []; 
        private programacionMaestroArrayMemoria :any[]=[]; /* NO USO */
        private programacionMaestroArrayHTML :any[] = [];  //array para la grilla HTML
        private progMaestroArray:any[]= [];/* NO USO */
        private progDetalleArray:any[]=[];/* NO USO */
        private programacionArrayDetalleBD:any[]=[]; //array objetos detalle para mandar al rest
        private _programacionArrayDetalleBD:any[]=[];
        private _tipoProg:any[]=[];
        private _formaProg:any[]=[];
        private diasSemana:any[]=[];
        private dtSelectDias:any[]=[];
        //variables, se recupera las programaciones desde el servidor rest
        private progRest:any[]=[];
        private progRestMaestro:any[]=[]; /* NO USO */
        private progBDDetalle:any[]=[]; // para recoger resultado de la BD
        private _progBDDetalle:any[]=[]; /* NO USO */
        private modo:string; 
    //COLUMNAS DEL DATATABLE PRIMENG
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

    /* DISPLAY VENTANAS MODALES */
        private displayNuevaProgramacion: boolean = false;
        private displayProgramacionBase: boolean = false;
        private displayProgramacion: boolean = false;
        private displayConfEliminarCabecera: boolean = false; /* CONFIRMAR ELIMINAR REG PROGRAMACION */
        private displayAvisoNoPuedeBorrarProg:boolean=false;
        private displayAceptarProgNueva : boolean = false;
        private displayIniciandoProgramacion:boolean=false;
        private displayErrorDatos : boolean = false; // PRIMERA VENTANA MODAL PROGRAMACION
        private displayErrorTablaProgramacion : boolean=false; // ERROR EN LA TABLA DE PROGRAMACION
        private displayFaltanPlacas : boolean = false;
        private displayDescargaProg : boolean = false;
        private displayEditProgC : boolean = false;
        private displayDatosPDF:boolean=false;
        private displayHoraBase:boolean=false;
        private displayErrorCargarPlacas=false;
        private displayTerminoTodoGenerarProg=false;

    ngOnInit(){
        /*console.log(fechaSgte("2017/02/07",32));*/  /* TERMINAR ESTO */
        this.ordenSorteo = [];
        this.getAllPlacasBusByEmSuEm(this.emid,0); 
        this.getAllProgramacionByEm(this.emid,this.anio); /* EMID + AÑO */
       
        //console.log(this.descartarFechas(this.calendarioNumerico('2017-11-13', '2017-12-13'), '1,1,1,0,1,0,1'));
    }
    
    constructor(private programacionService: ProgramacionService, 
                private placasservice: PlacasService,
                public ClassGlobal:GlobalVars){
        this.emid=this.ClassGlobal.GetEmId();
        this.userid=this.ClassGlobal.GetUsId();
        this.lengthProgDet=0;
        this.anio=0;
        this.progMaestro.EmId = 1; /* ELIMINAR ESTO */
        this._tipoProg =[
            {id:"01",nTipo:"automatico"},
            {id:"02",nTipo:"manual"}
        ];
        this._formaProg=[
            {id:"01", nForma:"pescadito"},
            {id:"02", nForma:"escala"}
        ];
        this.nroMiniBus=0;
        this.nroTotalMinibuses=0;
        this.diasSemana=[
            {id:0,nro:1, nomb:'Lunes'},
            {id:1,nro:2, nomb:'Martes'},
            {id:2,nro:3, nomb:'Miercoles'},
            {id:3,nro:4, nomb:'Jueves'},
            {id:4,nro:5, nomb:'Viernes'},
            {id:5,nro:6, nomb:'Sabado'},
            {id:6,nro:7, nomb:'Domingo'},
        ];
    }
        
    funcCalendarioNumerico(refFecha1:string, refFecha2:string){
        let diaHoy = new Date(); let arrCalendar:any[]=[]; let i:number=1; 
        let f1=refFecha1.split('-'); let f2=refFecha2.split('-'); let nf1, nf2;
        nf1=_fnroDias(f1); nf2=_fnroDias(f2); let nroDias:number=nf2 - nf1; 

    
        let initfecha = fecha(refFecha1);

       
        let arrDaysSemana:any[]=[];
        arrCalendar[0]=fecha(refFecha1).getTime();

        while(i<nroDias){ 
            arrCalendar[i]=new Date(arrCalendar[0]+(i*(24*60*60*1000)));  
            i++; 
        }
        arrCalendar[0]=new Date(arrCalendar[0]);
        return arrCalendar;
    }
            
    //QUITAR DIAS DE LA SEMANA DE TODO EL CALENDARIO
    descartarFechas(arrFechas=[], diasValidos:string){
        let fechasValidas=[]; let arrDiasValidos=diasValidos.split(',');
        let i:number=0; let j=0; let _arrDiasValidos=[];
       
        while(j<arrDiasValidos.length){
            if(arrDiasValidos[j]=='1'){
                if(j>=0 && j<6){
                    _arrDiasValidos.push(j+1);
                }else if(j==6){ _arrDiasValidos.push(0) }
            }
            j++;
        }
        //console.log(_arrDiasValidos);
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
                                    this.mostrargrillaProgramacionMaestro() ;
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
                                        this.displayConfEliminarCabecera=false;
                                    },
                        err => {this.mensaje="No puede borrar esta programacion, esta siendo utilizada";
                                this.displayAvisoNoPuedeBorrarProg=true;    
                                this.displayConfEliminarCabecera=false;
                                console.log(err);}
                    );
                }
        /* GETTERS -> RECUPERANDO DATOS */
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
                            console.log(this._progrMaestro);
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
                        data => {   arrPlacas=data;
                                    //this.placas=arrPlacas;
                                 
                                    if(arrPlacas.length>0){
                                        this.extrayendoPlacasBus(arrPlacas,'nuevaprog'); 
                                        this.placas = arrPlacas; 
                                        //this.placasComplet=arrPlacas;
                                        //this.unidadesEstado(arrPlacas);
                                        //this.displayNuevaProgramacion=true;
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

            /*TODAS LAS PROGRAMACIONES POR EMPRESA Y AÑO*/
            getAllProgramacionByEm( empId: number, anio: number){
                this.programacionService.getAllProgramacionByEm(empId, anio).subscribe(
                        datos => { this.progRest = datos; console.log(this.progRest); this.mostrargrillaProgramacionMaestro(this.progRest); },
                        err => {this.errorMessage = err}, 
                        () =>this.isLoading = false
                    );
                
            }

            
    //ABRIR 1ERA VENTANA MODAL(BOTON NUEVO)
    NuevaProgCabecera(){
        this.modEdit=false;
        this.procNuevaProgrC(); /* PROCEDURE */
        /* ABRIR VENTANA */
        this.ordenSorteo=[]; //SORTEO DE PLACAS
        this.titleNuevoProgPrimerModal = 'Nueva';
        this.getAllPlacasBusByEmSuEm(this.emid,0);
        
        //this.arrayPlacas=

        this.unidadesEstado(this.extrayendoPlacasBus(this.placas,'nuevaprog'));
        this.displayNuevaProgramacion=true;
        

         //CALCULA EL NRO DE UNIDADES ACTIVAS Y NO ACTIVAS
        this.progBDDetalle=[];
        this.lengthProgDet=0;
        this.dtSelectDias=[];
        this.tipoProg="01"; //PROGRAMACION POR DEFECTO: MANUAL
        this.formaProg="01"; /* (1)MANUAL O (2)AUTOMATICO */
    }

    //1ERA VENTANA MODAL aqui recien se guarda la tabla MAESTRO en el REST 
    guardarProgCabecera(){
        let progCab:any;  let fIni=this.progMaestro.PrFechaInicio; let fFin=this.progMaestro.PrFechaFin;
        let placas=this.extrayendoPlacasBus(this.placas,'nuevaprog');

        //FECHA CORRECTA
        if( this.validandoFechas(fIni,fFin)==1){
            console.log(this.tipoProg);
            this.tipoProgramacion(placas,placas.length,this.tipoProg );//FORMA SORTEO
            progCab = {
                PrId : this.progMaestro.PrId, //number
                EmId : this.emid, //number
                PrCantidadBuses : this.bAct, //number
                PrDescripcion : this.progMaestro.PrDescripcion, //string
                PrFecha : new Date(), //string
                PrFechaInicio : this.fecha(this.progMaestro.PrFechaInicio), //string
                PrFechaFin : this.fecha(this.progMaestro.PrFechaFin), //string
                PrTipo : Number(this.tipoProg), //string escala pescadito
                PrAleatorio : 0, //string manual automatico(aleatorio)
                PrDiasIncluidos:this.diasIncluidos(this.dtSelectDias),
                UsId : this.userid, //number
                UsFechaReg : new Date() //string
            }
            this.procSaveProgramacion(progCab);
            this.displayNuevaProgramacion=false; //cerrar 1era ventana
            this.displayProgramacionBase=true; //abrir 2da ventana
        //FECHA NO CORRECTA
        }else if(this.validandoFechas(fIni,fFin)==0){
            
        }
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
    tipoProgramacion(arrayplacas=[], long:number, tprog:string){
       this.ordenSorteo=[];
        
        /* AUTOMATICO*/
        if(tprog=="01"){ 
            let array = ["c"];  let nro;//ARRAY NUMEROS ALEATORIOS NO REPETIDOS
            let _arrayplacas=[];  let i=0,j=0, cen=0; // cen=0: no existe         cen=1: existe

            //ALGORITMO NROS ALEATORIOS
            while(i<long ){
                nro = Math.floor(Math.random()*long);//NUMEROS ALEATORIOS ENTRE 0 Y LONG
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
            
            //APLICANDO ALGORITMO, BUSCANDO INDICES CON ARRAY DE PLACAS
            i=0; nro=0;
            while(i<array.length){
                _arrayplacas.push(arrayplacas[array[i]]);
                i++;
            }
            this.ordenSorteo=_arrayplacas;
            this.arrayPlacas=[];
        /* MANUAL*/
        }else if(tprog=="02"){
            console.log("manual");
        }
        
    }
 
    //ARRAY DIAS PROGRAMACION//      1 : NO BISIESTO    2017-05-02   0 : BISIESTO
    calendarioProg(f1 : string, f2 : string, diasIncl:string){
        let calendario= this.descartarFechas(this.funcCalendarioNumerico(f1,f2), diasIncl);
        let i=0; let arrCalNumber:any[]=[]; let arrCalString:any[]=[];

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
        //this.calendario=this.calendarioNumb(f1,f2);
        //this.calendarioString=this.calendarioChar(f1,f2,this.calendario);
    }

   
    //CERRAR MENSAJE DE SE ENCONTRO ERROR EN LOS DATOS INGRESADOS
    errorDatos(){
        this.mensaje="";
        this.displayErrorDatos=false;
    }

    //VALIDANDO FECHAS
    validandoFechas(f1:string, f2 :string) : number{
        let val1: number,val2: number,val : number,  _f1, _f2,i:number,j:number;
        _f1 = f1.split('-'); _f2 = f2.split('-');

        for(i=0; i<_f1; i++){
            _f1[i] = this.quitandoCerosIzq(_f1[i]);
        }
        for(i=0; i<_f2; i++){ 
            _f2[i] = this.quitandoCerosIzq(_f2[i]);
        }

        _f1 = _f1.toString(); _f2 = _f2.toString();
        val1 = this.fnroDias(_f1); val2 = this.fnroDias(_f2);

        //console.log(val1 + "  "+val2);
        let ndias = val2 - val1 + 1;
        //console.log(ndias);
        if(ndias>9  &&  ndias<=62){
            val = 1 ; //LAS FECHAS SON CORRECTAS
        }else if(ndias <= 0 || ndias>62 ){
            val = 0 ; //LAS FECHAS NO SON CORRECTAS
        }

        return val;
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
        //console.log(arrayPlacas);
        while(i<arrayPlacas.length){
            if(arrayPlacas[i].BuActivo==true){
                bAct++;
            }else if(arrayPlacas[i].BuActivo==false){
                bNAct++;
            }
            i++;
        }
        
        this.bAct = bAct;
        this.bNAct= bNAct;
        this.resBusUnidades="  Activos: "+this.bAct+"    -      No Activos: "+this.bNAct;
    }


    //2DA VENTANA MODAL(boton continuar)
    //BOTON GENERAR PROGRAMACION 
    programacionSegundoModal(){
        let arrProgDetalle=[];
        //this.programacionArrayDetalleBD=[];
        if(this.progMaestro.PrCantidadBuses!=this.ordenSorteo.length){
            this.mensaje="Error en las Placas Del Sorteo";
            this.displayFaltanPlacas=true;
        }else if(this.progMaestro.PrCantidadBuses == this.ordenSorteo.length){
            this.displayProgramacionBase=false; 
              
            this.placaEditarCelda=this.ordenSorteo[0].nroPlaca;
            this.progDetalle.PrDeFecha = new Date();
            
            //CARGAR EN ARRAY DE OBJETOS PARA MANDAR A LA BD
            for(let i=0; i<this.ordenSorteo.length ; i++){
                arrProgDetalle.push({
                    PrId : this.PrId,
                    BuId : this.ordenSorteo[i].BuId,
                    PrDeFecha: new Date(),
                    PrDeBase: this.progDetalle.PrDeBase,
                    PrDeOrden: i+1,
                    UsId: this.userid,
                    UsFechaReg: new Date(),

                    PrDeId:0,
                    PrDeAsignadoTarjeta:0,
                    PrDeCountVuelta:0,
                    PrDeHoraBase:0,
                });  
            } 

            this._programacionArrayDetalleBD=arrProgDetalle.slice(0);  // SEPARO ESTO PARA DESPUES CARGARLO CON LOS PRDEID
            
            this.guardarProgDetalle(arrProgDetalle, this.emid, this.PrId, true);


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

    AgregarHBase(){
        if(this.nroMiniBus<this.nroTotalMinibuses){         
            let indicePorInicio=this.buscarPrimerHMS(this.ordenSorteo);
            this.ordenSorteo[indicePorInicio].HoraBase=this.horaBase;
            this.nroMiniBus=this.conteoHBAgregadas(this.ordenSorteo);
            let indexNextPos=this.buscarSigtePosicion(this.ordenSorteo);
          

            if(indexNextPos-indicePorInicio==1){
                if(this.nroTotalMinibuses==indexNextPos){
                    this.placaEditarCelda=this.ordenSorteo[indicePorInicio].nroPlaca;
                }else{
                    this.placaEditarCelda=this.ordenSorteo[indexNextPos].nroPlaca;
                }
            }else if(indexNextPos-indicePorInicio>1){
                this.placaEditarCelda=this.ordenSorteo[indicePorInicio].nroPlaca;  
            }
            
        }else if(this.nroMiniBus==this.nroTotalMinibuses){
            console.log("programacion terminada");
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
        console.log(arrProg);
        console.log(emid);
        console.log(prid);
        console.log(base);
        this.programacionService.saveProgramacionDetalle(arrProg,emid,prid,base)
            .subscribe( 
                realizar => {   console.log(realizar);
                                this.mensajeEspera="Iniciando la Programacion...";
                                this.displayAceptarProgNueva= true; 
                                //this.horaBase="";
                                if(realizar==true){
                                    this.mensajeEspera="";
                                    this.displayAceptarProgNueva= false; 
                                    this.displayHoraBase=true;
                                }else if(realizar==false){
                                    this.mensajeEspera="Error al iniciar la Programacion";
                                    this.displayAceptarProgNueva= true; 
                                }    
                                //this.getallprogramaciondetallebyprid(prid); 
                            }, 
                err => {this.errorMessage = err;
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
        this.displayHoraBase=false;
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
    cancelNewProgramacion(){
         this.displayNuevaProgramacion=false;
         this.progMaestro={};
         
    }

    //CERRAR 2 MODALES (1ER Y 2DO MODAL ) cerrar ventanas new programacion (2do Modal)
    cancelarProgBaseSegundoModal(){
        this.displayProgramacionBase = false; //1era MODAL
        this.displayNuevaProgramacion=false;  //2da MODAL
        
        //BORRAR ULTIMA PROGRAMACION SEMI CREADA
        this.procEliminarProgr(this.progMaestro.PrId);
    }

    cancelarProgBaseTercerModal(){
        this.displayHoraBase=false;
        this.horaBase="";
        this.nroMiniBus=0;
        this.nroTotalMinibuses=-1;
        //BORRAR ULTIMA PROGRAMACION SEMI CREADA
        this.procEliminarProgr(this.progMaestro.PrId);
    }

    //datos para grilla HTML Maestro (consulta especialmente hecha para mostrar en el res)
    mostrargrillaProgramacionMaestro(arrProg=[]){
        this.programacionMaestroArrayHTML=[];

        //progRest es la variable q almacena las programaciones recuperadas desde el Rest de internet
        for(let prog of arrProg){
            this.programacionMaestroArrayHTML.push({
                nro:0,
                tipo:"",
                EmConsorcio : prog.EmConsorcio,
                PrCantidadBuses : prog.PrCantidadBuses,
                PrFecha : prog.PrFecha,
                PrFechaInicio : this._fecha(prog.PrFechaInicio),
                PrFechaFin : this._fecha(prog.PrFechaFin),
                PrAleatorio : "0"+prog.PrAleatorio, 
                PrTipo : "0"+prog.PrTipo,
                dias : prog.dias,
                prDescripcion : prog.prDescripcion,
                prId : prog.prId,
                PrDiasIncluidos:prog.PrDiasIncluidos
            });
        }

        //ENUMERAR REGISTRO
        for(let i=0; i<this.programacionMaestroArrayHTML.length; i++){
            this.programacionMaestroArrayHTML[i].nro=i+1;
        }

        //MANUAL O AUTOMATICO PROGRAMACION
        for(let i=0; i<this.programacionMaestroArrayHTML.length; i++){
            if(this.programacionMaestroArrayHTML[i].PrTipo=="02"){
                this.programacionMaestroArrayHTML[i].tipo="Manual";

            }else if(this.programacionMaestroArrayHTML[i].PrTipo=="01"){
                this.programacionMaestroArrayHTML[i].tipo="Automatico";
            }
        }
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

    //seleccionar fila de la tabla
    onRowSelectMaestro(event){
        let fi, ff , prId , PrDiasIncluidos:string;
        prId = event.data.prId; //ID DE LA FILA 
        this.nroBusesFilaSelect = event.data.PrCantidadBuses; // CANT BUSES
        this.nroDiasFilaSelect  = event.data.dias; //CANT DIAS
        console.log(event.data.PrDiasIncluidos);

        fi = this.formatoCal(event.data.PrFechaInicio);  
        ff = this.formatoCal(event.data.PrFechaFin);
        PrDiasIncluidos='1,1,1,1,1,1,1';
        this.modo='tablavista';
        this.getAllPlacasBusByEmSuEm(this.emid,0);

        this.calendarioProg(fi,ff,PrDiasIncluidos);
        this.progBDDetalle=[];
        this.arrayPlacas=[];

        //LIMPIANDO VARIABLES
        this.columnas=[]; //COLUMNAS
        this._columnas=[]; //ITEMS COLUMNAS DATATABLE

        //CONSULTA PROGRAMACION DETALLE
        this.programacionService.getAllProgramacionDetalleByPrId(prId).subscribe(
            data => {
                        this.progBDDetalle = data; 
                        console.log(this.progBDDetalle);
                        if(this.progBDDetalle.length!=0){
                            this.extraerHoraBase(this.progBDDetalle, this.nroBusesFilaSelect);
                            this.tablaProgramaciones(this.progBDDetalle, this.nroBusesFilaSelect, this.nroDiasFilaSelect, this.extrayendoPlacasBus(this.placas,'tablavista'));
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
            let indice=this.buscarPrimerHMS(this.ordenSorteo);
            this.placaEditarCelda=this.ordenSorteo[indice].nroPlaca;
            this.nroMiniBus=this.conteoHBAgregadas(this.ordenSorteo);
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
    tablaProgramaciones(progBDDetalle=[], nroBusesFilaSelect:number, nroDiasFilaSelect:number, arrPlacas=[]){
        
        if(  (progBDDetalle.length > nroBusesFilaSelect )){
                //ALGORITMO PARA PASAR LOS ID DE BUSES DE LOS PRIMEROS 
                //1ERA MATRIZ
                let a1 :any[]=[]; let a2 :any[]=[]; let a3 :any[]=[]; let i=0; let j=0; let k=0;       
                while(i<nroDiasFilaSelect){
                    //PARA FILAS
                    while(j<(nroBusesFilaSelect*nroDiasFilaSelect) && k<nroBusesFilaSelect){
                        a2.push(progBDDetalle[j].BuId);
                        a1[i]={field:i, header:i}; //COLUMNAS                                   
                        j++; k++;
                    }
                    a3[i]=a2; k=0; i++; a2=[];
                }

                //2DA MATRIZ (TRANSPUESTA DE LA 1ERA)
                let a4: any[]=[]; let a5: any[]=[]; let l=0; let m=0; let n=0; let aux=0;

                //TRANSPUESTA 
                //INICIANDO MATRIZ
                while(l<nroBusesFilaSelect){
                    while(m<nroDiasFilaSelect){
                        a4.push(0);  m++;
                    }
                    a5[l]=a4; m=0; l++; a4=[];
                }

                l=0; m=0;
                //MOVIENDO 
                while(l<nroBusesFilaSelect){
                    while(m<nroDiasFilaSelect){
                        a5[l][m]=a3[m][l]; m++; 
                    }
                    l++; m=0;
                }

                this._detalle=cambianBuIdxNroPlaca(a5,arrPlacas);
                
                // INSERTANDO EL NRO DE DE FILA EN LA TABLA 
                for(i=0; i<this._detalle.length;i++){
                    (this._detalle[i]).splice(0,0,(i+1).toString());
                }
                
                this.calNumb.unshift(" "); this.calString.unshift(" ");  this.nroColumn=nroDiasFilaSelect;
                this.displayProgramacion = true;
        }else if(progBDDetalle.length == nroBusesFilaSelect || progBDDetalle.length < nroBusesFilaSelect){
                this.mensaje="Error al Generar la Programacion, Vuelva a Generarlo";
                this.displayErrorTablaProgramacion=true;
        }
        
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
        console.log(obj);
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
    eliminarRegistroGrilla(_PrId : number){
        //console.log("eliminar "+_PrId);
        this.mensaje = "¿Esta Seguro de Eliminar Este Registro de la Tabla?";
        this.displayConfEliminarCabecera = true
        this.iDReg = _PrId;
    }

    //PROCEDIMIENTO ALMACENADO PARA ELIMINAR
    borrarRegistro(){
         this.programacionService.deleteProgramacionByid(this.iDReg).subscribe(
            realizar => {
                            this.getAllProgramacionByEm(this.emid,this.anio); 
                            this.iDReg=0;
                            
                            this.displayConfEliminarCabecera=false;
                        },
            err => {this.mensaje="No puede borrar esta programacion, esta siendo utilizada";
                    this.displayAvisoNoPuedeBorrarProg=true;    
                    this.displayConfEliminarCabecera=false;
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
        //console.log(this.calNumb);
        //console.log(this.calString);
        this.getAllPlacasBusByEmSuEm(this.emid,0);
        console.log(this.nroBusesFilaSelect);
        this.descargarProgramacion(this.nomArchivoPDF, this.titArchivoPDF, this.calNumb,this.calString, this.nroBusesFilaSelect , nroDias, this.progBDDetalle, this.extrayendoPlacasBus(this.placas,'tablavista') );
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
                while(i<this.nroBusesFilaSelect){   arr0[i]=arr1; i++;
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

/* CARGAR GLOBAL */ 
    //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD 
    fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1]) -1 ,  Number(resultado[2]) , 12, 0,0 );
        return _thoy;
    }

    //CONVERTIR STRING A DATE FORMULARIO A BD  HORAS
    hora(fecha : string) : Date{
        //FECHA               
        let thoy:Date,  otra:Date, horaTarjeta:string;
        thoy=new Date();
        if(fecha.length<=5){ fecha = fecha+":00"; }
        horaTarjeta=fecha;
        let resultado=horaTarjeta.split(':');
        otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
        return otra; 
    }

    //CONVERTIR DATE A STRING DE BD A FORMULARIO HORAS
    _hora(fecha : Date) :string{
        let hora : string; let _hora : string; let _fecha = new Date(fecha);
        _hora =  (_fecha.getHours() - 1).toString();// restando 1 hora (CORREGIR EN EL BACKEND)
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

    cCeroFechaForEditar(f : string) :string{
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
            _fecha=resultado[0]+"-"+resultado[1]+"-"+resultado[2];
        
        return _fecha
    }
    
    //CONVERTIR DATE A STRING PARA FECHA  - ---   BD A GRILLA
    _fecha(fecha: Date) :string{
        let fechaProg : string; let _fechaProg : string; let _fecha = new Date(fecha); 
        _fechaProg=(_fecha.getDate()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+ (_fecha.getFullYear()).toString();
        //_fechaProg=(_fecha.getFullYear()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+(_fecha.getDate()).toString() ;
        
        _fechaProg=this.cCeroFecha(_fechaProg);
        return  _fechaProg;
    }


}

 /*var num = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
        var indice = Math.floor(Math.random()*num.length);
        var number = num[indice];
        num.splice(indice, 1);
        console.log(num);*/
        //console.log(this.arrayPlacas);