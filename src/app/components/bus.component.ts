import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-bus',
    templateUrl	: '../views/bus.component.html',
    styleUrls: ['../styles/bus.component.css']
})

export class BusComponent implements OnInit{
    buanio:string;
    bumotor:string;
    bucombus:string;
    /* OBJETOS*/
    bus={
        BuId : null,
        SuEmId : null,
        BuPlaca : "",
        BuAnio :"",
        BuMotor :"",
        BuDescripcion :"",
        BuTipoCombustible:null,
        BuColor:"",
        BuCapacidad:"",
        BuMarca:"",
        BuTipo:null,
        BuSOAT:"",
        BuModelo:"",
        BuOperatividad:null,
        BuActivo:null,
        BuFIngr:"",
        BuFSal:"",
        UsId:null,
        UsFechaReg:"",
    }
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
    displayAceptarNuevoBus : boolean = false;
    displayEliminarBus : boolean = false;
    displayEliminarBusD : boolean = false;

    /* OTRAS VARIABLES*/
    
    
    ngOnInit(){
        this._bus=[
            {BuId : 0, BuEmp : "CAMOTE", BuPlaca : "CSD 1231", BuCombustible : "COCA COLA", BuSOAT : "3242341213NLKML", BuModelo : "MARIPOSA"},
            {BuId : 1, BuEmp : "PAPA HUAYRO", BuPlaca : "XZ 131", BuCombustible : "VENCINA", BuSOAT : "90809090FFFML", BuModelo : "ABEJITA"},
            {BuId : 2, BuEmp : "OLLUCO", BuPlaca : "ÑD 1441", BuCombustible : "KEROSENE", BuSOAT : "02I3029MD029", BuModelo : "TORTUGA"},
            {BuId : 3, BuEmp : "RUTA NRO 18", BuPlaca : "PP 199", BuCombustible : "GASOLINA", BuSOAT : "D2LK3D2D23988293", BuModelo : "CORRE CAMINOS"},
            {BuId : 4, BuEmp : "ALBERT EINSTEIN", BuPlaca : "DD 331", BuCombustible : "GLP", BuSOAT : "384F3J9843JN38 ", BuModelo : "CARACOL"},
            {BuId : 5, BuEmp : "XILOFONO", BuPlaca : "AAW 151", BuCombustible : "PETROLEO", BuSOAT : "2320000000SCDCD", BuModelo : "ESCARABAJO"},
            {BuId : 6, BuEmp : "RUTA 13", BuPlaca : "MWM 100", BuCombustible : "CHICHA MORADA", BuSOAT : "ML342FM2MLKMLKM", BuModelo : "BAGONETA"},
            {BuId : 7, BuEmp : "RUTA UTA", BuPlaca : "AAA 1351", BuCombustible : "PISCO", BuSOAT : "22225555500S1233CD", BuModelo : "MINI BAND"},
            {BuId : 8, BuEmp : "RUTA 13", BuPlaca : "MWM 100", BuCombustible : "ALCOHOL", BuSOAT : "ML342FM2MLKMLKM", BuModelo : "GAVIOTA"}
        ];
        this._busD=[
            {PeId:0,BuId:0, BuPeTipo:"01",UsId:0,UsFechaReg:"08/06/2017"},
            {PeId:0,BuId:1, BuPeTipo:"00",UsId:0,UsFechaReg:"08/06/2017"},
            {PeId:0,BuId:2, BuPeTipo:"00",UsId:0,UsFechaReg:"08/06/2017"},
            {PeId:3,BuId:3, BuPeTipo:"00",UsId:0,UsFechaReg:"08/06/2017"},
            {PeId:7,BuId:3, BuPeTipo:"01",UsId:0,UsFechaReg:"08/06/2017"},
            {PeId:4,BuId:7, BuPeTipo:"01",UsId:0,UsFechaReg:"08/06/2017"},
            {PeId:4,BuId:9, BuPeTipo:"01",UsId:0,UsFechaReg:"08/06/2017"},
        ];
        this.mgBus();
    }
    
    /* NUEVO OBJETO BUS*/ 
    nuevoBus(){
        this.titulo="Nuevo Registro";
        this.displayNuevoBus = true;
    }

    /* NUEVO OBJETO BUS*/ 
    editarBus(bus : Object){
        console.log("editar");

        this.titulo = "EditarRegistro";
        this.displayNuevoBus = true;
    }

    /* ELIMINAR REGISTRO BUS*/ 
    eliminarBus(idbus : number){
        console.log("eliminar");
        this.mensaje="¿Esta Seguro De Eliminar El Registro?";
        this.displayEliminarBus = true;
    }
    
    _eliminarBus(idbus : number){
        this.mensaje ="";        
        /* CONSULTA ELIMINAR BUS*/
        this.displayEliminarBus = false;
    }
    cancelEliminar(){
        this.mensaje = "";
        this.displayEliminarBus=false;
        /*BORRAR DE MEMORIA EL OBJETO*/
        
    }
    /* MOSTRAR DATOS EN GRILLA*/
    mgBus(){
        for(let bus of this._bus){
            this._gbus.push({
                nro : 0,
                BuEmp : bus.BuEmp,
                BuPlaca : bus.BuPlaca,
                BuCombustible : bus.BuCombustible,
                BuSOAT : bus.BuSOAT,
                BuModelo : bus.BuModelo
            });
        }
        for(let i=0; i<this._bus.length;i++){
            this._gbus[i].nro=i+1;
        }
    }

    /* TABLE BUS */
    onRowSelectBus(event){
        console.log("seleccionado :s");
        this.mgBusD();
    }
    guardarbus(){
        this.titulo="";
        this.displayNuevoBus = false;
        this.mensaje = "Se Guardo Un Nuevo Registro";

        /* CONDICIONAL NUEVO REGISTRO O EDITADO*/
        if(this.bus.BuId==0){
            console.log("NUEVO REGISTRO");
        }else if(this.bus.BuId!=0){
            console.log("EDITANDO REGISTRO");
        }

        /*PROCEDIMIENTO GUARDAR NUEVO REGISTRO */ 
        this.displayAceptarNuevoBus = true;
        
        console.log("guardar");
    }
    cancelarbus(){
        this.displayNuevoBus = false;
        console.log("cancelado");
    }
    aceptarNuevoBus(){
        this.mensaje="";
        this.displayAceptarNuevoBus=false;
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
        
    }

    editarBusD(busd : Object){

    }
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