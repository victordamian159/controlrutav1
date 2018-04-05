import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_alertaIncidencia} from 'app/urls';
@Injectable()

export class servAlertNotifService{
    constructor(private http:Http){}
    private baseUrl=url_alertaIncidencia;

    getallalertaincidenciabyemtaco(emId:number, taCoId:number){
        return this.http        
            .get(this.baseUrl+"getallalertaincidenciabyemtaco?emId="+emId+"&taCoId="+taCoId)
            .map((r:Response) => r.json())
            .catch(this.handleError);
    }

    getallalertaincidenciabyemfecha(emId:number, fecha:string){
        return this.http        
            .get(this.baseUrl+"getallalertaincidenciabyemfecha?emId="+emId+"&fecha="+fecha)
            .map((r:Response) => r.json())
            .catch(this.handleError);
    }

    //NUEVA TARJETA DE CONTROL
    nuevaAlertaIncidencia(){
		return this.http
			.get(this.baseUrl+'new')
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}

    //GUARDAR TARJETA DE CONTROL
    guardarAlertaIncidencia(AlertaIncidencia:Object[]){
		/*si en caso se quiere enviar mas de un objeto ->let data=JSON.stringify({ Album: tramiteMov, User: tramiteMov, UserToken: tramiteMov })*/
		return this.http.post(this.baseUrl+ "saves/", AlertaIncidencia) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}

    //ELIMINAR TARJETA DE CONTROL
	eliminarAlertaIncidencia(AlInId:number){
		//return this.http.delete(this.baseUrl+ "delete/"+id)
		return this.http.delete(this.baseUrl+ AlInId) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
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