import { Component,OnInit } from '@angular/core';
//import {AuthGuard} from './components/auth.guard';
import {GlobalVars} from 'app/variables';

/*import {DatosCompartidosService} from './service/dataComunicationApp.service';
import {ConfiguraService} from './service/configura.service';*/
declare var $:any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /*heroImageUrl:string='./src/icons/Transport-Bus-icon (1).png'; title:'menu';*/
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
      //console.log(this.nombre); console.log(this.userid);  console.log(this.emid);
    }
  }

    /*//consulta por periodos
    procConsultarConfiguracionSistemaXPeriodo(){
        let añoActual=new Date().getFullYear().toString(), EmId=this.emid;
        //console.log(añoActual); console.log(EmId);
        this.configService.getAllConfiguraByEmPeriodo(EmId , añoActual).subscribe(
        data=>{
                console.log(data); 
                if(data.length!=0){
                    this.addDataGlobalFunction(data);
                }else{
                    alert('error, no se pudo descargar la configuracion del sistema');
                }
                
                },
        error=>{alert('error al iniciar el periodo: '+error);},
        ()=>{}
        );
    }

    addDataGlobalFunction(data):void{
        this.DatosAppGlobal.compartirDatosGlobal(data);
    }*/
}



  /*
    this.ocNavBar=false;
    this.dataUser=JSON.parse(localStorage.getItem('DATOSUSER'));

    ocultarNavBar(){
      if(this.dataUser!=null || this.dataUser!=undefined){
        this.ocNavBar=false;
      }else if(this.dataUser==null || this.dataUser==undefined ){
        this.ocNavBar=true;
      }
    }
  */

