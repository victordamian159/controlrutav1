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

    //mantenimiento
        /* CONSULTA BUSPERSONA POR ID */
            getConfiguraById(CoId : number){
                return this.http    
                    .get(this.baseUrl+CoId)
                    .map( (r:Response) => r.json() )
                        .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' ));
            }
        /* NUEVO BUSPERSONA */
            newConfigura(){
                return this.http    
                    .get(this.baseUrl + 'new')
                    .map( (r:Response) => r.json() )
                    .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' )); 
            }
        /* GUARDAR  BUSPERSONA*/
            saveConfigura(objConfig : Object){
                return this.http.post(this.baseUrl + 'save/',objConfig)
                                .map( (r:Response) => r.json() )
                                .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ));
            }
        /* ELIMINAR BUSPERSONA*/
            deleteConfigura(CoId:number){
                return this.http.delete(this.baseUrl+CoId)
                                    .map( (r:Response) => r.json() )
                                    .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ))
            }

    handleError (error: any) {
        let errorMsg = error.message;
        return Observable.throw(errorMsg);
    }
}