import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {hora,_hora} from 'app/funciones';
import {GlobalVars} from 'app/variables'

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
            private EmTipo:number;
            private _EmId:number; /* USADO EN OBJ PARA ENVIAR A LA BD */
            private selectRow:boolean; /* USADO PARA SABER SI SE SELECCIONO UNA FILA O NO DE LA TABLA EMPRESA(NO SUBEMPRESA) */

        /* CABECERA */
            private mpresa:any;
            private empresas:any[]=[];
            private _empresa:any; /* VAR EN BTNNUEVO EMPRESA */
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
            private empresa:any={ EmConsorcio:"", EmId:null}
            private arrTiposEmp:any={tipId:null,nomTipo:""};

        /* VAR DISPLAY MODAL */
            private displayEditSubEmp:boolean;
            private displayElimSubEmp:boolean;
            private displayNuevaSubEmp:boolean;
            private displayEditEmpresa:boolean;
            private displayEditConfEmpresa:boolean;
            private displayRegEmpresa:boolean;
            private displayElimEmp:boolean;

    ngOnInit(){
        /*this.EmId=0;
        this.userid=1;*/
        this.getempresas();
        
    }
    constructor(private empSubempservice : EmpSubEmpService,public ClassGlobal:GlobalVars){
        this.EmId=this.ClassGlobal.GetEmId();
        this.userid=this.ClassGlobal.GetUsId();
        /* INICIANDO VAR DISPLAY */
            this.displayEditSubEmp=false;
            this.displayElimSubEmp=false;
            this.displayNuevaSubEmp=false;
            this.displayEditEmpresa=false;
            this.displayEditConfEmpresa=false;
            this.displayRegEmpresa=false;
            this.displayElimEmp=false;
        this.arrTiposEmp=[{tipId:0,nomTipo:"CONSORCIO"},{tipId:1,nomTipo:"INDIVIDUAL"}]
        this.selectRow=false; /*false: no se selecciono ninguna fila, true: si se selecciono una fila */
    }

    /* PROCEDURE */
        /* OBTENER TODAS LAS EMPRESAS */
            getempresas(){
                let emp:any;
                this.empSubempservice.getallempresas().subscribe(
                    data =>{emp=data; this.mgempresa(emp);}
                );
            }

        /* GET ALL SUBEMPRESAS POR EMID */
            getsubempresasbyemid(emid:number){
                let subemps:any[]=[];
                this.empSubempservice.getallsubempresasbyemid(emid).subscribe(
                    data => { subemps=data; this.mgsubempresas(subemps);},
                    err => {this.errorMessage=err},
                );
            }

    /* PROCEDURE TABLA EMPRESAS */
        /* BUSCAR EMPRESA POR SU ID */
            getempbyempid(emid:number){
                let emp:any;
                this.empSubempservice.getallempresabyemid(emid).subscribe(
                    data => { emp=data; this.mEmpresa(emp);},
                    err => {this.errorMessage=err},
                );
            }
        /* NUEVA EMPRESA */
            nuevoObjEmp(){
                this._EmId=0;
                this.EmTipo=null;
                this.empresa={};
                this.empSubempservice.newEmpresa().subscribe(
                    data=>{this._empresa=data;}
                );
            }
        /* GUARDAR EMPRESA */
            guardarEmp(emp:Object){
                this.empSubempservice.saveEmpresa(emp).subscribe(
                    realizar => {this.getempresas();},
                    err      => {this.errorMessage=err;}
                );
            }
        /* ELIMINAR EMPRESA */
            eliminarEmp(emid:number){
                this.empSubempservice.deleteEmpresa(emid).subscribe(
                    realizar =>{this.getempresas();},
                    err => {console.log(err);}
                );
            }
        
    /* PROCEDURE TABLA SUBEMPRESAS */
        /* BUSCAR SUBEMPRESA POR SU ID */
            getsuempbysuemid(suemid:number){
                let subem:any;
                this.empSubempservice.getsubempbysuemid(suemid).subscribe(
                    data =>{subem=data; console.log(subem); this.msubemp(subem);}
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
                    realizar =>{this.getsubempresasbyemid(this.EmId)},
                    err => {console.log(err);}
                );
            }
    
    /* TABLAS + FORMULARIOS */
        /* CARGANDO PARA GRILLAS */
            /* MOSTRAR TODAS LAS EMPRESAS */
                mgempresa(empr:any[]){
                    this.empresas=[];
                    for(let emp of empr){
                        this.empresas.push({
                            Nro:1,
                            EmConsorcio:emp.EmConsorcio,
                            EmTipo:emp.EmTipo,
                            Tipo:"",
                            EmId:emp.EmId
                        });
                    }

                    /* TIPO DE EMPRESA    1 -  true:INDIVIDUAL / 0 - false:CONSORCIO */
                    let i=0;
                    while(i<empr.length){
                        if(empr[i].EmTipo==true){
                            this.empresas[i].EmTipo=1;
                            this.empresas[i].Tipo="INDIVIDUAL";
                        }
                        else if(empr[i].EmTipo==false){
                            this.empresas[i].EmTipo=0;
                            this.empresas[i].Tipo="CONSORCIO";
                        }
                        i++;
                    }

                    /* ENUMERANDO ROWS */
                    for(let i=0;i<this.empresas.length;i++){
                        this.empresas[i].Nro=i+1;
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
                    console.log(this.subempresa);
                }

                mEmpresa(emp:any){
                    this.empresa={
                        EmConsorcio:emp.EmConsorcio,
                        //EmId:emp.EmId,
                        EmTipo:emp.EmTipo,
                        //UsFechaReg:emp.UsFechaReg,
                        //UsId:emp.UsId
                    }
                    console.log(this.empresa);
                    this.displayRegEmpresa=true;
                }

        /* SELECCIONAR FILA */
            onRowSelectEmpresa(event){
                this.EmId=event.data.EmId;
                this.selectRow=true;
                this.getsubempresasbyemid(this.EmId);
            }

            onRowSelectSubEmp(event){
                console.log(event.data.SuEmId);
            }
        /* BOTONES DE FILAS */
            /* FUNCIONES ASOCIADAS A BTN DE FILAS */                             
                /* EDITAR */
                    editarEmpresa(emid:number, emtipo:number){
                        this.EmId=emid;
                        this._EmId=emid;
                        this.EmTipo=emtipo;  /* ALTERNATIVA EN EL COMBO TIPO EMPRESA */
                        this.confMensaje="¿Esta seguro de editar el registro?";
                        this.displayEditConfEmpresa=true;   
                    }
                    editarSubEmpresa(suemid :number){
                        this.suemid=suemid;
                        this.confMensaje="¿Esta seguro de editar el registro?";
                        this.displayEditSubEmp=true;
                    }

                /* ELIMINAR */
                    eliminarEmpresa(emid:number){
                        this.EmId=emid;
                        this.confMensaje="¿Esta seguro de eliminar el registro?";
                        this.displayElimEmp=true;
                    }
                    eliminarSubEmpresa(suemid :number){
                        this.suemid=suemid;
                        this.confMensaje="¿Esta seguro de eliminar el registro?";
                        this.displayElimSubEmp=true;
                    }
            /* CONFIRMAR */
                /* EMPRESA */
                    /* CONFIRMAR EDITAR */
                        acpEditEmpresa(){
                            this.displayEditConfEmpresa=false;
                            this.displayRegEmpresa=true;
                            this.confMensaje="";
                            /* PROCEDURE */
                            this.getempbyempid(this.EmId);/* BUSCANDO EMPRESA */
                        }

                        canEditEmpresa(){
                            this.confMensaje="";
                            this.displayEditConfEmpresa=false;
                        }

                    /* CONFIRMAR ELIMINAR */
                        aceptarEliminarEmp(){
                            this.displayElimEmp=false;
                            this.confMensaje="";
                            /* PROCEDURE */
                            this.eliminarEmp(this.EmId);
                        }

                        cancelEliminarEmp(){
                            this.EmId=null;
                            this.confMensaje="";
                            this.displayElimEmp=false;
                        }

                /* SUBEMPRESA */
                    /* CONFIRMAR EDITAR */
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

                    /* CONFIRMAR ELIMINAR */
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
    /* BTN NUEVA EMPRESA SUBEMPRESAS */
        /* EMPRESA */
            /* BTN NUEVA EMPRESA - ABRIR VENTANA */
                nuevaEmpresa(){
                    this.displayRegEmpresa=true;
                    this.nuevoObjEmp();
                }

            /* ACEPTAR Y GUARDAR - NUEVA EMPRESA */
                guardarEmpresa(){
                    //this.EmTipo=1;
                    this.displayRegEmpresa=false
                    this._empresa={
                        EmId:this._EmId,
                        EmConsorcio:this.empresa.EmConsorcio,
                        EmTipo:Number(this.EmTipo),
                        UsFechaReg:new Date(),
                        UsId:this.userid
                    }
                    console.log(this._empresa);
                    this.guardarEmp(this._empresa);
                }

            /* CANCELAR Y BORRAR - NUEVA EMPRESA */
                cancelEmpresa(){
                    this._subempresa="";
                    this.displayRegEmpresa=false;
                }
        /* SUBEMPRESA */
            /* BTN NUEVA SUBEMPRESA - ABRIR VENTANA */
                nuevaSubEmpresa(){
                    this.displayNuevaSubEmp=true;
                    this.nuevoObSubemp();
                }

            /* ACEPTAR Y GUARDAR - NUEVA SUBEMPRESA */
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

            /* CANCELAR Y BORRAR - NUEVA SUBEMPRESA */
                cancelSubEmpresa(){
                    this._subempresa="";
                    this.displayNuevaSubEmp=false;
                }

    /* FUNCIONES */
        
}