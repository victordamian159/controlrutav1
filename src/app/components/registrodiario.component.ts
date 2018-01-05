import {Component, OnInit} from '@angular/core';
import {GlobalVars} from 'app/variables'
import {editf1,fechaActual1,fechaActual2, _fecha1, _hora, fecha, hora,guion_slash_inver} from 'app/funciones';
import {RegDiarioService} from '../service/registrodiario.service';

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
            //number
                private nTolVueltas:number;
                private emid:number;
                private userid:number;
                private ReDiId:number;
                
            //string 
                private ReDiHoraInicioDiario:string;
                private fechRegDir:string;
                private mensajevalidacion:string;
                private mensaje:string;
            //any(objeto)
                private objConfig:any;
        //arrays
            private arrRegDiarioByEmId:any[];
            private arrRegDiarioDetalleByEmId:any[];
            private arrEtdRegDiario:any[];
        //function init
        ngOnInit(){
            this.getAllRegistroDiarionByemId(this.emid);
        }
        //constructor
        constructor(private registrodiarioservice:RegDiarioService, 
                    public ClassGlobal:GlobalVars){

            this.emid=this.ClassGlobal.GetEmId();
            this.userid=this.ClassGlobal.GetUsId();
            this.arrRegDiarioByEmId=[];
            this.arrRegDiarioDetalleByEmId=[];

            this.displayNuevoRegistroDiario=false;
            this.displayConfDelRegDiario=false;
            this.displayErrorMismaFecha=false;
            this.displayRegDiarioDetalle=false;
           
            this.nTolVueltas=null;
            this.ReDiHoraInicioDiario=null;
            this.arrEtdRegDiario=[{id:'01',nomb:'POR REALIZAR'},{id:'02',nomb:'ACTUAL'},{id:'03',nomb:'COMPLETADO'}];
        }
        //funciones
        //btn nuevo registro diario ---- form principal
            funcBtnNuevoRegistroDiario(){
                this.displayNuevoRegistroDiario=true;
                this.newRegistroDiario();  
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
                                arrReg=data; console.log(arrReg); 
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
                        data=>{ this.getAllRegistroDiarionByemId(this.emid); console.log("guardado =D");},
                        err =>{alert('No se pudo crear el registro diario'); console.log(err);}
                    );
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
                                this.fechRegDir=editf1(fechaActual1());
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
                        console.log(arrRegDiario);
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
                        console.log();
                        this.arrRegDiarioByEmId=arrRegDiarioByEmId.slice(0);
                    }
        //func btn datatable
                //cabecera
                    //btns
                        //editar
                        btnTabEditReDi(ReDiId:number){
                            this.ReDiId=ReDiId;
                            console.log(ReDiId);
                        }
                        //delete
                        btnTabDelReDi(ReDiId:number){
                            this.ReDiId=ReDiId;
                            this.displayConfDelRegDiario=true;
                            this.mensajevalidacion="Esta seguro de eliminar el registro?";
                            console.log(ReDiId);
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
                    //console.log(this.fechRegDir); console.log(this.nTolVueltas); console.log(this.ReDiHoraInicioDiario); console.log(this.arrRegDiarioByEmId); console.log(this.ReDiId);

                    objSaveRegDiario={
                        UsFechaReg:new Date(),
                        EmId: this.emid,
                        UsId: this.userid,
                        ReDiId :this.ReDiId,
                        ReDiFeha :fecha(this.fechRegDir),
                        ReDiTotalVuelta:this.nTolVueltas,
                        ReDiHoraInicioDiario:hora(this.ReDiHoraInicioDiario)
                    }

                    if(this.nTolVueltas>20){
                        this.nTolVueltas=20;
                    }else if(this.nTolVueltas==0){
                        this.nTolVueltas=1;
                    }

                    console.log(objSaveRegDiario);  
                    
                    if(this.buscarFechaIgual(this.arrRegDiarioByEmId,guion_slash_inver(this.fechRegDir))==0){
                        this.displayNuevoRegistroDiario=false;
                        this.saveRegistroDiario(objSaveRegDiario);
                    }else if(this.buscarFechaIgual(this.arrRegDiarioByEmId,guion_slash_inver(this.fechRegDir))==1){
                        this.mensaje="No puede crear dos registros con la misma fecha actual";
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
}