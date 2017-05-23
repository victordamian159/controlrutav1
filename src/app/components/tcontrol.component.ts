import {Component, OnInit} from '@angular/core';
import {TControlService} from '../service/tcontrol.service';
import {PlacasService} from '../service/placas.service';

@Component({
    selector: 'app-tcontrol',
    templateUrl:'../views/tcontrol.component.html',
    styleUrls:['../styles/tcontrol.component.css']
})

export class TcontrolComponent implements OnInit{
     private errorMessage:string='';  //mensaje error del rest
    private isLoading: boolean = false;  

    displayAsignarTarjeta : boolean = false;
    displayEditarTarjeta : boolean = false;
    displayConfirmarEliminar : boolean = false;
    val:number;

    //OBEJTO PLACA PARA EL COMBO DE PLACAS DE LA PROGRAMACION POR FECHA
    placa:{
        BuId:0,
        PrDeAsignadoTarjeta:0,
        PrDeId:0,
        PrDeOrden:0,
        PrId:0,
        nroPlaca:0
    }; 
    placas:any[]=[]; //LISTA COMPLETA DE placas
    _placas:any[]=[]; //LISTA SEPARADA POR FECHA, RESULTADO DE BUSQUEDA POR FECHA
    
    _prId:number;
    _prDeId:number;

    //CAMPOS PARA LA CABECERA Y DETALLE 
    _TaCoId : number;
    _PuCoId : number;
    _RuId : number;
    _BuId : number;
    _TaCoFecha : string;
    _TaCoHoraSalida : string;
    _TaCoCuota : number; 
    _UsId : number;
    _UsFechaReg : string;
    _TaCoNroVuelta:number;

    //OBJETO CABECERA
    tarjeta:any={
        _TaCoId : this._TaCoId,
        _PuCoId : this._PuCoId,
        _RuId : this._RuId,
        _BuId :this._BuId,
        _TaCoNroVuelta:this._TaCoNroVuelta,
        _TaCoFecha :this._TaCoFecha,
        _TaCoHoraSalida :this._TaCoHoraSalida,
        _TaCoCuota :this._TaCoCuota,
        _UsId :this._UsId,
        _UsFechaReg :this._UsFechaReg
    }
    _tarjeta:any; 
   
    _allTarjetas:any[]=[]; //TODAS LAS TARJETAS PARA LA GRILLA
    
    allTarjControl:any[]=[]; //BORRAR, CONSULTA PROVICIONAL PARA GRILLA CABECERA
    _allTarjControl:any[]=[]; // REEEMPLAZAR, PARA MANDAR AL FORMULARIO
    
    _allTarjDetalle:any[]=[]; //DETALLE TARJETA
    
    puntoControl:{
        EmId:0,
        PuCoClase:0,
        PuCoId:0,
        PuCoTiempoBus:"",
        RuDescripcion:"",
        RuId:0
    };
    puntosControl:any[]=[]; //PUNTOS DE CONTROL EN LA BD
    _puntosControl:any[]=[]; //PARA TABLA PUNTOS
     puntosControlDet :any[]=[];
     _puntosControlDet:any[]=[]; //NO ESTA EN USO

     idPunto:number = 0; //PUCOID 
     tcontrol:any;  //RECUPERA EL OBJ Q SE GUARDA EN LA BD, CABECERA PARA SACAR LA TACOID PARA USARLO PA GUARDAR EN EL DETALLE
//OBJETO DETALLE
    _TaCoDeId : number;
    //_UsFechaReg:string;
    //_TaCoId : number;
    _PuCoDeId:number;
    _TaCoDeFecha:string;
    _TaCoDeHora:string;
    _TaCoDeLatitud:number;
    _TaCoDeLongitud:number;
    _TaCoDeTiempo:string;
    _TaCoDeDescripcion:string;
    //_UsId:number;

    tarjetaDetalle:any={ 
        TaCoDeId:this._TaCoDeId,
        UsFechaReg:this._UsFechaReg,
        TaCoId: this._TaCoId,
        PuCoDeId:this._PuCoDeId,
        TaCoDeFecha:this._TaCoDeFecha,
        TaCoDeHora:this._TaCoDeHora,
        TaCoDeLatitud:this._TaCoDeLatitud,
        TaCoDeLongitud:this._TaCoDeLongitud,
        TaCoDeTiempo:this._TaCoDeTiempo,
        TaCoDeDescripcion:this._TaCoDeDescripcion
    }
    _tarjetaDetalle:any;    //PARA NUEVO DETALLE
    _tarjDetalleArray:any[]=[]; //PARA MANDARLO A LA BD
    
    //PROGRAMACION
    programacion:any[]=[];
    _programacion:any[]=[];
    progDetalle:any[]=[];
    _progDetalle:any[]=[];
    progD_BD:any[]=[];  //PROGRAMACION RECUPERADA DE LA BD
    _progD_BD:any[]=[]; //PROGRAMACION PARA PASAR A LA GRILLA
    _array:any[]=[];  //ARRAY COMO PARAMETRO A PROCEDIMIENTO SAVE TARJETA DETALLE 

    mensaje : string; //MENSAJE EN PANTALLA PARA CONFIRMAR

    constructor(
                    private tcontrolservice: TControlService,
                    private placaService: PlacasService
                ){}

    ngOnInit(){
        //console.log(this.placas);
        this.getallplacasbusbyemsuem(1,0); //PLACAS
        this.getallpuntocontrolbyemru(1,0); //PUNTOS DE CONTROL
        this.getalltarjetacontrol(); 
        
        this.getallprogramacionbyem(1,0); //PROGRAMACION X EMP
        
      
        this.tarjeta._UsId = 1; //ARREGLAR ESOT PARA Q SEA GLOBAL, USUARIO
    }
    
    //CONSULTAR PROGRAMACION CABECERA, PARA OBTENER EL PRID NECESARIO PARA SACAR EL DETALLE
    getallprogramacionbyem(emId:number, anio: number){
        this.tcontrolservice.getAllProgramacionByEm(emId, anio).subscribe(
            data => {
                        this.programacion=data; 
                        //console.log(this.programacion);
                        this.mgprogramacion();
                    }
        );
    }

    //CONSULTA PROG DETALLE PROGRAMACIONDETALLE(X FECHA)
    getallprogramacionbydate(PrId:number, Date: string){
        this.tcontrolservice.getAllProgramacionDetalleByPrFecha(PrId, Date).subscribe(
            data => {
                        this.progDetalle=data;
                        //console.log(this.progDetalle);
                        this.mgprogDetalle(); //GRILLA PROG POR FECHA
                    }
        );
    }

    //GRILLA PROGRAMACION CABECERA
    mgprogramacion(){
        this._programacion=[];
        for(let prog of this.programacion){
            this._programacion.push({
                EmConsorcio:prog.EmConsorcio,
                PrAleatorio:prog.PrAleatorio,
                PrCantidadBuses:prog.PrCantidadBuses,
                PrFecha:prog.PrFecha,
                PrFechaFin:prog.PrFechaFin,
                PrFechaInicio:prog.PrFechaInicio,
                PrTipo:prog.PrTipo,
                dias:prog.dias,
                prDescripcion:prog.prDescripcion,
                prId:prog.prId
            });
        }
        //console.log(this.programacion);
        //console.log(this._programacion);
    }

    //GRILLA PROGRAMACION DETALLE  -  POR LA FECHA
    mgprogDetalle(){ 
        this._progDetalle=[];
        
        //i: PARA RECORRER EL ARRAY, SI Y NO: CUANTOS SE ENCONTRARON Y NO SE ENCONTRARON
        
        let i = 0; let j=0;  let si=0; let no=0; let cen = 0; let programacion=[];

        while (i<this.placas.length){
            while (j<this.progDetalle.length && cen==0){
                if      (this.progDetalle[i].BuId == this.placas[j].BuId){ 
                    //SI SON IGUALES CARGANDO EN OTRO ARRAY PARA PASAR A LA SIGUIENTE ETAPA
                    programacion.push({
                        BuId: this.progDetalle[i].BuId,
                        nroPlaca: this.placas[j].BuPlaca,
                        //UsId:this.progDetalle[i].UsId,
                        PrId:this.progDetalle[i].PrId,
                        PrDeOrden:this.progDetalle[i].PrDeOrden,
                        PrDeId: this.progDetalle[i].PrDeId,
                        PrDeAsignadoTarjeta:this.progDetalle[i].PrDeAsignadoTarjeta
                    });
                    //this.progDetalle[i].BuId = this.placas[j].BuPlaca;
                    cen = 1; 
                }else if(this.progDetalle[i].BuId != this.placas[j].BuId){
                      
                }
                j++;  
            }
            j=0;
            i++;
            cen = 0;
        }

        //for(let progD of this.progDetalle){  //console.log(this._progDetalle)//AQUI SE ACTUALIZA EL BUID POR SU PLACA
        for(let progD of programacion){
            //FILTRANDO SI ESTA ASIGNADO, SI LO ESTA NO SE PUEDE MOSTRAR
            if(progD.PrDeAsignadoTarjeta != 1){
                this._progDetalle.push({
                    BuId:progD.BuId,
                    nroPlaca:progD.nroPlaca,
                    PrId:progD.PrId,
                    PrDeOrden:progD.PrDeOrden,
                    PrDeId:progD.PrDeId,
                    PrDeAsignadoTarjeta:progD.PrDeAsignadoTarjeta
                    //PrDeFecha:progD.PrDeFecha,
                    //UsFechaReg:progD.UsFechaReg,
                    //UsId:progD.UsId,
                    //PrDeBase:progD.PrDeBase,
                });
            }
        }
    }

    //CONSULTA RECUPERAR PLACAS
    getallplacasbusbyemsuem(emId : number, suemId : number){
        this.placaService.getAllPlacasBusByEmSuEm(1,0).subscribe(
            data => {this.placas = data; 
                //console.log(this.placas)
                ;}
        );
    }
    //CONSULTA RECUPERAR PUNTOS DE CONTROL  (1,0)
    getallpuntocontrolbyemru(emId:number, ruId:number){
        this.tcontrolservice.getAllPuntoControlByEmRu(emId,ruId).subscribe(
            data => {this.puntosControl=data; 
                //console.log(this.puntosControl); 
                this.mgPuntosControl();}
        );
    }

    //CONSULTA PUNTOSDETALLE PARA INICIAR LA TARJETA CON EL PUNTO
    getallpuntocontroldetallebypuco(puCoId:number){
        this.tcontrolservice.getAllPuntoControlDetalleByPuCo(puCoId).subscribe(
            data => {
                        this.puntosControlDet=data; 
                        console.log(this.puntosControlDet);
                    }
        );
    }


    //CONSULTA PROVICIONAL-- REEMPLAZAR POR OTRA QUE PASE RONALD PARA MOSTRAR GRILLA
    getalltarjetacontrol(){
        this.tcontrolservice.getAllTarjetas().subscribe(
            data => {this.allTarjControl=data; 
                     //console.log(this.allTarjControl); 
                     this.mgTarjetasControl();},
            err  => {this.errorMessage=err},
            ()   => this.isLoading=false
        );
    }

    //MOSTRAR PUNTOS DE CONTROL
    mgPuntosControl(){
        this._puntosControl=[];
        for(let puntos of this.puntosControl){
            this._puntosControl.push({
                EmId:puntos.EmId,
                PuCoClase:puntos.PuCoClase,
                PuCoId:puntos.PuCoId,
                PuCoTiempoBus:puntos.PuCoTiempoBus,
                RuDescripcion:puntos.RuDescripcion,
                RuId:puntos.RuId
            });
        }
        //console.log(this._puntosControl);
    }

    //MOSTRANDO RESULTADO EN LA GRILLA CABECERA
    mgTarjetasControl(){
        this._allTarjControl = [];
        let j : number = 0; let k : number = 0; let cen : number =0;

        //TARJETAS EXISTENTES
        for(let TarjControl of this.allTarjControl){
            this._allTarjControl.push({
                nro:0,
                placa:0,
                rutaDescripcion:"",
                TaCoFecha:this._fecha(TarjControl.TaCoFecha),
                TaCoHoraSalida:this._hora(TarjControl.TaCoHoraSalida),
                TaCoCuota:TarjControl.TaCoCuota,
                BuId:TarjControl.BuId,
                UsFechaReg:TarjControl.UsFechaReg,
                TaCoId:TarjControl.TaCoId,
                UsId:TarjControl.UsId,
                RuId:TarjControl.RuId,
                PuCoId:TarjControl.PuCoId
            });
            
        }
        
        //AGREGANDO CAMPOS ADICIONALES AL ARRAY, CAMBIANDO IDS POR SU DESCRIPCION
        //ORDEN
        for(let i=0; i<this._allTarjControl.length; i++){
            this._allTarjControl[i].nro = i+1;
        }

        //BUID POR NRO PLACA    this.placas 
        while(j < this._allTarjControl.length){
            while(k<this.placas.length && cen==0){
                if(this._allTarjControl[j].BuId == this.placas[k].BuId){
                    this._allTarjControl[j].placa=this.placas[k].BuPlaca; 
                    cen=1;
                }else if(this._allTarjControl[j].BuId != this.placas[k].BuId){
                    k++;
                }
            }
            k=0;
            cen=0;
            j++;
        }
       
  
    }

  

    //CONSULTA TARJETAS DE CONTROL BY ID ---NO ESTA EN USO
    getalltarjetacontrolbyid(tacoid:number){
        this.tcontrolservice.getAllTarjetaControlById(tacoid).subscribe(
            data => {this._allTarjetas = data; 
                     console.log(this._allTarjetas);},
                     err => {this.errorMessage=err},
                        () => this.isLoading=false
        );
    }

    buscarxFecha(){
        console.log(this.tarjeta._TaCoFecha);
        //CAMBIANDO POSICION FECHA
        let fecha:string;
        let dia:string; let anio:string; let mes:string;
        
        dia = this.tarjeta._TaCoFecha[this.tarjeta._TaCoFecha.length-2]+this.tarjeta._TaCoFecha[this.tarjeta._TaCoFecha.length-1];
        mes = this.tarjeta._TaCoFecha[5]+this.tarjeta._TaCoFecha[6];
        anio= this.tarjeta._TaCoFecha[0]+this.tarjeta._TaCoFecha[1]+this.tarjeta._TaCoFecha[2]+this.tarjeta._TaCoFecha[3];
        
        //CONSULTA PROGRAMACION POR FECHA
        this.getallprogramacionbydate(this.tarjeta._prId, dia+"-"+mes+"-"+anio);
    }

    //ABRIR MODAL ASIGNAR NUEVA TARJETA CONTROL
    nuevaAsignaTarjeta(){
        this.tarjeta._TaCoId=0; //PONIENDO TACOID A CERO PARA INDICAR Q ES NUEVO REGISTRO
        console.log("nueva tarjeta =D");
        this.displayAsignarTarjeta = true;
        this.tcontrolservice.newTarjetaControl() //CABECERA
            .subscribe(
                data =>{this._tarjeta=data;                      
                       // console.log(this._tarjeta);
                }
            );
        this.tcontrolservice.newTarjetaControlDetalle()
            .subscribe(
                data =>{this._tarjetaDetalle=data; 
                       // console.log(this._tarjetaDetalle);
                }
            );
    }

    //SE CANCELA TARJETA
    cancelarTarjeta(){
        this.displayAsignarTarjeta = false;
        console.log("cancelado =()");
    }

    cancelarEditarTarjeta(){
        this.displayEditarTarjeta = false;
    }

    //SELECCIONAR TARJETA CONTROL (CABECERA- GRILLA)
    onRowSelectCabecera(event){
        this.tarjeta._TaCoId=0; 
        this.tarjeta._TaCoId = event.data.TaCoId;
        //console.log(this.tarjeta._TaCoId);

        this.tcontrolservice.getAllTarjetaControlDetalleBytaCoId(this.tarjeta._TaCoId).subscribe(
            data => {
                        //this.progD_BD=data;
                        //console.log(this.progD_BD);
                        this._tarjetaDetalle = data;
                        //console.log(this._tarjetaDetalle);
                        this.mgTarjetaDetalle();
                    }
        );
    }

    //MOSTRAR RESULTADO DETALLE EN GRILLA
    mgTarjetaDetalle(){
        this._allTarjDetalle = [];
        for(let tDetalle of this._tarjetaDetalle){
        this._allTarjDetalle.push({
                nro:0,
                PuCoDeId:tDetalle.PuCoDeId, 
                TaCoDeDescripcion:tDetalle.TaCoDeDescripcion, 
                TaCoDeFecha:tDetalle.TaCoDeFecha, 
                TaCoDeHora:tDetalle.TaCoDeHora, 
                TaCoDeId:tDetalle.TaCoDeId, 
                TaCoDeLatitud:tDetalle.TaCoDeLatitud, 
                TaCoDeLongitud:tDetalle.TaCoDeLongitud, 
                TaCoDeTiempo:tDetalle.TaCoDeTiempo, 
                TaCoId:tDetalle.TaCoId, 
                UsFechaReg:tDetalle.UsFechaReg, 
                UsId:tDetalle.UsId
            });
        }

        //ASIGNADO SU NUMERACION
        for(let i=0; i<this._allTarjDetalle.length; i++){
            this._allTarjDetalle[i].nro = i+1;
        }
        console.log(this._allTarjDetalle);
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
        _hora =  (_fecha.getHours()).toString();
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
            /*
                let thoy:Date,  otra:Date, horaTarjeta:string;
                thoy=new Date();
                if(fecha.length<=5){ fecha = fecha+":00"; }

                horaTarjeta=fecha;
                let resultado=horaTarjeta.split(':');

                otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
                console.log(otra);
                return otra; 
            */
        return _hora;
    }

    cCeroFecha(f : string) :string{
        let fecha:string, _fecha:string, resultado, i=0;
        resultado = f.split('/');
        console.log(resultado);
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

  
    //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD   2017/03/31  2017-03-31
    fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1])-1 ,  Number(resultado[2]));
        return _thoy;
    }

    //CONVERTIR DATE A STRING PARA FECHA  - ---   BD A GRILLA
    _fecha(fecha: Date) :string{
        console.log(fecha);
        let fechaProg : string; let _fechaProg : string; let _fecha = new Date(fecha);  
        console.log(_fecha);
        _fechaProg=(_fecha.getFullYear()).toString() +" / "+ (_fecha.getMonth()+1 ).toString() +" / "+(_fecha.getDate()).toString() ;
        
        console.log(_fechaProg);
        _fechaProg=this.cCeroFecha(_fechaProg);
        
        return  _fechaProg;
    }

  //AQUI SE GUARDA TANTO CABECERA COMO DETALLE Y SE EDITA LA TABLA PROGRAMACIONDETALLE EL CAMPO ASIGNADO
    guardarTarjeta(){

        //VALIDANDO DATOS INGRESADOS
        let error=[
            {nomb:"Puntos De Control", val:0},
            {nomb:"Programacion", val:0},
            {nomb:"Fecha de la Programacion", val:0},
            {nomb:"Lista de Placas", val:0},
            {nomb:"Estado", val:0},
            {nomb:"Hora de Salida", val:0},
            {nomb:"Cuota", val:0}
        ];

       
            //NUEVO REGISTRO
            if(this.tarjeta._TaCoId == 0){
                //SUBIENDO DATOS AL OBJETO TARJETA this.tarjeta._prId = id;
                    //HORA SALIDA               
                    {
                        let thoy:Date,  otra:Date, horaTarjeta:string;
                        thoy=new Date();          
                        //COMPLETANDO LOS SEGUNDOS SI ES NECESARIO
                        if(this.tarjeta._TaCoHoraSalida.length<=5){
                            this.tarjeta._TaCoHoraSalida = this.tarjeta._TaCoHoraSalida+":00"; }
                        horaTarjeta=this.tarjeta._TaCoHoraSalida;
                        let resultado=horaTarjeta.split(':');
                        otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
                        this.tarjeta._TaCoHoraSalida=otra;
                    }
                        
                    this._tarjeta ={
                        TaCoId : this.tarjeta._TaCoId,
                        PuCoId : this.tarjeta._PuCoId,
                        RuId : this.tarjeta._RuId,
                        BuId :this.tarjeta._BuId,
                        PrId : this.tarjeta._prId,
                        TaCoFecha :this.fecha(this.tarjeta._TaCoFecha),
                        TaCoHoraSalida :this.tarjeta._TaCoHoraSalida,
                        TaCoCuota :this.tarjeta._TaCoCuota,
                        UsId :this.tarjeta._UsId,
                        UsFechaReg :new Date(),
                        TaCoNroVuelta : this.tarjeta._TaCoNroVuelta = 1
                    }
                    console.log(this._tarjeta);
                    console.log(this.val);

                    if(this.val==1 || this.val==0){
                        this.tcontrolservice.asignarTarjetaControl(this._tarjeta).
                        subscribe(data => {},   
                            err => {this.errorMessage=err}
                        );
                    }else if(this.val==2){
                        //ACTUALIZAR PROGRAAMCION DETALLE EN EL CAMPO ASIGNADO, SALE COMO ausente
                        console.log("ausente");
                        this._tarjeta ={
                            PrDeId : this._prDeId,
                            PrDeAsignadoTarjeta : this.val
                        }
                        this.tcontrolservice.actualizarProgDetalleAusente(this._tarjeta).
                        subscribe(data => {}, err => {this.errorMessage=err});
                    }        
    
            //EDITANDO REGISTRO
            }else if(this.tarjeta._TaCoId != 0){
                console.log("editando reg");

            }

        this.displayAsignarTarjeta = false;
    }
   

    eliminarC(PuCoId :number){
        console.log(PuCoId);
        this._PuCoId = PuCoId;
        this.displayConfirmarEliminar = true;
       this.mensaje ="¿Esta Seguro de Eliminar el Registro?";
    }

    _eliminarC(){
         this.tcontrolservice.deleteTarjetaControl(this._PuCoId).subscribe(
            realizar =>{this.getalltarjetacontrol();},
            err => {console.log(err);}
        );
    }
    cancelar_eliminarC(){
        this._PuCoId = 0;
        this.displayConfirmarEliminar = false;
    }
    editarC(taCoId: number){
        this.displayEditarTarjeta=true;
        //RECUPERAR EL OBJETO DESDE LA BD PARA EDITARLO
        this.tcontrolservice.getAllTarjetaControlById(taCoId).subscribe(
            data => {this.tarjeta=data; 
                console.log(this.tarjeta);},
            err => {this.errorMessage = err},
            () => this.isLoading=false    
        );
        //CARGAR LOS OBJETOS
        //this.tarjeta._TaCoCuota = 9;
    }

    //SELECCIONAR PUNTOS DE CONTROL DEL COMBOBOX
    puntosControlId(event:Event){
        console.log(this.puntoControl);
        this.idPunto = this.puntoControl.PuCoId;
        let ruID = this.puntoControl.RuId;

        //PASANDO DATOS AL OBJETO
            this.tarjeta._RuId = ruID;
            this.tarjeta._PuCoId = this.idPunto;
        //CONSULTANDO TODOS LOS PUNTOS DE CONTROL(DETALLE) USARLOS PARA INICIAR LA TAREJTADETALLE
            this.getallpuntocontroldetallebypuco(this.idPunto);
    }

    //SELECCIONAR PROGRAMACION COMBOBOX
    programacionId(event:Event){
        console.log(this._prId);
        this.tarjeta._prId=this._prId;
    }

    //SELECCIONAR PLACA DE BUS COMOBOBOX
    placaObj(event : Event){
        this.val=0;
        //console.log(this.placa);
        this._prDeId = this.placa.PrDeId;
        this.tarjeta._BuId=this.placa.BuId;
        this.val = this.placa.PrDeAsignadoTarjeta;
        //console.log(this._prDeId+"_"+this.tarjeta._BuId+"_"+this.val);
    }

    editarDetalle(pucodeid:number){
        console.log(pucodeid);
    }

    onRowPlaca(event){    
        let obj = event.data; //ID DE LA PLACA EN LA BD
        console.log(obj);
        this.val=0;
        this._prDeId = obj.PrDeId;
        this.tarjeta._BuId=obj.BuId;
        this.val = obj.PrDeAsignadoTarjeta;
    }
}


        /*
            if(this.idPunto!=0){
                //NUEVO REGISTRO
                if(this.tarjeta._TaCoId == 0){
                    //SUBIENDO DATOS AL OBJETO TARJETA this.tarjeta._prId = id;
                        //HORA SALIDA               
                        {
                            let thoy:Date,  otra:Date, horaTarjeta:string;
                            thoy=new Date();          
                            //COMPLETANDO LOS SEGUNDOS SI ES NECESARIO
                            if(this.tarjeta._TaCoHoraSalida.length<=5){
                                this.tarjeta._TaCoHoraSalida = this.tarjeta._TaCoHoraSalida+":00"; }
                            horaTarjeta=this.tarjeta._TaCoHoraSalida;
                            let resultado=horaTarjeta.split(':');
                            otra=new Date(thoy.getFullYear(),thoy.getMonth(),thoy.getDate(),Number(resultado[0]),Number(resultado[1]),Number(resultado[2]));    
                            this.tarjeta._TaCoHoraSalida=otra;
                        }
                            
                        this._tarjeta ={
                            TaCoId : this.tarjeta._TaCoId,
                            PuCoId : this.tarjeta._PuCoId,
                            RuId : this.tarjeta._RuId,
                            BuId :this.tarjeta._BuId,
                            PrId : this.tarjeta._prId,

                            TaCoFecha :this.fecha(this.tarjeta._TaCoFecha),
                            
                            TaCoHoraSalida :this.tarjeta._TaCoHoraSalida,
                            TaCoCuota :this.tarjeta._TaCoCuota,
                            UsId :this.tarjeta._UsId,
                            UsFechaReg :new Date(),
                            TaCoNroVuelta : this.tarjeta._TaCoNroVuelta
                        }
                        console.log(this._tarjeta.TaCoFecha);

                        if(this.val==1 || this.val==0){
                            this.tcontrolservice.asignarTarjetaControl(this._tarjeta).subscribe(data => {},err => {this.errorMessage=err});
                        }else if(this.val==2){
                            //ACTUALIZAR PROGRAAMCION DETALLE EN EL CAMPO ASIGNADO, SALE COMO ausente
                            console.log("ausente");
                            this._tarjeta ={PrDeId : this._prDeId,PrDeAsignadoTarjeta : this.val}
                            this.tcontrolservice.actualizarProgDetalleAusente(this._tarjeta).subscribe(data => {}, err => {this.errorMessage=err});
                        }        
        
                //EDITANDO REGISTRO
                }else if(this.tarjeta._TaCoId != 0){
                    console.log("editando reg");

                }

            }else if(this.idPunto ==0){
                //HACER UNA VENTANA MODAL CON ESTE MENSAJE
                console.log("NO SELECCIONO LISTA PUNTOS DE CONTROL");

            }

                  //TACOID CAMBIANDO A SU DESCRIPCION this._puntosControl  console.log(this._allTarjControl[j].PuCoId+"_"+this._puntosControl[k].PuCoId);
       /* 
            j=0; k=0; cen=0;
            console.log(this._allTarjControl);
            console.log(this.puntosControl);

            while(j < this._allTarjControl.length){
                while(k<this.puntosControl.length && cen==0){
                    if(this._allTarjControl[j].PuCoId == this.puntosControl[k].PuCoId){
                        //console.log(this.puntosControl[k].PuCoId);
                        this._allTarjControl[j].rutaDescripcion = this.puntosControl[k].RuDescripcion;
                        cen=1;
                    }else if(this._allTarjControl[j].PuCoId != this.puntosControl[k].PuCoId){
                        k++;
                    }
                }
                k=0;
                cen=0;
                j++;
            }
       */
        //CONVIRTIENDO A STRING LA FECHAconsole.log(this._allTarjControl);
        