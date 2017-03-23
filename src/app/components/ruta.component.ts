import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
//import {Ruta, RutaDetalle} from 'app/variables';
import {puntosTrazaRuta} from 'app/variables'
import { RutaService } from '../service/ruta.service';

declare var google: any;

@Component({
    selector:'app-ruta',
    templateUrl: '../views/ruta.component.html',
    styleUrls: ['../styles/ruta.component.css'],
    //providers:[RutaService]
})

export class RutaComponent implements OnInit{
    //objetos
    Ruta2:any;

    Ruta: any ={
        RuId : 0,
        EmId : 1,
        RuDescripcion : "",
        RuFechaCreacion:  '0-0-0',
        RuRegMunicipal : "",
        RuKilometro : 0,
        RuActivo : true,
        UsId: 0,
        UsFechaReg: '0-0-0'
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
    puntosRuta:any[]=[];
    private rutas:any=[];
    private isLoading: boolean = false;  
    private errorMessage:string='';
    private rutasPresentar:any = [];


    options: any; //cargar el mapa de google
    
    overlays:any[]=[]; //array de coordenadas de los marcadores (no se que es)
    coordenadas:any[]=[];

    listcoordenadas:any;
    buscarcoordenadas:any;

    //puntosRuta:any[]=[];
    i=0;
    j=0;
    k=0;
    l=0;
    m=1;
    n=0;//index para igualar los arrays puntosRuta & puntosTrazaRuta
    o=0;//para buscar el indice necesitado 
    p=0;//pa
    x0=0;
    y0=0;
    end=0;
    cen=0;//centinela para la busqueda
    edit_RutaTerminada=0;
    edit_RutaNoTerminada=0;
    RutaTerminada=0;
    infoWindow: any;
    dialogVisible: boolean;
    markerTitle: string;
    index : string;
    indexmovil:number;
    indexmarker:number;
    indexObjec : number;
    indexPolyline:number;
    nombreruta:string;
    selectedPosition: any;
    selectNewPosition: any;
    x=0;
    y=0;
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
        this.infoWindow = new google.maps.InfoWindow();
        //console.log(ruta);
    }

    //click sobre objeto
    handleOverClick(event) {
        this.msgs = [];
        //variable para los objetos click
        let isMarker = event.overlay.getTitle != undefined;
        //si el objeto que se hizo clic es un marcador o otra forma
        if(isMarker) {
            // mensaje si marcador es seleccionado
            //let title = event.overlay.getTitle();
            //this.infoWindow.setContent('<div>' + title + '</div>');
            //this.infoWindow.setContent("marcador :S");
            //this.infoWindow.open(event.map, event.overlay);
            //event.map.setCenter(event.overlay.getPosition());           
            //this.msgs.push({severity:'info', summary:'Marcador', detail: title});          
            //this.eliminarmarcador();
            //console.log("MARCADOR");

            //obteniendo indece de los objetos haciendo click sobre ellos
            this.indexmarker = this.overlays.indexOf(event.overlay);
            //console.log(this.overlays.indexOf(event.overlay));
            //1er marker
            if(this.indexmarker==0){ 
                this.overlays[this.indexmarker].setMap(null);
                this.overlays[this.indexmarker+2].setMap(null);
            //ultimo marker
            }else if(this.indexmarker == (this.overlays.length - 1)){
                this.overlays[this.indexmarker].setMap(null);
                this.overlays[this.indexmarker+1].setMap(null);
                this.overlays[this.indexmarker+2].setMap(null);
            //polyline a los 2 lados
            }else if(this.overlays[this.indexmarker+1]!=null && this.overlays[this.indexmarker+3]!=null){
                this.overlays[this.indexmarker].setMap(null);
                this.overlays[this.indexmarker+1].setMap(null);
                this.overlays[this.indexmarker+3].setMap(null);
            //polyline a la izq
            }else if(this.overlays[this.indexmarker+1]!=null && this.overlays[this.indexmarker+3]==null){
                this.overlays[this.indexmarker].setMap(null);
                this.overlays[this.indexmarker+1].setMap(null);
            //polyline a la der
            }else if(this.overlays[this.indexmarker+1]==null && this.overlays[this.indexmarker+3]!=null){
                this.overlays[this.indexmarker].setMap(null);
                this.overlays[this.indexmarker+3].setMap(null);
            //marker solo
            }else if(this.overlays[this.indexmarker+1]==null && this.overlays[this.indexmarker+3]==null){
                this.overlays[this.indexmarker].setMap(null);
            }
        }
        else {
            //mensaje si alguna forma es selecciona
            //this.msgs.push({severity:'info', summary:'Linea', detail: ''});
            //console.log("LINEA");
            //devuelve el index del objeto en el evento click
            //console.log(this.overlays.indexOf(event.overlay));
            this.indexPolyline=this.overlays.indexOf(event.overlay);
            this.overlays[this.indexPolyline].setMap(null);
            console.log("marker solo :S");
        }              
    }
  
    //evento arrastrar final 
    handleDragEnd(event){
        //this.selectNewPosition=event.latLng;
        //console.log(this.overlays[0].position.lng());
        //this.msgs = [];
        //this.msgs.push({severity:'info', summary:'Marker Dragged', detail: event.overlay.getPosition()});
       
        //console.log(event.overlay.getTitle());
        this.indexmovil = Number(event.overlay.getTitle());
        console.log("index marker :" + this.indexmovil);
        //poniendo otra linea en vez de la anterior

        //console.log(this.overlays[this.indexmovil+1].getPath().lat);
         //console.log(this.overlays[this.indexmovil+1].getPath().getLength());
         //posicion de los marcadores en el mapa
            //console.log(event.overlay.getPosition().lat());
            //console.log(event.overlay.getPosition().lng());
         //coordenadas de la primera linea
            //console.log(this.overlays[this.indexmovil+1].getPath().getAt( 0 ).lat());
            //console.log(this.overlays[this.indexmovil+1].getPath().getAt( 0 ).lng());
         //coordenadas de la linea extrema
            //console.log(this.overlays[this.indexmovil+1].getPath().getAt( 1 ).lat());
            //console.log(this.overlays[this.indexmovil+1].getPath().getAt( 1 ).lng());
         //ingresando las nuevas coordenadas en variables
         //this.x =  event.overlay.getPosition().lat();
         //this.y =  event.overlay.getPosition().lng();
         //console.log(this.x);
         //console.log(this.y);
         //this.overlays[this.indexmovil+1].getPath().getAt( 1 ).lat = this.x;
         //this.overlays[this.indexmovil+1].getPath().getAt( 1 ).lng = this.y;
            this.x =  event.overlay.getPosition().lat();
            this.y =  event.overlay.getPosition().lng();

            //buscnado indice del objeto ingresado por el evento click
            this.indexObjec = this.overlays.indexOf(event.overlay);

         //eliminando lineas de los marcadores arrastrados 12 casos (6 TERMINADA RUTA & 6 NO TERMINADA RUTA)
         if(this.edit_RutaNoTerminada == 1  && this.overlays.length > 1 && this.RutaTerminada == 0){
             //1er marker sin terminar ruta
                //nueva posicion del marcador
               // this.x =  event.overlay.getPosition().lat();
                //this.y =  event.overlay.getPosition().lng();
                //obteniendo indece de los objetos haciendo click sobre ellos
                //this.indexObjec = this.overlays.indexOf(event.overlay);
                
                if(this.indexObjec == 0){
                     //se guardan la nuev aposicion en los puntos para trazar la ruta
                    this.puntosRuta[0].Latitud = this.x;
                    this.puntosRuta[0].Longitud = this.y;
                    //borrar y reponer el la linea en la nueva posicion
                    this.overlays[2].setMap(null);
                    //this.overlays.length = this.overlays.length - 1;
                    this.overlays.splice(2,1,(new google.maps.Polyline({
                            path:[{lat:this.puntosRuta[0].Latitud, lng: this.puntosRuta[0].Longitud},
                                {lat:this.puntosRuta[1].Latitud, lng: this.puntosRuta[1].Longitud} ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5, strokeWeight :2 , editable: false, draggable : false 
                    })));
                }else if(this.indexObjec == (this.overlays.length - 2) ){
                    //ultimo marker sin terminar ruta
                    this.puntosRuta[this.puntosRuta.length - 1].Latitud = this.x;
                    this.puntosRuta[this.puntosRuta.length - 1].Longitud = this.y;
                    this.overlays[this.overlays.length - 1].setMap(null);
                    this.overlays.length = this.overlays.length - 1;
                    this.overlays.splice(this.overlays.length - 1,1,(new google.maps.Polyline({
                            path:[{lat:this.puntosRuta[this.puntosRuta.length - 2].Latitud, lng: this.puntosRuta[this.puntosRuta.length -2].Longitud},
                                  {lat:this.puntosRuta[this.puntosRuta.length - 1].Latitud, lng: this.puntosRuta[this.puntosRuta.length -1].Longitud} ],
                            geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight :2 , editable: false, draggable : false 
                    })));
                }else {
                    console.log(" TERMINE LA RUTA PARA EDITAR");
                }
                console.log(this.puntosRuta);
               console.log(this.puntosRuta[0]);
               console.log(this.overlays.length);
               // 2 polyline 
                // 1 polyline izq
                // 1 polyline der
                // 0 polyline
        //casos si ruta esta temrinada
         }else if(this.edit_RutaTerminada == 1  && this.overlays.length > 1 && this.RutaTerminada == 1){
            //1er marker si terminada ruta
            if(this.indexObjec == 0){
                //se guardan la nuev aposicion en los puntos para trazar la ruta
                this.puntosRuta[0].Latitud=this.x ;
                this.puntosRuta[0].Longitud=this.y ;
                //borrar y reponer el la linea en la nueva posicion
                this.overlays[2].setMap(null);
                this.overlays[this.overlays.length - 1].setMap(null);
                this.overlays.length = this.overlays.length - 1;
            
                //agregando polyline (posicion, cantidad de elementos a agregar, elemento a agregar)
                this.overlays.splice(2,1,(new google.maps.Polyline({
                        path:[{lat:this.puntosRuta[0].Latitud, lng: this.puntosRuta[0].Longitud},
                            {lat:this.puntosRuta[1].Latitud, lng: this.puntosRuta[1].Longitud} ],
                        geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight :2 , editable: false, draggable : false 
                })));

                this.overlays.push(
                    new google.maps.Polyline({
                        path:[
                            {lat:this.puntosRuta[0].Latitud, lng: this.puntosRuta[0].Longitud},
                            {lat:this.puntosRuta[this.puntosRuta.length - 1].Latitud, lng: this.puntosRuta[this.puntosRuta.length - 1].Longitud} 
                            ],
                        geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight :2 , editable: false, draggable : false 
                }));
                
              
            }else if(this.indexObjec == (this.overlays.length - 3) ){
             //ultimo marker terminada ruta
             /*
                this.puntosRuta[this.puntosRuta.length - 1].Latitud = this.x;
                this.puntosRuta[this.puntosRuta.length - 1].Longitud = this.y;
                this.overlays[this.overlays.length - 1].setMap(null);
                this.overlays.splice(this.overlays.length - 1,1,(new google.maps.Polyline({
                        path:[{lat:this.puntosRuta[this.puntosRuta.length - 2].Latitud, lng: this.puntosRuta[this.puntosRuta.length -2].Longitud},
                                {lat:this.puntosRuta[this.puntosRuta.length - 1].Latitud, lng: this.puntosRuta[this.puntosRuta.length -1].Longitud} ],
                        geodesic: true, strokeColor: '#FF0000',  strokeWeight :2 , editable: false, draggable : false 
                })));
             */
                 //ultimo marker terminada ruta
                    //se guarda la ultima posicion en array para trazar los puntos ruta
                    this.puntosRuta[this.puntosRuta.length - 1].Latitud = this.x;
                    this.puntosRuta[this.puntosRuta.length - 1].Longitud = this.y;
                    //se borran las lineas ya trazadas
                    this.overlays[this.overlays.length - 1].setMap(null);
                    this.overlays[this.overlays.length - 2].setMap(null);
                    //se insertan nuevas lineas en nueva posicion
                    this.overlays.splice(this.indexObjec +2 ,1,(new google.maps.Polyline({
                            path:[{lat:this.puntosRuta[this.puntosRuta.length - 1].Latitud, lng: this.puntosRuta[this.puntosRuta.length -1].Longitud},
                                  {lat:this.puntosRuta[0].Latitud, lng: this.puntosRuta[0].Longitud} ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));
                    //ultima linea para cerrar la ruta
                     this.overlays.splice(this.indexObjec +1,1,(new google.maps.Polyline({
                            path:[{lat:this.puntosRuta[this.puntosRuta.length - 2].Latitud, lng: this.puntosRuta[this.puntosRuta.length -2].Longitud},
                                  {lat:this.puntosRuta[this.puntosRuta.length - 1].Latitud, lng: this.puntosRuta[this.puntosRuta.length -1].Longitud} ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));
                    /*
                     this.overlays.push(
                    new google.maps.Polyline({
                        path:[
                            {lat:this.puntosRuta[this.puntosRuta.length - 1].Latitud, lng: this.puntosRuta[this.puntosRuta.length - 1].Longitud},
                            {lat:this.puntosRuta[0].Latitud, lng: this.puntosRuta[0].Longitud} 
                            ],
                        geodesic: true, strokeColor: '#01DF01', strokeOpacity: 0.5, strokeWeight :2 , editable: false, draggable : false 
                    }));*/
                console.log(this.overlays.length );    
                console.log("ultimo marcador");
                // 2 polyline a los lados ruta terminada
            }else if(    this.indexObjec==3 || this.indexObjec < this.overlays.length-2 && (this.overlays[this.indexObjec+1] != null && this.overlays[this.indexObjec+2]!= null)    ) {
                //this.indexObjec = this.overlays.indexOf(event.overlay);
                 /*
                 while(this.p<this.puntosRuta.length){
                     this.listcoordenadas = {
                         lat : this.puntosRuta[this.p].Latitud,
                         lng : this.puntosRuta[this.p].Longitud
                     }
                     this.p++;
                 }

                this.buscarcoordenadas = {
                    lat : Number(this.overlays[this.indexObjec].position.lat()),
                    lng : Number(this.overlays[this.indexObjec].position.lng())
                }*/
                console.log(this.overlays[this.indexObjec].title);
                this.o = Number(this.overlays[this.indexObjec].title);
                this.puntosRuta[this.o].Latitud  = this.x;
                 this.puntosRuta[this.o].Longitud = this.y;
                console.log("titulo"+this.o);

                //buscando indices
                //this.o=0;
                //console.log(this.puntosRuta[this.o]);
                /*
                while(this.o<this.puntosRuta.length && this.cen==0 ){
                    this.puntosRuta[this.o].Latitud  = this.x;
                    this.puntosRuta[this.o].Longitud = this.y;
                    
                    //console.log(this.o);
                    console.log(this.indexObjec);
                    console.log(this.puntosRuta[this.o].Latitud);
                    console.log(this.overlays[this.indexObjec].position.lat());
                    if((this.puntosRuta[this.o].Latitud != Number(this.overlays[this.indexObjec].position.lat()))){
                        //console.log(this.puntosRuta[this.o]);
                        //console.log(this.o);
                        this.o++;
                    }else{
                        this.cen=1;
                    }          
                    console.log(this.o);
                }*/
                
                //if( (this.puntosRuta[this.o].Latitud == this.overlays[this.indexObjec].position.lat()) && this.cen==1 ){
                if( (this.puntosRuta[this.o].Latitud == this.overlays[this.indexObjec].position.lat())  ){
                    //cargando los nuevos puntos 
                    this.overlays[this.indexObjec+1].setMap(null);
                    this.overlays[this.indexObjec+3].setMap(null);
                    //console.log("indice ingresado: "+this.indexObjec);
                    //console.log("indice puntos ruta: "+this.o);
                    //poniendo nuevas polyline en esos lugares
                    this.overlays.splice((this.indexObjec +1),1,(new google.maps.Polyline({
                            path:[  
                                    //punto movil (inicio recta)
                                    //{lat:this.puntosRuta[this.indexObjec - 3].Latitud, lng: this.puntosRuta[this.indexObjec - 3].Longitud}, 
                                    //{lat:this.puntosRuta[0].Latitud, lng: this.puntosRuta[0].Longitud},
                                    {lat:this.puntosRuta[this.o].Latitud, lng: this.puntosRuta[this.o].Longitud},
                                    //punto fijo (final recta)
                                    //{lat:Number(this.overlays[this.indexObjec + 2].position.lat()), lng: Number(this.overlays[this.indexObjec + 2].position.lng())}
                                    {lat:this.puntosRuta[this.o - 1].Latitud, lng: this.puntosRuta[this.o - 1].Longitud}
                                    ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));

                    //ultima linea para cerrar la ruta
                    this.overlays.splice(this.indexObjec +3,1,(new google.maps.Polyline({
                            path:[  
                                    //punto fijo
                                    {lat:this.puntosRuta[this.o+1].Latitud, lng: this.puntosRuta[this.o+1].Longitud},
                                    //punto movil
                                    {lat:this.puntosRuta[this.o].Latitud, lng: this.puntosRuta[this.o].Longitud} ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));
                }else{
                    console.log("nose encontro punto :c");
                }
                
                //moviendo el segundo nodo :S (otro caso)
            }else if(this.indexObjec == 1 || this.indexObjec < this.overlays.length-2 && (this.overlays[this.indexObjec+1] != null && this.overlays[this.indexObjec+2]!= null)){
                //cargando los nuevos puntos 
                this.puntosRuta[this.indexObjec - 3].Latitud = this.x;
                this.puntosRuta[this.indexObjec - 3].Longitud = this.y;

                this.overlays[this.indexObjec+1].setMap(null);
                this.overlays[this.indexObjec+3].setMap(null);
                console.log("indice ingresado: "+this.indexObjec);
                //poniendo nuevas polyline en esos lugares
                //linea antes del index marcador
                this.overlays.splice((this.indexObjec +1),1,(new google.maps.Polyline({
                        path:[  
                                //punto movil (inicio recta)
                                {lat:Number(this.overlays[this.indexObjec - 2].position.lat()), lng: Number(this.overlays[this.indexObjec - 2].position.lng())},
                                //punto fijo (final recta)
                                {lat:this.puntosRuta[this.indexObjec - 3].Latitud, lng: this.puntosRuta[this.indexObjec - 3].Longitud}
                             ],
                        geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                })));

                //ultima linea para cerrar la ruta
                this.overlays.splice(this.indexObjec +3,1,(new google.maps.Polyline({
                        path:[  
                                //punto fijo
                                {lat:Number(this.overlays[this.indexObjec + 2].position.lat()), lng: Number(this.overlays[this.indexObjec + 2].position.lng())},
                                //punto movil
                                {lat:this.puntosRuta[this.indexObjec - 3].Latitud, lng: this.puntosRuta[this.indexObjec - 3].Longitud} ],
                        geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                })));
                
                console.log(this.overlays[this.indexObjec + 2].position.lat());
                console.log(this.overlays[this.indexObjec + 2].position.lng());
                console.log(" DITAR");
                console.log(this.indexObjec );
                console.log(this.overlays.length );
                console.log(this.puntosRuta.length);
            }

            

            // 1 polyline izq
            // 1 polyline der
            // 0 polyline
         }
         
    }//fin de la funcion
     

     //evento click en el mapa
    handleMapClick(event) {
        //this.dialogVisible = true;
        
        this.selectedPosition = event.latLng;
        this.coordenadas.push(  
            Coords = {x:this.selectedPosition.lat(), 
                      y:this.selectedPosition.lng()  })
        this.addMarker();         
        //console.log(this.selectedPosition);        
    }

    //agregar marcador en el mapa

    addMarker() {
        //decidiendo el titulo(index) para marker
        this.draggable=true;

        if(this.i == 0 || this.i==1 ){
            this.markerTitle = this.i.toString();
        }else if(this.i > 1){
            this.m = this.m + 1 ;
            this.markerTitle = (this.m).toString();//3 = i(2) + 1
        }

        //poner indice a los marcadores y lineas
        this.overlays.push(new google.maps.Marker({
                        position:{lat: this.coordenadas[this.i].x,  lng: this.coordenadas[this.i].y}, 
                        title:this.markerTitle, 
                        draggable: this.draggable,}));
        
        //listando posiciones de los marcadores

        //this.markerTitle = null;
        this.dialogVisible = false;
        this.puntosRuta.push( 
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
                                  {lat: this.puntosRuta[this.i-1].Latitud, lng:this.puntosRuta[this.i-1].Longitud},
                                  {lat: this.puntosRuta[this.i].Latitud, lng:this.puntosRuta[this.i].Longitud}
                                  ],
                            geodesic: true,  strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight: 2,   editable: false,  draggable: false,
                            //title : 1
                            }),
                );  
            //console.log("overlays con lineas: "+this.overlays.length);
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
                                geodesic: true, 
                                strokeColor: '#FF0000', 
                                strokeOpacity: 0.5, 
                                strokeWeight: 2, 
                                editable: false, 
                                draggable: false
                                }),
            );
        }else{
            console.log("Termine Bien la Ruta :S");
        }
        
        this.RutaTerminada=1; //ruta esta terminada
        console.log(this.puntosRuta);
        for(this.n=0; this.n<this.puntosRuta.length; this.n++){
            puntosTrazaRuta[this.n]=  this.puntosRuta[this.n];
        }
        //this.puntosRuta=[];
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
    //activar draggable de todos los marcadores
    editar(){
        //ruta no terminada
        if(this.RutaTerminada==0){
            console.log("catherine");
            this.edit_RutaNoTerminada = 1;//si ruta ya se termino y se quiere editar
            //draggable de marker todos a true (para ser arrastrados)  del overlays
            
        }else if(this.RutaTerminada==1){
        //ruta terminada
            this.edit_RutaTerminada=1;
            console.log("katherine");
            //draggable de marker todos a true (para ser arrastrados) del overlays

        }

    }

    //agregar marcador sobre la linea

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
        this.RutaTerminada=0;
        this.puntosRuta=[];
        this.i=0;
       
        this.j=0;
        this.k=0;
        this.l=0;
        this.m=1;
        this.n=0;
        this.x0=0;
        this.y0=0;
        this.end=0;
    }

    constructor(private rutaService: RutaService){}


     newRuta(){
       this.rutaService.newRuta()
       .subscribe(
            data => {this.Ruta2 = data}
        );
     }
     
     saveRuta(){
            this.Ruta2.RuId = this.Ruta.RuId,
            this.Ruta2.EmId = this.Ruta.EmId,
            this.Ruta2.RuDescripcion = this.Ruta.RuDescripcion,
            this.Ruta2.RuFechaCreacion =  this.Ruta.RuFechaCreacion,
            this.Ruta2.RuRegMunicipal = this.Ruta.RuRegMunicipal,
            this.Ruta2.RuKilometro = this.Ruta.RuKilometro,
            this.Ruta2.RuActivo = this.Ruta.RuActivo,
            this.Ruta2.UsId = this.Ruta.UsId,
            this.Ruta2.UsFechaReg = this.Ruta.UsFechaReg
        
         //this.rutas.Id
         console.log(this.Ruta2);
         //this.rutaService.saveRuta(objRuta).then((response)=>{console.info(response);}).catch()
         this.rutaService.saveRuta
         (this.Ruta2).subscribe( realizar => { this.mostrargrillaruta();} ,
                                      err => { this.errorMessage = err });		
     }

    getAllRutaByEm(emId: number){
        this.rutaService.getAllRutaByEm(emId).subscribe(
            data => { this.rutas = data; this.mostrargrillaruta();},
                    err => {this.errorMessage = err}, 
                    () =>this.isLoading = false
            );
    }

    mostrargrillaruta(){
        this.rutasPresentar=[];
        let _valorTipo: string = "";
        let valueDate:Date;
        for(let ruta of this.rutas){
            if (ruta.EmTipo==0)
            _valorTipo="EMPRESA";
            else
            _valorTipo="CONSORCIO";
            valueDate = new Date(ruta.RuFechaCreacion)
            this.rutasPresentar.push({
                RuId : ruta.RuId,
                RuDescripcion: ruta.RuDescripcion,
                RuFechaCreacion:valueDate,
                RuKilometro: ruta.RuKilometro,
                EmConsorcio: ruta.EmConsorcio,
                EmTipo:_valorTipo
            });
        }
    }

}

var Coords ={
    x:0,
    y:0
}