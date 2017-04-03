import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http'
import {Observable} from 'rxjs';

@Injectable()

export class PlacasService{
    private baseUrl: string = 'http://controlbus-ronaldmam.rhcloud.com/rest/bus/'
    //http://controlbus-ronaldmam.rhcloud.com/rest/bus/getallbusesbyemsuem?emId=1&suEmId=0
    
    constructor(private http: Http){}

    getAllPlacasBusByEmSuEm(emId: number, suemId : number){
        return this.http
            .get(this.baseUrl+"getallbusesbyemsuem?emId="+emId+"&suEmId="+suemId)
            .map((r:Response) => r.json() )
            .catch(this.handleError);
    }

    handleError(error:any){
        let errorMsg = error.message;
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}