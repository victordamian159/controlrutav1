import {Component, OnInit, Input } from '@angular/core';
import {_hora,cCeroHora} from 'app/funciones';
import {ConfiguraService} from '../service/configura.service';
import {GlobalVars} from 'app/variables';
import { clearInterval } from 'timers';
import { TimeInterval } from 'rxjs/operators/timeInterval';

@Component({
    selector:'app-reloj',
    templateUrl:'../views/reloj.component.html',
    styleUrls: ['../styles/reloj.component.css']
})

export class RelojComponent implements OnInit {
//@Input() initHora:number; 
private hora:string;
private nhh: number; private nmm: number; private nss: number;
private shh: string; private smm: string; private sss: string;

private tHora:any[];
private interval:any;
private emID:number;
private UsId:number;
private objConfigSystem:any;
private horaActual:any;
private i=1;

ngOnInit(){
    this.funcInitTime();
}
constructor(public  ClassGlobal : GlobalVars, 
            private configService : ConfiguraService){
    this.emID=this.ClassGlobal.GetEmId();
    this.UsId=this.ClassGlobal.GetUsId();
    this.tHora=[{id:0, nom:'am'}, {id:1, nom:'pm'}];
    //this.interval=setInterval(()=> this.funcInitTime(),1000);
}

funcInitTime(){
    let añoActual=new Date().getFullYear().toString(), EmId=this.emID;
   
    this.configService.getAllConfiguraByEmPeriodo(EmId,añoActual).subscribe(
    data=>{ 
        if(data.length!=0){
            this.objConfigSystem=data[0];
            
            this.horaActual=this.objConfigSystem.CoTiempoActual; this.hora=_hora(this.horaActual);
            console.log(this.hora);
            let arrHora=this.hora.split(':');    
            this.nhh=Number(arrHora[0]); 
            this.nmm=Number(arrHora[1]); 
            this.nss=Number(arrHora[2]);
            //this.interval=setInterval(()=> this.funcReloj(this.nhh,this.nmm,this.nss ),1000);
            this.interval=this.funcInterval();
        }else{
            console.log('Error, no se pudo descargar la configuracion del sistema');
        }
    },
    error=>{alert('error al iniciar el periodo: '+error);},
    ()=>{}
    );
}

funcInterval(){
    return setInterval(()=> this.funcReloj(this.nhh,this.nmm,this.nss ),1000);
}

funcReloj(nhh:number,nmm:number,nss:number){
    if(this.nss>=59){
        this.nmm++;
        this.nss=-1;
    }
    
    if(this.nmm>=59){
        this.nhh++;
        this.nmm=0;
    }
    
    let arrHora=[nhh,nmm,nss];
    //this.hora=cCeroHora(arrHora.join(':'));
    this.hora=this.functFormatoAMPM(arrHora);
    //console.log(this.hora);
    this.nss++;
}

functFormatoAMPM(arrHora=[]):string{
    let hora:string;
    if(arrHora[0]>12){
        arrHora[0]=arrHora[0]-12;
        arrHora.push('pm');
    }else if(arrHora[0]<12){
        arrHora.push('am');
    }else if(arrHora[0]==12){
        arrHora.push('pm');
    }
    hora=arrHora[0].toString()+':'+arrHora[1].toString()+':'+arrHora[2].toString();

    let arrH=cCeroHora(hora);
   
    let _arrH=arrH+'_'+arrHora[3];
    let arr=_arrH;
    
    return arr;
}


ngOnDestroy(){
    console.log('cerrado :s');
    //clearInterval(this.interval); DA ERROR
}

}
