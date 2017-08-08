import {Component, OnInit} from '@angular/core';
import {UserSystemService} from '../service/usuarioSistema.service';

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
    public user:any={};

    constructor(private userservice: UserSystemService){}

    ngOnInit(){
        this.procNuevoUser();
        this.logout();
        console.log(localStorage.getItem('DATOSUSER'));
    }
    procNuevoUser(){
        let nuevoUser:any;
        this.userservice.newUserSystem().subscribe(
            data => {this.user=data; console.log(this.user);}
        );
    }

    login(){
        this.user.UsUserName=this.LoginUser.Usuario;
        this.user.UsPassword=this.LoginUser.Password;
        this.procAutenticar(this.user);
    }

    logout(){
        localStorage.removeItem('DATOSUSER');
    }

    procAutenticar(user:Object){
        let validUser:any;
        this.userservice.autenticacion(user).subscribe(
            data => {   validUser=data; 
                        if(validUser.length!=0){
                            console.log("si c:");
                            localStorage.setItem('DATOSUSER',JSON.stringify(validUser));
                            
                        }else{
                            console.log("no :c");
                        }
                    },
            error => {this.errorMessage=error;}
        );
    }
}