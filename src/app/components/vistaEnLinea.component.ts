import {Component,OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import { TControlService } from '../service/tcontrol.service';
import {GlobalVars} from 'app/variables';

import {guionBySlash,_hora} from 'app/funciones';
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

    ngOnInit() {
        this.options = { center: {lat: -18.00175398229809, lng: -70.24808406829834}, zoom: 14 }; 
        //this.initOverlays(); this.infoWindow = new google.maps.InfoWindow();
        
    }
    constructor(private tcontrolserv:TControlService, 
                public  ClassGlobal : GlobalVars ){
        this.EmId=this.ClassGlobal.GetEmId();
        this.UsId=this.ClassGlobal.GetUsId();
        this.anio=2018;

        //display booleans
        this.displayAlertNotifXPlaca=false;
        this.draggable=true;

        this.tipoMensaje=[{id:1, nomb:'Alerta'},{id:2, nomb:'Notificacion'}];
        this.overlays=[];                
    }

    funcInputDtFecha(){
        this.fechaUno=guionBySlash(this.fecha);
        this.mProcGetByTabla(this.EmId, this.anio);
    }

    //funciones para gmapa
        //click en el mapa
        handleMapClick(event) {
            this.dialogVisible = true;
            this.selectedPosition = event.latLng;
            this.addMarker();
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
        addMarker() {
            //console.log(this.selectedPosition.lat()); console.log(this.selectedPosition.lng()); console.log(this.draggable);

            this.overlays.push(
                new google.maps.Marker({
                    position:{lat: this.selectedPosition.lat(), 
                            lng: this.selectedPosition.lng()}, 
                    title:'XPS-400',
                    label:'XSZ-213',
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
        this.tcontrolserv.getAllProgramacionByEm(EmId,anio)
            .subscribe(
                data=>{
                    if(data.length!=0){
                        this.mGetProcProgramacion(data)
                    }                       
                },
                error=>{

                }
        );
        
    }

    mGetProcProgramacion(arrProgramaciones=[]){
        //funcion para sacar la programacion activa
        this.PrId=arrProgramaciones[arrProgramaciones.length-1].prId;
        //console.log(this.PrId);

        this.tcontrolserv.getallregistrovueltasdiariasbyemprfe(this.EmId, this.PrId, this.fechaUno)
            .subscribe(
                data=>{
                    if(data.length!=0){
                        this.mgTablaPlacas(data);
                    }
                },
                error=>{

                }
            );
    }
    mgTablaPlacas(arrCuadro=[]){
       // console.log(arrCuadro);
        let _arrCuadro:any[]=[], __arrCuadro:any[]=[];
        _arrCuadro=this.sacarArrCuadroXNroVuelta(arrCuadro,1);
        //console.log(_arrCuadro);
        for(let i=0; i<_arrCuadro.length;i++){
            __arrCuadro.push({
                nro:0,
                BuId:_arrCuadro[i].BuId,
                BuPlaca:_arrCuadro[i].BuPlaca,
                HoraLlegada:_arrCuadro[i].HoraLlegada,
                Id:_arrCuadro[i].Id,
                PrDeId:_arrCuadro[i].PrDeId,
                PrDeOrden:_arrCuadro[i].PrDeOrden,
                PuCoTiempoBus:_arrCuadro[i].PuCoTiempoBus,
                ReDiDeId:_arrCuadro[i].ReDiDeId,
                ReDiDeNroVuelta:_arrCuadro[i].ReDiDeNroVuelta,
                ReDiId:_arrCuadro[i].ReDiId,
                ReReId:_arrCuadro[i].ReReId,
                ReReTiempo:_arrCuadro[i].ReReTiempo,
                TaCoAsignado:_arrCuadro[i].TaCoAsignado,
                TaCoHoraSalida:_hora(_arrCuadro[i].TaCoHoraSalida),
                TaCoId:_arrCuadro[i].TaCoId,
                TaCoMultiple:_arrCuadro[i].TaCoMultiple,

                estado:''
            });
            if(__arrCuadro[i].TaCoAsignado==null){
                __arrCuadro[i].TaCoAsignado=0;
                __arrCuadro[i].EstadoAsignado="No Asignado";

            }else if(__arrCuadro[i].TaCoAsignado=='1'){
                __arrCuadro[i].EstadoAsignado=__arrCuadro[i].TaCoHoraSalida;

            }else if(__arrCuadro[i].TaCoAsignado=='2'){
                __arrCuadro[i].EstadoAsignado="Ausente";

            }else if(__arrCuadro[i].TaCoAsignado=='3'){
                __arrCuadro[i].EstadoAsignado="Castigado";

            }else{//EN CASO DE QUE PRDEASIGNADO=1 PERO TACOSIGNADO!=1 , 2 o 3
                __arrCuadro[i].EstadoAsignado="No Asignado";
            } 
        }
        for(let i=0; i<__arrCuadro.length; i++){
            __arrCuadro[i].nro=i+1;
        }
        this.placas=__arrCuadro;
    }

    sacarArrCuadroXNroVuelta(arrCuadro=[], vueltaActual:number){
        //console.log(arrCuadro);
        //console.log(vueltaActual);
        let result:any[]=[], arrMat:any[]=[];

            for(let i=0; i<arrCuadro.length;i++){
                //console.log(arrCuadro[i].ReDiDeNroVuelta);
                if(arrCuadro[i].ReDiDeNroVuelta==vueltaActual){
                    arrMat.push(arrCuadro[i]);
                }
            }
            //console.log(arrMat);
            result=arrMat.slice(0);
        return result;
    }
}