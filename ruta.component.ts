import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
//import {Ruta, RutaDetalle} from 'app/variables';
import {puntosRuta} from 'app/variables'
import { RutaService } from './ruta.service';

declare var google: any;

@Component({
    selector:'app-ruta',
    templateUrl: './ruta.component.html',
    styleUrls: ['./ruta.component.css'],
    //providers:[RutaService]
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
    private rutas:any=[];
    private isLoading: boolean = false;  
    private errorMessage:string='';
    private rutasPresentar:any = [];


    options: any; //cargar el mapa de google
    
    overlays:any[]=[]; //array de coordenadas de los marcadores (no se que es)
    coordenadas:any[]=[];
    //puntosRuta:any[]=[];
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

    mapa : any;

    ngOnInit(){
         //configuracion mapa google
        this.options = {
            center: new google.maps.LatLng(-18.0065679, -70.2462741), //center: {lat: -18.0065679, lng: -70.2462741},
            zoom: 14
        };
        this.getAllRutaByEm(1);
        //console.log(ruta);
    }

    //informacion lateral superior derecho
    handleOverClick(event) {
        this.msgs = [];
        //variable para los objetos click
        let isMarker = event.overlay.getTitle != undefined;
        //si el objeto que se hizo clic es un marcador o otra forma
        if(isMarker) {
            // mensaje si marcador es seleccionado
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
            this.addMarkerInLine();
            //console.log(":s");
        }              
    }

     //evento click en el mapa
    handleMapClick(event) {
        this.dialogVisible = true;
        this.selectedPosition = event.latLng;
        this.coordenadas.push(  
            Coords = {x:this.selectedPosition.lat(), 
                      y:this.selectedPosition.lng()  })
        this.addMarker();                 
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
        puntosRuta.push( 
                            this.RutaDetalle = {
                                RuId:"11",
                                RuDeIndex:"7",
                                RuDeDescripcion:"punto",
                                Latitud:this.coordenadas[this.i].x,
                                Longitud:this.coordenadas[this.i].y,
                                UsId:"2"});   
        
        //unir puntos si hay mas de 1 marcador
        if(this.i>0){
            this.overlays.push(
                new google.maps.Polyline({
                            path:[
                                  {lat: puntosRuta[this.i-1].Latitud, lng:puntosRuta[this.i-1].Longitud},
                                  {lat: puntosRuta[this.i].Latitud, lng:puntosRuta[this.i].Longitud}
                                  ],
                            geodesic: true, 
                            strokeColor: '#FF0000', 
                            strokeOpacity: 0.5, 
                            strokeWeight: 2,
                            editable: true
                            }),
                );  
            //console.log("overlays con lineas: "+this.overlays.length);
        }

        console.log("longitud array puntos: "+puntosRuta.length);
        console.log("i: "+this.i);
        this.i++;
    }

    //terminar ruta unir primer y ultimo marker con linea
    ultimalinea(){
        if(this.overlays.length>3){
            this.end=puntosRuta.length - 1;
            this.overlays.push(
                new google.maps.Polyline({
                                path:[
                                    {lat: puntosRuta[0].Latitud, lng:puntosRuta[0].Longitud},
                                    {lat: puntosRuta[this.end].Latitud, lng:puntosRuta[this.end].Longitud}
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
        console.log(puntosRuta);
    }
    deshacer(){
        if(this.overlays.length>1 && this.RutaTerminada==0){
            this.k=puntosRuta.length;
            this.j=this.overlays.length;
            this.overlays[this.j-1].setMap(null);
            this.overlays[this.j-2].setMap(null);
            puntosRuta.pop();
            this.coordenadas.pop();
            this.i=this.i-1;
            this.overlays.length=this.overlays.length-2;
        }else if(this.overlays.length==1 && this.RutaTerminada==0){
             this.k=0;
             this.j=0;
             this.i=0;
             this.overlays[0].setMap(null);
             this.overlays.pop();
             puntosRuta.pop();
             this.coordenadas.pop();
        }else if(this.RutaTerminada==1){
            //console.log("si se puedo borrar");
            this.l=this.overlays.length;
            this.overlays[this.l-1].setMap(null);
            this.overlays.length=this.overlays.length-1;
            this.RutaTerminada=0;
        }
    }
    //activar draggable de todos los marcadores
    editar(){
        if(this.RutaTerminada==0){
            console.log("editar marker + lineas sin terminar ruta");
        }else if(this.RutaTerminada==1){
            console.log("editar marker + lineas con ruta terminada");
        }
    }

    //agregar marcador sobre la linea
    addMarkerInLine(){
        if(this.RutaTerminada==0){
            console.log("se va editar :3");
        }else if(this.RutaTerminada==1){
            console.log("se va editar :3");
        }
    }

    eliminarmarcador(){
        console.log("marcador eliminado");
        if(this.RutaTerminada==0){
            console.log("se va editar :3");
        }else if(this.RutaTerminada==1){
            console.log("se va editar :3");
        }
    }

    //zoom para el mapa
        zoomIn(map){
            map.setZoom(map.getZoom()+1);
        }
        zoomOut(map){
            map.setZoom(map.getZoom()-1);
        }
    clear(){
        this.overlays=[];
        this.coordenadas=[];
        //puntosRuta[];
        this.RutaTerminada=0;
        this.i=0;
    }

    constructor(private rutaService: RutaService){}

    getAllRutaByEm(emId: number){
        this.rutaService.getAllRutaByEm(emId).subscribe(
            data => { this.rutas = data; this.mostrargrillaruta();},
                    err => {this.errorMessage = err}, 
                    () =>this.isLoading = false
            );
        //console.log(this.rutas);
    }

    mostrargrillaruta(){
        this.rutasPresentar=[];
        //let _valorTipo: string = "";

        for(let ruta of this.rutas){
            this.rutasPresentar.push({
                RuId : ruta.RuId,
                EmId : ruta.EmId,
                RuDescripcion: ruta.RuDescripcion,
                RuFechaCreacion: ruta.RuFechaCreacion,
                RuRegMunicipal : ruta.RuRegMunicipal,
                RuKilometro: ruta.RuKilometro,
                RuActivo: ruta.RuActivo,
                UsId: ruta.UsId,
                UsFechaReg: ruta.UsFechaReg
            });
        console.log(this.rutas);//incorrecto
        console.log(this.rutasPresentar); //correcto
        }
    }

}

var Coords ={
    x:0,
    y:0
}