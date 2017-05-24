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
        RuId : 51,
        PuCoDescripcion:"",
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
    disabledInputPos:boolean =true;
    private isLoading: boolean = false;  //captura error en getAllPuntoControlDetalleByPuCo
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
    draggable:boolean;

    displayNuevoPunto:boolean =false;
    displayValidarDatoCabecera=false;
    displayEditarPunto = false;
    displayListaPuntos: boolean = false; 
    displayElimRegCabecera: boolean = false;
    displayElimRegDetalle: boolean = false;
    displayOnObjec : boolean =false;
    displayMapaClick : boolean = false;
    displayErrorEditarPuntos : boolean = false;
    displayErrorEditar : boolean = false;
    displayNohayPuntos : boolean = false;
    displayNuevosPuntos : boolean = false;
    displayGuardarPuntosDetalle :boolean=false;

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

    tipoTarjeta:{nomb:"", val:""};
    _tipoTarjeta = [
        {nomb:"Hora Punta", val:'01'},
        {nomb:"Dias Feriados", val:'02'},
        {nomb:"Dias Normal", val:'03'}
    ];

    constructor( 
        private pcontrolService: PuntoControlService,
        //public el: ElementRef 
        private rutaService: RutaService
    ){}

    //iniciar 
    ngOnInit(){
        this.options={
            center: new google.maps.LatLng(-18.0065679, -70.2462741),
            zoom:14
        };

        //MAESTRO
         this.getAllPuntoControlByEmRu(1,51); //consulta para la grilla 
        this.activeAddMarker = 0; //addmarker desactivado
        //tambien cuando ya se a guardado los puntos en la BD

        //DESACTIVANDO BOTONES (MAPA)
         this.desGuardarPCD_BD=true;
         this.desBorrarPCDet=true;
         this.desDeshacerPCDet=true;
         this.desEditarPCDetMarker=true;
         this.desNuevosPuntos =true;
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
        //condicional para hacer click sobre el mapa y addmarker
        if(this.activeAddMarker == 1){ //addmarker activado
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
        }else if(this.activeAddMarker == 0){ //addmarker desactivado
            this.mensaje ="No Puede Agregar Punto de Control, Seleccione un Registro";
            this.displayMapaClick=true;
            //console.log("No Puede Agregar Marcadores");
        }
      
    }

    aceptarModalAgregarMarker(){
        this.mensaje="";
        this.displayMapaClick=false;
    }
    //CLICK SOBRE EL OBJETO --- ESTA FUNCION PARECE Q NO FUNCIONA :/
    handleOverlayClick(event) {
        console.log("CLICK SOBRE EL OBJETO: handleOverlayClick");
    }

    //FUNCION DRAG OBJETO
    handleDragEnd(event){
        console.log("arrastrando =D");
        let x; let y; let j = 0; let cen = 0;
        let indexInOverlays: number;
        let indexArrayParaBD : number;

        x = event.overlay.getPosition().lat();
        y = event.overlay.getPosition().lng();
        console.log(x + "---" +y);

        indexInOverlays  = this.overlays.indexOf(event.overlay); // INDICE EN ARRAY OBJETOS
        
        console.log(this.overlays[indexInOverlays].title);

        while(j<this.pCArrayDetalleBD.length && cen == 0){
            if(       this.overlays[indexInOverlays].title==this.pCArrayDetalleBD[j].PuCoDeDescripcion){
                cen=1;
            }else if((this.overlays[indexInOverlays].title!=this.pCArrayDetalleBD[j].PuCoDeDescripcion)){
                j++;
            }
        }
        //indexArrayParaBD = j;
        //indexArrayParaBD = this.pCArrayDetalleBD.indexOf(this.overlays[indexInOverlays].title);

        console.log("index: "+indexInOverlays);
        console.log("index: "+j);

        //console.log(this.pCArrayDetalleBD);
        //ACTUALIZANDO EL ARRAY DE PUNTOS, LAS NUEVAS COORDENADAS Q SE CAMBIARON DE CADA PUNTO
        this.pCArrayDetalleBD[j].PuCoDeLatitud  = x;
        this.pCArrayDetalleBD[j].PuCoDeLongitud = y;

        //BORRANDO CIRCULO PARA ACTUALIZA RPOSICION
        this.overlays[indexInOverlays+1].setMap(null);
        this.overlays.splice(indexInOverlays+1, 1,
            new google.maps.Circle({ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2, fillColor: '#FF0000', fillOpacity: 0.35,
                center: {lat:x , lng:y},
                radius:10
            })
        );

        console.log(this.overlays);
    }

    //ACTUALIZANDO LOS PUNTOS DE CONTROL AL GUARDAR LA BD
    actualizarOrdenPC(){
        let i=0; let j;
        while(i<this.pCArrayDetalleBD.length){
                this.pCArrayDetalleBD[i].PuCoDeOrden=i+1;
            i++;
        }
    }

    //click sobre una forma (marcador, lineas u otras) //borrando puntos con click sobre ellos
    handleOverClick(event){
        this.mensaje = "Acaba de Seleccionar Un Objeto sobre Mapa"
        this.displayOnObjec = true;
    }

     //ACEPTAR CLICK SOBRE OBJETO
    aceptarClickObjeto(){
        this.mensaje="";
        this.displayOnObjec=false;
    }
    //AGREGAR MARCADOR AL MAPA (PUNTOS DE CONTROL)
    addmarker(){
        //ACTIVANDO BOTONES SEGUN EL TAMAÑO DE OBJETOS Y DE PUNTOSCONTROL EN SU RESPECTIVO ARRAY
        if(this.overlays.length >0 || this.pCArrayDetalleBD.length > 0){
            this.desGuardarPCD_BD = false;
            this.desBorrarPCDet= false;
            this.desDeshacerPCDet= false;
            this.desEditarPCDetMarker= true;
            this.desNuevosPuntos= true;
        }

        //CONDICIONAL AGREGAR MARCADORES
        if(this.activeAddMarker == 1){ //addmarker activado
            this.disabledInputPos=true; //DESACTIVAR EL DESACTIVAR LA POSICION AUTOMATICA 
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
                strokeColor: '#FF0000',strokeOpacity: 0.8,strokeWeight: 2,fillColor: '#FF0000',fillOpacity: 0.35,center: this.selectedPosition,radius:10
            }));
            this.j++;
        }else if(this.activeAddMarker == 0){ //addmarker desactivado
            //PONER EN VENTANA MODAL COMO MENSAJE PARA EL USUARIO
            console.log("seleccione un registro de la tabla o haga click sobre el boton nuevo");
        }
    }

//PUNTO CONTROL MAESTRO
    //funcion nueva Maestro de puntos de control (BOTON NUEVO)
    newPuntoControlMaestro(){
        this.headertitle = "Nueva Lista";
        this.editar = 0; // si editar es cero es nuevo registro
        this._PuCoId=0;
        this.displayListaPuntos = true;
        this.pcontrolService.newPuntoControl().subscribe(data => {this.pcMaestroBD=data});
        
    }

    //SELECCION REGISTRO CABECERA (Y MUESTRA SU CONTENIDO DETALLE)
    onRowSelectMaestro(event) {
        //limpiar el mapa para ponerle los nuevos marcadores
        this.overlays = [];
        this.puntosRuta=[];
        this.pCArrayDetalleBD=[];
        this.coordenadas =[];

        //DESACTIVANDO O ACTIVANDO BOTONES
        this.desGuardarPCD_BD=true;
        this.desBorrarPCDet=true;
        //this.desDeshacerPCDet=true;
        this.desEditarPCDetMarker=false;

        //DESACTIVANDO EDITAR Y NO ARRASTRAR MARCADORES
        this.editando = 0;  // NO EDITAR 
        this.dragPunto = 0; // NO ARRASTRAR

        this.j=0; //PONER CLEAR PARA REINICIAR LAS VARIABLES -> BORRAR ESTA LINEA

        //buscando en el rest deacuerdo al id de la row
        this.idFilaSeleccionada = event.data.PuCoId;  //recupera la PuCoId de la fila seleccionada (para recuperar los puntos de control con la consulta)
        this.idRutaFilaSeleccionada = event.data.RuId; //recupera el RuId para poder sacar la ruta de la BD

         this.mayorOrdenPuntos();//PARA EL CASO DE EDITAR UNA LISTA EXISTENTE

         this.idDetalle = this.idFilaSeleccionada; //recupera el id cabecera para poder actualizar el detalle, funcion guardar if editado=1
        
         //RECUPERA RUTA DETALLE (TRAZA GRAFICA)
         this.rutaService.getAllRutaDetalleByRu(this.idRutaFilaSeleccionada).subscribe(
             data => {this.puntosRuta=data; this.cargarRuta();},
             err => {this.errorMessage=err},
             () => this.isLoading = false
         );

        //RECUPERA PUNTOS DE CONTROL POR EL PuCoId 
        this.pcontrolService.getAllPuntoControlDetalleByPuCo(this.idFilaSeleccionada).subscribe(
            data => {
                        this.pCArrayDetalleBD=data; //ARRAY COORDENADAS PUNTOS DE CONTROL
                        //CASOS SI EXISTEN PUNTOS DE CONTROL
                        if(this.pCArrayDetalleBD.length != 0){
                            this.mgPuntosControlDetalle(); //CARGANDO GRILLA PUNTOSDETALLE
                            this.cargarmarker(); //CARGAR LOS MARCADORES
                            //DESACTIVANDO BOTON 
                            this.desNuevosPuntos=true;
                            this.desDeshacerPCDet=true;
                            //this.editando = 1; //se esta editando el array de puntos (existen puntos en la BD) 

                        //CASO NO HAY PUNTOS DE CONTROL EN LA BD
                        }else if(this.pCArrayDetalleBD.length == 0){
                            //HACER UNA VENTANA MODAL PARA ESTE MENSAJE
                            this.mensaje = "No Hay Puntos De Control, Lista Vacia";
                            this.displayNohayPuntos = true;
                            //console.log("NO HAY PUNTOS DE CONTROL");
                            //ACTIVANDO BOTON NUEVOS PUNTOS DE CONTROL
                            this.desNuevosPuntos = false;
                            this.desEditarPCDetMarker = true;
                            this.mgPuntosControlDetalle(); 
                            this.editando = 0; //NUEVO REGISTRO, NO EXISTEN PUTNOS EN LA BD
                        }
                    },
            err => {this.errorMessage = err},
            () => this.isLoading = false
        );
    }//fin funcion onRowSelectMaestro

    aceptarNoHayPuntos(){
        this.mensaje="";
        this.displayNohayPuntos=false;
    }

    //SELECCION DE PUNTOS DE CONTROL DE LA GRILLA DETALLE
    onRowSelectDetalle(event){
        console.log("seleccionando detalle =D");
        //CENTRAR EL MAPA EN EL PUNTO DE CONTROL
    }


    //CARGAR LA RUTA AL MAPA
    cargarRuta(){
        for(let n=0; n<this.puntosRuta.length; n++){
            this.coordenadas.push({lat:this.puntosRuta[n].RuDeLatitud,lng:this.puntosRuta[n].RuDeLongitud});
        }

        this.overlays.push(
            new google.maps.Polyline({path: this.coordenadas, strokeColor: '#FF0000',strokeOpacity : 0.5,strokeWeight :8 
        }));

        //borrando las coordenadas para poder ingresar las coordenadas de los marcadores
        this.coordenadas=[];
        //console.log(this.overlays.length);
    }

    //CARGAR LOS MARCADORES SOBRE EL MAPA 
    cargarmarker(){
        //console.log(this.pCArrayDetalleBD);
        //console.log(this.overlays);

        //CONDICIONAL PARA PODER EDITAR MARCADORES (DRAGGABLE=TRUE) ----- 
        //REVISAR LA VARIABLE THIS.EDITANDO SI SE PUEDE INTEGRAR, 
        //TAMBIEN AL AGREGAR MARCADORES ARRASTRABLES O NO EN ADDMARKER
        if(this.dragPunto == 0  && this.editando == 0){ //NO ARRASTRAR Y EDITANDO DESACTIVADO
            for(let marker of this.pCArrayDetalleBD){
                this.overlays.push(
                    //agregando marker
                    new google.maps.Marker({
                        position:{lat:marker.PuCoDeLatitud , lng:marker.PuCoDeLongitud},
                        title:marker.PuCoDeDescripcion,
                        label:(this.pCArrayDetalleBD.indexOf(marker)+1).toString(), //array.indexOf(2);   this.pCArrayDetalleBD.indexOf(marker).toString();
                        draggable:false
                    })
                );
                
                this.overlays.push(
                    //agregando circulo 
                    new google.maps.Circle({ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2, fillColor: '#FF0000', fillOpacity: 0.35,
                        center: {lat:marker.PuCoDeLatitud , lng:marker.PuCoDeLongitud},
                        radius:10
                    }));
            }//FIN FOR
        }else if(this.dragPunto == 1 && this.editando == 1){ // SI ARRASTRAR Y EDITANDO ACTIVADO

            //REINICIAR VARIABLES, LIMPIAR ARRAY OBJETOS(overlay=[] ESTA DENTRO DE reiniciarVariables() ) 
            //this.reiniciarVariables();//RECARGAR RUTA//this.cargarRuta();

            for(let marker of this.pCArrayDetalleBD){
                this.overlays.push(
                    new google.maps.Marker({
                        position:{lat:marker.PuCoDeLatitud , lng:marker.PuCoDeLongitud},
                        title:marker.PuCoDeDescripcion,
                        label:(this.pCArrayDetalleBD.indexOf(marker)+1).toString(),
                        draggable:true
                    })
                );

                this.overlays.push(
                    new google.maps.Circle({ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2, fillColor: '#FF0000', fillOpacity: 0.35,
                        center: {lat:marker.PuCoDeLatitud , lng:marker.PuCoDeLongitud},
                        radius:10
                    })
                );

            }//FIN FOR
        }

    }
    
    //para editar la tabla maestro (grilla)BOTON DE LAS FILAS EDITAR
    editarMaestro(_puCoId:number){
         //editar registro cabecera
         
       
        this.displayListaPuntos=true; //MOSTRAR CUADRO DE NUEVA LISTA PUNTOS(CABECERA)
        this.headertitle="Editar Lista" //TITULO PARA LA VENTANA

        console.log("editar =D");
        console.log(_puCoId);

        this._PuCoId = _puCoId; //GUARDANDO ID PARA USARLO PARA SABER SI SE ESTA GUARDANDO(ID = 0) O EDITANDO(ID != 0)

        //CONSULTAR A LA BD Y CARGAR EL OBJETO PARA EDITAR this.pcMaestro
        this.pcontrolService.getPuntoControlById(_puCoId).subscribe(
            data => {this.pcMaestro = data; console.log(this.pcMaestro);}, err =>{this.errorMessage = err}, () =>this.isLoading=false);
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
                    console.log("encontrado =D: "+ j);
                }
            }
            this.pCArrayDetalleBD.splice(j,1); //ELIMINANDO UN SOLO ELEMENTO DESDE LA POSICION J
            this.mgPuntosControlDetalle(); //CARGANDO LA GRILLA PUNTOS DETALLE
    }

    cancel_eliminarDetalle(){
        this._PuCoDeId = 0;
        this.mensaje="";
        this.displayElimRegDetalle=false;
    }
    //guardar nuevo Maestro puntos de control
    guardarPCMaestro(){      
        let cen=0, i=0;
        let error = [
            {nomb:"Descripcion", val:0},
            {nomb:"Clase", val:0},
            {nomb:"Tiempo De Recorrido", val:0}
        ];
        //VALIDACION DE DATOS
        if(this.pcMaestro.PuCoDescripcion != ''){
            error[0].val = 1;
        } 
        if(this.pcMaestro.PuCoTiempoBus != ''){
            error[1].val = 1;
           
        }
        if(this.pcMaestro.PuCoClase != ''){
            error[2].val = 1;
        }

        //RECORRIENDO ARRAY EN BUSCA DE ERRORES
        while( (i<error.length)  && cen == 0){
            if(error[i].val == 0){
                cen = 1;
            }
            i++;
            console.log("tania");
        }

        console.log(this.pcMaestro.PuCoTiempoBus);
        if(cen == 0){
            if(this._PuCoId == 0){ //NUEVO REGISTRO
                    //almacenado para los datos
                    this.pcMaestroBD.PuCoId = this.pcMaestro.PuCoId,
                    this.pcMaestroBD.PuCoDescripcion = this.pcMaestro.PuCoDescripcion, 
                    this.pcMaestroBD.RuId = this.pcMaestro.RuId,

                    this.pcMaestroBD.PuCoTiempoBus =  this.hora(this.pcMaestro.PuCoTiempoBus),        //TIME
                    this.pcMaestroBD.PuCoClase = this.pcMaestro.PuCoClase, //COMBO

                    this.pcMaestroBD.UsId = this.pcMaestro.UsId,
                    this.pcMaestroBD.UsFechaReg = new Date()
                }else if(this._PuCoId != 0){ //SE ESTA EDITANDO REGISTRO EXISTENTE
                    this.pcMaestroBD = this.pcMaestro;//PASANDO LOS VALORES DEL MODAL AL OBJETO Q SERA MANDANDO A LA BD
            }

            //mandando al rest
            console.log(this.pcMaestroBD);
            this.pcontrolService.savePuntoControl(this.pcMaestroBD)
            .subscribe(realizar => {
                    this.getAllPuntoControlByEmRu(1,51); //RECARGANDO LA GRILLA
                    this.mgPuntoControlMaestro(); // MOSTRANDO EN LA GRILLA
                }, err => {this.errorMessage=err});
            this.displayListaPuntos = false;
        }else if(cen == 1){
            //MENSAJE EN PANTALLA
            this.mensaje ="Error al Ingresar los Datos, Vuelva a Ingresarlos";
            this.displayValidarDatoCabecera=true;
        }
        
    }
    aceptarErrorValidacionCabecera(){
        this.mensaje="";
        this.displayValidarDatoCabecera=false;
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
    newPCDetalle(){
        this.pcontrolService.newPuntoControlDetalle()
        .subscribe(data => {this.pcDetalleRest=data});
    }


  
    //VENTANA MODAL EDITAR SOLO EL NOMBRE Y TIEMPO MAS NO LA POSICION EDITAR PUNTOS CONTROL-> LLAMAR A LA FUNCIONA ELIMINAR PARA PODER BORRAR TODOS  LOS PUNTOS DE CONTROL EXISTENTES Y PODER MANDAR LA NUEVA LISTA MODIFICADA
    editarDetalle(_PuCoDeId : number){
        let i=0,cen=0;
        let puntos = this.pCDetalleMostrar;

        if(this.editando==1){   //SE PULSO EL BOTON EDITAR
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
        }else if(this.editando==0){ //NO SE PULSO EL BOTON EDITAR
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
        this.newPCDetalle(); // crear un nuevo punto (REST)
       //CASO NUEVOS PUNTOS DE CONTROL DE CERO O CUANDO SE PRESIONA EL BOTON BORRAR (TODO LOS PUNTOS)
       //NUEVO REGISTRO Y EL ARRAY PARA LA BD ESTA VACIO                   EXISTE AL MENOS UN NUEVO PUNTO
       if(this.editando == 0 ){
            if(this.disabledInputPos == true){ //activado el  textbox (se puede ingresar una posicion manualmente)
                //cargando los puntos control detalle a un array para ser mostrados y poder mandarlos al servidor REST
                this.pCArrayDetalleBD.push({
                        PuCoDeId : 0,
                        PuCoId : this.idFilaSeleccionada,
                        PuCoDeLatitud : Number(this.x),
                        PuCoDeLongitud : Number(this.y),
                        PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                        PuCoDeHora : this.fecha(this.pcDetalle.PuCoDeHora),
                        UsId : 0,
                        UsFechaReg : new Date(),
                        PuCoDeOrden : this.n //segun se vaya agregando al final
                    });
            }else if(this.disabledInputPos==false){//desactivado el  textbox (no se puede ingresar una posicion manualmente)
                this.pCArrayDetalleBD.splice(this.pcDetalle.PuCoDeOrden-1,0,{
                        PuCoDeId : 0,
                        PuCoId : this.idFilaSeleccionada,
                        PuCoDeLatitud : Number(this.x),
                        PuCoDeLongitud : Number(this.y),
                        PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                        PuCoDeHora : this.fecha(this.pcDetalle.PuCoDeHora),
                        UsId : 0,
                        UsFechaReg : new Date(),
                        PuCoDeOrden : this.pcDetalle.PuCoDeOrden-- 
                });
                //actualizando orden de los demas puntos de control
                let n = this.pcDetalle.PuCoDeOrden; // n = 4
                while( n <this.pCArrayDetalleBD.length){  //4 < 8
                    this.pCArrayDetalleBD[n].PuCoDeOrden =   (n+1); 
                    n++;
                }
            }
            
       
       //CASO PUNTOS EXISTENTES Y SE NECESITA AGREGAR NUEVOS PUNTOS, SI SE PRESIONA EL BOTON BORRAR NO SE TIENE QUE PASAR POR ACA
       //SE ESTA EDITANDO Y ARRAY EXISTEN AL MENOS UN PUNTO EN EL ARRAY 
       }else if(this.editando == 1){
            //ENCONTRANDO NRO DE ORDEN MAYOR EN EL ARRAY DE PUNTOS
            //console.log("ingresar marcadores despues de: "+this.ordenMayor);
            if(this.disabledInputPos == true){ //activado el  textbox (se puede ingresar una posicion manualmente)
                //cargando los puntos control detalle a un array para ser mostrados y poder mandarlos al servidor REST
                this.pCArrayDetalleBD.push({ //INGRESANDO EN EL FINAL DEL ARRAY
                        PuCoDeId : 0,
                        PuCoId : this.idFilaSeleccionada,
                        PuCoDeLatitud : Number(this.x),
                        PuCoDeLongitud : Number(this.y),
                        PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                        PuCoDeHora : this.fecha(this.pcDetalle.PuCoDeHora),
                        UsId : 0,
                        UsFechaReg : new Date(),
                        PuCoDeOrden : (this.ordenMayor+1) //segun se vaya agregando al final
                    });
            }else if(this.disabledInputPos==false){//desactivado el  textbox (no se puede ingresar una posicion manualmente)
                this.pCArrayDetalleBD.splice(this.pcDetalle.PuCoDeOrden-1,0,{ //INGRESANDO SEGUN POSICION
                        PuCoDeId : 0,
                        PuCoId : this.idFilaSeleccionada,
                        PuCoDeLatitud : Number(this.x),
                        PuCoDeLongitud : Number(this.y),
                        PuCoDeDescripcion : this.pcDetalle.PuCoDeDescripcion,
                        PuCoDeHora : this.fecha(this.pcDetalle.PuCoDeHora),
                        UsId : 0,
                        UsFechaReg : new Date(),
                        PuCoDeOrden : this.pcDetalle.PuCoDeOrden-- 
                });
            }   

            let n = this.pcDetalle.PuCoDeOrden; // n = 4
            while( n <this.pCArrayDetalleBD.length){  //4 < 8
                this.pCArrayDetalleBD[n].PuCoDeOrden =   (n+1); 
                n++;
            }
            this.ordenMayor = this.ordenMayor+1; //PASANDO AL SIGUIENTE PUNTOS AL FINAL

       //CASO NO ARRAY, VACIO
       }else if(this.editando==1 && this.pCArrayDetalleBD.length==0){
           this.editando=0; // NUEVO REGISTRO
           this.pCArrayDetalleBD = []; //reiniciando el array como VACIO
           //REINICIANDO VARIABLES 
           console.log("se guardo una ruta vacia");
       }
        
        this.mgPuntosControlDetalle();  //RECARGAR LA LISTA DE PUNTOS DE CONTROL EN LA GRILLA CORRESPONDIENTE
        this.pcDetalle.PuCoDeDescripcion=null;
        this.pcDetalle.PuCoDeHora=null;
        this.n++;
        this.displayNuevoPunto = false; //CERRANDO MODAL 
    }

    editandoRegistroDetalle(){
        let pos;
        pos = this.pCArrayDetalleBD[this.indexPunto].PuCoDeOrden; //POSICION ORIGINAL
        //BUSCNADO EL INDICE EN EL ARRAY EN LA CUAL TIENE Q GUARDARSE   pCArrayDetalleBD
        this.pCArrayDetalleBD[this.indexPunto].PuCoDeHora = this.fecha(this.pcDetalle.PuCoDeHora);
        this.pCArrayDetalleBD[this.indexPunto].PuCoDeDescripcion = this.pcDetalle.PuCoDeDescripcion;
        this.pCArrayDetalleBD[this.indexPunto].PuCoDeOrden = this.pcDetalle.PuCoDeOrden;//NUEVA POSICION

        if(pos != this.pcDetalle.PuCoDeOrden){
                    //              nueva posicion          objeto                                    indice objeto   
            this.reOrdenarPosicion(this.pcDetalle.PuCoDeOrden, this.pCArrayDetalleBD[this.indexPunto],this.indexPunto);
        }
        this.actualizarOrdenPC(); 
        this.mgPuntosControlDetalle();
        this.displayEditarPunto = false;
    }
    //                NUEVA POS       OBJETO      INDICE OBJ      
    reOrdenarPosicion(nro : number, obj: Object, index1 : number){
        let i = nro - 1, _obj;//INDICE DE LA NUEVA POSICION DEL OBJETO
        //NUEVA POSICION(NEW INDEX) > INDICE OBJ
        console.log("i : "+i + "____"+"index1 : "+index1);
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

    //CONVERTIR STRING A DATE FORMULARIO A BD
    fecha(fecha : string) : Date{
        //FECHA               
        let thoy:Date,  otra:Date, horaTarjeta:string;
        thoy=new Date();
        if(fecha.length<=5){ fecha = fecha+":00"; }
        horaTarjeta=fecha;
        let resultado=horaTarjeta.split(':');
        otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
        console.log(otra);
        return otra; 
        
    }

    //CONVERTIR DATE A STRING DE BD A FORMULARIO
    _fecha(fecha : Date) :string{
        let hora : string; let _hora : string; let _fecha = new Date(fecha);
            hora = _fecha.getHours() + ":"+_fecha.getMinutes()+":"+_fecha.getSeconds();
        return hora;
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

    //mandar al servicio Rest los puntos, es para confirmar que se tiene los correctos
    guardarpuntosDetalleRest(){
       this.actualizarOrdenPC();

       //GUARDANDO NUEVA LISTA DE PUNTOS, Y LONG ES DIFERENTE DE CERO
        if(this.editando == 0 && this.pCArrayDetalleBD.length!=0){ //0 : nuevo registro
            //console.log(this.pCArrayDetalleBD);

            this.pcontrolService.savePuntoControlDetalle(this.pCArrayDetalleBD).
            subscribe(realizar => {this.mgPuntosControlDetalle();},
                                err => {this.errorMessage=err});

            //DESACTIVANDO ACTIVANDO BOTONES MAPA
            this.desBorrarPCDet = true;
            this.desDeshacerPCDet= true;
            this.desEditarPCDetMarker = true;
            this.desGuardarPCD_BD = true;
            this.desNuevosPuntos = true;

            //DESACTIVANDO EVENTOS
            //this.activeAddMarker = 0 //addmarker DESactivado

        //SE ESTA EDITANDO LISTADO EXISTENTE, LONG ES DIFERENTE DE CERO
        }else if(this.editando == 1 && this.pCArrayDetalleBD.length!=0){ //1 : editando registro existente
            console.log(this.pCArrayDetalleBD);
            console.log("se edito un registro existente");

            //BORRANDO TODOS LOS REGISTROS DETALLE EN LA BD POR EL PUCOID Y PONER LOS NUEVOS ENCIMA
            
            this.pcontrolService.deletePuntoControlDetalleByRu(this.idDetalle).subscribe(
                    realizar => {
                                    console.log("se borro todo para guardar de nuevo");
                                },  
                    err => {console.log(err);}
            );
            

            //ACTUALIZANDO EL PuCoDeId a CERO
            for(let x=0; x<this.pCArrayDetalleBD.length; x++){
                this.pCArrayDetalleBD[x].PuCoDeId = 0;
            }

            //GUARDANDO LOS NUEVOS REGISTROS EN LA BD
            this.pcontrolService.savePuntoControlDetalle(this.pCArrayDetalleBD).
            subscribe(realizar => {this.mgPuntosControlDetalle();},
                                err => {this.errorMessage=err});
            console.log("guardado editado en rest");
            
            //DESACTIVANDO ACTIVANDO BOTONES MAPA
            this.desBorrarPCDet = true;
            this.desDeshacerPCDet= true;
            this.desEditarPCDetMarker = true;
            this.desGuardarPCD_BD = true;
            this.desNuevosPuntos = true;


        //SE BORRO TODOS LOS PUNTOS DE UN LISTADO EXISTENTE
        }else if(this.pCArrayDetalleBD.length == 0 && this.editando == 1){ //GUARDANDO ARRAY VACIO & 1 : editando registro existente
            console.log(this.pCArrayDetalleBD);
            console.log("se edito un registro existente");

            //BORRANDO TODOS LOS REGISTROS DETALLE EN LA BD POR EL PUCOID Y PONER LOS NUEVOS ENCIMA
            
            this.pcontrolService.deletePuntoControlDetalleByRu(this.idDetalle).subscribe(
                    realizar => {
                                    console.log("SE BORRO TODO LOS PUNTOS DEL MAPA");
                                    //this.cargarRuta();
                                },  
                    err => {console.log(err);}
            );

            //DESACTIVANDO ACTIVANDO BOTONES MAPA
            this.desBorrarPCDet = true;
            this.desDeshacerPCDet= true;
            this.desEditarPCDetMarker = true;
            this.desGuardarPCD_BD = true;
            this.desNuevosPuntos = true;

        }

        this.mensaje="Se Guardo los Puntos Correctamente";
        this.displayGuardarPuntosDetalle=true;
        this.reiniciarVariables();//REINICIANDO LA VARIABLES
        this.cargarRuta();
        this.cargarmarker();
        this.editando=0;//0: NUEVO REGISTRO (UNO NO EXISTENTE)      1: EDITANDO REGISTRO EXISTENTE
        this.dragPunto=0 //MARKER NO DRAGGABLE
        this.activeAddMarker = 0; //0: desactivado,   1: activado //DESACTIVANDO ADDMARKER
    }
   
    aceptarGuardarPuntosDetalle(){
        this.mensaje="";
        this.displayGuardarPuntosDetalle=false;
    }

    // mostrar los puntos de control en la grilla (1era grilla)
    mgPuntoControlMaestro(){
        this.pCMaestroMostrar=[];// para mostrarlo en la grilla
        let i:number;

        for(let puntoMaestro of this.pCArrayMaestroBD){
            //fechaActual = new Date(puntoMaestro.fechareg)
            this.pCMaestroMostrar.push({
                nro:0,
                EmId:puntoMaestro.EmId,
                PuCoDescripcion: puntoMaestro.PuCoDescripcion,
                PuCoClase:puntoMaestro.PuCoClase,
                PuCoId: puntoMaestro.PuCoId,
                PuCoTiempoBus: this._hora(puntoMaestro.PuCoTiempoBus),
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

    //mostrar puntos de control Detalle en al grilla (2da grilla)
    mgPuntosControlDetalle (){
        //puntosControlDetalleBD
        this.pCDetalleMostrar=[];//array para mostrarlo en el datatable 
        
        //CONVERTIR DATE A STRING

        for(let puntoDetalle of this.pCArrayDetalleBD ){

            this.pCDetalleMostrar.push({
                PuCoDeId: puntoDetalle.PuCoDeId,
                PuCoId: puntoDetalle.PuCoId,
                PuCoDeLatitud: puntoDetalle.PuCoDeLatitud,
                PuCoDeLongitud: puntoDetalle.PuCoDeLongitud,
                PuCoDeDescripcion: puntoDetalle.PuCoDeDescripcion,
                PuCoDeHora:  this.cCeroHora(this._fecha(puntoDetalle.PuCoDeHora)), // CONVERTIR ESTO puntoDetalle.PuCoDeHora,
                PuCoDeOrden: puntoDetalle.PuCoDeOrden 
            });

        }//fin for
    }//fin funcion

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

        this.editando=1;
        this.dragPunto = 0;        
        this.reiniciarVariables();
        this.cargarRuta();
    }

    //BOTON NUEVOS PUNTOS DE CONTROL (DETALLE)
    nuevosPuntos(){
        this.desNuevosPuntos = true;
        this.activeAddMarker = 1 ; //addmarker activado
       this.editando == 0; //NUEVOS PUNTOS DE CONTROL
       this.mensaje="Ingrese los Nuevos Puntos Sobre El Mapa";
       this.displayNuevosPuntos=true;
    }

    aceptarNuevosPuntos(){
        this.mensaje="";
        this.displayNuevosPuntos=false;
    }
     //CANCELAR EL MARCADOR QUE SE AGREGA EN EL MAPA ADDMARKER
    cancelarPuntoControlDetalle(){
        
        //console.log("cancelado");
        this.indexOverlays=this.overlays.length; //tamaño del array objetos
        //console.log(this.indexOverlays);

        this.overlays[this.indexOverlays - 1].setMap(null); // ultimo marcador (CIRCULO)
        this.overlays[this.indexOverlays - 2].setMap(null); // penultimo marker (MARKER)
        this.overlays.splice(this.indexOverlays-2, 2); //QUITANDO 2 ELEMENTOS DESDE LA POSICION THIS.INDEXOBERLAYS -2 
        //this.overlays.length = this.overlays.length;
        
        this.indexOverlays=this.overlays.length;
        console.log("long array: "+this.indexOverlays);
        this.displayNuevoPunto = false;
        
        //borrar marker
        //borrar registro del datable (con consulta)
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
    
    //BOTON EDITAR ---> MAPA
    editarPuntosDetalleMapa(){
        this.editando = 1;  //activando editar puntonControl
        this.activeAddMarker = 1; //activando  el addmarker 
        this.dragPunto = 1;     //DRAGGABLE TODOS PUNTOS CONTROL

        //REINICIANDO VARIABLES
        this.reiniciarVariables();

        //RECARGAR LOS MARCADORES Y RUTA EN EL MAPA
        this.cargarRuta();
        this.cargarmarker();

        //EVALUAR SI SE MANDA A UNA VENTANA MODAL AVISO
        //console.log("ingresar marcadores despues de: "+this.ordenMayor);

        //DESACTIVANDO Y ACTIVANDO BOTONES
        this.desGuardarPCD_BD=false;
        this.desBorrarPCDet=false;
        //this.desDeshacerPCDet=false;
        this.desEditarPCDetMarker=true;

        //EDITAR EL ARRAY DE PUNTOS QUE SON SUBIDOS A LA BD Y EL overlays
        //ACTIVAR DRAGGABLE DE MARKERS (REEMPLAZANDO EXISTENTES)
    }

    //REINICIAR VARIABLES Y ARRAYS DE OBJETOS
        //TERMINAR DE PROGRAMAR
    reiniciarVariables(){
        //CONDICIONAL DRAGGABLE ACTIVADO O NO, CASO SI SE ESTA EDITANDO O NO editando 1 | 0, dragPunto 1 | 0

        if(this.editando == 1 && this.dragPunto ==1){ // EDITANDO SI, DRAGPUNTO SI
            this.pCEditados =[]; // array editado PUNTOSCONTROL, PARA MANDAR A LA BD
            this.overlays=[];   //BORRANDO TODOS ELEMENTOS DEL ARRAY OBJETOS DEL MAPA
            this.coordenadas=[];
            //this.pCArrayDetalleBD=[]; //borrando puntos del array que va a la BD
            this.i=0;
            this.j=0;//para pasar entre las coordenadas en el array COORDENADAS 
            this.k=0;
            this.l=0;
            this.m=0; //reducir en 1 los title de los marker
            this.n=1; //nro de puntos de control (guardar puntos en rest DETALLE) 
            this.editar=0; //si editar = 0 (nuevo registro) si editar = 1 (funcion editar) 
            this.ordenMayor=0; //nro mayor del array de puntos recuperados para el caso de editar

            //indexMarkerTitle:string; //index marker para title (string)
            this.indexMarker=0; //indice de marker

        }else if(this.editando == 0 && this.dragPunto == 0){ // EDITANDO NO, DRAGPUNTO NO
            this.pCEditados =[]; // array editado PUNTOSCONTROL, PARA MANDAR A LA BD
            this.overlays=[];   //BORRANDO TODOS ELEMENTOS DEL ARRAY OBJETOS DEL MAPA
            this.coordenadas=[];
            this.pCArrayDetalleBD=[]; //borrando puntos del array que va a la BD
            this.i=0;
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
        }else if(this.editando == 1 && this.dragPunto == 0){
            this.overlays=[];   //BORRANDO TODOS ELEMENTOS DEL ARRAY OBJETOS DEL MAPA
            this.coordenadas=[];
            this.pCArrayDetalleBD=[]; //borrando puntos del array que va a la BD
            this.i=0;
            this.j=0;//para pasar entre las coordenadas en el array COORDENADAS 
            this.k=0;
            this.l=0;
            this.m=0; //reducir en 1 los title de los marker
            this.n=1; //nro de puntos de control (guardar puntos en rest DETALLE) 
            this.editar=0; //si editar = 0 (nuevo registro) si editar = 1 (funcion editar) 
            this.ordenMayor=0; //nro mayor del array de puntos recuperados para el caso de editar
        } 
            {
                /*
                //activar y desactivar funciones
                activeAddMarker = 0; // 0 : desactivado     1 : activado
                selectRowGrilla = 0; // 0 : desactivado     1 : activado
                //PARA SABER SI SE ESTA EDITANDO UN REGISTRO O NO USARLO PARA ALGUN FORMULARIO
                editando    =   0;   // 0: nuevo registro    1: se esta editando un registro         
                
                //ACTIVANDO Y DESACTIVANDO BOTONES DEL MAPA
                desGuardarPCD_BD:boolean;
                desBorrarPCDet:boolean;
                desDeshacerPCDet:boolean;
                desEditarPCDetMarker:boolean;
                desNuevosPuntos : boolean;*/
            }
    }

    

    //FUNCION COMBOBOX TIPO TARJETA
    ftipoTarjeta(event){
        console.log(this.tipoTarjeta.nomb);
        console.log(this.tipoTarjeta.val);
        this.pcMaestro.PuCoClase = this.tipoTarjeta.val;
    }

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
        _hora =  (_fecha.getHours()).toString();// restando 1 hora (CORREGIR EN EL BACKEND)
            hora = _hora + ":"+_fecha.getMinutes()+":"+_fecha.getSeconds();

            hora = this.cCeroHora(hora);
        return hora;
    }

     //COMPLETANDO CEROS EN CASO DE NECESITAR PARA HORAS Y FECHAS   2017/
    cCeroHora(h:string) :string{
            //DIVIDIRLO EN PARTES Y COMPLETAR LOS CEROS PARA QUE LOS ELEMENTOS SEAN TODOS PARES
            let hora : string, _hora :string, resultado, i=0; // VARIABLES
            resultado = h.split(':'); //DIVIDIENDO EN PARTES
            while(i<resultado.length){ //COMPLETANDO CEROS
                if(resultado[i].length%2!=0){
                    resultado[i]="0"+resultado[i];
                }
                i++;
            }
            //CONCATENANDO
            _hora=resultado[0]+":"+resultado[1]+":"+resultado[2];
        return _hora;
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


     //if(this.editando == 0 && this.pCArrayDetalleBD.length ==0){
       //}else if(this.editando == 1 && this.pCArrayDetalleBD.length!=0){
 //PONER CONDICIONAL PARA HABILITAR LA ELIMINACION, CONFIRMAR LA ELIMINACION
        
          //BUSCANDO INDICE DEL OBJETO
            /*for(let i=0; i<this.pCArrayDetalleBD.length; i++){
                console.log("indice: "+this.pCArrayDetalleBD.indexOf(this.pCArrayDetalleBD[i].PuCoDeId))
            }*/

            //marcador : impar,  circle : par 
        //primer marker es index 0
        //primer circle es index 1
        /*
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
        */