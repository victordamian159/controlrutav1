import {Component, OnInit ,ElementRef} from '@angular/core';
import {Message} from 'primeng/primeng';
//import {puntoscontrol, puntosTrazaRuta} from 'app/variables';


//para rest 
import {PuntoControlService} from '../service/pcontrol.service';
import {RutaService} from '../service/ruta.service';

declare var google: any;

@Component({
    selector:'app-pcontrol',
    templateUrl:'../views/pcontrol.component.html',
    styleUrls: ['../styles/pcontrol.component.css']
})

export class PcontrolComponent implements OnInit{

    date: any;
    anio:string;
    mes:string;
    dia:string;

    //trazar la ruta
    puntosRuta : any[]=[];
//maestro
     pcMaestro: any ={ 
        PuCoId : 0,
        RuId : 12,
        PuCoTiempoBus : "",
        PuCoClase : "",
        UsId : 0,
        UsFechaReg : ""
    }
    // para mostrar grilla con el FOR
    pcMaestroEditar:any;
    pcMaestroBD : any;
//detalle puntos de control
    pcDetalle={
        PuCoDeId        : 0,
        PuCoId          : 0,
        PuCoDeLatitud  : 0,
        PuCoDeLongitud : 0,
        PuCoDeDescripcion : "",
        PuCoDeHora      : "",
        UsId            : 1,
        UsFechaReg      : "",
        PuCoDeOrden     : 0
    }
   
    // para mostrar grilla con el FOR
    pcDetalleBD={
        PuCoDeId        : 0,
        PuCoId          : 0,
        PuCoDeLatitud   : 0,
        PuCoDeLongitud  : 0,
        PuCoDeDescripcion : "",
        PuCoDeHora      : "",
        UsId            : 1,
        UsFechaReg      : "",
        PuCoDeOrden     : 0
    };
    idFilaSeleccionada: number;  
    idRutaFilaSeleccionada : number;
    _pcRecuperado :any; // objeto recuperado de la consulta getPuntoCOntrolById
    getPuntoControlMaestro:any; //se almacena lo q se recupero del rest para editar o eliminar (consulta al rest)

    headertitle:string; // titulo del modal

    longpCArrayDetalleBD=0; // longitud del Array P C Detalle para BD rest
    pcDetalleRest:any; // para mardar al servicio Rest
    pcMaestroRest:any; // para mardar al servicio Rest
    pcDetalleGrid: any[]=[];
    puntosControl:any;
    indexOverlays=0; //indice para objetos sobre el mapa, almacena los indice (funcion: deshacerPunto)
    indexPCDetalle=0; //almacena index punto control detalle (marker, circle) 
    private errorMessage:string=''; //mensaje error del rest
    private isLoading: boolean = false;  //captura error en getAllPuntoControlDetalleByPuCo
    options: any; //opciones del mapa

    overlays:any[]=[];//formas sobre el mapa (marker, lineas)
    pCArrayDetalleBD:any[]=[];//se almacena los puntos de control
    pCArrayMaestroBD:any[]=[];//se almacena los puntos de control
    coor:any[]=[]; // para almacenas las coordenadas
    lineaRuta:any[]=[];//para trazar la ruta en el mapa

    x:string; //para pasarlo al objeto pcDetalle
    y:string; //para pasarlo al objeto pcDetalle
    pCMaestroMostrar:any[]=[];//mostrar grilla de lista puntos control
    pCDetalleMostrar:any[]=[]; //mostrar grilla detalle de puntos control

    coordenadas:any[]=[];
    linea:any;
    flightPlanCoordinates:any[]=[];
    i=0;
    j=0;
    k=0;
    l=0;
    m=0; //reducir en 1 los title de los marker
    n=0; //nro de puntos de control (guardar puntos en rest DETALLE) 
    editar=0; //si editar = 0 (nuevo registro) si editar = 1 (funcion editar) 
    indexMarkerTitle:string; //index marker para title (string)
    indexMarker=0; //indice de marker
    //markertitle:string;
    selectedPosition:any;
    draggable:boolean;
    displayNuevoPunto:boolean =false;

    displayListaPuntos: boolean = false; 
    displayPCDetalle: boolean = false;
    mapa:any;

    //infoWindow: any;
    // msgs: Message[] = [];

    constructor( 
        private pcontrolService: PuntoControlService,
        //public el: ElementRef 
        private rutaService: RutaService
    ){}

    //iniciar 
    ngOnInit(){

        //this.mapa= document.getElementById('Ag');
        //maps.Map(this.el.nativeElement.children[0], this.options);
        //this.mapa = new google.maps.Map(this.el.nativeElement.children[0], this.options);
        //console.log(this.mapa);
        this.options={
            center: new google.maps.LatLng(-18.0065679, -70.2462741),
            zoom:14
        };

        //MAESTRO
         this.getAllPuntoControlByEmRu(1,12); //consulta para la grilla 
        //DETALLE
        // this.getAllPuntoControlDetalleByPuCo(0);
    }

    //para mostrar en la grilla de programaciones  (MOSTRAR EN GRILLA)
    getAllPuntoControlByEmRu(emId: number, ruId: number){
        this.pcontrolService.getAllPuntoControlByEmRu(emId,ruId)
        .subscribe(
            data => { this.pCArrayMaestroBD = data; this.mgPuntoControlMaestro();},
                    err => {this.errorMessage = err}, 
                    () =>this.isLoading = false
            );
        //console.log(this.pCArrayMaestroBD);
    }

    //click sobre el mapa y abrir modal para add Marker
    handleMapClick(event){
        //mostrar modal addmarker
        this.selectedPosition = event.latLng;

        //agregando las coordenadas de los markers para mandarlos a la BD
        this.coordenadas.push(
            coords = {x:this.selectedPosition.lat(), y:this.selectedPosition.lng()}
        );

        //guardando coordenadas en las variables X y Y 
        this.x=(coords.x).toString();
        this.y=(coords.y).toString();
       
        this.addmarker();
        this.displayNuevoPunto=true;
    }

    //arrastrar 
    handleOverlayClick(event) {
        console.log("click click");
    }

    //click sobre una forma (marcador, lineas u otras)
    handleOverClick(event){
        //marcador : impar,  circle : par 
        //primer marker es index 0
        //primer circle es index 1
        this.indexPCDetalle= this.overlays.indexOf(event.overlay);
        console.log("indice objeto"+this.indexPCDetalle);
        
        if(this.indexPCDetalle==0 ){
            console.log("titulo marker: "+this.overlays[this.indexPCDetalle].title);    
            this.overlays[this.indexPCDetalle].setMap(null);
            this.overlays[this.indexPCDetalle+1].setMap(null);
            this.overlays.splice(this.indexPCDetalle,2);
        }else if(this.indexPCDetalle%2==0 && this.indexPCDetalle>1){
            //console.log("marcador");
            console.log("titulo marker: "+this.overlays[this.indexPCDetalle].title);    
            this.overlays[this.indexPCDetalle].setMap(null);
            this.overlays[this.indexPCDetalle+1].setMap(null);
            this.overlays.splice(this.indexPCDetalle,2);
            this.pCArrayDetalleBD.splice( Number(this.overlays[this.indexPCDetalle].title) , 1);
           
        }
        console.log("tamaño: "+this.overlays.length);

        //actualizando la matriz de objetos puntosControlDetalleBD
        if(this.indexPCDetalle>1){
            let n = 0;
            
            this.m=this.indexPCDetalle
            while(this.m<this.overlays.length){
                n = Number(this.overlays[this.m].title);//title marker = nro marker
                
                this.overlays[this.m].title = (n -1).toString(); 
                this.m=this.m+2;
            }
        }
        console.log(this.overlays);
    }

    addmarker(){
        this.draggable=false;
        this.indexMarkerTitle=this.indexMarker.toString();
        this.overlays.push(new google.maps.Marker({
                position: {lat: this.coordenadas[this.j].x, lng: this.coordenadas[this.j].y},
                title:this.indexMarkerTitle,
                draggable: this.draggable              
        }));

        this.indexMarker++;
       this.displayNuevoPunto = false;
        
        //agregando circulo
        this.overlays.push(new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            center: this.selectedPosition,
            radius:10
        }));
        this.j++;
    }
//PUNTO CONTROL MAESTRO
    //funcion nueva Maestro de puntos de control (BOTON NUEVO)
    newPuntoControlMaestro(){
        this.headertitle = "Nueva Lista";
        this.editar = 0; // si editar es cero es nuevo registro
        this.displayListaPuntos = true;
        this.pcontrolService.newPuntoControl().subscribe(data => {this.pcMaestroBD=data});
    }

    //click sobre la fila y mostrar los puntos de control (detalle)
    onRowSelectMaestro(event) {
        //limpiar el mapa para ponerle los nuevos marcadores
        this.overlays = [];
        this.puntosRuta=[];
        this.pCArrayDetalleBD=[];
        this.coordenadas =[];

        //buscando en el rest deacuerdo al id de la row
        this.idFilaSeleccionada = event.data.PuCoId;  //recupera la PuCoId de la fila seleccionada (para recuperar los puntos de control con la consulta)
        this.idRutaFilaSeleccionada = event.data.RuId; //recupera el RuId para poder sacar la ruta de la BD

        //console.log(this.idFilaSeleccionada);
        console.log(event.data.RuId);

        //recuperadno putnos de control por el PuCoId 
        this.pcontrolService.getAllPuntoControlDetalleByPuCo(this.idFilaSeleccionada)
        .subscribe(
            data => {this.pCArrayDetalleBD=data; this.mgPuntosControlDetalle(); this.cargarmarker();},
            err => {this.errorMessage = err},
            () => this.isLoading = false
        );
         //cargarlos en el array de objetos
         //this.overlays=[];//ver si se puede eliminar esta cosa 

         //recuperar la ruta desde la tabla ruta(DETALLE)
         this.rutaService.getAllRutaDetalleByRu(this.idRutaFilaSeleccionada).subscribe(
             data => {this.puntosRuta=data; this.cargarRuta();},
             err => {this.errorMessage=err},
             () => this.isLoading = false
         );

    }//fin funcion onRowSelectMaestro

    //CARGAR LA RUTA AL MAPA
    cargarRuta(){
        for(let n=0; n<this.puntosRuta.length; n++){
            this.coordenadas.push({
                    lat:this.puntosRuta[n].RuDeLatitud,
                    lng:this.puntosRuta[n].RuDeLongitud
            });
        }

        this.overlays.push(
            new google.maps.Polyline({
            path: this.coordenadas,
            strokeColor: '#FF0000',
            strokeOpacity : 0.5,
            strokeWeight :8 
        }));

        //borrando las coordenadas para poder ingresar las coordenadas de los marcadores
        this.coordenadas=[];
        console.log(this.overlays.length);
    }

    //CARGAR LOS MARCADORES EL MAPA 
    cargarmarker(){
          console.log(this.pCArrayDetalleBD);
        console.log(this.overlays);
         for(let marker of this.pCArrayDetalleBD){
            this.overlays.push(
                new google.maps.Marker({
                    position:{lat:marker.PuCoDeLatitud , lng:marker.PuCoDeLongitud},
                    title:marker.PuCoDeDescripcion,
                    draggable:false
                })
            );
            console.log(marker);
        }
    }
   
    //para editar la tabla maestro (grilla)
    editarMaestro(_puCoId:number){
        console.log("editar =D");
        this.editar = 1; //si editar es igual a uno entonces se editar el registro
        console.log(_puCoId);
        this.headertitle="Editar Lista"
        this.displayListaPuntos=true;

        //haciendo la consulta en el rest
         this.pcontrolService.getPuntoControlById(_puCoId)
        .subscribe(
            data => {this.pcMaestro = data},
                    err =>{this.errorMessage = err}, () =>this.isLoading=false
        );
        console.log(this.pcMaestro);
    }
   
    eliminarMaestro(_PuCoId : number){
        
        console.log("eliminar =D"+ _PuCoId);
        this.pcontrolService.deletePuntoControl(_PuCoId).subscribe(
            realizar => {this.getAllPuntoControlByEmRu(1,0)}, 
            err => {console.log(err);}
        );
    }

    //guardar nuevo Maestro puntos de control
    guardarPCMaestro(){      
      console.log(this.pcMaestroBD);
        if(this.editar == 1){
            //el registro se editar
            console.log("registro editado y guardado");
        }else if(this.editar == 0){
            //el registro es nuevo
            console.log("guardado nuevo");
             //fecha
            this.date = new Date();
            this.dia = this.date.getDate();
            this.mes = this.date.getMonth();
            this.anio= this.date.getFullYear();

            //almacenado para los datos
            
            this.pcMaestroBD.PuCoId = this.pcMaestro.PuCoId,
            this.pcMaestroBD.RuId = this.pcMaestro.RuId,
            this.pcMaestroBD.PuCoTiempoBus = this.pcMaestro.PuCoTiempoBus,
            this.pcMaestroBD.PuCoClase = this.pcMaestro.PuCoClase,
            this.pcMaestroBD.UsId = this.pcMaestro.UsId,
            this.pcMaestroBD.UsFechaReg = this.anio + "-" + this.mes+"-"+ this.dia
        }

        //mandando al rest
        this.pcontrolService.savePuntoControl(this.pcMaestroBD)
        .subscribe(realizar => {this.mgPuntoControlMaestro();},
                        err => {this.errorMessage=err});

        this.displayListaPuntos = false;
    }
    
    //cancelar la agregacion de un Maestro punto de control
    cancelarPCMaestro(){
        console.log("lista cancelada");
        this.displayListaPuntos = false;
    }

//DETALLE PUNTOS CONTROL 
 
    newPCDetalle(){
        this.pcontrolService.newPuntoControlDetalle()
        .subscribe(data => {this.pcDetalleRest=data});
    }


    editarDetalle(_PuCoDeId : number){
        console.log(_PuCoDeId);
    }

    eliminarDetalle(_PuCoDeId : number){
        console.log(_PuCoDeId);
    }

    //GUARDAR DETALLE PUNTO CONTROL (del modal)
    guardarPunto(){   
        this.newPCDetalle(); // crear un nuevo punto (REST)

        //this.longpCArrayDetalleBD = this.pCArrayDetalleBD.length 
        //console.log(this.longpCArrayDetalleBD);

        //cargando los puntos control detalle a un array para ser mostrados y poder mandarlos al servidor REST
        this.pCArrayDetalleBD.push({
                PuCoDeId : 0,
                PuCoId : this.idFilaSeleccionada,
                PuCoDeLatitud : Number(this.x),
                PuCoDeLongitud : Number(this.y),
                PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                PuCoDeHora : this.pcDetalle.PuCoDeHora,
                UsId : 0,
                UsFechaReg : "2017-02-29",
                PuCoDeOrden : this.n
            }
        );
        this.pcDetalle.PuCoDeDescripcion=null;
        this.pcDetalle.PuCoDeHora=null;

        this.n++;
        this.displayNuevoPunto = false;
        
        console.log(this.pCArrayDetalleBD);
    }

    //mandar al servicio Rest los puntos, es para confirmar que se tiene los correctos
    guardarpuntosDetalleRest(){
        console.log(this.pCArrayDetalleBD);

        this.pcontrolService.savePuntoControlDetalle(this.pCArrayDetalleBD).
        subscribe(realizar => {this.mgPuntosControlDetalle();},
                            err => {this.errorMessage=err});
        console.log("guardado en rest");

        //al terminar de guardar se tiene que borrar las coordenadas y l¿overlays para poder tenerlo libre al elegir otros puntos de control
        //this.overlays = [];
        //this.puntosRuta=[];
        this.pCArrayDetalleBD=[];
    }
    //borrar ultimo punto control detalle
    deshacerPunto(){
        //console.log("cancelado");
        this.indexOverlays=this.overlays.length;
        //console.log(this.indexOverlays);

        this.overlays[this.indexOverlays - 1].setMap(null);
        this.overlays[this.indexOverlays - 2].setMap(null);
        this.overlays.splice(this.indexOverlays-2, 2);
        this.overlays.length = this.overlays.length;
        
        this.indexOverlays=this.overlays.length;
        console.log("long array: "+this.indexOverlays);
        this.displayNuevoPunto = false;
    }

    // mostrar los puntos de control en la grilla (1era grilla)
    mgPuntoControlMaestro(){
        this.pCMaestroMostrar=[];// para mostrarlo en la grilla
        //let fechaActual:Date;

        for(let puntoMaestro of this.pCArrayMaestroBD){
            //fechaActual = new Date(puntoMaestro.fechareg)
            this.pCMaestroMostrar.push({
                EmId:puntoMaestro.EmId,
                PuCoClase:puntoMaestro.PuCoClase,
                PuCoId: puntoMaestro.PuCoId,
                PuCoTiempoBus: puntoMaestro.PuCoTiempoBus,
                RuDescripcion:puntoMaestro.RuDescripcion,
                RuId: puntoMaestro.RuId,    
            });
        //onsole.log(this.pCArrayMaestroBD); //recuperado del rest
        //console.log(this.pCMaestroMostrar); //almacenado para mostrar en la grilla
        }//fin for punto control Maestro
    }// fin funcion


    //mostrar puntos de control Detalle en al grilla (2da grilla)
    mgPuntosControlDetalle (){
        //puntosControlDetalleBD
        this.pCDetalleMostrar=[];
        
        for(let puntoDetalle of this.pCArrayDetalleBD ){

            this.pCDetalleMostrar.push({
                PuCoDeId: puntoDetalle.PuCoDeId,
                PuCoId: puntoDetalle.PuCoId,
                PuCoDeLatitud: puntoDetalle.PuCoDeLatitud,
                PuCoDeLongitud: puntoDetalle.PuCoDeLongitud,
                PuCoDeDescripcion: puntoDetalle.PuCoDeDescripcion,
                PuCoDeHora: puntoDetalle.PuCoDeHora
            });

        }//fin for
    }//fin funcion

    //recuperar puntos de controldetalle por pucoID (por el ID)
    //de esta forma no se necesita actualizar la pagina para ver el resultado
    //de agregar un nuevo elemento a la lista
    getAllPuntoControlDetalleByPuCo(puCoId:number){
        this.pcontrolService.getAllPuntoControlDetalleByPuCo(puCoId).subscribe(
            data => {this.pcDetalleGrid=data; this.mgPuntosControlDetalle},
            err => {this.errorMessage=err},
            () =>this.isLoading=false
        );
    }

    
    
}
var coords={
    x:0,
    y:0
}

 var pos = {
        lat : 0,
        lng : 0 
}