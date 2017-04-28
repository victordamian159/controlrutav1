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
    
    borrar:any;

    //para seleccionar una fila de la tabla
    idFilaSeleccionada: number;
    nroBusesFilaSelect: number;
    nroDiasFilaSelect: number;
    titleNuevoProgPrimerModal:string; 
    formaProgramacion:string = 'Escala'; //almacena el string del item seleccionado
    tipoProgramacion: string='Manual'; //tipo manual o automatico

    displayNuevaProgramacion: boolean = false;
    displayProgramacionBase: boolean = false;
    displayProgramacion: boolean = false;

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

    progBDDetalle:any[]=[]; // para recoger resultado de la BD
    _progBDDetalle:any[]=[]; //NO SE ESTA USANDO

    //COLUMNAS DEL DATATABLE PRIMENG
    columnas:any[]=[];
    _columnas : SelectItem[];

    _detalle:any[]=[];
    nroDias:any[]=[];
    nroColumn:number;
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

    //1era ventana MODAL(boton nuevo)
    showNuevaProgramacionModalMaestro(){
        this.nuevaProgramacionMaestroRest();
        this.displayNuevaProgramacion=true;
        //console.log(this.placas);
        this.titleNuevoProgPrimerModal = 'Nueva';
        this.extrayendoPlacasBus();

        //this.extrayendoDatosTablaMaestroRest();
        //borrar solo es para prueba
    }

    //aqui recien se guarda la tabla MAESTRO en el REST  2da ventana MODAL(boton continuar)
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
        {
            this.date = new Date();
            this.dia = this.date.getDate();
            this.mes = this.date.getMonth();
            this.anio = this.date.getFullYear();
            this.progMaestro.PrFecha = this.anio+"-"+this.mes+"-"+this.dia;
        }

        //cargando lo ingresado en una variable //PrFecha y UsFechaReg, ¿Cual es la diferencia?
        {
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
        }//objeto listo para mandar al rest
        
    
        
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
                 data => {this.progMaestro=data; 
                     this.mostrargrillaProgramacionMaestro() ;
                     this.getAllProgramacionByEm(1,0);
                }, 
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
            {
                this.date = new Date();
                this.dia = this.date.getDate();
                this.mes = this.date.getMonth();
                this.anio = this.date.getFullYear();
                this.progDetalle.PrDeFecha = this.anio+"-"+this.mes+"-"+this.dia;
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
            } //console.log(this.ordenSorteo);

            //guardando en el rest Programacion detalle   MANDANDO A LA BD
            this.programacionService.saveProgramacionDetalle(this.programacionArrayDetalleBD,this.progMaestro.EmId,this.progMaestro.PrId,this.progMaestro.PrAleatorio)
                .subscribe( 
                    realizar => {
                            //this.mgprogDetalle();
                            //PONER UNA VENTANA MODAL CON EL MENSAJE 
                            console.log("SE GENERO LA PROGRAMACION =D");
                        }, 
                    err => {this.errorMessage = err}
            );
            console.log("se agrego programacion detalle --> SE GENERO LA PROGRAMACION =D");
    
        }//final condicional IF
    }//final funcion generarProgramacionSegundoModal
    
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
        this.eliminarMaestro(this.progRest[this.progRest.length-1].prId)
        
    }

    //datos para grilla HTML Maestro (consulta especialmente hecha para mostrar en el res)
    mostrargrillaProgramacionMaestro(){
        //this.extrayendoDatosTablaMaestroRest(); //extraer los campos de la nueva consulta para la grilla
        this.programacionMaestroArrayHTML=[];
        //progRest es la variable q almacena las programaciones recuperadas desde el Rest de internet
        for(let programacionMaestro of this.progRest){

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

    //CARGAR COLUMNAS Y ARRAY DE PROGRAMACION


    //recuperando todos los buses (para sacar las placas)  empId(id de empresa)  suemId(subempresa id)
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
                datos => {
                    this.progRest = datos ; 
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
                BuId: this.placas[i].BuId
            });
            //console.log(this.arrayPlacas);
            //console.log(this.placas);
            //console.log(this.progRest);
        }
    }

    //seleccionar fila de la tabla
    onRowSelectMaestro(event){
        this.idFilaSeleccionada = event.data.prId; //ID DE LA FILA 
        this.nroBusesFilaSelect = event.data.PrCantidadBuses; // CANT BUSES
        this.nroDiasFilaSelect  = event.data.dias; //CANT DIAS
        this.displayProgramacion = true;

        this.nroDias=[];

        //console.log(this.idFilaSeleccionada);
        //console.log(this.nroBusesFilaSelect);
        //console.log(this.nroDiasFilaSelect);

        //llamar a una consulta para que al momento de hacer click sobre una fila muestre el detalle de la fila selecciona
        //this.getallprogramaciondetallebyprid(this.idFilaSeleccionada);

        //DETALLE
        //this.progBDDetalle
        //LIMPIANDO VARIABLES
        this.columnas=[]; //COLUMNAS
        this._columnas=[]; //ITEMS COLUMNAS DATATABLE

        
            //CONSULTA PROGRAMACION DETALLE
            //getallprogramaciondetallebyprid(_prid:number){
                this.programacionService.getAllProgramacionDetalleByPrId(this.idFilaSeleccionada).subscribe(
                    data => {
                                this.progBDDetalle = data; 
                                //console.log(this.progBDDetalle)
                                this.tablaProgramaciones();
                            },
                    err => {this.errorMessage=err},
                    () => this.isLoading=false
                );
            
        
    }

    //TABLA PROGRAMACIONES
    tablaProgramaciones(){
        //ALGORITMO PARA PASAR LOS ID DE BUSES DE LOS PRIMEROS 
        //1ERA MATRIZ
        let a1 :any[]=[]; let a2 :any[]=[]; let a3 :any[]=[]; 
        let i=0; let j=0; let k=0;                              

        //PARA COLUMNAS
        while(i<this.nroDiasFilaSelect){
            //console.log(i);
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
        //console.log(a5);
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
        console.log(this.nroDias);
        //PARA ELEGIR TAMAÑO DE TABLA 2000PX O 500PX
        this.nroColumn=this.nroDias.length;
    }

    editarMaestro(_PrId : number){
        console.log("editar "+_PrId);
        this.titleNuevoProgPrimerModal = 'Editar';
        this.displayNuevaProgramacion=true; //abrir la 1era ventana modal para poder editar la programacion
        this.programacionService.getProgramacionById(_PrId).subscribe(
            data => {
                     this.progMaestro=data; 
                     console.log(this.progMaestro);
                    },
            err => {console.log(err);}
        );
    }

    eliminarMaestro(_PrId : number){
        console.log("eliminar "+_PrId);
        this.programacionService.deleteProgramacionByid(_PrId).subscribe(
            realizar => {this.getAllProgramacionByEm(1,0)},
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
}