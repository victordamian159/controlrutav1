import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';

declare var google: any;

@Component({
    selector:'app-ruta',
    templateUrl: './ruta.component.html',
    styleUrls: ['./ruta.component.css']
})


export class RutaComponent implements OnInit{
    //objetos
     Ruta={
        RuId : "1",
        EmId : "1",
        RuDescripcion : "Empresa de Trans. Omega",
        RuFechaCreacion:  '1991-01-15',
        RuRegMunicipal : "AWD-REGTACNA 574454",
        RuKilometro : "45",
        RuActivo:"si",
        UsId:"2",
        UsFechaReg:"2017-01-10"
    }
    RutaDetalle = {
        RuId:"",
        RuDeIndex:"",
        RuDeDescripcion:"",
        Latitud:"",
        Longitud:"",
        UsId:""
    }
    //variables
    
    options: any; //cargar el mapa de google
    
    overlays:any[]=[]; //array de coordenadas de los marcadores (no se que es)
    coordenadas:any[]=[];
    puntosRuta:any[]=[];
    i=0;
    j=0;
    k=0;
    l=0;
    end=0;
    RutaTerminada=0;
    infoWindow: any;
    dialogVisible: boolean;
    markerTitle: string;
    nombreruta:string;
    selectedPosition: any;
    draggable: boolean;
    msgs: Message[] = [];

    ngOnInit(){
         //definiendo mapa google
        this.options = {
            //center: {lat: -18.0065679, lng: -70.2462741},
            center: new google.maps.LatLng(-18.0065679, -70.2462741),
            zoom: 12
        };
        //informamcion sobre la ventana del browser
        this.infoWindow = new google.maps.InfoWindow();
    }

    //informacion lateral superior derecho
    handleOverClick(event) {
        this.msgs = [];
        let isMarker = event.overlay.getTitle != undefined;
        if(isMarker) {

            // mensaje si marcador es seleccionado ,  title = titulo del marcador
            let title = event.overlay.getTitle();
            this.infoWindow.setContent('<div>' + title + '</div>');
            
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());           
            this.msgs.push({severity:'info', summary:'Marcador', detail: title});          
            this.eliminarmarcador();
        }
        else {
            //mensaje si alguna forma es selecciona
            this.msgs.push({severity:'info', summary:'Linea', detail: ''});
            //this.addMarker();
            console.log(":s");
        }              
    }

     //evento click en el mapa
    handleMapClick(event) {
        this.dialogVisible = true;
        this.selectedPosition = event.latLng;

        this.coordenadas.push(
                Coords = {
                    x:this.selectedPosition.lat(),
                    y:this.selectedPosition.lng()
                })
       this.addMarker();                 
    }
    addMarkerInLine(){

    }

    //agregar marcador en el mapa
    addMarker() {
        this.draggable=true;
        //poner indice a los marcadores y lineas
        this.overlays.push(new google.maps.Marker({
                        position:{lat: this.coordenadas[this.i].x, 
                        lng: this.coordenadas[this.i].y}, 
                        title:this.markerTitle, 
                        draggable: this.draggable,}));

        this.markerTitle = null;
        this.dialogVisible = false;
        this.puntosRuta.push( 
                        this.RutaDetalle={
                                RuId:"11",
                                RuDeIndex:"7",
                                RuDeDescripcion:"punto",
                                Latitud:this.coordenadas[this.i].x,
                                Longitud:this.coordenadas[this.i].y,
                                UsId:"2"});   
        //console.log("x: "+this.i+"="+this.coordenadas[this.i].x);
        //console.log("x: "+this.i+"="+this.puntosRuta[this.i].Latitud);
        //unir puntos si hay mas de 1 marcador
        if(this.i>0){
            this.overlays.push(
                new google.maps.Polyline({
                            path:[
                                  {lat: this.puntosRuta[this.i-1].Latitud, lng:this.puntosRuta[this.i-1].Longitud},
                                  {lat: this.puntosRuta[this.i].Latitud, lng:this.puntosRuta[this.i].Longitud}
                                  ],
                            geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2
                            }),
                );  
            console.log("overlays con lineas: "+this.overlays.length);
        }

        console.log("longitud array puntos: "+this.puntosRuta.length);
        console.log("i: "+this.i);
        this.i++;
    }

    //terminar ruta unir primer y ultimo marker con linea
    ultimalinea(){
        if(this.overlays.length>3){
            this.end=this.puntosRuta.length - 1;
            this.overlays.push(
                new google.maps.Polyline({
                                path:[
                                    {lat: this.puntosRuta[0].Latitud, lng:this.puntosRuta[0].Longitud},
                                    {lat: this.puntosRuta[this.end].Latitud, lng:this.puntosRuta[this.end].Longitud}
                                    ],
                                geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2
                                }),
            );
        }else{
            console.log("Termine Bien la Ruta :S");
        }
        
        //console.log("ultima linea: i = "+this.i);
        //console.log(this.puntosRuta[this.i-1].RuId);
        this.RutaTerminada=1; //ruta esta terminada
        console.log(this.puntosRuta);
    }
    deshacer(){
        if(this.overlays.length>1 && this.RutaTerminada==0){
            this.k=this.puntosRuta.length;
            this.j=this.overlays.length;
            this.overlays[this.j-1].setMap(null);
            this.overlays[this.j-2].setMap(null);
            this.puntosRuta.pop();
            this.coordenadas.pop();
            this.i=this.i-1;
            this.overlays.length=this.overlays.length-2;
        }else if(this.overlays.length==1 && this.RutaTerminada==0){
             this.k=0;
             this.j=0;
             this.i=0;
             this.overlays[0].setMap(null);
             this.overlays.pop();
             this.puntosRuta.pop();
             this.coordenadas.pop();
        }else if(this.RutaTerminada==1){
            //console.log("si se puedo borrar");
            this.l=this.overlays.length;
            this.overlays[this.l-1].setMap(null);
            this.overlays.length=this.overlays.length-1;
            this.RutaTerminada=0;
        }
    }
    editar(){
        console.log("se va editar :3");
    }
    eliminarmarcador(){
        console.log("marcador eliminado");
    }
    zoomIn(map){
        map.setZoom(map.getZoom()+1);
    }
    zoomOut(map){
        map.setZoom(map.getZoom()-1);
    }
    clear(){
        this.overlays=[];
        this.coordenadas=[];
        this.puntosRuta=[];
        this.RutaTerminada=0;
        this.i=0;
    }
}

var Coords ={
    x:0,
    y:0
}