import { Component,OnInit } from '@angular/core';
//import {AuthGuard} from './components/auth.guard';
import {GlobalVars} from 'app/variables';


declare var $:any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  public ocNavBar:boolean;
  private dataUser:any;
  private userid:number;
  private emid:number;
  private nombre:string;

  ngOnInit(){
    this.iniciarVarGlobals(this.dataUser);
  }
  
  constructor(public ClassGlobal:GlobalVars){
      this.dataUser=this.ClassGlobal.GetDatosUsuario();
  }

  iniciarVarGlobals(dataUser:any){
    if(dataUser!=null || dataUser!=undefined){
      this.nombre=this.dataUser.PeNombres;
      this.userid=this.ClassGlobal.GetUsId();
      this.emid=this.ClassGlobal.GetEmId();
    }
  }

   
}



