import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService} from '../services/alert.service'; /*LLAMANDO SERVICIO ALERT */
import {AuthenticationService} from '../services/authentication.service'; /*LLAMANDO SERVICIO AUTENTICACION */

@Component({
    moduleId: module.id.toString(),
    templateUrl: '_login.component.html',
    styleUrls: ['_login.component.css']
}) 

export class LoginComponent implements OnInit {
    model: any = {}; /* OBJETO USUARIO*/
    loading = false;
    returnUrl: string; /*RETORNANDO URL */
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) { }

    ngOnInit() {

        /* reset login status      --  Restablecer el estado de inicio de sesión*/
        this.authenticationService.logout();/*DESCONECTANDO ANTES DE INICIAR UNA SESION */

        /* get return url from route parameters or default to '/'
        ===>  Obtener url de retorno de los parámetros de ruta o predeterminado para '/'  */
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/menu';
    }

    login() {
        this.loading = true; /* CARGANDO EN VERDAD*/
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => { this.router.navigate([this.returnUrl]); }, /* SI NO HAY ERROR PASA A DATA */
                error => {this.alertService.error(error); this.loading = false; console.log(error);} /* SI HAY ERROR MANDA AL SERVICIO DE ALERTA DE TIPO ERROR */
            );
    }

}
