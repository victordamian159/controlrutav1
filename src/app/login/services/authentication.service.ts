import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    /* SERVICIO DE LOGIN*/
    login(username: string, password: string) {
        return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
                .map((response: Response) => {
                    /* -> login successful if there's a jwt token in the response ,
                       -> Inicio de sesión con éxito si hay un token jwt en la respuesta*/
                    let user = response.json();

                    /*console.log(user);
                    console.log(user.token);*/

                    if (user && user.token) {
                        /*  -> store user details and jwt token in local storage to 
                            keep user logged in between page refreshes
                            
                            -> almacena los detalles del usuario y el token jwt en el almacenamiento local para mantener al 
                            usuario conectado entre actualizaciones de página      */
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    }
                });
                
    }

    /* SERVICIO DE LOGOUT*/
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}