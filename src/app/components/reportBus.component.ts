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
        /* NUMBER */
            private emid:number;
            private userId:number;
            private suemid:number;
        /* STRING */
            private optIdRep:string;
    /* ARRAYS */
        private arrOptReports:any[]=[];
        private arrOptListado:any[]=[];
        private arrTableCabBusEmp:any[]=[];
        private arrBusEmp:any[]=[];
        private arrBusEmpDescrip:any[]=[[]];
    /* VAR DISPLAY */
    /* DOSANÑED AND HIDDEN BTNS */
    ngOnInit(){}
    constructor(private busesService : BusService, public classglobalvars:GlobalVars, private empsuemservice : EmpSubEmpService){
        this.arrOptReports=[
            {id:"01", nomb:"Personas & Buses"},
            {id:"02", nomb:"Telefonos & Buses"},
            {id:"03", nomb:"Buses por SubEmpresas"},
        ];
        this.emid=this.classglobalvars.GetEmId();
        this.userId=this.classglobalvars.GetUsId();
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

            /* Telefonos & Buses */
            }else if(this.optIdRep=="02"){

            /* Buses por SubEmpresas */
            }else if(this.optIdRep=="03"){
                this.procGetAllsubempbyemid(this.emid);
                //this.procGetAllBusBySuEmId(this.emid,this.suemid);
            }
        }
    
        funCboSubEmp(){
            /*console.log(this.suemid);*/
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
}   
