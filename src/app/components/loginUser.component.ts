import {Component, OnInit} from '@angular/core';
import {UserSystemService} from '../service/usuarioSistema.service';
import { AppComponent } from '../app.component';
import { Router} from '@angular/router';
//import {AuthGuard} from '../components/auth.guard';


@Component({
    selector: 'app-loginuser',
    templateUrl:'../views/loginUser.component.html',
    /*styleUrls:['./styles.css']*/
    styleUrls:['../styles/loginUser.component.css'] 
})

export class loginUserComponent implements OnInit{
    private errorMessage:string='';  //mensaje error del rest
    private LoginUser:any={
        Usuario:"",
        Password:""
    };
    public userValid:any;
    public user:any={};

    constructor(private userservice: UserSystemService, private router: Router,private appcomp:AppComponent){}

    ngOnInit(){
        this.procNuevoUser();
        this.logout();
        /*console.log(localStorage.getItem('DATOSUSER'));*/
    }

    /* CALLING PROCEDURES */
        procNuevoUser(){
            let nuevoUser:any;
            this.userservice.newUserSystem().subscribe(
                data => {this.user=data; /*console.log(this.user);*/}
            );
        }

        procAutenticar(user:Object){
            let validUser:any;
            this.userservice.autenticacion(user).subscribe(
                data => {   validUser=data; 
                            if(validUser.length!=0){
                                console.log("se inicio sesion c:"); 
                                this.userValid=validUser;
                                localStorage.setItem('DATOSUSER',JSON.stringify(validUser));
                                localStorage.getItem('DATOSUSER');
                                this.router.navigate(['/regempper']);
                            }else{
                                console.log("no se pudo iniciar sesion :c");
                            }
                        },
                error => {this.errorMessage=error;}
            );
        }
    
    /* FUNCIONES */
    login(){
        this.user.UsUserName=this.LoginUser.Usuario;
        this.user.UsPassword=this.LoginUser.Password;
        this.procAutenticar(this.user); 
        this.appcomp.ocNavBar=true;
        console.log(this.appcomp.ocNavBar);
    }

    logout(){
        localStorage.removeItem('DATOSUSER');
    }
}