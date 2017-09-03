import {Component, OnInit} from '@angular/core';
import {GlobalVars} from 'app/variables';
import {hora,_hora,_cCeroFecha,_fecha2,cargoEmpPer} from 'app/funciones';
import {PersService} from '../service/personal.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {EmpPerService} from '../service/empresapersonal.service';

declare var jsPDF: any; //PARA PASAR HTML A PDF 

@Component({
    selector: 'app-repPersona',
    templateUrl	: '../views/reportPersonas.component.html',
    styleUrls: ['../styles/reportPersonas.component.css']
})

export class reportPersonas implements OnInit{
    /* VARIABLES */
        /* OBJ */
            private subemp:{SuEmId:null,SuEmRSocial:""}
        /* NUMBER */
            private emid:number;
            private userId:number
            private suemid:number;
        /* STRING */
            private optIdRep:string;
            private mensaje:string;
            private SuEmRSocial:string;
            
    /* ARRAYS */
        private arrReport:any[]=[];
        private cabReport:any[]=[];
        private arrOptReports:any[]=[{id:"",nomb:""}];
        private arrTableCab:any[]=[];
        private arrTableCabEmpPer:any[]=[];
        private arrPersonal:any[]=[]; /* TODAS LAS PERSONAS EN EL SISTEMA */
        private arrEmpPer:any[]=[]; /* PERSONAS POR SUBEMPRESA */
        private arrOptListado:any[]=[];
        private arrAllEmpPerBySuEmId:any[]=[];
    /* VAR DISPLAY */
    /* DISABLED AND HIDDEN BTNS */
        disBtnDescargar:boolean;
    ngOnInit(){
        this.mensaje="Hola Mundo =D";
    }
    constructor(private empeservice:EmpPerService, private personaService : PersService, 
                private empsuemservice : EmpSubEmpService, public classglobalvars:GlobalVars ){
        this.arrOptReports=[{id:"01", nomb:"Todas las SubEmpresas"},
                            {id:"02", nomb:"Por SubEmpresas"},
                            {id:"03", nomb:"En el Sistema"}];
        this.emid=this.classglobalvars.GetEmId();
        this.userId=this.classglobalvars.GetUsId();
        this.arrAllEmpPerBySuEmId[0]=[];
        this.disBtnDescargar=true;
    }
    /* PROCEDURES */
        /* GETTERS */
            procGetAllPersona(optIdRep){
                let arrper:any[]=[];
                this.personaService.getallpersonal().subscribe(
                    data => {arrper=data; /*this.arrPersonal=arrper;*/ this.mgAllPersonas(arrper,optIdRep);},
                    error => {console.log(error); }
                );
            }

            /* CAPTURANDO LAS SUEMPRESAS PARA LLENAR EL COMBO SUBEMPRESAS */
            procGetAllsubempbyemid(emid:number){
                let allsubemp:any[]=[];
                this.empsuemservice.getallsubempresasbyemid(emid).subscribe(
                    data => {allsubemp=data; 
                                if(this.optIdRep=='01'){
                                    this.consultaTodasSubEmp(allsubemp);
                                   
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
                                /* TODAS LAS PERSONAS SEPARADAS POR SU SUBEMPRESA */
                                if(this.optIdRep=='01'){    
                                    this.arrAllEmpPerBySuEmId.push(arrEmpPer);/* CARGANDO ARRAY DE ARRAYS(MATRIZ) */
                                    
                                /* SOLO PERSONAS POR SUBEMPRESA DETERMINADA */
                                }else if(this.optIdRep=='02'){
                                    this.mgAllEmpPerBySuEmId(arrEmpPer,this.optIdRep); /* CARGANDO EL TABLE */
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
                this.disBtnDescargar=true;
            }else if(optIdRep=="02"){
                console.log("por todas las sub empresas");
                this.procGetAllsubempbyemid(this.emid);
                this.disBtnDescargar=true;
                this.suemid=null;
            }else if(optIdRep=="03"){
                console.log("todas las personas sobre el sistema");
                this.procGetAllPersona(optIdRep);
                this.disBtnDescargar=false;
            }
        }

        funCboSubEmp(){
            /*console.log(this.suemid);
            console.log(this.subemp);*/
            this.suemid=this.subemp.SuEmId;
            this.SuEmRSocial=this.subemp.SuEmRSocial;
            this.procGetEmpPerByEmId(this.emid,this.suemid);
            this.disBtnDescargar=false;
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
        
        /* TODAS LAS PERSONAS EN EL SISTEMA */
        mgAllPersonas(arrOpt=[],optIdRep){
            let arrRows:any[]=[];
            this.arrTableCab=["NOMBRES","APELLIDOS","DNI","DIRECCION","TELEFONO"];
            for(let i=0; i<arrOpt.length;i++){
                arrRows[i]=[arrOpt[i].PeNombres, 
                            arrOpt[i].PeApellidos, 
                            arrOpt[i].PeDNI, 
                            arrOpt[i].PeDireccion, 
                            arrOpt[i].PeCelular]
            }
            this.arrPersonal=arrRows;
            console.log(arrRows);
            this.prepArrDescargarPDFArrObj(this.arrPersonal,optIdRep);
        }

        /* LAS PERSONAS POR SU SUBEMPRESA CORRESPONDIENTE */
        mgAllEmpPerBySuEmId(arrEmpPerBySuEmId=[],optIdRep){
            let arrRows:any[]=[];
            this.arrTableCabEmpPer=["NOMBRES","APELLIDOS","DNI","FECHA INGRESO","CARGO"];
            /* TABLA */
            for(let i=0; i<arrEmpPerBySuEmId.length; i++){
                arrRows[i]=[
                            arrEmpPerBySuEmId[i].PeNombres,
                            arrEmpPerBySuEmId[i].PeApellidos,
                            arrEmpPerBySuEmId[i].PeDNI,
                            _fecha2(arrEmpPerBySuEmId[i].PeFechaIng),
                          
                            cargoEmpPer(arrEmpPerBySuEmId[i].EmPeTipo)
                        ];
            }
            //this.mgAllEmpPerBySuEmId(arrEmpPer);
            this.arrEmpPer=arrRows;
            /* CORREGIR DATOS ANTES DE MANDARLOS A PREPARADAS, FALTA HACER ESO */
            this.prepArrDescargarPDFArrObj(this.arrEmpPer,optIdRep);
        }

        mCboAllSubEmp(allsuemp=[]){
            let OptCboList:any[]=[];
            for(let i=0; i<allsuemp.length; i++){ OptCboList[i]=[]; }
            for(let i=0; i<allsuemp.length; i++){OptCboList[i].SuEmId=allsuemp[i].SuEmId; 
                                                 OptCboList[i].SuEmRSocial=allsuemp[i].SuEmRSocial; }
            this.arrOptListado=OptCboList; /* PASANDO AL COMBO */
        }

        mgAllEmpPer(allEmpPer=[]){
            let arrcampos=["Nombres","Apellidos","DNI","Fecha Ingreso","Cargo"];
            console.log(allEmpPer);/* EN LAS FILAS INDICADAS PONER EL NOMBRE DE LA SUBEMPRESA, Y EN LAS DEMAS PONER EL OBJETO
                                        QUE SERA LA FILA QUE CONTIENE LOS CAMPOS A MOSTRAR */

            /* JUNTANDO TODO EN UN ARRAY */

        }   
    /* FUNCIONES */
        /* TODAS LAS PERSONAS CON SU SUBEMP EN UN SOLO REPORTE */
        consultaTodasSubEmp(allsubemp=[]){
            for(let i=0; i<allsubemp.length;i++){
                this.procGetEmpPerByEmId(this.emid,allsubemp[i].SuEmId);
            }
            this.arrAllEmpPerBySuEmId.shift();
            this.mgAllEmpPer(this.arrAllEmpPerBySuEmId);
        }

        /* CASO ARRAY DE OBJETOS  */
        prepArrDescargarPDFArrObj(arr=[],optIdRep){
            let arrRsul=[];let cabeceraOpt2:any[]=[], cabeceraOpt3:any[]=[];
            
            /*UN ARRAY PARA CADA CAMPO */
            if(optIdRep==2){
                /* PERSONAS POR SU SUBEMPRESA */
                cabeceraOpt2=["NOMBRES","APELLIDOS","DNI","FECHA INGR.","CARGO"]; 
                this.cabReport=cabeceraOpt2;
            }else if(optIdRep==3){
                /* PERSONAS EN TODO EL SISTEMA */
                cabeceraOpt3=["NOMBRES","APELLIDOS","DNI","DIRECCION","NRO.TEL."];
                this.cabReport=cabeceraOpt3;
            }
            this.arrReport=arr.slice(0);
        }
        
        /* CASO VARIOS ARRAYS EN UN ARRAY */
        prepArrDescargaPDFMatriz(arr=[]){
            console.log(arr);
            let buc1:number, buc2:number;
            buc1=0; buc2=0;

            while(buc1<arr.length && buc1<200){
                while(buc2<arr[buc1].length && buc2<200){
                    console.log(arr[buc1][buc2]);
                    buc2++;
                }
                buc2=0;
                buc1++;
            }
        }

        /* INICIANDO LAS HOJAS DEL DOCUMENTO */
        iniciandoDocumento(arrDatos=[], cabecera=[],encabezado){
            var document=new jsPDF('p','pt','a4');
            console.log(arrDatos);

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
                encabezado="Personas Agregadas por Sub Empresa";
                
            }else if(optIdRep=="02"){
                encabezado=this.SuEmRSocial;
                this.iniciandoDocumento(this.arrReport,this.cabReport,encabezado);
            }else if(optIdRep=="03"){
                encabezado="Todas las Personas sobre el Sistema";
                this.iniciandoDocumento(this.arrReport,this.cabReport,encabezado);
            }

            

        }
}
