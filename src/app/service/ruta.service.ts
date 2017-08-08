import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()

export class RutaService{
    private baseUrl: string = 'http://controlbus-ronaldmam.rhcloud.com/rest/ruta/';
	private baseUrl2: string = 'http://controlbus-ronaldmam.rhcloud.com/rest/rutadetalle/';
	/*
		private baseUrl2: string = 'http://controlbus-controlbus.44fs.preview.openshiftapps.com/bus/rest/rutadetalle/';
		private baseUrl: string = 'http://localhost:8081/bus/rest/ruta/';
		http://controlbus-ronaldmam.rhcloud.com/rest/ruta
		private baseUrl: string = 'http://controlbus-controlbus.44fs.preview.openshiftapps.com/bus/rest/ruta/';	
	*/

    constructor(private http: Http) { }

	/*CONSULTA PARA LA GRILLA PRINCIPAL */
		getAllRutaByEm(emId: number) {
			return this.http
					.get(this.baseUrl+ "getallrutabyem?emId="+emId) 
					.map((r: Response) => r.json() )             
					.catch(this.handleError);
		}	
		
	//Maestro
		getRutaById(ruId:number){
			return this.http
				.get(this.baseUrl+ ruId )
				.map((r: Response) => r.json() )
				.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
		}	
		
		newRuta(){
			return this.http
				.get(this.baseUrl+ 'new')
				.map((r: Response) => r.json() )
				.catch((error:any) => Observable.throw(error.json().error || 'Server error'));

		}
	
		//guardar ruta
		saveRuta(ruta:Object){
			//si en caso se quiere enviar mas de un objeto
			//let data=JSON.stringify({ Album: tramiteMov, User: tramiteMov, UserToken: tramiteMov })
			return this.http.post(this.baseUrl+ "save/", ruta) // ...using post request
							.map((res:Response) => res.json()) // ...and calling .json() on the response to return data
							.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
		}

		deleteRuta(id:number){
			//return this.http.delete(this.baseUrl+ "delete/"+id)
			return this.http.delete(this.baseUrl+ "delete/"+id) // ...using post request
							.map((res:Response) => res.json()) // ...and calling .json() on the response to return data
							.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
		}

	//Objeto RutaDetalle 
		getAllRutaDetalleByRu(ruId:number){
			return this.http
				.get(this.baseUrl2+'ruid/'+ruId )
				.map((r: Response) => r.json() )
				.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
		}
		
		newRutaDetalle(){
			return this.http
				.get(this.baseUrl2+'new')
				.map((r: Response) => r.json() )
				.catch((error:any) => Observable.throw(error.json().error || 'Server error'));

		}
		
		deleteRutaDetalleByRu(ruId:number){
			return this.http.delete(this.baseUrl2+ "delete/ruid/"+ruId) // ...using post request
							.map((res:Response) => res.json()) // ...and calling .json() on the response to return data
							.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
		}
		
		saveRutaDetalle(rutaDetalle:Object[]){
			//si en caso se quiere enviar mas de un objeto
			//let data=JSON.stringify({ Album: tramiteMov, User: tramiteMov, UserToken: tramiteMov })
			return this.http.post(this.baseUrl2+ "save/", rutaDetalle) // ...using post request
							.map((res:Response) => res.json()) // ...and calling .json() on the response to return data
							.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
		}
		
		// this could also be a private method of the component class
		handleError (error: any) {
			// log error
			// could be something more sofisticated
			let errorMsg = error.message;// || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
			console.error(errorMsg);

			// throw an application level error
			return Observable.throw(errorMsg);
		}
}