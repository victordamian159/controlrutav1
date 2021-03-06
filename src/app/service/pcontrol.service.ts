import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_puntocontroldetalle,url_puntocontrol} from 'app/urls';

@Injectable()

export class PuntoControlService{
	private baseUrl=url_puntocontrol;
	private baseUrl2=url_puntocontroldetalle;

	constructor(private http: Http) { }

	getAllPuntoControlByEmRu(emId: number,ruId:number) {
		return this.http
				.get(this.baseUrl+ "getallpuntocontrolbyemru?emId="+emId+"&ruId="+ruId) 
				.map((r: Response) => r.json() )             
				.catch(this.handleError);
	}
//PUNTO CONTROL MAESTRO
	//consulta punto control por ID
	getPuntoControlById(puCoId:number){
		return this.http
			.get(this.baseUrl+ puCoId )
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}	
    newPuntoControl(){
		return this.http
			.get(this.baseUrl+ 'new')
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));

	}
    savePuntoControl(puntoControl:Object){
		//si en caso se quiere enviar mas de un objeto
		//let data=JSON.stringify({ Album: tramiteMov, User: tramiteMov, UserToken: tramiteMov })
		return this.http.post(this.baseUrl+ "save/", puntoControl) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}
	deletePuntoControl(id:number){
		//return this.http.delete(this.baseUrl+ "delete/"+id)
		return this.http.delete(this.baseUrl+ "delete/"+id) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}

//Objeto PuntoControl Detalle 
	//para capturar el punto control detalle y mostrarlo en la grilla por ID
	getAllPuntoControlDetalleByPuCo(puCoId:number){
		return this.http
			.get(this.baseUrl2+'pucoid/'+puCoId )
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	//nuevo punto control detalle
	newPuntoControlDetalle(){
		return this.http
			.get(this.baseUrl2+ 'new')
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	//eliminar punto control detalle
	deletePuntoControlDetalleByRu(puCoId:number){
		return this.http.delete(this.baseUrl2+ "delete/pucoid/"+puCoId) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}
	//guardar punto control detalle
	savePuntoControlDetalle(puntoControlDetalle:Object[]){
		//si en caso se quiere enviar mas de un objeto
		//let data=JSON.stringify({ Album: tramiteMov, User: tramiteMov, UserToken: tramiteMov })
		return this.http.post(this.baseUrl2+ "save/", puntoControlDetalle) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
	}

    // this could also be a private method of the component class

//capturar error
	handleError (error: any) {
		// log error
		// could be something more sofisticated
		let errorMsg = error.message;// || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
		console.error(errorMsg);
		// throw an application level error
		return Observable.throw(errorMsg);
	}
}