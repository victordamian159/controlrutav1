import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {ConfiguraService} from '../service/configura.service';
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
            private CoNroMaxVueltas:number;
            private CoMembreReporte:string;
            private CoId:number;
            private CoSiId:number;
            private CoCountMovilTaCo:number;
            private CoCountMovilTaCoDe:number;
            private CoLogo:string;
            private CoPeriodo:number;
            private periodo:boolean;

        /* CABECERA */
            private mpresa:any;
            private empresas:any[]=[];
            private _empresa:any; /* VAR EN BTNNUEVO EMPRESA */
            private subempresa:any={ SuEmActivo:"", SuEmDireccion:"", SuEmEmail:"", SuEmRSocial:"",SuEmRuc:"",SuEmTelefono:"", SuEmTiempoVuelta:"", SuEmUbigeo:"" }
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
            private displayNuevaConfigXPeriodo:boolean;
            private displayElimConfig:boolean;
            private displayEditConfig:boolean;
            private displayEditarConfigXPeriodo:boolean;

        //arrays
            private arrConfig:any;
            private arrConfSistema=[];
    ngOnInit(){
        this.getempresas();
        this.procGetAllConfiguraByEmIdPeriodo(this.EmId, new Date().getFullYear().toString());
    }
    constructor(private empSubempservice : EmpSubEmpService,
                private configservice:ConfiguraService,
                public ClassGlobal:GlobalVars){
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
            this.displayNuevaConfigXPeriodo=false;
        this.arrTiposEmp=[{tipId:"00",nomTipo:"CONSORCIO"},{tipId:"01",nomTipo:"INDIVIDUAL"}]
        this.arrConfSistema=[{id:1,nomb:"Todas Sub-Empresas"},{id:2,nomb:"Por Sub-Empresas"}];
        this.selectRow=false; /*false: no se selecciono ninguna fila, true: si se selecciono una fila */
        this.arrConfig=[];
        this.periodo=false;
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
                    data => { 
                        subemps=data; 
                        console.log(subemps); 
                        this.mgsubempresas(subemps);
                    },
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
                    realizar => {
                        this.getsubempresasbyemid(this.EmId)
                    },
                    err      => {
                        this.errorMessage=err;
                        console.log(this.errorMessage);
                    }
                );
            }

        /* ELIMINAR */
            eliminarSubEmp(suemid:number){
                this.empSubempservice.deleteSubEmpresa(suemid).subscribe(
                    realizar =>{this.getsubempresasbyemid(this.EmId)},
                    err => {console.log(err);}
                );
            }

    // procedimientos tabla configura
            procGetAllConfiguraByEmIdPeriodo(EmId:number,Anio:string){
                this.configservice.getAllConfiguraByEmPeriodo(EmId, Anio).subscribe(
                    data=>{
                        console.log(data);
                        if(data.length!=0){
                            this.mgConfiguraByAnio(data);
                            this.periodo=true;
                        }else if(data.length==0){
                            this.periodo=false;
                        }
                        
                    },
                    error=>{
                        alert('Error, no hay configuraciones en el presente año');
                    },
                    ()=>{

                    }
                );
            }
            //guardar configuracion para el periodo(año)
            procSaveConfiguracion(objConfigura:any){
                this.configservice.saveConfigura(objConfigura).subscribe(
                    data=>{
                        //console.log(data);
                        if(data.CoId!=0&&data.CoId>0){
                            alert('Se guardo correctamente');
                            this.displayNuevaConfigXPeriodo=false;
                            this.displayEditarConfigXPeriodo=false;
                            this.procGetAllConfiguraByEmIdPeriodo(this.EmId, new Date().getFullYear().toString());
                        }else{
                            alert('Hubo un problema en el servidor, vuelva a intentarlo');
                        }
                    },  
                    error=>{
                        alert('Error en el servidor, vuelva a intentarlo');
                    },
                    ()=>{}
                );
            }
    /* TABLAS + FORMULARIOS */
        /* CARGANDO PARA GRILLAS */
            //mostrar configuracion 
                //configuracion por año
                mgConfiguraByAnio(arrConfigs=[]){
                    console.log(arrConfigs);
                    let _arrConfigs:any[]=[];
                    for(let config of arrConfigs){
                        _arrConfigs.push({         
                            Nro:0,             
                            CoCountMovilTaCo:config.CoCountMovilTaCo,
                            CoCountMovilTaCoDe:config.CoCountMovilTaCoDe,
                            CoId:config.CoId,
                            CoLogo:config.CoLogo,
                            CoMembreReporte:config.CoMembreReporte,
                            CoNroMaxVueltas:config.CoNroMaxVueltas,
                            CoPeriodo:config.CoPeriodo,
                            EmId:config.EmId,
                            UsFechaReg:config.UsFechaReg,
                            UsId:config.UsId,
                            CoSiId:config.CoSiId,
                            nomCoSiId:''
                        });
                    }
                    for(let i=0; i<_arrConfigs.length; i++){
                        _arrConfigs[i].Nro=i+1;
                        if(_arrConfigs[i].CoSiId==1){
                            _arrConfigs[i].nomCoSiId='Todas Sub-Empresas';
                        }else if(_arrConfigs[i].CoSiId==2){
                            _arrConfigs[i].nomCoSiId='Por Sub-Empresas';
                        }
                    }
                    console.log(_arrConfigs);
                    this.arrConfig=_arrConfigs;
                }

            // MOSTRAR TODAS LAS EMPRESAS
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
            onRowSelectConfig(event){
                console.log(event.data);
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
                    editarConfig(CoId:number){
                        this.CoId=CoId;
                        this.confMensaje="¿Esta seguro de editar el registro?";
                        this.displayEditConfig=true;
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
                    eliminarConfig(CoId:number){
                        this.CoId=CoId;
                        this.confMensaje="¿Esta seguro de eliminar el registro?";
                        this.displayElimConfig=true;
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
                //configura 
                    //confirmar editar
                        acpEditConfig(){
                            this.displayEditConfig=false;
                            this.confMensaje="";
        
                            this.configservice.getConfiguraById(this.CoId).subscribe(
                                data=>{
                                    this.displayEditarConfigXPeriodo=true;
                                    this.CoCountMovilTaCo=data.CoCountMovilTaCo;
                                    this.CoCountMovilTaCoDe=data.CoCountMovilTaCoDe;
                                    this.CoId=data.CoId;
                                    this.CoLogo=data.CoLogo;
                                    this.CoMembreReporte=data.CoMembreReporte;
                                    this.CoNroMaxVueltas=data.CoNroMaxVueltas;
                                    this.CoPeriodo=data.CoPeriodo;
                                    this._EmId=data.EmId;
                                    this.CoSiId=data.CoSiId;
                                    //UsFechaReg
                                    //UsId
                                },
                                error=>{
                                    alert('Error, no se pudo encontrar');
                                },
                                ()=>{}
                            );
                        }

                        cancEditConfig(){
                            this.CoId=null;
                            this.confMensaje="";
                            this.displayEditConfig=false;
                        }

                    // confirmar eliminar
                        acpElimConfig(){
                            this.displayElimConfig=false;
                            this.confMensaje="";
                            /* PROCEDURE */
                            console.log(this.CoId);
                            this.configservice.deleteConfigura(this.CoId).subscribe(
                                data=>{
                                    console.log(data);
                                },
                                error=>{
                                    'Error, no se puede eliminar la configuracion'
                                },
                                ()=>{}
                            );
                            
                        }

                        cancElimConfig(){
                            this.CoId=null;
                            this.confMensaje="";
                            this.displayElimConfig=false;
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
            //btn nuevo configuracion por periodo
            guardarConfigPeriodo(){
                let objConfigura:any;
                if(this.CoId==0){
                    objConfigura={
                        EmId: this.EmId,
                        UsFechaReg: new Date(),
                        CoId: this.CoId,
                        CoCountMovilTaCo: 0,
                        CoCountMovilTaCoDe: 0,
                        UsId: this.userid,
                        CoPeriodo: new Date().getFullYear(),
                        CoNroMaxVueltas: this.CoNroMaxVueltas,
                        CoLogo: '',
                        CoMembreReporte: this.CoMembreReporte,
                        CoSiId: this.CoSiId,
                    }
                }else if(this.CoId!=0){
                    objConfigura={
                        EmId: this._EmId,
                        UsFechaReg: new Date(),
                        CoId: this.CoId,
                        CoCountMovilTaCo:this.CoCountMovilTaCo,
                        CoCountMovilTaCoDe:this.CoCountMovilTaCoDe,
                        UsId: this.userid,
                        CoPeriodo: this.CoPeriodo,
                        CoNroMaxVueltas:this.CoNroMaxVueltas,
                        CoLogo:this.CoLogo,
                        CoMembreReporte: this.CoMembreReporte,
                        CoSiId: this.CoSiId,
                    }
                }
                
                console.log(objConfigura);
                this.procSaveConfiguracion(objConfigura);
            }
            
            cancelConfigPeriodo(){
                this.displayNuevaConfigXPeriodo=false;
            }
            cancelConfigPeriodoEditar(){
                this.displayEditarConfigXPeriodo=false;
            }
    // FUNCIONES  btn nueva configuracion por periodo
    nuevaConfiguracionPeriodo(){
        this.displayNuevaConfigXPeriodo=true;
        this.configservice.newConfigura().subscribe(
            data=>{
                this.CoNroMaxVueltas=data.CoNroMaxVueltas;
                this.CoMembreReporte=data.CoMembreReporte;
                this.CoId=data.CoId;
            },
            error=>{
                alert('Error al crear la nueva configuracion');
            },
            ()=>{

            }
        );
    }

    fcboConfSistema(){
        //console.log(this.CoSiId);
    }
}