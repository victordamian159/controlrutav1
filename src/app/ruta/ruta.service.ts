import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()

export class RutaService{
    private baseUrl: string = 'http://controlbus-controlbus.44fs.preview.openshiftapps.com/bus/rest/ruta';
    private baseUrl2: string = 'http://controlbus-controlbus.44fs.preview.openshiftapps.com/bus/rest/rutadetalle/new';
    constructor(private http: Http){}

    getAllRutaByEm(emId: number){
        return this.http
            .get(this.baseUrl)
            .map( (r:Response) => r.json())
            .catch(this.handleError);
            
    }
    
    getRutaById(ruId:number){
        return this.http
            .get(this.baseUrl + ruId)
            .map( (r:Response) => r.json())
            .catch( (error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    newRuta(){
        return this.http
            .get( this.baseUrl + 'new')
            .map( (r:Response) => r.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    saveRuta(ruta:Object){
        return this.http.post(this.baseUrl + "save", ruta)
                        .map((res:Response) => res.json())
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    
    deleteRuta(id:number){
        return this.http.delete(this.baseUrl+ "delete/" + id)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    //ruta detalle
    getAllRutaDetalleByRu(ruId:number){
        return this.http
            .get(this.baseUrl2 + 'ruid/' + ruId)
            .map((r:Response) => r.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    newRutaDetalle(){
        return this.http  
            .get(this.baseUrl2 + 'new')
            .map((r:Response) => r.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    deleteRutaDetalleByRu(ruId:number){
        return this.http.delete(this.baseUrl2 + "delete/ruid/" + ruId)
                    .map((res:Response) => res.json())
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    saveRutaDetalle(rutaDetalle:Object[]){
        return this.http.post(this.baseUrl2 + "save", rutaDetalle)
                .map((res:Response) => res.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    handleError (error: any){
        let errorMsg=error.message;
        console.log(errorMsg);
        return Observable.throw(errorMsg);
    }
}