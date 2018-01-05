import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {url_usuario} from 'app/urls';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import { classDataUsuario } from '../DataUsuario';
@Injectable()

export class UserSystemService{
   private baseUrl1=url_usuario;
 
    constructor (private http: Http){}
       
            getAllUserSystembyEmId(EmId:number){
                return this.http
                    .get(this.baseUrl1+'getallusuariobyem?emId='+EmId)
                    .map((r: Response) => r.json() )
                    .catch(this.handleError);
            }

            getUserSystembyUsId(UsId : number){
                return this.http
                    .get(this.baseUrl1+ UsId)
                    .map((r: Response) => r.json())
                    .catch(this.handleError);
            }
        
            newUserSystem(){
                return this.http
                .get(this.baseUrl1+'new')
                .map((r: Response) =>{r.json();} )
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
            }

     
            saveUserSystem(objUser:Object){
                return this.http.post(this.baseUrl1+ "save/", objUser) // ...using post request
                    .map((r:Response) => {r.json();}) // ...and calling .json() on the response to return data
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }

            deleteUserSystem(UsId:number){
                return this.http.delete(this.baseUrl1+UsId) // ...using post request
                    .map((r:Response) => {r.json();}) // ...and calling .json() on the response to return data
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
            }

            //AUTHENTICACION DE USUARIO (LOGIN) 
            /*autenticacion(objLogin:Object):any{
                return this.http.post(this.baseUrl1+"authenticate/",objLogin)
                    .map(
                            (r:Response) => { r.json();}
                        ) 
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }*/
            autenticacion(objLogin:Object){
                return this.http.post(this.baseUrl1+"authenticate/",objLogin)
                    .map(this.extractData) 
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
            }
    
        private extractData(res: Response) {
            let body = res.json(), result:any;
            result=body[0];
            console.log(result);
            return result || [];
        }

    handleError (error: any) {
        let errorMsg = error.message;
        return Observable.throw(errorMsg);
    }
}
