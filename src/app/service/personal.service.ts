import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
/*import {URLSearchParams} from '@angular/http';*/
import {Observable} from 'rxjs';

@Injectable()

export class PersService{
    private baseUrl: string = 'http://controlbus-ronaldmam.rhcloud.com/rest/persona/';
    constructor(private http: Http) { }

    /* CONSULTA TODAS LAS PERSONAS */
        getallpersonal(){
            return this.http
                    .get(this.baseUrl) 
                    .map((r: Response) => r.json() )             
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
        }
    /* CONSULTA PERSONA POR SU ID */
        getPersonaById(PeId:number){
            return this.http
                .get(this.baseUrl+ PeId )
                .map((r: Response) => r.json() )
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
        }	
    /* NUEVO */
        newPersona(){
            return this.http
                .get(this.baseUrl+ 'new')
                .map((r: Response) => r.json() )
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
        }
    /* GUARDAR */
        savePersona(persona:Object){
            return this.http.post(this.baseUrl+ "save/", persona)
                            .map((res:Response) => res.json()) 
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
        }
    /* ELIMINAR */
        deletePersona(id:number){
            return this.http.delete(this.baseUrl+"delete/"+id) 
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
        }


    /* ERROR */
    handleError (error: any) {
		let errorMsg = error.message;
		return Observable.throw(errorMsg);
	}
}