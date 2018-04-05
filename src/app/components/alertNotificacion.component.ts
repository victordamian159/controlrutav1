import {Component,OnInit} from '@angular/core';
import {servAlertNotifService} from '../service/alertNotificacion.service';
import {GlobalVars} from 'app/variables';
import {fecha,guion_slash_inver,guion_posFecha,_fecha2} from 'app/funciones';
import {TControlService} from '../service/tcontrol.service';

declare var google: any;

@Component({
    selector: 'app-alertNotif',
    templateUrl	: '../views/alertNotificacion.component.html',
    styleUrls: ['../styles/alertNotificacion.component.css']
})

export class consulAlertNotifComponent implements OnInit{
    //variables
    private disFormModMensaje:boolean;
    private disFormUbicacionAlIn:boolean;

    private AlInTipo:string;
    private emId:number;
    private UsId:number;
    private fecha:string;
    private inpFechaM1:string;
    private options: any;
    private selectedPosition:any;
    private longArrTarj:number;
    private TaCoId:number;
    private AlInId:number;
    private AlInFecha:string;
    private AlInDescripcion:string;
    private AlInLatitud:number;
    private AlInLongitud:number;

    //arrays
    private overlays:any[]=[];
    private _overlays:any[]=[];
    private arrTipoNotf:any[]=[];
    private mensajes:any[]=[];
    private selectedUsers:any[]=[];
    private arrIncidencia:any[]=[];
    private arrTarj:any[]=[];
    private selMulPlacas:any[]=[];
    
    ngOnInit(){
        this.options = {center: {lat: -18.0065679, lng: -70.2462741}, zoom: 14, gestureHandling: 'greedy'};
    }

    constructor(public  ClassGlobal : GlobalVars,
                private tcontrolservice : TControlService,
                private servAlertService : servAlertNotifService){
        this.arrTipoNotf=[{id:'-1', nomb:'Seleccione tipo'},{id:'01', nomb:'Alerta'},{id:'02', nomb:'Incidencia'}]
        this.emId=this.ClassGlobal.GetEmId();
        this.UsId=this.ClassGlobal.GetUsId();
        this.disFormModMensaje=false;
        this.longArrTarj=0;
    }

    funcInputDateFpFecha(){
        //console.log(guion_slash_inver(this.fecha));
        this.inpFechaM1=guion_posFecha(this.fecha);
        //console.log(guion_slash_inver(this.fecha));
        //console.log(this.fecha.replace(/-/g,'/'));
        let fech=this.fecha.replace(/-/g,'/')
        this.getalltarjetacontrolbybuidfecha(this.emId, 0,this.inpFechaM1);
        this.getallalertaincidenciabyemfecha(this.emId,fech);
    }

    getallalertaincidenciabyemfecha(emId:number, fecha:string){
        this.servAlertService.getallalertaincidenciabyemfecha(emId,fecha).subscribe(
            data=>{console.log(data); this.mgAlertaIncidencia(data); }
        );
    }

    mgAlertaIncidencia(arrAlIn=[]){
        
        let _arrAlIn=[];
        for(let AlIn of arrAlIn){
            _arrAlIn.push({
                Nro:0,
                AlInDescripcion:AlIn.AlInDescripcion,
                AlInFecha:_fecha2(AlIn.AlInFecha),
                AlInId:AlIn.AlInId,
                AlInLatitud:AlIn.AlInLatitud,
                AlInLongitud:AlIn.AlInLongitud,
                AlInTipo:AlIn.AlInTipo,
                sAlInTipo:'',
                EmId:AlIn.EmId,
                TaCoId:AlIn.TaCoId,
                UsFechaReg:AlIn.UsFechaReg,
                UsId:AlIn.UsId,
            });
        }
        for(let i=0; i<_arrAlIn.length; i++){
            _arrAlIn[i].Nro=i+1;
            if(_arrAlIn[i].AlInTipo==1){
                _arrAlIn[i].sAlInTipo='Alerta';
            }else if(_arrAlIn[i].AlInTipo==2){
                _arrAlIn[i].sAlInTipo='Incidencia';
            }
        }
        this.arrIncidencia=_arrAlIn;
    }

    /* FUNCIONES BTN */
        btnNvoMensaje(){
            this.disFormModMensaje=true;
            //console.log(this.selectedUsers);
            this.AlInTipo='-1';
            this.AlInId=0;
            
        }
        
    /* FUNC VARIADAS */
        mdlConfAcpt(value:boolean){
            console.log(value);
        }
    
        ngAfterViewChecked(): void {
            //google.maps.event.trigger(this.gmap.map, "resize");    
        }
        
        getalltarjetacontrolbybuidfecha(emid:number, buId:number, TaCoFecha:string){
            let arrTarjetasCreadas:any[]=[];
            this.tcontrolservice.getalltarjetacontrolbybuidfecha(emid, buId, TaCoFecha).subscribe(
                data=>{ 
                    arrTarjetasCreadas=data;
                    this.longArrTarj=data.length;                
                    if(arrTarjetasCreadas.length!=0){
                        let nroMaxVuelta=this.nroVueltaActual(arrTarjetasCreadas);
                        this.mgTarjetasControl(arrTarjetasCreadas,nroMaxVuelta);
                    }else if(arrTarjetasCreadas.length==0){
                        alert('No hay tarjetas creadas');
                        //this._allTarjControl=[];
                    }
                }
            )
        }

        //nro de vuelta actual
        nroVueltaActual(arrTarj=[]):number{
            let nro:number, arrNroVueltas=[];
            arrNroVueltas.push(0);
            for(let tarj of arrTarj){
                arrNroVueltas.push(tarj.TaCoNroVuelta);
            }
            
            nro=Math.max.apply(null,arrNroVueltas);        
            //console.log(nro);
            return nro;
        }

        mgTarjetasControl(arrTarjetas=[],TaCoNroVuelta:number){
            let arrTarj=[];
            for(let tarj of arrTarjetas){
                if(tarj.TaCoNroVuelta==TaCoNroVuelta){
                    arrTarj.push({
                        Nro:0,
                        BuId:tarj.BuId,
                        BuPlaca:tarj.BuPlaca,
                        PrId:tarj.PrId,
                        PuCoDescripcion:tarj.PuCoDescripcion,
                        PuCoId:tarj.PuCoId,
                        PuCoTiempoBus:tarj.PuCoTiempoBus,
                        ReDiDeId:tarj.ReDiDeId,
                        RuId:tarj.RuId,
                        TaCoAsignado:tarj.TaCoAsignado,
                        TaCoCodEnvioMovil:tarj.TaCoCodEnvioMovil,
                        TaCoCountMultiple:tarj.TaCoCountMultiple,
                        TaCoCuota:tarj.TaCoCuota,
                        TaCoFecha:tarj.TaCoFecha,
                        TaCoFinish:tarj.TaCoFinish,
                        TaCoHoraSalida:tarj.TaCoHoraSalida,
                        TaCoId:tarj.TaCoId,
                        TaCoMultiple:tarj.TaCoMultiple,
                        TaCoNroVuelta:tarj.TaCoNroVuelta,
                        TaCoTipoHoraSalida:tarj.TaCoTipoHoraSalida,
                        TiSaId:tarj.TiSaId,
                        UsFechaReg:tarj.UsFechaReg,
                        UsId:tarj.UsId,
                    });
                }
            }
        
            for(let i=0; i<arrTarj.length; i++){
                arrTarj[i].Nro=i+1;
            }
            this.arrTarj=arrTarj;
        }

        addMarker(lat:any, lng:any) {
            //console.log(this.overlays.length);
            if(this.overlays.length==0){
                
                this.AlInLatitud=lat;
                this.AlInLongitud=lng;

                this.overlays.push(new google.maps.Marker({
                    position:{
                                lat: this.AlInLatitud, 
                                lng: this.AlInLongitud
                             }, 
                    title:'', 
                    draggable: false}));
            }else if(this.overlays.length==1){}
            //this.markerTitle = null; this.dialogVisible = false;
        }

        //funciones de mapa
        handleMapClick(event) {
            this.selectedPosition = event.latLng;
            let lat=this.selectedPosition.lat();
            let lng=this.selectedPosition.lng();
            console.log(this.selectedPosition.lat());
            console.log(this.selectedPosition.lng());
            this.addMarker(lat,lng);
         
        }

        _handleMapClick(event){
            console.log(event.latLng);
        }

        guardarAlertaIncidencia(){
            let objAlIn:any, arrObjAlIn:any[]=[];

            objAlIn={
                TaCoId: 0,
                UsFechaReg: new Date(),
                UsId: this.UsId,
                EmId: this.emId,
                AlInId: this.AlInId,
                AlInFecha: fecha(this.AlInFecha),
                AlInDescripcion: this.AlInDescripcion,
                AlInTipo: Number(this.AlInTipo),
                AlInLatitud: this.AlInLatitud,
                AlInLongitud: this.AlInLongitud
            }
            
            if(this.selMulPlacas.length==1){
                objAlIn.TaCoId=this.selMulPlacas[0].TaCoId,
                arrObjAlIn.push(objAlIn);

            }else if(this.selMulPlacas.length>1){
                let arrObj:any[]=[];
                for(let i=0; i<this.selMulPlacas.length; i++){
                    arrObj.push({
                        TaCoId: this.selMulPlacas[i].TaCoId,
                        UsFechaReg: new Date(),
                        UsId: this.UsId,
                        EmId: this.emId,
                        AlInId: this.AlInId,
                        AlInFecha: fecha(this.AlInFecha),
                        AlInDescripcion: this.AlInDescripcion,
                        AlInTipo: Number(this.AlInTipo),
                        AlInLatitud: this.AlInLatitud,
                        AlInLongitud: this.AlInLongitud
                    });
                }
                arrObjAlIn=arrObj;
            }

            console.log(arrObjAlIn);
            
            this.servAlertService.guardarAlertaIncidencia(arrObjAlIn).subscribe(
                data=>{console.log(data); this.disFormModMensaje=false;}
            );
            
        }
        
        cancelAlertaIncidencia(){
            this.disFormModMensaje=false;
            this.TaCoId=null;
            this.AlInId=null;
            this.AlInTipo="-1";
        }
        onRowSelectTabTarjControl(event){
            this.TaCoId=event.data.TaCoId;
        }

        onRowSelectAlIn(event){
            console.log(event.data.AlInLatitud);
            console.log(event.data.AlInLongitud);
            this._overlays=[];
            let lat=event.data.AlInLatitud;
            let lng=event.data.AlInLongitud;

            this._addMarker(lat,lng);
            this.disFormUbicacionAlIn=true;
        }

        btnCanModMapaGrid(){

            this.disFormUbicacionAlIn=false;
        }   

        ocultado(event){
            console.log('asfasdfadfs');
        }

        _addMarker(lat:any, lng:any) {
         
                this._overlays.push(new google.maps.Marker({
                    position:{
                                lat: lat, 
                                lng: lng
                             }, 
                    title:'', 
                    draggable: false}));
            //}else if(this.overlays.length==1){}
            //this.markerTitle = null; this.dialogVisible = false;
        }

        /*funciones de mapa
        _handleMapClick(event) {
            this.selectedPosition = event.latLng;
            
            
            let lat=this.selectedPosition.lat();
            let lng=this.selectedPosition.lng();
            console.log(this.selectedPosition.lat());
            console.log(this.selectedPosition.lng());
            this._addMarker(lat,lng);
         
        }*/
}