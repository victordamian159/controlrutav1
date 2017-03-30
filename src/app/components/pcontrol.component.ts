import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {puntoscontrol, puntosTrazaRuta} from 'app/variables';

//para rest 
import {PuntoControlService} from '../service/pcontrol.service';

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
//maestro
     pcMaestro: any ={ 
        PuCoId : 0,
        RuId : 1,
        PuCoTiempoBus : "15",
        PuCoClase : "1",
        UsId : 0,
        UsFechaReg : ""
    }
    // para mostrar grilla con el FOR
    pcMaestroBD={
        PuCoId : 0,
        RuId : 0,
        PuCoTiempoBus : "",
        PuCoClase : "",
        UsId : 0,
        UsFechaReg : ""
    }

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
    n=0; //nro de puntos de control (guardar puntos en rest)
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

    constructor( private pcontrolService: PuntoControlService ){}

    //iniciar 
    ngOnInit(){
        this.options={
            center: new google.maps.LatLng(-18.0065679, -70.2462741),
            zoom:14
        };
        //MAESTRO
         this.getAllPuntoControlByEmRu(1,0);
        //DETALLE
         this.getAllPuntoControlDetalleByPuCo(0);
         
        //this.infoWindow = new google.maps.InfoWindow();
        //get del restservice
        /*
        this.pcontrolService.getpControlConectar().then(
            pControlDetalleServGrid => this.pControlDetalleServGrid=pControlDetalleServGrid
        ); 
        */
    }

    getAllPuntoControlByEmRu(emId: number, ruId: number){
        this.pcontrolService.getAllPuntoControlByEmRu(emId,ruId)
        .subscribe(
            data => { this.pCArrayMaestroBD = data; this.mgPuntoControlMaestro();},
                    err => {this.errorMessage = err}, 
                    () =>this.isLoading = false
            );
    }

    //click sobre el mapa y abrir modal para add Marker
    handleMapClick(event){
        //mostrar modal addmarker
        
        this.selectedPosition = event.latLng;
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
        

        //console.log(this.overlays[1]);
        //console.log(this.overlays[0]);
        /* 
        this.msgs = [];
        let isMarker = event.overlay.getTitle != undefined;
        
        if(isMarker) {
            let title = event.overlay.getTitle();
            //this.infoWindow.setContent('' + title + '');
            this.infoWindow.setContent('<div>' + title + '</div>');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
            
            this.msgs.push({severity:'info', summary:'Marker', detail: title});
        }
        else {
            this.msgs.push({severity:'info', summary:'Linea', detail: ''});
            //this.selectedPosition = event.latLng;
            //this.addmarker();
        } 
        */ 
        //this.handleOverlayClick(event)
    }

    // se agrega la ruta con un boton :S cambiar a seleccionar uno de data-table
    cargarRuta(){
        //cargando las coordenadas al array local coor
        for(this.i=0; this.i<puntosTrazaRuta.length; this.i++){
            this.coor.push( pos={ 
                    lat:puntosTrazaRuta[this.i].Latitud, 
                    lng:puntosTrazaRuta[this.i].Longitud}
                );
        }
            //cargando la ruta almacenada en la variable y mostrando
            //this.lineaRuta=[puntosRuta[0].Latitud]
            //console.log(this.coor);
        this.overlays.push(
            new google.maps.Polyline({
            path: this.coor,
            strokeColor: '#FF0000',
            strokeOpacity : 0.5,
            strokeWeight :8 
        }));
        //agregando linea para completar la ruta
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
    //funcion nueva Maestro de puntos de control
    newPuntoControlMaestro(){
        this.displayListaPuntos = true;
        //llamando serv rest nuevo punto Maestro
        this.pcontrolService.newPuntoControl()
        .subscribe(data => {this.pcMaestroRest=data});
        
        console.log("nuevo puntos control maestro");
        console.log(this.pcMaestroRest);
    }

    //guardar nuevo Maestro puntos de control
    guardarPCMaestro(){
        //console.log("guardado");
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

        //cargando en array
        this.pCArrayMaestroBD.push(this.pcMaestroBD);
        //mandando al rest
        this.pcontrolService.savePuntoControl(this.pcMaestroBD)
        .subscribe(realizar => {this.mgPuntoControlMaestro();},
                        err => {this.errorMessage=err});

        this.displayListaPuntos = false;
        //console.log(this.pCArrayMaestroBD);
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

        console.log("nuevo pt. detalle");
        console.log(this.pcDetalleRest);
    }


    //GUARDAR DETALLE PUNTO CONTROL (del modal)
    guardarPunto(){   
        
        this.newPCDetalle(); // crear un nuevo punto (REST)

        this.longpCArrayDetalleBD = this.pCArrayDetalleBD.length
        console.log(this.longpCArrayDetalleBD);

        //cargando los puntos control detalle a un array para ser mostrados
        this.pCArrayDetalleBD.splice(this.longpCArrayDetalleBD,0,
            this.pcDetalleRest={
                PuCoDeId : 0,
                PuCoId : 7,
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
        /*
        let n=0;
        while(n<this.pCArrayDetalleBD.length){
        */
            this.pcontrolService.savePuntoControlDetalle(this.pCArrayDetalleBD).

            subscribe(realizar => {this.mgPuntosControlDetalle();},
                            err => {this.errorMessage=err});

        //n++;
        //}
        console.log("guardado en rest");
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

    // mostrar los puntos de control en la grilla
    mgPuntoControlMaestro(){
        this.pCMaestroMostrar=[];// para mostrarlo en la grilla
        let fechaActual:Date;

        for(let puntoMaestro of this.pCArrayMaestroBD){
            fechaActual = new Date(puntoMaestro.fechareg)
            this.pCMaestroMostrar.push({
                PuCoId: puntoMaestro.PuCoId,
                RuId: puntoMaestro.RuId,
                PuCoTiempoBus: puntoMaestro.PuCoTiempoBus,
                PuCoClase:puntoMaestro.PuCoClase,
                UsId:puntoMaestro.UsId,
                UsFechaReg:puntoMaestro.UsFechaReg   
            });
        }//fin for punto control Maestro
    }// fin funcion


    //mostrar puntos de control Detalle en al grilla
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