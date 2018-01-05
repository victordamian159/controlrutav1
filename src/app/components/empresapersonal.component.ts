import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {EmpPerService} from '../service/empresapersonal.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {hora,_hora} from 'app/funciones';
import {PersService} from '../service/personal.service';
import {UserSystemService} from '../service/usuarioSistema.service';
import {GlobalVars} from 'app/variables'



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
        displayUserSystem:boolean=false;
        displayConfEditEmpPer:boolean=false;
        displayEditEmpPer:boolean=false;
        displayConfElimEmpPer:boolean=false;

    /* ARRAYS */
        private _arrsuEmp:any[]=[]; //ARRAY COMBO SUBEMPRESAS
        private arrTipoEmpPer:any[]=[]; // ARRAY TIPOS DE PERSONA EN LA EMPRESA
        /*private arrTEmpPer:any[]=[]; // ARRAY TIPOS DE PERSONA(TABLA PADRE)*/
        private personalArr=[]; /* ARRAY DE TODAS LAS PERSONAS AGREGADAS AL SISTEMA */
        private arrEmpPer:any[]=[]; /* ARRAY PERSONAS POR SUBEMPRESAS(DATATABLE PRINCIPAL) */
        private arrAllUser:any[]=[]; /* TODOS LOS USER CREADOS POR EMID */
        private selectedRowTabEmpPer:any[]; /* filas seleccionadas en la TABLA DE FORM MODAL NUEVO BUSPERSONA */
        private selectedRowTabAllUserSystem:any[];
   
    /* VARIABLES*/
        private mensaje:string;
        private empPer:any; /* PROCEDURE NUEVO OBJ*/
        private EmPeId:number;
        private _user:any; /* PROCEDURE NUEVO OBJ NEW USER SYSTEM */
        private emid:number;
        private idTiEmpPer:string;
        private idTiPer:string;
        private persona:any={ nombres:"", apellidos:"", dni:"", nrocel:""}
        private userSystem:any={nomUser:"", password:""}
        private UsId:number; /* IDUSUARIO FORM USUARIO */
        private selectPersona:boolean;
        private selectRowPersona:any;
        private username:boolean;

    /* OTRAS VARIABLES*/
        private errorMessage:string='';
        private newpeid:number; /* ID PARA NUEVA PERSONA AGREGADA(CAMPOS NECESARIOS) */
        private _persona:any;
        private newUserId:number; /* ID NEW USER SYSTEM  */
        private PeId:number;    /* ID PERSONA SELECT (DATATABLE ASIGNAR NUEVA PERSONA) */
        private userid:number; /* ID DEL USUARIO(DEVUELTO DEL LOGIN) */
        private _suemid:number; /* VARIABLE ASOCIADA A COMBO SUBEMPS (MODAL AGREGAR NUEVA PERSONA)*/
        private __suemid:number;
        private suemid:number; /* VARIABLE ASOCIADA A COMBO SUBEMPS (FORM PRINCIPAL)*/
        private nombre:string; /* PARA MOSTRAR EN EL FORM NUEVO USERSYSTEM(PARA SABER A Q PERSONA SE LE CREA) */
        private _PeDNI:string;

    ngOnInit(){
        this.getallsuembyemid(this.emid);
        this.getAllPersonas();  /*TODAS LAS PERSONAS AGREGADAS AL SISTEMA(EMPRESA) */                    
        this.procGetAllUserSystembyEmId(this.emid);
    }

    /* CONSTRUCTOR */
    constructor(private empPerservice : EmpPerService,  
                private empSubempservice : EmpSubEmpService, 
                private persService : PersService, 
                private userService: UserSystemService,                 
                public ClassGlobal:GlobalVars){
        this.emid=this.ClassGlobal.GetEmId();
        this.userid=this.ClassGlobal.GetUsId();
        this.nombre="x";    
        this.suemid=0;
        this.EmPeId=-1;
        this.username=false;
        this._PeDNI='-1';
        this.arrTipoEmpPer=[{id:'01',perTEmpPer:'GERENTE'},{id:'02',perTEmpPer:'ADMINISTRADOR'},
                            {id:'03',perTEmpPer:'COBRADOR'},{id:'04',perTEmpPer:'ASOCIADOS'},
                            {id:'05',perTEmpPer:'CHOFER'},{id:'06',perTEmpPer:'CONTROLADOR'}];
        this.selectPersona=false;
    }

    
    /* PROCEDURES */
        /* PROCEDURE STORAGE TABLE USER SYSTEM - TABLA USUARIO*/
                /* CONSULTA TODAS LAS PERSONAS(USUARIOS) AGREGADAS AL SISTEMA */
                    procGetAllUserSystembyEmId(EmId:number){
                        let arrUsers:any[]=[];
                        this.userService.getAllUserSystembyEmId(EmId).subscribe(
                            data => {arrUsers=data; this.mgUserSystem(arrUsers);}
                        );
                    }
                /* BUSCAR USER SYSTEM BY ID*/
                    procGetUserSystembyUsId(userid:number){
                        let user:any;
                        this.userService.getUserSystembyUsId(userid).subscribe(
                            data => {user=data; console.log(user);}
                        );
                    }
                /* PROCEDURE NUEVO */
                    procNuevoUserSystem(){
                        this.UsId=0;
                        this.userService.newUserSystem().subscribe(
                            data=>{this._user=data; /*console.log(this._user);*/}
                        );
                    }
                /* PROCEDURE GUARDAR */
                    procGuardarUserSystem(objUser:Object){
                        this.userService.saveUserSystem(objUser).subscribe(
                            realizar => {this.procGetAllUserSystembyEmId(this.emid);},
                            err  => {this.errorMessage=err;}
                        );
                    }
                /* PROCEDURE ELIMINAR */
                    procDeleteUserSystem(userid:number){
                        this.userService.deleteUserSystem(userid).subscribe(
                            realizar => {},
                            err => {console.log(err);}
                        );
                    }
        /* PROCEDIMIENTO ALMACENADOS TABLA PERSONA */
            /* CONSULTA TODAS LAS PERSONAS AGREGADAS AL SISTEMA */
                getAllPersonas(){
                    let arrper:any[]=[];
                    this.persService.getallpersonal().subscribe(
                        data => {arrper=data; this.mgPersonal(arrper);}
                    );
                }
            /* PROCEDURE NUEVO */
                nuevoPersona(){
                    this.newpeid=0;
                    this.persService.newPersona().subscribe(
                        data=>{this._persona=data;}
                    );
                }
            /* PROCEDURE GUARDAR */
                guardarPersona(objPer:Object){
                    this.persService.savePersona(objPer).subscribe(
                        realizar => {this.getAllPersonas();},
                        err  => {this.errorMessage=err;}
                    );
                }
            /* PROCEDURE ELIMINAR */
                procDeletePersona(peid:number){
                    this.persService.deletePersona(peid).subscribe(
                        realizar => {this.getAllPersonas();},
                        err => {console.log(err);}
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
                        data => { empPer=data; /*console.log(empPer);*/
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
                        data => {
                            if(data.EmPeId>0){
                                this.getallempPerByEmIdSuEmId(this.emid,this.__suemid); 
                                this.suemid=this.__suemid;
                                this._PeDNI='-1';
                                this.selectRowPersona=null;
                            }else{
                                alert('Error al agregar la persona a una empresa');
                            }                            
                        },
                        err  => {
                            this.errorMessage=err;
                            alert('Error de conexion');
                        }
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
                        data => {objEmPer=data; this.mModalEditUserSystem(objEmPer);}
                    );
                }

    /* OTRAS FUNCIONES */
        /* FUNCION ASOCIADA AL BTNNUEVO PARA ABRIR EL FORMULARIO NUEVA ASIGNACION EMPRESAPERSONA */
            vincularPersona(){
                //console.log("vincular");
                this.displayNuevaEmpPersona=true;
            }

        /* FUNCION ASOCIA A COMBO SUBEMPRESAS (MODAL AGREGAR NUEVA EMPRESAPERSONA) */ 
            SuEmId(){
                //console.log(this._suemid); 
                this.__suemid=this._suemid;
            }

        /* FUNCION ASOCIA A COMBO SUBEMPRESAS (FORM PRINCIPAL) */ 
            _SuEmId(){
                /* PROCEDURE BUSCAR TODAS LAS PERSONA(EN CADA SUBEMPRESA) POR EMID Y SUEMID */
                this.getallempPerByEmIdSuEmId(this.emid,this.suemid);
            }

        /* FUNCION ASOCIADA A COMBO TIPO EMPPERSONA (TRABAJO DE PERSONA EN LA EMPRESA )*/
            idTipEmpPer(){
                //console.log(this.idTiEmpPer);
            }

        /* FUNCION ASOCIADA A COMBO TIPO EMPPERSONA(TRABAJO DE PERSONA EN LA EMPRESA )  */
            /* QUITAR ESTA FUNCION CUANDO SE ELIMINE DE LA TABLA */
            funIdTipEmpPer(){console.log(this.idTiPer);}
        
        
        
    /* NUEVOS OBJ Y ARRAYS */
        /* FUNCION BTN NEW USER SYSTEM REGISTRO DE USUARIO SOBRE EL SISTEMA */

            /* BTNNUEVO  */
                nuevoUserSystem(){
                    this.displayUserSystem=true;
                    this.userSystem.password=null;

                    /* PROCEDURE NUEVO */
                    this.procNuevoUserSystem();
                }

            /* GUARDAR  */
                guardarNewUserSystem(){  
                    this.displayUserSystem=false;
                    let activo
                    this._user={
                        EmPeId:this.EmPeId,
                        UsId:this.UsId,
                        UsUserName:this.userSystem.nomUser,
                        UsPassword:this.userSystem.password,
                        UsActivo:1,
                        UsId2:this.userid,
                        UsFechaReg:new Date()
                    }
                    /* PROCEDURE GUARDAR */
                    console.log(this._user);
                    this.procGuardarUserSystem(this._user);
                }

            /* CANCELAR  */
                cancelarNewUserSystem(){
                    this.displayUserSystem=false;
                }


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
                        SuEmId:Number(this.__suemid),
                        EmPeId:this.EmPeId,
                        EmPeTipo:this.idTiEmpPer
                    }
                    /* PROCEDURE GUARDAREMPPER - RECARGAR GRILLA EMPPERSONA */
                    /*console.log(this.empPer);*/
                    this.selectPersona=false;
                    //console.log(this.__suemid);
                    this.guardarEmpPer(this.empPer);
                }

            /* CANCELAR NUEVA EMPRESAPERSONA */
                cancelarEmpPersona(){
                    this.selectRowPersona=null;
                    this.displayNuevaEmpPersona=false;  /* ABRIR */
                    /* VACIAR OBJETO */
                }
            
        /* EN CASO DE NO ENCONTRAR A LA PERSONA BUSCADA (AGREGAR NUEVA PERSONA A SU TABLA PADRE) */
            nuevaPersona(){
                this.displayNuevaEmpPersona=false; /* CERRAR */
                this.displayAgregaPersona=true;  /* ABRIR */ 
                /* PROCEDURE NUEVAPER */
                this.nuevoPersona();
            }
            /* GUARDAR NUEVA EMPRESAPERSONA */
            guardarNuevaPersona(){
                this.displayNuevaEmpPersona=true; this.displayAgregaPersona=false; let persona:any;

                /* PROCEDURE GUARDARPER - RECARGAR GRILLA BUSCA PERSONA */
                persona={
                    PeId: this.newpeid,
                    UsFechaReg: new Date(),
                    UsId: this.userid,
                    PeNombres: this.persona.nombres,
                    PeApellidos: this.persona.apellidos,
                    PeDNI: this.persona.dni,
                    PeFecNac: new Date(),
                    PeDireccion: null,
                    PeTipoLicencia: null,
                    PeCelular: this.persona.nrocel,
                    PeTelefonoFijo: null,
                    PeEmail: null,
                    getPeFechaIng: new Date(),
                    PeFechaSal: new Date(),
                    PeSexo: null,
                    PeEstadoCivil: null
                }
       
                this.guardarPersona(persona);
                this.persona={};
            }
            /* CANCELAR NUEVA EMPRESAPERSONA */
            cancelarNuevaPersona(){
                this.displayNuevaEmpPersona=true;  /* ABRIR */
                this.displayAgregaPersona=false; /* CERRAR */
                /* VACIAR OBJETO */
                this.persona={};
            }
   
    
    /* ON ROW SELECT TABLES*/

            /* TABLE EMPRESAPERSONA (FORM PRINCIPAL) */
            onRowSelectPerEmp(event){       
                this.EmPeId=event.data.Id; let userSystemTab:any;
                let apellidos = event.data.PeApellidos, nombres = event.data.PeNombres, dni=event.data.PeDNI;
                this.userSystem.nomUser=this.nickUser(apellidos,nombres,dni);
                this.nombre=nombres; /* ETIQUETA EN EL FORM USERSYSTEM . PARA SABER A QUIEN SE CREA EL USUAIRO DEL SISTEMA */
        
                userSystemTab=this.usuariosCreados(this.selectedRowTabEmpPer, this.arrAllUser);
                if(userSystemTab!=-1){
                    this.selectedRowTabAllUserSystem=userSystemTab; this.username=true;
                }else if(userSystemTab==-1){
                    this.username=false; this.selectedRowTabAllUserSystem=null;
                }       
            }

            onRowSelectAllUserSystem(event){ 

            }
            nickUser(ape:string, nom:string, dni:string) :string{
                let nickName:string;
                nickName=(ape.substr(0,3)) + (nom.substr(0,3)) + (dni.substr(0,3));
                return nickName;
            }

            /* TABLE PERSONA (FORM NUEVO EMPRESAPERSONA modal) */
            onRowSelPers(event){
                let PeDNI:string, _PeDNI:string; this.selectPersona=true; this.PeId=event.data.PeId;  PeDNI=event.data.PeDNI;
                this._PeDNI=this.buscarEmPeId(PeDNI, this.arrEmpPer);             
            }
            
    /* BOTONES DE LAS TABLAS (CADA FILA) */
        /* TABLA EMPRESA_PERSONA(FORM PRINCIPAL) */
            /* EDITAR */
                editarEmpPer(empeid:number){
                    //console.log(empeid);
                    this.mensaje="¿Esta seguro de editar el registro?"
                    this.EmPeId=empeid;
                    this.displayConfEditEmpPer=true;
                }
                /* ACEPTAR EDITAR EMPPER */
                aceptarEditEmpPer(){
                    this.mensaje="";
                    this.displayConfEditEmpPer=false;
                    //this.displayEditEmpPer=true;
                    this.displayUserSystem=true;
                    /* PROCEDURE BUSCAR */
                    this.getEmpPerbyId(this.EmPeId);
                }
                /* CANCEL EDITAR EMPPER*/
                cancelEditEmpPer(){
                    this.mensaje="";
                    this.displayConfEditEmpPer=false;
                }

            /* ELIMINAR */
                eliminarEmpPer(empeid:number){
                    //console.log(empeid);
                    this.mensaje="¿Esta seguro de eliminar el registro?"
                    this.EmPeId=empeid;
                    this.displayConfElimEmpPer=true;
                }
                /* ACEPTAR ELIMINAR EMPPER */
                aceptarElimEmpPer(){
                    this.mensaje="";
                    /* PROCEDURE ELIMINAR */
                    this.displayConfElimEmpPer=false;
                    this.deleteEmpPer(this.EmPeId);
                }
                /* CANCEL ELIMINAR EMPPER*/
                cancelElimEmpPer(){
                    this.mensaje="";
                    this.displayConfElimEmpPer=false;
                }

        /* TABLA PERSONAS(FORM MODAL NUEVO EMPPERSONA) */ 
            /* FUNCION ASOCIADA A BTN DATATABLE FILA TODAS LAS PERSONAS DEL SISTEMA */
            eliminarPersona(peid:number){
                console.log(peid);
                this.procDeletePersona(peid); 
            }

        /* TABLA USUARIO DEL SISTEMA */
            editarUserSystem(userid:number){
                this.procGetUserSystembyUsId(userid);
            }
            eliminarUserSystem(userid:number){
                this.selectedRowTabEmpPer=[];
                this.nombre="x";
                this.procDeleteUserSystem(userid);
            }

    /* MOSTRAR CARGAR DATOS A COMBO + TABLAS  */ 
        /* TABLA ALL USER SYSTEM */
            mgUserSystem(arrUsers=[]){
                let arrAllUser:any=[];

                for(let user of arrUsers){
                    arrAllUser.push({
                        Nro:0,
                        EmId:user.EmId,
                        PeApellidos:user.PeApellidos,
                        PeNombres:user.PeNombres,
                        UsActivo:user.UsActivo,
                        UsId:user.UsId,
                        UsUserName:user.UsUserName,
                    });
                }   
                for(let i=0; i<arrAllUser.length; i++){
                    arrAllUser[i].Nro=i+1;
                }
                this.arrAllUser=arrAllUser;
            }

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
            mModalEditUserSystem(user:any){
                console.log(user);
            }
        //buscar y seleccionar en la tabla de usuarios del sistema
            usuariosCreados(objTabPersona:any, arrAllUsers=[]):any{
                let objResult:any, i:number=0, cen:number=0;
                    //console.log(objTabPersona); console.log(arrAllUsers);

                    while(i<arrAllUsers.length && cen==0){
                        if(arrAllUsers[i].PeApellidos==objTabPersona.PeApellidos 
                            && arrAllUsers[i].PeNombres==objTabPersona.PeNombres){
                                cen=1;
                        }else if(arrAllUsers[i].PeApellidos!=objTabPersona.PeApellidos 
                            && arrAllUsers[i].PeNombres!=objTabPersona.PeNombres){
                                cen=0; i++;
                        }
                    }                

                    if(cen==1){
                        objResult=arrAllUsers[i];
                    }else if(cen==0){
                        objResult=-1;
                    }
                return objResult;
            }
        //buscar si persona esta agregada a una empresa
            buscarEmPeId(PeDNI:string, arrEmpPer=[]):string{
                let _PeDNI:string, i:number=0, cen:number=0;
                //console.log(PeDNI); console.log(arrEmpPer);
                while(i<arrEmpPer.length && cen==0){
                    if(arrEmpPer[i].PeDNI!=PeDNI){
                        i++; cen=0
                    }else if(arrEmpPer[i].PeDNI==PeDNI){
                        cen=1;
                    }
                }
                if(cen==1){
                    _PeDNI=PeDNI;
                }else if(cen==0){
                    _PeDNI='-1';
                }
                return _PeDNI;
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