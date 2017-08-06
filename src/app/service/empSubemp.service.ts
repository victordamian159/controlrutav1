import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()

export class EmpSubEmpService{
    private baseUrl1: string = 'http://controlbus-ronaldmam.rhcloud.com/rest/empresa/';
	private baseUrl2: string = 'http://controlbus-ronaldmam.rhcloud.com/rest/subempresa/';
    constructor (private http: Http){}

    /* EMPRESA */
        /* CONSULTA TODAS LAS EMPRESAS */
            getallempresas(){
                return this.http
                    .get(this.baseUrl1)
                    .map((r: Response) => r.json())
                    .catch(this.handleError);
            }

        /* CONSULTA EMPRESA POR SU ID*/
            getallempresabyemid(emId : number){
                return this.http
                    .get(this.baseUrl1+ emId)
                    .map((r: Response) => r.json())
                    .catch(this.handleError);
            }
        
        /* NUEVO */
            newEmpresa(){
                return this.http
                .get(this.baseUrl1+'new')
                .map((r: Response) => r.json() )
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
            }

        /* GUARDAR EDITA - EMPRESA */
            saveEmpresa(emp:Object){
                return this.http.post(this.baseUrl1+ "save/", emp) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }

        /* ELIMINAR REG EMPRESA*/
            deleteEmpresa(emid:number){
                return this.http.delete(this.baseUrl1+emid) // ...using post request
                                .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                                .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
            }

    /* SUBEMPRESA */    
        /* CONSULTA TODAS SUBEMPRESA POR EMID */
            getallsubempresasbyemid(emId:number){
                return this.http    
                    .get(this.baseUrl2+'emid/'+emId)
                    .map((r: Response) => r.json())
                    .catch(this.handleError);
            }

        /* BUSCAR SUEMPRESA POR SUEMID */
            getsubempbysuemid(suemid:number){
                return this.http
                    .get(this.baseUrl2+suemid)
                    .map((r: Response) => r.json())
                    .catch(this.handleError);
            }

        /* NUEVO */
            newSubempresa(){
                return this.http
                .get(this.baseUrl2+'new')
                .map((r: Response) => r.json() )
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
            }
        /* GUARDAR */
            saveSubEmpresa(subempresa:Object){
                return this.http.post(this.baseUrl2+ "save/", subempresa) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }
        /* ELIMINAR */
            deleteSubEmpresa(suemid:number){
                return this.http.delete(this.baseUrl2+"delete/"+suemid) // ...using post request
                                .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                                .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
            }
    handleError (error: any) {
		let errorMsg = error.message;
		return Observable.throw(errorMsg);
	}
}