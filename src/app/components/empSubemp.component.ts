import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {hora,_hora} from 'app/funciones';

@Component({
    selector:'app-empSubemp',
    templateUrl: '../views/empSubemp.component.html',
    styleUrls:['../styles/empSubemp.component.css'],
})

export class EmpSubEmpComponent implements OnInit{
    /* VARIABLES */
        /* OTRAS VARIABLES */
            private errorMessage:string='';
            private EmId:number;
            private userid:number;
            private confMensaje:string;
            private suemid:number;

        /* CABECERA */
            private mpresa:any;
            private empresas:any[]=[];
            private subempresa:any={
                        //EmId
                        SuEmActivo:"",
                        SuEmDireccion:"",
                        SuEmEmail:"",
                        //SuEmId
                        SuEmRSocial:"",
                        SuEmRuc:"",
                        SuEmTelefono:"",
                        SuEmTiempoVuelta:"",
                        SuEmUbigeo:""
                        //UsFechaReg
                        //UsId
                    }
            private _subempresa:any;
            private subempresas:any[]=[];
            private empresa:any={
                        EmConsorcio:"",
                        EmTipo:"",
                        EmId:null,
                        UsFechaReg:null,
                        UsId:null
                    }

        /* VAR DISPLAY MODAL */
            displayEditSubEmp:boolean;
            displayElimSubEmp:boolean;
            displayNuevaSubEmp:boolean;
            displayEditEmpresa:boolean;
            displayEditConfEmpresa:boolean;

    ngOnInit(){
        this.EmId=0;
        this.userid=1;
        //this.getempsubempbyempid(this.EmId);
        this.getempresas();
        /* INICIANDO VAR DISPLAY */
            this.displayEditSubEmp=false;
            this.displayElimSubEmp=false;
            this.displayNuevaSubEmp=false;
            this.displayEditEmpresa=false;
            this.displayEditConfEmpresa=false;

    }
    constructor(private empSubempservice : EmpSubEmpService){}

    /* PROCEDURE */
        /* OBTENER */
            getempresas(){
                let emp:any;
                this.empSubempservice.getallempresas().subscribe(
                    data =>{emp=data; this.mgempresa(emp);}
                );
            }

            getempsubempbyempid(emid:number){
                let emp:any;
                this.empSubempservice.getallempresabyemid(emid).subscribe(
                    data => { emp=data; this.mEmpresa(emp);},
                    err => {this.errorMessage=err},
                );
            }

            getsubempresasbyemid(emid:number){
                let subemps:any[]=[];
                this.empSubempservice.getallsubempresasbyemid(emid).subscribe(
                    data => { subemps=data; this.mgsubempresas(subemps);},
                    err => {this.errorMessage=err},
                );
            }
            getsuempbysuemid(suemid:number){
                let subem:any;
                this.empSubempservice.getsubempbysuemid(suemid).subscribe(
                    data =>{subem=data; this.msubemp(subem);}
                );
            }
        /* NUEVO */
            nuevoObSubemp(){
                this.suemid=0;
                this.empSubempservice.newSubempresa().subscribe(
                    data=>{this._subempresa=data;}
                );
            }

        /* GUARDAR */
            guardarSubEmp(suemp:Object){
                this.empSubempservice.saveSubEmpresa(suemp).subscribe(
                    realizar => {this.getsubempresasbyemid(this.EmId)},
                    err      => {this.errorMessage=err;}
                );
            }

        /* ELIMINAR */
            eliminarSubEmp(suemid:number){
                this.empSubempservice.deleteSubEmpresa(suemid).subscribe(
                    realizar =>{},
                    err => {console.log(err);}
                );
            }
    
    /* TABLAS + FORMULARIOS */
        /* CARGANDO PARA GRILLAS */
            mgempresa(empr:any[]){
                this.empresas=[];
                for(let emp of empr){
                    this.empresas.push({
                        Nro:1,
                        EmConsorcio:emp.EmConsorcio,
                        EmTipo:emp.EmTipo,
                        EmId:emp.EmId
                    });
                }
            }

            mgsubempresas(subemps=[]){
                this.subempresas=[];
                for(let subemp of subemps){
                    this.subempresas.push({
                        nro:0,
                        EmId:subemp.EmId,
                        SuEmId:subemp.SuEmId,
                        SuEmRSocial:subemp.SuEmRSocial,
                        SuEmRuc:subemp.SuEmRuc,
                        SuEmDireccion:subemp.SuEmDireccion,
                        SuEmUbigeo:subemp.SuEmUbigeo,
                        SuEmTelefono:subemp.SuEmTelefono,
                        SuEmEmail:subemp.SuEmEmail,
                        SuEmTiempoVuelta:_hora(subemp.SuEmTiempoVuelta)
                    });
                }

                for(let i=0; i<this.subempresas.length;i++){
                    this.subempresas[i].nro=i+1;
                }
            }

            msubemp(suem:any){
                this.subempresa={
                    EmId:suem.EmId,
                    SuEmId:suem.SuEmId,
                    SuEmRSocial:suem.SuEmRSocial,
                    SuEmRuc:suem.SuEmRuc,
                    SuEmDireccion:suem.SuEmDireccion,
                    SuEmUbigeo:suem.SuEmUbigeo,
                    SuEmTelefono:suem.SuEmTelefono,
                    SuEmEmail:suem.SuEmEmail,
                    SuEmTiempoVuelta:_hora(suem.SuEmTiempoVuelta)
                }
                this.displayNuevaSubEmp=true;
            }

            mEmpresa(emp:any){
                this.empresa={
                    EmConsorcio:emp.EmConsorcio,
                    EmId:emp.EmId,
                    EmTipo:emp.EmTipo,
                    UsFechaReg:emp.UsFechaReg,
                    UsId:emp.UsId
                }
                console.log(this.empresa);
                this.displayEditEmpresa=true;
            }

        /* SELECCIONAR FILA */
            onRowSelectEmpresa(event){
                this.EmId=event.data.EmId;
                this.getsubempresasbyemid(this.EmId);
            }

            onRowSelectSubEmp(event){
                console.log(event.data.SuEmId);
            }
        /* BOTONES DE FILAS */
            /* FUNCIONES ASOCIADAS A BTN DE FILAS */
                editarEmpresa(emid:number){
                    this.EmId=emid;
                    this.confMensaje="¿Esta seguro de editar el registro?";
                    this.displayEditConfEmpresa=true;
                }
                editarSubEmpresa(suemid :number){
                    this.suemid=suemid;
                    this.confMensaje="¿Esta seguro de editar el registro?";
                    this.displayEditSubEmp=true;
                }

                eliminarSubEmpresa(suemid :number){
                    this.suemid=suemid;
                    this.confMensaje="¿Esta seguro de eliminar el registro?";
                    this.displayElimSubEmp=true;
                }
            /* CONFIRMAR */
                acpEditEmpresa(){
                    this.displayEditConfEmpresa=false;
                    this.confMensaje="";
                    /* PROCEDURE */
                    this.getempsubempbyempid(this.EmId);/* BUSCANDO EMPRESA */
                }

                canEditEmpresa(){
                    this.displayEditEmpresa=false;
                }

                acpEditSubEmp(){
                    this.displayEditSubEmp=false;
                    this.confMensaje="";
                    /* PROCEDURE */
                    this.getsuempbysuemid(this.suemid);
                }

                cancEditSubEmp(){
                    this.suemid=null;
                    this.confMensaje="";
                    this.displayEditSubEmp=false;
                }

                acpElimSubEmp(){
                    this.displayElimSubEmp=false;
                    this.confMensaje="";
                    /* PROCEDURE */
                    console.log(this.suemid);
                    this.eliminarSubEmp(this.suemid);
                    
                }

                cancElimSubEmp(){
                    this.suemid=null;
                    this.confMensaje="";
                    this.displayElimSubEmp=false;
                }
    /* BTN NUEVA SUBEMP */
        /* ABRIR VENTANA */
        nuevaSubEmpresa(){
            this.displayNuevaSubEmp=true;
            this.nuevoObSubemp();
        }

        /* ACEPTAR Y GUARDAR */
        guardarSubEmpresa(){
            this.displayNuevaSubEmp=false
            this._subempresa={
                EmId:this.EmId,
                //SuEmActivo:this.subempresa.SuEmActivo,
                SuEmActivo:true,
                SuEmDireccion:this.subempresa.SuEmDireccion,
                SuEmEmail:this.subempresa.SuEmEmail,
                SuEmId:this.suemid,
                SuEmRSocial:this.subempresa.SuEmRSocial,
                SuEmRuc:this.subempresa.SuEmRuc,
                SuEmTelefono:this.subempresa.SuEmTelefono,
                SuEmTiempoVuelta:hora(this.subempresa.SuEmTiempoVuelta),
                SuEmUbigeo:this.subempresa.SuEmUbigeo,
                UsFechaReg:new Date(),
                UsId:this.userid
            }
            this.guardarSubEmp(this._subempresa);
        }

        /* CANCELAR Y BORRAR */
        cancelSubEmpresa(){
            this._subempresa="";
            this.displayNuevaSubEmp=false;
        }

    /* FUNCIONES */
        
}