import { Component,OnInit, EventEmitter, Input, Output} from '@angular/core';
import { DoCheck } from '@angular/core';
//import {AuthGuard} from './components/auth.guard';
import {GlobalVars} from 'app/variables';
//import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';


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
    //alert(this.dataUser);
    this.iniciarVarGlobals(this.dataUser);
  }

  /*ngDoCheck(){
    console.log('si detecta cambios');
  }*/
  
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

   showUserName(event){
      alert(event.nombres);
   }
}



