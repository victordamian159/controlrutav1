import {Component, OnInit} from '@angular/core';
import {GlobalVars} from 'app/variables'
import {editf1,fechaActual1,fechaActual2, _fecha1, _hora, fecha, hora,guion_slash_inver, arrABI} from 'app/funciones';
import {RegDiarioService} from '../service/registrodiario.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {ConfiguraService} from '../service/configura.service';

/*import {ISubscription} from 'rxjs/Subscription';
import {ConfiguraService} from '../service/configura.service';*/

@Component({
    selector: 'app-rgdcontrol',
    templateUrl:'../views/registrodiario.component.html',
    /*styleUrls:['./styles.css']*/
    styleUrls:['../styles/registrodiario.component.css'] 
})

export class RegistroDiarioComponent implements OnInit{
      
        //variables
            //display modal
                private displayNuevoRegistroDiario:boolean;
                private displayConfDelRegDiario:boolean;
                private displayErrorMismaFecha:boolean;
                private displayRegDiarioDetalle:boolean;
                private displayProcesoGuardando:boolean;
                private displayErrorGuardar:boolean;
                private displayOrdenSubEmpresas:boolean;

            //number
                private nTolVueltas:number;
                private emid:number;
                private userid:number;
                private ReDiId:number;
                private CoSiId:number;
            //string 
                private ReDiHoraInicioDiario:string;
                private fechRegDir:string;
                private mensajevalidacion:string;
                private mensaje:string;
                private ordenSuEmId:string;

            //any(objeto)
                private objConfig:any;

            //boolean disabled hidden
                private disBtnSaveAllSuEm:boolean;
        //arrays
            private arrRegDiarioByEmId:any[];
            private arrRegDiarioDetalleByEmId:any[];
            private arrEtdRegDiario:any[];
            private arrSubEmp:any[];
            private selectedSubEmp:any[];
            private data:any;
        //function init
        ngOnInit(){
            this.getAllRegistroDiarionByemId(this.emid);
        }

        //constructor
        constructor(private registrodiarioservice:RegDiarioService, 
                    private empsubempservice:EmpSubEmpService,
                    private configService : ConfiguraService,
                    public ClassGlobal:GlobalVars){
          
            this.emid=this.ClassGlobal.GetEmId();
            this.userid=this.ClassGlobal.GetUsId();
    
            this.arrRegDiarioByEmId=[];
            this.arrRegDiarioDetalleByEmId=[];
            this.arrSubEmp=[];
            this.selectedSubEmp=[];

            this.displayNuevoRegistroDiario=false;
            this.displayConfDelRegDiario=false;
            this.displayErrorMismaFecha=false;
            this.displayRegDiarioDetalle=false;
            this.displayProcesoGuardando=false;
            this.displayErrorGuardar=false;
            this.displayOrdenSubEmpresas=false;
            
            this.disBtnSaveAllSuEm=false;

            this.nTolVueltas=null;
            this.ReDiHoraInicioDiario=null;
            this.arrEtdRegDiario=[{id:'01',nomb:'POR REALIZAR'},{id:'02',nomb:'ACTUAL'},{id:'03',nomb:'COMPLETADO'}];
        }
        //funciones
        //btn nuevo registro diario ---- form principal
            funcBtnNuevoRegistroDiario(){
                let añoActual=new Date().getFullYear().toString();
                this.fechRegDir=editf1(fechaActual1());
                this.configService.getAllConfiguraByEmPeriodo(this.emid,añoActual).subscribe(
                    data=>{
                        if(data.length!=0){
                            this.CoSiId=data[0].CoSiId;
                            //console.log(this.fechRegDir);
                            this.displayNuevoRegistroDiario=true; this.newRegistroDiario();  
                        }else{alert('No hay configuracion del sistema');}
                    },error=>{

                    },()=>{}
                );
             
            }
        //procedures
            
            //GET
                getAllRegistroDiarionByemId(emId:number){
                    let arrRegDiario:any[]=[];
                    this.registrodiarioservice.getAllRegistroDiarionByemId(emId).subscribe(
                        data => {arrRegDiario=data; this.mgAllRegistroDiario(arrRegDiario);},
                        error=> {console.log(error);}
                    );
                }
                getAllregistrodiarioDetalleByPrId(reDiId:number){
                    let arrReg:any[]=[];
                    this.registrodiarioservice.getAllregistrodiarioDetalleByPrId(reDiId).subscribe(
                        data=>{ 
                                arrReg=data; 
                                if(arrReg.length!=0){
                                    this.mgAllRegDiarioDetalle(arrReg);
                                    this.displayRegDiarioDetalle=true;
                                }else{
                                    alert('No hay registro diario creado');
                                }
                                
                              },
                        error=>{
                                console.log(error);
                                alert('Error al descargar el registro diario detalle, vuelva a intentarlo');
                                }
                    );
                }

                cerrarTabRegDiarioDetalle(){
                    this.displayRegDiarioDetalle=false;
                }

                getRegistroDiario(ReDiId:number){
                    let objReg:any;
                    this.registrodiarioservice.getregistrodiarioById(ReDiId).subscribe(
                        data=>{objReg=data; console.log(objReg);},
                        err=>{console.log(err);}
                    );
                }
            //SAVE
                saveRegistroDiario(objRegDiario:Object){
                    this.registrodiarioservice.saveregistrodiario(objRegDiario).subscribe(
                        data=>{ 
                            //console.log(data);
                            this.mensaje="";
                            this.displayProcesoGuardando=false;
                            
                            if(data.ReDiId!=0 && data.ReDiId>0){
                                //alert("guardado =D");
                                this.getAllRegistroDiarionByemId(this.emid);
                            }else{
                                this.mensaje="Error en el registro diario";
                                this.displayErrorGuardar=true;
                            }                            
                        },
                        err =>{
                            alert('No se pudo crear el registro diario'); 
                            console.log(err);
                        }
                    );
                }
                aceptarErrorGuardar(){
                    this.mensaje='';
                    this.displayErrorGuardar=false;
                }
            //DELETE
                delRegistroDiario(ReDiId:number){
                    this.registrodiarioservice.deleteregistrodiarioByid(ReDiId).subscribe(
                        realizar => {this.getAllRegistroDiarionByemId(this.emid)},
                        err =>{alert('No se pudo borrar el registro diario');}
                    );
                }
            //NEW
                newRegistroDiario(){
                    let objReDi:any;
                    this.registrodiarioservice.newregistrodiario().subscribe(
                        data=>{ objReDi=data;
                                //console.log(data);
                                //this.fechRegDir=editf1(fechaActual1());
                                this.ReDiId=objReDi.ReDiId;
                              },
                        err =>{console.log(err);}
                    );
                }
            //OTHER
        //onrowselect
                onRowSelectRegDiario(event){
                    let ReDiId:number;
                    //console.log(event.data.ReDiId);
                    ReDiId=event.data.ReDiId;
                    this.getAllregistrodiarioDetalleByPrId(ReDiId);
                }
        //mostrar datatables 
                //DETALLE FORM PRINCIPAL REGISTRO DETALLE
                    mgAllRegDiarioDetalle(arrRegDiarioDetalle=[]){
                        let arrRegDiarioDetByEmId=[];

                        for(let arrRegDet of arrRegDiarioDetalle){
                            arrRegDiarioDetByEmId.push({
                                Nro:0,
                                ReDiDeId:arrRegDet.ReDiDeId,
                                ReDiDeNombreVuelta:arrRegDet.ReDiDeNombreVuelta,
                                ReDiDeNroVuelta:arrRegDet.ReDiDeNroVuelta,
                                ReDiId:arrRegDet.ReDiId,
                                ReDiDeEstado:arrRegDet.ReDiDeEstado,
                            }); 
                        }
                        for(let i=0; i<arrRegDiarioDetByEmId.length; i++){
                            arrRegDiarioDetByEmId[i].Nro=i+1;
                            arrRegDiarioDetByEmId[i].ReDiDeEstado=this.buscarValorArrayTipo(arrRegDiarioDetByEmId[i].ReDiDeEstado);
                        }
                        this.arrRegDiarioDetalleByEmId=arrRegDiarioDetByEmId.slice(0);
                    }
                
                    //buscar valor columna mgAllRegDiarioDetalle
                    buscarValorArrayTipo(objvalue:string):string{
                        let valor:string, i:number=0, cen:boolean=false;
                        let arrvalors:any[]=[];

                        arrvalors=this.arrEtdRegDiario.slice(0);

                        while(i<arrvalors.length && cen==false){
                            if(objvalue==arrvalors[i].id){
                                valor=arrvalors[i].nomb;
                                cen=true;
                            }else if(objvalue!=arrvalors[i].id){
                                i++;
                                cen=false;
                            }
                        }

                        return valor;
                    }
                    
                //CABECERA FORM PRINCIPAL REGISTRO CABECERA
                    mgAllRegistroDiario(arrRegDiario=[]){
                        //console.log(arrRegDiario);
                        let arrRegDiarioByEmId=[];
                        
                        for(let arrReg of arrRegDiario){
                            arrRegDiarioByEmId.push({
                                Nro:0,
                                ReDiFeha:_fecha1(arrReg.ReDiFeha),
                                ReDiId:arrReg.ReDiId,
                                ReDiHoraInicioDiario:_hora(arrReg.ReDiHoraInicioDiario),
                                ReDiTotalVuelta:arrReg.ReDiTotalVuelta,
                            }); 
                        }
                        for(let i=0; i<arrRegDiarioByEmId.length; i++){
                            arrRegDiarioByEmId[i].Nro=i+1;
                        }
                        //console.log();
                        this.arrRegDiarioByEmId=arrRegDiarioByEmId.slice(0);
                    }
        //func btn datatable
                //cabecera
                    //btns
                        //editar
                        btnTabEditReDi(ReDiId:number){
                            this.ReDiId=ReDiId;
                            //console.log(ReDiId);
                        }
                        //delete
                        btnTabDelReDi(ReDiId:number){
                            this.ReDiId=ReDiId;
                            this.displayConfDelRegDiario=true;
                            this.mensajevalidacion="¿Esta seguro de eliminar el registro diario?";
                            //console.log(ReDiId);
                        }
                        okDelRegDiario(){
                            this.delRegistroDiario(this.ReDiId);
                            this.displayConfDelRegDiario=false;
                            this.mensajevalidacion="";
                        }
                        cancelDelRegDiario(){
                            this.displayConfDelRegDiario=false;
                            this.mensajevalidacion="";
                        }
                    //validacion
                        
                //detalle
        //func botones modal
            //aceptar
                guardarRegistroDiario(){
                    let objSaveRegDiario:any;
                    let añoActual=new Date().getFullYear().toString();
              
                    if(this.CoSiId==1){
                        this.ordenSuEmId="";
                    }
                    objSaveRegDiario={
                        UsFechaReg:new Date(),
                        EmId: this.emid,
                        UsId: this.userid,
                        ReDiId :this.ReDiId,
                        ReDiFeha :fecha(this.fechRegDir),
                        ReDiTotalVuelta:this.nTolVueltas,
                        ReDiHoraInicioDiario:hora(this.ReDiHoraInicioDiario),
                        ReDiOrdenSubEmpresa:this.ordenSuEmId
                    }

                    if(this.nTolVueltas>20){
                        this.nTolVueltas=20;
                    }else if(this.nTolVueltas==0){
                        this.nTolVueltas=1;
                    }
                    
                    //console.log(objSaveRegDiario);  
                    if(this.buscarFechaIgual(this.arrRegDiarioByEmId,guion_slash_inver(this.fechRegDir))==0){
                        this.mensaje="guardando registro diario...";
                        this.displayProcesoGuardando=true;
                        this.displayNuevoRegistroDiario=false;
                        this.saveRegistroDiario(objSaveRegDiario);
                    }else if(this.buscarFechaIgual(this.arrRegDiarioByEmId,guion_slash_inver(this.fechRegDir))==1){
                        this.mensaje="No puede crear dos registros con la misma fecha";
                        this.displayErrorMismaFecha=true;
                    }
                }
            //cancelar
                aceptarErrorMismoRegFecha(){
                    this.mensaje="";
                    this.displayErrorMismaFecha=false;
                }
                cancelGuardarRegistroDiario(){
                    this.displayNuevoRegistroDiario=false;
                }
        //funcvariados
                buscarFechaIgual(arrRegDiario=[],fecha:string):number{
                    let cen=0, i=0;
                    while(i<arrRegDiario.length && cen==0){
                        if(arrRegDiario[i].ReDiFeha==fecha){
                            cen=1;
                        }else{
                            cen=0;
                            i++
                        }
                    }
                    return cen;
                }

                funcBtnModOrdenSubEmpre(){
                    this.displayOrdenSubEmpresas=true;
                    this.empsubempservice.getallsubempresasbyemid(this.emid).subscribe(
                        data=>{
                            //console.log(data);
                            this.mgEmpSubEmp(data);
                            this.selectedSubEmp=[];
                        },
                        error=>{

                        },
                        ()=>{}
                    );
                }

                mgEmpSubEmp(arrSubEmp=[]){
                    let _arrSubEmp=[]
        
                    for(let i=0; i<arrSubEmp.length; i++){
                        _arrSubEmp.push({
                            Nro:i+1,
                            EmId:arrSubEmp[i].EmId,
                            SuEmActivo:arrSubEmp[i].SuEmActivo,
                            SuEmDireccion:arrSubEmp[i].SuEmDireccion,
                            SuEmEmail:arrSubEmp[i].SuEmEmail,
                            SuEmId:arrSubEmp[i].SuEmId,
                            SuEmRSocial:arrSubEmp[i].SuEmRSocial,
                            SuEmRuc:arrSubEmp[i].SuEmRuc,
                            SuEmTelefono:arrSubEmp[i].SuEmTelefono,
                            SuEmTiempoVuelta:arrSubEmp[i].SuEmTiempoVuelta,
                            SuEmUbigeo:arrSubEmp[i].SuEmUbigeo,
                            UsFechaReg:arrSubEmp[i].UsFechaReg,
                            UsId:arrSubEmp[i].UsId,
                            Orden:null
                        })
                    }
                    //console.log(_arrSubEmp);
                    this.arrSubEmp=_arrSubEmp;
                }

        onRowSelectSubEmp(event){
            for(let i=0; i<this.selectedSubEmp.length; i++){
                this.selectedSubEmp[i].Orden=i+1;
            }   
            this.disBtnSaveAllSuEm=this.funcValidAllMarkerSubEmp(this.selectedSubEmp.length,this.arrSubEmp.length);
            
        }
        

        onRowUnselectSubEmp(event){
            let index=this.funcBuscarEnArrayByValue(event.data.SuEmId,this.arrSubEmp);
            this.arrSubEmp[index].Orden=null;
            for(let i=0; i<this.selectedSubEmp.length; i++){
                this.selectedSubEmp[i].Orden=i+1;
            }
            this.disBtnSaveAllSuEm=this.funcValidAllMarkerSubEmp(this.selectedSubEmp.length,this.arrSubEmp.length);
        }

        onHeaderCheckboxToggleSubEmp(event){
            if(event.checked==true){
                for(let i=0; i<this.arrSubEmp.length; i++){
                    this.arrSubEmp[i].Orden=i+1;
                }
            }else if(event.checked==false){
                for(let subemp of this.arrSubEmp){
                    subemp.Orden=null;
                }
            }
            this.disBtnSaveAllSuEm=this.funcValidAllMarkerSubEmp(this.selectedSubEmp.length,this.arrSubEmp.length);
            //console.log(this.selectedSubEmp);
        }

        aceptarOrderSubEmp(){
            this.displayOrdenSubEmpresas=false;
            this.selectedSubEmp
            let arrOrderSubEmp=[];
            for(let i=0; i<this.selectedSubEmp.length; i++){
                arrOrderSubEmp.push(this.selectedSubEmp[i].SuEmId);
            }
            //console.log(this.arrSubEmp);
            //console.log(this.selectedSubEmp);
            //console.log(arrOrderSubEmp);
            this.ordenSuEmId=arrOrderSubEmp.join(',');
            console.log(this.ordenSuEmId);
        }
        cancelOrderSubEmp(){
            this.displayOrdenSubEmpresas=false;
        }

        funcBuscarEnArrayByValue(value:string, array=[]):number{
            let i:number=0, cen:number=0, index:number;
            while(i<array.length && cen==0){
                if(array[i].SuEmId==value){
                    cen=1;
                }else if(array[i].SuEmId!=value){
                    cen=0; i++;
                }
            }
            if(cen==0){
                index=-1;
            }else if(cen==1){
                index=i;
            }
            return index;
        }

        funcValidAllMarkerSubEmp(nroCheckSubEmp:number, nroSubEmp:number):boolean{
            let valid:boolean;
            if(nroCheckSubEmp==nroSubEmp){
                valid=true;
            }else if(nroCheckSubEmp!=nroSubEmp){
                valid=false;
            }
            return valid;
        }
}