import {Component, OnInit} from '@angular/core';
import {GlobalVars} from 'app/variables';
import {BusService} from '../service/bus.service';
import {EmpSubEmpService} from '../service/empSubemp.service';

declare var jsPDF:any;

@Component({
    selector: 'app-repBuses',
    templateUrl	: '../views/reportBus.component.html',
    styleUrls: ['../styles/reportBus.component.css']
})

export class reportBuses implements OnInit{
    /* VARIABLES */
        /* OBJ */
            private oBus:any;
        /* NUMBER */
            private emid:number;
            private userId:number;
            private suemid:number;
        /* STRING */
            private optIdRep:string;
            private SuEmRSocial:string;
    /* ARRAYS */
        private cabReport:string[]=[];
        private arrReport:any[]=[];
        private arrOptReports:any[]=[];
        private arrOptListado:any[]=[];
        private arrTableCabBusEmp:any[]=[];
        private arrBusEmp:any[]=[];
        private arrBusEmpDescrip:any[]=[[]];
    /* VAR DISPLAY */
    /* DISABLED AND HIDDEN BTNS */
        private disBtnDescarga:boolean;
    ngOnInit(){}
    constructor(private busesService : BusService, public classglobalvars:GlobalVars, private empsuemservice : EmpSubEmpService){
        this.arrOptReports=[
            {id:"01", nomb:"Personas & Buses"},
            {id:"02", nomb:"Telefonos & Buses"},
            {id:"03", nomb:"Buses por SubEmpresas"},
        ];
        this.emid=this.classglobalvars.GetEmId();
        this.userId=this.classglobalvars.GetUsId();
        this.disBtnDescarga=true;
    }

    /* PROCEDURES */
        /* GETTERS */
            procGetAllBusBySuEmId(emid:number,suemid:number){
                let arrBusesBysuemid:any[]=[];
                this.busesService.getAllBusByEmEmSu(emid,suemid).subscribe(
                    data=>{arrBusesBysuemid=data; this.mgAllBusEmpBySuEmId(arrBusesBysuemid);},
                    error=>{console.log(error);}
                );
            }
            procGetAllsubempbyemid(emid:number){
                let arrSuEm:any[]=[];
                this.empsuemservice.getallsubempresasbyemid(emid).subscribe(
                    data=>{arrSuEm=data; this.mCboAllSubEmp(arrSuEm);},
                    error=>{console.log(error);}
                );
            }
            
        /* MANTENIMIENTO */
    
    /* FUNCIOENS ASOCIADA A COMBOS */
        funCboOptId(){ 
            /* Personas & Buses */
            if(this.optIdRep=="01"){
                this.disBtnDescarga=true;
            /* Telefonos & Buses */
            }else if(this.optIdRep=="02"){
                this.disBtnDescarga=true;
            /* Buses por SubEmpresas */
            }else if(this.optIdRep=="03"){
                this.disBtnDescarga=true;
                this.procGetAllsubempbyemid(this.emid);
                //this.procGetAllBusBySuEmId(this.emid,this.suemid);
            }
        }
    
        funCboSubEmp(){
            /*console.log(this.suemid);
            console.log(this.oBus);*/
            this.suemid=this.oBus.SuEmId;
            this.SuEmRSocial=this.oBus.SuEmRSocial;
            this.disBtnDescarga=false;
            this.procGetAllBusBySuEmId(this.emid,this.suemid);
        }
    /* MOSTRAR DATOS */
        mgAllBusEmpBySuEmId(arrBusesBysuemid=[]){
            let arrRows:any[]=[]; 
            /* CABECERA */
            this.arrTableCabBusEmp=["Marca","Placa","Capacidad","Descripcion"];

            /* TABLA */
            for(let i=0; i<arrBusesBysuemid.length; i++){
                arrRows[i]=[{
                            BuMarca:arrBusesBysuemid[i].BuMarca,
                            BuPlaca:arrBusesBysuemid[i].BuPlaca,
                            BuCapacidad:arrBusesBysuemid[i].BuCapacidad,
                            BuDescripcion:arrBusesBysuemid[i].BuDescripcion
                        }];
            }
            this.arrBusEmp=arrRows;
        }

        mCboAllSubEmp(allsuemp=[]){
            let OptCboList:any[]=[];
            for(let i=0; i<allsuemp.length; i++){ OptCboList[i]=[]; }
            for(let i=0; i<allsuemp.length; i++){OptCboList[i].SuEmId=allsuemp[i].SuEmId; OptCboList[i].SuEmRSocial=allsuemp[i].SuEmRSocial; }
            this.arrOptListado=OptCboList; /* PASANDO AL COMBO */
        }

    /* FUNCIONES */
        /* CASO ARRAY DE OBJETOS  */
        prepArrDescargarPDFArrObj(arr=[],optIdRep){
            let arrRsul=[];let cabeceraOpt2:any[]=[], cabeceraOpt3:any[]=[];
            
            if(optIdRep==1){

            }else if(optIdRep==2){

            }else if(optIdRep==3){
                /* PERSONAS EN TODO EL SISTEMA */
                cabeceraOpt3=["MARCA","PLACA","CAPACIDAD","DESCRIPCION"];
                this.cabReport=cabeceraOpt3;
            }
            this.arrReport=arr.slice(0);
        }

        /* INICIANDO DOCUMENTO Y POSTERIOR DESCARGA */
        iniciandoDocumento(arrDatos=[], cabecera=[], encabezado){
            var document=new jsPDF('p','pt','a4');
            document.autoTable(cabecera,arrDatos,{ 
                styles: {fontSize: 10,halign: 'left',cellPadding: 1,},   
                margin: {top: 55, right: 30, bottom: 30, left: 40},
                theme: 'grid',
                columnWidth: 'auto',
                valign: 'top', });
            //document.addPage();
            document.text(50, 40, encabezado);
            //document.addHTML(document.body,40,100,function() { document.save('reporte.pdf');});
            document.save('reporte.pdf');
        }

        descargarReporte(){
            let optIdRep=this.optIdRep; let encabezado:string;

            if(optIdRep=="01"){
                /*encabezado="Personas Agregadas por Sub Empresa";*/
                
            }else if(optIdRep=="02"){
                /*encabezado=this.SuEmRSocial;
                this.iniciandoDocumento(this.arrReport,this.cabReport,encabezado);*/
            }else if(optIdRep=="03"){
                encabezado=this.SuEmRSocial;
                console.log(this.arrReport);
                this.iniciandoDocumento(this.arrReport,this.cabReport,encabezado);
            }
        }
}   
