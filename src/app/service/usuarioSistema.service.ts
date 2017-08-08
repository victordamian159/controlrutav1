import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()

export class UserSystemService{
    private baseUrl1: string = 'http://controlbus-ronaldmam.rhcloud.com/rest/usuario/';
    /* http://controlbus-ronaldmam.rhcloud.com/rest/usuario/getallusuariobyem?emId=1 */
    constructor (private http: Http){}
        /* CONSULTA TODAS LOS USUARIO */
            getAllUserSystembyEmId(EmId:number){
                return this.http
                    .get(this.baseUrl1+'getallusuariobyem?emId='+EmId)
                    .map((r: Response) => r.json())
                    .catch(this.handleError);
            }

        /* CONSULTA USUARIO POR SU ID*/
            getUserSystembyUsId(UsId : number){
                return this.http
                    .get(this.baseUrl1+ UsId)
                    .map((r: Response) => r.json())
                    .catch(this.handleError);
            }
        
        /* NUEVO USUARIO */
            newUserSystem(){
                return this.http
                .get(this.baseUrl1+'new')
                .map((r: Response) => r.json() )
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
            }

        /* GUARDAR EDITA - USUARIO */
            saveUserSystem(objUser:Object){
                return this.http.post(this.baseUrl1+ "save/", objUser) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }

        /* ELIMINAR REG USUARIO*/
            deleteUserSystem(UsId:number){
                return this.http.delete(this.baseUrl1+UsId) // ...using post request
                                .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                                .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
            }

        /* AUTHENTICACION DE USUARIO (LOGIN) */
            autenticacion(objLogin:Object){
                return this.http.post(this.baseUrl1+"authenticate/",objLogin) // ...using post request
                          /* ...and calling .json() on the response to return data*/
                         .map((res:Response) =>    res.json()
                                                    /*let user= res.json();
                                                    console.log(user);*/
                          ) 
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }

    handleError (error: any) {
        let errorMsg = error.message;
        return Observable.throw(errorMsg);
    }
}