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
        RuDeLatitud:0,
        RuDeLongitud:0,
        RuDeOrden:0,
        RuId:0,
        UsFechaReg:"",
        UsId:0
    }
    //variables
    puntosRuta:any[]=[];
    puntosRutaDetalleArray:any[]=[];
    puntosRutaDetalle:any;

    //capturando fecha actual 
    date:any;
    anio:string;
    mes:string;
    dia:string;

    private rutas:any=[];
    private isLoading: boolean = false;  
    private errorMessage:string='';
    private rutasPresentar:any = [];
    private headertitle:string; // titulo del modal boton nuevo ruta-Maestro
    displayNuevaRutaModal: boolean = false; 
    options: any; //cargar el mapa de google
    
    overlays:any[]=[]; //array de coordenadas de los marcadores (no se que es)
    coordenadas:any[]=[];

    listcoordenadas:any;
    buscarcoordenadas:any;
    indiceRowTabla:number;
    //puntosRuta:any[]=[];
    i=0;
    j=0;
    k=0;
    l=0;
    m=1;
    n=0;//index para igualar los arrays puntosRuta & puntosTrazaRuta
    o=0;//para buscar el indice necesitado 
    p=0;//pa
    q=0;//para hacer el cambio de false a true en los marcadores
    x0=0;
    y0=0;
    end=0;
    new_x:number; //para funcion editar, crear nuevos marker
    new_y:number; //para funcion editar, crear nuevos marker
    new_index:number; //indice para nuevo marcador draggable true
    cen=0;//centinela para la busqueda
    edit_RutaTerminada=0;
    edit_RutaNoTerminada=0;
    RutaTerminada=0;
    infoWindow: any;
    dialogVisible: boolean;
    displayfromEditar : boolean = false;
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

    //recuperar registro de la fila seleccionada y mostrarlo en un modal los datos recuperados 
    //editar y luego llamar a l procedimiento para guardar en la BD 
    editarRutaMaestro(_RuId : number){
        console.log(_RuId)
        this.headertitle = "Editar";

        this.rutaService.getRutaById(_RuId).subscribe(
            data => {
                        this.Ruta=data; 
                        this.convertNumberToString();
                        console.log(this.Ruta);
                    },
            err => {this.errorMessage = err}
        );

          this.displayNuevaRutaModal = true;
        
    }   

    //convertir numero a fecha 
    convertNumberToString(){
        /*
        var myObj = $.parseJSON('{"date_created":"1273185387"}'),
            myDate = new Date(1000*myObj.date_created);
        console.log(myDate.toString());
        console.log(myDate.toLocaleString());
        console.log(myDate.toUTCString());
        alert(new Date(1273185387).toUTCString());

        var data = {"date_created":"1273185387"};
        var date = new Date(parseInt(data.date_created, 10) * 1000);
        // example representations
        alert(date);
        alert(date.toLocaleString());

        */
        console.log(this.Ruta.RuFechaCreacion);
        //let mydate = new Date(1000*this.Ruta.RuFechaCreacion.date_created);
        let mydate = new Date(this.Ruta.RuFechaCreacion);
        this.Ruta.RuFechaCreacion = mydate.getFullYear()+"-"+ mydate.getMonth() +"-"+ mydate.getDate();
        
    }

    //eliminar los registros de la tabla Ruta (MAESTRO)
    eliminarRutaMaestro(_RuId : number){
        //revisar la parte de consulta this.getAllRutaByEm(1) (buscar una variable en vez del numero 1)
        console.log(_RuId)
        this.rutaService.deleteRuta(_RuId).subscribe(
            realizar => {
                this.getAllRutaByEm(1);
            },
            err => {console.log(err);}
        );
    }

    //para editar la traza de la ruta
    editar(){
         this.displayfromEditar = false;
        //ruta no terminada
        if(this.RutaTerminada==0){
            
            this.edit_RutaNoTerminada = 1;//si ruta ya se termino y se quiere editar
            //draggable de marker todos a true (para ser arrastrados)  del overlays
            
        }else if(this.RutaTerminada==1){
            this.q=0;
            this.new_index=0;
        //ruta terminada
            this.edit_RutaTerminada=1;
           
            //draggable de marker todos a true (para ser arrastrados) del overlays
        
            //console.log(this.overlays.length);
            while( this.q<this.overlays.length && this.cen == 0){
                
                //console.log(this.q);
                if(this.q == 0){
                    
                    this.new_x=this.overlays[this.q].position.lat();
                    this.new_y=this.overlays[this.q].position.lng();
                    this.overlays[this.q].setMap(null);

                    this.overlays.splice( this.q, 1 , (new google.maps.Marker({
                        position:{lat: this.new_x, lng: this.new_y},
                        title: (this.new_index).toString(),
                        draggable:true
                    })));
                   //console.log("catherine"+this.overlays.indexOf( this.overlays[this.q]))
                   //title: (this.q).toString(),
                    //console.log(this.overlays[this.q].draggable);
                    //this.overlays[this.q].setOptions({draggable : true});
                    this.q++;  
                    this.new_index++;
                }else if(this.q>0 && (this.q<(this.overlays.length-2)) ){
                    
                    this.new_x=this.overlays[this.q].position.lat();
                    this.new_y=this.overlays[this.q].position.lng();
                    this.overlays[this.q].setMap(null);

                    this.overlays.splice( this.q, 1 , (new google.maps.Marker({
                        position:{lat: this.new_x, lng: this.new_y},
                        title: (this.new_index).toString(),
                        draggable:true
                    })));
                    
                    //console.log(this.overlays[this.q].draggable);
                    //this.overlays[this.q].setOptions({draggable : true});
                    this.q=this.q + 2;
                    this.new_index++;
                }else{
                    //console.log("no permitido"+this.q);    
                    this.cen = 1;
                }
            }//cierra while
            
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
        //console.log("index marker :" + this.indexmovil);
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
                /*
                console.log(this.puntosRuta);
               console.log(this.puntosRuta[0]);
               console.log(this.overlays.length);
                */
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

                //console.log(this.overlays.length );    
                //console.log("ultimo marcador");

            // 2 polyline a los lados ruta terminada
            }else if(    this.indexObjec>=3 && this.indexObjec < this.overlays.length-2 && (this.overlays[this.indexObjec+1] != null && this.overlays[this.indexObjec+2]!= null)    ) {
               
                 this.o = Number(this.overlays[this.indexObjec].title);
                 console.log("index: "+this.o);
                 console.log(this.puntosRuta.length);
                
                this.puntosRuta[this.o].Latitud  = this.x;
                 this.puntosRuta[this.o].Longitud = this.y;
                
                //if( (this.puntosRuta[this.o].Latitud == this.overlays[this.indexObjec].position.lat()) && this.cen==1 ){
                if( (this.puntosRuta[this.o].Latitud == this.overlays[this.indexObjec].position.lat())  ){
                    //cargando los nuevos puntos 
                    this.overlays[this.indexObjec+1].setMap(null);
                    this.overlays[this.indexObjec+3].setMap(null);
                    //console.log("indice ingresado: "+this.indexObjec);
                    //console.log("indice puntos ruta: "+this.o);
                    //poniendo nuevas polyline en esos lugares
                    //console.log("index 2: "+this.o);
                    //console.log("nro puntos ruta: "+this.puntosRuta.length);
                    //console.log("?????????????????????");
                    this.overlays.splice((this.indexObjec +3),1,(new google.maps.Polyline({
                            path:[  
                                    //punto fijo (final recta)
                                    {lat:this.puntosRuta[this.o ].Latitud, lng: this.puntosRuta[this.o].Longitud},
                                    
                                    //punto movil (inicio recta)
                                    {lat:this.puntosRuta[this.o+1].Latitud, lng: this.puntosRuta[this.o+1].Longitud}
                                    ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));

                    //ultima linea para cerrar la ruta
                    this.overlays.splice(this.indexObjec +1,1,(new google.maps.Polyline({
                            path:[  
                                    //punto movil
                                    {lat:this.puntosRuta[this.o].Latitud, lng: this.puntosRuta[this.o].Longitud},
                                    //punto fijo
                                    {lat:this.puntosRuta[this.o -1].Latitud, lng: this.puntosRuta[this.o -1].Longitud} ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));
                }else{
                    console.log("nose encontro punto :c");
                }
                
                //moviendo el segundo nodo :S (otro caso)
            }else if(this.indexObjec == 1  && (this.overlays[this.indexObjec+1] != null && this.overlays[this.indexObjec+2]!= null)){
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
                //console.log(this.overlays[this.indexObjec].title);
               

                //console.log("titulo"+this.o);

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
                //cargando los nuevos puntos 
                this.puntosRuta[this.indexObjec ].Latitud = this.x;
                this.puntosRuta[this.indexObjec ].Longitud = this.y;

                this.overlays[this.indexObjec+1].setMap(null);
                this.overlays[this.indexObjec+3].setMap(null);

                //console.log("indice ingresado: "+this.indexObjec);

                //poniendo nuevas polyline en esos lugares
                //linea antes del index marcador
                console.log(this.indexObjec);
                this.overlays.splice(this.indexObjec +1,1,(new google.maps.Polyline({
                        path:[  
                                //punto movil (inicio recta)
                                //{lat:Number(this.overlays[this.indexObjec - 2].position.lat()), lng: Number(this.overlays[this.indexObjec - 2].position.lng())},
                                {lat:this.puntosRuta[0].Latitud, lng: this.puntosRuta[0].Longitud},
                                {lat:this.puntosRuta[this.indexObjec].Latitud, lng: this.puntosRuta[this.indexObjec].Longitud}
                             ],
                        geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                })));

                //ultima linea para cerrar la ruta
                
                this.overlays.splice(this.indexObjec +3,1,(new google.maps.Polyline({
                        path:[  
                                //punto fijo (el siguiente punto al que se esta moviendo)
                                {lat:Number(this.overlays[this.indexObjec + 2].position.lat()), lng: Number(this.overlays[this.indexObjec + 2].position.lng())},
                                //punto movil
                                {lat:this.puntosRuta[this.indexObjec].Latitud, lng: this.puntosRuta[this.indexObjec].Longitud} ],
                        geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                })));
                
                /*
                console.log(this.overlays[this.indexObjec + 2].position.lat());
                console.log(this.overlays[this.indexObjec + 2].position.lng());
                console.log(" DITAR");
                console.log(this.indexObjec );
                console.log(this.overlays.length );
                console.log(this.puntosRuta.length);
                */
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
        this.draggable=false;

        if(this.i == 0 || this.i==1 ){
            this.markerTitle = this.i.toString();
        }else if(this.i > 1){
            this.m = this.m + 1 ;
            this.markerTitle = (this.m).toString();//3 = i(2) + 1
        }
        console.log("marcador: "+this.markerTitle);
        //poner indice a los marcadores y lineas
        this.overlays.push(new google.maps.Marker({
                        position:{lat: this.coordenadas[this.i].x,  lng: this.coordenadas[this.i].y}, 
                        title:this.markerTitle, 
                        draggable: this.draggable,}));
        
        //listando posiciones de los marcadores

        //this.markerTitle = null;
        this.dialogVisible = false;
        /*
        this.puntosRuta.push( 
                            this.RutaDetalle = {
                                RuId:"0",
                                RuDeOrden:"7",
                                RuDeDescripcion:"punto",
                                Latitud:this.coordenadas[this.i].x,
                                Longitud:this.coordenadas[this.i].y,
                                UsId:"2"});   
        */
        /*
        this.puntosRuta.push({
            RuDeLatitud:this.coordenadas[this.i].x,
            RuDeLongitud:this.coordenadas[this.i].y,
            RuDeOrden:0,
            RuId:0,
            UsFechaReg:"2017-04-11",
            UsId:0
        });
        */
        this.puntosRuta.push({
            RuDeLatitud:this.coordenadas[this.i].x,
            RuDeLongitud:this.coordenadas[this.i].y,
        });
        //unir puntos si hay mas de 1 marcador
        if(this.i>0){
            this.overlays.push(
                new google.maps.Polyline({
                            path:[
                                  {lat: this.puntosRuta[this.i-1].RuDeLatitud, lng:this.puntosRuta[this.i-1].RuDeLongitud},
                                  {lat: this.puntosRuta[this.i].RuDeLatitud, lng:this.puntosRuta[this.i].RuDeLongitud}
                                  ],
                            geodesic: true,  strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight: 2,   editable: false,  draggable: false,
                            //title : 1
                            }),
                );  
            //console.log("overlays con lineas: "+this.overlays.length);
        }
        /*
        console.log("longitud array puntos: "+this.puntosRuta.length);
        console.log("i: "+this.i);
        */
        this.i++;
    }

    //terminar ruta unir primer y ultimo marker con linea Y Crea el nuevo registro rutadetalle
    ultimalinea(){
        if(this.overlays.length>3){
            this.end=this.puntosRuta.length - 1;
            this.overlays.push(
                new google.maps.Polyline({
                                path:[
                                    {lat: this.puntosRuta[0].RuDeLatitud, lng:this.puntosRuta[0].RuDeLongitud},
                                    {lat: this.puntosRuta[this.end].RuDeLatitud, lng:this.puntosRuta[this.end].RuDeLongitud}
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
        //console.log(this.puntosRuta);
        //mandandolo a la variable global para ser mostrado en el modulo Puntos de Control
        for(this.n=0; this.n<this.puntosRuta.length; this.n++){
            puntosTrazaRuta[this.n]=  this.puntosRuta[this.n];
        }
        //this.puntosRuta=[];
        console.log(this.puntosRuta);
    }

    //crea una nueva ruta detalle para agregar marcadores al mapa
    nuevaRutaDetalle(){
           //crear la nueva rutadetalle
        console.log("trazar nueva ruta");
        this.rutaService.newRutaDetalle().subscribe(data=>{this.puntosRutaDetalle=data});
        
    }

    //borrar el ultimo marcador al trazar la ruta o la ultima linea que cierra la ruta 
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
    showmodalEditar(){
        this.displayfromEditar = true;
    }

    //click sobre una fila de la grilla
    onRowSelect(event){
        //obtener le ID de la fila seleccionada
        this.indiceRowTabla = event.data.RuId;
        console.log(this.indiceRowTabla);
        //console.log(this.puntosRutaDetalle);

        //limpiar el mapa
        this.overlays=[];
        this.coordenadas=[];
        this.RutaTerminada=0;
        this.puntosRuta=[];

        //CONSULTAR PUNTOS RUTADETALLE AL rest
        this.rutaService.getAllRutaDetalleByRu(this.indiceRowTabla).subscribe(
            data => {this.puntosRuta=data; this.cargarRuta();},
            err => {this.errorMessage=err},
            () => this.isLoading =false
        );
    }

    //cargar la ruta recuperada del rest haciendo el mapa
    cargarRuta(){
        /*
        this.overlays=[];
        this.coordenadas=[];
        this.RutaTerminada=0;
        this.puntosRuta=[];
        */
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
    }
    //agregar marcador sobre la linea

    //borrar el marcador 
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

    //vaciar todos los puntos
    clear(){
        this.overlays=[];
        this.coordenadas=[];
        this.RutaTerminada=0;
        this.puntosRuta=[];
        this.i=0;
        this.RutaTerminada=0;
        this.j=0;
        this.k=0;
        this.l=0;
        this.m=1;
        this.n=0;
        this.x0=0;
        this.y0=0;
        this.end=0;
        this.cen=0;
    }

    constructor(private rutaService: RutaService){}

    //Nuevo Registro Maestro
     nuevaRutaMaestro(){
        this.displayNuevaRutaModal = true;
        this.headertitle ="Nuevo";
       this.rutaService.newRuta()
       .subscribe(
            data => {this.Ruta2 = data}
        );
     }
  
     //guardar en el rest la cabecera de la ruta (MAESTRO)
     saveRutaMaestro(){
         //capturando fecha
         if(this.Ruta.RuId == 0){
             console.log("nuevo");
             this.date = new Date();
            this.dia = this.date.getDate();
            this.mes = this.date.getMonth();
            this.anio = this.date.getFullYear();
            this.Ruta.UsFechaReg = this.anio+"-"+this.mes+"-"+this.dia;

            this.Ruta2.RuId = this.Ruta.RuId,
            this.Ruta2.EmId = this.Ruta.EmId,
            this.Ruta2.RuDescripcion = this.Ruta.RuDescripcion,
            this.Ruta2.RuFechaCreacion =  this.Ruta.RuFechaCreacion,
            this.Ruta2.RuRegMunicipal = this.Ruta.RuRegMunicipal,
            this.Ruta2.RuKilometro = this.Ruta.RuKilometro,
            this.Ruta2.RuActivo = this.Ruta.RuActivo,
            this.Ruta2.UsId = this.Ruta.UsId,
            this.Ruta2.UsFechaReg = this.Ruta.UsFechaReg
         }else if(this.Ruta.RuId > 0){
             //en caso de editar

            this.nuevaRutaMaestro()
            console.log("editado");
            
         }
            
        
         console.log(this.Ruta2);
         //this.rutaService.saveRuta(objRuta).then((response)=>{console.info(response);}).catch()
         this.rutaService.saveRuta
         (this.Ruta2).subscribe( realizar => { this.mostrargrillaruta();} ,
                                      err => { this.errorMessage = err });		
     }
    
     //cancelar una nueva ruta maestro (cabecera)
     cancelRutaMaestro(){
        this.displayNuevaRutaModal=false;
        /*
        this.Ruta ={
            RuId : 0,
            EmId : 1,
            RuDescripcion : "",
            RuFechaCreacion:  '0-0-0',
            RuRegMunicipal : "",
            RuKilometro : 0,
            RuActivo : true,
            UsId: 0,
            UsFechaReg: '0-0-0'
        }*/
     }

     //capturar toda la ruta por el id (para mostrar en la grilla MAESTRO) 
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
            //condicional
            if (ruta.EmTipo==0)
            _valorTipo="EMPRESA";
            else
            _valorTipo="CONSORCIO";
            valueDate = new Date(ruta.RuFechaCreacion)
            //array para mostrar
            this.rutasPresentar.push({
                RuId : ruta.RuId,
                RuDescripcion: ruta.RuDescripcion,
                RuFechaCreacion:valueDate,
                RuKilometro: ruta.RuKilometro,
                EmConsorcio: ruta.EmConsorcio,
                EmTipo:_valorTipo
            });
        }
    }//fin mostrargrillaruta

    mgRutaDetalle(){
        //usar puntosRutaDetalle
        console.log("mostrar detalle ruta");
    }

    //guardar RutaDEtalle en la BD
    guardarPuntosRutaDetalle(){
         this.date = new Date();
            this.dia = this.date.getDate();
            this.mes = this.date.getMonth();
            this.anio = this.date.getFullYear();
            //this.Ruta.UsFechaReg = this.anio+"-"+this.mes+"-"+this.dia;

        console.log(this.puntosRuta);
        for(let n=0 ; n<this.puntosRuta.length; n++){

            this.puntosRutaDetalleArray.push({
                    RuDeLatitud:this.puntosRuta[n].RuDeLatitud,
                    RuDeLongitud:this.puntosRuta[n].RuDeLongitud,
                    RuDeOrden:n,
                    RuId:this.indiceRowTabla,
                    UsFechaReg:this.anio+"-"+this.mes+"-"+this.dia,
                    UsId:0, 
                    RuDeId:0
            });
            //this.puntosRutaDetalle[n]=this.puntosRuta;
        }
        
        console.log(this.puntosRutaDetalleArray);

        this.rutaService.saveRutaDetalle(this.puntosRutaDetalleArray)
        .subscribe(
                realizar => {this.mgRutaDetalle();},
                err => {this.errorMessage=err}
        );

        console.log("guardado en rest");
    }

}

var Coords ={
    x:0,
    y:0
}