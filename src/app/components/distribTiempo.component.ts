import {Component,OnInit} from '@angular/core';
import {extFuncArrDistTmps,extFuncArrHora,operMHoras,operSHoras, extFuncCorrecHora} from 'app/funciones';

@Component({
    selector:'app-distribTiempo',
    templateUrl:'../views/distribTiempo.component.html',
    styleUrls: ['../styles/distribTiempo.component.css']
})

export class distribTiempoComponent implements OnInit{
    /* VARIABLES */
    private mensaje:string;
    
    /* ARRAY */
    private tpoDistr:any[]; /* FORMA DISTRUUBCION */
    private arrProgr:any[];

    /*DISPLAY MODALES */
    private disInitTimesProg:boolean;

    ngOnInit(){
        this.funcBtnSacarTiemposSalida();
        console.log(extFuncArrDistTmps("00:03:45","00:00:25"));
    }
    constructor(){
        this.tpoDistr=[{id:"01", nomb:"MENOR TIEMPO"},{id:"02",nomb:"MANUAL"},{id:"03",nomb:"RECORRER"}];
        this.disInitTimesProg=false;
        this.arrProgr=[
                        {nro:1,placa:"MK-123k",suemp:"Emp. Trans. Elena"},
                        {nro:2,placa:"KQ-23kR",suemp:"Emp. Trans. Elena"},
                        {nro:3,placa:"ML-RE3k",suemp:"Emp. Trans. Elena"},
                        {nro:4,placa:"RK-123k",suemp:"Emp. Trans. Elena"},
                        {nro:5,placa:"2K-123k",suemp:"Emp. Trans. Elena"},
                        {nro:6,placa:"5F-R23k",suemp:"Emp. Trans. Virgo"},
                        {nro:7,placa:"TK-F23k",suemp:"Emp. Trans. Virgo"},
                        {nro:8,placa:"MDK-23k",suemp:"Emp. Trans. Virgo"},
                        {nro:9,placa:"MKF-13k",suemp:"Emp. Trans. Virgo"},
                        {nro:10,placa:"MK-123k",suemp:"Emp. Trans. Virgo"},
                        {nro:11,placa:"SD-123k",suemp:"Emp. Trans. Virgo"},
                        {nro:12,placa:"VV-123k",suemp:"Emp. Trans. Virgo"},
                        {nro:13,placa:"GH-123k",suemp:"Emp. Trans. Max"},
                        {nro:14,placa:"RE-1D3k",suemp:"Emp. Trans. Max"},
                        {nro:15,placa:"DF-1F3k",suemp:"Emp. Trans. Max"},
                        {nro:16,placa:"VB-1G3k",suemp:"Emp. Trans. Max"},
                        {nro:17,placa:"DF-123k",suemp:"Emp. Trans. Max"},
                        {nro:18,placa:"A2-123k",suemp:"Emp. Trans. Max"},
                        {nro:19,placa:"ER-123k",suemp:"Emp. Trans. Max"},
                        {nro:20,placa:"FD-123k",suemp:"Emp. Trans. Max"},
                        {nro:21,placa:"AS-123k",suemp:"Emp. Trans. Max"}
        ];
        
    }
    /* PROCEDURES */
    /* FUNCIONES */
        btnPInitHoras(){
            this.disInitTimesProg=true;
        }
    funcBtnSacarTiemposSalida(){
        let arr:any[]=[];
        arr=this.sacarTiempoSalidas("06:00:00",16, "00:02:30");
    }

    sacarTiempoSalidas(hInit:string, nPlacas:number, tpoInter:string){
        /* i: para recorrer array bucles */
        let auxT:string, i:number; let arrResult:any[]=[];
        i=0;
        while(i<nPlacas){
            auxT=operMHoras(tpoInter,i);
            arrResult[i]=extFuncCorrecHora(operSHoras(hInit,auxT));
            i++;
        }
        return arrResult;
    }

    /* IMPARES Y PARES DISTRIBUIR TIEMPO */
    distribuirTiempos(tipo:string, arrTmp=[], tmpRep:string, _tmpRep:string){
        let arrTmpsRep:string[]=[];
        /* 
            tipo: tiempo de distribucion,
            arrTmp: array de tiempos a aumentar su minutos o segundos
            tmpRep: tiempo total a repartir
            _tmpRep: tiempo en q debe dividirse el tmpRep
            arrTmpsRep: array de tiempos divididos partes pequeñas
        */
        arrTmpsRep=extFuncArrDistTmps(tmpRep,_tmpRep);

        /* MENOR TIEMPO */
        if(tipo=="01"){    

        /* MANUAL */
        }else if(tipo=="02"){
            //NO PROGRAMADO
        /* RECORRER:  */
        }else if(tipo=="03"){
            //NO PROGRAMADO
        }
        
    }
}