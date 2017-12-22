import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
//import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';

@Injectable()

export class DatosCompartidosService{

    public ConfigSystem=new Subject<any>();
    
    constructor(private http:Http){}
    
    compartirDatosGlobal(data:number){
        console.log(data);
        this.ConfigSystem.next(data);
        console.log(this.ConfigSystem);
    }
}