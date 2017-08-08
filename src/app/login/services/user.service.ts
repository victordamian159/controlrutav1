import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../user';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    getAll() { /* MOSTRAR TODOS*/
        return this.http.get('/api/users', this.jwt())
                        .map((response: Response) => response.json());
    }

    getById(id: number) { /*BUSCAR POR ID */
        return this.http.get('/api/users/' + id, this.jwt())
                        .map((response: Response) => response.json());
    }

    create(user: User) { /*CREAR USUARIO */
        return this.http.post('/api/users', user, this.jwt())
                            .map((response: Response) => response.json());
    }

    update(user: User) { /* ACTUALIZAR*/
        return this.http.put('/api/users/' + user.id, user, this.jwt())
                            .map((response: Response) => response.json());
    }

    delete(id: number) { /* ELIMINAR*/
        return this.http.delete('/api/users/' + id, 
                            this.jwt()).map((response: Response) => response.json());
    }

    /* private helper methods  FUNCION METODO AUXILIAR PRIVADO*/
    private jwt() {
        /* create authorization header with jwt token  ===>Crear el encabezado de autorización con jwt token     */
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

}