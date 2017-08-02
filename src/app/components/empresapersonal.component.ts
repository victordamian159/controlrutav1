import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {EmpPerService} from '../service/empresapersonal.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {hora,_hora} from 'app/funciones';
import {PersService} from '../service/personal.service';

@Component({
    selector: 'app-empresapersonal',
    templateUrl	: '../views/empresapersonal.component.html',
    styleUrls: ['../styles/empresapersonal.component.css']
})

export class EmpPerComponent implements OnInit{


    /* DISPLAY MODAL*/
        displayNuevaEmp : boolean = false;
        displayNuevaSubEmp : boolean = false;
        displayEditarEmp : boolean = false;
        displayEditarSubEmp : boolean = false;
        displayConfDelEmp : boolean = false;
        displayConfDelSubEmp : boolean = false;
        displayNuevaEmpPersona:boolean=false; /* FORMULARIO AGREGAR PERSONA A UNA SUBEMPRESA */
        displayAgregaPersona:boolean=false;
    
    /* ARRAYS */
        private _arrsuEmp:any[]=[]; //ARRAY COMBO SUBEMPRESAS
        private arrTipoEmpPer:any[]=[]; // ARRAY TIPOS DE PERSONA EN LA EMPRESA
        /*private arrTEmpPer:any[]=[]; // ARRAY TIPOS DE PERSONA(TABLA PADRE)*/
        private personalArr=[]; /* ARRAY DE TODAS LAS PERSONAS AGREGADAS AL SISTEMA */
        private arrEmpPer:any[]=[]; /* ARRAY PERSONAS POR SUBEMPRESAS(DATATABLE PRINCIPAL) */
   
    /* VARIABLES*/
        private mensaje:string;
        private empPer:any; /* PROCEDURE NUEVO OBJ*/
        private EmPeId:number;
        private _suemid:number; /* VARIABLE ASOCIADA A COMBO SUBEMPS (MODAL AGREGAR NUEVA PERSONA)*/
        private suemid:number; /* VARIABLE ASOCIADA A COMBO SUBEMPS (FORM PRINCIPAL)*/
        private emid:number;
        private idTiEmpPer:string;
        private idTiPer:string;
        private PeId:number;    /* ID PERSONA SELECT (DATATABLE ASIGNAR NUEVA PERSONA) */
        private userid:number; /* ID DEL USUARIO(DEVUELTO DEL LOGIN) */

    /* OTRAS VARIABLES*/
        private errorMessage:string='';


    ngOnInit(){
        this.emid=1;
        this.userid=1;
        //this.getallempPerByEmIdSuEmId(1,1);
        this.getallsuembyemid(this.emid);
        this.arrTipoEmpPer=[{id:'01',perTEmpPer:'GERENTE'},{id:'02',perTEmpPer:'ADMINISTRADOR'},
                            {id:'03',perTEmpPer:'COBRADOR'},{id:'04',perTEmpPer:'ASOCIADOS'},
                            {id:'05',perTEmpPer:'CHOFER'},{id:'06',perTEmpPer:'CONTROLADOR'}];
        this.getAllPersonas();  /*TODAS LAS PERSONAS AGREGADAS AL SISTEMA(EMPRESA) */                    
        
        
    }

    /* CONSTRUCTOR */
    constructor(private empPerservice : EmpPerService, 
                private empSubempservice : EmpSubEmpService, 
                private persService : PersService){}


    /* PROCEDURES */
        /* PROCEDIMIENTO ALMACENADOS TABLA PERSONA */
            /* CONSULTA TODAS LAS PERSONAS AGREGADAS AL SISTEMA */
            getAllPersonas(){
                let arrper:any[]=[];
                this.persService.getallpersonal().subscribe(
                    data => {arrper=data; this.mgPersonal(arrper);}
                );
            }
        /* PROCEDIMIENTO ALMACENADOS TABLA EMPRESAPERSONA */
            /* CONSULTA TODAS LAS SUBEMPRESAS POR EMID */
                getallsuembyemid(emid:number){
                    let arrsuemp:any=[]=[];
                    this.empSubempservice.getallsubempresasbyemid(emid).subscribe(
                        data => {arrsuemp=data; 
                                this.mcSubEmpresas(arrsuemp); }
                    );
                }

            /* PROCEDURE OBTENIENDO DATOS -> EMPRESAPERSONA TODAS LAS PERSONAS DENTRO DE UNA SUBEMP */
                getallempPerByEmIdSuEmId(emid:number, suemid:number){
                    let empPer:any[]=[];
                    this.empPerservice.getallempperbyemidsuemid(emid,suemid).subscribe(
                        data => { empPer=data; 
                                    /* CARGANDO EN TABLA PRINCIPAL */
                                    this.mgEmprPers(empPer);
                                },
                        err => {this.errorMessage=err},
                    );
                }

            /* PROCEDURE NUEVO */
                nuevoObSubemp(){
                    this.EmPeId=0;
                    this.empPerservice.newEmpresaPersona().subscribe(
                        data=>{this.empPer=data;}
                    );
                }
            /* PROCEDURE GUARDAR */
                guardarEmpPer(empper:Object){
                    this.empPerservice.saveEmpresaPersona(empper).subscribe(
                        realizar => {this.getallempPerByEmIdSuEmId(this.emid,this._suemid); this.suemid=this._suemid;},
                        err  => {this.errorMessage=err;}
                    );
                }
            /* PROCEDURE ELIMINAR */
                deleteEmpPer(empeid:number){
                    this.empPerservice.deleteEmpresaPersona(empeid).subscribe(
                        realizar => {this.getallempPerByEmIdSuEmId(this.emid,this.suemid);},
                        err => {console.log(err);}
                    );
                }
            /* PROCEDURE EMPRESAPERSONA POR SU EMPEID */
            getEmpPerbyId(empeid:number){
                let objEmPer:any;
                this.empPerservice.getEmpPerById(empeid).subscribe(
                    data => {objEmPer=data; console.log(objEmPer);}
                );
            }

    /* OTRAS FUNCIONES */
        /* FUNCION ASOCIADA AL BTNNUEVO PARA ABRIR EL FORMULARIO NUEVA ASIGNACION EMPRESAPERSONA */
            vincularPersona(){
                console.log("vincular");
                this.displayNuevaEmpPersona=true;
            }

        /* FUNCION ASOCIA A COMBO SUBEMPRESAS (MODAL AGREGAR NUEVA EMPRESAPERSONA) */ 
            SuEmId(){
                console.log(this._suemid); 
            }

        /* FUNCION ASOCIA A COMBO SUBEMPRESAS (FORM PRINCIPAL) */ 
            _SuEmId(){
                /* PROCEDURE BUSCAR TODAS LAS PERSONA(EN CADA SUBEMPRESA) POR EMID Y SUEMID */
                this.getallempPerByEmIdSuEmId(this.emid,this.suemid);
            }

        /* FUNCION ASOCIADA A COMBO TIPO EMPPERSONA (TRABAJO DE PERSONA EN LA EMPRESA )*/
            idTipEmpPer(){
                console.log(this.idTiEmpPer);
            }

        /* FUNCION ASOCIADA A COMBO TIPO EMPPERSONA(TRABAJO DE PERSONA EN LA EMPRESA )  */
            /* QUITAR ESTA FUNCION CUANDO SE ELIMINE DE LA TABLA */
            funIdTipEmpPer(){console.log(this.idTiPer);}
        
        
        
    /* NUEVOS OBJ Y ARRAYS */
    
        /* FUNCION BTNNUEVO CREANDO REGISTRO EMPRESAPERSONA*/
             /* FUNCION ASOCIADA BTNNUEVO(FORM PRINCIPAL) */
                nuevoEmpPer(){
                    this.nuevoObSubemp();
                    this.getallsuembyemid(this.emid); /* CONSULTANDO TODAS LAS SUBEMPRESAS EXISTENTE EN LA EMPRESA(RUTA) */
                    /*this.getAllPersonas();  TODAS LAS PERSONAS AGREGADAS AL SISTEMA(EMPRESA) */
                }

            /* GUARDAR NUEVA EMPRESAPERSONA */
                guardarEmpPersona(){
                    this.displayNuevaEmpPersona=false;  /* ABRIR */
                    this.empPer={
                        UsFechaReg:new Date(),
                        UsId:this.userid,
                        PeId:this.PeId,
                        SuEmId:Number(this._suemid),
                        EmPeId:this.EmPeId,
                        EmPeTipo:this.idTiEmpPer
                    }
                    /* PROCEDURE GUARDAREMPPER - RECARGAR GRILLA EMPPERSONA */
                    console.log(this.empPer);
                    this.guardarEmpPer(this.empPer);
                }

            /* CANCELAR NUEVA EMPRESAPERSONA */
                cancelarEmpPersona(){
                    this.displayNuevaEmpPersona=false;  /* ABRIR */
                    /* VACIAR OBJETO */
                }
            
        /* EN CASO DE NO ENCONTRAR A LA PERSONA BUSCADA (AGREGAR NUEVA PERSONA A SU TABLA PADRE) */
            nuevaPersona(){
                this.displayNuevaEmpPersona=false; /* CERRAR */
                this.displayAgregaPersona=true;  /* ABRIR */ 
                /* PROCEDURE NUEVAPER */
            }
            /* GUARDAR NUEVA EMPRESAPERSONA */
            guardarNuevaPersona(){
                this.displayNuevaEmpPersona=true;  /* ABRIR */
                this.displayAgregaPersona=false; /* CERRAR */
                /* PROCEDURE GUARDARPER - RECARGAR GRILLA BUSCA PERSONA */
            
            }
            /* CANCELAR NUEVA EMPRESAPERSONA */
            cancelarNuevaPersona(){
                this.displayNuevaEmpPersona=true;  /* ABRIR */
                this.displayAgregaPersona=false; /* CERRAR */
                /* VACIAR OBJETO */
            }
   
    /* SELECT REGISTRO TODAS LAS PERSONAS*/
        onRowSelectPerEmp(event){
            console.log(event.data);
        }
        /*onRowSelectSubEmpresa(event){
            console.log(event);
        }*/
        onRowSelPers(event){
            console.log(event.data.PeId); 
            this.PeId=event.data.PeId;
        }
    
    /* BOTONES DE LAS TABLAS (CADA FILA) */
        /* TABLA PERSONAS(FORM PRINCIPAL) */
            editarEmpPer(empeid:number){
                //console.log(empeid);
                /* PROCEDURE BUSCAR */
                this.getEmpPerbyId(empeid);
            }
            eliminarEmpPer(empeid:number){
                //console.log(empeid);
                /* PROCEDURE ELIMINAR */
                this.deleteEmpPer(empeid);
            }

        /* TABLA PERSONAS(FORM MODAL NUEVO EMPPERSONA) */ 
            /* FUNCION ASOCIADA A BTN DATATABLE FILA TODAS LAS PERSONAS DEL SISTEMA */
            eliminarPersona(peid:number){
                console.log(peid);
            }

    /* MOSTRAR CARGAR DATOS A COMBO + TABLAS  */ 
        /* TABLA EMPPER GRILLA PRINCIPAL */
            mgEmprPers(arrEmpPer=[]){
                this.arrEmpPer=[];
                for(let empper of arrEmpPer){
                    this.arrEmpPer.push({
                        nro:0,
                        EmPeTipo:empper.EmPeTipo,
                        Id:empper.Id,
                        PeApellidos:empper.PeApellidos,
                        PeDNI:empper.PeDNI,
                        PeNombres:empper.PeNombres,
                        SuEmRSocial:empper.SuEmRSocial
                    });
                }
                /* ENUMERANDO FILAS */
                for(let i=0; i<this.arrEmpPer.length;i++){
                    this.arrEmpPer[i].nro=i+1;
                }

                /* MOSTRANDO CARGOS arrTipoEmpPer */
                let i=0,j=0,cen=0;
                while(i<this.arrEmpPer.length){
                    while(j<this.arrTipoEmpPer.length && cen==0){
                        if(this.arrEmpPer[i].EmPeTipo==this.arrTipoEmpPer[j].id){
                            this.arrEmpPer[i].EmPeTipo= this.arrTipoEmpPer[j].perTEmpPer;
                            cen=1;
                        }else if(this.arrEmpPer[i].EmPeTipo!=this.arrTipoEmpPer[j].id){
                            j++;cen=0;
                        }
                    }
                    cen=0;
                    j=0;
                    i++;
                }
            }

        /* TABLA PERSONAS */
             mgPersonal(arrper=[]){
                this.personalArr=[];/* LIMPIANDO ARRAY */
                for(let per of arrper){
                    this.personalArr.push({
                        nro : 0,
                        PeId:per.PeId,
                        PeNombres: per.PeNombres,
                        PeApellidos: per.PeApellidos,
                        PeDNI: per.PeDNI,
                        //PeDireccion: per.PeDireccion,
                        PeTipoLicencia: per.PeTipoLicencia,
                        //PeCelular: per.PeCelular,
                    });
                }
                for(let i=0; i<this.personalArr.length; i++){
                    this.personalArr[i].nro = i+1;
                }
            }

        /* MOSTRAR SUBEMPRESAS EN COMBO */
            mcSubEmpresas(arrsuEmp=[]){
                this._arrsuEmp=[];
                for(let suemp of arrsuEmp){
                    this._arrsuEmp.push({
                        SuEmId:suemp.SuEmId,
                        SuEmRSocial:suemp.SuEmRSocial,
                        SuEmRuc:suemp.SuEmRuc,
                        SuEmDireccion:suemp.SuEmDireccion,
                        SuEmTiempoVuelta:suemp.SuEmTiempoVuelta
                    });
                }
            }
        
}


    /* EDITAR 
        editarEmpresa(emp : Object){
            console.log("editar");
        }
        editarSubEmpresa(subemp : Object){
            console.log("editar");
        }*/

    /* ELIMINAR 
        eliminarEmpresa(empid : number){
            console.log("eliminar");
        }
        eliminarSubEmpresa(subempid : number){
            console.log("eliminar sub");
        }*/