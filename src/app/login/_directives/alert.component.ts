/* ESTA ALERTA ES CUANDO EL USUARIO Y CONTRASEÑA NO EXISTE*/

import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';

@Component({
    moduleId: module.id.toString(),
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent {
    message: any;
    constructor(private alertService: AlertService){}
    ngOnInit() {
            /* devuelve un mensaje con el tipo de error que ocurre*/
        this.alertService.getMessage().subscribe
            (message => { this.message = message; console.log(this.message);});
    }
}

/* 
    message: si usuario es incorrecto manda el mensaje de alerta 
    manda igualmente un mensaje pero como undefined cuando sucede 
    algo en el login
*/        