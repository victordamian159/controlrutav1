import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {ProgramacionService} from '../service/prog.service'
import {PlacasService} from '../service/placas.service'

@Component({
    selector: 'app-prog',
    templateUrl	: '../views/prog.component.html',
    styleUrls: ['../styles/prog.component.css']
})

export class ProgComponent implements OnInit{
    
    //capturando fecha actual 
    date:any;
    anio:string;
    mes:string;
    dia:string;
    
    //borrar:any;

    //para seleccionar una fila de la tabla
    idFilaSeleccionada: number; // CLICK SOBRE REG GRILLA
    iDReg:number;       //CLICK BOTON DE FILA ELIMINAR
    nroBusesFilaSelect: number;
    nroDiasFilaSelect: number;
    titleNuevoProgPrimerModal:string;  
    mensaje:string;     //MENSAJE CONFIRMACION MODAL 

    //formaProgramacion:string = 'Escala'; //almacena el string del item seleccionado
    //tipoProgramacion: string='Manual'; //tipo manual o automatico

    displayNuevaProgramacion: boolean = false;
    displayProgramacionBase: boolean = false;
    displayProgramacion: boolean = false;
    displayConfirmar: boolean = false;
    displayAceptarProgNueva : boolean = false;
    displayErrorDatos : boolean = false; // PRIMERA VENTANA MODAL PROGRAMACION
    displayErrorTablaProgramacion : boolean=false; // ERROR EN LA TABLA DE PROGRAMACION

    selectedPlacas: string[] = [];
    disabledbutton: boolean = false;
    private errorMessage:string='';  //mensaje error del rest
    private isLoading: boolean = false;  
    placas:any[]=[]; //se utiliza para almacenar lo q devuelve el rest de las placas
    
    //datos para la picklist (prog base)
    arrayPlacas:any[] = []; //ESTATICO
    _arrayPlacas:any[] = []; //DINAMICO
    ordenSorteo:any[] = []; 

    //grilla
    programacionMaestroArrayMemoria :any[]=[]; //array para la grilla HTML
    programacionMaestroArrayHTML :any[] = [];  //array para la grilla HTML

    //objeto maestro (solo para la memoria)
    progMaestro: any={
        PrId:0,     //oculto
        EmId:1,     //oculto
        PrCantidadBuses:0,
        PrDescripcion:"",
        PrFecha:'0-0-0',     //oculto
        PrFechaInicio:'0-0-0',
        PrFechaFin:'0-0-0',
        PrTipo:"",      
        PrAleatorio:true,
        UsId:0,        //oculto
        UsFechaReg:'0-0-0'   //oculto
    }
    
    //objeto maestro para Mandar al rest
    objProgVentanaUno : any; // objeto para almacenar datos 1era ventana modal para mandarlo o borrar del sistema al cancelar o guardar
    progMaestroArray:any[]= [];

    //objeto detalle para mandar al rest
    objProgVentanaDos : any; //nuevo detalle 
    progDetalleArray:any[]=[];

    //variables, se recupera las programaciones desde el servidor rest
    progRest:any[]=[];
    progRestMaestro:any[]=[];

    progBDDetalle:any[]=[]; // para recoger resultado de la BD
    _progBDDetalle:any[]=[]; //NO SE ESTA USANDO

    //COLUMNAS DEL DATATABLE PRIMENG
    columnas:any[]=[];
    _columnas : SelectItem[];

    _detalle:any[]=[];
    nroDias:any[]=[];
    nroColumn:number;
    bAct:number; //NRO BUSES ACTIVOS
    bNAct:number; //NRO DE BUSES NO ACTIVOS
    tipoProg:number;    //MANUAL O AUTOMATICA
    _tipoProg =[
        {id:1,nTipo:"automatico"},
        {id:0,nTipo:"manual"}
    ];
    formaProg:number;   //ESCALA O PESCADITO
    _formaProg=[
        {id:1, nForma:"pescadito"},
        {id:0, nForma:"escala"}
    ];

//OBJETO DETALLE
    progDetalle: any={
        PrId:23,     //oculto
        BuId:0,     //oculto
        PrDeFecha:"", //oculto
        PrDeBase:true, //oculto (true)
        PrDeOrden:0, //placas sorteo manual
        UsId:0,     //oculto
        UsFechaReg:"",//oculto
    }
    programacionArrayDetalleBD:any[]=[]; //array objetos detalle para mandar al rest

    constructor(
            private programacionService: ProgramacionService,
            private placasservice: PlacasService,
    ){}

    ngOnInit(){
        this.ordenSorteo = [];
        this.getAllPlacasBusByEmSuEm(1,0);
        this.getAllProgramacionByEm(1,0);
    }
 
    tipoProgramacion($event){
        this.ordenSorteo=[];
        if(this.tipoProg==1){ // AUTOMATICO
            let array = ["c"];  let nro;//ARRAY NUMEROS ALEATORIOS NO REPETIDOS
            let arrayplacas= this.arrayPlacas;  let long = this.arrayPlacas.length; console.log("automatico");
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
                //console.log(i);
            }
            console.log(array);
            //APLICANDO ALGORITMO, BUSCANDO INDICES CON ARRAY DE PLACAS
            i=0; nro=0;
            while(i<array.length){
                _arrayplacas.push(arrayplacas[array[i]]);
                i++;
            }
 
            this.ordenSorteo=_arrayplacas; 
            //console.log(this.arrayPlacas); 
            //console.log(this.ordenSorteo);
        }else if(this.tipoProg==0){
            console.log("manual");
        }
        
    }


    formaProgramacion($event){
        console.log(this.formaProg);
    }

    nuevaProgramacionMaestroRest(){
        this.programacionService.newProgramacion()
            .subscribe(data => {this.objProgVentanaUno = data});
    }
    
    nuevaProgramacionDetalleRest(){
        this.programacionService.newProgramacionDetalle()
            .subscribe(data => {this.objProgVentanaDos = data});
    }
    
    //CONSULTA PROGRAMACION DETALLE -->     NO SE ESTA USANDO
    getallprogramaciondetallebyprid(_prid:number){
        this.programacionService.getAllProgramacionDetalleByPrId(_prid).subscribe(
            data => {
                this.progBDDetalle = data; 
                console.log(this.progBDDetalle);
            },
            err => {this.errorMessage=err},
            () => this.isLoading=false
        );
    }

    //ABRIR 1ERA VENTANA MODAL(BOTON NUEVO)
    NuevaProgCabecera(){
        this.nuevaProgramacionMaestroRest();
        this.displayNuevaProgramacion=true;
        this.ordenSorteo=[]; //SORTEO DE PLACAS
        this.titleNuevoProgPrimerModal = 'Nueva';
        
        //VERIFICANDO SI EL ARRAY DE PLACAS YA ESTA CARGADO O NO
        if(this.bAct==undefined){  
            this.extrayendoPlacasBus(); //EXTRAER PLACAS PARA LA PROGRAMACION
        }else if(this.bAct !=undefined || this.bAct>0){ }
        this.unidadesEstado(); //CALCULA EL NRO DE UNIDADES ACTIVAS Y NO ACTIVAS

        //PONER EN CERO VALORES DE OBJETOS 
        this.progMaestro = {
            PrId:0,     //oculto
            EmId:1,     //oculto
            PrCantidadBuses:0,
            PrDescripcion:"",
            PrFecha:'0-0-0',     //oculto
            PrFechaInicio:'0-0-0',
            PrFechaFin:'0-0-0',
            PrTipo:"",      
            PrAleatorio:true,
            UsId:0,        //oculto
            UsFechaReg:'0-0-0'   //oculto
        
        }
        this.tipoProg=null; //PROGRAMACION POR DEFECTO: MANUAL
        this.formaProg=null;
    }

    //1ERA VENTANA MODAL aqui recien se guarda la tabla MAESTRO en el REST 
    showProgBase(){
        let i = 0, cen = 0;
        let error = [
            {id:1, nom: 'Tipo de Programacion', val: 0 },
            {id:2, nom: 'Forma de Programacion', val: 0 },
            {id:3, nom: 'Fecha de Programacion', val: 0 },
            {id:4, nom: 'Identificador de Programacion', val: 0 }
        ]

        //PROGRAMACION AUTOMATICA O MANUAL
        if(this.tipoProg == 1){ //AUTOMATICA
            this._arrayPlacas=this.arrayPlacas;
            this.arrayPlacas = [];
        }else if(this.tipoProg == 0){ //MANUAL
            //NO SE HACE NADA
        }

         //capturando fecha actual
        {
            /*
                this.date = new Date();
                this.dia = this.date.getDate();
                this.mes = this.date.getMonth();
                this.anio = this.date.getFullYear();
                this.progMaestro.PrFecha = this.anio+"-"+this.mes+"-"+this.dia;
            */  
            this.progMaestro.PrFecha = new Date();
        }

        //TIPO PROGRAMACION MANUAL O AUTOMATICO .  CORREGIR PROGRAMACION TRUE O FALSE
        if(this.tipoProg == 0){
            this.progMaestro.PrAleatorio = false; error[0].val = 1; //MANUAL
            }else if(this.tipoProg == 1){
            this.progMaestro.PrAleatorio = false;  error[0].val = 1; //AUTOMATICO
        }
        
        //FORMA PROGRAMACION ESCALA O PESCADITO
        if(this.formaProg == 0){
            this.progMaestro.PrTipo="01"; error[1].val = 1;
            }else if(this.formaProg == 1){
            this.progMaestro.PrTipo="02"; error[1].val = 1;
        }

        //VALIDANDO FECHA
        if( this.validandoFechas(this.progMaestro.PrFechaInicio, this.progMaestro.PrFechaFin ) == 1 ){
                error[2].val = 1;   //FECHA CORRECTA
            }else if(this.validandoFechas(this.progMaestro.PrFechaInicio, this.progMaestro.PrFechaFin ) == 0){
                error[2].val = 0;   //FECHA NO CORRECTA
        }
         
        //VALIDANDO IDENTIFICADOR DE PROGRAMACION
        if(this.progMaestro.PrDescripcion != ''){
                error[3].val = 1;
            }else if(this.progMaestro.PrDescripcion == ''){
                error[3].val = 0;
        }

        //RECORRIENDO ARRAY ERRORES OBJETOS PARA COMPROBAR NO HAY PROBLEMAS, POR LO MENOS UNO
        while(i < error.length  && cen == 0){
            if(error[i].val == 0){
                cen = 1;
            }
            i++;
        }

        //MENSAJE A PANTALLA SI HAY O NO ERROR
        if(cen == 0 ){
               //cargando lo ingresado en una variable //PrFecha y UsFechaReg, ¿Cual es la diferencia?
                this.objProgVentanaUno = {
                    PrId : this.progMaestro.PrId, //number
                    EmId : this.progMaestro.EmId, //number
                    PrCantidadBuses : this.bAct, //number
                    PrDescripcion : this.progMaestro.PrDescripcion, //string
                    PrFecha : this.progMaestro.PrFecha, //string

                    PrFechaInicio : this.fecha(this.progMaestro.PrFechaInicio), //string
                    PrFechaFin : this.fecha(this.progMaestro.PrFechaFin), //string
                    
                    PrTipo : this.progMaestro.PrTipo, //string escala pescadito
                    PrAleatorio : this.progMaestro.PrAleatorio, //string manual automatico(aleatorio)
                    UsId : this.progMaestro.UsId, //number
                    UsFechaReg : this.progMaestro.PrFecha //string
                }

                //guardando en array para poder mostrarlo en la grilla
                this.programacionMaestroArrayMemoria.push({
                    PrId : this.progMaestro.PrId,
                    EmId : this.progMaestro.EmId,
                    PrCantidadBuses : this.progMaestro.PrCantidadBuses,
                    PrDescripcion : this.progMaestro.PrDescripcion,
                    PrFecha : this.progMaestro.PrFecha,

                    PrFechaInicio : this.fecha(this.progMaestro.PrFechaInicio),
                    PrFechaFin : this.fecha(this.progMaestro.PrFechaFin),
                    
                    PrTipo : this.progMaestro.PrTipo,
                    PrAleatorio : this.progMaestro.PrAleatorio,
                    UsId : this.progMaestro.UsId,
                    UsFechaReg : this.progMaestro.PrFecha
                });

                //guardando en el rest Programacion Maestro (pasarlo  a la 2da VEntana modal)
                this.programacionService.saveProgramacion(this.objProgVentanaUno)
                    .subscribe( 
                        data => {this.progMaestro=data; 
                            this.mostrargrillaProgramacionMaestro() ;
                            this.getAllProgramacionByEm(1,0);

                        }, 
                        err => {this.errorMessage = err}
                );

                this.displayNuevaProgramacion=false; //cerrar 1era ventana
                this.displayProgramacionBase=true; //abrir 2da ventana

        }else if(cen == 1){
            //MANDAR MENSAJE A LA PANTALLA, ERROR DE LOS OBJETOS
            this.mensaje="Se Encontro Errores En Los Datos Ingresados";
            this.displayErrorDatos = true;
            //console.log("Se Encontro Errores En Los Datos");
        }
        
    }

    //CERRAR MENSAJE DE SE ENCONTRO ERROR EN LOS DATOS INGRESADOS
    errorDatos(){
        this.mensaje="";
        this.displayErrorDatos=false;
    }

    //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD 
    fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1]) -1 ,  Number(resultado[2]) , 12, 0,0 );
        return _thoy;
    }

    //VALIDANDO FECHAS
    validandoFechas(f1:string, f2 :string) : number{
        let val1: number,val2: number,val : number,  _f1, _f2,i:number,j:number;
        _f1 = f1.split('-'); _f2 = f2.split('-');

        for(i=0; i<_f1; i++){ _f1[i] = this.quitandoCerosIzq(_f1[i]);}
        for(i=0; i<_f2; i++){ _f2[i] = this.quitandoCerosIzq(_f2[i]);}

        _f1 = _f1.toString(); _f2 = _f2.toString();

        val1 = this.fnroDias(_f1);
        val2 = this.fnroDias(_f2);

        console.log(val1 + "  "+val2);
        let ndias = val2 - val1 + 1;

        if(ndias>9  &&  ndias<=62){
            val = 1 ; //LAS FECHAS SON CORRECTAS
        }else if(ndias <= 0 || ndias>62 ){
            val = 0 ; //LAS FECHAS NO SON CORRECTAS
        }

        return val;
    }

    //NUMERO DE DIAS DESDE 1970, PARA TENER COMO REFERENCIA AL MOMENTO DE RESTAR Y SACAR EL NRO DE DIAS EXISTENTE
    fnroDias(f : string) : number{
        let n: number; let minute = 1000 * 60; let hour = minute * 60; let day = hour * 24; let date = new Date(f);
        var time = date.getTime();
        n = Math.round(time/day);
        return n;
    }

    //ARRAY DIAS PROGRAMACION
    calendarioProg(){

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
    unidadesEstado(){
        let i=0; let bAct=0; let bNAct=0;
        
        while(i<this.arrayPlacas.length){
            if(this.arrayPlacas[i].BuActivo==true){
                bAct++;
            }else if(this.arrayPlacas[i].BuActivo==false){
                bNAct++;
            }
            i++;
        }
        
        this.bAct = bAct;
        this.bNAct= bNAct;
    }


    //2DA VENTANA MODAL(boton continuar)
    //BOTON GENERAR PROGRAMACION (generar la programacion completa y confirma la tabla MAESTRO)
    generarProgramacionSegundoModal(){
        //condicional para ver si esta cumpliendo con el total de placas a mandar para generar la programacion
        if(this.progMaestro.PrCantidadBuses>this.ordenSorteo.length){
            //cantidad ingresada es mayor a la cantidad de placas ingresadas (falta terminar programacion base)
            //MOSTRAR EN UNA VENTANA MODAL
            console.log("falta placas por ingresar :c");

        }else if(this.progMaestro.PrCantidadBuses == this.ordenSorteo.length){
            //si las cantidades son iguales la programacion puede terminar
            //console.log("programacion terminada  c: ");
            this.displayProgramacionBase=false; //cerrar 2da ventana Prog Base
            this.progMaestro.PrCantidadBuses=0;

            //FECHA ACTUAL
            {
                /*this.date = new Date();
                this.dia = this.date.getDate();
                this.mes = this.date.getMonth();
                this.anio = this.date.getFullYear();
                this.progDetalle.PrDeFecha = this.anio+"-"+this.mes+"-"+this.dia;*/
                this.progDetalle.PrDeFecha = new Date();
            }

            
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

            //guardando en el rest Programacion detalle   MANDANDO A LA BD
            this.programacionService.saveProgramacionDetalle(this.programacionArrayDetalleBD,this.progMaestro.EmId,this.progMaestro.PrId,this.progMaestro.PrAleatorio)
                .subscribe( 
                    realizar => {
                            //PONER UNA VENTANA MODAL CON EL MENSAJE 
                            this.mensaje="Se Genero Correctamente La Programacion";
                            this.displayAceptarProgNueva=true; 
                        }, 
                    err => {this.errorMessage = err}
            );
            //console.log("se agrego programacion detalle --> SE GENERO LA PROGRAMACION =D");
            this.ordenSorteo=[];

            //PROGRAMACION AUTOMATICA O MANUAL
            if(this.tipoProg == 1){ //AUTOMATICA
                this.arrayPlacas=this._arrayPlacas;
                this._arrayPlacas = [];
                console.log(this.arrayPlacas);
                console.log(this._arrayPlacas);
                console.log(this.ordenSorteo);
            }else if(this.tipoProg == 0){ //MANUAL
                //NO SE HACE NADA
                console.log(this.arrayPlacas);
                console.log(this.ordenSorteo);
            }

        }//final condicional IF
    }//final funcion generarProgramacionSegundoModal
    
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
    }

    //CERRAR 2 MODALES (1ER Y 2DO MODAL ) cerrar ventanas new programacion (2do Modal)
    cancelarProgBaseSegundoModal(){
        this.displayProgramacionBase = false; //1era MODAL
        this.displayNuevaProgramacion=false;  //2da MODAL
        //BORRAR LOS DATOS INGRESADOS 

        //ELIMINAR LA PROGRAMACION (CABECERA) QUE NO TIENE PROGDETALLE, CONSULTAR A this.getAllProgramacionByEm(1,0)
        console.log(this.progRest[this.progRest.length-1].prId);
        //this.eliminarMaestro(this.progRest[this.progRest.length-1].prId)

        this.programacionService.deleteProgramacionByid(this.progRest[this.progRest.length-1].prId).subscribe(
            realizar => {this.getAllProgramacionByEm(1,0)},
            err => {console.log(err);}
        );
        
    }

    //datos para grilla HTML Maestro (consulta especialmente hecha para mostrar en el res)
    mostrargrillaProgramacionMaestro(){
        //this.extrayendoDatosTablaMaestroRest(); //extraer los campos de la nueva consulta para la grilla
        this.programacionMaestroArrayHTML=[];
        //progRest es la variable q almacena las programaciones recuperadas desde el Rest de internet
        for(let programacionMaestro of this.progRest){
            this.programacionMaestroArrayHTML.push({
                nro:0,
                tipo:"",
                EmConsorcio : programacionMaestro.EmConsorcio,
                PrAleatorio : programacionMaestro.PrAleatorio, 
                PrCantidadBuses : programacionMaestro.PrCantidadBuses,
                PrFecha : programacionMaestro.PrFecha,
                PrFechaInicio : this._fecha(programacionMaestro.PrFechaInicio),
                PrFechaFin : this._fecha(programacionMaestro.PrFechaFin),
                PrTipo : programacionMaestro.PrTipo,
                dias : programacionMaestro.dias,
                prDescripcion : programacionMaestro.prDescripcion,
                prId : programacionMaestro.prId
            });
        }// fin funcion for

        //ENUMERAR REGISTRO
        for(let i=0; i<this.programacionMaestroArrayHTML.length; i++){
            this.programacionMaestroArrayHTML[i].nro=i+1;
        }

        //MANUAL O AUTOMATICO PROGRAMACION
        //console.log("long: "+this.programacionMaestroArrayHTML.length);
        for(let i=0; i<this.programacionMaestroArrayHTML.length; i++){

            if(this.programacionMaestroArrayHTML[i].PrTipo=='01'){
                this.programacionMaestroArrayHTML[i].tipo="Manual";

            }else if(this.programacionMaestroArrayHTML[i].PrTipo=='02'){
                this.programacionMaestroArrayHTML[i].tipo="Automatico";
            }

        }
        //console.log(this.programacionMaestroArrayHTML);
    }//FIN FUNCION MOSTRAR GRILLA CABECERA

    //CARGAR COLUMNAS Y ARRAY DE PROGRAMACION


    //CONSULTA RECUPERAR BUSES POR empId(id de empresa)  suemId(subempresa id)
    getAllPlacasBusByEmSuEm(empId: number, suemId : number){
        this.placasservice.getAllPlacasBusByEmSuEm(empId, suemId)
            .subscribe(
                data => {this.placas = data},
                err  => {this.errorMessage = err},
                () =>this.isLoading = false
            );
            //console.log(this.placas);
    }

    //todas las programaciones por empresa y año
    getAllProgramacionByEm( empId: number, anio: number){
        this.programacionService.getAllProgramacionByEm(empId, anio)
            .subscribe(
                datos => {
                    this.progRest = datos ; 
                    //console.log(this.progRest);
                    this.mostrargrillaProgramacionMaestro();
                },
                err => {this.errorMessage = err}, 
                () =>this.isLoading = false
            );
        //console.log(this.progRest)
    }
    
    //extraer placas y el ID de los buses
    extrayendoPlacasBus(){
        for(let i =0; i<this.placas.length ; i++){
            this.arrayPlacas.push({
                nroPlaca: this.placas[i].BuPlaca,
                BuId: this.placas[i].BuId,
                BuActivo:this.placas[i].BuActivo
            });
        }
    }

    //seleccionar fila de la tabla
    onRowSelectMaestro(event){
        this.idFilaSeleccionada = event.data.prId; //ID DE LA FILA 
        this.nroBusesFilaSelect = event.data.PrCantidadBuses; // CANT BUSES
        this.nroDiasFilaSelect  = event.data.dias; //CANT DIAS
        this.displayProgramacion = true;
        this.nroDias=[];

        //LIMPIANDO VARIABLES
        this.columnas=[]; //COLUMNAS
        this._columnas=[]; //ITEMS COLUMNAS DATATABLE

        //CONSULTA PROGRAMACION DETALLE
        this.programacionService.getAllProgramacionDetalleByPrId(this.idFilaSeleccionada).subscribe(
            data => {
                        this.progBDDetalle = data; 
                        console.log(this.progBDDetalle);
                        this.tablaProgramaciones();
                    },
            err => {this.errorMessage=err},
            () => this.isLoading=false
        );
    }

    //TABLA PROGRAMACIONES, VERIFICA SI LA PROGRAMACION ESTA COMPLETA
    tablaProgramaciones(){
        //PARA COLUMNAS, CUENTA EL NUMERO DE DIAS DE LA PROGRAMACION
        //console.log(this.progBDDetalle);
        //CONDICIONAL PARA CAPTURAR ERROR EN CASO DE QUE LA PROGRAMACION NO SE GENERO DE FORMA COMPLETA
        console.log("LongPD:  "+this.progBDDetalle.length +"----"+ "NroFila:  "+this.nroBusesFilaSelect);
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
                this.getAllPlacasBusByEmSuEm(1, 0);
                this.extrayendoPlacasBus();
                //console.log(this.arrayPlacas);

                //ACTUALIZANDO EL ARRAY a5, cambiando BUID por su respectiva PLACA---BUSQUEDA
                i=0; let cen=0; j=0; k=0; //0: EXISTE  1:NO EXISTE
                while(i<a5.length){//SOBRE EL ARRAY RAIZ
                    while(j<a5[i].length){ //SOBRE LOS ARRAY INTERIOR 
                        //UBICAR EL POR IGUAL BUID
                        while(k<this.arrayPlacas.length  && cen==0){
                            if(a5[i][j]!=this.arrayPlacas[k].BuId){
                                //console.log(a5[i][j]+" no iguales =c: "+this.arrayPlacas[k].BuId);
                                k++; 
                            }else if(a5[i][j]==this.arrayPlacas[k].BuId){
                                //console.log(a5[i][j]+" son iguales =D: "+this.arrayPlacas[k].BuId);
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
                //CALCULANDO EL NRO DE COLUMNAS (NRODIAS PROGRAMACION)
                
                for(l=1; l<=this.nroDiasFilaSelect; l++){
                    this.nroDias.push(l);
                } 

                //PARA ELEGIR TAMAÑO DE TABLA 2000PX O 500PX
                this.nroColumn=this.nroDias.length;
                console.log("nroColumn: "+this.nroColumn);   console.log(this._detalle);   console.log(this.nroDias);
        }else{
                //MOSTRAR MENSAJE AL MOMENTO DE CAPTURAR EL ERROR
                this.mensaje="Error al Generar la Programacion, Vuelva a Generarlo";
                this.displayErrorTablaProgramacion=true;
                //console.log("Error al Generar la Programacion, Vuelva a intentarlo");
        }
    }

    errorTablaProgramacion(){
        this.mensaje="";
        this.displayErrorTablaProgramacion=false;
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
                            this.getAllProgramacionByEm(1,0); 
                            this.iDReg=0;
                            this.displayConfirmar=false;
                        },
            err => {console.log(err);}
         );
    }

    //CERRAR PROGRAMACION
    cerrarProg(){
        this.displayProgramacion=false;
    }

    //IMPRIMIR PROGRAMACION
    imprimirProg(){
        console.log("falta programar");
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
        //console.log(otra);
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