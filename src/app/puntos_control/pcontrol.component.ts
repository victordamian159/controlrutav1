import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {puntoscontrol, puntosRuta} from 'app/variables';
declare var google: any;
@Component({
    selector:'app-pcontrol',
    templateUrl:'./pcontrol.component.html',
    styleUrls: ['./pcontrol.component.css']
})

export class PcontrolComponent implements OnInit{
     Puntocontrol={ 
        PuCoId : "1",
        RuId : "11",
        PuCoTiempoBus : "15",
        PuCoClase : "normal",
        UsId : "5",
        UsFechaReg : "2017-03-15"
    }
Puntocontroldetalle={
        PuCoDeId : "",
        PuCoId : "",
        PuCoDeLatitud : "",
        PuCoDeLongitud : "",
        PuCoDeDescripcion : "",
        PuCoDeHora : "",
        UsId : "",
        UsFechaReg : ""
    }

    options: any;
    overlays:any[]=[];
    coor:any[]=[];
    lineaRuta:any[]=[];
   
    //puntosControl:any[]=[];
    coordenadas:any[]=[];
    linea:any;
    flightPlanCoordinates:any[]=[];
    i=0;
    j=0;
    k=0;
    l=0;
    markertitle:string;
    selectedPosition:any;
    draggable:boolean;
    display:boolean;
    mapa:any;

     infoWindow: any;
     msgs: Message[] = [];

    constructor(){}

    ngOnInit(){
        this.options={
            center: new google.maps.LatLng(-18.0065679, -70.2462741),
            zoom:14
        };
        this.infoWindow = new google.maps.InfoWindow();
    }

    handleMapClick(event){
        this.selectedPosition = event.latLng;
        this.coordenadas.push(
            coords = {x:this.selectedPosition.lat(), 
                      y:this.selectedPosition.lng()}
        );
        this.addmarker();
        this.display=true;
    }


     handleOverlayClick(event) {
        console.log("click click");
    }

     handleOverClick(event){
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
        //this.handleOverlayClick(event)
    }
    // se agrega la ruta con un boton :S cambiar a seleccionar uno de data-table
    cargarRuta(){
        //cargando las coordenadas al array local coor
        for(this.i=0; this.i<puntosRuta.length; this.i++){
            this.coor.push( pos={ 
                    lat:puntosRuta[this.i].Latitud, 
                    lng:puntosRuta[this.i].Longitud}
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
        //this.markertitle="";
        this.overlays.push(new google.maps.Marker({
                position: {lat: this.coordenadas[this.j].x, lng: this.coordenadas[this.j].y},
                title:this.markertitle,
                draggable: this.draggable
        }));
        this.display = false;

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

}

var coords={
    x:0,
    y:0
}

 var pos = {
        lat : 0,
        lng : 0 
}