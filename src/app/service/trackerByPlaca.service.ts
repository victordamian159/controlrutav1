import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_trackerByPlaca} from 'app/urls';

@Injectable()

export class TrackerByPlacaService{
    private baseUrl=url_trackerByPlaca;

    constructor(private http:Http){}

    getallrecorridovueltabyemburedi(EmId:number, Periodo:number, BuId:number, ReDiDeId:number){
        return this.http        
            //.get(this.baseUrl+"getallregistrodiariobyem?emId="+emId)
            .get(this.baseUrl+"getallrecorridovueltabyemburedi?emId="+EmId+"&periodo="+Periodo+"&buId="+BuId+"&reDiDeId="+ReDiDeId)
            .map((r:Response) => r.json())
            .catch(this.handleError);
    }
    /*
    http://controlbus.us-east-1.elasticbeanstalk.com/rest/georeferencia/
	getallrecorridovueltabyemburedi?emId=1&periodo=2018&buId=10&reDiDeId=12
    */
    handleError (error:any){
        let errorMsg = error.message;
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}