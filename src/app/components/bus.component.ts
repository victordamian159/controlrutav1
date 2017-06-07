import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-bus',
    templateUrl	: '../views/bus.component.html',
    styleUrls: ['../styles/bus.component.css']
})

export class BusComponent implements OnInit{
    /* OBJETOS*/
    bus={
        BuId : null,
        SuEmId : null,
        BuPlaca : "",
        BuAnio :null,
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

    /*ARRAYS */
    _bus=[]; /*ARRAY BD*/
    _gbus=[]; /*ARRAY GRILLA*/

    /* VARIEBLES*/
    titulo:string;
    mensaje:string;

    /* DISPLAY MODAL*/
    displayNuevoBus : boolean = false;
    displayAceptarNuevoBus : boolean = false;

    /* OTRAS VARIABLES*/
    
    
    ngOnInit(){
        this._bus=[
            {BuEmp : "CAMOTE", BuPlaca : "CSD 1231", BuCombustible : "COCA COLA", BuSOAT : "3242341213NLKML", BuModelo : "MARIPOSA"},
            {BuEmp : "PAPA HUAYRO", BuPlaca : "XZ 131", BuCombustible : "VENCINA", BuSOAT : "90809090FFFML", BuModelo : "ABEJITA"},
            {BuEmp : "OLLUCO", BuPlaca : "ÑD 1441", BuCombustible : "KEROSENE", BuSOAT : "02I3029MD029", BuModelo : "TORTUGA"},
            {BuEmp : "RUTA NRO 18", BuPlaca : "PP 199", BuCombustible : "GASOLINA", BuSOAT : "D2LK3D2D23988293", BuModelo : "CORRE CAMINOS"},
            {BuEmp : "ALBERT EINSTEIN", BuPlaca : "DD 331", BuCombustible : "GLP", BuSOAT : "384F3J9843JN38 ", BuModelo : "CARACOL"},
            {BuEmp : "XILOFONO", BuPlaca : "AAW 151", BuCombustible : "PETROLEO", BuSOAT : "2320000000SCDCD", BuModelo : "ESCARABAJO"},
            {BuEmp : "RUTA 13", BuPlaca : "MWM 100", BuCombustible : "CHICHA MORADA", BuSOAT : "ML342FM2MLKMLKM", BuModelo : "BAGONETA"},
            {BuEmp : "RUTA UTA", BuPlaca : "AAA 1351", BuCombustible : "PISCO", BuSOAT : "22225555500S1233CD", BuModelo : "MINI BAND"},
            {BuEmp : "RUTA 13", BuPlaca : "MWM 100", BuCombustible : "ALCOHOL", BuSOAT : "ML342FM2MLKMLKM", BuModelo : "GAVIOTA"}
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

    /* NUEVO OBJETO BUS*/ 
    eliminarBus(idbus : number){
        console.log("eliminar");
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
}