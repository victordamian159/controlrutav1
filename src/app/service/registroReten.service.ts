import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_registroreten} from 'app/urls';

@Injectable()

export class RegRetenService{
    private baseUrl=url_registroreten;

    constructor (private http: Http){}
    //GETTERS
        //consultar por Id Empresa, Ruta Empresa (mostrar en la grilla)
        getAllRegistroRetenByemId( reDiDeId: number){
            return this.http        
                .get(this.baseUrl+"getallregistroretenbyredide?reDiDeId="+reDiDeId)
                .map((r:Response) => r.json())
                .catch(this.handleError);
        }
        getRegistroRetenById(ReReId:number){
            return this.http
                .get(this.baseUrl+ ReReId)
                .map((r:Response) => r.json())
                .catch( (error: any) => Observable.throw(error.json().error || 'server error'));
        }
    //MANTENIMIENTO
        //save
            saveregistroReten(regReten : Object){
                return this.http.post(this.baseUrl + "save/", regReten)
                        .map( (res:Response) => res.json())
                        .catch( (error:any) => Observable.throw(error.json().error || 'server error'));           
            }
        //new
            newregistroReten(){
                return this.http
                    .get(this.baseUrl + 'new')
                    .map( (r:Response) => r.json())
                    .catch( (error:any) => Observable.throw(error.json().error || 'server error'));
            }
        //delete
            deleteregistroRetenByid( ReReId:number ){
                return this.http.delete(this.baseUrl + ReReId)
                        .map( (res:Response) => res.json())
                        .catch( (error:any) => Observable.throw(error.json().error || 'server error'));
            }
    //ERROR
    handleError (error:any){
        let errorMsg = error.message;
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}