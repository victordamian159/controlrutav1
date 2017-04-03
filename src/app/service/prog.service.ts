import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()

export class ProgramacionService{
    private baseUrl   : string ='http://controlbus-ronaldmam.rhcloud.com/rest/programacion/';
    private baseUrl2  : string ='http://controlbus-ronaldmam.rhcloud.com/rest/programaciondetalle/';

    constructor (private http: Http){}

    //consultar por Id Empresa, Ruta Empresa
    getAllProgramacionByEm( emId: number, anio: number){
        return this.http        
            .get(this.baseUrl+"getallprogramacionbyem?emId="+emId+"&anio"+anio)
            .map((r:Response) => r.json())
            .catch(this.handleError);
    }

//PROGRAMACION MAESTRO
    getProgramacionById(PrId: number){
        return this.http
            .get(this.baseUrl+ PrId)
            .map((r:Response) => r.json())
            .catch( (error: any) => Observable.throw(error.json().error || 'server error'));
    }

    newProgramacion(){
        return this.http
            .get(this.baseUrl + 'new')
            .map( (r:Response) => r.json())
            .catch( (error:any) => Observable.throw(error.json().error || 'server error'));
    }

    saveProgramacion(programacionMaestro : Object){
        return this.http.post(this.baseUrl + "save/", programacionMaestro)
                .map( (res:Response) => res.json())
                .catch( (error:any) => Observable.throw(error.json().error || 'server error'));           
    }

    deleteProgramacionByid( id:number ){
        return this.http.delete(this.baseUrl + "delete/"+id)
                .map( (res:Response) => res.json())
                .catch( (error:any) => Observable.throw(error.json().error || 'server error'));
    }
//PROGRAMACION DETALLE

    //recuperar programacion por ID de programacion MAESTRO
    getAllProgramacionDetalleByPrId(PrId:number){
        return this.http
            .get(this.baseUrl2+'prid/'+PrId)
            .map( (r:Response) => r.json())
            .catch( (error:any) => Observable.throw(error.json.error || 'server error') );
    }
    //nueva programacion DETALLE
    newProgramacionDetalle(){
        return this.http   
            .get(this.baseUrl2+'new')
            .map( (r:Response) => r.json())
            .catch( (error:any) => Observable.throw(error.json.error || 'server error') );
    }
    //eliminar programacion DETALLE
    deleteProgramacionDetalleByPrId(PrId : number){
        return this.http.delete(this.baseUrl2 + "delete/prid/"+PrId)
            .map((res:Response) => res.json() )
            .catch((error:any) => Observable.throw(error.json().error || 'server error') );
    }
    //guardar programacion detalle
    saveProgramacionDetalle(programacionDetalle : Object){
        return this.http.post(this.baseUrl2+"save/", programacionDetalle)
            .map((res:Response) => res.json() )
            .catch((error:any) => Observable.throw(error.json().error || 'server error'));
    }

//ERROR
    handleError (error:any){
        let errorMsg = error.message;
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}