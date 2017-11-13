import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {ProgramacionService} from '../service/prog.service'
import {PlacasService} from '../service/placas.service'
import {GlobalVars} from 'app/variables'
import {formatFechInArr,_fnroDias,fecha,arrABI,arrANBI,tipoAnio,_fecha1,_fecha2,slash_posFecha,formatFech,addDays,_addDays,editf1,fechaActual1} from 'app/funciones';


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
        private emid:number;
        private userid:number;
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
         //para seleccionar una fila de la tabla
        //private idFilaSeleccionada: number;  CLICK SOBRE REG GRILLA
        private iDReg:number;       //CLICK BOTON DE FILA ELIMINAR
        private nroBusesFilaSelect: number;
        private nroDiasFilaSelect: number;
        private titleNuevoProgPrimerModal:string;  
        private mensaje:string;     //MENSAJE CONFIRMACION MODAL 
        private mensajeEspera:string;
        private resBusUnidades:string; /* PARA EL FORMULARIO DE NUEVA PROGRAMACION */
        private modEdit:boolean; /* modEdit=1: editando registro  modEdit=0: no se esta editando registro */
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
        private _tipoProg:any[]=[];
        private _formaProg:any[]=[];

        //variables, se recupera las programaciones desde el servidor rest
        private progRest:any[]=[];
        private progRestMaestro:any[]=[]; /* NO USO */
        private progBDDetalle:any[]=[]; // para recoger resultado de la BD
        private _progBDDetalle:any[]=[]; /* NO USO */

        //COLUMNAS DEL DATATABLE PRIMENG
        private columnas:any[]=[];
        private _columnas : SelectItem[];
        private _detalle:any[]=[];
        private nroDias:any[]=[];
        private calendario:any[]=[]; /* CALENDARIO NUMERICO  QUITAR ESTO*/
        private calendarioNumeric:any[]=[]; /* CALENDARIO NUMERICO - NO EN USO */
        private calendarioString:any[]=[]; /*  CALENDARIO EN DIAS DE LA SEMANA */
        private anio:number;
    /* DISPLAY VENTANAS MODALES */
        private displayNuevaProgramacion: boolean = false;
        private displayProgramacionBase: boolean = false;
        private displayProgramacion: boolean = false;
        private displayConfirmar: boolean = false; /* CONFIRMAR ELIMINAR REG PROGRAMACION */
        private displayAvisoNoPuedeBorrarProg:boolean=false;
        private displayAceptarProgNueva : boolean = false;
        private displayIniciandoProgramacion:boolean=false;
        private displayErrorDatos : boolean = false; // PRIMERA VENTANA MODAL PROGRAMACION
        private displayErrorTablaProgramacion : boolean=false; // ERROR EN LA TABLA DE PROGRAMACION
        private displayFaltanPlacas : boolean = false;
        private displayDescargaProg : boolean = false;
        private displayEditProgC : boolean = false;
        private displayDatosPDF:boolean=false;

    ngOnInit(){
        /*console.log(fechaSgte("2017/02/07",32));*/  /* TERMINAR ESTO */
        this.ordenSorteo = [];
        this.getAllPlacasBusByEmSuEm(this.emid,0);  /* EMID + SUEMID*/
        this.getAllProgramacionByEm(this.emid,this.anio); /* EMID + AÑO */
    }
    
    constructor(private programacionService: ProgramacionService, private placasservice: PlacasService,public ClassGlobal:GlobalVars){
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
                                        this.displayConfirmar=false;
                                    },
                        err => {this.mensaje="No puede borrar esta programacion, esta siendo utilizada";
                                this.displayAvisoNoPuedeBorrarProg=true;    
                                this.displayConfirmar=false;
                                console.log(err);}
                    );
                }
        /* GETTERS -> RECUPERANDO DATOS */
            /*CONSULTA PROGRAMACION DETALLE*/
            getallprogramaciondetallebyprid(_prid:number){
                this.programacionService.getAllProgramacionDetalleByPrId(_prid).subscribe(
                    data => {
                        this.progBDDetalle = data; 
                        this.lengthProgDet=this.progBDDetalle.length;

                        if(this.lengthProgDet!=0){
                            this.mensaje="Se Genero Correctamente La Programacion";
                        }else if(this.lengthProgDet==0){
                            this.mensaje="Se encontro un error, elimine y vuelva a generarlo";
                            this.lengthProgDet=1;
                        }
                    },
                    err => {this.errorMessage=err},
                    () => this.isLoading=false
                );
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
                        data => {
                                    arrPlacas=data;
                                    this.placas = arrPlacas; 
                                    this.placasComplet=arrPlacas;
                                },
                        err  => {this.errorMessage = err},
                        () =>this.isLoading = false
                    );
            }

            /*TODAS LAS PROGRAMACIONES POR EMPRESA Y AÑO*/
            getAllProgramacionByEm( empId: number, anio: number){
                this.programacionService.getAllProgramacionByEm(empId, anio)
                    .subscribe(
                        datos => {
                            this.progRest = datos ; 
                           
                            this.mostrargrillaProgramacionMaestro(this.progRest);
                        },
                        err => {this.errorMessage = err}, 
                        () =>this.isLoading = false
                    );
                
            }


    //ABRIR 1ERA VENTANA MODAL(BOTON NUEVO)
    NuevaProgCabecera(){
        this.modEdit=false;
        this.procNuevaProgrC(); /* PROCEDURE */
        this.displayNuevaProgramacion=true; /* ABRIR VENTANA */
        this.ordenSorteo=[]; //SORTEO DE PLACAS
        this.titleNuevoProgPrimerModal = 'Nueva';
        this.extrayendoPlacasBus(); 
        this.unidadesEstado(this.placasComplet); //CALCULA EL NRO DE UNIDADES ACTIVAS Y NO ACTIVAS


        this.tipoProg="01"; //PROGRAMACION POR DEFECTO: MANUAL
        this.formaProg="01"; /* (1)MANUAL O (2)AUTOMATICO */
    }

    //1ERA VENTANA MODAL aqui recien se guarda la tabla MAESTRO en el REST 
    showProgBase(){
            let progCab:any;
            let fIni=this.progMaestro.PrFechaInicio; let fFin=this.progMaestro.PrFechaFin;
            //VALIDANDO FECHA
            if( this.validandoFechas(fIni,fFin)==1){
                    //FECHA CORRECTA
                    this.tipoProgramacion(); /* MANUAL O AUTOMATICO */
                    progCab = {
                        PrId : this.progMaestro.PrId, //number
                        EmId : this.emid, //number
                        PrCantidadBuses : this.bAct, //number
                        PrDescripcion : this.progMaestro.PrDescripcion, //string
                        PrFecha : new Date(), //string
                        PrFechaInicio : this.fecha(this.progMaestro.PrFechaInicio), //string
                        PrFechaFin : this.fecha(this.progMaestro.PrFechaFin), //string
                        PrTipo : Number(this.tipoProg), //string escala pescadito
                        PrAleatorio : Number(this.formaProg), //string manual automatico(aleatorio)
                        UsId : this.userid, //number
                        UsFechaReg : new Date() //string
                    }
                    console.log(progCab);
                    this.procSaveProgramacion(progCab);
                   
                    this.displayNuevaProgramacion=false; //cerrar 1era ventana
                    this.displayProgramacionBase=true; //abrir 2da ventana
                }else if(this.validandoFechas(fIni,fFin)==0){
                    //FECHA NO CORRECTA
            }
                
    }
    /* FUNCION -> FORMA DE SORTEO MANUAL O AUTOMATICO */
        tipoProgramacion(){
            let tprog=this.tipoProg;
            this.ordenSorteo=[];/* LIMPIANDO ARRAY DE SORTEOS */
            
            /* AUTOMATICO*/
            if(tprog=="01"){ 
                let array = ["c"];  let nro;//ARRAY NUMEROS ALEATORIOS NO REPETIDOS
                let arrayplacas= this.arrayPlacas;  let long = this.arrayPlacas.length; 
                let _arrayplacas=[];  let i=0,j=0, cen=0; // cen=0: no existe         cen=1: existe
                //ALGORITMO NROS ALEATORIOS
                while(i<long ){
                    nro = Math.floor(Math.random()*long);//NUMEROS ALEATORIOS ENTRE 0 Y LONG(7)
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
                //console.log(array);
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
    calendarioProg(f1 : string, f2 : string){
        this.calendario=this.calendarioNumb(f1,f2);
        this.calendarioString=this.calendarioChar(f1,f2,this.calendario);
        //console.log(this.calendarioString);
    }
    
    /* CALENDARIO NUMERICO */
    calendarioNumb(f1:string, f2:string){
        let _f1, _f2;  let a1, a2; let res=[]; let _res=[]; let i=0,j=0, k,l,m,n;
        let ab=[31,29,31,30,31,30,31,31,30,31,30,31], anb=[31,28,31,30,31,30,31,31,30,31,30,31];
        {
            _f1 = f1.split('-'); /* DIV EN FORMA DE ARRAY */
            _f2 = f2.split('-'); /* DIV EN FORMA DE ARRAY */
            
            _f1.push(this.bisiesto(_f1[0])); /* RECONOCIENDO BI O NOBI */
            _f2.push(this.bisiesto(_f2[0])); /* RECONOCIENDO BI O NOBI */

            //CONVIRTIENDO ELEMENTOS A NROS -- CONTIENE SU AÑO BISIESTO(0) O NO BISIESTO(1)
            while(i<_f1.length){ _f1[i]=Number(_f1[i]); i++;}   _f1[1]=_f1[1]-1;   
            while(j<_f2.length){ _f2[j]=Number(_f2[j]); j++;}   _f2[1]=_f2[1]-1;
            /*console.log(_f1); console.log(_f2);*/
        }

        /* CALENDARIO NUMERICO */
         //MESES IGUALES  -  AÑOS IGUALES - DIAS DIFERENTES _F2 > _F1
        if(_f2[1]-_f1[1]==0 && _f2[0]-_f1[0]==0){
            if(_f2[1]==1){//FEBRERO
                k=_f1[2];
                if(_f1[3]==0){  //  BISIESTO
                    while(k<=_f2[2] && k<anb[1]){
                        res.push(k);
                        k++
                    }
                }else if(_f1[3]==1){// NO BISIESTO
                    while(k<=_f2[2] && k<ab[1]){
                        res.push(k);
                        k++
                    }
                }
            }else if(_f2[1]!=1){//CUALQUIER MES
                k=_f1[2];
                while(k<=_f2[2] && k<=anb[1]){
                    res.push(k);
                    k++;
                }
            }
        }
        //

        //DIFERENCIA DE MESES  AÑOS IGUALES (1,2,3 DE DIFERENCIA)
        else if(_f2[1]-_f1[1]>0){
            k=_f1[2]; j=_f2[2];/*DIAS*/
            
            //CORREGIR ESTO, TIENE PROBLEMA CON RECONOCER SI ES AÑO BISIESTO O NO
            if(_f1[3]==0){ // BISIESTO
                while(k<=ab[_f1[1]]){ //1ER MES
                    res.push(k);
                    k++;
                }
                k=_f1[1]+1;
                while(k<_f2[1]){/*OTROS MESES */ 
                    l=1;
                    while(l<=ab[k]){
                        res.push(l);
                        l++;
                    }
                    k++;
                }
                k=1;
                while(k<=j){ //ULT MES
                    res.push(k);
                    k++;
                }
            }else if(_f1[3]==1){// NO BISIESTO
                while(k<=anb[_f1[1]]){ //1ER MES
                    res.push(k);
                    k++;
                }
                k=_f1[1]+1;
                while(k<_f2[1]){/*OTROS MESES */ 
                    l=1;
                    while(l<=anb[k]){
                        res.push(l);
                        l++;
                    }
                    k++;
                }
                k=1;
                while(k<=j){ //ULT MES
                    res.push(k);
                    k++;
                }
            }
        //

        //AÑOS DIFERENTES
        }else if(_f2[1]-_f1[1]<0){
            i=_f1[1]; j=_f2[1]; /*MESES*/ 
            k=_f1[2]; l=_f2[2] /*DIAS*/
            
            if(_f1[3]==0 && _f2[3]==1){       /* B NB */ 

                //DIAS 1ER MES-MAYOR AÑO BISIESTO
                while(k<=ab[_f1[1]]){ 
                    res.push(k);
                    k++;
                }
                /*MESES QUE ESTAN ENTRE LAS FECHAS*/
                i=_f1[1]+1;//SGTE MES AL 1ERO 
                j=_f2[1]-1;//ANT  MES AL ULT
                while(i<=11){ //AB
                    k=1;
                    while(k<ab[i]){
                        res.push(k);
                        k++;
                    }
                    i++;
                }
                while(j>=0){ //ANB
                    k=1;
                    while(k<anb[j]){
                        res.push(k);
                        k++;
                    }
                    j--;
                }
                //DIAS ULTIMO MES-MENOR AÑO NO BISIESTO
                k=1;
                while(k<=l){
                    res.push(k);
                    k++;
                }

            }else if(_f1[3]==1 && _f2[3]==0){ /* NB B */
                //DIAS 1ER MES-MAYOR AÑO NO BISIESTO
                while(k<=anb[_f1[1]]){ 
                    res.push(k);
                    k++;
                }
                /*MESES QUE ESTAN ENTRE LAS FECHAS*/
                i=_f1[1]+1;//SGTE MES AL 1ERO 
                j=_f2[1]-1;//ANT  MES AL ULT
                while(i<=11){ //ANB
                    k=1;
                    while(k<anb[i]){
                        res.push(k);
                        k++;
                    }
                    i++;
                }
                while(j>=0){ //AB
                    k=1;
                    while(k<ab[j]){
                        res.push(k);
                        k++;
                    }
                    j--;
                }
                //DIAS ULTIMO MES-MENOR AÑO BISIESTO
                k=1;
                while(k<=l){
                    res.push(k);
                    k++;
                }
            }else if(_f1[3]==1 && _f2[3]==1){ /* NB NB */
                //DIAS 1ER MES-MAYOR AÑO NO BISIESTO
                while(k<=anb[_f1[1]]){ 
                    res.push(k);
                    k++;
                }
                /*MESES QUE ESTAN ENTRE LAS FECHAS*/
                i=_f1[1]+1;//SGTE MES AL 1ERO 
                j=_f2[1]-1;//ANT  MES AL ULT
                while(i<=11){ //ANB
                    k=1;
                    while(k<anb[i]){
                        res.push(k);
                        k++;
                    }
                    i++;
                }
                
                //SI ESTA FEBRERO DENTRO DE ESTOS MESES       //SI ES FEBRERO EL ULTIMO MES
                while(j>=0){ //ANB
                    k=1;
                    while(k<anb[j]){
                        res.push(k);
                        k++;
                    }
                    j--;
                }
                //DIAS ULTIMO MES-MENOR AÑO BISIESTO 
                k=1;
                while(k<=l){
                    res.push(k);
                    k++;
                }
            }
        }
        return res;
    }
    
    /* CALENDARIO EN DIAS DE LA SEMANA */
    calendarioChar(f1:string, f2:string, arrCal=[]){
        let arr:any[]=["x"], arrf1:any[]=[], arrf2:any[]=[]; 
        let nrof1:number, nrof2:number, fresp:number , nroTotDias:number,i:number, diaSemana:string;

        arrf1=formatFechInArr(f1);  arrf2=formatFechInArr(f2);
        nrof1=_fnroDias(arrf1); nrof2=_fnroDias(arrf2); nroTotDias=nrof2-nrof1+1+1;
        for(let i=0; i<nroTotDias;i++){ arr[i]="x"; }
        /*console.log( (_addDays(f1,i)).getDay() );*/
        
        for(let i=0; i<nroTotDias;i++){
            if((_addDays(f1,i)).getDay()==1){
                arr[i]="Lu";
            }else if((_addDays(f1,i)).getDay()==2){
                arr[i]="ma";
            }else if((_addDays(f1,i)).getDay()==3){
                arr[i]="mi";
            }else if((_addDays(f1,i)).getDay()==4){
                arr[i]="ju";
            }else if((_addDays(f1,i)).getDay()==5){
                arr[i]="vi";
            }else if((_addDays(f1,i)).getDay()==6){
                arr[i]="sa";
            }else if((_addDays(f1,i)).getDay()==0){
                arr[i]="do";
            }
        }
        return arr;
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
        console.log(arrayPlacas);
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
    generarProgramacionSegundoModal(){
        //condicional para ver si esta cumpliendo con el total de placas a mandar para generar la programacion
        if(this.progMaestro.PrCantidadBuses>this.ordenSorteo.length){
            //cantidad ingresada es mayor a la cantidad de placas ingresadas (falta terminar programacion base)
            //MOSTRAR EN UNA VENTANA MODAL
            this.mensaje="Faltan Placas Por Ingresar a la Lista Del Sorteo";
            this.displayFaltanPlacas=true;
           
        //SE INGRESARON TODAS LAS PLACAS AL SORTEO
        }else if(this.progMaestro.PrCantidadBuses == this.ordenSorteo.length){
            //si las cantidades son iguales la programacion puede terminar
            this.displayProgramacionBase=false; //cerrar 2da ventana Prog Base
            this.progMaestro.PrCantidadBuses=0;
            this.progDetalle.PrDeFecha = new Date();
            
            //CARGAR EN ARRAY DE OBJETOS PARA MANDAR A LA BD
            for(let i=1; i<=this.ordenSorteo.length ; i++){
                this.programacionArrayDetalleBD.push({
                    PrId : this.progMaestro.PrId,
                    BuId : this.ordenSorteo[i-1].BuId,
                    PrDeFecha: this.progDetalle.PrDeFecha,
                    PrDeBase: this.progDetalle.PrDeBase,
                    PrDeOrden: i,
                    UsId: this.progDetalle.UsId,
                    UsFechaReg: this.progDetalle.PrDeFecha
                });  
            } 

            this.displayAceptarProgNueva= true; 
            this.mensajeEspera="Espere un momento...";

            //guardando en el rest Programacion detalle   MANDANDO A LA BD
            this.programacionService.saveProgramacionDetalle(this.programacionArrayDetalleBD,this.progMaestro.EmId,this.progMaestro.PrId,this.progMaestro.PrAleatorio)
                .subscribe( 
                    realizar => { 
                            this.getallprogramaciondetallebyprid(this.progMaestro.PrId);
                            
                        }, 
                    err => {this.errorMessage = err},
                    () =>{  this.lengthProgDet=0;
                            //this.mensaje="Se Genero Correctamente La Programacion";
                            //this.displayIniciandoProgramacion=false;
                            //this.displayAceptarProgNueva= true; 
                         }
            );
            
            this.ordenSorteo=[];

            //PROGRAMACION AUTOMATICA O MANUAL
            if(this.tipoProg == "01"){ //AUTOMATICA
                this.arrayPlacas=this._arrayPlacas;
                this._arrayPlacas = [];
            }else if(this.tipoProg == "02"){ //MANUAL
                //NO SE HACE NADA
            }

        }
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

    //deshabilitando botones
    disabledButtonForm(){
        this.disabledbutton = false;
        return this.disabledbutton;
    }
    
    //CERRAR PROG 1ER MODAL
    cancelNewProgramacion(){
         this.displayNuevaProgramacion=false;
         this.progMaestro={};
         console.log(this.progMaestro);
    }

    //CERRAR 2 MODALES (1ER Y 2DO MODAL ) cerrar ventanas new programacion (2do Modal)
    cancelarProgBaseSegundoModal(){
        this.displayProgramacionBase = false; //1era MODAL
        this.displayNuevaProgramacion=false;  //2da MODAL
        console.log(this.progMaestro.PrId);
        //BORRAR ULTIMA PROGRAMACION SEMI CREADA
        this.procEliminarProgr(this.progMaestro.PrId);
    }

    //datos para grilla HTML Maestro (consulta especialmente hecha para mostrar en el res)
    mostrargrillaProgramacionMaestro(arrProg=[]){
        this.programacionMaestroArrayHTML=[];

        //progRest es la variable q almacena las programaciones recuperadas desde el Rest de internet
        for(let programacionMaestro of arrProg){
            this.programacionMaestroArrayHTML.push({
                nro:0,
                tipo:"",
                EmConsorcio : programacionMaestro.EmConsorcio,
                PrCantidadBuses : programacionMaestro.PrCantidadBuses,
                PrFecha : programacionMaestro.PrFecha,
                PrFechaInicio : this._fecha(programacionMaestro.PrFechaInicio),
                PrFechaFin : this._fecha(programacionMaestro.PrFechaFin),
                PrAleatorio : "0"+programacionMaestro.PrAleatorio, 
                PrTipo : "0"+programacionMaestro.PrTipo,
                dias : programacionMaestro.dias,
                prDescripcion : programacionMaestro.prDescripcion,
                prId : programacionMaestro.prId
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

        /*
             this._tipoProg =[
                        {id:"01",nTipo:"automatico"},
                        {id:"02",nTipo:"manual"}
                    ];
                    this._formaProg=[
                        {id:"01", nForma:"pescadito"},
                        {id:"02", nForma:"escala"}
                    ];
        */
    }

    //CARGAR COLUMNAS Y ARRAY DE PROGRAMACION


  
    
    //extraer placas y el ID de los buses OPTIMIZAR ESTE CODIGO, MUCHAS VECES SE ESTA USANDO EN EL FUNCIONAMIENTO DEL PROGRAMA
    extrayendoPlacasBus(){
        let i =0;
        while( i<this.placas.length){
            console.log(this.placas[i].BuActivo);
            if(this.placas[i].BuActivo==true){
                this.arrayPlacas.push({
                    nroPlaca: this.placas[i].BuPlaca,
                    BuId: this.placas[i].BuId,
                    BuActivo:this.placas[i].BuActivo
                });
            }else if(this.placas[i].BuActivo==false){
                
            }
            i++;
        }
        console.log(this.arrayPlacas);
    }

    //seleccionar fila de la tabla
    onRowSelectMaestro(event){
        let fi, ff , prId;
        prId = event.data.prId; //ID DE LA FILA 
        this.nroBusesFilaSelect = event.data.PrCantidadBuses; // CANT BUSES
        this.nroDiasFilaSelect  = event.data.dias; //CANT DIAS

        fi = this.formatoCal(event.data.PrFechaInicio); ff = this.formatoCal(event.data.PrFechaFin);  

        this.calendarioProg(fi,ff); /* TANTO NUMERICO Y CARACTERES */
        this.displayProgramacion = true; this.nroDias=[]; this.progBDDetalle=[];

        //LIMPIANDO VARIABLES
        this.columnas=[]; //COLUMNAS
        this._columnas=[]; //ITEMS COLUMNAS DATATABLE

        //CONSULTA PROGRAMACION DETALLE
        this.programacionService.getAllProgramacionDetalleByPrId(prId).subscribe(
            data => {
                        this.progBDDetalle = data; 
                        /*console.log(this.progBDDetalle);*/
                        this.tablaProgramaciones();
                    },
            err => {this.errorMessage=err},
            () => this.isLoading=false
        );
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
    tablaProgramaciones(){
        //PARA COLUMNAS, CUENTA EL NUMERO DE DIAS DE LA PROGRAMACION
        //CONDICIONAL PARA CAPTURAR ERROR EN CASO DE QUE LA PROGRAMACION NO SE GENERO DE FORMA COMPLETA
        if(  (this.progBDDetalle.length > this.nroBusesFilaSelect )){
                //ALGORITMO PARA PASAR LOS ID DE BUSES DE LOS PRIMEROS 
                //1ERA MATRIZ
                let a1 :any[]=[]; let a2 :any[]=[]; let a3 :any[]=[]; 
                let i=0; let j=0; let k=0;       
                while(i<this.nroDiasFilaSelect){
                    //PARA FILAS
                    while(j<(this.nroBusesFilaSelect*this.nroDiasFilaSelect) && k<this.nroBusesFilaSelect){
                        a2.push(this.progBDDetalle[j].BuId);
                        a1[i]={field:i, header:i}; //COLUMNAS                                   
                        j++; k++;
                    }
                    a3[i]=a2; k=0; i++; a2=[];
                }

                //2DA MATRIZ (TRANSPUESTA DE LA 1ERA)
                let a4: any[]=[]; let a5: any[]=[];
                let l=0; let m=0; let n=0; let aux=0;

                //TRANSPUESTA 
                //INICIANDO MATRIZ
                while(l<this.nroBusesFilaSelect){
                    while(m<this.nroDiasFilaSelect){
                        a4.push(0); 
                        m++;
                    }
                    a5[l]=a4; m=0; l++; a4=[];
                }

                l=0; m=0;
                //MOVIENDO 
                while(l<this.nroBusesFilaSelect){
                    while(m<this.nroDiasFilaSelect){
                    //console.log(a3[m][l]);
                        a5[l][m]=a3[m][l];
                        //console.log(a5[l][m]);
                        m++; 
                    }
                    l++; m=0;
                }

                //CAPTURANDO LAS PLACAS POR BUID
                this.getAllPlacasBusByEmSuEm(this.emid, 0);

                //VERIFICANDO SI EL ARRAY DE PLACAS YA ESTA CARGADO O NO
                
                if(this.arrayPlacas.length==0){  
                    this.extrayendoPlacasBus(); //EXTRAER PLACAS PARA LA PROGRAMACION
                    
                }else if(this.arrayPlacas.length>0){console.log("ya se extrayeron las placas");}

                //ACTUALIZANDO EL ARRAY a5, cambiando BUID por su respectiva PLACA---BUSQUEDA
                i=0; let cen=0; j=0; k=0; //0: EXISTE  1:NO EXISTE
                while(i<a5.length){//SOBRE EL ARRAY RAIZ
                    while(j<a5[i].length){ //SOBRE LOS ARRAY INTERIOR 
                        //UBICAR EL POR IGUAL BUID
                        while(k<this.arrayPlacas.length  && cen==0){
                            if(a5[i][j]!=this.arrayPlacas[k].BuId){
                                
                                k++; 
                            }else if(a5[i][j]==this.arrayPlacas[k].BuId){
                                
                                cen=1;
                            }
                        }
                        //SI SE EENCONTRO
                        if(cen==1){
                            //console.log("pasando");
                            a5[i][j]=this.arrayPlacas[k].nroPlaca;
                            k=0;
                            j++;
                            cen=0;
                        }else if(cen==0){
                            //console.log("no existe");
                        }
                        
                    }
                    j=0;
                    i++;
                }//FIN WHILE BUSQUEDA



                this._detalle = a5;
                //console.log(this._detalle);
                //CALCULANDO EL NRO DE COLUMNAS (NRODIAS PROGRAMACION)
                for(l=1; l<=this.nroDiasFilaSelect; l++){ this.nroDias.push(l);} 

                /* INSERTANDO EL NRO DE DE FILA EN LA TABLA */
                for(i=0; i<this._detalle.length;i++){
                    (this._detalle[i]).splice(0,0,(i+1).toString());
                }
                
                this.calendario.unshift(" ");
                this.calendarioString.unshift(" ");
                //console.log(this._detalle);

                this.nroDias=this.calendario; /* PASANDO CALENDARIO */
                this.nroColumn=this.nroDias.length-1; //PARA ELEGIR TAMAÑO DE TABLA 2000PX O 500PX
               
        }else{
                //MOSTRAR MENSAJE AL MOMENTO DE CAPTURAR EL ERROR
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

    /* GUARDAR EDITAR REGISTRO PROGRAMACION */
    guardarProgramacionC(){
        let obj:any;
        /* CARGANDO OBJETO */
        obj = {
            EmId:this._progrMaestro.EmId,
            PrAleatorio:this._progrMaestro.PrAleatorio,
            PrCantidadBuses:this._progrMaestro.PrCantidadBuses,
            PrDescripcion:this.progDescripcion,
            PrFecha:new Date(this._progrMaestro.PrFecha),
            PrFechaFin:new Date(this._progrMaestro.PrFechaFin),
            PrFechaInicio:new Date(this._progrMaestro.PrFechaInicio),
            PrId:Number(this._progrMaestro.PrId),
            PrTipo:this._progrMaestro.PrTipo,
            UsFechaReg:new Date(),
            UsId:this._progrMaestro.UsId
        }
        this.displayEditProgC=false;
        console.log(obj);
        this.programacionService.saveProgramacion(obj)
            .subscribe( 
                data => {this.progMaestro=data;  //RECUPERANDO OBJETO PARA SACAR EL PRID
                         console.log(this.progMaestro.PrId);
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
        this.displayConfirmar = true
        this.iDReg = _PrId;
    }

    //PROCEDIMIENTO ALMACENADO PARA ELIMINAR
    borrarRegistro(){
         this.programacionService.deleteProgramacionByid(this.iDReg).subscribe(
            realizar => {
                            this.getAllProgramacionByEm(this.emid,this.anio); 
                            this.iDReg=0;
                            this.displayConfirmar=false;
                        },
            err => {this.mensaje="No puede borrar esta programacion, esta siendo utilizada";
                    this.displayAvisoNoPuedeBorrarProg=true;    
                    this.displayConfirmar=false;
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
        this.descargarProgramacion(this.nomArchivoPDF, this.titArchivoPDF);
        this.displayDatosPDF=false;
    }
    
    //DESCARGAR LA PROGRAMACION EN FORMATO PDF 
    descargarProgramacion(nombreArchivo:string, tituloArchivo:string){
        //ESTA FUNCION es ASI:  se divide el los array en array de filas para pasarlo a las
        //                      hojas en un total de nro de filas

        //VARIABLES 
            //HOJAS
                var doc = new jsPDF('l','pt','a4');

                let arr0=[], i:number =0,j=0,k=0 , arr1=[], nrosalto:number = 0, arrprog=[];
                let ncol:number, r, dividendo=this.nroDiasFilaSelect, c=1;
            
            //CALENDARIO
                let arrCalendario:any[]=[], __arrCalendario:any[]=[];
                let arrCalendarioString:any[]=[], __arrCalendarioString:any[]=[];

                //NUMERICO
                __arrCalendario=this.calendario.slice(0); __arrCalendario.splice(0,1);
                //STRING
                __arrCalendarioString=this.calendarioString.slice(0); __arrCalendarioString.splice(0,1);
                
                

            //NUMERO DE ARRAYS(FILAS) DE TODA LA TABLA
                while(i<this.nroBusesFilaSelect){ arr0[i]=arr1; i++;} 
                arr1=[[],[],[],[],[],[],[]]; //NRO DE HOJAS EN TOTAL Q SE PUEDE DIVIDIR EL CALENDARIO

        //ALGORITMOS

            /* ARRAY DE PROG (SOLO PLACAS) */
                //CAMBIANDO ARRAY DE PLACAS
                arrprog=this.placasProgramacion(this.progBDDetalle,this.arrayPlacas);
                //console.log(this.progBDDetalle);
                //REINICIANDO VARIABLES
                i=0; let arrAux=[],arrborrar2=[];

            /* ARRAY DE ARRAYCOLUMNAS - PREPARANDO PROGRAMACION*/
                while(i<this.nroBusesFilaSelect){
                    while(j<this.nroDiasFilaSelect && i+nrosalto<arrprog.length){
                        arr0[i][j]=arrprog[i+nrosalto];
                        nrosalto=nrosalto+this.nroBusesFilaSelect;
                        j++;
                    }
                    arrAux.push(arr0[i].slice(0));
                    i++;  nrosalto=0;  j=0;
                }
                
                
            /* ARRAY CON ARRAY DE COLUMNAS */
                arr0=arrAux;
    
            /* AJUSTANDO EL NRO DE COLUMNAS A LA HOJA = 15 X HOJA*/
                //REINICIANDO VARAIBLES A CERO
                    i=j=0;
                //NUMERO DE COLUMNAS MAXIMO EN CADA HOJA
                    ncol = 15; 
                //1ER RESIDUO, SABER SI EL TOTAL DE COLUMNAS ES MENOR O IGUAL QUE EL MAXIMO DE COLUMNAS PERMITIDO 
                    r = dividendo - ncol;
                //DIVIDIENDO AL ARRAYS EN ARRAY DE MATRICES(CADA MATRIZ ES UNA HOJA)
                
        /* HAY 2 A MAS HOJAS */
        if(r>=0){
            //RESIDUO MAYOR AL NRO MAX DE COLUMNAS DE LA HOJA
            //r: RESIDUO TOTAL(ULTIMA HOJA) ,  C: COCIENTE(NRO DE HOJAS)
                while( r > ncol ){  
                    dividendo = r; r = dividendo - ncol;  
                    dividendo = r;  c++; 
                }

            //DIVIDIENDO EN ARRAYS (ARRAY DE CALENDARIO)    c:nro de veces en q debe dividirse en otros arrays
            //HOJAS DEL ARCHIVO
                //VARIABLES
                let calendarionumber:any[]=[];
                calendarionumber=this.calendario.slice(0);   calendarionumber.shift();
            
                //DIVIDIENDO EL CALENDARIO
                while(i<c){ 
                    while( k<ncol && j<15*(i+1)){ 
                        arr1[i][k]=calendarionumber[j];  
                        j++; 
                        k++; 
                    } 
                    k=0; 
                    i++; 
                }

            //TOMANDO EL RESIDUO DE DIVIDIR LA TABLA 
            //CALENDARIO
                dividendo=this.nroDiasFilaSelect; //NRO DIAS
                i=ncol*c;  //
                j=0;

            //DIVIDENDO = NRO DE COLUMNAS TOTAL -- DIVIDIENDO EL CALENDARIO NUMERICO
                while(i<dividendo){ 
                    arr1[c][j]=calendarionumber[i]; 
                    i++; 
                    j++; 
                }
            /* arr0: MATRIZ DE PLACAS(PROGRAMACION)  arr1: MATRIZ CALENDARIO NUMERICO */
                arr0=this.hojasProgracion(arr0,ncol,__arrCalendarioString ,c);
            //GENERANDO EL ARCHIVO PDF
                i=j=0;
                //INICIANDO LAS HOJAS DEL PDF
                    while(arr1[i].length != 0 && j<(c)){ 
                        doc.setFontSize(10)
                        doc.text(40, 40, tituloArchivo+' RUTA 13');
                        doc.autoTable(arr1[i],arr0[i],{ 
                            styles: {fontSize: 7,halign: 'center',cellPadding: 1,},   
                            margin: {top: 60, right: 10, bottom: 10, left: 10},
                            theme: 'grid',
                            columnWidth: 'auto',
                            valign: 'top',
                        });
                        doc.addPage();
                        i++;
                        j++;
                    }           

                /* PDF ULTIMA HOJA  -> INTEGRAR EL RESTO DE LAS COLUMNAS QUE FALTAN, USAR EL RESIDUO DE LA DIVISION */
                    doc.text(40, 40, tituloArchivo+' RUTA 13');
                    doc.autoTable(arr1[c], arr0[i],{ 
                            styles: { fontSize: 7, halign: 'center', cellPadding: 1,columnWidth: 60 },   
                            margin: {top: 60, right: 10, bottom: 10, left: 10},
                            theme: 'striped',
                            columnWidth: 70,
                            valign: 'top',
                    });
    

        /*UNA SOLA HOJA (RESIDUO ES MENOR A CERO)*/
        }else if(r<0){
            arr0.unshift(__arrCalendarioString);
            //CREANDO TABLA Y TITULO
            doc.autoTable(__arrCalendario, arr0,{ 
                styles: { fontSize: 7, halign: 'center', cellPadding: 1, columnWidth: 60 },   
                margin: {top: 30, right: 10, bottom: 10, left: 10},
                theme: 'striped',
                columnWidth: 70,
                valign: 'top',
            });
            
        }

        /* GUARDANDO ARCHIVO CON NOMBRE */
            console.log(nombreArchivo);
            console.log(tituloArchivo);
            doc.save(nombreArchivo+''+'.pdf');
            this.mensaje="Se Descargo La Programacion";
            this.displayProgramacion=false;
            this.displayDescargaProg=true;
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
            //console.log(_arrcalstr); console.log(arrmatprog);

            
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