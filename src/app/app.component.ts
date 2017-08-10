import { Component,OnInit } from '@angular/core';
//import {AuthGuard} from './components/auth.guard';
import {GlobalVars} from 'app/variables'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /*heroImageUrl:string='./src/icons/Transport-Bus-icon (1).png'; title:'menu';*/
  public ocNavBar:boolean;
  private dataUser:any;

  ngOnInit(){
    //this.ocultarNavBar();
  }
  constructor(public varGlobal:GlobalVars){
    this.ocNavBar=false;
    this.dataUser=JSON.parse(localStorage.getItem('DATOSUSER'));
  }

  ocultarNavBar(){
    if(this.dataUser!=null || this.dataUser!=undefined){
      this.ocNavBar=false;
    }else if(this.dataUser==null || this.dataUser==undefined ){
      this.ocNavBar=true;
    }
  }

}

