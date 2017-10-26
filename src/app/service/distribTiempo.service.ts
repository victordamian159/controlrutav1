import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_tiemposalida, url_tiempoprogramado} from 'app/urls'

@Injectable()

export class distribTiempoService{
    //private baseUrl1: string = 'http://controlbus-controlbus.1d35.starter-us-east-1.openshiftapps.com/bus/rest/tiemposalida/';
    //private baseUrl2: string = 'http://controlbus-controlbus.1d35.starter-us-east-1.openshiftapps.com/bus/rest/tiempoprogramado/';
    private baseUrl1=url_tiemposalida;
    private baseUrl2=url_tiempoprogramado;
    constructor(private http:Http){}
    
    //TIEMPOSALIDA
        //GETTERS   {"emId","buId"}
            getvalorsalidabyembu(emid:number, buid:number){
                return this.http    
                .get(this.baseUrl1+"getvalorsalidabyembu?emId="+emid+"&buId="+buid)
                .map((r:Response) => r.json())
                .catch(this.handleError);
            }
            getalltiemposalidabyem(emid:number){
                return this.http
                .get(this.baseUrl1+"getalltiemposalidabyem?emId="+ emid)
                .map((r: Response) => r.json())
                .catch(this.handleError);
            }
            gettiemposalidabyid(tisaid:number){
                return this.http
                .get(this.baseUrl1+tisaid)
                .map((r: Response) => r.json())
                .catch(this.handleError);
            }
        //MANTENIMIENTO
            newtiemposalida(){
                return this.http
                .get(this.baseUrl1+'new')
                .map((r: Response) => r.json() )
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
            }
            savetiemposalida(emp:Object){
                return this.http.post(this.baseUrl1+ "save/", emp) // ...using post request
                        .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }
            deletetiemposalida(TiSaId:number){
                return this.http.delete(this.baseUrl1+TiSaId) // ...using post request
                                .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                                .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
            }
    //TIEMPOPROGRAMADO
        //GETTERS
            getalltiempoprogramadobytisa(tisaid:number){
                return this.http
                .get(this.baseUrl2+"getalltiempoprogramadobytisa?tiSaId="+ tisaid)
                .map((r: Response) => r.json())
                .catch(this.handleError);
            }
            gettiempoprogramadobyid(tiprid:number){
                return this.http
                .get(this.baseUrl2+tiprid)
                .map((r: Response) => r.json())
                .catch(this.handleError);
            }
        //MANTENIMIENTO
            newtiempoprogramado(){
                return this.http
                .get(this.baseUrl2+'new')
                .map((r: Response) => r.json() )
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
            }
            savetiempoprogramado(emp:Object){
                return this.http.post(this.baseUrl2+ "save/", emp) // ...using post request
                        .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }
            deletetiempoprogramado(TiPrId:number){
                return this.http.delete(this.baseUrl2+TiPrId) // ...using post request
                                .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                                .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
            }
    //ERROR 
    handleError (error: any) {
		let errorMsg = error.message;
		return Observable.throw(errorMsg);
	}
}