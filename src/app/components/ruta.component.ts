import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
//import {Ruta, RutaDetalle} from 'app/variables';
//import {puntosTrazaRuta} from 'app/variables'
import { RutaService } from '../service/ruta.service';
import {GlobalVars} from 'app/variables'

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
        EmId : 0,
        RuDescripcion : "",
        RuFechaCreacion:  "",
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
    /*puntosRuta:any[]=[]; COMENTADO :s */
    puntosRuta:any[]=[{
            RuDeLatitud:null,
            RuDeLongitud:null
    }];
    puntosRutaDetalleArray:any[]=[];
    puntosRutaDetalle:any;

    /*capturando fecha actual 
    date:any;
    anio:string;
    mes:string;
    dia:string;*/

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
    cen_2:number//pa
    q=0;//para hacer el cambio de false a true en los marcadores
    x0=0;
    y0=0;
    end=0;
    editando=1; //editado = 1 (se esta editando)  editando = 0 (no se esta editando)
    new_x:number; //para funcion editar, crear nuevos marker
    new_y:number; //para funcion editar, crear nuevos marker
    new_index:number; //indice para nuevo marcador draggable true
    cen=0;//centinela para la busqueda
    edit_RutaTerminada=0;   //NO SE PUEDE EDITAR RUTA
    edit_RutaNoTerminada=0;

    RutaTerminada=0; /* RutaTerminada=0 (RUTA NO TERMINADA), RutaTerminada=1 (RUTA TERMINADA) */
    infoWindow: any;

    /* DISPLAY VENTANAS MODALES */
    displayfromEditar : boolean = false;
    displayConfirmar  : boolean = false;
    displayAddMakerDesactivado : boolean = false;
    displaySinGrafica : boolean = false;
    displayGuardarCorrecto : boolean = false;
    displayNuevaRuta : boolean = false;
    displayTerminarForSave : boolean = false;
    displayTermineRuta : boolean = false;
    displayConfBorrarRuta : boolean = false;
    displayrutaNoPermitida : boolean = false;
    displaytrazaNoValida : boolean = false;

    /* OCULTAR BOTONES MAPA */
    actBtnBorrar:boolean;
    actBtnEditar:boolean;
    actBtnGuardar:boolean;
    actBtnAtras:boolean;
    actBtnNuevo:boolean;

    //HABILITAR O DESAHILITAR BOTONES
    disButEditar:boolean=true;
    disButTerminarRuta:boolean=true;
    disButSubirRuta:boolean=true;
    disButDeshacer:boolean=true;
    disButNuevaRuta:boolean=true;
    disButBorrar:boolean=true;

    Mensaje           : string; // mensaje para modal confirmar
    aceptar           : boolean ; //TRUE: ACEPTAR    FALSE: CANCELAR

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


    //VARIABLE PARA COMPROBAR SI SE RECUPERO UNA RUTA DESDE LA BD (PARA 
    //RECUPERAR LOS PUNTOS Y PODER TRAZAR LA RUTA CON MARKER Y LINEAS EDITAR LA RUTA)
    //(NO ESTA EN USO ALTERNATIVA CON EL TAMAÑO DEL ARRAY DE PUNTOCONTROL)
    rutaRecuperada: number = 1; // 1:RUTA RECUPERADA DE LA BD     0: RUTA NO RECUPERADA (VACIO) NUEVA TRAZA RUTA 
    
    //PARA ACTIVAR O DESACTIVAR EL AGREGAR MARCADORES AL MAPA
    activarAddMarker:number =0; // 1 : ADDMARKER ACTIVADO   0 : ADDMARKER  DESACTIVADO
    modRegistro=0; // 1: registro terminado     0: registro no terminado

    /* OTRAS VARIABLES */
    emID : number;
    em_id:number;
    user_Id:number;
//FUNCIONES

    /* VALORES INICIALES */
    ngOnInit(){
        

        /* MAPA GOOGLE*/
        this.options = {
            center: new google.maps.LatLng(-18.0065679, -70.2462741), //center: {lat: -18.0065679, lng: -70.2462741},
            zoom: 14,
            gestureHandling: 'greedy'
            //rotateControl: true,
        };
    
       

        /* CONSULTA RUTAS X EMID */
        this.getAllRutaByEm(this.emID);
        this.infoWindow = new google.maps.InfoWindow();

        
    }

    //LLAMAR A RUTA SERVICE PARA USAR LOS PROCEDIMIENTOS ALMACENADOS
    constructor(private rutaService: RutaService,public ClassGlobal:GlobalVars){
        this.em_id=this.ClassGlobal.GetEmId();
        this.user_Id=this.ClassGlobal.GetUsId();

        this.emID=this.em_id;

        /*DESACTIVADO AGREGAR MARCADORES*/
        this.activarAddMarker = 0; 
        
        this.Ruta.EmId=this.emID;
        this.Ruta.RuId = 0;
         
        //CONTROLAR LA SELECCION DE FILAS EN LA GRILLA, DESACTIVAR HASTA Q SE TERMINE DE GUARDAR LA MODIFICACION O NUEVO REGISTRO
        this.modRegistro=1; //ACTIVANDO LA SELECCION DE REGISTRO MAESTRO --seleccionar regisrtos activado
    
        /* CENTINELA, ATENCION TRAZA NO PERMITIDA (SOLO 2 NODOS Y 1 LINEA) */
        this.cen_2=0;

         /* OCULTAR BOTONES MAPA */
        this.actBtnBorrar=false;
        this.actBtnEditar=true;
        this.actBtnGuardar=false;
        this.actBtnAtras=false;
        this.actBtnNuevo=false;
    }

    /*CLICK SOBRE OBJETO*/
    handleOverClick(event) {
        console.log("click =D handleOverClick");    
    } 

    //recuperar registro de la fila seleccionada y mostrarlo en un modal los datos recuperados 
    //editar y luego llamar a l procedimiento para guardar en la BD 
    editarRutaMaestro(_RuId : number){
        this._RuId = _RuId;
        this.headertitle = "Editar";

        //consulta para recuperar datos deacuerdo a la _RuId
        this.rutaService.getRutaById(_RuId).subscribe(
            data => {
                        this.Ruta=data; 
                        this.Ruta.RuFechaCreacion=this.formatFech(this._fecha(this.Ruta.RuFechaCreacion));
                        //console.log(this.Ruta);
                    },
            err => {this.errorMessage = err}
        );

          this.displayNuevaRutaModal = true;
           //borrando los campos de la vairable puntosRUta para que al momento de crear uno nuevo los campos estes vacios para ser llenados
        //this.Ruta={};
    }   

    /* DANDO FORMATO A LA FECHA PARA SER EDITADA EN EL FORMULARIO DE EDITAR*/
    formatFech(f : string) : string{
        let _f, r, aux;
        _f = f.split("/");
        aux = _f[0]; _f[0]=_f[2]; _f[2]=aux;
        r = _f.join("-");
        return r;
    }

    //eliminar los registros de la tabla Ruta (MAESTRO)
    eliminarRutaMaestro(_RuId : number){
        //revisar la parte de consulta this.getAllRutaByEm(1) (buscar una variable en vez del numero 1)
        this._RuId = _RuId;
        this.displayConfirmar = true;
        this.Mensaje = "¿Esta Seguro de Eliminar la Ruta?";
    }

    //FUNCION PARA EL BOTON ELEIMINAR ROW CABECERA
    eliminarRuta(){
        this.rutaService.deleteRuta(this._RuId).subscribe(
                realizar => {
                    this.getAllRutaByEm(1);
                    this.displayConfirmar = false;
                },
                err => {console.log(err);}

            );
    }

    /* EDITAR TRAZA DE LA RUTA*/
    editar(){
        this.displayfromEditar = false;
        this.editando = 1; // se esta editando
         
        //CUATRO CASOS PARA EDITAR 

        //SI EXISTEN PUNTOS EN EL ARRAY PUNTOSRUTA -> SE PUEDE EDITAR  // rutaRecuperada = 0 -> la ruta no esta en la BD ( NUEVA TRAZA)
       
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
                this.edit_RutaTerminada=1;  //EDITAR RUTA TERMINADA

                //draggable de marker todos a true (para ser arrastrados) del overlays
                while( this.q<this.overlays.length-1){
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
            }

        //LA RUTA ESTA EN LA BD Y SOLO SE MUESTRA UNA LINEA(TRAZA DE LA RUTA) 
        //FALTA TERMINAR SU PROGRAMACION 
        //AGREGANDO MARCADORES Y LINEAS COMO CORRESPONDE 0,1,3,5...(IMPARES-- PARA MARKER) 2,4,6,8...(PARES--LINEAS) EN EL OVERLAYS
        }else if(this.rutaRecuperada == 1){
            this.i= this.puntosRuta.length -1;
            //console.log("i: "+this.i);    //console.log("editar una ruta que esta en la bd");       //console.log(this.puntosRuta);
            this.disButEditar=true;
            this.disButBorrar=false;
          
            //LIMPIANDO OBJETOS
            //this.overlays=[];  //this.RutaTerminada=0;    //this.puntosRuta=[];
            this.coordenadas=[];
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
                    n++;

                }else if(this.overlays.length%2==1 ){ //n impar --->  markers
                    //marcadores posicion impar poner indice a los marcadores y lineas          
                    this.overlays.push(new google.maps.Marker({
                                    position:{lat: this.puntosRuta[n].RuDeLatitud,  lng: this.puntosRuta[n].RuDeLongitud}, 
                                    title:n.toString(), 
                                    draggable: true,}));
                }

            }//FIN WHILE
           this.ultimalinea();
        }
        
        {
            //DESACTIVANDO EL BOTON EDITAR PARA QUE NO ESTE ACTIVO AL MODIFICAR LA RUTA
            //ACTIVANDO & DESACTIVANDO
            this.disButBorrar = false;
            this.disButDeshacer = false;
            this.disButNuevaRuta = true;
            this.disButSubirRuta = false;
            this.disButTerminarRuta = true;
            this.disButEditar = true; 

            //if(this.RutaTerminada == 0){ //RUTA NO TERMINADA
                //addmarker desactivado
                this.activarAddMarker = 0;
            
            //}else if(this.RutaTerminada == 1){ //RUTA TERMINADA
                //addmarker activado
                //this.activarAddMarker = 1;
            
            //}
        
            this.modRegistro=0;    //select row grilla desactivado

            //condicionales para activar el arrastre de markers
            this.edit_RutaTerminada = 1; 
            //this.RutaTerminada = 1; //LA RUTA ESTA TERMINADA
        }
}

    /*EVENTO ARRASTRAR FINAL  -- ARRASTRAR LOS MARCADORES(NODOS)*/
    handleDragEnd(event){
        console.log("arrastrando nodos");
        //CONVIRTIENDO TITLE MARKER A NUMERICO
        this.indexmovil = Number(event.overlay.getTitle());

        //EXTRAYENDO LATITUD Y LOGITUD DE MARCADOR ARRASTRADO
        this.x =  event.overlay.getPosition().lat();
        this.y =  event.overlay.getPosition().lng();

        //BUSCANDO EL INDICE DEL MARCADOR ARRASTRADO
        this.indexObjec = this.overlays.indexOf(event.overlay);  

        /*ELIMINANDO LINEAS ENTRE LOS NODOS ARRASTRADOS 12 CASOS (6 TERMINADA RUTA & 6 NO TERMINADA RUTA)*/

        //CASO EDITAR RUTA NO TERMINADA
        if(this.edit_RutaNoTerminada == 1  && this.overlays.length > 1 && this.RutaTerminada == 0){
            /* CUANDO ES EL PRIMER NODO, PRIMER NODO DE RUTA NO TERMINADA */
            if(this.indexObjec == 0){
                    //se guardan la nuev aposicion en los puntos para trazar la ruta
                this.puntosRuta[0].RuDeLatitud = this.x;
                this.puntosRuta[0].RuDeLongitud = this.y;

                /*borrar y reponer el la linea en la nueva posicion
                this.overlays[2].setMap(null);*/

                this.overlays.splice(2,1,(new google.maps.Polyline({
                        path:[{lat:this.puntosRuta[0].RuDeLatitud, lng: this.puntosRuta[0].RuDeLongitud},
                            {lat:this.puntosRuta[1].RuDeLatitud, lng: this.puntosRuta[1].RuDeLongitud} ],
                        geodesic: true, 
                        strokeColor: '#FF0000',  
                        strokeOpacity: 0.5, 
                        strokeWeight :2 , 
                        editable: false, 
                        draggable : false 
                })));

            /* CUANDO ES EL ULTIMO NODO, ULTIMO NODO LA RUTA NO ESTA TERMINADA */
            }else if(this.indexObjec == (this.overlays.length - 2) ){
                //ultimo marker sin terminar ruta
                this.puntosRuta[this.puntosRuta.length - 1].RuDeLatitud = this.x;
                this.puntosRuta[this.puntosRuta.length - 1].RuDeLongitud = this.y;

            
                /* REPONIENDO LA LINEA CON LAS COORDENADAS DEL MARCADOR ARRASTRADO */
                this.overlays.splice(this.overlays.length - 1,1,(new google.maps.Polyline({
                        path:[{ lat:this.puntosRuta[this.puntosRuta.length - 2].RuDeLatitud, 
                                lng: this.puntosRuta[this.puntosRuta.length -2].RuDeLongitud},
                                
                                { lat:this.puntosRuta[this.puntosRuta.length - 1].RuDeLatitud, 
                                lng: this.puntosRuta[this.puntosRuta.length -1].RuDeLongitud} ],
                        geodesic: true, 
                        strokeColor: '#FF0000', 
                        strokeOpacity: 0.5, 
                        strokeWeight :2 , 
                        editable: false, 
                        draggable : false 
                })));
            /* 2 LINEAS ENTRE EL NODO ARRASTRADO */
            }else if(0<this.indexObjec && this.indexObjec<this.overlays.length - 2){
                // MENSAJE EN MODAL
                let index:number=Number(this.overlays[this.indexObjec].title);
                
                /* SALVANDO PUNTOS */
                this.puntosRuta[index].RuDeLatitud = this.x;
                this.puntosRuta[index].RuDeLongitud = this.y;
                
                this.overlays[this.indexObjec+1].setMap(null);
                this.overlays[this.indexObjec+3].setMap(null);

                this.overlays.splice((this.indexObjec +3),1,(new google.maps.Polyline({
                        path:[  //punto fijo (final recta)
                                {lat:this.puntosRuta[index].RuDeLatitud, lng: this.puntosRuta[index].RuDeLongitud},   
                                //punto movil (inicio recta)
                                {lat:this.puntosRuta[index+1].RuDeLatitud, lng: this.puntosRuta[index+1].RuDeLongitud}],
                        geodesic: true, 
                        strokeColor: '#FF0000',  
                        strokeOpacity: 0.5,  
                        strokeWeight :2 , 
                        editable: false, 
                        draggable : false 
                })));

                this.overlays.splice(this.indexObjec +1,1,(new google.maps.Polyline({
                        path:[ //punto movil
                                {lat:this.puntosRuta[index].RuDeLatitud, lng: this.puntosRuta[index].RuDeLongitud},
                                //punto fijo
                                {lat:this.puntosRuta[index -1].RuDeLatitud, lng: this.puntosRuta[index -1].RuDeLongitud} ],
                        geodesic: true, 
                        strokeColor: '#FF0000',  
                        strokeOpacity: 0.5,  
                        strokeWeight :2 , 
                        editable: false, 
                        draggable : false 
                })));

            }
            // 1 polyline izq
            // 1 polyline der
            // 0 polyline
        
        /*CASOS SI RUTA ESTA TERMINADA (CERRADA), 4 CASOS -> REVISAR SI HAY MAS*/ 
        }else if(this.edit_RutaTerminada == 1  && this.overlays.length > 1 && this.RutaTerminada == 1){
            /*PRIMER NODO, RUTA TERMINADA*/
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

            //CASO -> ULTIMO MARCADOR (MARCADOR DENTRO DEL ARRAY OVERLAYS)
            }else if(this.indexObjec == (this.overlays.length - 3) ){
             //ultimo marker terminada ruta
                    //se guarda la ultima posicion en array para trazar los puntos ruta (SE ACTUALIZA EL ULTIMO PUNTO CON LAS NUEVAS COORDENADAS)
                    this.puntosRuta[this.puntosRuta.length - 1].RuDeLatitud = this.x;
                    this.puntosRuta[this.puntosRuta.length - 1].RuDeLongitud = this.y;
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
                    
            /* 2 LINEAS A LOS LADOS DEL NODO, RUTA TERMINADA*/
            }else if(  this.indexObjec>=3 && (this.indexObjec < this.overlays.length-4) ){
                //RECUPERANDO EL INDICE (TITLE) DEL MARCADOR PARA RECUPERAR LAS COORDENADAS DEL MARCADOR ANTERIOR Y SIGUIENTE
                this.o = Number(this.overlays[this.indexObjec].title);// o : indice (title) del marcador dentro del array de puntos

                this.puntosRuta[this.o].RuDeLatitud  = this.x;
                this.puntosRuta[this.o].RuDeLongitud = this.y;
                
               //ENCONTRAR LA POSICION DEL PUNTODECONTROL EN EL ARRAY OVERLAYS
               //CAMBIAR LA CONDICIONAL PARA USAR EL TITLE DEL MARKER Y EL CAMPO ORDEN DEL OBJETO PUNTOCONTROL(DETALLE)
                if( (this.puntosRuta[this.o].RuDeLatitud == this.overlays[this.indexObjec].position.lat())  ){
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
            //MOVIENDO EL SEGUNDO MARCADOR (OTRO CASO)
            }else if(this.indexObjec == 1  && (this.overlays[this.indexObjec+1] != null && this.overlays[this.indexObjec+2]!= null)){
               
                //cargando los nuevos puntos 
                this.puntosRuta[this.indexObjec ].RuDeLatitud = this.x;
                this.puntosRuta[this.indexObjec ].RuDeLongitud = this.y;

                this.overlays[this.indexObjec+1].setMap(null);
                this.overlays[this.indexObjec+3].setMap(null);

                //poniendo nuevas polyline en esos lugares, linea antes del index marcador
    
                this.overlays.splice(this.indexObjec +1,1,(new google.maps.Polyline({
                        path:[  
                                /*punto movil (inicio recta)
                                {lat:Number( this.overlays[this.indexObjec - 2].position.lat()), 
                                 lng: Number(this.overlays[this.indexObjec - 2].position.lng())},*/
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
    }/*FIN HANDLEDRAGEND*/
     

    //CLICK SOBRE EL MAPA -- EN ESTE CASO PARA AGREGAR MARCADORES SOBRE EL MAPA
    handleMapClick(event) {
        let coords:any;
        /*console.log("agregar nodos: "+this.activarAddMarker);coords=event.latLng;console.log(coords.lat());console.log(coords.lng());*/

        if(this.activarAddMarker == 1){//addmarker activado
            this.selectedPosition = event.latLng;
            /*this.coordenadas.push( Coords = {x:this.selectedPosition.lat(),  y:this.selectedPosition.lng()})*/
            this.coordenadas.push({x:this.selectedPosition.lat(), 
                                   y:this.selectedPosition.lng()})
            this.addMarker();         
            this.disButSubirRuta=true;//desactivar boton subirRuta, se activara cuando se pulse el boton terminarRuta 

            /*HABILITANDO, DESHABILITANDO BOTONES */
            this.disButSubirRuta=false;


        }else if(this.activarAddMarker == 0){//addmarker desactivado
            //MENSAJE EN MODAL
            this.Mensaje="No se puede agregar nodos sobre el mapa";
            this.displayAddMakerDesactivado=true;
            //console.log("no se puede hacer click sobre el mapa, addmarker desactivado");
        }
    }//fin funcion handleMapClick CLICK SOBRE EL MAPA


    aceptarAddMarkerDesactivado(){
        this.Mensaje="";
        this.displayAddMakerDesactivado=false;
    }

    //agregar marcador en el mapa
    addMarker(){
        /* SE PUEDE AGREGAR NODOS, ACTIVADO */
        if(this.activarAddMarker == 1){
                this.i=0; /*PARA TITLE DEL NODO */

                //decidiendo el titulo(index) para marker
                if(this.i == 0 || this.i==1 ){
                    this.markerTitle = this.i.toString();
                }else if(this.i > 1){
                    this.m = this.m + 1 ;
                    this.markerTitle = (this.m).toString();//3 = i(2) + 1
                }

                //poner indice a los marcadores y lineas
                /*RUTA EXISTENTE, EDITAR TRAZA RECUPERADA*/
                if(this.editando == 1){ 
                    console.log("editando ruta que esta en la bd :c");
                    this.overlays.push(new google.maps.Marker({
                                /*position:{lat: this.coordenadas[this.i].x, lng: this.coordenadas[this.i].y}, */
                                position:{lat: this.coordenadas[this.coordenadas.length-1].x,  
                                          lng: this.coordenadas[this.coordenadas.length-1].y},
                                title:this.markerTitle, 
                                draggable: false,}));
                
                /* NUEVA RUTA,  (RUTA NO RECUPERADA DE LA BD)*/
                }else if(this.editando == 0){
                    console.log("editando ruta que no esta en la bd :c");
                    this.overlays.push(new google.maps.Marker({
                                /*position:{lat: this.coordenadas[this.i].x, lng: this.coordenadas[this.i].y}, */
                                position:{lat: this.coordenadas[this.coordenadas.length-1].x,  
                                          lng: this.coordenadas[this.coordenadas.length-1].y},
                                title:this.markerTitle, 
                                draggable: false,}));
                }

                
                //SALVANDO LAS COORDENADAS DE LOS NODOS AL ARRAY PARA LA BD
                this.puntosRuta.push({RuDeLatitud:this.coordenadas[this.coordenadas.length-1].x,
                                      RuDeLongitud:this.coordenadas[this.coordenadas.length-1].y});
                
                //unir puntos si hay mas de 1 marcador (LINEA ENTRE MARCADORES)
                /*if(this.i>0){*/
                if(this.puntosRuta.length>1){
                    this.overlays.push(
                        new google.maps.Polyline({
                                    /*path:[{lat: this.puntosRuta[this.i-1].RuDeLatitud, lng:this.puntosRuta[this.i-1].RuDeLongitud},
                                        {lat: this.puntosRuta[this.i].RuDeLatitud, lng:this.puntosRuta[this.i].RuDeLongitud}],*/
                                    path:[{lat: this.puntosRuta[this.puntosRuta.length-2].RuDeLatitud, lng:this.puntosRuta[this.puntosRuta.length-2].RuDeLongitud},
                                        {lat: this.puntosRuta[this.puntosRuta.length-1].RuDeLatitud, lng:this.puntosRuta[this.puntosRuta.length-1].RuDeLongitud}],
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
        
        /* NO SE PUEDE AGREGAR NODOS, DESACTIVADO */
        }else if(this.activarAddMarker == 0){
            //ABRIR UNA VENTA QUE DIGA QUE NO SE PUEDE AGREGAR MARCADORES
            console.log("No se puede agregar nodos sobre el mapa");
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
            this.Mensaje="Traze Correctamente La Ruta";
            this.displayTermineRuta=true;
        }

        this.RutaTerminada=1; //ruta esta terminada
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

    aceptarTermineRuta(){
        this.Mensaje="";
        this.displayTermineRuta=false;
    }
  
    //borrar el ultimo marcador al trazar la ruta o la ultima linea que cierra la ruta 
    deshacer(){

        /*RUTA NO TERMINADA Y HAY MUCHOS OBJETOS*/
        if(this.overlays.length>3 && this.RutaTerminada==0){
            this.k=this.puntosRuta.length;
            this.j=this.overlays.length;

            this.overlays[this.j-1].setMap(null);
            this.overlays[this.j-2].setMap(null);
            
            this.puntosRuta.pop();/* BORRANDO ULTIMO PUNTO COORDENADA*/
            this.coordenadas.pop();
            this.i=this.i-1; /* REDUCIENDO TITLE DEL NODO */
            this.overlays.length=this.overlays.length-2;/* REDUCIENDO EL TAMAÑO DEL ARRAY OVERLAYS */
        /*RUTA NO TERMINADA Y SOLO HAY UN NODO */
        }else if(this.overlays.length==1 && this.RutaTerminada==0){
             this.k=0;
             this.j=0;
             this.i=0;
             this.overlays[0].setMap(null);
             this.overlays.pop();
             this.puntosRuta.pop();
             this.coordenadas.pop();
        //RUTA TERMINADA, BORRANDO ULTIMA LINEA (LA RUTA SE VUELVE NO TERMINADA)
        }else if(this.RutaTerminada==1){
            this.l=this.overlays.length;
            this.overlays[this.l-1].setMap(null); /*BORRANDO ULTIMA LINEA*/
            this.overlays.length=this.overlays.length-1;/* REDUCIENDO TAMAÑO EN UNO */
            this.RutaTerminada=0; /* VOLVIENDO A RUTA NO TERMINADA, SE BORRO ULTIMA LINEA */
            this.edit_RutaNoTerminada=1; /* EDITANDO RUTA NO TERMINADA, PARA ARRASTRAR NODOS RUTA NO TERMINADA */
            this.activarAddMarker=1;/* ACTIVANDO AGREGAR MARCADOR */
        //ver si es necesario cuando el numero de objetos en el mapa sea cero
        }else if(this.overlays.length<=3){

            if(this.overlays.length==3 && this.cen_2==0){
                this.Mensaje="Atencion, la ruta no es valida";
                this.displaytrazaNoValida=true;
                this.cen_2=1; /* CAMBIANDO PARA PERMITIR CONTINUAR BORRANDO NODOS Y LINEA */
            }else if(this.cen_2==1){
                this.overlays[1].setMap(null);
                this.overlays[2].setMap(null);
                
                this.puntosRuta.pop();/* BORRANDO ULTIMO PUNTO COORDENADA*/
                this.i=this.i-1; /* REDUCIENDO TITLE DEL NODO */
                this.overlays.length=this.overlays.length-2; /* REDUCIENDO EL TAMAÑO DEL ARRAY OVERLAYS */
            }
            

            
        }

        /* ACTIVANDO DESACTIVANDO BOTONES */
        /* MAPA VACIO (NO HAY ALGUN OBJETO LINEA Y NODO)*/
        if(this.overlays.length==0){
            this.disButEditar=true;
            this.disButDeshacer=true;
            this.disButNuevaRuta=false;
            this.disButSubirRuta=false;
            this.disButBorrar=false;
        /* MAPA NO VACIO (HAY ALGUN OBJETO LINEA Y NODO)*/
        }else if(this.overlays.length!=0){
            this.disButEditar=true;
            this.disButDeshacer=false;
            this.disButNuevaRuta=true;
            this.disButSubirRuta=false;
            this.disButBorrar=false;
        }
    }

    trazaNoValida(){
        this.Mensaje="";
        this.displaytrazaNoValida=false;
    }

    //APERTURA EL CUADRO PARA DECIDIR SI SE EDITA O NO LA RUTA TRAZADA
    showmodalEditar(){
        //activar draggable de todos los marcadores
        this.displayfromEditar = true;
        this.activarAddMarker=1;/* ACTIVANDO AGREGAR MARCADORES */
    }

    //CLICK SOBRE UNA FILA DE LA GRILLA
    onRowSelect(event){
        /* MODIFICACION TERMINADA */
        if(this.modRegistro==1){
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
                
                //CONSULTAR PUNTOS RUTADETALLE AL rest
                this.consultaRuta(this.indiceRowTabla);
        
        /* MODIFICACION NO TERMINADA */
        }else if(this.modRegistro==0){
            this.Mensaje="Debe Guardar La Grafica De La Nueva Ruta";
            this.displayTerminarForSave=true;
        }
    }

    aceptarTerminarRuta(){
        this.Mensaje="";
        this.displayTerminarForSave=false;
    }

    /*CONSULTAR PUNTOS RUTADETALLE A LA BD*/
    consultaRuta(idRuta : number){
         this.rutaService.getAllRutaDetalleByRu(idRuta).subscribe(
                    data => {   this.puntosRuta=data; 
                                this.cargarRuta();

                                if(this.puntosRuta.length>0){
                                    this.disButEditar=false; /*boton habilitado*/
                                    this.disButBorrar=false; /*boton habilitado*/
                                    this.disButNuevaRuta=true;
                                    this.disButSubirRuta=true;
                                    this.disButDeshacer=true;

                                    //RUTA RECUPERADA (SI)
                                    this.rutaRecuperada=1;
                                }else if(this.puntosRuta.length==0){
                                    //HABILITANDO BOTONES EN EL FORMULARIO
                                    this.disButBorrar=true;  /*boton deshabilitado*/
                                    this.disButEditar=true; /*boton deshabilitado*/
                                    this.disButNuevaRuta=false; /*boton habilitado*/ 
                                    this.disButSubirRuta=true;
                                    this.disButDeshacer=true;

                                    //RUTA RECUPERADA (NO)
                                    this.rutaRecuperada=0;
                                }
                                //this.iniciar=1;
                            },
                    err => {this.errorMessage=err},
                    () => this.isLoading =false
                );
    }

    /* CARGANDO UNA RUTA GUARDADA EN LA BD */
    cargarRuta(){
        /* PUNTOS VALIDOS EXISTE UNA RUTA*/
        if(this.puntosRuta.length>2){
            /* CARGANDO LOS PUNTOS EN UN ARRAY */
            for(let n=0; n<this.puntosRuta.length; n++){
                this.coordenadas.push({
                        lat:this.puntosRuta[n].RuDeLatitud,
                        lng:this.puntosRuta[n].RuDeLongitud
                    });
            }

            /*ULTIMA LINEA DE CIERRE */
            this.coordenadas.push({
                lat:this.puntosRuta[0].RuDeLatitud,
                lng:this.puntosRuta[0].RuDeLongitud
            })

            /*POLYLINE RUTA*/
            this.overlays.push(
                new google.maps.Polyline({
                path: this.coordenadas,
                strokeColor: '#00796B',
                strokeOpacity : 1,
                strokeWeight :10 
            }));

            /* ACTIVANDO DESACTIVANDO BOTONES */
            this.actBtnEditar=false;
            this.actBtnNuevo=true;

        /* PUNTOS NO VALIDOS O NO HAY RUTA*/
        }else if(this.puntosRuta.length<2 || this.puntosRuta.length==0){
            /* ACTIVANDO DESACTIVANDO BOTONES */
            this.actBtnEditar=true;
            this.actBtnNuevo=false;

            //EVALUAR MENSAJE MODAL RUTA NO VALIDA
            this.Mensaje="Registro Vacio, no contiene ruta trazada.";
            this.displaySinGrafica=true;
            this.puntosRuta=[]; //LIMPIANDO PUNTOSRUTA
        }

        this.editando = 0; //no se esta editando ,  ruta terminada
        /*RECUPERANDO LOS PUNTOS DE LA RUTA PARA EL CASO DE PODER EDITAR LA traza*/
    }

    aceptarSinGrafica(){
        this.Mensaje="";
        this.displaySinGrafica=false;
    }

    //VACIAR TODOS LOS PUNTOS DEL MAPA PARA REINIAR TODO 
    clear(){
        /* CONDICIONAL PARA SABER SI ES UNA RUTA O SU TRAZA */
        if(this.overlays.length!=1){
        console.log("limpiando variables");
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
            
            /*CONDICIONAL PARA RUTATERMINADA O EN EDICION 8 CASOS 
              DIFERENTES ACTIVANDO DESACTIVANDO BOTONES*/
            
            //PARA CASO DE RUTA TERMINADA + NO SE ESTA EDITANDO RUTA
            if(this.editando==0 && this.RutaTerminada==1){
                //DESHABILITADO Y HABILITANDO BOTONES
                this.disButBorrar=true;
                this.disButTerminarRuta=true;
                this.disButSubirRuta=true;
                this.disButDeshacer=true;
                this.disButNuevaRuta=false;
            
            //RUTA TERMINADA + SE ESTA EDITANDO RUTA 
            }else if(this.editando==1 && this.RutaTerminada==1){
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
        }else if(this.overlays.length==1){
        console.log("borrando ruta de la BD D=");
            this.displayConfBorrarRuta=true;
            this.Mensaje="¿Esta seguro de borrar la ruta?";
        }
    }
    cancelarBorrarRutaBd(){
        this.Mensaje="";
        this.displayConfBorrarRuta=false;
    }
    borrarRutaDetalleBd(){
        this.rutaService.deleteRutaDetalleByRu(this.indiceRowTabla).subscribe(
            realizar =>{
                            /* console.log("SE BORRO RECTA DE RUTA");*/
                            this.Mensaje="";
                            this.displayConfBorrarRuta=false;
                            this.overlays=[];/* BORRARNDO OBJETOS  */
                            this.clear();/* LIMPIANDO VARIABLES */
                            
                            /* DESAHABILITANDO BOTONES */
                            this.disButBorrar=true;
                            this.disButEditar=true;
                            this.disButDeshacer=true;
                            this.disButNuevaRuta=true;
                            this.disButSubirRuta=true;

                            /* DESACTIVANDO ADDMARKER */
                            this.activarAddMarker=0;
                        },
            err => {console.log(err);}
        );
    }

    /* Nuevo Registro (BOTON NUEVO - CABECERA) */
    nuevaRutaMaestro(){
        this.displayNuevaRutaModal = true; 
        this.headertitle ="Nueva"; 
        this._RuId = 0;
        
        this.rutaService.newRuta().subscribe(
            data => {
                this.Ruta2 = data; 
                let dia, mes, año, fecha:any;fecha=new Date();
                dia=fecha.getDate(); mes=fecha.getMonth(); año=fecha.getFullYear(); let _fecha:any[]=[]; _fecha[0]=año; _fecha[1]=(mes+1); _fecha[2]=dia; 
                let fActual=_fecha.join("/");  fActual=this. cCeroFecha(fActual); _fecha=fActual.split("/"); fActual=_fecha.join("-"); fActual=fActual.toString();

                /* IGUALANDO OBJETO DEL FORM A DATOS DE NUEVO REGISTRO */
                this.Ruta ={
                    RuId : this.Ruta2.RuId, 
                    EmId : this.emID, 
                    RuDescripcion : this.Ruta2.RuDescripcion, 
                    RuFechaCreacion: fActual, 
                    RuRegMunicipal : this.Ruta2.RuRegMunicipal,
                    RuKilometro : this.Ruta2.RuKilometro, 
                    RuActivo : this.Ruta2.RuActivo, 
                    UsId: this.user_Id,
                    UsFechaReg: new Date()
                }
            });
    }
  
    //guardar en el rest la cabecera de la ruta (MAESTRO)
    saveRutaMaestro(){
         //NUEVO REGISTRO
         if(this._RuId == 0){
            this.Ruta2.RuId = this.Ruta.RuId,
            this.Ruta2.EmId = this.Ruta.EmId,
            this.Ruta2.RuDescripcion = this.Ruta.RuDescripcion,
            this.Ruta2.RuFechaCreacion =  this.fecha(this.Ruta.RuFechaCreacion), //STRING A DATE
            this.Ruta2.RuRegMunicipal = this.Ruta.RuRegMunicipal,
            this.Ruta2.RuKilometro = this.Ruta.RuKilometro,
            this.Ruta2.RuActivo = this.Ruta.RuActivo,
            this.Ruta2.UsId = this.user_Id,
            this.Ruta2.UsFechaReg = new Date()
        
        //EDITAR UN REGISTRO
        }else if(this._RuId != 0){
            this.Ruta.UsFechaReg = new Date();
            this.Ruta.RuFechaCreacion = this.fecha(this.Ruta.RuFechaCreacion);
            this.Ruta2=this.Ruta; //PASANDO DATOS AL OBJETO PARA SER SUBIDO A LA BD
        }

        this.displayNuevaRutaModal=false;
         this.rutaService.saveRuta(this.Ruta2).subscribe( 
                                            realizar => { this.mostrargrillaruta(); this.getAllRutaByEm(1);} ,
                                                 err => { this.errorMessage = err }
                                            );		
    }
    
    /*CANCELAR UN NUEVO REGISTRO (cabecera)*/ 
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
            }
        */
    }

    /* CONSULTAR RUTA POR EMID (para mostrar en la grilla MAESTRO CONSULTA A VARIAS TABLAS) */
    getAllRutaByEm(emId: number){
        this.rutaService.getAllRutaByEm(emId).subscribe(
            data => { this.rutas = data; this.mostrargrillaruta();},
                    err => {this.errorMessage = err}, 
                    () =>this.isLoading = false
            );
    }
   
    //MOSTRAR RESULTADO EN LA GRILLA PRINCIPAL (LISTADO DE RUTAS TRAZADAS POR EMPRESA)
    mostrargrillaruta(){
        this.rutasPresentar=[]; // ARRAY DE RUTAS EXISTENTE
        let _valorTipo: string = "";
        let valueDate:string;
        
        for(let ruta of this.rutas){
            //CONDICIONAL EMPRESA O CONSORCIO
            if (ruta.EmTipo==0)
            _valorTipo="EMPRESA";
            else
            _valorTipo="CONSORCIO";

            //FECHA
            valueDate = this._fecha(ruta.RuFechaCreacion);
            //ARRAY PARA LA GRILLA
            this.rutasPresentar.push({
                nro:0, 
                RuId : ruta.RuId,
                RuDescripcion: ruta.RuDescripcion,
                RuFechaCreacion:valueDate,
                RuKilometro: ruta.RuKilometro,
                EmConsorcio: ruta.EmConsorcio,
                EmTipo:_valorTipo
            });

            //PONIENDO NRO A CADA FILA
            for(let i=0; i<this.rutasPresentar.length; i++){
                this.rutasPresentar[i].nro = i+1;
            }
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
        
        /*OCULTANDO BOTON NUEVO MOSTRANDO BOTON EDITAR */
        this.actBtnNuevo=true;
        this.actBtnEditar=false;

        //crear la nueva rutadetalle
        this.Mensaje="Traza la Nueva Ruta";
        this.displayNuevaRuta=true;

        /*CONSULTA SERVICIO NUEVA RUTADETALLE */
        this.rutaService.newRutaDetalle().subscribe(data=>{this.puntosRutaDetalle=data});

        this.disButNuevaRuta=true; //cuando se crea un nuevo rutadetalle se deshabilita el boton
        this.disButSubirRuta=false;//activar boton subirRuta
        
        this.rutaRecuperada=0; //la ruta no se encuentra en ela BD
        this.activarAddMarker=1; //1 : permite agregar marcadores 
        this.i=0; //se reinicia o inicia el i para ponerlo como indice de los marcadores
    }

    aceptarNuevaRuta(){
        this.Mensaje="";
        this.displayNuevaRuta=false;
    }

    /*GUARDAR RUTADETALLE EN LA BD*/
    guardarPuntosRutaDetalle(){
        let cen:number;
        this.puntosRutaDetalleArray = [];

        //  CONDICIONAL SABER SI EXISTEN OBJETOS EN EL ARRAY OVERLAYS, SABER SI SE GUARDA UNA RUTA VACIA O NO

        /* NO HAY OBJETOS, SE GUARDA RUTA VACIA*/
        if(this.overlays.length==0){ 
            this.puntosRuta = [];
            this.rutaService.deleteRutaDetalleByRu(this.indiceRowTabla).subscribe(
                realizar => {console.log("RUTA VACIA");

                             //ACTIVANDO SELECCION DE ROWS GRILLA modRegistro=1
                             this.modRegistro=1; 
                             
                             /* DESACTIVANDO AGREGAR NODOS */
                             this.activarAddMarker=0;

                             /* ACTIVANDO DESACTIVANDO BOTONES */
                             this.disButBorrar = true;
                             this.disButEditar  = true;
                             this.disButSubirRuta = true;
                             this.disButDeshacer = true;
                             this.disButNuevaRuta = true;
                            },
                err => {console.log(err);}
            );
        
        /* SE ESTA GUARDANDO UN TRIANGULO O UN RUTA */
        }else if(this.overlays.length!=0  && this.overlays.length>=5){ 
            /* CERRANDO RUTA */
            this.ultimalinea();

            /* CARGANDO PUNTOS  A UN ARRAY */
            for(let n=0 ; n<this.puntosRuta.length; n++){
                this.puntosRutaDetalleArray.push({
                        RuDeLatitud:this.puntosRuta[n].RuDeLatitud,
                        RuDeLongitud:this.puntosRuta[n].RuDeLongitud,
                        RuDeOrden:n,
                        RuId:this.indiceRowTabla,
                        UsFechaReg:new Date(),
                        UsId:this.user_Id, 
                        RuDeId:0
                });
            }
    
            /*BORRANDO RUTA ANTERIOR*/ 
            this.rutaService.deleteRutaDetalleByRu(this.indiceRowTabla).subscribe(
                realizar =>{console.log("SE BORRO RECTA DE RUTA");},
                err => {console.log(err);}
            );

            /*SUBIENDO NUEVA RUTA */
            this.rutaService.saveRutaDetalle(this.puntosRutaDetalleArray).subscribe(
                    realizar => {
                                /*this.mgRutaDetalle();*/
                                this.clear();

                                /*ACTIVANDO SELECCION DE ROWS GRILLA modRegistro=1*/
                                this.modRegistro=1 ;    
                                
                                /* DESACTIVANDO AGREGAR NODOS */
                                this.activarAddMarker=0;

                                /* ACTIVANDO DESACTIVANDO BOTONES */
                                this.disButBorrar = true;
                                this.disButEditar  = true;
                                this.disButSubirRuta = true;
                                this.disButDeshacer = true;
                                this.disButNuevaRuta = true;
                            },
                    err => {this.errorMessage=err}
            );

            this.Mensaje="Se guardo Correctamente";
            this.displayGuardarCorrecto=true;
       
            //this.modRegistro==1 //ACTIVANDO LA SELECCION DEL FILAS GRILLA MAESTRO (RUTA TRAZA GUARDADA EN LA BD)
        }else if(this.overlays.length<5){
            this.displayrutaNoPermitida=true;
             this.Mensaje="Error, no se puede guardar la ruta";
             cen=0;
        }

        //this.disButCancelar FALTA PROGRAMACION, NO TIENE USO
        //ACTIVAR Y DESACTIVAR BOTONES AL NO PODER GUARDAR EL DETALLE
        if(cen==0){
            console.log("cen = "+cen);
            this.disButBorrar = false;
            this.disButEditar  = true;
            this.disButSubirRuta = true;
            this.disButDeshacer = false;
            this.disButNuevaRuta = true;
        }
    }

    /* MODAL, NO SE PUEDE GUARDAR RUTA NO PERMITIDA| */
    rutaNoPermitida(){
        this.Mensaje=""
        this.displayrutaNoPermitida=false;
    }

    aceptarGuardarCorrectamente(){
        this.Mensaje="";
        this.displayGuardarCorrecto=false;
    }
    //zoom para el mapa
    zoomIn(map){
   
       map.setZoom(map.getZoom()+1);
    }
    zoomOut(map){
        map.setZoom(map.getZoom()-1);
    }


/* HORA FECHA AJUSTE FORMATOS  */

    //CONVERTIR STRING A DATE FORMULARIO A BD  HORAS
    hora(fecha : string) : Date{
        //FECHA               
        let thoy:Date,  otra:Date, horaTarjeta:string;
        thoy=new Date();
        if(fecha.length<=5){ fecha = fecha+":00"; }
        horaTarjeta=fecha;
        let resultado=horaTarjeta.split(':');
        otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
        //console.log(otra);
        return otra; 
        
    }

    //CONVERTIR DATE A STRING DE BD A FORMULARIO HORAS
    _hora(fecha : Date) :string{
        let hora : string; let _hora : string; let _fecha = new Date(fecha);
        _hora =  (_fecha.getHours() - 1).toString();// restando 1 hora (CORREGIR EN EL BACKEND)
            hora = _hora + ":"+_fecha.getMinutes()+":"+_fecha.getSeconds();

            hora = this.cCeroHora(hora);
        return hora;
    }


    //COMPLETANDO CEROS EN CASO DE NECESITAR PARA HORAS Y FECHAS   2017/
    cCeroHora(h:string) :string{
            //DIVIDIRLO EN PARTES Y COMPLETAR LOS CEROS PARA QUE LOS ELEMENTOS SEAN TODOS PARES
            let hora : string, _hora :string, resultado, i=0;
            resultado = h.split(':');
            while(i<resultado.length){
                if(resultado[i].length%2!=0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _hora=resultado[0]+":"+resultado[1]+":"+resultado[2];
        return _hora;
    }

    cCeroFecha(f : string) :string{
        let fecha:string, _fecha:string, resultado, i=0;
        resultado = f.split('/');
            while(i<resultado.length){
                resultado[i]=resultado[i].trim(); //BORRANDO ESPACIOS EN BLANCO
                if(resultado[i].length%2!=0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _fecha=resultado[0]+"/"+resultado[1]+"/"+resultado[2];
        
        return _fecha
    }

    cCeroFechaForEditar(f : string) :string{
        let fecha:string, _fecha:string, resultado, i=0;
        resultado = f.split('/');
            while(i<resultado.length){
                resultado[i]=resultado[i].trim(); //BORRANDO ESPACIOS EN BLANCO
                if(resultado[i].length%2!=0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _fecha=resultado[0]+"-"+resultado[1]+"-"+resultado[2];
        
        return _fecha
    }
    //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD   2017/03/31  2017-03-31
    fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        console.log("antes :"+_fecha);
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1]) -1 ,  Number(resultado[2]) , 12, 0,0 );
        console.log("despues :"+_thoy);

        return _thoy;
    }


    //CONVERTIR DATE A STRING PARA FECHA  - ---   BD A GRILLA
    _fecha(fecha: Date) :string{
        let fechaProg : string; let _fechaProg : string; let _fecha = new Date(fecha);  
        //_fechaProg=(_fecha.getFullYear()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+(_fecha.getDate()).toString() ;
        _fechaProg=(_fecha.getDate()).toString() +" / "+ (_fecha.getMonth() +1 ).toString() +" / "+(_fecha.getFullYear()).toString() ;
        _fechaProg=this.cCeroFecha(_fechaProg);
        
        return  _fechaProg;
    }
}

var Coords ={
    x:0,
    y:0
}
