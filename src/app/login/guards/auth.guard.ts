import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }
    
    /* canActivate:  Interfaz de que una clase puede implementar para ser un guardia de decidir si una ruta puede ser activado.*/
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        /* SI ESTA CARGADO UN USUARIO CORRECTAMENTE TERMINA*/
        if (localStorage.getItem('currentUser')) {
            /* 
                ->  logged in so return true
                ->  retorna verdadero si se inicia sesion correctamente (usuario)
                ->  si se logra conectar entonces returna  true(verdadero)
            */
            console.log("inicio correctamente sesion =D");
            /*console.log(localStorage.getItem('currentUser'));    Datos devueltos del usuario y almacenados en memoria*/
            return true; /* TERMINA LA FUNCION Y DEVUELVE VERDADERO*/
        }

        /* 
            not logged in so redirect to login page with the return url
            No ha iniciado sesión así que redirigir a la página de inicio 
            de sesión con la URL de retorno
        */

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        console.log("no inicio correctamente sesion )=");
        console.log(state.url);
        return false; /* TERMINA LA FUNCION Y DEVUELVE FALSO*/
    }

    /*canActivate: devuelve verdadero o falso para dar permiso o no */
}