import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {EmpPerService} from '../service/empresapersonal.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {hora,_hora} from 'app/funciones';

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
        displayBuscarPersona:boolean=false;
        displayAgregaPersona:boolean=false;
    
    /* ARRAYS */
        private _arrsuEmp:any[]=[]; //ARRAY COMBO SUBEMPRESAS
        private arrTipoEmpPer:any[]=[]; // ARRAY TIPOS DE PERSONA EN LA EMPRESA
        private arrTEmpPer:any[]=[]; // ARRAY TIPOS DE PERSONA(TABLA PADRE)
   
    /* VARIABLES*/
        private mensaje:string;
        private empPer:any; /* PROCEDURE NUEVO OBJ*/
        private EmPeId:number;
        private _suemid:number; /* VARIABLE ASOCIADA A COMBO SUBEMPS */
        private emid:number;
        private idTiEmpPer:string;
        private idTiPer:string;

    /* OTRAS VARIABLES*/
        private errorMessage:string='';


    ngOnInit(){
        this.emid=1;
        this.getallempPerByEmIdSuEmId(1,1);
        this.arrTipoEmpPer=[{id:'01',perTEmpPer:'GERENTE'},
                            {id:'02',perTEmpPer:'ADMINISTRADOR'},
                            {id:'03',perTEmpPer:'COBRADOR'},
                            {id:'04',perTEmpPer:'ASOCIADOS'},
                            {id:'05',perTEmpPer:'CHOFER'},
                            {id:'06',perTEmpPer:'CONTROLADOR'}];

        this.arrTEmpPer=[{id:'01',perTipo:'TIPO 1'},
                         {id:'02',perTipo:'TIPO 2'},
                         {id:'03',perTipo:'TIPO 3'},
                         {id:'04',perTipo:'TIPO 4'}];
    }

    /* CONSTRUCTOR */
    constructor(private empPerservice : EmpPerService, private empSubempservice : EmpSubEmpService){}


    /* PROCEDURES */
        /* CONSULTA TODAS LAS SUBEMPRESAS POR EMID */
            getallsuembyemid(emid:number){
                let arrsuemp:any=[]=[];
                this.empSubempservice.getallsubempresasbyemid(emid).subscribe(
                    data => {arrsuemp=data; 
                            this.mcSubEmpresas(arrsuemp); }
                );
            }

        /* PROCEDURE OBTENIENDO DATOS -> EMPRESAPERSONA */
            getallempPerByEmIdSuEmId(emid:number, suemid:number){
                let empPer:any[]=[];
                this.empPerservice.getallempperbyemidsuemid(emid,suemid).subscribe(
                    data => { empPer=data; this.mgEmprPers(empPer);},
                    err => {this.errorMessage=err},
                );
            }
        /* PROCEDURE NUEVO */
            nuevoObSubemp(){
                this.EmPeId=0;
                this.empPerservice.newEmpresaPersona().subscribe(
                    data=>{this.empPer=data; console.log(this.empPer);}
                );
            }

    /* OTRAS FUNCIONES */
        vincularPersona(){
            console.log("vincular");
            this.displayBuscarPersona=true;
        }

        /* FUNCION ASOCIA A COMBO SUBEMPRESAS */ 
            SuEmId(){
                console.log(this._suemid);
                /* PROCEDURE BUSCAR PERSONA POR EMID Y SUEMID */
                this.getallempPerByEmIdSuEmId(this.emid,this._suemid);
            }

        /* FUNCION ASOCIADA A COMBO TIPO EMPPERSONA */
            idTipEmpPer(){
                console.log(this.idTiEmpPer);
            }

        /* FUNCION ASOCIADA A COMBO TIPO EMPPERSONA */
            funIdTipEmpPer(){
                console.log(this.idTiPer);
            }
        
    /* NUEVOS OBJ Y ARRAYS */
        /* FUNCION BTNNUEVO */
            nuevoEmpPer(){
                this.nuevoObSubemp();
                this.getallsuembyemid(this.emid);
            }
            
        /* EN CASO DE NO ENCONTRAR A LA PERSONA BUSCADA */
            nuevaPersona(){
                this.displayBuscarPersona=false; /* CERRAR */
                this.displayAgregaPersona=true;  /* ABRIR */ 
                /* PROCEDURE NUEVAPER */
            }

    /* ACEPTAR CANCELAR - NUEVO */
        aceptarPersona(){
            this.displayBuscarPersona=true;  /* ABRIR */
            this.displayAgregaPersona=false; /* CERRAR */
            /* PROCEDURE GUARDARPER - RECARGAR GRILLA BUSCA PERSONA */
        
        }
        cancelarPersona(){
            this.displayBuscarPersona=true;  /* ABRIR */
             this.displayAgregaPersona=false; /* CERRAR */
            /* VACIAR OBJETO */
        }


    /* EDITAR */
        editarEmpresa(emp : Object){
            console.log("editar");
        }
        editarSubEmpresa(subemp : Object){
            console.log("editar");
        }

    /* ELIMINAR */
        eliminarEmpresa(empid : number){
            console.log("eliminar");
        }
        eliminarSubEmpresa(subempid : number){
            console.log("eliminar sub");
        }

    /* SELECT REGISTRO*/
        onRowSelectEmpresa(event){
            console.log(event);
        }
        onRowSelectSubEmpresa(event){
            console.log(event);
        }

    

    /* CARGAR DATOS A COMBO + TABLAS  */ 
        /* TABLA EMPPER GRILLA PRINCIPAL */
            mgEmprPers(arrEmpPer=[]){
                console.log(arrEmpPer);
            }

        /* TABLA PERSONAS */

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
                console.log(this._arrsuEmp);
            }
        
}