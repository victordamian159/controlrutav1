import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_telefono} from 'app/urls'

@Injectable()

export class TeleMovilService{
    //private baseUrl :string ='http://controlbus-ronaldmam.rhcloud.com/rest/telefono/'; 
    private baseUrl :string =url_telefono; 
    constructor(private http: Http){}

    /* GET ALL TELEFONO POR BUID */
        getAllTeleMovilById(buid:number){
            return this.http
                .get(this.baseUrl+'getalltelefonobybu?buId='+buid)
                .map( (r:Response) => r.json() )
                .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' ));
        }
    /* GET TELEFONO POR ID */
        getTeMovById(TeId : number){
            return this.http    
                .get(this.baseUrl+TeId)
                .map( (r:Response) => r.json() )
                .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' ));
        }
    /* NUEVO TELEFONO*/
        newTeMov(){
            return this.http    
                .get(this.baseUrl+'new')
                .map( (r:Response) => r.json() )
                .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' )); 
        }
    /* GUARDAR TELEFONO*/
        saveTeMov(TeLe : Object){
            return this.http.post(this.baseUrl + 'save/',TeLe)
                            .map( (r:Response) => r.json() )
                            .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ));
        }
    /* ELIMINAR TELEFONO*/
        deleteTeMov(TeId:number){
            return this.http.delete(this.baseUrl+TeId)
                                .map( (r:Response) => r.json() )
                                .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ))
        }

    /* CAPTURADOR DE ERROR*/
        handleError (error: any) {
            let errorMsg = error.message;// || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
            // throw an application level error
            return Observable.throw(errorMsg);
        }
}