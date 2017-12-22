import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
/*import {URLSearchParams} from '@angular/http';*/
import {Observable} from 'rxjs';
import {url_configura} from 'app/urls';

@Injectable()

export class ConfiguraService{
    private baseUrl=url_configura;

    constructor(private http: Http){}

    getAllConfiguraByEmPeriodo(EmId:number, Año:string){
        return this.http
            .get(this.baseUrl+"getallconfigurabyemperiodo?emId="+EmId+"&coPeriodo="+Año) 
            .map( (r:Response) => r.json() ) 
            .catch(this.handleError); 
    }

    handleError (error: any) {
        let errorMsg = error.message;
        return Observable.throw(errorMsg);
    }
}