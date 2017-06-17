/**
 * Created by xavi on 5/16/17.
 */
import {Component} from "@angular/core";
/*Validators: validar los datos de los inputs, 
  FormBuilder: proporciona la funcionalidad necesaria para 
               hacer y construir validaciones sencillas */
import {Validators, FormGroup, FormBuilder} from "@angular/forms"; 
import {Router} from "@angular/router";
import {LoginObject} from "./shared/login-object.model"; /* INSTANCIANDO MODELO LOGIN USUARIO*/
import {AuthenticationService} from "./shared/authentication.service";
import {StorageService} from "../core/services/storage.service";
import {Session} from "../core/models/session.model";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})

export class LoginComponent {
  public loginForm: FormGroup;  /* VARIABLE DEL FORMULARIO  [formGroup]="loginForm" */
  public submitted: Boolean = false;
  public error: {code: number, message: string} = null;

  constructor(
      private formBuilder: FormBuilder, /* INPUTS CON REQUERIR LA VALIDACION */
      private authenticationService: AuthenticationService,
      private storageService: StorageService,
      private router: Router /*USADO PARA ENRUTAR AL FORM HOME DESPUES DE HABERSE AUTHENTICADO */) { }

  ngOnInit() {
      /* VALIDANDO DATOS INGRESADOS POR LOS INPUTS, loginForm: objeto de la clase FormGroup*/
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      })
  }

  /* (ngSubmit)="submitLogin()" */
  public submitLogin(): void {
      this.submitted = true; /* ENVIADO */
      this.error = null;
      console.log(this.loginForm);
      console.log(this.loginForm.valid);
      /*
          -> console.log("this.loginForm.valid:  "+this.loginForm.valid);
          -> devuelve true cuando ambos inputs estan llenos,
          -> devuelve false cuando uno o ambos inputs estan vacios
      */
      if(this.loginForm.valid){
          /* MANDANDO AL SERVICIO DE AUTHENTICACION, this.authenticationService.login DEVUELVE UN OBSERVABLE DEL TIPO SESION */
          this.authenticationService.login( new LoginObject(this.loginForm.value) ).subscribe(
          data => this.correctLogin(data), /*SI ES VALIDO LLAMA A LA FUNCION correctLogin() */
            error => this.error = JSON.parse(error._body) /*CAPTURANDO EL ERROR EN FORMATO JSON */
          )
      }
  }

  /* GUARDANDO EL USUARIO EN EL SERVICIO STORAGESERVICE Y ENRUTANDO AL FORMULARIO HOME*/
  private correctLogin(data: Session){
    console.log(data); /*data contiene el token y todos los datos de la clase usuario */
    this.storageService.setCurrentSession(data); /* guardando los datos en servicio de almacenamiento*/
    this.router.navigate(['/home']);
  }
}


/* 
  PROCESOS DEL COMPONENTE
  ->Primero envia el 
*/