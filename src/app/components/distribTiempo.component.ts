import {Component,OnInit} from '@angular/core';
import {extFuncArrHora,operMHoras,operSHoras, extFuncCorrecHora} from 'app/funciones';

@Component({
    selector:'app-distribTiempo',
    templateUrl:'../views/distribTiempo.component.html',
    styleUrls: ['../styles/distribTiempo.component.css']
})

export class distribTiempoComponent implements OnInit{
    /* VARIABLES */
    private mensaje:string;
    ngOnInit(){
        this.sacarTiempoSalidas();
    }
    constructor(){}
    
    sacarTiempoSalidas(){
        /* i: para recorrer array bucles */
        let horaInit:string, tmpoInter:string,auxT:string, nroPlacas:number, i:number;
        let arrResult:any[]=[];

        horaInit="06:00:00"; nroPlacas=16; tmpoInter="00:02:30"; i=0;

        while(i<nroPlacas){
            auxT=operMHoras(tmpoInter,i);
            arrResult[i]=extFuncCorrecHora(operSHoras(horaInit,auxT));
            i++;
        }

        console.log(arrResult);
    }
}