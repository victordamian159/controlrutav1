import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

/*  El servicio de alerta permite a cualquier componente de la 
    aplicación para mostrar mensajes de alerta en la parte superior 
    de la página a través del componente de alerta. */

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    /* keepAfterNavigationChange: Después de mantener(GUARDAR) el cambio de navegación*/
    private keepAfterNavigationChange = false; 

    constructor(private router: Router) {
        // clear alert message on route change 
        /* LIMPIAR EL MENSAJE DE ALERTA SOBRE CAMBIO DE ENRUTADO*/
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    /*  ->  si keepAfterNavigationChange == true
                        ->  only keep for a single location change
                        ->  sólo se mantendrá(GUARDARA) durante un solo cambio de ubicación*/
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    /* ALERTA SATISFACTORIA ----EN EL CASO DE QUE SE REGISTRE CORRECTAMENTE*/
    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        console.log(this.subject);
        this.subject.next({ type: 'success', text: message });
    }

    /* ALERTA ERROR  CUANDO NO SE LOGEA CORRECTAMENTE*/
    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
         /* SIGUIENTE SUJETO ES UN MENSAJE DE ERROR*/
         console.log(this.subject);
        this.subject.next({ type: 'error', text: message });
    }

    getMessage(): Observable<any> {
        /*DEVUELVE UN OBSERVABLE PARA EL MENSAJE*/
        console.log(this.subject);
        console.log(this.subject.asObservable());
        return this.subject.asObservable();
    }
}