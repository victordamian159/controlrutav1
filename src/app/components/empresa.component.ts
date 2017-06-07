import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-empresa',
    templateUrl	: '../views/empresa.component.html',
    styleUrls: ['../styles/empresa.component.css']
})

export class EmpComponent implements OnInit{

    /* OBJETOS*/
    empresa={
        EmId:null,
        EmConsorcio:"",
        EmTipo:null,
        UdId:null,
        UsFechaReg:null,
    }
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
    _subempresa=[];
    _gempresa=[];
    _gsubempresa=[];

    /* DISPLAY MODAL*/
    displayNuevaEmp : boolean = false;
    displayNuevaSubEmp : boolean = false;
    displayEditarEmp : boolean = false;
    displayEditarSubEmp : boolean = false;
    displayConfDelEmp : boolean = false;
    displayConfDelSubEmp : boolean = false;
    //displayNuevaEmp : boolean = false;
    //displayNuevaEmp : boolean = false;

    /* VARIABLES*/
    mensaje:string;

    /* OTRAS VARIABLES*/

    ngOnInit(){
        
    }

    /* NUEVA EMPRESA*/
    nuevaEmpresa(){
        console.log("nuevo");
    }
    nuevaSubEmpresa(){
        console.log("nueva sub");
    }

    /* EDITAR EMPRESA*/
    editarEmpresa(emp : Object){
        console.log("editar");
    }
    editarSubEmpresa(subemp : Object){
        console.log("editar");
    }

    /* ELIMINAR EMPRESA*/
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