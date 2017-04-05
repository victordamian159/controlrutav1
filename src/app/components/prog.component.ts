import {Component, OnInit} from '@angular/core';
//import {SelectItem} from 'primeng/primeng';
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
    
    borrar:any;

    //para seleccionar una fila de la tabla
    idFilaSeleccionada: number;

    formaProgramacion:string = 'Escala'; //almacena el string del item seleccionado
    tipoProgramacion: string='Manual'; //tipo manual o automatico

    displayNuevaProgramacion: boolean = false;
    displayProgramacionBase: boolean = false;
    selectedPlacas: string[] = [];
    disabledbutton: boolean = false;
    private errorMessage:string='';  //mensaje error del rest
    private isLoading: boolean = false;  
    placas:any[]=[]; //se utiliza para almacenar lo q devuelve el rest de las placas
    
    //datos para la picklist (prog base)
    arrayPlacas:any[] = []; 
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
 
    nuevaProgramacionMaestroRest(){
        this.programacionService.newProgramacion()
            .subscribe(data => {this.objProgVentanaUno = data});
    }
    
    nuevaProgramacionDetalleRest(){
        this.programacionService.newProgramacionDetalle()
            .subscribe(data => {this.objProgVentanaDos = data});
    }
    
    

    //abrir 1era ventana (boton nuevo)
    showNuevaProgramacionModalMaestro(){
        this.nuevaProgramacionMaestroRest();
        this.displayNuevaProgramacion=true;
        //console.log(this.placas);
        this.extrayendoPlacasBus();

        //this.extrayendoDatosTablaMaestroRest();
        //borrar solo es para prueba
    }


    //abrir 2da ventana (boton continuar)
    //aqui recien se guarda la tabla MAESTRO en el REST
    showProgBase(){
        this.displayNuevaProgramacion=false; //cerrar 1era ventana
        this.displayProgramacionBase=true; //abrir 2da ventana

        //tipo programacion Manual o Aleatorio (Binario)
        if(this.tipoProgramacion == 'Manual'){
            this.progMaestro.PrAleatorio = false;
        }else if(this.tipoProgramacion == 'Aleatorio'){
            this.progMaestro.PrAleatorio = true;
        }
        
        //forma programacion escala o pescadito
        if(this.formaProgramacion == 'Escala'){
            this.progMaestro.PrTipo="01";
        }else if(this.formaProgramacion == 'Pescadito'){
            this.progMaestro.PrTipo="02";
        }
        
        //capturando fecha actual
        this.date = new Date();
        this.dia = this.date.getDate();
        this.mes = this.date.getMonth();
        this.anio = this.date.getFullYear();
        this.progMaestro.PrFecha = this.anio+"-"+this.mes+"-"+this.dia;

        //cargando lo ingresado en una variable
        //PrFecha y UsFechaReg, ¿Cual es la diferencia?
        this.objProgVentanaUno.PrId = this.progMaestro.PrId, //number
        this.objProgVentanaUno.EmId = this.progMaestro.EmId, //number
        this.objProgVentanaUno.PrCantidadBuses = this.progMaestro.PrCantidadBuses, //number
        this.objProgVentanaUno.PrDescripcion = this.progMaestro.PrDescripcion, //string
        this.objProgVentanaUno.PrFecha = this.progMaestro.PrFecha, //string
        this.objProgVentanaUno.PrFechaInicio = this.progMaestro.PrFechaInicio, //string
        this.objProgVentanaUno.PrFechaFin = this.progMaestro.PrFechaFin, //string
        this.objProgVentanaUno.PrTipo = this.progMaestro.PrTipo, //string escala pescadito
        this.objProgVentanaUno.PrAleatorio = this.progMaestro.PrAleatorio, //string manual automatico(aleatorio)
        this.objProgVentanaUno.UsId = this.progMaestro.UsId, //number
        this.objProgVentanaUno.UsFechaReg = this.progMaestro.PrFecha //string

        //objeto listo para mandar al rest
        //console.log(this.objProgVentanaUno);
        
        //guardando en array para poder mostrarlo en la grilla HTML maestro Programacion
        this.programacionMaestroArrayMemoria.push({
            PrId : this.progMaestro.PrId,
            EmId : this.progMaestro.EmId,
            PrCantidadBuses : this.progMaestro.PrCantidadBuses,
            PrDescripcion : this.progMaestro.PrDescripcion,
            PrFecha : "2017-04-01",
            PrFechaInicio : this.progMaestro.PrFechaInicio,
            PrFechaFin : this.progMaestro.PrFechaFin,
            PrTipo : this.progMaestro.PrTipo,
            PrAleatorio : this.progMaestro.PrAleatorio,
            UsId : this.progMaestro.UsId,
            UsFechaReg : "2017-04-01"
        });

        //guardando en el rest Programacion Maestro (pasarlo  a la 2da VEntana modal)
        this.programacionService.saveProgramacion(this.objProgVentanaUno)
            .subscribe( 
                realizar => {this.mostrargrillaProgramacionMaestro();}, 
                err => {this.errorMessage = err}
            );
        console.log("se agrego programacion maestro");
    }

    //terminar la programacion (generar la programacion completa y confirma la tabla MAESTRO)
    generarProgramacionSegundoModal(){
        //condicional para ver si esta cumpliendo con el total de placas a mandar para generar la programacion
        if(this.progMaestro.PrCantidadBuses>this.ordenSorteo.length){
            //cantidad ingresada es mayor a la cantidad de placas ingresadas (falta terminar programacion base)
            console.log("falta placas por ingresar :c");
        }else if(this.progMaestro.PrCantidadBuses == this.ordenSorteo.length){
            //si las cantidades son iguales la programacion puede terminar
            console.log("programacion terminada  c: ");
            this.displayProgramacionBase=false; //cerrar 2da ventana Prog Base
            this.progMaestro.PrCantidadBuses=0;

            //fecha
            this.date = new Date();
            this.dia = this.date.getDate();
            this.mes = this.date.getMonth();
            this.anio = this.date.getFullYear();
            this.progDetalle.PrDeFecha = this.anio+"-"+this.mes+"-"+this.dia;

            //cargando detalle a un array de objetos (mandar al rest)
            //console.log(this.ordenSorteo);
            for(let i=1; i<=this.ordenSorteo.length ; i++){
                this.programacionArrayDetalleBD.push({
                    PrId : this.progDetalle.PrId,
                    BuId : this.ordenSorteo[i-1].BuId,
                    PrDeFecha: this.progDetalle.PrDeFecha,
                    PrDeBase: this.progDetalle.PrDeBase,
                    PrDeOrden: i,
                    UsId: this.progDetalle.UsId,
                    UsFechaReg: this.progDetalle.PrDeFecha
                });
            }

            console.log(this.programacionArrayDetalleBD);

            //mandandolo a rest
            //guardando en el rest Programacion detalle 
            this.programacionService.saveProgramacionDetalle(this.programacionArrayDetalleBD)
                .subscribe( 
                    realizar => {this.mostrargrillaProgramacionDetalle();}, 
                    err => {this.errorMessage = err}
            );
            console.log("se agrego programacion detalle");
    
        }//final condicional 
    }//final funcion generarProgramacionSegundoModal
    
/*
    saveProgramacionMaestro(){

    }
    
    saveProgramacionDetalle(){
        
    }
*/

    //deshabilitando botones
    disabledButtonForm(){
        this.disabledbutton = false;
        return this.disabledbutton;
    }
    
    //cerrar prog (1era ventana)
    cancelNewProgramacion(){
         this.displayNuevaProgramacion=false;
         //BORRAR LOS DATOS INGRESADOS 
    }

    //cerrar ventanas new programacion (2do Modal)
    cancelarProgBaseSegundoModal(){
        this.displayProgramacionBase = false; //1era ventana
        this.displayNuevaProgramacion=false;  //2da ventana
    }

    //datos para grilla HTML Maestro (consulta especialmente hecha para mostrar en el res)
    mostrargrillaProgramacionMaestro(){
        this.extrayendoDatosTablaMaestroRest(); //extraer los campos de la nueva consulta para la grilla
        this.programacionMaestroArrayHTML=[];
        //progRest es la variable q almacena las programaciones recuperadas desde el Rest de internet
        for(let programacionMaestro of this.progRestMaestro){

            this.programacionMaestroArrayHTML.push({
                EmConsorcio : programacionMaestro.EmConsorcio,
                PrAleatorio : programacionMaestro.PrAleatorio,
                PrCantidadBuses : programacionMaestro.PrCantidadBuses,
                PrFecha : programacionMaestro.PrFecha,
                PrFechaInicio : programacionMaestro.PrFechaInicio,
                PrFechaFin : programacionMaestro.PrFechaFin,
                PrTipo : programacionMaestro.PrTipo,
                dias : programacionMaestro.dias,
                prDescripcion : programacionMaestro.prDescripcion,
                prId : programacionMaestro.prId
            });
        }// fin funcion for
    }//fin funcion mostrargrillaProgramacionMaestro
    
    //datos para grilla HTML DETALLE
    mostrargrillaProgramacionDetalle(){
        console.log("grilla detalle");
    }

    //recuperando todos los buses (para sacar las placas)
    getAllPlacasBusByEmSuEm(empId: number, suemId : number){
        this.placasservice.getAllPlacasBusByEmSuEm(empId, suemId)
            .subscribe(
                data => {this.placas = data},
                err  => {this.errorMessage = err},
                () =>this.isLoading = false
            );
            console.log(this.placas);
    }

    //todas las programaciones por empresa y año
    getAllProgramacionByEm( empId: number, anio: number){
        this.programacionService.getAllProgramacionByEm(empId, anio)
            .subscribe(
                datos => {this.progRest = datos ; this.mostrargrillaProgramacionMaestro();},
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
                BuId: this.placas[i].BuId
            });
            //console.log(this.arrayPlacas);
            //console.log(this.placas);
            //console.log(this.progRest);
        }
    }

    extrayendoDatosTablaMaestroRest(){
        for(let i=0; i<this.progRest.length; i++){
            this.progRestMaestro.push({
                EmConsorcio:this.progRest[i].EmConsorcio,
                PrAleatorio: this.progRest[i].PrAleatorio,
                PrCantidadBuses: this.progRest[i].PrCantidadBuses,
                PrFecha: this.progRest[i].PrFecha,
                PrFechaFin: this.progRest[i].PrFechaFin,
                PrFechaInicio: this.progRest[i].PrFechaInicio,
                PrTipo: this.progRest[i].PrTipo,
                dias: this.progRest[i].dias,
                prDescripcion: this.progRest[i].prDescripcion,
                prId: this.progRest[i].prId
            });
        }
        //console.log(this.progRestMaestro);
    }
    //seleccionar fila de la tabla
    onRowSelectMaestro(event){
        console.log("fila seleccionada =D");
        this.idFilaSeleccionada = event.data.prId;
        console.log(this.idFilaSeleccionada);
        //llamar a una consulta para que al momento de hacer click sobre una fila muestre el detalle de la fila selecciona
    }
}