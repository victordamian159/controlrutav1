import {Component, OnInit} from '@angular/core';
import {GlobalVars} from 'app/variables';
import {hora,_hora,_cCeroFecha} from 'app/funciones';
import {PersService} from '../service/personal.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {EmpPerService} from '../service/empresapersonal.service';

@Component({
    selector: 'app-repPersona',
    templateUrl	: '../views/reportPersonas.component.html',
    styleUrls: ['../styles/reportPersonas.component.css']
})

export class reportPersonas implements OnInit{
    /* VARIABLES */
        /* NUMBER */
            private emid:number;
            private userId:number
            private suemid:number;
        /* STRING */
            private optIdRep:string;
            private mensaje:string;
    /* ARRAYS */
        private arrOptReports:any[]=[{id:"",nomb:""}];
        private arrTableCab:any[]=[];
        private arrTableCabEmpPer:any[]=[];
        private arrPersonal:any[]=[]; /* TODAS LAS PERSONAS EN EL SISTEMA */
        private arrEmpPer:any[]=[]; /* PERSONAS POR SUBEMPRESA */
        private arrOptListado:any[]=[];
    /* VAR DISPLAY */
    /* DISABLED AND HIDDEN BTNS */
    ngOnInit(){
        this.mensaje="Hola Mundo =D";
    }
    constructor(private empeservice:EmpPerService, private personaService : PersService, private empsuemservice : EmpSubEmpService, public classglobalvars:GlobalVars ){
        this.arrOptReports=[{id:"01", nomb:"Todas las SubEmpresas"},
                         {id:"02", nomb:"Por SubEmpresas"},
                         {id:"03", nomb:"En el Sistema"}];
        this.emid=this.classglobalvars.GetEmId();
        this.userId=this.classglobalvars.GetUsId();
        
    }
    /* PROCEDURES */
        /* GETTERS */
            procGetAllPersona(){
                let arrper:any[]=[];
                this.personaService.getallpersonal().subscribe(
                    data => {arrper=data; /*this.arrPersonal=arrper;*/ this.mgAllPersonas(arrper);},
                    error => {console.log(error); }
                );
            }
            procGetAllsubempbyemid(emid:number){
                let allsubemp:any[]=[];
                this.empsuemservice.getallsubempresasbyemid(emid).subscribe(
                    data => {allsubemp=data; this.mCboAllSubEmp(allsubemp);},
                    error=> {console.log(error);}
                );
            }
            procGetEmpPerByEmId(emid:number,suemid:number){
                let arrEmpPer:any[]=[];
                this.empeservice.getallempperbyemidsuemid(emid,suemid).subscribe(
                    data => {arrEmpPer=data; this.mgAllEmpPer(arrEmpPer);},
                    error=> {console.log(error);}
                );
            }
        /* MANTENIMIENTO */ 

    /* FUNCIONES ASOCIADA A COMBO */
        funCboOptId(){
            let optIdRep:string; optIdRep=this.optIdRep;
            this.arrOptListado=[];
            if(optIdRep=="01"){
                console.log("todas las personas por su subempresa");
            }else if(optIdRep=="02"){
                console.log("por todas las sub empresas");
                this.procGetAllsubempbyemid(this.emid);
            }else if(optIdRep=="03"){
                console.log("todas las personas sobre el sistema");
                this.procGetAllPersona();
            }
        }

        funCboSubEmp(){
            /*console.log(this.suemid);*/
            this.procGetEmpPerByEmId(this.emid,this.suemid);
        }
    
    /*MOSTRAR DATOS */
        mgAllPersonasPDFTable(arrOpt=[]){
            let arrColOptPer:any[]=[], arrNroOrden:any[]=[], arrNombres:any[]=[], 
                arrApellidos:any[]=[], arrDNI:any[]=[], arrDireccion:any[]=[];

            for(let objs of arrOpt){ arrNombres.push(objs.PeNombres);}
            for(let objs of arrOpt){arrApellidos.push(objs.PeApellidos); }
            for(let objs of arrOpt){arrDNI.push(objs.PeDNI);}
            for(let objs of arrOpt){ arrDireccion.push(objs.PeDireccion);}

            arrColOptPer[0]=arrNombres; arrColOptPer.push(arrApellidos); 
            arrColOptPer.push(arrDNI); arrColOptPer.push(arrDireccion);
   
            return arrColOptPer;
        }
        mgAllPersonas(arrOpt=[]){
            let arrRows:any[]=[];
            this.arrTableCab=["Nombres", "Apellidos", "DNI", "Direccion","Nro. Tel."];
            for(let i=0; i<arrOpt.length;i++){
                arrRows[i]=[arrOpt[i].PeNombres, arrOpt[i].PeApellidos, arrOpt[i].PeDNI, arrOpt[i].PeDireccion, arrOpt[i].PeCelular]
            }
            this.arrPersonal=arrRows;
        }
        mgAllEmpPer(arrEmpPer=[]){
            let arrRows:any[]=[];
            /* CABECERA */
            this.arrTableCabEmpPer=["Nombres","Apellidos","DNI","Fecha Ingreso", "Cargo"];
            /* TABLA */
            for(let i=0; i<arrEmpPer.length; i++){
                arrRows[i]=[arrEmpPer[i].PeNombres,arrEmpPer[i].PeApellidos,arrEmpPer[i].PeDNI,arrEmpPer[i].PeFechaIng,arrEmpPer[i].EmPeTipo];
            }
            this.arrEmpPer=arrRows;
        }
        mCboAllSubEmp(allsuemp=[]){
            let OptCboList:any[]=[];
            for(let i=0; i<allsuemp.length; i++){ OptCboList[i]=[]; }
            for(let i=0; i<allsuemp.length; i++){OptCboList[i].SuEmId=allsuemp[i].SuEmId; OptCboList[i].SuEmRSocial=allsuemp[i].SuEmRSocial; }
            this.arrOptListado=OptCboList; /* PASANDO AL COMBO */
        }
}
