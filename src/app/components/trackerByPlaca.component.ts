import {Component,OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {TControlService} from '../service/tcontrol.service';
import {GlobalVars} from 'app/variables';
import {ProgramacionService} from '../service/prog.service';
import {RegDiarioService} from '../service/registrodiario.service';
import {TrackerByPlacaService} from '../service/trackerByPlaca.service';
import {EmpSubEmpService} from '../service/empSubemp.service';
import {BusService} from '../service/bus.service';
import {guionBySlash,_hora,editf1,_fecha2} from 'app/funciones';
declare var google: any;

@Component({
    selector: 'app-trackerByPlaca',
    templateUrl	: '../views/trackerByPlaca.component.html',
    styleUrls: ['../styles/trackerByPlaca.component.css']
})

export class csl_TrackByPlacaComponent implements OnInit{
    private options: any;
    private EmId:number;
    private UsId:number;
    private PrId:number;
    private anio:number;
    private fecha:string;
    private reDiDeId:number;
    private SuEmId:number;
    private validReDiId:number;
    private BuId:number;
    
    //arrays
    private arrSubEmp:any[]=[];
    private placas:any[]=[];
    private arrRegDiarioVuelta:any[]=[];
    private arrBusBySubEmp:any[]=[];
    private overlays:any[]=[];

    constructor(
            private busService: BusService,
            private regDiarioService:RegDiarioService,
            private empSubEmpService:EmpSubEmpService,
            private programService : ProgramacionService,
            private trackerByPlacaService:TrackerByPlacaService,
            private tcontrolserv : TControlService,
            public  ClassGlobal : GlobalVars
        ){
        this.fecha="-1";
        this.SuEmId=-1;
        this.validReDiId=-1;
        this.reDiDeId=-1;
        this.EmId=this.ClassGlobal.GetEmId();
        this.UsId=this.ClassGlobal.GetUsId();
        this.anio=2018;
    }
    
    ngOnInit(){
        this.options = { center: {lat: -18.00175398229809, lng: -70.24808406829834}, zoom: 14 }; 
        this.getsubempresasbyemid(this.EmId);
    }

    getsubempresasbyemid(emid:number){
        let arrsubemps:any[]=[];
        this.empSubEmpService.getallsubempresasbyemid(emid).subscribe(
            data => { 
                arrsubemps=data; this.arrSubEmp=arrsubemps;

            },err => {},
        );
    }

    //funciones
    funcInputDtFecha(){
        this.regDiarioService.getAllRegistroDiarionByemId(this.EmId).subscribe(
            data=>{
                let arr=this.extFechaRegDiario(data); let index=arr.indexOf(editf1(this.fecha));
                this.validReDiId=index;
                if(index!=-1){                                    
                    this.regDiarioService.getAllregistrodiarioDetalleByPrId(data[index].ReDiId).subscribe(
                        data=>{
                            this.arrRegDiarioVuelta=data;
                        },error=>{

                        },()=>{}
                    );
                }else if(index==-1){
                    alert('No hay Registro Diario');
                }                            
            },error=>{

            },()=>{

            }
        );
    }

    funcCboSubEmp(){
        this.busService.getAllBusByEmEmSu(this.EmId, this.SuEmId).subscribe(
            data => {this.mgBus(data); this.overlays=[];},
        );
    }

    mgBus(arrBuses=[]){
        let arrbus=[]
        for(let bus of arrBuses){
            arrbus.push({
                Nro:0,
                BuActivo:bus.BuActivo,
                BuCapacidad:bus.BuCapacidad,
                BuDescripcion:bus.BuDescripcion,
                BuFechaIngreso:bus.BuFechaIngreso,
                BuId:bus.BuId,
                BuMarca:bus.BuMarca,
                BuPlaca:bus.BuPlaca,
                SuEmId:bus.SuEmId,
                SuEmRSocial:bus.SuEmRSocial
            });
        }
        for(let i=0; i<arrbus.length; i++){
            arrbus[i].Nro=i+1;
        }
        console.log(arrbus);
        this.arrBusBySubEmp=arrbus;
    }

    funcCboRegistroDiario(arr=[]){
        console.log(this.anio);
        console.log(this.SuEmId);
        console.log(this.reDiDeId);
    }
    
    onRowSelectPlaca(event){
        console.log(event.data);
        this.BuId=event.data.BuId;
        
        //this.trackerByPlacaService.getallrecorridovueltabyemburedi(this.EmId,this.anio, this.BuId, this.reDiDeId).subscribe(
        this.trackerByPlacaService.getallrecorridovueltabyemburedi(this.EmId,this.anio, 10, 564).subscribe(
            data=>{
                if(data.length!=0){
                    this.overlays=[];
                    this.cargarRuta(data);
                }else if(data.length==0){
                    alert('No hay recorrido en la placa seleccionada');
                }
            }, error=>{

            },()=>{}
        );
        
    }

    extFechaRegDiario(arrReg=[]){
        let arr=[];
        for(let _arr of arrReg){
            arr.push(_fecha2(_arr.ReDiFeha));
        }
        return arr;
    }

    mProcGetByTabla(EmId:number, anio:number){
        this.tcontrolserv.getAllProgramacionByEm(EmId,anio).subscribe(
            data=>{
                console.log(data);
                if(data.length!=0){
                    this.mGetProcProgramacion(data)
                }                       
            },error=>{

            },()=>{}
        );
        
    }
    mGetProcProgramacion(arrProgramaciones=[]){
        this.PrId=arrProgramaciones[arrProgramaciones.length-1].prId;
        this.programService.getAllProgramacionDetalleByPrFecha(this.PrId,editf1(this.fecha)).subscribe(
            data=>{
                console.log(data);
                if(data.length!=0){
                    this.mgTablaPlacas(data);
                }
            },error=>{

            },()=>{}
        );
    }

    mgTablaPlacas(arrProg=[]){
        // console.log(arrCuadro);
         let _arrCuadro:any[]=[], __arrCuadro:any[]=[];
         for(let bus of arrProg){
             _arrCuadro=[{
                 BuId:bus.BuId,
                 PrDeAsignadoTarjeta:bus.BuId,
                 PrDeBase:bus.BuId,
                 PrDeCountVuelta:bus.BuId,
                 PrDeFecha:bus.BuId,
                 PrDeHoraBase:bus.BuId,
                 PrDeId:bus.BuId,
                 PrDeOrden:bus.BuId,
                 PrId:bus.BuId,
                 UsFechaReg:bus.BuId,
                 UsId:bus.BuId
             }];
         }
         this.placas=_arrCuadro;
    }

    cargarRuta(puntosRuta=[]){
        let coordenadas:any[]=[];
        for(let n=0; n<puntosRuta.length; n++){
            coordenadas.push({
                lat:puntosRuta[n].GeLatitud,
                lng:puntosRuta[n].GeLongitud
            });
        }

        /*ULTIMA LINEA DE CIERRE #0B610B */ 
        coordenadas.push({
            lat:puntosRuta[0].GeLatitud,
            lng:puntosRuta[0].GeLongitud
        })
        if(this.overlays.length!=0){
            this.overlays.unshift(
                new google.maps.Polyline({
                    path: coordenadas, 
                    strokeColor: '#21610B',
                    strokeOpacity : 1,
                    strokeWeight :4 
            }));
        }else if(this.overlays.length==0){
            this.overlays.push(
                new google.maps.Polyline({
                    path: coordenadas, 
                    strokeColor: '#21610B',
                    strokeOpacity : 1,
                    strokeWeight :4 
            }));
        }
        

    }
}