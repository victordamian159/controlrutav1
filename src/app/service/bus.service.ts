import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
/*import {URLSearchParams} from '@angular/http';*/
import {Observable} from 'rxjs';

@Injectable()

export class BusService{
    private baseUrl:string = 'http://controlbus-ronaldmam.rhcloud.com/rest/bus/'; /* http://controlbus-ronaldmam.rhcloud.com/rest/bus/getallbusesbyemsuem?emId=1&suEmId=1 */
    
    /* */
    constructor(private http: Http){}
    
    /* CONSULTA PARA GRILLA PRINCIPAL */
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
        return this.http.delete(this.baseUrl+ "delete/"+id)
                            .map( (r:Response) => r.json() )
                            .catch( (error:any) => Observable.throw(error.json().error || 'Error en el servidor' ))
    }

    /* CAPTURADOR DE ERROR*/
    handleError (error: any) {
		// log error
		// could be something more sofisticated
		let errorMsg = error.message;// || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
		console.error(errorMsg);

		// throw an application level error
		return Observable.throw(errorMsg);
	}
}