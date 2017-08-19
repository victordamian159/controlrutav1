import {Component, OnInit ,ElementRef} from '@angular/core';
import {Message} from 'primeng/primeng';
//import {puntoscontrol, puntosTrazaRuta} from 'app/variables';
import {GlobalVars} from 'app/variables'
import {hora,_hora,_cCeroFecha,cCeroHora,corrigiendoHora,fecha,_fecha,fechaActual1,fechaActual2} from 'app/funciones';
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

    //trazar la ruta
    puntosRuta : any[]=[];
//maestro
    descr:string;
    timeRec:string;

    pcMaestro: any ={ 
        PuCoId : 0,
        RuId : 0,
        PuCoDescripcion:"",
        PuCoTiempoBus : "",
        PuCoClase : "",
        UsId : 3,
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

    /* VARIABLES */
        idFilaSeleccionada: number; /*  ONSELECT ROW GRILLA PRINCIPAL */
        /* idRutaFilaSeleccionada : number; ONSELECT ROW GRILLA PRINCIPAL*/
        private RuId:number;
        private PuCoId:number; /*   event.data.PuCoId; this.idFilaSeleccionada  */

    horaReg : string; /* ONSELECT ROW GRILLA PRINCIPAL*/
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
    disabledInputPos:boolean =true;
    private isLoading: boolean = false;  //captura error en g_etAllPuntoControlDetalleByPuCo
    options: any; //opciones del mapa

    overlays:any[]=[];//formas sobre el mapa (marker, lineas)
    pCArrayDetalleBD:any[]=[];//se almacena los puntos de control
    pCArrayMaestroBD:any[]=[];//se almacena los puntos de control
    coor:any[]=[]; // para almacenas las coordenadas
    lineaRuta:any[]=[];//para trazar la ruta en el mapa
    idDetalle:any; //id del registro detalle puntoControl seleccionado


    x:string; //para pasarlo al objeto pcDetalle
    y:string; //para pasarlo al objeto pcDetalle
    pCMaestroMostrar:any[]=[];//mostrar grilla de lista puntos control
    pCDetalleMostrar:any[]=[]; //mostrar grilla detalle de puntos control
    miniLista:any[]=[];
    pCEditados : any[]=[]; // array editado PUNTOSCONTROL, PARA MANDAR A LA BD

    coordenadas:any[]=[];
    linea:any;
    //flightPlanCoordinates:any[]=[];
    i=0;
    j=0;//para pasar entre las coordenadas en el array COORDENADAS 
    k=0;
    l=0;
    m=0; //reducir en 1 los title de los marker
    n=1; //nro de puntos de control (guardar puntos en rest DETALLE) 
    editar=0; //si editar = 0 (nuevo registro) si editar = 1 (funcion editar) 
    ordenMayor=0; //nro mayor del array de puntos recuperados para el caso de editar

    indexMarkerTitle:string; //index marker para title (string)
    indexMarker=0; //indice de marker
    indexPunto=0; //INDICE DE REGISTRO EN SU ARRAY DE PUNTOS DE CONTROL DETALLE
    mensaje:string;
    selectedPosition:any;
    _selectedPosition:any;
    draggable:boolean;

    /*  VENTANAS MODAL */
    displayNuevoPunto:boolean =false;
    displayEditarCabecera=false;
    displayEditarPunto = false;
    displayListaPuntos: boolean = false; 
    displayElimRegCabecera: boolean = false;
    displayElimRegDetalle: boolean = false;
    displayAddMarker : boolean =false; /* CLICK SOBRE ALGUN OBJETO */
    displayMapaClick : boolean = false;
    displayErrorEditarPuntos : boolean = false;
    displayErrorEditar : boolean = false;
    displayNohayPuntos : boolean = false;
    displayNuevosPuntos : boolean = false;
    displayGuardarPuntosDetalle :boolean=false;
    displayVerificarTiempoPc : boolean = false;
    displayDetallePC : boolean = false;
    displayReaderDetPC : boolean = false;
    displayEditDetPC : boolean = false;
    displayErrorNoSaveEditPC:boolean=false;
    displayNoPuedeOnrowselect:boolean=false;
    /*displayGuardarPuntosDetalle:boolean=false;*/

    mapa:any;

    _PuCoId:number; //almacena el PuCoId para poder usarlo en editar Y ELIMINAR
    _PuCoDeId:number    //PUCODEID PARA ELIMINAR REGISTRO
    //displayEliminarRegistro:boolean=false;
    //infoWindow: any;
    // msgs: Message[] = [];

    //activar y desactivar funciones
    activeAddMarker = 0; // 0 : desactivado     1 : activado
    selectRowGrilla = 0; // 0 : desactivado     1 : activado
    //PARA SABER SI SE ESTA EDITANDO UN REGISTRO O NO, USARLO PARA ALGUN FORMULARIO
    editando    =   0;   // 0: nuevo registro    1: se esta editando un registro         
    dragPunto  =   0;    // 0: no arrastrar      1: arrastrar 

    //ACTIVANDO Y DESACTIVANDO BOTONES DEL MAPA
    desGuardarPCD_BD:boolean;
    desBorrarPCDet:boolean;
    desDeshacerPCDet:boolean;
    desEditarPCDetMarker:boolean;
    desNuevosPuntos : boolean;

    /* OCULTANDO BOTONES */
    ocGuardar:boolean;
    ocBorrar:boolean;
    ocCancelar:boolean;
    ocEditar:boolean;
    ocNuevo:boolean;

    tipoTarjeta={nomb:"", val:""};

    //tipoTarjeta:{nomb:string, val:string};
    tTarj:string;
    _tipoTarjeta = [
        {nomb:"Hora Punta", val:'01'},
        {nomb:"Dias Feriados", val:'02'},
        {nomb:"Dias Normal", val:'03'}
    ];

    /* OTRAS VARIABLES */
        private _ruid:number;
        private rutas:any=[];
        private emID : number;
        private emid:number;
        private userId:number;
        private valueTypeSavePC:number; /* TIPO DE CASO SAVE PNTS CTRL */
        private modoSaveActivo:boolean;
    
    constructor( private pcontrolService: PuntoControlService,/*public el: ElementRef*/ private rutaService: RutaService, public ClassGlobal:GlobalVars){
        this.modoSaveActivo=false;
        this.emid=this.ClassGlobal.GetEmId();
        this.userId=this.ClassGlobal.GetUsId();
        this.activeAddMarker = 0; //addmarker desactivado
        //tambien cuando ya se a guardado los puntos en la BD
        this.emID = this.emid;  /* ID EMPRESA */
        this._ruid =0; /* INICIANDO RUID PARA DESHABILITAR EL BOTON NUEVO PUNTO */
        this._PuCoId=0; /* USADO PARA ACTIVAR Y DESACTIVAR EL BOTON NUEVO PUNTO CONTROL*/
        //DESACTIVANDO BOTONES (MAPA)
         this.desGuardarPCD_BD=true;
         this.desBorrarPCDet=true;
         this.desDeshacerPCDet=true;
         this.desEditarPCDetMarker=true;
         this.desNuevosPuntos =true;

        /* INICIAR HIDDEN BOTONES */
         this.ocNuevo=false;
         this.ocGuardar=true;
         this.ocEditar=false;
         this.ocCancelar=true;
         this.ocBorrar=false;
    }

    //iniciar 
    ngOnInit(){
        this.options={
            center: new google.maps.LatLng(-18.0065679, -70.2462741),
            zoom:14,
            gestureHandling: 'greedy'
        };
        this.getallrutasbyem(this.emID); /* RUTAS DE LA EMPRESA */
        /*console.log(this.emid);
        console.log(this.userId);    */
    }

    /* PROCEDURES */
        /* OTRAS TABLAS */
            /* CONSULTAS */
                /* CONSULTA RUTAS*/
                    getallrutasbyem(emId: number){
                        this.rutaService.getAllRutaByEm(emId).subscribe(
                            data => {this.rutas = data;},
                            err  => {this.errorMessage=err},
                            ()   => this.isLoading=false
                        );
                    }
                /* GET RUTADETALLE */
                    procGetallrutadetallebyru(RuId:number){
                        let ptsRuta:any[]=[];
                        this.rutaService.getAllRutaDetalleByRu(RuId).subscribe(
                            data => {/*this.puntosRuta=data;*/ ptsRuta=data; this.cargarRuta(ptsRuta);},
                            err => {this.errorMessage=err},
                            () => this.isLoading = false 
                        );
                    }
                    
                /* GET ALL PTSCTRLDET BY PUCOID */
                    procGetallptsctrldetbyPuCo(PuCoId:number){
                        let ptsctrl:any[]=[];
                        this.pcontrolService.getAllPuntoControlDetalleByPuCo(PuCoId).subscribe(
                            data => {   ptsctrl=data;
                                        this.pCArrayDetalleBD=ptsctrl.slice(0);
                                        if(ptsctrl.length!=0){
                                            this.cargarmarker(ptsctrl); //CARGAR LOS MARCADORES 
                                            this.mgMiniListaPC(ptsctrl);
                                            /*his.desNuevosPuntos=true; 
                                            this.desDeshacerPCDet=true; //DESACTIVANDO BOTON 
                                            this.ocEditar=false;*/
                                            //this.ocEditar=false;
                                            //this.editando = 1; //se esta editando el array de puntos (existen puntos en la BD) 
                                            
                                        }else if(ptsctrl.length==0){
                                            this.mensaje = "No hay puntos de control"; 
                                            this.displayNohayPuntos = true;
                                            /*this.desNuevosPuntos = false; 
                                            this.desEditarPCDetMarker = true;//ACTIVANDO BOTON */
                                            this.editando = 0; //NUEVO REGISTRO, NO EXISTEN PUTNOS EN LA BD
                                        }
                                    },
                            err => {this.errorMessage = err},
                            () => this.isLoading = false
                        );
                    }
            /* GUARDAR */
            /* ELIMINAR */

        /* TABLA PUNTOCONTROL */
            /* CONSULTAS */
                /* CONSULTA PARA GRILLA PRINCIPAL */
                    getAllPuntoControlByEmRu(emId: number, ruId: number){
                        this.pcontrolService.getAllPuntoControlByEmRu(emId,ruId)
                        .subscribe(
                                data => { this.pCArrayMaestroBD = data; this.mgPuntoControlMaestro();},
                                err  => { this.errorMessage = err}, 
                                ()   =>   this.isLoading = false
                            );
                    }

        /* TABLA PUNTOCONTROLDETALLE */
    /* FUNCIONES TABLAS */
        /* DATATTABLE PUNTO DE CONTROL */
            /* VER TABLA CONTENIDO DE LA LISTA DE PUNTOS DE CONTROL */
                tablaDetalle(_PuCoId){
                    let ptsctrl:any[]=[];
                    /* this.editando = 1;  //activando editar puntonControl */
                    if(this.editando==0){
                        this.displayReaderDetPC=true;
                    }else if(this.editando ==1){
                        this.displayEditDetPC=true;
                    }

                    //RECUPERA PUNTOS DE CONTROL POR EL PuCoId 
                    this.pcontrolService.getAllPuntoControlDetalleByPuCo(_PuCoId).subscribe(
                        data => {   
                                    //ARRAY COORDENADAS PUNTOS DE CONTROL
                                    ptsctrl=data; 
                                    
                                    //CASOS SI EXISTEN PUNTOS DE CONTROL
                                    if(ptsctrl.length != 0){
                                        this.mgPuntosControlDetalle(ptsctrl); //CARGANDO GRILLA PUNTOSDETALLE
                                       
                                        //DESACTIVANDO BOTON 
                                        this.desNuevosPuntos=true;
                                        this.desDeshacerPCDet=true;
                                        //this.editando = 1; //se esta editando el array de puntos (existen puntos en la BD) 

                                    //CASO NO HAY PUNTOS DE CONTROL EN LA BD
                                    }else if(ptsctrl.length == 0){
                                        //HACER UNA VENTANA MODAL PARA ESTE MENSAJE
                                        this.mensaje = "No hay puntos de control";
                                        this.displayNohayPuntos = true;
                                    
                                        //ACTIVANDO BOTON NUEVOS PUNTOS DE CONTROL
                                        this.desNuevosPuntos = false;
                                        this.desEditarPCDetMarker = true;
                                        this.mgPuntosControlDetalle(ptsctrl); 
                                        this.editando = 0; //NUEVO REGISTRO, NO EXISTEN PUTNOS EN LA BD
                                    }
                                },
                        err => {this.errorMessage = err},
                        () => this.isLoading = false
                    );
                }

                cerrarTablaDetalle(){
                    this.displayReaderDetPC=false;
                }
             /* GUARDANDO LO EDITADO DE LA TABLA DE PTOS */ 
                saveEditTDet(){
                    console.log(this.miniLista);
                }
            /* EDITAR CONTENIDO PCTRL */
                canEditTDet(){
                    this.displayEditDetPC=false;
                }

    /* FUNCIONES DEL MAPA */
        /* CLICK SOBRE EL MAPA */
            handleMapClick(event){
                /*CONDICIONAL CLICK SOBRE EL MAPA y addmarker*/
                console.log(this.overlays);
                //addmarker activado
                if(this.activeAddMarker == 1){ 
                    //mostrar modal addmarker
                    //this.selectedPosition=null;
                    this.selectedPosition = event.latLng;

                    //agregando las coordenadas de los markers para mandarlos a la BD
                    this.coordenadas.push(
                        coords = {x:this.selectedPosition.lat(), 
                                y:this.selectedPosition.lng()}
                    );
                    //guardando coordenadas en las variables X y Y 
                    this.x=(coords.x).toString();
                    this.y=(coords.y).toString();
                
                    this.addmarker();
                    this.displayNuevoPunto=true;

                //addmarker desactivado
                }else if(this.activeAddMarker == 0){ 
                    this.mensaje ="No puede agregar punto de control";
                    this.displayMapaClick=true;
                }
            }

        /*CLICK SOBRE FORMA(MARKER, lINE u otras) //borrando puntos con click sobre ellos*/
            handleOverClick(event){
                let isMarker = event.overlay.getTitle != undefined;
                let isCircle = event.overlay.getRadius != undefined;
                let isPolyline = event.overlay.getPath != undefined;
                let lat:any, lng:any;

                lat=0; lng=0;

                lat = event.originalEvent.latLng.lat();
                lng = event.originalEvent.latLng.lng();
                this.selectedPosition = event.originalEvent.latLng;

                /* SE PUEDE AGREGAR PUNTOS CONTROL */
                if(this.activeAddMarker == 1){
                    /* CONDICIONAL MARCADOR O NO */
                    if(isMarker==true){
                        console.log("Marcador");
                        /* ABRIR VENTANA DE PARA EDITAR REGISTRO */ /*console.log(this.buscarPuCoDeId(event.overlay.getTitle()));*/
                        this.editarDetalle(this.buscarPuCoDeId(event.overlay.getTitle()));

                    }else if(isCircle==true){
                        console.log("circulo");
                        /* AGREGAR MARCADOR */
                        this.overlays.push(new google.maps.Marker({
                            /*position: {lat: event.originalEvent.latLng.lat(), 
                                        lng: event.originalEvent.latLng.lng()},*/
                            position:{lat:lat, lng:lng},
                            title:"$",
                            draggable: false             
                        }));
                    }else if(isPolyline==true){
                        console.log("Polyline");
                        //agregando las coordenadas de los markers para mandarlos a la BD
                        this.coordenadas.push(
                            coords = {x:lat, 
                                    y:lng}
                        );
                        //guardando coordenadas en las variables X y Y 
                        this.x=(coords.x).toString();
                        this.y=(coords.y).toString();
                    
                        this.addmarker();
                        this.displayNuevoPunto=true;
                    }
                /* NO SE PUEDE AGREGAR PUNTOS CONTROL */
                }else if(this.activeAddMarker == 0){
                    if(isMarker==true){
                        console.log("Marcador");
                        /* ABRIR VENTANA DE PARA EDITAR REGISTRO */
                        this.editarDetalle(this.buscarPuCoDeId(event.overlay.getTitle()));
                        
                    }else{
                        this.mensaje = "No puede agregar punto de control"
                        this.displayAddMarker = true;
                    }
                }        
            }

        //CLICK SOBRE EL OBJETO --- ESTA FUNCION PARECE Q NO FUNCIONA :/
            handleOverlayClick(event) {
                console.log("CLICK SOBRE EL OBJETO: handleOverlayClick");
                console.log(event);
            }

        //FUNCION DRAG OBJETO (ARRASTRAR OBJETO)
            handleDragEnd(event){
                let x; let y; let j = 0; let cen = 0;
                let indexInOverlays: number;
                let indexArrayParaBD : number;

                x = event.overlay.getPosition().lat();
                y = event.overlay.getPosition().lng();

                indexInOverlays  = this.overlays.indexOf(event.overlay); // INDICE EN ARRAY OBJETOS
            

                /* BUSCANDO EN ARRAY DE PUNTOS(NO OVERLAYS) EL PUNTO PARA ACTUALIZAR SU POSICION*/
                while(j<this.pCArrayDetalleBD.length && cen == 0){
                    if( this.overlays[indexInOverlays].title==this.pCArrayDetalleBD[j].PuCoDeDescripcion){
                        cen=1;
                    }else if((this.overlays[indexInOverlays].title!=this.pCArrayDetalleBD[j].PuCoDeDescripcion)){
                        j++;
                    }
                }

                /* SIGUIENTE BUSQUEDA */
                /* BUSCANDO EL PRIMER NUEVO PC AGREGADO */
                if(cen==0){
                    //ACTUALIZANDO EL ARRAY DE PUNTOS, LAS NUEVAS COORDENADAS Q SE CAMBIARON DE CADA PUNTO
                    this.pCArrayDetalleBD[(indexInOverlays-1)/2].PuCoDeLatitud  = x;
                    this.pCArrayDetalleBD[(indexInOverlays-1)/2].PuCoDeLongitud = y;
                
                /* SE ENCONTRO POR PRIMERA BUSQUEDA */
                }else if(cen==1){
                    //ACTUALIZANDO EL ARRAY DE PUNTOS, LAS NUEVAS COORDENADAS Q SE CAMBIARON DE CADA PUNTO
                    this.pCArrayDetalleBD[j].PuCoDeLatitud  = x;
                    this.pCArrayDetalleBD[j].PuCoDeLongitud = y;
                }   

            

                //BORRANDO CIRCULO PARA ACTUALIZA RPOSICION
                this.overlays[indexInOverlays+1].setMap(null);
                this.overlays.splice(indexInOverlays+1, 1,
                    new google.maps.Circle({ 
                        center: {lat:x , lng:y},
                        radius:100,
                        strokeColor: '#FF0000', 
                        strokeOpacity: 0.8, 
                        strokeWeight: 2, 
                        fillColor: '#FF0000', 
                        fillOpacity: 0.35,
                    })
                );

            }

        /*ADD MARKER ON MAP (PUNTOS DE CONTROL)*/
            addmarker(){
                
                //ACTIVANDO BOTONES SEGUN EL TAMAÑO DE OBJETOS Y DE PUNTOSCONTROL EN SU RESPECTIVO ARRAY
                if(this.overlays.length >0 || this.pCArrayDetalleBD.length > 0){
                    this.desGuardarPCD_BD = false;
                    this.desBorrarPCDet= false;
                    this.desDeshacerPCDet= false;
                    this.desEditarPCDetMarker= true;
                    this.desNuevosPuntos= true;
                }

                //CONDICIONAL AGREGAR MARCADORES addmarker activado
                if(this.activeAddMarker == 1){ 

                    this.disabledInputPos=true; //DESACTIVAR LA POSICION AUTOMATICA 
                    this.draggable=true;
                    this.indexMarkerTitle=this.indexMarker.toString();

                    this.overlays.push(new google.maps.Marker({
                                                                position: {lat: this.coordenadas[this.j].x, 
                                                                        lng: this.coordenadas[this.j].y},
                                                                title:this.indexMarkerTitle,
                                                                draggable: this.draggable              
                                                            }
                    ));

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
                        radius:100
                    }));
                    this.j++;
                    console.log(this.overlays);
                }else if(this.activeAddMarker == 0){ //addmarker desactivado
                    //PONER EN VENTANA MODAL COMO MENSAJE PARA EL USUARIO
                    console.log("seleccione un registro de la tabla o haga click sobre el boton nuevo");
                }
            }
        /*CARGAR LA RUTA AL MAPA*/
            cargarRuta(puntosRuta=[]){
                let coordenadas:any[]=[];
                for(let n=0; n<puntosRuta.length; n++){
                    coordenadas.push({
                        lat:puntosRuta[n].RuDeLatitud,
                        lng:puntosRuta[n].RuDeLongitud
                    });
                }

                /*ULTIMA LINEA DE CIERRE #0B610B */ 
                coordenadas.push({
                    lat:puntosRuta[0].RuDeLatitud,
                    lng:puntosRuta[0].RuDeLongitud
                })
                if(this.overlays.length!=0){
                    this.overlays.unshift(
                        new google.maps.Polyline({
                            path: coordenadas, 
                            strokeColor: '#21610B',
                            strokeOpacity : 0.8,
                            strokeWeight :8 
                    }));
                }else if(this.overlays.length==0){
                    this.overlays.push(
                        new google.maps.Polyline({
                            path: coordenadas, 
                            strokeColor: '#21610B',
                            strokeOpacity : 0.8,
                            strokeWeight :8 
                    }));
                }
                

            }

        /*CARGAR LOS MARCADORES SOBRE EL MAPA */
            //cargarmarker(){
            cargarmarker(pts=[]){
                //CONDICIONAL PARA PODER EDITAR MARCADORES (DRAGGABLE=TRUE) ----- //REVISAR LA VARIABLE THIS.EDITANDO SI SE PUEDE INTEGRAR, 
                //TAMBIEN AL AGREGAR MARCADORES ARRASTRABLES O NO EN ADDMARKER

                //EDITANDO DESACTIVADO
                if(this.editando == 0){ 
                    //for(let marker of this.pCArrayDetalleBD){
                    for(let marker of pts){
                        this.overlays.push(
                            new google.maps.Marker({
                                position:{lat:marker.PuCoDeLatitud , lng:marker.PuCoDeLongitud},
                                title:marker.PuCoDeDescripcion,
                                //label:(this.pCArrayDetalleBD.indexOf(marker)+1).toString(), 
                                label:(pts.indexOf(marker)+1).toString(), 
                                draggable:false
                            }));
                        this.overlays.push(
                            new google.maps.Circle({strokeColor: '#FF0000', strokeOpacity: 0.8, 
                                                    strokeWeight: 2, fillColor:'#FF0000',fillOpacity: 0.35,
                                                    center: {lat:marker.PuCoDeLatitud,lng:marker.PuCoDeLongitud},
                                                    radius:100}));
                    }

                // EDITANDO ACTIVADO
                }else if(this.editando == 1){ 
                    //for(let marker of this.pCArrayDetalleBD){
                    for(let marker of pts){
                        this.overlays.push(
                            new google.maps.Marker({
                                position:{lat:marker.PuCoDeLatitud , lng:marker.PuCoDeLongitud},
                                title:marker.PuCoDeDescripcion,
                                //label:(this.pCArrayDetalleBD.indexOf(marker)+1).toString(),
                                label:(pts.indexOf(marker)+1).toString(),
                                draggable:true
                            })
                        );

                        this.overlays.push(
                            new google.maps.Circle({ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2, fillColor: '#FF0000', fillOpacity: 0.35,
                                center: {lat:marker.PuCoDeLatitud , lng:marker.PuCoDeLongitud},
                                radius:100
                            })
                        );

                    }
                }

            }


    /* FUNCIONES VARIADAS */
        /* COMBOS */
            /* FUNCION RUID COMBOBOX*/
                _rutaid(event:Event){
                    this.pcMaestro.RuId=this._ruid;
                    /* CONSULTA PARA GRILLA PRINCIPAL */
                    this.getAllPuntoControlByEmRu(this.emID,this._ruid);
                }

        /* OTRAS */
            /* BUSCANDO PUCODEID PARA CUADRO EDITAR */
                buscarPuCoDeId(titleMarker:string) :number{
                    let PuCoDeId=0,i=0,cen=0;
                    /* BUSCANDO PUCODEID */
                    while(i<this.pCArrayDetalleBD.length && cen==0){
                        if(this.pCArrayDetalleBD[i].PuCoDeDescripcion == titleMarker){
                            PuCoDeId = this.pCArrayDetalleBD[i].PuCoDeId;
                            cen=1;
                        }else if(this.pCArrayDetalleBD[i].PuCoDeDescripcion != titleMarker){
                            cen=0;
                        }
                        i++;
                    }
                    return PuCoDeId;
                }

    

    
     //ACEPTAR PUEDE AGREGAR MARKER 
    aceptarClickObjeto(){
        this.mensaje="";
        this.displayAddMarker=false;
    }

    aceptarModalAgregarMarker(){
        this.mensaje="";
        this.displayMapaClick=false;
    }

    

    //ACTUALIZANDO LOS PUNTOS DE CONTROL AL GUARDAR LA BD
    actualizarOrdenPC(){
        let i=0; let j;
        while(i<this.pCArrayDetalleBD.length){
                this.pCArrayDetalleBD[i].PuCoDeOrden=i+1;
            i++;
        }
    }

   
    

//PUNTO CONTROL MAESTRO
    //funcion nueva Maestro de puntos de control (BOTON NUEVO)
    newPuntoControlMaestro(){
        this.headertitle = "Nueva Lista De Puntos de Control";
        this.editar = 0; // si editar es cero es nuevo registro
        this._PuCoId=0;
        this.displayListaPuntos = true;
        this.pcontrolService.newPuntoControl().subscribe(data => {
            this.pcMaestroBD=data; 
            /* LIMPIANDO VARIABLES*/
            this.descr="";
            this.timeRec="";
            this.tTarj="";
        });
        
    }

    //SELECCION REGISTRO CABECERA (Y MUESTRA SU CONTENIDO DETALLE)
    onRowSelectMaestro(event){     
        /* NO SE ESTA EDITANDO ALGO Y NO PUEDE ARRASTRAR MARKER, DESBLOQUEO CARGARUTA Y PTS */
        if(this.modoSaveActivo == false){
            let RuId:number,PuCoId:number; 
            PuCoId=event.data.PuCoId; RuId=event.data.RuId;
            this.idFilaSeleccionada=event.data.PuCoId; 
            this.idDetalle = this.idFilaSeleccionada; // funcion guardar if editado=1
            this.PuCoId=PuCoId; this.RuId=RuId;
            this.horaReg = event.data.PuCoTiempoBus;

            //DESACTIVANDO O ACTIVANDO BOTONES
                this.desGuardarPCD_BD=true; 
                this.desBorrarPCDet=true; 
                this.desEditarPCDetMarker=false;

            //DESACTIVANDO EDITAR Y NO ARRASTRAR MARCADORES
                this.j=0; //PONER CLEAR PARA REINICIAR LAS VARIABLES -> BORRAR ESTA LINEA
                this.mayorOrdenPuntos();//PARA EL CASO DE EDITAR UNA LISTA EXISTENTE
                
            /*limpiar el mapa para ponerle los nuevos marcadores*/
            this.overlays = [];  
            this.puntosRuta=[]; 
            this.pCArrayDetalleBD=[]; 
            this.coordenadas =[]; 
            this.miniLista=[];

            /* SOLO CARGAR RUTA Y MARCADORES */
            this.procGetallrutadetallebyru(RuId);
            this.procGetallptsctrldetbyPuCo(PuCoId);
            console.log(this.overlays);
        /* SI SE ESTA EDITANDO ALGO, BLOQUEADO HASTA Q TERMINE DE EDITAR */
        }else if(this.modoSaveActivo == true){
            /* MENSAJE DICIENDO QUE NO SE PUEDO SELECCIONAR UN ROW SI NO GUARDO ANTES LO QUE ESTA EDITANDO */
            this.mensaje="Guarde modicacion para poder seleccionar otro registro";
            this.displayNoPuedeOnrowselect=true;
        }
    }
    /* ACEPTAR QUE NO SE PUEDE HACER CLIC SOBRE OTRA FILAS HASTA NO GUARDAR LO QUE SE ESTA HACIENDO */
    aceptarNoPuedeSelRow(){
        this.mensaje="";
        this.displayNoPuedeOnrowselect=false;
    }
    aceptarNoHayPuntos(){
        this.mensaje="";
        this.displayNohayPuntos=false;
    }

    //SELECCION DE PUNTOS DE CONTROL DE LA GRILLA DETALLE
    onRowSelectDetalle(event){
        console.log("seleccionando detalle =D");
        //CENTRAR EL MAPA EN EL PUNTO DE CONTROL
    }

    /* CARGANDO LISTA(AYUDA) NUEVO PUNTO C. VTN MODAL */
    mgMiniListaPC(arrPC = []){
        let _arrPC=[];
        this.miniLista=[];
        for(let punto of arrPC){
            this.miniLista.push({
                nro:0,
                PuCoDeDescripcion:punto.PuCoDeDescripcion,
                PuCoDeHora:_hora(punto.PuCoDeHora)
            });
        }
        for(let i=0;i<arrPC.length;i++){
            this.miniLista[i].nro=i+1;
        }
    }

    
    
    //para editar la tabla maestro (grilla)BOTON DE LAS FILAS EDITAR CABECERA
    editarMaestro(_puCoId:number){
        this.displayListaPuntos=true; //MOSTRAR CUADRO DE NUEVA LISTA PUNTOS(CABECERA)
        this.headertitle="Editar Lista" //TITULO PARA LA VENTANA
        this.tipoTarjeta.val="";
        this._PuCoId = _puCoId; //GUARDANDO ID PARA USARLO PARA SABER SI SE ESTA GUARDANDO(ID = 0) O EDITANDO(ID != 0)
        
        //CONSULTAR A LA BD Y CARGAR EL OBJETO PARA EDITAR this.pcMaestro
        this.pcontrolService.getPuntoControlById(_puCoId).subscribe(
            data => {this.pcMaestro = data; 
                    /* HORA */
                     this.pcMaestro.PuCoTiempoBus=_hora(this.pcMaestro.PuCoTiempoBus);
                     this.timeRec=this.pcMaestro.PuCoTiempoBus;
                    /* DESCRIPCION */
                     this.descr=this.pcMaestro.PuCoDescripcion;
                    /* TIPO TARJETA */ 
                     this.tipoTarjeta.val=this.pcMaestro.PuCoClase;
                     this.tTarj=this.pcMaestro.PuCoClase;
                    }, 
            err =>{this.errorMessage = err}, () =>this.isLoading=false);
    }

    //ELIMINAR UN REGISTRO DE LA TABLA MAESTRO PUNTOCONTROL
    eliminarMaestro(_PuCoId : number){   
        //console.log("eliminar =D"+ _PuCoId);
        this._PuCoId = _PuCoId;
        this.mensaje = "¿Esta Seguro de Eliminar el Registro?";
        this.displayElimRegCabecera=true;
    }

    _eliminarMaestro(){
        this.pcontrolService.deletePuntoControl(this._PuCoId).subscribe(
            realizar => {this.getAllPuntoControlByEmRu(1,51);
                        this.mgPuntoControlMaestro();
                        this.displayElimRegCabecera=false;
                        this.mensaje ="";}, 
            err => {console.log(err);}
        );
    }

    cancel_eliminarMaestro(){
        this._PuCoId = 0;
        this.mensaje ="";
        this.displayElimRegCabecera = false;
        console.log("aqui");
    }

    //ELIMINAR EL DETALLE DE LOS PUNTOS CONTROL
    eliminarDetalle(_PuCoDeId : number){
        //BUSCANDO EL ID DEL REGISTRO A EDITAR
        if(this.editando == 1){ // 0: nuevo registro    1: se esta editando un registro
           this._PuCoDeId = _PuCoDeId;
           this.displayElimRegDetalle=true;
           this.mensaje = "¿Esta Seguro de Eliminar El Punto de Control?";
        }else if(this.editando == 0){
            //MOSTRARLO EN UNA VENTANA MODAL
            this.mensaje="Error, No se puede Eliminar de la Tabla de Puntos";
            this.displayErrorEditarPuntos=true;
            //console.log("no se puede editar el registro");
        }    
    }

    //ACEPTAR, NO PUEDE EDITAR EL REGISTRO DE PUNTOS DE CONTROL DETALLE
    aceptarEditarPuntos(){
        this.mensaje="";
        this.displayErrorEditarPuntos=false;
    }

    _eliminarDetalle(){
         //BUSCANDO EL OBJETO EN EL ARRAY
            let j=0;
            let cen=1; // 1: encontrado    0: no encontrada
            //BUSCANDO REGISTRO A ELIMINAR DEL ARRAY Q VA A LA BD
            while(j<this.pCArrayDetalleBD.length && cen == 1){
                if(this.pCArrayDetalleBD[j].PuCoDeId != this._PuCoDeId){
                    j++;
                }else if(this.pCArrayDetalleBD[j].PuCoDeId ==  this._PuCoDeId){
                    cen = 0;
                    /*console.log("encontrado =D: "+ j);*/
                }
            }
            this.pCArrayDetalleBD.splice(j,1); //ELIMINANDO UN SOLO ELEMENTO DESDE LA POSICION J
            /*this.mgPuntosControlDetalle(); //CARGANDO LA GRILLA PUNTOS DETALLE*/
            this.procGetallptsctrldetbyPuCo(this.PuCoId);
            this.displayElimRegDetalle=false;
    }

    cancel_eliminarDetalle(){
        this._PuCoDeId = 0;
        this.mensaje="";
        this.displayElimRegDetalle=false;
    }
    //guardar nuevo Maestro puntos de control
    guardarPCMaestro(){      
        this.pcMaestroBD={
            PuCoId : this.pcMaestro.PuCoId,
            PuCoDescripcion : this.descr, 
            RuId : this.pcMaestro.RuId,
            PuCoTiempoBus : hora(this.timeRec),
            PuCoClase :  this.pcMaestro.PuCoClase,
            UsId : this.userId,
            UsFechaReg : new Date()
        }

        /* NUEVO REGISTRO*/
        if(this._PuCoId == 0){
            this.pcMaestroBD.PuCoId=0;
        /* EDITANDO REGISTRO*/
        }else if(this._PuCoId != 0){ 
            this.pcMaestroBD.PuCoId=this._PuCoId;
        }
   
        /* PROCEDURE GUARDAR CABECERA| */
        this.pcontrolService.savePuntoControl(this.pcMaestroBD).subscribe(
                        realizar => {this.getAllPuntoControlByEmRu(this.emID,this._ruid);/* CONSULTA PARA GRILLA PRINCIPAL */}, 
                        err => {this.errorMessage=err}
        );
        this.displayListaPuntos = false;
    }

    //cancelar la agregacion de un Maestro punto de control
    cancelarPCMaestro(){
        console.log("lista cancelada");
        this.displayListaPuntos = false;
    }

//DETALLE PUNTOS CONTROL 
    activarInputPos(){ //activar el textbox de ingresar posicion
        this.disabledInputPos=!this.disabledInputPos;
        this.pcDetalle.PuCoDeOrden = 0;
    }

    //nuevo puntoControlDetalle
    procNuevoPtoCrtlDet(){
        this.pcontrolService.newPuntoControlDetalle().subscribe(data => {this.pcDetalleRest=data});
    }
    
    

    //VENTANA MODAL EDITAR SOLO EL NOMBRE Y TIEMPO MAS NO LA POSICION EDITAR PUNTOS CONTROL-> LLAMAR A LA FUNCIONA ELIMINAR PARA PODER BORRAR TODOS  LOS PUNTOS DE CONTROL EXISTENTES Y PODER MANDAR LA NUEVA LISTA MODIFICADA
    editarDetalle(_PuCoDeId : number){
        let i=0 /*i: variable busqueda */ 
          ,cen=0 /*i: variable centinela */;

        /* ARRAY DE PUNTOS CONTROL */
        let puntos = this.pCDetalleMostrar;

        /*SE PULSO EL BOTON EDITAR*/
        if(this.editando==1){   
           //BUSCANDO OBJETO X _PUCODEID EN EL ARRAY DEVUELTO
           while(i<puntos.length && cen==0){
               if(puntos[i].PuCoDeId != _PuCoDeId){
                   i++;
               }else if(puntos[i].PuCoDeId == _PuCoDeId){
                   cen=1;
               }
           } 
           this.pcDetalle = puntos[i];
           this.indexPunto = i;
           this.displayEditarPunto = true;
        
        /*NO SE PULSO EL BOTON EDITAR*/
        }else if(this.editando==0){ 
            //MENSAJE EN LA PANTALLA
            this.mensaje="No se Puede Editar el Registro"
            this.displayErrorEditar=true
            //console.log("NO SE PUEDE EDITAR");
        }
    }

    aceptarErrorEditar(){
        this.mensaje = "";
        this.displayErrorEditar= false;
    }

    //GUARDAR DETALLE PUNTO CONTROL EN ARRAY PERO NO ES SUBIDO A LA BD HASTA PRESIONAR EL BOTON GUARDAR PUNTOS
    //BOTON GUARDAR PUNTOS (CUADRO MODAL AGREGAR PUNTO CONTROL)
    guardarPuntoControlDetalle(){   
        this.procNuevoPtoCrtlDet(); // crear un nuevo punto (REST)
        console.log(this.overlays);

       /* NUEVA LISTA DE P.CONTROL */
       if(this.editando == 0 ){
            let pos=this.pCArrayDetalleBD.length;
            /* ORDEN AUTOMATICA */
            if(this.disabledInputPos == true){ 
                /* ARRAY  DE PUNTOS */
                this.pCArrayDetalleBD.push({
                        PuCoDeId : 0,
                        PuCoId : this.idFilaSeleccionada,
                        PuCoDeLatitud : Number(this.x),
                        PuCoDeLongitud : Number(this.y),
                        PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                        PuCoDeHora : hora(this.pcDetalle.PuCoDeHora),
                        UsId : this.userId,
                        UsFechaReg : new Date(),
                        //PuCoDeOrden : this.n - segun se vaya agregando al final
                        PuCoDeOrden : pos+1
                    });
                
                this.miniLista.push({
                    nro:this.pCArrayDetalleBD.length,
                    PuCoDeDescripcion:this.pcDetalle.PuCoDeDescripcion,
                    PuCoDeHora:this.pcDetalle.PuCoDeHora
                });

            /* ORDEN MANUAL */
            }else if(this.disabledInputPos==false){
                /*let pos:number; pos=this.pcDetalle.PuCoDeOrden;*/
                
                let pos:number; let _pos:number;
                _pos=this.pcDetalle.PuCoDeOrden;

                if(_pos <=0){
                    pos=1;
                }else if(_pos>this.pCArrayDetalleBD.length){
                    pos=this.pCArrayDetalleBD.length+1;
                }else if(0<_pos && _pos<=this.pCArrayDetalleBD.length){
                    pos=this.pcDetalle.PuCoDeOrden;
                }

                /* ARRAY  DE PUNTOS */
                this.pCArrayDetalleBD.splice(pos-1,0,{
                        PuCoDeId : 0,
                        PuCoId : this.idFilaSeleccionada,
                        PuCoDeLatitud : Number(this.x),
                        PuCoDeLongitud : Number(this.y),
                        PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                        PuCoDeHora : hora(this.pcDetalle.PuCoDeHora),
                        UsId : this.userId,
                        UsFechaReg : new Date(),
                        PuCoDeOrden : this.pcDetalle.PuCoDeOrden-- 
                });

                this.miniLista.splice(pos-1,0,{
                    nro:pos,
                    PuCoDeDescripcion:this.pcDetalle.PuCoDeDescripcion,
                    PuCoDeHora:this.pcDetalle.PuCoDeHora
                });

                //actualizando orden de los demas puntos de control
                let n = pos; // n = 4
                while( n <this.pCArrayDetalleBD.length){  //4 < 8
                    this.pCArrayDetalleBD[n].PuCoDeOrden =   (n+1); 
                    n++;
                }

                let _n = pos; // n = 4
                while( _n <this.miniLista.length){  //4 < 8
                    this.miniLista[_n].nro = (_n+1); 
                    _n++;
                }
                this.pcDetalle.PuCoDeOrden=0; /* VOLVIENDO A CERO */
            }
       
       /* AGREGANDO NUEVOS PUNTOS */
       }else if(this.editando == 1){
            /* POSICION AUTOMATICO */
            if(this.disabledInputPos == true){ 
                let pos=this.pCArrayDetalleBD.length;
                //ENCONTRANDO NRO DE ORDEN MAYOR EN EL ARRAY DE PUNTOS
                this.pCArrayDetalleBD.push({ 
                        PuCoDeId : 0,
                        PuCoId : this.idFilaSeleccionada,
                        PuCoDeLatitud : Number(this.x),
                        PuCoDeLongitud : Number(this.y),
                        PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                        PuCoDeHora : hora(this.pcDetalle.PuCoDeHora),
                        UsId : this.userId,
                        UsFechaReg : new Date(),
                        PuCoDeOrden : pos+1 //segun se vaya agregando al final
                    });
                
                /* CARGANDO LA MINILISTA */
                this.miniLista.push({
                    nro:pos+1,
                    PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                    PuCoDeHora:this.pcDetalle.PuCoDeHora
                });
            /* POSICION MANUAL */
            }else if(this.disabledInputPos==false){
                console.log("manual");
                let pos:number; let _pos:number;
                _pos=this.pcDetalle.PuCoDeOrden;

                if(_pos <=0){
                    pos=1;
                }else if(_pos>this.pCArrayDetalleBD.length){
                    pos=this.pCArrayDetalleBD.length+1;
                }else if(0<_pos && _pos<=this.pCArrayDetalleBD.length){
                    pos=this.pcDetalle.PuCoDeOrden;
                }
                
                /* CARGANDO ARRAY PARA BD */
                this.pCArrayDetalleBD.splice(pos-1,0,{ 
                    PuCoDeId : 0,
                    PuCoId : this.idFilaSeleccionada,
                    PuCoDeLatitud : Number(this.x),
                    PuCoDeLongitud : Number(this.y),
                    PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                    PuCoDeHora : hora(this.pcDetalle.PuCoDeHora),
                    UsId : this.userId,
                    UsFechaReg : new Date(),
                    PuCoDeOrden : pos
                });
                for(let i=0; i<this.pCArrayDetalleBD.length;i++){
                    this.pCArrayDetalleBD[i].PuCoDeOrden=i+1;
                }
                /* CARGANDO LA MINILISTA */
                this.miniLista.splice(pos-1,0,{
                    nro:pos,
                    PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                    PuCoDeHora:this.pcDetalle.PuCoDeHora
                });
                for(let i=0; i<this.miniLista.length;i++){
                    this.miniLista[i].nro=i+1;
                }
                
            }   

            /*PASANDO AL SIGUIENTE PUNTOS AL FINAL*/
            this.ordenMayor = this.ordenMayor+1; 

       //CASO NO ARRAY, VACIO
       }else if(this.editando==1 && this.pCArrayDetalleBD.length==0){
           //this.editand_o=1; // NUEVO REGISTRO
           this.pCArrayDetalleBD = []; //reiniciando el array como VACIO

           //REINICIANDO VARIABLES  HACER UN MENSAJE EN VENTANA MODAL
           console.log("Se guardo una lista vacia");
       }
        
        this.pcDetalle.PuCoDeDescripcion=null;
        this.pcDetalle.PuCoDeHora=null;
        this.n++;   /* ORDEN PARA LOS PTSCTRL */
        this.displayNuevoPunto = false; //CERRANDO MODAL 
    }

    editandoRegistroDetalle(){
        let pos;
        pos = this.pCArrayDetalleBD[this.indexPunto].PuCoDeOrden; //POSICION ORIGINAL
        //BUSCNADO EL INDICE EN EL ARRAY EN LA CUAL TIENE Q GUARDARSE   pCArrayDetalleBD
        this.pCArrayDetalleBD[this.indexPunto].PuCoDeHora = hora(this.pcDetalle.PuCoDeHora);
        this.pCArrayDetalleBD[this.indexPunto].PuCoDeDescripcion = this.pcDetalle.PuCoDeDescripcion;
        this.pCArrayDetalleBD[this.indexPunto].PuCoDeOrden = this.pcDetalle.PuCoDeOrden;//NUEVA POSICION

        if(pos != this.pcDetalle.PuCoDeOrden){
                    //              nueva posicion          objeto                                    indice objeto   
            this.reOrdenarPosicion(this.pcDetalle.PuCoDeOrden, this.pCArrayDetalleBD[this.indexPunto],this.indexPunto);
        }
        this.actualizarOrdenPC(); 
        /*this.mgPuntosControlDetalle();*/
        this.procGetallptsctrldetbyPuCo(this.PuCoId);
        this.displayEditarPunto = false;
    }

    //                NUEVA POS       OBJETO      INDICE OBJ      
    reOrdenarPosicion(nro : number, obj: Object, index1 : number){
        let i = nro - 1, _obj;//INDICE DE LA NUEVA POSICION DEL OBJETO
        //NUEVA POSICION(NEW INDEX) > INDICE OBJ
        if(i > index1){
            this.pCArrayDetalleBD.splice(i+1,0,obj); //MUEVO EL OBJETO EN LA POSICION REQUERIDA
            this.pCArrayDetalleBD.splice(index1,1);
        //NUEVA POSICION < POSICION ACTUAL
        }else if(i < index1){ 
            this.pCArrayDetalleBD.splice(i,0,obj); //MUEVO EL OBJETO EN LA POSICION REQUERIDA
            this.pCArrayDetalleBD.splice(index1 + 1,1); //ELIMINA EL ELEMENTO ORIGINAL EN SU POSICION ACTUAL
        }

    }
    
    cancelarEditandoRegistroDetalle(){
        this.displayEditarPunto = false;
        this.pcDetalle.PuCoDeHora = "";
        this.pcDetalle.PuCoDeDescripcion = "";
        //this.pcDetalle.PuCoDeHora = "";
    }

    mayorOrdenPuntos(){
        let arrayBD:any[]=[];
        let arrayNros:any[]=[];
        let nroMayor : number;

         //recuperadno putnos de control por el PuCoId 
        this.pcontrolService.getAllPuntoControlDetalleByPuCo(this.idFilaSeleccionada)
        .subscribe(
            data => {
                        arrayBD=data; 
                        for(let i=0; i<arrayBD.length; i++){arrayNros.push(arrayBD[i].PuCoDeOrden);}
                        nroMayor = Math.max(...arrayNros);
                        this.ordenMayor = nroMayor;
                    },
            err => {this.errorMessage = err},
            () => this.isLoading = false
        );
    }

    //GUARDANDO EN LA BD DESDE MAPA
    guardarpuntosDetalleRest(){
       this.ocNuevo=false;/* MOSTRAR BTNNUEVO*/
       this.ocGuardar=false;/* OCULTAR BTNGUARDAR*/
       let cen:boolean=false, error:string="no error";
       let su:string; this.actualizarOrdenPC();
       su = this.sumatoriaTiempoPC(this.pCArrayDetalleBD); //COMPROBAR SI ESTA BIEN LOS TIEMPOS
       su=this.horaReg;/* REVISAR ESTA PARTE*/


       /* LA SUMATORIA DE TIEMPOS ESTA BIEN */
       if(this.horaReg == su){
           console.log(this.editando);
           console.log(this.pCArrayDetalleBD.length);
            /*SAVE NUEVOS PUNTOS*/
            if(this.editando == 0 && this.pCArrayDetalleBD.length!=0){ 
                /* PROCEDURE */
                this.pcontrolService.savePuntoControlDetalle(this.pCArrayDetalleBD).subscribe(
                        realizar => {/*this.mgPuntosControlDetalle();*/ this.hidDblBtn(1);},
                             err => {this.errorMessage=err}
                    );
    
            //SE ESTA EDITANDO LISTADO EXISTENTE
            }else if(this.editando == 1 && this.pCArrayDetalleBD.length!=0){ 
                /* CORREGIR ESTA PARTE, NO DEBE BORRAR EL REGISTRO SOLO VACIARLO */
                    this.pcontrolService.deletePuntoControlDetalleByRu(this.idDetalle).subscribe(
                        realizar => {cen=realizar;
                                        if(cen == true){ 
                                            this.hidDblBtn(2);
                                            console.log(this.pCArrayDetalleBD);
                                            for(let x=0; x<this.pCArrayDetalleBD.length; x++){
                                                this.pCArrayDetalleBD[x].PuCoDeId = 0;
                                            }
                                            this.pcontrolService.savePuntoControlDetalle(this.pCArrayDetalleBD).subscribe(
                                                    realizar => {console.log("se guardo correctamente");},
                                                         err => {this.errorMessage=err}
                                            );
                                        }else if(cen==false){
                                            this.hidDblBtn(3);
                                            console.log("no se puede guardar los puntos de control :c");
                                        }
                                    }, 
                             err => {console.log(err); this.hidDblBtn(4);},
                             () => {/*console.log("no hubo error al guardar C:");*/}
                    );
            
            /*SAVE LISTA VACIA*/
            }else if(this.pCArrayDetalleBD.length == 0 && this.editando == 1){ 
                //BORRANDO TODOS LOS REGISTROS DETALLE EN LA BD POR EL PUCOID Y PONER LOS NUEVOS ENCIMA
                this.pcontrolService.deletePuntoControlDetalleByRu(this.idDetalle).subscribe(
                        realizar => {console.log("SE BORRO TODO LOS PUNTOS DEL MAPA"); this.hidDblBtn(5);},  
                        err => {console.log(err);}
                );
            }
        
       /* LA SUMATORIA DE TIEMPOS NO ESTA BIEN */
       }else if(this.horaReg != su){
           this.mensaje="Verifique los Tiempos: "+this.horaReg+" --"+su;
           this.displayVerificarTiempoPc = true;
       }
    }
    
    /* MENSAJE SEGUN CASO EN GUARDAR PUNTOS */
    hidDblBtn(value:any){
        if(value==1){
            this.mensaje="Se Guardo los Puntos Correctamente";
            this.displayGuardarPuntosDetalle=true;
            //this.reiniciarVariables();//REINICIANDO LA VARIABLES
            //this.cargarRuta();
            //this.cargarmarker();
            this.editando=0;//0: NUEVA LISTA      1: EDITANDO LISTA(BD)
            this.dragPunto=0 //MARKER NO DRAGGABLE
            this.activeAddMarker = 0; //0: desactivado,   1: activado
        }else if(value==2){
            this.displayGuardarPuntosDetalle=true;
            this.mensaje="edito lista existe, se guardo puntos de control";
        }else if(value==3){   
            this.displayGuardarPuntosDetalle=true;
            this.mensaje="No se pudo guardar los puntos de control :c";
        }else if(value==4){
            this.displayGuardarPuntosDetalle=true;
            this.mensaje="No se puede editar la lista, esta siendo utilizados en tarjetas de control";
            
        }else if(value==5){
            this.displayGuardarPuntosDetalle=true;
            this.mensaje="Guardo una lista vacia";
        }
        this.valueTypeSavePC=value;
    }

    /* ACEPTA, MENSAJE NO SE PUEDE EDITAR LISTA DE PUNTOS DE CONTROL */
    noEditPuntosControl(){
        this.mensaje="";
        this.displayErrorNoSaveEditPC=false;
    }

    //VERIFICAR TIEMPOS EN LOS PUTNOS DE CONTROL
    verificarTiemposPc(){
        this.mensaje="";
        this.displayVerificarTiempoPc=false;
    }

    /* ACEPTAR, OCULTAR Y ACTIVAR BTNS */
    aceptarGuardarPuntosDetalle(){
        /* GUARDANDO UNA NUEVA LISTA */
        if(this.valueTypeSavePC==1){
            //DESACTIVANDO ACTIVANDO BOTONES MAPA
                this.desBorrarPCDet = true;
                this.desDeshacerPCDet= true;
                this.desEditarPCDetMarker = true;
                this.desGuardarPCD_BD = true;
                this.desNuevosPuntos = true;

            /* MOSTRANDO BOTONES */ 
                this.ocNuevo=false;
                this.ocGuardar=true;
                this.ocEditar=false;
                this.ocCancelar=true;
                this.ocBorrar=false;
            console.log(this.valueTypeSavePC);
            this.activeAddMarker=0;
            this.dragPunto=1; 
            this.editando=0;
            this.reiniciarVariables(this.editando,this.dragPunto);
            
            this.procGetallptsctrldetbyPuCo(this.PuCoId);
            this.procGetallrutadetallebyru(this.RuId);

        /* SE GUARDO CORRECTAMENTE LOS NUEVOS PTOS AGREGADOS */
        }else if(this.valueTypeSavePC==2){
            console.log(this.valueTypeSavePC);
            this.ocGuardar=true;
            this.desBorrarPCDet=true;
            this.ocEditar=false;
            this.desEditarPCDetMarker=false;

            /* RECARGAR MARCADORES EN NO ARRASTRABLES */
            this.editando=0;
            this.dragPunto=0;
            this.reiniciarVariables(this.editando,this.dragPunto);
            this.activeAddMarker = 0;
            this.procGetallptsctrldetbyPuCo(this.PuCoId);
            this.procGetallrutadetallebyru(this.RuId);
        }else if(this.valueTypeSavePC==3){
            console.log(this.valueTypeSavePC);

        /* No se puede editar la lista, esta siendo utilizados en tarjetas de control */
        }else if(this.valueTypeSavePC==4){
            console.log(this.valueTypeSavePC);
            /* RECARGAR LA LISTA Y PUNTOS DEL MAPA */
            

            this.editando=0;//0: NUEVA LISTA      1: EDITANDO LISTA(BD)
            this.dragPunto=0 //MARKER NO DRAGGABLE
            this.reiniciarVariables(this.editando,this.dragPunto);
            this.activeAddMarker = 0; //0: desactivado,   1: activado

            this.ocGuardar=true;
            this.ocEditar=false;
            this.desBorrarPCDet=true;
            this.modoSaveActivo = false;/* SE TERMINO DE GUARDAR */
            this.procGetallptsctrldetbyPuCo(this.PuCoId);
            this.procGetallrutadetallebyru(this.RuId);
        /* GUARDANDO LISTA VACIA */
        }else if(this.valueTypeSavePC==5){
            console.log(this.valueTypeSavePC);
            this.ocGuardar=true;
            this.ocEditar=false;
            this.desBorrarPCDet=true;
            this.desNuevosPuntos=false;

            this.editando=1;
            this.dragPunto=0;
            this.activeAddMarker=0;
            this.reiniciarVariables(this.editando,this.dragPunto);
            this.procGetallrutadetallebyru(this.RuId);
        }
        this.mensaje="";
        this.modoSaveActivo = false;/* SE TERMINO DE GUARDAR */
        this.displayGuardarPuntosDetalle=false;
    }

    // mostrar los puntos de control en la grilla (1era grilla)
    mgPuntoControlMaestro(){
        this.pCMaestroMostrar=[];// para mostrarlo en la grilla
        let i:number;

        for(let puntoMaestro of this.pCArrayMaestroBD){
            this.pCMaestroMostrar.push({
                nro:0,
                EmId:puntoMaestro.EmId,
                PuCoDescripcion: puntoMaestro.PuCoDescripcion,
                PuCoClase:puntoMaestro.PuCoClase,
                PuCoId: puntoMaestro.PuCoId,
                PuCoTiempoBus: _hora(puntoMaestro.PuCoTiempoBus),  
                RuDescripcion:puntoMaestro.RuDescripcion, 
                RuId: puntoMaestro.RuId,    
            });
      
        }//fin for punto control Maestro

        for(i=0; i<this.pCMaestroMostrar.length; i++){
            this.pCMaestroMostrar[i].nro = i+1;
            if(this.pCMaestroMostrar[i].PuCoClase=='01' ){
                this.pCMaestroMostrar[i].PuCoClase = 'Hora Punta';
            }else if(this.pCMaestroMostrar[i].PuCoClase=='02' ){
                this.pCMaestroMostrar[i].PuCoClase = 'Dias Feriados';
            }else if(this.pCMaestroMostrar[i].PuCoClase=='03' ){
                this.pCMaestroMostrar[i].PuCoClase = 'Dias Normal';
            }
        }
    }// fin funcion


    mgPuntosControlDetalle(ptsCtrl:any){
        this.pCDetalleMostrar=[];//array para mostrarlo en el datatable 

        for(let puntoDetalle of ptsCtrl ){
            this.pCDetalleMostrar.push({
                PuCoDeId: puntoDetalle.PuCoDeId,
                PuCoId: puntoDetalle.PuCoId,
                PuCoDeLatitud: puntoDetalle.PuCoDeLatitud,
                PuCoDeLongitud: puntoDetalle.PuCoDeLongitud,
                PuCoDeDescripcion: puntoDetalle.PuCoDeDescripcion,
                PuCoDeHora:  _hora(puntoDetalle.PuCoDeHora),
                PuCoDeOrden: puntoDetalle.PuCoDeOrden 
            });
        }
    }

    //recuperar puntos de controldetalle por pucoID (por el ID) de esta forma no se necesita actualizar la pagina para ver el resultado
    //de agregar un nuevo elemento a la lista
    getAllPuntoControlDetalleByPuCo(puCoId:number){
        this.pcontrolService.getAllPuntoControlDetalleByPuCo(puCoId).subscribe(
            data => {this.pcDetalleGrid=data; this.mgPuntosControlDetalle},
            err => {this.errorMessage=err},
            () =>this.isLoading=false
        );
    }

    //borrar toda la lista de puntos de control recuperados(desde BD) o no recuperados(recien creados NUEVOS) en el mapa
    BorrarPuntosDetalle(){
        //borrando array de puntos de control en el datatable y hacer consulta para mostrar resultado
        //borrando puntos de control del mapa (overlayrs de index 1 hacia adelante , index 0 es el mapa)
        let long=this.overlays.length;
        console.log(this.overlays);
        /*this.overlays.splice(0,long-1);*/
        this.overlays.splice(1,long-1);
        this.pCArrayDetalleBD=[];
        this.miniLista=[];
        /*this.ed_itando=1;
        this.dragPunto = 0;        
        this.reiniciarVariables();
        this.cargarRuta();
        this.procGetallrutadetallebyru(this.RuId);*/
    }

    //BOTON NUEVOS PUNTOS DE CONTROL (DETALLE)
    nuevosPuntos(){
       
       this.mensaje="Ingrese los Nuevos Puntos Sobre El Mapa";
       this.displayNuevosPuntos=true;
       console.log(this.overlays);
    }

    aceptarNuevosPuntos(){
        /* CONFIGURANDO BOTON */
        this.desNuevosPuntos = true;  
        this.ocNuevo=true;
        this.ocGuardar=false;
        this.modoSaveActivo = true /* SE PREPARA UN REG PARA SER GUARDADO */
        this.activeAddMarker = 1 ; //addmarker activado
        /*this.edit_ando=0; //NUEVOS PUNTOS DE CONTROL
        this.dragPunto=1; dfsdf*/
        this.dragPunto=1;   
        this.editando=0;
        this.reiniciarVariables(this.editando,this.dragPunto); /* ESTA FUNCION PROBAR QUE RECIBA PARAMETROS */
        this.mensaje="";
        this.displayNuevosPuntos=false;
    }

    cancelarNuevosPuntos(){
        this.mensaje="";
        this.displayNuevosPuntos=false;
        console.log(this.overlays);
    }

     //CANCELAR EL MARCADOR QUE SE AGREGA EN EL MAPA ADDMARKER
    cancelarPuntoControlDetalle(){
        this.indexOverlays=this.overlays.length; //tamaño del array objetos

        this.overlays[this.indexOverlays - 1].setMap(null); // ultimo marcador (CIRCULO)
        this.overlays[this.indexOverlays - 2].setMap(null); // penultimo marker (MARKER)
        this.overlays.splice(this.indexOverlays-2, 2); //QUITANDO 2 ELEMENTOS DESDE LA POSICION THIS.INDEXOBERLAYS -2 
        
        this.indexOverlays=this.overlays.length;
        this.displayNuevoPunto = false;
    }

    //zoom + al mapa
    zoomPosMapa(map){
        map.setZoom(map.getZoom()+1);
    }

    //zoom - al mapa
    zoomNegMapa(map){
        map.setZoom(map.getZoom()-1);
    }

    //retroceder (deshacer) puntoControl agregado ADDMARKER & CIRCLE
    deshacerPuntoControl(){
        console.log("deshaciendo ");
    }
    
    /* CONFIRMAR EDITAR PUNTOS (DETALLE) */
    confirmarEditarDetalle(){
        this.displayEditarCabecera=true;
        this.mensaje="¿Esta seguro de editar los puntos de control?";
    }

    cancelarEditarDetalle(){
        this.displayEditarCabecera=false;
        this.mensaje="";
    }

    //BOTON MODO EDITAR PUNTOSCONTROL ---> ACEPTAR EDITAR PUNTOS
    editarPuntosDetalleMapa(){
        this.displayEditarCabecera=false;
        this.mensaje="";
        
        /*this.modoSaveActivo=true; 
        this.editando = 1;  //activando editar puntonControl
        this.activeAddMarker = 1; //activando  el addmarker 
        this.dragPunto = 1;     //DRAGGABLE TODOS PUNTOS Control
        this.reiniciarVariables(this.editando,this.dragPunto);*/

        console.log(this.overlays);console.log(this.pCArrayDetalleBD);
        
        if(this.pCArrayDetalleBD.length!=0){
            
            this.modoSaveActivo=true; 
            this.editando = 1;  //activando editar puntonControl
            this.activeAddMarker = 1; //activando  el addmarker 
            this.dragPunto = 1;     //DRAGGABLE TODOS PUNTOS CONTROL
            this.reiniciarVariables(this.editando,this.dragPunto);
            this.procGetallrutadetallebyru(this.RuId);
            this.procGetallptsctrldetbyPuCo(this.PuCoId);
        }else if(this.pCArrayDetalleBD.length==0){
            this.modoSaveActivo=true; 
            //this.editando = 0;  //activando editar puntonControl
            this.activeAddMarker = 1; //activando  el addmarker 
            this.dragPunto = 1;     //DRAGGABLE TODOS PUNTOS CONTROL
            this.reiniciarVariables(this.editando,this.dragPunto);
        }
        
        /*RECARGAR LOS MARCADORES Y RUTA EN EL MAPA
            this.procGetallrutadetallebyru(this.RuId);
            this.procGetallptsctrldetbyPuCo(this.PuCoId);*/

        //DESACTIVANDO Y ACTIVANDO BOTONES
            this.desGuardarPCD_BD=false;
            this.desBorrarPCDet=false;
            this.desEditarPCDetMarker=true;

        /* OCULTAR BOTONES */
            this.ocEditar=true;
            this.ocGuardar=false;

        //EDITAR EL ARRAY DE PUNTOS QUE SON SUBIDOS A LA BD Y EL overlays //ACTIVAR DRAGGABLE DE MARKERS (REEMPLAZANDO EXISTENTES)
    }

    //REINICIAR VARIABLES Y ARRAYS DE OBJETOS
    /* ESTA FUNCION PROBAR QUE RECIBA PARAMETROS */
    reiniciarVariables(editando:number, dragPunto:number){
        //CONDICIONAL DRAGGABLE ACTIVADO O NO, CASO SI SE ESTA EDITANDO O NO editando 1 | 0, dragPunto 1 | 0

        /* SE EDITA LISTA PTS , SE PUEDE MOVER LOS MARKER(PTS)*/
        if(editando == 1 && dragPunto ==1){ 
            //this.pCEditados =[]; // array editado PUNTOSCONTROL, PARA MANDAR A LA BD
            this.overlays=[];   //BORRANDO TODOS ELEMENTOS DEL ARRAY OBJETOS DEL MAPA
            this.coordenadas=[];
            this.j=0;//para pasar entre las coordenadas en el array COORDENADAS 
            this.k=0;
            this.l=0;
            this.m=0; //reducir en 1 los title de los marker
            this.n=1; //nro de puntos de control (guardar puntos en rest DETALLE) 
            this.editar=0; //si editar = 0 (nuevo registro) si editar = 1 (funcion editar) 
            this.ordenMayor=0; //nro mayor del array de puntos recuperados para el caso de editar
            //indexMarkerTitle:string; //index marker para title (string)
            this.indexMarker=0; //indice de marker
            
        /* NO SE EDITA LISTA PTS , NO PUEDE MOVER LOS MARKER(PTS)*/
        }else if(editando == 0 && dragPunto == 0){ // EDITANDO NO, DRAGPUNTO NO
            //this.pCEditados =[]; // array editado PUNTOSCONTROL, PARA MANDAR A LA BD
            this.overlays=[];   //BORRANDO TODOS ELEMENTOS DEL ARRAY OBJETOS DEL MAPA
            this.coordenadas=[];
            this.pCArrayDetalleBD=[]; //borrando puntos del array que va a la BD
            //this.i=0;
            this.j=0;//para pasar entre las coordenadas en el array COORDENADAS 
            this.k=0;
            this.l=0;
            this.m=0; //reducir en 1 los title de los marker
            this.n=1; //nro de puntos de control (guardar puntos en rest DETALLE) 
            this.editar=0; //si editar = 0 (nuevo registro) si editar = 1 (funcion editar) 
            this.ordenMayor=0; //nro mayor del array de puntos recuperados para el caso de editar

            //indexMarkerTitle:string; //index marker para title (string)
            this.indexMarker=0; //indice de marker

        //USADO CASO SE BORRA TODOS LOS PUNTOS
        }else if(editando == 1 && dragPunto == 0){
            this.overlays=[];   //BORRANDO TODOS ELEMENTOS DEL ARRAY OBJETOS DEL MAPA
            this.coordenadas=[];
            this.pCArrayDetalleBD=[]; //borrando puntos del array que va a la BD
            //this.i=0;
            this.j=0;//para pasar entre las coordenadas en el array COORDENADAS 
            this.k=0;
            this.l=0;
            this.m=0; //reducir en 1 los title de los marker
            this.n=1; //nro de puntos de control (guardar puntos en rest DETALLE) 
            this.editar=0; //si editar = 0 (nuevo registro) si editar = 1 (funcion editar) 
            this.ordenMayor=0; //nro mayor del array de puntos recuperados para el caso de editar

        /* CREANDO NUEVA LISTA, SE MUEVEN PTS Y NO SE EDITA LISTA(TOTALMENTE NUEVA) */
        }else if(dragPunto==1 &&  editando==0){
            /*this.overlays=[];*/ this.coordenadas=[]; this.pCArrayDetalleBD=[]; this.miniLista=[];
        }
    }

    //FUNCION COMBOBOX TIPO TARJETA
    ftipoTarjeta(event){ 
        /*console.log(this.tTarj);*/
        this.pcMaestro.PuCoClase = this.tTarj;  
    }

    //SI SUMATORIA TODOS PUNTOS DE CONTROL IGUAL AL TIEMPO DE RECORRIDO BUS
    sumatoriaTiempoPC(pControl = []):string{
        let su:string, tx; 
        let arrTiempos=[],_arrTiempos=[], timePc=[0,0,0], i=0,j=0;
        for(let pC of pControl){ arrTiempos.push(_hora(pC.PuCoDeHora).split(':')); }
        for(let pC of arrTiempos){ _arrTiempos.push(pC.slice()); }
        for(let i=0; i<_arrTiempos.length; i++){ for(let j=0; j<_arrTiempos[i].length; j++){  _arrTiempos[i][j]=Number(_arrTiempos[i][j]); } }

        //SUMANDO TODOS LOS TIEMPOS ENTRE CADA PUNTO PARA HACER EL CALCULO 
        let r;
        //console.log(_arrTiempos);
        //console.log("long: "+_arrTiempos.length);
        while(i<_arrTiempos.length-1){
            //console.log(_arrTiempos[i+1][1]+" <- - -> "+_arrTiempos[i][1]);
            if(_arrTiempos[i+1][1]>_arrTiempos[i][1]){
                r=_arrTiempos[i+1][1]-_arrTiempos[i][1];
                j = j + r;
                //console.log("> j: "+j);
            }else if(_arrTiempos[i+1][1]<_arrTiempos[i][1]){
                r = 60 - _arrTiempos[i][1];
                j = j + r;
                j = j + _arrTiempos[i+1][1];
                //console.log("< j: "+j);
            }
            //console.log("i: "+i);
            i++;
            
        }
       //console.log("j: "+j);
        

        tx="00:03:45";
    return tx ;
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
