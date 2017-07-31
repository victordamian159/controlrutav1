import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()

export class EmpPerService{
    private baseUrl1: string='http://controlbus-ronaldmam.rhcloud.com/rest/empresa/';
    private baseUrl2: string='http://controlbus-ronaldmam.rhcloud.com/rest/persona/';
    //'http://controlbus-ronaldmam.rhcloud.com/rest/subempresa/emid/1'

    constructor(private http: Http){}

/* EMPRESA */
    /*  CONSULTA GRILLA EMP - PROVISIONAL */
    getAllEmpresaByEm(emid:number){
        return this.http
                .get(this.baseUrl1)
                .map((r:Response)=> r.json() )
                .catch(this.handleError);
    }

    /* PUEDE EDITAR SUS DATOS */
    saveEmpresa(emp : Object){
        return this.http.post(this.baseUrl1+ "save/", emp) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

/* SUBEMPRESA */
    /* CAPTURAR */
    /* NUEVO */
    /* GUARDAR */
    /* ELIMINAR */

/* PERSONA */
    /* CAPTURAR */
    /* NUEVO */
    /* GUARDAR */
    /* ELIMINAR */

/* ERROR */
	handleError (error: any) {let errorMsg = error.message; return Observable.throw(errorMsg);}
}