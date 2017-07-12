import {Component, OnInit} from '@angular/core';
import { BusService } from '../service/bus.service';

@Component({
    selector: 'app-bus',
    templateUrl	: '../views/bus.component.html',
    styleUrls: ['../styles/bus.component.css']
})

export class BusComponent implements OnInit{


    /* OBJETOS*/
    bus:any={
        BuId : 0,
        SuEmId : 0,
        BuPlaca : "",
        BuAnio :"",
        BuMotor :"",
        BuDescripcion :"",
        BuTipoCombustible:"",
        BuColor:"",
        BuCapacidad:"",
        BuMarca:"",
        BuTipo:"",
        BuSOAT:"",
        BuModelo:"",
        BuOperatividad:"",
        BuActivo:"",
        BuFechaIngreso:"",
        BuFechaSalida:"",
        UsId:0,
        UsFechaReg:"",
    }
    objBus:any;
    busD={
        PeId:null,
        BuId:null,
        BuPeTipo:"",
        UsId:null,
        UsFechaReg:null
    }

    /*ARRAYS */
    _bus=[]; /*ARRAY BD*/
    _gbus=[]; /*ARRAY GRILLA*/
    _busD=[];
    _gbusD=[];

    /* VARIEBLES*/
    titulo:string;
    mensaje:string;

    /* DISPLAY MODAL*/
    displayNuevoBus : boolean = false;
    displayNuevoBusD : boolean = false;
    displayAceptarNuevoBus : boolean = false;
    displayEliminarBus : boolean = false;
    displayEliminarBusD : boolean = false;
    

    /* OTRAS VARIABLES*/
    private isLoading : boolean;
    private errorMessage:string='';
    private idDelReg:number = 0; /* ID REG A ELIMINAR */
    private busId:any;

    constructor(private busService: BusService){}

    ngOnInit(){
        this.bus.SuEmId=1;
        this.getallbusbyemidsuemid(1,1);
       
    }
    
    /* CONSULTA TODOS LOS BUSES */
    getallbusbyemidsuemid(emid:number, suemid:number){
        this.busService.getAllBusByEmEmSu(emid, suemid).subscribe(
            data => {this._bus=data; console.log(this._bus); this.mgBus();},
            err => {this.errorMessage = err},
            () => this.isLoading = false
        );
    }

    /* NUEVO OBJETO BUS*/ 
    nuevoBus(){
        this.titulo="Nuevo Registro";
        this.displayNuevoBus = true;
        this.busId=0;
        this.busService.newBus().subscribe(data => {this.objBus=data; console.log(this.objBus);})
    }

    /* EDITAR OBJETO BUS*/ 
    editarBus(buid : number){
        /* BUSCANDO OBJETO */
        this.busId=buid;
        this.busService.getBusById(buid).subscribe(
            data => {
                        this.bus=data; 
                        this.bus.BuActivo=this.bus.BuActivo.toString();
                        this.bus.BuOperatividad=this.bus.BuOperatividad.toString();
                        
                        this.bus.BuFechaIngreso=this.formatFech(this._fecha(this.bus.BuFechaIngreso));
                        this.bus.BuFechaSalida=this.formatFech(this._fecha(this.bus.BuFechaSalida));

                        if(this.bus.BuActivo == "true"){
                            this.bus.BuActivo="si";
                        }else if(this.bus.BuActivo == "false"){
                            this.bus.BuActivo="no";
                        }

                        if(this.bus.BuOperatividad == "true"){
                            this.bus.BuOperatividad="si";
                        }else if(this.bus.BuOperatividad=="false"){
                            this.bus.BuOperatividad="no";
                        }
                        console.log(this.bus);
                        /* FECHAS */
                    },
            error => {this.errorMessage = error}
        );

        this.titulo = "Editar Registro";
        this.displayNuevoBus = true;
    }

    /* CUADRO ELIMINAR REGISTRO BUS*/ 
    eliminarBus(idbus : number){
        /*console.log("eliminar");*/
        this.mensaje="¿Esta Seguro De Eliminar El Registro?";
        this.displayEliminarBus = true;
        this.idDelReg=idbus;
        console.log(idbus);
    }

    /* ELIMINAR REGISTRO BUS DE LA BD */ 
    _eliminarBus(){
        this.mensaje ="";        
       
        /* CONSULTA ELIMINAR BUS*/
        this.busService.deleteBus(this.idDelReg).subscribe(
            realizar => { this.getallbusbyemidsuemid(1,1); this.displayEliminarBus=false;},
            error => {console.log(error);}
        );
        
        this.displayEliminarBus = false;
        this.idDelReg=0;
    }

    cancelEliminar(){
        this.mensaje = "";
        this.displayEliminarBus=false;
        this.idDelReg=0; /* REINICIANDO VARIABLE*/
        /*BORRAR DE MEMORIA EL OBJETO*/
    }

    /* MOSTRAR DATOS EN GRILLA*/
    mgBus(){
        this._gbus=[];
        for(let bus of this._bus){
            this._gbus.push({
                nro : 0, BuId:bus.BuId, BuDescripcion : bus.BuDescripcion, BuPlaca : bus.BuPlaca, BuMarca : bus.BuMarca, BuCapacidad : bus.BuCapacidad
            });
        }
        for(let i=0; i<this._bus.length;i++){
            this._gbus[i].nro=i+1;
        }
    }

    /* TABLE BUS  - SELECCIONA REGISTRO CABECERA Y MUESTRA LOS DETALLES DEL BUS*/
    onRowSelectBus(event){
        console.log("seleccionado :s");
        this.mgBusD();
    }

    /* GUARDAR EN LA BASE DE DATOS */
    guardarbus(){
        this.titulo="";
        this.displayNuevoBus = false;
        this.mensaje = "Se Guardo Un Nuevo Registro";

         /* CONDICIONAL SI NO OPE */
        if(this.bus.BuActivo=="si"){
            this.bus.BuActivo=true;
        }else if(this.bus.BuActivo=="no"){
            this.bus.BuActivo=false;
        }

        /* CONDICIONAL SI NO ACT */
        if(this.bus.BuOperatividad=="si"){
            this.bus.BuOperatividad=true;
        }else if(this.bus.BuOperatividad=="no"){
            this.bus.BuOperatividad=false;
        }

         this.objBus={
            BuActivo : this.bus.BuActivo,
            BuAnio :this.bus.BuAnio,
            BuCapacidad:this.bus.BuCapacidad,
            BuColor:this.bus.BuColor,
            BuDescripcion:this.bus.BuDescripcion,
            BuFechaIngreso:this.fecha(this.bus.BuFechaIngreso),
            BuFechaSalida:this.fecha(this.bus.BuFechaSalida),
            BuId:this.busId,
            BuMarca:this.bus.BuMarca,
            BuModelo:this.bus.BuModelo,
            BuMotor:this.bus.BuMotor,
            BuOperatividad:this.bus.BuOperatividad,
            BuPlaca:this.bus.BuPlaca,
            BuSOAT:this.bus.BuSOAT,
            BuTipo:this.bus.BuTipo,
            BuTipoCombustible:this.bus.BuTipoCombustible,
            SuEmId:this.bus.SuEmId,
            UsFechaReg:new Date(),
            UsId:this.bus.UsId
        }

       

        /* CONDICIONAL NUEVO REGISTRO O EDITADO*/
        if(this.busId == 0){
            console.log("NUEVO REGISTRO");
           this.objBus.BuId=0;

        }else if(this.busId != 0){
            console.log("EDITANDO REGISTRO");
            this.objBus.BuId=this.busId;
        }

        console.log(this.objBus);
    
        

        /*SERVICIO SAVE BD*/
        this.busService.saveBus(this.objBus).subscribe(
                    realizar => {this.getallbusbyemidsuemid(1,1);},
                    err => {this.errorMessage = err}
        );

        /*PROCEDIMIENTO GUARDAR NUEVO REGISTRO */ 
        this.displayAceptarNuevoBus = true;
    }

    /* CANCELAR GUARDAR NUEVO BUS O EDITARLO */
    cancelarbus(){
        /*MENSAJE SI ES O NO UN NUEVO REGISTRO
        if(){

        }else if(){

        }*/
        this.busService.newBus().subscribe(data => { this.bus=null; this.bus=data; this.bus.BuAnio=null; })
        this.displayNuevoBus = false;
    }

    /* MENSAJE CONFIRMAR NUEVO BUS GUARDADO*/
    aceptarNuevoBus(){
        this.mensaje="";
        this.displayAceptarNuevoBus=false;
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

    //CONVERTIR STRING A DATE PARA FECHA   ----   FORMULARIO A BD   2017/03/31  2017-03-31
    fecha(fecha: string) : Date{
        let thoy:Date , _thoy:Date, _fecha:string;
        thoy = new Date();
        _fecha = fecha;
        /*console.log("antes :"+_fecha);*/
        let resultado=_fecha.split('-');
        _thoy = new Date(  Number(resultado[0]),  Number(resultado[1]) -1 ,  Number(resultado[2]) , 12, 0,0 );
        /*console.log("despues :"+_thoy);*/

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

     /* DANDO FORMATO A LA FECHA PARA SER EDITADA EN EL FORMULARIO DE EDITAR*/
    formatFech(f : string) : string{
        let _f, r, aux;
        _f = f.split("/");
        aux = _f[0]; _f[0]=_f[2]; _f[2]=aux;
        r = _f.join("-");
        return r;
    }

/* TABLA BUS DETALLE*/
    mgBusD(){
        this._gbusD=[];
        console.log("bus bus");
        for(let busd of this._busD){
            this._gbusD.push({
                nro: 0,
                PeId:busd.PeId,
                BuId:busd.BuId,
                BuPeTipo:busd.BuPeTipo,
                UsId:busd.UsId
            });
        }

        for(let i; i<this._busD.length; i++){
            this._gbusD[i]=i+1;
        }
    }

    nuevoBusD(){
        this.displayNuevoBusD=true;
    }

    editarBusD(busd : Object){}

    eliminarBusD(PeId : number){
        this.mensaje="¿Esta Seguro De ELiminar el Registro?";
        this.displayEliminarBusD=true;
    }
    _eliminarBusD(){
        this.mensaje="";

        /*CONSULTA Y RECUPERAR VARIABLE PA ELIMINAR */ 
        this.displayEliminarBusD=false;
    }
    cancEliBusD(){
        this.mensaje="";
        this.displayEliminarBusD=false;
    }

}