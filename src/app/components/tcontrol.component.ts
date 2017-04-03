import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-tcontrol',
    templateUrl:'../views/tcontrol.component.html',
    styleUrls:['../styles/tcontrol.component.css']
})

export class TcontrolComponent implements OnInit{
    displayAsignarTarjeta : boolean = false;
    
    constructor(){

    }

    ngOnInit(){

    }
    showAsignaTarjetaControl(){
        console.log("nueva tarjeta =D");
        this.displayAsignarTarjeta = true;
    }
    guardarNewAsignarTarjeta(){
        console.log("se guardo");
    }
    cancelarNewAsignarTarjeta(){
        this.displayAsignarTarjeta = false;
        console.log("cancelado =()");
    }

}