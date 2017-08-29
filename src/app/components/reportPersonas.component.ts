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
        private arrAllEmpPerBySuEmId:any[]=[];
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
        this.arrAllEmpPerBySuEmId[0]=[];
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
                    data => {allsubemp=data; 
                                if(this.optIdRep=='01'){
                                    this.consultaTodasSubEmp(allsubemp);
                                    //this.mgAllEmpPerBySuEmId();
                                }else if(this.optIdRep=='02'){
                                    this.mCboAllSubEmp(allsubemp);
                                }
                            },
                    error=> {console.log(error);}
                );
            }
            procGetEmpPerByEmId(emid:number,suemid:number){
                let arrEmpPer:any[]=[];
                let arrAllEmpPerBySuEmId:any[]=[[]];
                this.empeservice.getallempperbyemidsuemid(emid,suemid).subscribe(
                    data => {   arrEmpPer=data; 
                                if(this.optIdRep=='01'){
                                    this.arrAllEmpPerBySuEmId.push(arrEmpPer);
                                }else if(this.optIdRep=='02'){
                                    this.mgAllEmpPerBySuEmId(arrEmpPer); /* CARGANDO EL TABLE */
                                }
                            },
                    error=> {console.log(error);}
                );
            }
            procGetAllEmpPerBySuEmId(){
                let arrAllEmpPer:any[]=[];
                this.empeservice.getEmpPerById
            }
        /* MANTENIMIENTO */ 

    /* FUNCIONES ASOCIADA A COMBO */
        funCboOptId(){
            let optIdRep:string; optIdRep=this.optIdRep;
            this.arrOptListado=[];
            if(optIdRep=="01"){
                console.log("todas las personas por su subempresa");
                this.procGetAllsubempbyemid(this.emid);
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
    
    /* MOSTRAR DATOS */
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
        mgAllEmpPerBySuEmId(arrEmpPerBySuEmId=[]){
            let arrRows:any[]=[];
            /* CABECERA */
            this.arrTableCabEmpPer=["Nombres","Apellidos","DNI","Fecha Ingreso", "Cargo"];
            /* TABLA */
            for(let i=0; i<arrEmpPerBySuEmId.length; i++){
                arrRows[i]=[arrEmpPerBySuEmId[i].PeNombres,
                            arrEmpPerBySuEmId[i].PeApellidos,
                            arrEmpPerBySuEmId[i].PeDNI,
                            arrEmpPerBySuEmId[i].PeFechaIng,
                            arrEmpPerBySuEmId[i].EmPeTipo];
            }
            this.arrEmpPer=arrRows;
        }
        mCboAllSubEmp(allsuemp=[]){
            let OptCboList:any[]=[];
            for(let i=0; i<allsuemp.length; i++){ OptCboList[i]=[]; }
            for(let i=0; i<allsuemp.length; i++){OptCboList[i].SuEmId=allsuemp[i].SuEmId; OptCboList[i].SuEmRSocial=allsuemp[i].SuEmRSocial; }
            this.arrOptListado=OptCboList; /* PASANDO AL COMBO */
        }
        mgAllEmpPer(allEmpPer=[]){
            let arrcampos=["Nombres","Apellidos","DNI","Fecha Ingreso","Cargo"];
            console.log(allEmpPer);/* EN LAS FILAS INDICADAS PONER EL NOMBRE DE LA SUBEMPRESA, Y EN LAS DEMAS PONER EL OBJETO
                                        QUE SERA LA FILA QUE CONTIENE LOS CAMPOS A MOSTRAR */

            /* JUNTANDO TODO EN UN ARRAY */
            
        }   
    /* FUNCIONES */
        consultaTodasSubEmp(allsubemp=[]){
            for(let i=0; i<allsubemp.length;i++){
                this.procGetEmpPerByEmId(this.emid,allsubemp[i].SuEmId);
            }
            this.arrAllEmpPerBySuEmId.shift();
            this.mgAllEmpPer(this.arrAllEmpPerBySuEmId);
            
        }
}
