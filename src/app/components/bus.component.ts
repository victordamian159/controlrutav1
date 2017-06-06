import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-bus',
    templateUrl	: '../views/bus.component.html',
    styleUrls: ['../styles/bus.component.css']
})

export class BusComponent implements OnInit{
    bus={
        BuId : null,
        SuEmId : null,
        BuPlaca : "",
        BuAnio :null,
        BuMotor :"",
        BuDescripcion :"",
        BuTipoCombustible:null,
        BuColor:"",
        BuCapacidad:null,
        BuMarca:"",
        BuTipo:null,
        BuSOAT:"",
        BuModelo:"",
        BuOperatividad:null,
        BuActivo:null,
        BuFIngr:"",
        BuFSal:"",
        UsId:null,
        UsFechaReg:"",
    }
    ngOnInit(){
        
    }
}