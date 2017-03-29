import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/primeng';

@Component({
    selector: 'app-prog',
    templateUrl	: '../views/prog.component.html',
    styleUrls: ['../styles/prog.component.css']
})

export class ProgComponent implements OnInit{
    Placas: SelectItem[];
    displayNuevaProgramacion: boolean = false;
    displayListaPlacas: boolean = false;
    selectedPlacas: string[] = [];
    disabledbutton: boolean = false;
    constructor(){
        /*
         this.Placas = [];
        this.Placas.push({label: 'Audi', value: 'Audi'});
        this.Placas.push({label: 'BMW', value: 'BMW'});
        this.Placas.push({label: 'Fiat', value: 'Fiat'});
        this.Placas.push({label: 'Ford', value: 'Ford'});
        this.Placas.push({label: 'Honda', value: 'Honda'});
        this.Placas.push({label: 'Jaguar', value: 'Jaguar'});
       */
    }

    ngOnInit(){

    }

    nuevo(){
        console.log("nuevo");
    }

    showNuevaProgramacion(){
        this.displayNuevaProgramacion=true;
    }

    showPlacas(){
        this.displayNuevaProgramacion=false;
        this.displayListaPlacas=true;
    }

    generarProgramacion(){
        console.log("programacion =D");
    }

    disabledButtonForm(){
        this.disabledbutton = true;
        return this.disabledbutton;
    }
}