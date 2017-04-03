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
    Placas: SelectItem[];
    displayNuevaProgramacion: boolean = false;
    displayProgramacionBase: boolean = false;
    selectedPlacas: string[] = [];
    disabledbutton: boolean = false;
    private errorMessage:string='';  //mensaje error del rest
    private isLoading: boolean = false;  
    placas:any[]=[];
    tipoProgramacion: string='Manual'; //tipo pescadito o escala
    //datos para la picklist (prog base)
    arrayPlacas:any[] = []; 
    ordenSorteo:any[] = []; 

    //grilla
    programacionMaestroArrayMemoria :any[]=[]; //array para la grilla HTML
    programacionMaestroArrayHTML :any[] = []; //

    //objeto maestro (solo para la memoria)
    progMaestro: any={
        PrId:0,     //oculto
        EmId:1,     //oculto
        PrCantidadBuses:0,
        PrDescripcion:"",
        PrFecha:'0-0-0',     //oculto
        PrFechaInicio:'0-0-0',
        PrFechaFin:'0-0-0',
        PrTipo:"pescado",      
        PrAleatorio:true,
        UsId:0,        //oculto
        UsFechaReg:'0-0-0'   //oculto
    }
    //objeto maestro para Mandar al rest
    objProgVentanaUno : any; // objeto para almacenar datos 1era ventana modal para mandarlo o borrar del sistema al cancelar o guardar
    progMaestroArray:any[]= [];

//OBJETO DETALLE
    progDetalle: any={
        PrId:0,     //oculto
        BuId:0,     //oculto
        PrDeFecha:"", //oculto
        PrDeBase:1, //oculto (true)
        PrDeOrden:[],           //placas sorteo manual
        UsId:0,     //oculto
        UsFechaReg:"",//oculto
    }
    //proDetalleArray:any[]=[];
    constructor(
            private programacionService: ProgramacionService,
            private placasservice: PlacasService
    ){}

    ngOnInit(){
        this.cargandoPlacas();
        this.ordenSorteo = [];
        //this.getAllProgramacionByEm(0,0);
        this.getAllPlacasBusByEmSuEm(1,0);

    }

    nuevaProgramacionMaestroRest(){
        this.programacionService.newProgramacion()
            .subscribe(data => {this.objProgVentanaUno = data});
        console.log("nuevo");
        console.log(this.objProgVentanaUno);
        //console.log(typeof this.objProgVentanaUno.UsFechaReg);

    }
    
    nuevaProgramacionDetalleRest(){

    }
    /*
    //todas las programaciones por empresa y año
    getAllProgramacionByEm( emId: number, anio: number){
        this.programacionService.getAllProgramacionByEm(emId, anio)
        .suscribe(
            data => {this.}
        );
    }
    */

    //cargando lista de placas en la memoria
    cargandoPlacas(){
        this.arrayPlacas.push({ nroPlaca: "SQ-234" });
        this.arrayPlacas.push({ nroPlaca: "AQK-2343" });
        this.arrayPlacas.push({ nroPlaca: "PMW-554" });
        this.arrayPlacas.push({ nroPlaca: "KHU-42" });
        this.arrayPlacas.push({ nroPlaca: "BMW-Q12" });
        this.arrayPlacas.push({ nroPlaca: "JFK-323" });
        this.arrayPlacas.push({ nroPlaca: "AQ-344" });
        this.arrayPlacas.push({ nroPlaca: "ZQ-548" });
        this.arrayPlacas.push({ nroPlaca: "MIDEF-32" });
        this.arrayPlacas.push({ nroPlaca: "MIM-328" });

        this.arrayPlacas.push({ nroPlaca: "KK-334" });
        this.arrayPlacas.push({ nroPlaca: "PNE-543" });
        this.arrayPlacas.push({ nroPlaca: "WMV-584" });
        this.arrayPlacas.push({ nroPlaca: "QKS-911" });
        this.arrayPlacas.push({ nroPlaca: "BMW-Q10" });
        this.arrayPlacas.push({ nroPlaca: "JFK-325" });
        this.arrayPlacas.push({ nroPlaca: "AQX-314" });
        this.arrayPlacas.push({ nroPlaca: "ZQX-528" });
        this.arrayPlacas.push({ nroPlaca: "MEDU-320" });
        this.arrayPlacas.push({ nroPlaca: "MIM-321" });

        this.arrayPlacas.push({ nroPlaca: "SQA-2341" });
        this.arrayPlacas.push({ nroPlaca: "AQKF-243" });
        this.arrayPlacas.push({ nroPlaca: "PKK-854" });
        this.arrayPlacas.push({ nroPlaca: "KHA-342" });
        this.arrayPlacas.push({ nroPlaca: "XXX-Q32" });
        this.arrayPlacas.push({ nroPlaca: "JF-3323" });
        this.arrayPlacas.push({ nroPlaca: "AQ-34F4" });
        this.arrayPlacas.push({ nroPlaca: "ZQF-484" });
        this.arrayPlacas.push({ nroPlaca: "MIDEF-01" });
        this.arrayPlacas.push({ nroPlaca: "MIM-3238" });

        this.arrayPlacas.push({ nroPlaca: "SQ-1534" });
        this.arrayPlacas.push({ nroPlaca: "AQK-2143" });
        this.arrayPlacas.push({ nroPlaca: "PMX-524" });
        this.arrayPlacas.push({ nroPlaca: "KHR-421" });
        this.arrayPlacas.push({ nroPlaca: "BMV-Q10" });
        this.arrayPlacas.push({ nroPlaca: "JFF-323" });
        this.arrayPlacas.push({ nroPlaca: "AQQ-644" });
        this.arrayPlacas.push({ nroPlaca: "ZQQ-548" });
        this.arrayPlacas.push({ nroPlaca: "MIDEF-02" });
        this.arrayPlacas.push({ nroPlaca: "MIM-318" });

        this.arrayPlacas.push({ nroPlaca: "SQX-234" });
        this.arrayPlacas.push({ nroPlaca: "AXK-2343" });
        this.arrayPlacas.push({ nroPlaca: "PXW-1154" });
        this.arrayPlacas.push({ nroPlaca: "KHU-4102" });
        this.arrayPlacas.push({ nroPlaca: "BMG-Q12" });
        this.arrayPlacas.push({ nroPlaca: "PTG-323" });
        this.arrayPlacas.push({ nroPlaca: "DARQ-344" });
        this.arrayPlacas.push({ nroPlaca: "ZQF-548" });
        this.arrayPlacas.push({ nroPlaca: "MIDEF-03" });
        this.arrayPlacas.push({ nroPlaca: "MIM-3128" });
    
    } //FIN CARGAR ARRAY PLACAS

    //abrir 1era ventana (boton nuevo)
    showNuevaProgramacionModalMaestro(){
        this.nuevaProgramacionMaestroRest();
        this.displayNuevaProgramacion=true;
        console.log(this.placas);
    }


    //abrir 2da ventana (boton continuar)
    //aqui se guarda la tabla MAESTRO en el REST
    showProgBase(){
        this.displayNuevaProgramacion=false; //cerrar 1era ventana
        this.displayProgramacionBase=true; //abrir 2da ventana

        //tipo programacion Manual o Aleatorio (Binario)
        if(this.tipoProgramacion == 'Manual'){
            this.progMaestro.PrAleatorio = false;
        }else if(this.tipoProgramacion == 'Aleatorio'){
            this.progMaestro.PrAleatorio = true;
        }
        //capturando fecha actual

        //cargando lo ingresado en una variable
        //PrFecha y UsFechaReg, ¿Cual es la diferencia?
        this.objProgVentanaUno.PrId = this.progMaestro.PrId, //number
        this.objProgVentanaUno.EmId = this.progMaestro.EmId, //number
        this.objProgVentanaUno.PrCantidadBuses = this.progMaestro.PrCantidadBuses, //number
        this.objProgVentanaUno.PrDescripcion = this.progMaestro.PrDescripcion, //string
        this.objProgVentanaUno.PrFecha = this.progMaestro.PrFechaInicio, //string
        this.objProgVentanaUno.PrFechaInicio = this.progMaestro.PrFechaInicio, //string
        this.objProgVentanaUno.PrFechaFin = this.progMaestro.PrFechaFin, //string
        this.objProgVentanaUno.PrTipo = this.progMaestro.PrTipo, //string
        this.objProgVentanaUno.PrAleatorio = this.progMaestro.PrAleatorio, //string
        this.objProgVentanaUno.UsId = this.progMaestro.UsId, //number
        this.objProgVentanaUno.UsFechaReg = this.progMaestro.PrFechaInicio //string

        //objeto listo para mandar al rest
        console.log(this.objProgVentanaUno);
        
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

    //terminar la programacion
    generarProgramacionSegundoModal(){

        console.log("programacion =D");
        /*
        console.log("sorteo: "+this.ordenSorteo[0].nroPlaca);
        console.log("sorteo: "+this.ordenSorteo[1].nroPlaca);
        console.log("sorteo: "+this.ordenSorteo[2].nroPlaca);
        console.log("sorteo: "+this.ordenSorteo[3].nroPlaca);
        */
        //cargando las placas al a un 
        //condicional para ver si esta cumpliendo con el total de
        //placas a mandar para generar la programacion
        
        //cantidad ingresada es mayor a la cantidad de placas ingresadas (falta terminar programacion base)
        if(this.progMaestro.PrCantidadBuses>this.ordenSorteo.length){
            console.log("falta placas por ingresar :c");

        }else if(this.progMaestro.PrCantidadBuses == this.ordenSorteo.length){
            //si las cantidades son iguales la programacion puede terminar
            console.log("programacion terminada  c: ");
            this.displayProgramacionBase=false; //cerrar 2da ventana Prog Base
            this.progMaestro.PrCantidadBuses=0;
        }
        
        //console.log(this.progMaestro.PrCantidadBuses);
    }
    
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

    //cerrar ventanas new programacion
    cancelarProgBase(){
        this.displayProgramacionBase = false;
        this.displayNuevaProgramacion=false;
    }

    //datos para grilla HTML Maestro
    mostrargrillaProgramacionMaestro(){
        this.programacionMaestroArrayHTML=[];

        for(let programacionMaestro of this.programacionMaestroArrayMemoria){

            this.programacionMaestroArrayHTML.push({
                PrId : programacionMaestro.PrId,
                EmId : programacionMaestro.EmId,
                PrCantidadBuses : programacionMaestro.PrCantidadBuses,
                PrDescripcion : programacionMaestro.PrDescripcion,
                PrFecha : "2017-04-01",
                PrFechaInicio : programacionMaestro.PrFechaInicio,
                PrFechaFin : programacionMaestro.PrFechaFin,
                PrTipo : programacionMaestro.PrTipo,
                PrAleatorio : programacionMaestro.PrAleatorio,
                UsId : programacionMaestro.UsId,
                UsFechaReg : "2017-04-01"
            });

        }
    }
    
    //datos para grilla HTML DETALLE
    mostrargrillaProgramacionDetalle(){

    }

    //recuperando todos los buses (para sacar las placas)
    getAllPlacasBusByEmSuEm(empId: number, suemId : number){
        this.placasservice.getAllPlacasBusByEmSuEm(empId, suemId)
            .subscribe(
                data => {this.placas = data},
                err  => {this.errorMessage = err},
                () =>this.isLoading = false
            );
    }
}