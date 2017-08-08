import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
/*import {URLSearchParams} from '@angular/http';*/
import {Observable} from 'rxjs';

@Injectable()

export class BusService{
    private baseUrl :string ='http://controlbus-ronaldmam.rhcloud.com/rest/bus/'; 
    private baseUrl2:string ='http://controlbus-ronaldmam.rhcloud.com/rest/buspersona/';
    /* */
    constructor(private http: Http){}

    /* TABLA BUS */
        /* CONSULTA PARA BUS GRILLA PRINCIPAL */
            getAllBusByEmEmSu(emId: number, suEmId : number){
                return this.http
                    /* obtener consulta*/
                        .get(this.baseUrl+"getallbusesbyemsuem?emId="+emId+"&suEmId="+suEmId) 
                    /* convirtiendo la respuesta a json| */
                        .map( (r:Response) => r.json() ) 
                    /* capturando error*/
                        .catch(this.handleError); 
            }

        /* CONSULTA BUS POR ID */
            getBusById(buid : number){
                return this.http    
                    .get(this.baseUrl+buid)
                    .map( (r:Response) => r.json() )
                    .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' ));
            }

        /* NUEVO BUS */
            newBus(){
                return this.http    
                    .get(this.baseUrl + 'new')
                    .map( (r:Response) => r.json() )
                    .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' )); 
            }

        /* GUARDAR  BUS*/
            saveBus(bus : Object){
                return this.http.post(this.baseUrl + 'save/',bus)
                                .map( (r:Response) => r.json() )
                                .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ));
            }

        /* ELIMINAR BUS*/
            deleteBus(id:number){
                return this.http.delete(this.baseUrl+id)
                                    .map( (r:Response) => r.json() )
                                    .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ))
            }

    /* TABLA BUSPERSONA */
        /* CONSULTA BUSPERSONA (TODAS LAS PERSONAS QUE ESTAN A CARGO DEL BUS) */
            getAllBusByEmEmSubuId(emId:number, buId:number){
                return this.http
                    /* obtener consulta*/
                        .get(this.baseUrl2 +"getallpersonabyembu?emId="+emId+"&buId="+buId) 
                    /* convirtiendo la respuesta a json| */
                        .map( (r:Response) => r.json() ) 
                    /* capturando error*/
                        .catch(this.handleError); 
            }
        /* CONSULTA BUSPERSONA POR ID */
            getBusPersonaById(bupeid : number){
                return this.http    
                    .get(this.baseUrl2+bupeid)
                    .map( (r:Response) => r.json() )
                    .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' ));
            }
        /* NUEVO BUSPERSONA */
            newBusPersona(){
                return this.http    
                    .get(this.baseUrl2 + 'new')
                    .map( (r:Response) => r.json() )
                    .catch( (error:any) => Observable.throw( error.json().error || 'Error en el servidor' )); 
            }
        /* GUARDAR  BUSPERSONA*/
            saveBusPersona(busPer : Object){
                return this.http.post(this.baseUrl2 + 'save/',busPer)
                                .map( (r:Response) => r.json() )
                                .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ));
            }
        /* ELIMINAR BUSPERSONA*/
            deleteBusPersona(id:number){
                return this.http.delete(this.baseUrl2+ "delete/"+id)
                                    .map( (r:Response) => r.json() )
                                    .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ))
            }
        


    /* CAPTURADOR DE ERROR*/
        handleError (error: any) {
            // log error
            // could be something more sofisticated
            let errorMsg = error.message;// || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
            // throw an application level error
            return Observable.throw(errorMsg);
        }
}

/* http://controlbus-ronaldmam.rhcloud.com/rest/bus/getallbusesbyemsuem?emId=1&suEmId=1 */