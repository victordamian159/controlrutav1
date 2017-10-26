import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';
import {url_empresapersona} from 'app/urls';

@Injectable()

export class EmpPerService{
    //private baseUrl1: string='http://controlbus-ronaldmam.rhcloud.com/rest/empresapersona/';
    private baseUrl1: string='http://controlbus-controlbus.1d35.starter-us-east-1.openshiftapps.com/bus/rest/empresapersona/';
    constructor(private http: Http){}

/* EMPRESAPERSONA */
    /* CAPTURAR */
        getallempperbyemidsuemid(emid:number, suemid:number){
            return this.http
                .get(this.baseUrl1+"getallpersonabyemsuem?emId="+emid+"&suEmId="+suemid)
                .map((r:Response) => r.json() )
                .catch(this.handleError);
        }

    /* GET EMPRESAPERSONA POR SU ID (EMPEID) */    
        getEmpPerById(empeid:number){
            return this.http
                .get(this.baseUrl1+empeid)
                .map((r:Response) => r.json() )
                .catch(this.handleError);
        }

    /* NUEVO */
        newEmpresaPersona(){
            return this.http
			.get(this.baseUrl1+'new')
			.map((r: Response) => r.json() )
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
        }
    /* GUARDAR */
        saveEmpresaPersona(empPer:Object){
		return this.http.post(this.baseUrl1+"save/",empPer) 
                         .map((res:Response) => res.json()) 
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
    /* ELIMINAR */
        deleteEmpresaPersona(id:number){
            return this.http.delete(this.baseUrl1+id) 
                .map((res:Response) => res.json()) 
                .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
	    }

/* ERROR */
	handleError (error: any) {let errorMsg = error.message; return Observable.throw(errorMsg);}
}



/* EMPRESA */
    /*  CONSULTA GRILLA EMP - PROVISIONAL 
    getAllEmpresaByEm(emid:number){
        return this.http
                .get(this.baseUrl1)
                .map((r:Response)=> r.json() )
                .catch(this.handleError);
    }*/

    /* PUEDE EDITAR SUS DATOS 
    saveEmpresa(emp : Object){
        return this.http.post(this.baseUrl1+ "save/", emp) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }*/