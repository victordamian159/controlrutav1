import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_vistaEnLinea} from 'app/urls';

@Injectable()

export class VistaEnLineaService{
    constructor(private http:Http){}
    private baseUrl=url_vistaEnLinea;
    //http://controlbus.us-east-1.elasticbeanstalk.com/rest/georeferencia/
    
    //getallubicacionactualbyemtiempo?emId=1&periodo=2018&tiempo=2017/12/23
    getallubicacionactualbyemtiempo(emId:number,periodo:number,tiempo:number){
        return this.http        
            .get(this.baseUrl+"getallubicacionactualbyemtiempo?emId="+emId+"&periodo="+periodo+"&tiempo="+tiempo)
            .map((r:Response) => r.json())
            .catch(this.handleError);
    }

    handleError (error: any) {
		// log error
		// could be something more sofisticated
		let errorMsg = error.message;// || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
		console.error(errorMsg);
		// throw an application level error
		return Observable.throw(errorMsg);
	}
}