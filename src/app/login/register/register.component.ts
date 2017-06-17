import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService} from '../services/alert.service'; /* PARA MANDAR LAS ALERTAR */
import {UserService} from '../services/user.service'; /* SABER SI EL USUARIO ES CORRECTO */

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService, /* SERVICIO DE USUARIO */
        private alertService: AlertService /* SERVICIO DE ALERTA */
        ) { }

    register() {
        /*this.loading = false;*/
        this.loading = true; console.log("1.- this.loading: "+this.loading);

        /*USANDO SERVICIO DE USUARIO, LLAMANDO AL SERVICIO CREAR USUARIO */
        this.userService.create(this.model)
            .subscribe(
                data => {
                    /*  SE CREA UN REGISTRO DE FORMA CORRECTA*/  /*this.alertService.success('Registration successful', true);*/
                    this.alertService.success('Se Registro Correctamente', true);
                    this.router.navigate(['/login']);
                },
                error => { /* EN CASO DE UN ERROR LLAMA AL SERVICIO DE ALERTA*/
                    this.alertService.error(error);
                    /*SE MANDA EL ERROR AL SERVICIO DE ALERTA*/
                    console.log("2.- this.loading: "+this.loading);
                    this.loading = false;
                });
    }
}
