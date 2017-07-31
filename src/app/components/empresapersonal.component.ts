import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-empresapersonal',
    templateUrl	: '../views/empresapersonal.component.html',
    styleUrls: ['../styles/empresapersonal.component.css']
})

export class EmpPerComponent implements OnInit{

    /* OBJETOS*/
    
    
    subempresa={
        SuEmId:null,
        PeId:null,
        EmId:null,
        SuEmRuc:"",
        SuEmDireccion:"",
        SuEmUbigeo:"",
        SuEmNfijo:"",
        SuEmEmail:"",
        SuEmTiempoVuelta:"",
        SuEmActivo:null,
        UsId:null,
        UsFechaReg:null
    }

    /* ARRAYS*/
    _empresa=[];
    _subempresa=[]; /* USANDO EN GRILLA SUBEMP */
    _gempresa=[];
    _gsubempresa=[];

    /* DISPLAY MODAL*/
    displayNuevaEmp : boolean = false;
    displayNuevaSubEmp : boolean = false;
    displayEditarEmp : boolean = false;
    displayEditarSubEmp : boolean = false;
    displayConfDelEmp : boolean = false;
    displayConfDelSubEmp : boolean = false;
    displayBuscarPersona:boolean=false;
    displayAgregaPersona:boolean=false;
    //displayNuevaEmp : boolean = false;
    //displayNuevaEmp : boolean = false;

    /* VARIABLES*/
    mensaje:string;

    /* OTRAS VARIABLES*/

    ngOnInit(){
        
    }

    /* OBTENIENDO DATOS -> EMPRESA - PERSONA */

    /* OTRAS FUNCIONES */
    vincularPersona(){
        console.log("vincular");
        this.displayBuscarPersona=true;
    }

    /* NUEVA */
    nuevaEmpresa(){
        console.log("nuevo");
    }
    nuevaSubEmpresa(){
        console.log("nueva sub");
    }
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
}