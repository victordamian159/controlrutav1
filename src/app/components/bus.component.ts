import {Component, OnInit} from '@angular/core';
import { BusService } from '../service/bus.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {hora,_hora,_cCeroFecha} from 'app/funciones';
import {PersService} from '../service/personal.service';
import {EmpPerService} from '../service/empresapersonal.service';
import {TeleMovilService} from '../service/telefono.service';

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
        busPer={
            PeId:null,
            BuId:null,
            BuPeTipo:"",
            UsId:null,
            UsFechaReg:null
        }
        private objBusPer:any;
        private objTeMovil:any;

    /*ARRAYS */
        _bus=[]; /*ARRAY BD*/
        _gbus=[]; /*ARRAY GRILLA*/
        _busPer=[]; /*ARRAY BD*/
        _gbusPer=[]; /*ARRAY GRILLA*/
        private arrEmpPer:any[]=[]; /* ARRAY PERSONAS POR SUBEMPRESAS(DATATABLE PRINCIPAL) */
        _arrsuEmp:any[]=[]; //ARRAY COMBO SUBEMPRESAS
        private arrTipoEmpPer:any[]=[]; // ARRAY TIPOS DE PERSONA EN LA EMPRESA
        private arrBuPeTipo:any[]=[]; /* TIPO DE CARGO DENTRO DEL BUS */
        private telefono:any={
                    TeMarca:"",
                    TeImei:"",
                    TeModelo:"",
                    TeVersionAndroid :""
                }
        private combustibles:any=[{id:"",nomb:""}]
        private activo:any=[{id:"",nomb:""}]
        private operativo:any=[{id:"",nomb:""}]

    /* VARIEBLES*/
        private emid:number;
        private suemid:number;
        private _suemid:number; /* VARIABLE ASOCIADA A COMBO SUBEMPS */
        private BuPeTipo:number; /* VARIABLE ASOCIADA A COMBO BUSPERSONA TIPO */
        private EmPeId:number; /* VARIABLE ASOC FILA DE TABLA EMPRESAPERSONA - PARA TABLA BUSPERSONA */
        private BuId:number; /* PARA TABLA BUSPERSONA */
        private BuPlaca:string; /* PARA TABLA BUSPERSONA */
        private BuPeId:number; /* PARA TABLA BUSPERSONA */
        private TeId:number; 
        private BuTipoCombustible:string; /* VAR COMBO COMBUSTIBLES FORM NUEVO BUS */
        private BuOperatividad:number; 
        private BuActivo:number;


        titulo:string;
        mensaje:string;

    /* DISPLAY MODAL*/
        displayNuevoBus : boolean = false;
        displayNuevoBusPersona : boolean = false;
        displayAceptarNuevoBus : boolean = false;
        displayEliminarBus : boolean = false;
        displayEliminarBusPers : boolean = false;
        displayNuevoTelMovil:boolean=false;
        displayNuevoTelefono:boolean=false;
    

    /* OTRAS VARIABLES*/
        private isLoading : boolean;
        private errorMessage:string='';
        private idDelReg:number = 0; /* ID REG A ELIMINAR */
        private busId:any;
        private userId:number;
        private SuEmRSocial:string;

    constructor(private busService: BusService,
                private empSubempservice : EmpSubEmpService,
                private empPerservice : EmpPerService,
                private movilService : TeleMovilService){}

    ngOnInit(){
        this.BuPlaca="none";
        this.emid=1;
        this.userId=1;
        this._suemid=0; /*VARIABLE COMBO SUBEMPRE FORM PRINCIPAL */
        /*this.suemid=1; this.bus.EmId=1; this.bus.SuEmId=1;*/
        this.arrTipoEmpPer=[{id:'01',perTEmpPer:'GERENTE'},{id:'02',perTEmpPer:'ADMINISTRADOR'},
                            {id:'03',perTEmpPer:'COBRADOR'},{id:'04',perTEmpPer:'ASOCIADOS'},
                            {id:'05',perTEmpPer:'CHOFER'},{id:'06',perTEmpPer:'CONTROLADOR'}];
        this.arrBuPeTipo=[{id:'01',cargo:'CHOFER'}, {id:'02',cargo:'COBRADOR'}];
        this.getallsuembyemid(this.emid);
        this.combustibles=[{id:"01",nomb:"GASOLINA"},{id:"02",nomb:"PETROLEO"},{id:"03",nomb:"GLP"},
                           {id:"04",nomb:"ELECTRICO"},{id:"05",nomb:"DIESEL"},{id:"06",nomb:"HIBRIDO"}]

        this.operativo=[{id:1,nomb:"SI"},{id:0,nomb:"NO"}];
        this.activo=[{id:1,nomb:"SI"},{id:0,nomb:"NO"}];
    }
    /* PROCEDURES */
        /* TABLA BUS */
            procNuevoBus(){
    
                let fechaAct = new Date(), año=fechaAct.getFullYear(), mes=fechaAct.getMonth()+1, dia=fechaAct.getDate();
                let f=[año,mes,dia]; let _f=f.join("-"); let fecha=_cCeroFecha(_f); 
                this.bus={};
                this.busId=0;
                this.bus.BuFechaIngreso=fecha;
                this.bus.BuFechaSalida=fecha;
                
                this.busService.newBus().subscribe(
                        data => {this.objBus=data;}
                );
            }

        /* TABLA BUSPERSONA */
            /* NUEVO */
                procNuevoBusPer(){
                    this.BuPeId=0;
                    this.busService.newBusPersona().subscribe(
                        data => {this.objBusPer=data;}
                    );
                }
            /* GUARDAR */
                procSaveNuevoBusPer(obj : Object){
                    this.busService.saveBusPersona(obj).subscribe( 
                        realizar => {},
                            err => { this.errorMessage = err }
                    );
                }
            /* BUSCAR POR ID */
            /* ELIMINAR */
        
        /* TABLA TELEFONO */
            /* ALL TELEFONOS BY BUID */ 
            /* NUEVO */
                procNuevoTeleMovil(){
                    this.TeId=0;
                    this.movilService.newTeMov().subscribe(
                        data => {this.objTeMovil=data; console.log(this.objTeMovil);}
                    );
                }
            /* GUARDAR */
                procSaveNuevoTeleMovil(obj : Object){
                    this.movilService.saveTeMov(obj).subscribe( 
                        realizar => {},
                            err => { this.errorMessage = err }
                    );
                }
            /* BUSCAR POR ID */
                getTeleMovilbyId(teid:number){
                    let objTel:any;
                    this.movilService.getTeMovById(teid).subscribe(
                        data => { objTel = data; this.mformTeleMovil(objTel);},
                                err => {this.errorMessage = err}, 
                                () =>this.isLoading = false
                    );
                }
            /* ELIMINAR */
                procDeleteTeleMovil(teid:number){
                    this.movilService.deleteTeMov(teid).subscribe(
                        realizar => {},
                             err => {console.log(err);}
                    );
                }

     /* FUNCION ASOCIA A COMBO SUBEMPRESAS (FORM NUEVO BUSPERSONA) */ 
        _SuEmId(){
            console.log(this.suemid);
            /* PROCEDURE BUSCAR TODAS LAS PERSONA(EN CADA SUBEMPRESA) POR EMID Y SUEMID */
            this.getallempPerByEmIdSuEmId(this.emid,this.suemid);
        }
    
    /* PROCEDURE OBTENIENDO DATOS -> EMPRESAPERSONA TODAS LAS PERSONAS DENTRO DE UNA SUBEMP */
        getallempPerByEmIdSuEmId(emid:number, suemid:number){
            let empPer:any[]=[];
            this.empPerservice.getallempperbyemidsuemid(emid,suemid).subscribe(
                data => { empPer=data; 
                            /* FOR TABLE NEW BUSPERSONAL */
                            this.mgEmprPers(empPer);},
                err => {this.errorMessage=err},
            );
        }

    /* TABLA EMPPER GRILLA ASIGNAR BUSPERSONA */
        mgEmprPers(arrEmpPer=[]){
            this.arrEmpPer=[];
            for(let empper of arrEmpPer){
                this.arrEmpPer.push({
                    nro:0,
                    EmPeTipo:empper.EmPeTipo,
                    Id:empper.Id,
                    PeApellidos:empper.PeApellidos,
                    PeDNI:empper.PeDNI,
                    PeNombres:empper.PeNombres,
                    SuEmRSocial:empper.SuEmRSocial
                });
            }
            /* ENUMERANDO FILAS */
            for(let i=0; i<this.arrEmpPer.length;i++){
                this.arrEmpPer[i].nro=i+1;
            }

            /* MOSTRANDO CARGOS arrTipoEmpPer */
            let i=0,j=0,cen=0;
            while(i<this.arrEmpPer.length){
                while(j<this.arrTipoEmpPer.length && cen==0){
                    if(this.arrEmpPer[i].EmPeTipo==this.arrTipoEmpPer[j].id){
                        this.arrEmpPer[i].EmPeTipo= this.arrTipoEmpPer[j].perTEmpPer;
                        cen=1;
                    }else if(this.arrEmpPer[i].EmPeTipo!=this.arrTipoEmpPer[j].id){
                        j++;cen=0;
                    }
                }
                cen=0;
                j=0;
                i++;
            }
        }

    /* CONSULTA TODAS LAS SUBEMPRESAS POR EMID */
    getallsuembyemid(emid:number){
        let arrsuemp:any=[]=[];
        this.empSubempservice.getallsubempresasbyemid(emid).subscribe(
            data => {arrsuemp=data; this.mcSubEmpresas(arrsuemp); }
        );
    }
    
    /* CONSULTA TODOS LOS BUSES POR EMPRESA Y SUBEMPRESA*/
    getallbusbyemidsuemid(emid:number, suemid:number){
        this.busService.getAllBusByEmEmSu(emid, suemid).subscribe(
            data => {this._bus=data; this.mgBus();},
            err => {this.errorMessage = err},
            () => this.isLoading = false
        );
    }

    /* CONSULTA BUSES POR PERSONA */
    getallbusbypersona(emid:number, suemid:number, buid:number){
        let busPers:any[]=[];
        this.busService.getAllBusByEmEmSubuId(emid,suemid,buid).subscribe(
            data => {busPers=data; this._gbusPer=busPers;},
            err => {this.errorMessage = err},
            () => this.isLoading = false
        );
    }

    /* MOSTRAR SUBEMPRESAS EN COMBO */
    mcSubEmpresas(arrsuEmp=[]){
        this._arrsuEmp=[];
        for(let suemp of arrsuEmp){
            this._arrsuEmp.push({
                SuEmId:suemp.SuEmId,
                SuEmRSocial:suemp.SuEmRSocial,
                SuEmRuc:suemp.SuEmRuc,
                SuEmDireccion:suemp.SuEmDireccion,
                SuEmTiempoVuelta:suemp.SuEmTiempoVuelta
            });
        }
    }
    /* FORM PRINCIPAL BTNNUEVO */
        /* NUEVO OBJETO BUS BTNNUEVO BUS*/ 
            nuevoBus(){
                this.titulo="Nuevo Registro";
                this.displayNuevoBus = true;
                
                /*this.busService.newBus().subscribe(data => {this.objBus=data; console.log(this.objBus);});*/
                this.procNuevoBus();
            }
        /* BTNNUEVO BUSPERSONA */
            nuevoBusPersona(){
                this.displayNuevoBusPersona=true;
                this.procNuevoBusPer();
            }
        /* BTN NUEVO NUEVO TELEFONO MOVIL  */
            nuevoTelMovPersona(){
                this.displayNuevoTelMovil=true;
                this.titulo="Agregando Movil a la Placa "+this.BuPlaca;
                this.procNuevoTeleMovil();
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



    /* MOSTRAR DATOS RECUPERADOS TELEFONO MOVIL EN FORMULARIO */ 
    mformTeleMovil(TelMovil:any){
        console.log(TelMovil);
    }

    /* MOSTRAR TODOS LOS BUSES EN GRILLA PRINCIPAL*/
    mgBus(){
        this._gbus=[];
        for(let bus of this._bus){
            this._gbus.push({
                nro : 0, 
                BuId:bus.BuId, 
                SuEmId:bus.SuEmId,
                BuDescripcion : bus.BuDescripcion, 
                BuPlaca : bus.BuPlaca, 
                BuMarca : bus.BuMarca, 
                BuCapacidad : bus.BuCapacidad
            });
        }
        for(let i=0; i<this._bus.length;i++){
            this._gbus[i].nro=i+1;
        }
    }

    /* FUNCIONES - SELECCION UNA FILA DE UN DATATABLE */
        /* TABLE BUS  - SELECCIONA REGISTRO CABECERA Y MUESTRA LOS DETALLES DEL BUS*/
            onRowSelectBus(event){
                let emid:number, suemid:number, buid:number;
                emid=this.emid; suemid=event.data.SuEmId; buid=event.data.BuId;
                console.log(emid);
                console.log(suemid);
                console.log(buid);
                this.getallbusbypersona(emid,suemid,buid);
                this.mgBusPer(this._gbusPer);

                this.BuId=event.data.BuId;
                this.BuPlaca=event.data.BuPlaca;
            }

        /* TABLA EMPPER -- FORM NUEVO BUSPERSONA */
            onRowSelectEmpPer(event){
                this.EmPeId=event.data.Id;
            }

    /* GUARDAR NUEVO BUS EN LA BD */
    guardarbus(){
        this.titulo=""; this.displayNuevoBus = false;  this.mensaje = "Se Guardo Un Nuevo Registro";

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
            //BuActivo : Number(this.bus.BuActivo),
            BuActivo :this.BuActivo,
            BuAnio :Number(this.bus.BuAnio),
            BuCapacidad:this.bus.BuCapacidad,
            BuColor:this.bus.BuColor,
            BuDescripcion:this.bus.BuDescripcion,
            BuFechaIngreso:this.fecha(this.bus.BuFechaIngreso),
            BuFechaSalida:this.fecha(this.bus.BuFechaSalida),
            BuId:this.busId,
            BuMarca:this.bus.BuMarca,
            BuModelo:this.bus.BuModelo,
            BuMotor:this.bus.BuMotor,
            //BuOperatividad:Number(this.bus.BuOperatividad),
            BuOperatividad :this.BuOperatividad,
            BuPlaca:this.bus.BuPlaca,
            BuSOAT:this.bus.BuSOAT,
            BuTipo:this.bus.BuTipo,
            BuTipoCombustible:this.BuTipoCombustible,
            //SuEmId:this.bus.SuEmId,
            SuEmId:this._suemid,
            UsFechaReg:new Date(),
            UsId:this.userId
        }

        /* CONDICIONAL NUEVO REGISTRO O EDITADO*/
        if(this.busId == 0){
           this.objBus.BuId=0;
        }else if(this.busId != 0){
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

/* TABLA BUSPERSONA*/
    mgBusPer(arrBusPers=[]){
        this._gbusPer=[];
        for(let bus of arrBusPers){
            this._gbusPer.push({
                nro: 0,
                PeId:bus.PeId,
                BuId:bus.BuId,
                BuPeTipo:bus.BuPeTipo,
                UsId:bus.UsId
            });
        }
        for(let i; i<arrBusPers.length; i++){
            this._gbusPer[i]=i+1;
        }
        console.log(this._gbusPer);
    }

    

    editarBusPers(busd : Object){}

    eliminarBusPers(PeId : number){
        this.mensaje="¿Esta Seguro De ELiminar el Registro?";
        this.displayEliminarBusPers=true;
    }
    _eliminarBusPers(){
        this.mensaje="";

        /*CONSULTA Y RECUPERAR VARIABLE PA ELIMINAR */ 
        this.displayEliminarBusPers=false;
    }
    cancEliBusPers(){
        this.mensaje="";
        this.displayEliminarBusPers=false;
    }

    /* FUNCION GUARDAR - ASOCIADA A BTN GUARDAR NUEVO BUSPERSONA */
        guardarBusPer(){
            this.displayNuevoBusPersona=false;
            this.objBusPer={
                EmPeId:this.EmPeId,
                BuPeId:this.BuPeId,
                BuPeTipo:this.BuPeTipo,
                BuId:this.BuId,
                UsFechaReg:new Date(),
                UsId:this.userId
            }
            console.log(this.objBusPer);
            this.procSaveNuevoBusPer(this.objBusPer);
        }

        cancelarBusPer(){
            this.displayNuevoBusPersona=false;
            this.BuPeTipo=0;
            this.EmPeId=0;
            this.BuId=0;
        }

    /* FUNCION ASOCIADA AL COMBO SUBEMPRESAS FORM PRINCIPAL */ 
        SuEmId(){
            /*console.log(this._suemid);*/
            this.getallbusbyemidsuemid(this.emid,this._suemid);
            let cen=0,i=0;
            while(i<this._arrsuEmp.length && cen==0){
                if(this._suemid == this._arrsuEmp[i].SuEmId){
                    this.SuEmRSocial=this._arrsuEmp[i].SuEmRSocial;
                    cen=1;
                }
                i++;
            }
        }
    
    /* FUNCION ASOCIADA AL COMBO TIPO COMBUSTIBLE FORM NUEVO BUS */ 
        FunComb_Combustibles(){
            console.log(this.BuTipoCombustible);
        }
    
    /* BTN MODAL GUARDAR NUEVO TELEMOVIL */
        guardarTelMovil(){
            this.objTeMovil={
                TeId:this.TeId,
                TeMarca:this.telefono.TeMarca,
                TeImei:this.telefono.TeImei,
                TeModelo:this.telefono.TeModelo,
                TeVersionAndroid:this.telefono.TeVersionAndroid,
                TeActivo:true,
                BuId:this.BuId,
                UsFechaReg:new Date(),
                UsId:this.userId
            }
            if(this.TeId==0){
                this.objTeMovil.TeId=0;
            }else if(this.TeId!=0){
                this.objTeMovil.TeId=this.TeId;
            }
            /* PROCEDURE GUARDAR */
            console.log(this.objTeMovil);
            this.procSaveNuevoTeleMovil(this.objTeMovil);
            this.displayNuevoTelMovil=false;
        }

        cancelarTelMovil(){

        }

/*PASAR A LIBRERIA */ 
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

}