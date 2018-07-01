import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions,URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';
import {url_programacionbase} from 'app/urls';
@Injectable()

export class ProgBaseService{
    private baseUrl=url_programacionbase;
    constructor (private http: Http){}
    //consulta todas las programaciones base por emid
    getAllProgramacionBaseByEm( EmId: number, Anio: number){
        return this.http        
            .get(this.baseUrl+"getallprogramacionbasebyem?emId="+EmId+"&anio="+Anio)
            .map((r:Response) => r.json())
            .catch(this.handleError);
    }

    /* programacion base por id */
    getProgBaseById(PrBaId: number){
        return this.http
            .get(this.baseUrl+ PrBaId)
            .map((r:Response) => r.json())
            .catch( (error: any) => Observable.throw(error.json().error || 'server error'));
    }

    //guardar
    saveProgBase(objProgBase : Object){
        return this.http.post(this.baseUrl + "save/", objProgBase)
                .map( (res:Response) => res.json())
                .catch( (error:any) => Observable.throw(error.json().error || 'server error'));           
    }
    //eliminar
    deleteProgBaseById( PrBaId:number ){
        return this.http.delete(this.baseUrl + PrBaId)
                .map( (res:Response) => res.json())
                .catch( (error:any) => Observable.throw(error.json().error || 'server error'));
    }
    //nuevo
    newProgBase(){
        return this.http
            .get(this.baseUrl + 'new')
            .map( (r:Response) => r.json())
            .catch( (error:any) => Observable.throw(error.json().error || 'server error'));
    }

    handleError (error:any){
        let errorMsg = error.message;
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}