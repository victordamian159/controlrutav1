import {Component,OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import { TControlService } from '../service/tcontrol.service';
import {GlobalVars} from 'app/variables';
import {ProgramacionService} from '../service/prog.service';
import {VistaEnLineaService} from '../service/vistaEnLinea.service';
import {TrackerByPlacaService} from '../service/trackerByPlaca.service';
import {fecha,guionBySlash,_hora,editf1} from 'app/funciones';

declare var google: any;

@Component({
    selector: 'app-vistaEnLinea',
    templateUrl	: '../views/vistaEnLinea.component.html',
    styleUrls: ['../styles/vistaEnLinea.component.css']
})

export class consulVistaEnLineaComponent implements OnInit{
    //variables
        //number
            private EmId:number;
            private UsId:number;
            private PrId:number;
            private anio:number;
        
            //string
            private fecha:string;
            private fechaUno:string;
        //boolean
            //display modal
                private displayAlertNotifXPlaca:boolean;
    //arrays
        private tipoMensaje:any[];
        private options: any;
        private overlays: any[];
        private dialogVisible: boolean;
        private markerTitle: string;
        private selectedPosition: any;
        private infoWindow: any;
        private draggable: boolean;
        private msgs: Message[] = [];
        private placas:any[]=[];
        private map:any;
        private start:any;


    ngOnInit() {
        this.options = { center: {lat: -18.00175398229809, lng: -70.24808406829834}, zoom: 14, gestureHandling: 'greedy' }; 
        //this.initOverlays(); this.infoWindow = new google.maps.InfoWindow();
        //this.initNodos();
        
    }
    constructor(private tcontrolserv:TControlService, 
                private trackerByPlacaService:TrackerByPlacaService,
                private programService:ProgramacionService,
                private vistaEnLineaService:VistaEnLineaService,
                public  ClassGlobal : GlobalVars ){
        this.EmId=this.ClassGlobal.GetEmId();
        this.UsId=this.ClassGlobal.GetUsId();
        this.anio=2018;

        //display booleans
        this.displayAlertNotifXPlaca=false;
        this.draggable=false;

        this.tipoMensaje=[{id:1, nomb:'Alerta'},{id:2, nomb:'Notificacion'}];
        this.overlays=[];                
    }

    initNodos(){
        this.start=setInterval(
            //this.nodos, console.log(this.EmId)function(){ console.log(this.EmId); }
            ()=>{
                //console.log(this.fechaUno);console.log(this.fecha);let fech=fecha(this.fecha);
                let _fech=Date.parse(this.fecha)+24*60*60*1000;
                //console.log(_fech);
                this.vistaEnLineaService.getallubicacionactualbyemtiempo(this.EmId,this.anio,_fech)
                    .subscribe( data=>{this.overlays=[]; this.agregarMarkers(data);} );
            }
        ,1000);
    }

    

    

    stopNodos(){
        clearInterval(this.start);
        //console.log(this.EmId);
    }

    nodos(){
        console.log(this.EmId);
    }

    funcInputDtFecha(){
        this.fechaUno=guionBySlash(this.fecha);
        /*console.log(this.fechaUno);
        console.log(this.EmId);
        console.log(this.anio);*/
        this.mProcGetByTabla(this.EmId, this.anio);
    }

    //funciones para gmapa
        //click en el mapa
        handleMapClick(event) {
            this.dialogVisible = true;
            this.selectedPosition = event.latLng;
            
        }
        
        //click sobre un objeto que esta sobre el mapa
        handleOverlayClick(event) {
            this.msgs = [];
            let isMarker = event.overlay.getTitle != undefined;
            
            //click sobre marcador
            if(isMarker) {
                this.displayAlertNotifXPlaca=true;
            }
            //cualquier otro
            else {
                this.msgs.push({severity:'info', summary:'Shape Selected', detail: ''});
            }        
        }
        
        //agregar marcador
        agregarMarkers(arrMarkers=[]){
            //console.log(this.selectedPosition.lat()); console.log(this.selectedPosition.lng()); console.log(this.draggable);

            this.overlays.push(
                /*
                    new google.maps.Marker({
                        position:{lat: this.selectedPosition.lat(), 
                                lng: this.selectedPosition.lng()}, 
                        title:'XPS-400',
                        label:'XSZ-213',
                        draggable: this.draggable
                    })
                    BuId
                    BuPlaca
                    EmId
                    GeFechaHora
                    GeId
                    GeLatitud
                    GeLongitud
                    GeOrden
                    ReDiDeId
                    SuEmId
                    TaCoId
                    TaCoNroVuelta
                    UsFechaReg
                */
               new google.maps.Marker({
                position:{
                            lat: arrMarkers[0].GeLatitud, 
                            lng: arrMarkers[0].GeLongitud
                         }, 
                title:arrMarkers[0].BuPlaca,
                label:arrMarkers[0].BuPlaca,
                draggable: this.draggable
            })
            );

            this.markerTitle = null;
            this.dialogVisible = false;

            //console.log(this.overlays);
        }
        
        //evento al finalizar arratras objeto
        handleDragEnd(event) {
            //this.msgs = []; this.msgs.push({severity:'info', summary:'Marker Dragged', detail: event.overlay.getTitle()});
            event.map.setCenter(this.selectedPosition);
        }

    
    centrar(map){
        console.log(map);
        map.setZoom(map.getZoom()+1);
    }

    //cargando la tabla por nro de vuelta y programacion
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
        //funcion para sacar la programacion activa
        this.PrId=arrProgramaciones[arrProgramaciones.length-1].prId;
        console.log(this.PrId);
        console.log(this.fechaUno);
        console.log(editf1(this.fecha));
        
        
        this.tcontrolserv.getalltarjetacontrolbybuidfecha(this.EmId, 0, editf1(this.fecha)).subscribe(
            data=>{ 
                console.log(data); this.mgTablaPlacas(data);                    
            },erro=>{alert(erro+'error al hacer la consulta')
            },() => {}
        )
        

    }
    mgTablaPlacas(arrProg=[]){
       // console.log(arrCuadro);
        let _arrCuadro:any[]=[], __arrCuadro:any[]=[];
        for(let bus of arrProg){
            _arrCuadro=[{
                Nro:0,
                _TaCoAsignado:'',
                BuId:bus.BuId,
                BuPlaca:bus.BuPlaca,
                PrId:bus.PrId,
                PuCoDescripcion:bus.PuCoDescripcion,
                PuCoId:bus.PuCoId,
                PuCoTiempoBus:bus.PuCoTiempoBus,
                ReDiDeId:bus.ReDiDeId,
                RuId:bus.RuId,
                TaCoAsignado:bus.TaCoAsignado,
                TaCoCodEnvioMovil:bus.TaCoCodEnvioMovil,
                TaCoCountMultiple:bus.TaCoCountMultiple,
                TaCoCuota:bus.TaCoCuota,
                TaCoFecha:bus.TaCoFecha,
                TaCoFinish:bus.TaCoFinish,
                TaCoHoraSalida:bus.TaCoHoraSalida,
                TaCoId:bus.TaCoId,
                TaCoMultiple:bus.TaCoMultiple,
                TaCoNroVuelta:bus.TaCoNroVuelta,
                TaCoTipoHoraSalida:bus.TaCoTipoHoraSalida,
                TiSaId:bus.TiSaId,
                UsFechaReg:bus.UsFechaReg,
                UsId:bus.UsId
            }];
        }

        for(let i=0; i<_arrCuadro.length; i++){
            _arrCuadro[i].Nro=i+1;
            if(_arrCuadro[i].TaCoAsignado==1){
                _arrCuadro[i]._TaCoAsignado='Asignado';
            }else if(_arrCuadro[i].TaCoAsignado==2){
                _arrCuadro[i]._TaCoAsignado='Ausente';
            }else if(_arrCuadro[i].TaCoAsignado==3){
                _arrCuadro[i]._TaCoAsignado='Castigado';
            }
        }

        this.placas=_arrCuadro;
     
    }

}