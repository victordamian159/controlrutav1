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

    //VARIABLES
    private value = '';
    private errorMessage:string='';  //mensaje error del rest
    private LoginUser:any;
    private userValid:any;
    public user:any={};
    private inicioSesion:number;
    private mnjeSesionCorrect:string;
    private mnjeSesionError:string;

    

    ngOnInit(){
        this.procNuevoUser();
        this.logout();
        /*console.log(localStorage.getItem('DATOSUSER'));*/
    }

    constructor(private userservice: UserSystemService, private router: Router,private appcomp:AppComponent){
   
        this.mnjeSesionCorrect='';
        this.mnjeSesionError='';
        this.inicioSesion=1;
        this.LoginUser={Usuario:"",Password:""};
        this.user={UsUserName:"",UsPassword:""};
    }

    // CALLING PROCEDURES 
        procNuevoUser(){
            let nuevoUser:any;
            this.userservice.newUserSystem().subscribe(
                data => {this.user=data; }
            );
        }

        /*  NO FUNCIONA
        procAutenticar(user:Object){
            let validUser:any;
            this.userservice.autenticacion(user).subscribe(
                data => { console.log(data);},
                error => {this.errorMessage=error;}
            );
        }*/

    
        procAutenticar(user:Object){
            let validUser:any[]=[];
            this.userservice.autenticacion(user).subscribe(
                data => {   
                            console.log(data);
                            validUser=data;     
                            if(validUser.length!=0){
                                this.userValid=validUser;
                                
                                localStorage.removeItem('DATOSUSER');
                                localStorage.setItem('DATOSUSER',JSON.stringify(validUser));
                                localStorage.getItem('DATOSUSER');

                                this.router.navigate(['/regempper']);
                                this.appcomp.ocNavBar=true;
                            }else{
                                this.userValid=validUser;
                                this.mnjeSesionError="Error en el usuario o contraseña";
                                this.inicioSesion=0;
                            }
                        },
                error => {this.errorMessage=error;}
            );
        }
        
    
    /* FUNCIONES */
    
        //onEnter(value: string) { this.value = value; }
        enterDataUser(username:string, password:string){
            //console.log(username);  console.log(password);
            this.user.UsUserName=username;
            this.user.UsPassword=password;
            
            this.procAutenticar(this.user); 
        }

        login(){
            this.user={
                UsUserName:this.LoginUser.Usuario,
                UsPassword:this.LoginUser.Password
            };
            //this.user.UsUserName=this.LoginUser.Usuario;
            //this.user.UsPassword=this.LoginUser.Password;
            //console.log(this.user);
            
            this.procAutenticar(this.user); 
            //this.appcomp.ocNavBar=true; console.log(this.appcomp.ocNavBar);
        }

        logout(){
            localStorage.removeItem('DATOSUSER');
        }
}