import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_registrodiario, url_registrodiariodetalle} from 'app/urls';

@Injectable()

export class RegDiarioService{
    private baseUrl=url_registrodiario;
    private baseUrl2=url_registrodiariodetalle;
    constructor (private http: Http){}
    //GET ALL
    //consultar por Id Empresa, Ruta Empresa (mostrar en la grilla)
    getAllRegistroDiarionByemId( emId: number){
        return this.http        
            .get(this.baseUrl+"getallregistrodiariobyem?emId="+emId)
            .map((r:Response) => r.json())
            .catch(this.handleError);
    }
//CABECERA
        /* BUSCAR PROGRAMACION CABECERA POR SU ID */
        getregistrodiarioById(ReDiId: number){
            return this.http
                .get(this.baseUrl+ ReDiId)
                .map((r:Response) => r.json())
                .catch( (error: any) => Observable.throw(error.json().error || 'server error'));
        }
        /* NUEVA registrodiario CABECERA */
        newregistrodiario(){
            return this.http
                .get(this.baseUrl + 'new')
                .map( (r:Response) => r.json())
                .catch( (error:any) => Observable.throw(error.json().error || 'server error'));
        }

        saveregistrodiario(regdiario : Object){
            return this.http.post(this.baseUrl + "save/", regdiario)
                    .map( (res:Response) => res.json())
                    .catch( (error:any) => Observable.throw(error.json().error || 'server error'));           
        }

        deleteregistrodiarioByid( ReDiId:number ){
            return this.http.delete(this.baseUrl + ReDiId)
                    .map( (res:Response) => res.json())
                    .catch( (error:any) => Observable.throw(error.json().error || 'server error'));
        }
//DETALLE
        //recuperar registrodiarioDETALLE por ID de registrodiario MAESTRO
        getAllregistrodiarioDetalleByPrId(reDiId:number){
            return this.http
                .get(this.baseUrl2+'getallregistrodiariodetallebyredi?reDiId='+reDiId)
                .map( (r:Response) => r.json())
                .catch( (error:any) => Observable.throw(error.json.error || 'server error') );
        }

        /* BUSCAR PROGRAMACION CABECERA POR SU ID */
        getRegistroDiarioDetalleById(reDiDeId: number){
            return this.http
                .get(this.baseUrl+ reDiDeId)
                .map((r:Response) => r.json())
                .catch( (error: any) => Observable.throw(error.json().error || 'server error'));
        }
        saveRegistroDiarioDetalle(regDiarioDet : Object){
            return this.http.post(this.baseUrl + "save/", regDiarioDet)
                    .map( (res:Response) => res.json())
                    .catch( (error:any) => Observable.throw(error.json().error || 'server error'));           
        }
        //nueva registrodiario DETALLE
        newregistrodiarioDetalle(){
            return this.http   
                .get(this.baseUrl2+'new')
                .map( (r:Response) => r.json())
                .catch( (error:any) => Observable.throw(error.json.error || 'server error') );
        }
        //eliminar registrodiario DETALLE
        deleteregistrodiarioDetalleByPrId(PrId : number){
            return this.http.delete(this.baseUrl2 + "delete/prid/"+PrId)
                .map((res:Response) => res.json() )
                .catch((error:any) => Observable.throw(error.json().error || 'server error') );
        }

       

//ERROR
    handleError (error:any){
        let errorMsg = error.message;
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}