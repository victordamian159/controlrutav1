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
    _RuId:number;
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
    editando=1; //editado = 1 (se esta editando)  editando = 0 (no se esta editando)
    new_x:number; //para funcion editar, crear nuevos marker
    new_y:number; //para funcion editar, crear nuevos marker
    new_index:number; //indice para nuevo marcador draggable true
    cen=0;//centinela para la busqueda
    edit_RutaTerminada=0;
    edit_RutaNoTerminada=0;
    RutaTerminada=0;
    infoWindow: any;
    //dialogVisible: boolean;
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

    //HABILITAR O DESAHILITAR BOTONES
    disButEditar:boolean=true;
    disButTerminarRuta:boolean=true;
    disButSubirRuta:boolean=true;
    disButDeshacer:boolean=true;
    disButNuevaRuta:boolean=true;
    disButBorrar:boolean=true;

    //VARIABLE PARA COMPROBAR SI SE RECUPERO UNA RUTA DESDE LA BD (PARA 
    //RECUPERAR LOS PUNTOS Y PODER TRAZAR LA RUTA CON MARKER Y LINEAS EDITAR LA RUTA)
    //(NO ESTA EN USO ALTERNATIVA CON EL TAMAÑO DEL ARRAY DE PUNTOCONTROL)
    rutaRecuperada: number = 1; // 1:RUTA RECUPERADA DE LA BD     0: RUTA NO RECUPERADA (VACIO) NUEVA TRAZA RUTA 
    
    //PARA ACTIVAR O DESACTIVAR EL AGREGAR MARCADORES AL MAPA
    activarAddMarker:number =0; // 1 : ADDMARKER ACTIVADO   0 : ADDMARKER  DESACTIVADO
    modRegistro=0; // 1: registro terminado     0: registro no terminado

//FUNCIONES
    ngOnInit(){
         //configuracion mapa google
        this.options = {
            center: new google.maps.LatLng(-18.0065679, -70.2462741), //center: {lat: -18.0065679, lng: -70.2462741},
            zoom: 14
        };
        this.getAllRutaByEm(1);
        this.infoWindow = new google.maps.InfoWindow();
        this.activarAddMarker = 0; //addmarker desactivado
        
         
        //CONTROLAR LA SELECCION DE FILAS EN LA GRILLA, DESACTIVAR HASTA Q SE TERMINE DE GUARDAR LA MODIFICACION O NUEVO REGISTRO
        this.modRegistro=1; //ACTIVANDO LA SELECCION DE REGISTRO MAESTRO --seleccionar regisrtos activado
    }

    //click sobre objeto
    handleOverClick(event) {
        console.log("click =D");
        /*
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
        */       
    } //FIN FUNCION handleOverClick

    //recuperar registro de la fila seleccionada y mostrarlo en un modal los datos recuperados 
    //editar y luego llamar a l procedimiento para guardar en la BD 
    editarRutaMaestro(_RuId : number){
        console.log(_RuId)
        this._RuId = _RuId;
        this.headertitle = "Editar";

        //consulta para recuperar datos deacuerdo a la _RuId
        this.rutaService.getRutaById(_RuId).subscribe(
            data => {
                        this.Ruta=data; 
                        this.convertNumberToString();
                        console.log(this.Ruta);
                    },
            err => {this.errorMessage = err}
        );

          this.displayNuevaRutaModal = true;
           //borrando los campos de la vairable puntosRUta para que al momento de crear uno nuevo los campos estes vacios para ser llenados
        //this.Ruta={};
    }   

    //convertir numero a string (FECHAS) 
    convertNumberToString(){
       
        console.log(this.Ruta.RuFechaCreacion);
        //let mydate = new Date(1000*this.Ruta.RuFechaCreacion.date_created);
        let mydate = new Date(this.Ruta.RuFechaCreacion);
        let userCreateDate = new Date(this.Ruta.UsFechaReg);

        console.log(userCreateDate);
        let userDia = userCreateDate.getDate();
        let userMes = userCreateDate.getMonth();
        let userAnio = userCreateDate.getFullYear();
        console.log(userDia, userMes, userAnio);

        /*
        console.log(typeof(mydate));
        console.log(typeof(mydate.getMonth));
        this.Ruta.RuFechaCreacion = mydate.getFullYear()+"-0"+mydate.getMonth()+"-"+mydate.getDate();
        */
        console.log(typeof(this.Ruta.RuFechaCreacion));
        let dia= Number(mydate.getDate());
        let mes= Number(mydate.getMonth());
        let anio=mydate.getFullYear().toString();

        console.log(dia);
        console.log(mes);
        console.log(anio);
        //aumentando el dia y mes en un numero
        let _dia = dia;
        let _mes = mes +1
        //convirtiendo a cadena
        let s_dia = _dia.toString();
        let s_mes = _mes.toString();

        //adecuar la fecha para q tenga el dia y mes 2 digitos 1 => 01 (PARA EL MES Y EL DIA)
        if( ( 10<=_mes )  &&  ( 10<=_dia ) ){
            this.Ruta.RuFechaCreacion = anio+"-"+s_mes+"-"+s_dia;

            }else if(( 0<=_mes && _mes<10 )  &&  ( 10<=_dia )){
                this.Ruta.RuFechaCreacion = anio+"-0"+ s_mes +"-"+s_dia;

            }else if(( 10<=_mes )  &&  ( 0<=_dia && _dia<10 )){
                this.Ruta.RuFechaCreacion = anio+"-"+ s_mes +"-0"+ s_dia;

            }else if(( 0<=_dia && _dia<10 ) && ( 0<=_mes && _mes<10 )){
                this.Ruta.RuFechaCreacion = anio+"-0"+ s_mes +"-0"+s_dia;
        }
        
        
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

        /*
        //ACTIVANDO DESACTIVANDO BOTONES
        this.disButDeshacer=false; //HABILITANDO BOTON PARA DESHACER RUTA 
        this.disButEditar=false; //HABILITANDO BOTON PARA EDITAR LA RUTA (RUTA RECUPERADA)
       this.disButBorrar=false;
       */

       this.editando = 1; // se esta editando
       
        console.log("tamaño overlays: "+this.overlays.length);
        console.log("buscando error: ");
        console.log(this.overlays);
        console.log("this.rutaRecuperada ="+this.rutaRecuperada);
        console.log("separador");
         //CUATRO CASOS PARA EDITAR 

        //SI EXISTEN PUNTOS EN EL ARRAY PUNTOSRUTA -> SE PUEDE EDITAR 
        // rutaRecuperada = 0 -> la ruta no esta en la BD ( NUEVA TRAZA)
        //ESTA ES PARA UNA RUTA RECIEN CREADA (NO ESTA EN LA BD)
        if(this.rutaRecuperada == 0  ){
            //caso de ruta no terminada que no esta en la BD
            if(this.RutaTerminada==0){
                //caso de ruta no terminada
                this.edit_RutaNoTerminada = 1;//si ruta ya se termino y se quiere editar
                //draggable de marker todos a true (para ser arrastrados)  del overlays
            }else if(this.RutaTerminada==1){
            //caso de ruta terminada    que no esta en la BD 
                this.q=0; // q son los indices de los marcadores
                this.new_index=0;//title del marker comienza por 0 
                this.edit_RutaTerminada=1;
                console.log(this.overlays.length);

                //draggable de marker todos a true (para ser arrastrados) del overlays
                while( this.q<this.overlays.length-1){
                    console.log("el valor de q es :"+this.q)
                    //console.log(this.overlays[this.q]);
                    console.log("tamaño overlays: "+this.overlays.length);
                    console.log("buscando error: ");
                    console.log(this.overlays);
                    console.log("separador");

                    // si q = 0 (es el primer marcador)
                    if(this.q == 0 || this.q ==1){
                        this.new_x=this.overlays[this.q].position.lat();
                        this.new_y=this.overlays[this.q].position.lng();
                        this.overlays[this.q].setMap(null);

                        this.overlays.splice( this.q, 1 , (new google.maps.Marker({
                            position:{lat: this.new_x, lng: this.new_y},
                            title: (this.new_index).toString(),
                            draggable:true
                        })));
                        this.q++; //aumento en uno q (para pasar al marcador 1)
                        this.new_index++; //title (indice del marker) aumenta en 1
                        
                    // si q>0 entonces son los demas marcadores    
                    }else if(this.q == 2){
                        this.q++;
                    //}else if(this.q>2 && (this.q<(this.overlays.length-2)) ){
                    }else if(this.q>2){
                        this.new_x=this.overlays[this.q].position.lat();
                        this.new_y=this.overlays[this.q].position.lng();
                        this.overlays[this.q].setMap(null);

                        this.overlays.splice( this.q, 1 , (new google.maps.Marker({
                            position:{lat: this.new_x, lng: this.new_y},
                            title: (this.new_index).toString(),
                            draggable:true
                        })));
                        //los marcadores son todos los que tiene posicion impar en el array 0,1,3
                        this.q=this.q + 2;
                        this.new_index++;
                    }
                }//cierra while
                console.log(this.overlays); // mostrar el marcador en consola
            }

        //LA RUTA ESTA EN LA BD Y SOLO SE MUESTRA UNA LINEA(TRAZA DE LA RUTA) 
        //FALTA TERMINAR SU PROGRAMACION 
        //AGREGANDO MARCADORES Y LINEAS COMO CORRESPONDE 0,1,3,5...(IMPARES-- PARA MARKER) 2,4,6,8...(PARES--LINEAS) EN EL OVERLAYS
        }else if(this.rutaRecuperada == 1){
            this.i= this.puntosRuta.length -1;
            console.log("i: "+this.i);
            console.log("editar una ruta que esta en la bd");
            this.disButEditar=true;
            this.disButBorrar=false;
            console.log(this.puntosRuta);
            
            //LIMPIANDO OBJETOS
            //this.overlays=[];
            this.coordenadas=[];
            //this.RutaTerminada=0;
            //this.puntosRuta=[];
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

            this.overlays[0].setMap(null);//BORRANDO LINEA RUTA, FALTA ELIMINAR LA LINEA DE CIERRE DE RUTA
            this.overlays=[]; //VACIANDO LOS OBJETOS
            
            //PARA MONITOREAR A VER SI NO OCURRE ERRORES
            console.log("antes OVERLAYS");
            console.log(this.overlays.length);
            console.log(this.overlays);
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&");
            
            //AGREGANDO MARCADORES, OBTENIENDO COORDENADAS DE LOS PUNTOS RECUPERADOS (PUNTOSRUTA) DE LA BD
            let n:number=0;

            //1ero LOS MARCADORES
            while(n<this.puntosRuta.length){
                if(n==0 || n==1){ //primeros marcadores
                     this.overlays.push(new google.maps.Marker({
                                position:{lat: this.puntosRuta[n].RuDeLatitud,  lng: this.puntosRuta[n].RuDeLongitud}, 
                                title:n.toString(), // el n no puede ser titulo
                                draggable: true,}));

                    if(n==1){ //si esta el segundo marcador se crea su linea
                        this.overlays.push(new google.maps.Polyline({
                                path:[{lat: this.puntosRuta[n-1].RuDeLatitud,   lng:this.puntosRuta[n-1].RuDeLongitud},
                                      {lat: this.puntosRuta[n].RuDeLatitud,     lng:this.puntosRuta[n].RuDeLongitud}],
                                geodesic: true,  strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight: 2,   editable: false,  draggable: false
                        }));
                    }            
                    n++;

                     
                }else if(this.overlays.length%2==0){ //tamaño overlays:  par --->  lineas
                    //TRAZANDO LINEAS
                    
                    this.overlays.push(new google.maps.Polyline({
                                path:[{lat: this.puntosRuta[n-1].RuDeLatitud,   lng:this.puntosRuta[n-1].RuDeLongitud},
                                      {lat: this.puntosRuta[n].RuDeLatitud,     lng:this.puntosRuta[n].RuDeLongitud}],
                                geodesic: true,  strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight: 2,   editable: false,  draggable: false
                    }));

                    //console.log("n = "+n);
                    console.log("tamaño overlay (lineas): "+this.overlays.length);
                    n++;

                }else if(this.overlays.length%2==1 ){ //n impar --->  markers
                    //marcadores posicion impar
                    //poner indice a los marcadores y lineas
                    
                    this.overlays.push(new google.maps.Marker({
                                    position:{lat: this.puntosRuta[n].RuDeLatitud,  lng: this.puntosRuta[n].RuDeLongitud}, 
                                    title:n.toString(), 
                                    draggable: true,}));
                    //console.log("n = "+n);
                    console.log("tamaño overlay (marker): "+this.overlays.length);
                    //n++;
                }

            }//FIN WHILE

           this.ultimalinea();

            console.log("DESPUES");
            console.log(this.overlays.length);
            console.log(this.overlays);
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&");

        }
        
        
        //DESACTIVANDO EL BOTON EDITAR PARA QUE NO ESTE ACTIVO AL MODIFICAR LA RUTA
        //ACTIVANDO & DESACTIVANDO
        this.disButBorrar = false;
        this.disButDeshacer = false;
        this.disButNuevaRuta = true;
        this.disButSubirRuta = false;
        this.disButTerminarRuta = true;
        this.disButEditar = true; 

        this.activarAddMarker = 0;//addmarker desactivado
        this.modRegistro=0;    //select row grilla desactivado

        //condicionales para activar el arrastre de markers
        this.edit_RutaTerminada = 1; 
        this.RutaTerminada = 1; //LA RUTA ESTA TERMINADA

        console.log("valor this.edit_RutaNoTerminada = "+this.edit_RutaNoTerminada);
        console.log("valor this.overlays.length = "+this.overlays.length);
        console.log("valor this.RutaTerminada = "+this.RutaTerminada);
        //ENCONTRARDO EL ERRORES
          //if(this.edit_RutaNoTerminada == 1  && 
          //this.overlays.length > 1 && 
          //this.RutaTerminada == 0){

            //if(this.edit_RutaTerminada == 1  
            //&& this.overlays.length > 1 && 
            //this.RutaTerminada == 1){
 
}


    //evento arrastrar final  -- ARRASTRAR LOS MARCADORES
    handleDragEnd(event){
        console.log("arrastrando marker =D");
        console.log("longitud overlays: "+this.overlays.length);
        this.indexmovil = Number(event.overlay.getTitle());//CONVIRTIENDO TITLE MARKER A NUMERICO

            //EXTRAYENDO LATITUD Y LOGITUD DE MARCADOR ARRASTRADO
            this.x =  event.overlay.getPosition().lat();
            this.y =  event.overlay.getPosition().lng();

            this.indexObjec = this.overlays.indexOf(event.overlay); //BUSCANDO EL INDICE DEL OBJETO ARRASTRADO 
            console.log("indice marcador: "+this.indexObjec);

         //eliminando lineas de los marcadores arrastrados 12 casos (6 TERMINADA RUTA & 6 NO TERMINADA RUTA)
         //CASO EDITAR RUTA NO TERMINADA
         if(this.edit_RutaNoTerminada == 1  && this.overlays.length > 1 && this.RutaTerminada == 0){
             //1er marker sin terminar ruta CASO SI RUTA NO ESTA TERMINADA
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
        //CASOS SI RUTA ESTA TERMINADA
         }else if(this.edit_RutaTerminada == 1  && this.overlays.length > 1 && this.RutaTerminada == 1){
            console.log("CASSARETO");
            //1er marker si terminada ruta
            if(this.indexObjec == 0){
                //se guardan la nuev aposicion en los puntos para trazar la ruta
                this.puntosRuta[0].RuDeLatitud=this.x ;
                this.puntosRuta[0].RuDeLongitud=this.y ;
                //borrar y reponer el la linea en la nueva posicion
                this.overlays[2].setMap(null); // BORRA PRIMERA LINEA (INDEX 2)
                this.overlays[this.overlays.length - 1].setMap(null); //BORRA ULTIMA LINEA (LINEA QUE CIERRA LA RUTA)
                
                //SE REDUCE EN UNO LA LONGITUD PARA EVITAR QUE CREESCA EL ARRAY, CON SETMAP(NULL) SOLO SE BORRA 
                //DEL ARRAY PERO CASILLERO NO SE ELIMINAR SIGUE AHI Y SE TIENE Q ELIMINAR REDUCIENDO LA LONGITUD PARA 
                //XQ LA ULTIMA LINEA SE CREA AL FINAL DEL ARRAY OVERLAYS
                this.overlays.length = this.overlays.length - 1; 
                
                //agregando polyline (posicion, cantidad de elementos a agregar, elemento a agregar)
                //AGREGANDO LINEA EN LA POSICION 2 DEL ARRAY OVERLAYS
                this.overlays.splice(2,1,(new google.maps.Polyline({
                        path:[{lat:this.puntosRuta[0].RuDeLatitud, lng: this.puntosRuta[0].RuDeLongitud},
                            {lat:this.puntosRuta[1].RuDeLatitud, lng: this.puntosRuta[1].RuDeLongitud} ],
                        geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight :2 , editable: false, draggable : false 
                })));

                //AGREGANDO LA ULTIMA LINEA (CERRAR RUTA) EN EL ARRAY OVERLAYS
                this.overlays.push(
                    new google.maps.Polyline({
                        path:[{lat:this.puntosRuta[0].RuDeLatitud,                        lng: this.puntosRuta[0].RuDeLongitud},
                            {lat:this.puntosRuta[this.puntosRuta.length - 1].RuDeLatitud, lng: this.puntosRuta[this.puntosRuta.length - 1].RuDeLongitud} ],
                        geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight :2 , editable: false, draggable : false 
                }));
                console.log("longitud overlays 1er marker: "+this.overlays.length);

            //CASO -> ULTIMO MARCADOR (MARCADOR DENTRO DEL ARRAY OVERLAYS)
            }else if(this.indexObjec == (this.overlays.length - 3) ){
             //ultimo marker terminada ruta
                    //se guarda la ultima posicion en array para trazar los puntos ruta (SE ACTUALIZA EL ULTIMO PUNTO CON LAS NUEVAS COORDENADAS)
                    this.puntosRuta[this.puntosRuta.length - 1].RuDeLatitud = this.x;
                    this.puntosRuta[this.puntosRuta.length - 1].RuDeLongitud = this.y;
                    console.log("longitud overlays ultimo marker: "+this.overlays.length);
                    //se borran las lineas ya trazadas
                    this.overlays[this.overlays.length - 1].setMap(null);//LINEA QUE CIERRA RUTA
                    this.overlays[this.overlays.length - 2].setMap(null);//LINEA SEGUNDA AL ULTIMO MARCADOR

                    //se insertan nuevas lineas en nueva posicion
                    //SE INSERTA NUEVA LINEA ENTRE EL PRIMER Y ULTIMO MARCADOR 
                    this.overlays.splice(this.indexObjec +2 ,1,(new google.maps.Polyline({
                            path:[{lat:this.puntosRuta[this.puntosRuta.length - 1].RuDeLatitud, lng: this.puntosRuta[this.puntosRuta.length -1].RuDeLongitud},
                                  {lat:this.puntosRuta[0].RuDeLatitud,                          lng: this.puntosRuta[0].RuDeLongitud} ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));

                    //ultima linea para cerrar la ruta
                    //SE INSERTA NUEVA LINEA ENTRE EL ULTIMO MARCADOR  Y PRIMER
                     this.overlays.splice(this.indexObjec +1,1,(new google.maps.Polyline({
                            path:[{lat:this.puntosRuta[this.puntosRuta.length - 2].RuDeLatitud, lng: this.puntosRuta[this.puntosRuta.length -2].RuDeLongitud},
                                  {lat:this.puntosRuta[this.puntosRuta.length - 1].RuDeLatitud, lng: this.puntosRuta[this.puntosRuta.length -1].RuDeLongitud} ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));
                    
            // 2 polyline a los lados ruta terminada
            }else if(  this.indexObjec>=3 && (this.indexObjec < this.overlays.length-4) ){
                 //RECUPERANDO EL INDICE (TITLE) DEL MARCADOR PARA RECUPERAR LAS COORDENADAS DEL MARCADOR ANTERIOR Y SIGUIENTE
                 this.o = Number(this.overlays[this.indexObjec].title);// o : indice (title) del marcador dentro del array de puntos

                this.puntosRuta[this.o].RuDeLatitud  = this.x;
                this.puntosRuta[this.o].RuDeLongitud = this.y;
                
               //ENCONTRAR LA POSICION DEL PUNTODECONTROL EN EL ARRAY OVERLAYS
               //CAMBIAR LA CONDICIONAL PARA USAR EL TITLE DEL MARKER Y EL CAMPO ORDEN DEL OBJETO PUNTOCONTROL(DETALLE)
                if( (this.puntosRuta[this.o].RuDeLatitud == this.overlays[this.indexObjec].position.lat())  ){
                    console.log(this.puntosRuta[this.o]);
                    console.log(this.overlays[this.indexObjec]);

                    this.overlays[this.indexObjec+1].setMap(null);
                    this.overlays[this.indexObjec+3].setMap(null);
                    
                    this.overlays.splice((this.indexObjec +3),1,(new google.maps.Polyline({
                            path:[  
                                    //punto fijo (final recta)
                                    {lat:this.puntosRuta[this.o ].RuDeLatitud, lng: this.puntosRuta[this.o].RuDeLongitud},
                                    
                                    //punto movil (inicio recta)
                                    {lat:this.puntosRuta[this.o+1].RuDeLatitud, lng: this.puntosRuta[this.o+1].RuDeLongitud}
                                    ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));

                    //ultima linea para cerrar la ruta
                    this.overlays.splice(this.indexObjec +1,1,(new google.maps.Polyline({
                            path:[  
                                    //punto movil
                                    {lat:this.puntosRuta[this.o].RuDeLatitud, lng: this.puntosRuta[this.o].RuDeLongitud},
                                    //punto fijo
                                    {lat:this.puntosRuta[this.o -1].RuDeLatitud, lng: this.puntosRuta[this.o -1].RuDeLongitud} ],
                            geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                    })));
                }else{
                    console.log("nose encontro punto :c");
                }
                
            }else if(this.indexObjec == 1  && (this.overlays[this.indexObjec+1] != null && this.overlays[this.indexObjec+2]!= null)){
               //MOVIENDO EL SEGUNDO MARCADOR (OTRO CASO)
                //cargando los nuevos puntos 
                this.puntosRuta[this.indexObjec ].RuDeLatitud = this.x;
                this.puntosRuta[this.indexObjec ].RuDeLongitud = this.y;

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
                                {lat:this.puntosRuta[0].RuDeLatitud, lng: this.puntosRuta[0].RuDeLongitud},
                                {lat:this.puntosRuta[this.indexObjec].RuDeLatitud, lng: this.puntosRuta[this.indexObjec].RuDeLongitud}
                             ],
                        geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                })));

                //ultima linea para cerrar la ruta
                this.overlays.splice(this.indexObjec +3,1,(new google.maps.Polyline({
                        path:[  
                                //punto fijo (el siguiente punto al que se esta moviendo) (BUSCAR CAMBIAR ESTO)
                                {lat:Number(this.overlays[this.indexObjec + 2].position.lat()), lng: Number(this.overlays[this.indexObjec + 2].position.lng())},
                                //punto movil
                                {lat:this.puntosRuta[this.indexObjec].RuDeLatitud, lng: this.puntosRuta[this.indexObjec].RuDeLongitud} ],
                        geodesic: true, strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight :2 , editable: false, draggable : false 
                })));
            }
         }
         
    }//fin handleDragEnd
     

    //CLICK SOBRE EL MAPA -- EN ESTE CASO PARA AGREGAR MARCADORES SOBRE EL MAPA
    handleMapClick(event) {
        if(this.activarAddMarker == 1){//addmarker activado
            this.selectedPosition = event.latLng;
            this.coordenadas.push(  
                Coords = {x:this.selectedPosition.lat(), 
                        y:this.selectedPosition.lng()  })
            this.addMarker();         
            this.disButSubirRuta=true;//desactivar boton subirRuta, se activara cuando se pulse el boton terminarRuta 

        }else if(this.activarAddMarker == 0){//addmarker desactivado
            console.log("no se puede hacer click sobre el mapa, addmarker desactivado");
        }
    }//fin funcion handleMapClick CLICK SOBRE EL MAPA

    //agregar marcador en el mapa
    addMarker(){
        if(this.activarAddMarker == 1){//addMarker esta activada
                console.log("i: "+this.i); //indice del marcador agregado
            
                this.draggable=false;
                //decidiendo el titulo(index) para marker
                if(this.i == 0 || this.i==1 ){
                    this.markerTitle = this.i.toString();
                }else if(this.i > 1){
                    this.m = this.m + 1 ;
                    this.markerTitle = (this.m).toString();//3 = i(2) + 1
                }
                console.log("marcador: "+this.markerTitle);

                //poner indice a los marcadores y lineas
                if(this.editando == 1){ //en estado de editar
                    this.overlays.push(new google.maps.Marker({
                                position:{lat: this.coordenadas[this.i].x,  lng: this.coordenadas[this.i].y}, 
                                title:this.markerTitle, 
                                draggable: true,}));
                }else if(this.editando == 0){ //no en estado de editar 
                    this.overlays.push(new google.maps.Marker({
                                position:{lat: this.coordenadas[this.i].x,  lng: this.coordenadas[this.i].y}, 
                                title:this.markerTitle, 
                                draggable: this.draggable,}));
                }
                
                
                //listando posiciones de los marcadores
                //this.dialogVisible = false;
                
                //AGREGARNDO LAS COORDENADAS DE LOS MARCADORES AL ARRAY PARA TRAZAR LA RUTA
                this.puntosRuta.push({
                    RuDeLatitud:this.coordenadas[this.i].x,
                    RuDeLongitud:this.coordenadas[this.i].y
                });

                //unir puntos si hay mas de 1 marcador (LINEA ENTRE MARCADORES)
                if(this.i>0){
                    this.overlays.push(
                        new google.maps.Polyline({
                                    path:[{lat: this.puntosRuta[this.i-1].RuDeLatitud, lng:this.puntosRuta[this.i-1].RuDeLongitud},
                                        {lat: this.puntosRuta[this.i].RuDeLatitud, lng:this.puntosRuta[this.i].RuDeLongitud}],
                                    geodesic: true,  strokeColor: '#FF0000',  strokeOpacity: 0.5,  strokeWeight: 2,   editable: false,  draggable: false,
                                    //title : 1
                                    }),
                        );  
                }
                this.i++;

                //HABILITANDO BOTONES DEL MAPA
                this.disButBorrar=false;
                this.disButDeshacer=false;
                this.disButSubirRuta=false;
                this.disButTerminarRuta=false;

        }else if(this.activarAddMarker == 0){//addmarker esta desactivado
            //ABRIR UNA VENTA QUE DIGA QUE NO SE PUEDE AGREGAR MARCADORES
            console.log("no se puede agregar marcadores");
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
    }

    //terminar ruta unir primer y ultimo marker con linea Y Crea el nuevo registro rutadetalle
    ultimalinea(){
        if(this.overlays.length>3){
            this.end=this.puntosRuta.length - 1;
            this.overlays.push( new google.maps.Polyline({
                                path:[{lat: this.puntosRuta[0].RuDeLatitud, lng:this.puntosRuta[0].RuDeLongitud},
                                    {lat: this.puntosRuta[this.end].RuDeLatitud, lng:this.puntosRuta[this.end].RuDeLongitud}],
                                geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2, editable: false, draggable: false}),);
        }else{
            console.log("Termine Bien la Ruta :S");
        }
        this.RutaTerminada=1; //ruta esta terminada
        
        console.log(this.puntosRuta);
        console.log("tamaño overlays: "+this.overlays.length);
        console.log("buscando error: ");
        console.log(this.overlays);
        console.log("separador de resultados");
        //DESAHILITAR BOTONES EN CASO DE HABER TERMINADO LA RUTA
        this.disButEditar=false;    //  B H
        this.disButDeshacer=true;   //  B DH
        this.disButNuevaRuta=true;  //  B DH
        this.disButSubirRuta=false; //  B H
        this.disButTerminarRuta=true;//  B DH
        this.disButBorrar=true;     //  B DH
        
        //DESACTIVAR ADDMARKER
        this.activarAddMarker = 0;

        this.editando = 0; //no se esta editando ,  ruta terminada
    }

  
    //borrar el ultimo marcador al trazar la ruta o la ultima linea que cierra la ruta 
    deshacer(){
        //ruta no terminada y objetos mayor a 1
        if(this.overlays.length>1 && this.RutaTerminada==0){
            this.k=this.puntosRuta.length;
            this.j=this.overlays.length;
            this.overlays[this.j-1].setMap(null);
            this.overlays[this.j-2].setMap(null);
            this.puntosRuta.pop();
            this.coordenadas.pop();
            this.i=this.i-1;
            this.overlays.length=this.overlays.length-2;
        //ruta no terminada y solo hay marcador 
        }else if(this.overlays.length==1 && this.RutaTerminada==0){
             this.k=0;
             this.j=0;
             this.i=0;
             this.overlays[0].setMap(null);
             this.overlays.pop();
             this.puntosRuta.pop();
             this.coordenadas.pop();
        //la ruta esta terminada
        }else if(this.RutaTerminada==1){
            //console.log("si se puedo borrar");
            this.l=this.overlays.length;
            this.overlays[this.l-1].setMap(null);
            this.overlays.length=this.overlays.length-1;
            this.RutaTerminada=0;
        //ver si es necesario cuando el numero de objetos en el mapa sea cero
        }

        if(this.overlays.length==0){
            this.disButEditar=true;
            this.disButDeshacer=true;
            this.disButNuevaRuta=false;
            this.disButSubirRuta=true;
            this.disButTerminarRuta=true;
            this.disButBorrar=true;
        }else if(this.overlays.length!=0){
            this.disButEditar=false;
            this.disButDeshacer=false;
            this.disButNuevaRuta=true;
            this.disButSubirRuta=false;
            this.disButTerminarRuta=false;
        }
    }

    //APERTURA EL CUADRO PARA DECIDIR SI SE EDITA O NO LA RUTA TRAZADA
    showmodalEditar(){
        //activar draggable de todos los marcadores
        this.displayfromEditar = true;
    }

    //CLICK SOBRE UNA FILA DE LA GRILLA
    onRowSelect(event){
        
        if(this.modRegistro==1){ //MOD TERMINADO
                //obtener le ID de la fila seleccionada
                this.indiceRowTabla = event.data.RuId;
                
                //actualizando para poder saber si es un nuevo registro o si se va editar el seleccionado
                //this.Ruta.RuId esta iniciado a cero
                this.Ruta.RuId = this.indiceRowTabla;

                //limpiar el mapa
                this.overlays=[];
                this.coordenadas=[];
                this.RutaTerminada=0; //0: ruta terminada   1:ruta no terminada
                this.puntosRuta=[];
                console.log("antes: "+this.overlays.length);

                //CONSULTAR PUNTOS RUTADETALLE AL rest
                this.consultaRuta(this.indiceRowTabla);
               /* this.rutaService.getAllRutaDetalleByRu(this.indiceRowTabla).subscribe(
                    data => {   this.puntosRuta=data; 
                                this.cargarRuta();
                                if(this.puntosRuta.length>0){
                                    this.disButEditar=false; //boton habilitado
                                    this.disButBorrar=true;
                                    this.disButNuevaRuta=true;
                                    this.disButSubirRuta=true;
                                    this.disButDeshacer=true;
                                    this.disButTerminarRuta=true;

                                    //RUTA RECUPERADA (SI)
                                    this.rutaRecuperada=1;
                                }else if(this.puntosRuta.length==0){
                                    //HABILITANDO BOTONES EN EL FORMULARIO
                                    //this.disButEditar=false; //boton habilitado
                                    this.disButBorrar=true;  //boton deshabilitado
                                    this.disButEditar=true; //boton deshabilitado
                                    this.disButNuevaRuta=false; //boton habilitado 
                                    this.disButSubirRuta=true;
                                    this.disButDeshacer=true;
                                    this.disButTerminarRuta=true;

                                    //RUTA RECUPERADA (NO)
                                    this.rutaRecuperada=0;
                                }
                                //this.iniciar=1;
                            },
                    err => {this.errorMessage=err},
                    () => this.isLoading =false
                    );
                */

                console.log("despues: "+this.overlays.length);
                console.log("ruta recuperada 1: si, 0: no  => "+ this.rutaRecuperada);
        }else if(this.modRegistro==0){ //MOD NO TERMINADO
            console.log("GUARDAR LA GRAFICA DE LA NUEVA RUTA");
        }

      
    }

    //CONSULTAR PUNTOS RUTADETALLE A LA BD
    consultaRuta(idRuta : number){
         this.rutaService.getAllRutaDetalleByRu(idRuta).subscribe(
                    data => {   this.puntosRuta=data; 
                                this.cargarRuta();
                                if(this.puntosRuta.length>0){
                                    this.disButEditar=false; //boton habilitado
                                    this.disButBorrar=true;
                                    this.disButNuevaRuta=true;
                                    this.disButSubirRuta=true;
                                    this.disButDeshacer=true;
                                    this.disButTerminarRuta=true;

                                    //RUTA RECUPERADA (SI)
                                    this.rutaRecuperada=1;
                                }else if(this.puntosRuta.length==0){
                                    //HABILITANDO BOTONES EN EL FORMULARIO
                                    //this.disButEditar=false; //boton habilitado
                                    this.disButBorrar=true;  //boton deshabilitado
                                    this.disButEditar=true; //boton deshabilitado
                                    this.disButNuevaRuta=false; //boton habilitado 
                                    this.disButSubirRuta=true;
                                    this.disButDeshacer=true;
                                    this.disButTerminarRuta=true;

                                    //RUTA RECUPERADA (NO)
                                    this.rutaRecuperada=0;
                                }
                                //this.iniciar=1;
                            },
                    err => {this.errorMessage=err},
                    () => this.isLoading =false
                );
    }


    //cargar la ruta recuperada del rest haciendo el mapa
    cargarRuta(){
        //cargar las coordenadas de los puntos al array para trazar la linea
        if(this.puntosRuta.length>2){
            for(let n=0; n<this.puntosRuta.length; n++){
            this.coordenadas.push({
                    lat:this.puntosRuta[n].RuDeLatitud,
                    lng:this.puntosRuta[n].RuDeLongitud
                });
                console.log(n);
            }
            //dibujar la linea
            this.overlays.push(
                new google.maps.Polyline({
                path: this.coordenadas,
                //strokeColor: '#FF0000',
                strokerColor: '#0101DF',
                strokeOpacity : 0.5,
                strokeWeight :8 
            }));
        }else if(this.puntosRuta.length<2 || this.puntosRuta.length==0){
            console.log("ruta no valida");
            this.puntosRuta=[]; //LIMPIANDO PUNTOSRUTA
        }

        this.editando = 0; //no se esta editando ,  ruta terminada

        //AGREGAR AL ULTIMA LINEA QUE FALTA PARA PODER CERRAR LA RUTA

        //RECUPERANDO LOS PUNTOS DE LA RUTA PARA EL CASO DE PODER EDITAR LA traza
        //console.log(this.puntosRuta);
    }
    //agregar marcador sobre la linea

   
    /*
    //FALTA PROGRAMAR ESTE MODULO
    eliminarmarcador(){
        console.log("marcador eliminado");
        if(this.RutaTerminada==0){
            console.log("se va editar :3");
        }else if(this.RutaTerminada==1){
            console.log("se va editar :3");
        }
    }*/

    //zoom para el mapa
    zoomIn(map){
        map.setZoom(map.getZoom()+1);
    }
    zoomOut(map){
        map.setZoom(map.getZoom()-1);
    }

    //VACIAR TODOS LOS PUNTOS DEL MAPA PARA REINIAR TODO 
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
        this.activarAddMarker = 1; //ADDMARKER ACTIVADO
        
        //CONDICIONAL PARA RUTATERMINADA O EN EDICION 8 CASOS DIFERENTES
        //PARA CASO DE RUTATERMINADA=1
        if(this.editando==0 && this.RutaTerminada==1){//no se esta editando 
            //DESHABILITADO Y HABILITANDO BOTONES
            this.disButBorrar=true;
            this.disButTerminarRuta=true;
            this.disButSubirRuta=true;
            this.disButDeshacer=true;
            this.disButNuevaRuta=false;

        }else if(this.editando==1 && this.RutaTerminada==1){//se esta editando 
            //DESHABILITADO Y HABILITANDO BOTONES
            this.disButBorrar=false;
            this.disButTerminarRuta=false;
            this.disButSubirRuta=false;
            this.disButDeshacer=false;
            this.disButNuevaRuta=true;

            this.activarAddMarker=1; //addmarker activado 
        }else if(this.editando==0 && this.RutaTerminada==0){
            console.log("NO PROGRAMADO");
        }else if(this.editando==1 && this.RutaTerminada==0){
            console.log("NO PROGRAMADO");
        }
       
    }

    //LLAMAR A RUTA SERVICE PARA USAR LOS PROCEDIMIENTOS ALMACENADOS
    constructor(private rutaService: RutaService){}

    //Nuevo Registro Maestro (BOTON NUEVO - CABECERA)
     nuevaRutaMaestro(){
        this.displayNuevaRutaModal = true;
        this.headertitle ="Nueva";
        this.rutaService.newRuta().subscribe(
            data => {
                this.Ruta2 = data;
                //this.Ruta.RuId =0;
                //LIMPIANDO LOS OBJETOS EN EL FORMULARIO PARA PODER INGRESAR NUEVOS DATOS
                 this.Ruta ={
                    RuId : 0,
                    EmId : 1,
                    RuDescripcion : "",
                    //RuFechaCreacion:  'yyyy-MM-dd',
                    RuRegMunicipal : "",
                    RuKilometro : 0,
                    RuActivo : true,
                    UsId: 0,
                    //UsFechaReg: 'yyyy-MM-dd'
                }
            }
        );
     }
  
     //guardar en el rest la cabecera de la ruta (MAESTRO)
     saveRutaMaestro(){
         //capturando fecha
         //EL CASO DE GUARDAR UN NUEVO REGISTRO RUID = 0
         if(this._RuId == 0){
             console.log("nuevo");
            //capturando la fecha actual
            this.date = new Date();
            this.dia = this.date.getDate();
            this.mes = this.date.getMonth();
            this.anio = this.date.getFullYear();
            this.Ruta.UsFechaReg = this.anio+"-"+this.mes+"-"+this.dia;

            //capturando la fecha de creacion
            console.log(this.Ruta.RuFechaCreacion);
            //let anio = this.Ruta.RuFechaCreacion.getFullYear();
            //console.log(anio);

            this.Ruta2.RuId = this.Ruta.RuId,
            this.Ruta2.EmId = this.Ruta.EmId,
            this.Ruta2.RuDescripcion = this.Ruta.RuDescripcion,
            this.Ruta2.RuFechaCreacion =  this.Ruta.RuFechaCreacion,
            this.Ruta2.RuRegMunicipal = this.Ruta.RuRegMunicipal,
            this.Ruta2.RuKilometro = this.Ruta.RuKilometro,
            this.Ruta2.RuActivo = this.Ruta.RuActivo,
            this.Ruta2.UsId = this.Ruta.UsId,
            this.Ruta2.UsFechaReg = this.Ruta.UsFechaReg

            this.displayNuevaRutaModal=false;
            console.log(this.Ruta);
         }else if(this._RuId != 0){
             //EL CASO DE EDITAR UN REGISTRO RUID != 0
            console.log("editado");

            //capturando la fecha actual
            this.date = new Date();
            this.dia = this.date.getDate();
            this.mes = this.date.getMonth();
            this.anio = this.date.getFullYear();
            this.Ruta.UsFechaReg = this.anio+"-"+this.mes+"-"+this.dia;
            let ID = this._RuId;

            
            this.Ruta2=this.Ruta; //PASANDO DATOS AL OBJETO PARA SER SUBIDO A LA BD

            console.log(this.Ruta);
            this.displayNuevaRutaModal=false;
            console.log(this.Ruta2);
         }
         console.log(this.Ruta2);
         this.rutaService.saveRuta
         (this.Ruta2).subscribe( realizar => { this.mostrargrillaruta(); 
                                               this.getAllRutaByEm(1);} ,
                                      err => { this.errorMessage = err });		
     
    }
    
     //cancelar una nueva ruta maestro (cabecera)
     cancelRutaMaestro(){
        this.displayNuevaRutaModal=false;
        /* SE TIENE Q VACIAR EL OBJETO EN CASO DE HABER INGRESADO ALGUNOS DATOS
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

     //capturar toda la ruta por el id (para mostrar en la grilla MAESTRO CONSULTA A VARIAS TABLAS) 
    getAllRutaByEm(emId: number){
        this.rutaService.getAllRutaByEm(emId).subscribe(
            data => { this.rutas = data; this.mostrargrillaruta();},
                    err => {this.errorMessage = err}, 
                    () =>this.isLoading = false
            );
    }
    //MOSTRAR RESULTADO EN LA GRILLA PRINCIPAL (LISTADO DE RUTAS TRAZADAS POR EMPRESA)
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
    
    //BORRAR LOS NODOS DEL MAPA Y LOS ARRAYS Y CARGAR LA LINEA QUE REPRESENTA LA RUTA TRAZADA
    //(FALTA PROGRAMAR ESTA FUNCION)
    mgRutaDetalle(){
        //usar puntosRutaDetalle
        console.log("mostrar detalle ruta");
        this.clear();
        this.cargarRuta();
        console.log(this.puntosRuta);
    }

    //crea una nueva ruta detalle para SUBIRLO AL SERVIDOR agregar marcadores al mapa
    nuevaRutaDetalle(){
        this.modRegistro=0; //DESACTIVANDO LA SELECCION DE REGISTROS MAESTRO
        
        //crear la nueva rutadetalle
        console.log("trazar nueva ruta");
        this.rutaService.newRutaDetalle().subscribe(data=>{this.puntosRutaDetalle=data});
        this.disButNuevaRuta=true; //cuando se crea un nuevo rutadetalle se deshabilita el boton
        this.disButSubirRuta=true;//desactivar boton subirRuta, se activara cuando se pulse el boton terminarRuta 
        //this.nuevaRuta=1; // 1 : se creo una nueva ruta
        this.rutaRecuperada=0; //la ruta no se encuentra en ela BD
        this.activarAddMarker=1; //1 : permite agregar marcadores 
        this.i=0; //se reinicia o inicia el i para ponerlo como indice de los marcadores
    }


    //guardar RutaDEtalle en la BD
    guardarPuntosRutaDetalle(){
        this.puntosRutaDetalleArray = [];
        //  CONDICIONAL SABER SI EXISTEN OBJETOS EN EL ARRAY OVERLAYS
        // SABER SI SE GUARDA UNA RUTA VACIA O NO
        if(this.overlays.length==0){ //NO HAY OBJETOS, SE GUARDA RUTA VACIA
            this.puntosRuta = [];
            this.rutaService.deleteRutaDetalleByRu(this.indiceRowTabla).subscribe(
                realizar => {console.log("RUTA VACIA");
                             //ACTIVANDO SELECCION DE ROWS GRILLA modRegistro=1
                             this.modRegistro=1
                            },
                err => {console.log(err);}
            );

        }else if(this.overlays.length!=0  && this.overlays.length>6){ //POR LO MENOS UN TRIANGULO
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
                console.log(n);
                //this.puntosRutaDetalle[n]=this.puntosRuta;
            }
            
            console.log(this.puntosRutaDetalleArray);

            //BORRANDO RUTA ANTERIOR PARA PONER LA NUEVA
            this.rutaService.deleteRutaDetalleByRu(this.indiceRowTabla).subscribe(
                realizar =>{console.log("SE BORRO RECTA DE RUTA");},
                err => {console.log(err);}
            );

            this.rutaService.saveRutaDetalle(this.puntosRutaDetalleArray)
            .subscribe(
                    realizar => {this.mgRutaDetalle();
                                //ACTIVANDO SELECCION DE ROWS GRILLA modRegistro=1
                                this.modRegistro=1 ;    
                            },
                    err => {this.errorMessage=err}
            );

            console.log("guardado en rest");
            //this.modRegistro==1 //ACTIVANDO LA SELECCION DEL FILAS GRILLA MAESTRO (RUTA TRAZA GUARDADA EN LA BD)
        }

        //ACTIVAR Y DESACTIVAR BOTONES AL GUARDAR EL DETALLE
        this.disButBorrar = true;
        this.disButEditar  = true;
        this.disButTerminarRuta = true;
        this.disButSubirRuta = true;
        this.disButDeshacer = true;
        this.disButNuevaRuta = true;
        //this.disButCancelar FALTA PROGRAMACION, NO TIENE USO
    }
}

var Coords ={
    x:0,
    y:0
}