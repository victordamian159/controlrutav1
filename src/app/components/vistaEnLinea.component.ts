import {Component,OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
declare var google: any;

@Component({
    selector: 'app-vistaEnLinea',
    templateUrl	: '../views/vistaEnLinea.component.html',
    styleUrls: ['../styles/vistaEnLinea.component.css']
})

export class consulVistaEnLineaComponent implements OnInit{
    private options: any;
    private overlays: any[];
    private dialogVisible: boolean;
    private markerTitle: string;
    private selectedPosition: any;
    private infoWindow: any;
    private draggable: boolean;
    private msgs: Message[] = [];
    private placas:any[]=[];
    
    ngOnInit() {
        this.options = {
            center: {lat: 36.890257, lng: 30.707417},
            zoom: 12
        };
        
        this.initOverlays();
        
        this.infoWindow = new google.maps.InfoWindow();
    }
    constructor(){
        this.placas=[{Nro:1,Placa:"XK-2334",Chofer:"OCTAVIO",Cobrador:"Raul"},
        {Nro:2,Placa:"XK-2334",Chofer:"HORACIO",Cobrador:"Raul"},
        {Nro:3,Placa:"FXE-2334",Chofer:"MANUEL",Cobrador:"JOSE"},
        {Nro:4,Placa:"XS-2334",Chofer:"MIGUEL",Cobrador:"CHICHO"},
        {Nro:5,Placa:"GK-2334",Chofer:"ARTURO",Cobrador:"KAREN"},
        {Nro:6,Placa:"ER-2334",Chofer:"ROMULO",Cobrador:"MARIEL"},
        {Nro:7,Placa:"HG-2334",Chofer:"DANIEL",Cobrador:"ROCIO"},
        {Nro:8,Placa:"SD-2334",Chofer:"RINGO",Cobrador:"KELLY"},
        {Nro:9,Placa:"CV-2334",Chofer:"PABLO",Cobrador:"JAQUELINE"},
        {Nro:10,Placa:"ZX-2334",Chofer:"ANTONIO",Cobrador:"MIA"},
        {Nro:11,Placa:"NG-2334",Chofer:"CARTAGENA",Cobrador:"PIA"},
        {Nro:12,Placa:"FG-2334",Chofer:"RAUL",Cobrador:"ANTHUANET"},
        {Nro:13,Placa:"UY-2334",Chofer:"DENBER",Cobrador:"SANDRO"},
        {Nro:14,Placa:"XM-2334",Chofer:"ANTHUANT",Cobrador:"BRUNO"}];
    }
    handleMapClick(event) {
        this.dialogVisible = true;
        this.selectedPosition = event.latLng;
    }
    
    handleOverlayClick(event) {
        this.msgs = [];
        let isMarker = event.overlay.getTitle != undefined;
        
        if(isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow.setContent('' + title + '');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
            
            this.msgs.push({severity:'info', summary:'Marker Selected', detail: title});
        }
        else {
            this.msgs.push({severity:'info', summary:'Shape Selected', detail: ''});
        }        
    }
    
    addMarker() {
        this.overlays.push(new google.maps.Marker({position:{lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng()}, title:this.markerTitle, draggable: this.draggable}));
        this.markerTitle = null;
        this.dialogVisible = false;
    }
    
    handleDragEnd(event) {
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Marker Dragged', detail: event.overlay.getTitle()});
    }
    
    initOverlays() {
        if(!this.overlays||!this.overlays.length) {
            this.overlays = [
                new google.maps.Marker({position: {lat: -17.990872799999998, lng: -70.251051}, title:"Konyaalti"}),
                new google.maps.Marker({position: {lat: 36.883707, lng: 30.689216}, title:"Ataturk Park"}),
                new google.maps.Marker({position: {lat: 36.885233, lng: 30.702323}, title:"Oldtown"}),
                new google.maps.Polygon({paths: [
                    {lat: 36.9177, lng: 30.7854},{lat: 36.8851, lng: 30.7802},{lat: 36.8829, lng: 30.8111},{lat: 36.9177, lng: 30.8159}
                ], strokeOpacity: 0.5, strokeWeight: 1,fillColor: '#1976D2', fillOpacity: 0.35
                }),
                new google.maps.Circle({center: {lat: 36.90707, lng: 30.56533}, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500}),
                new google.maps.Polyline({path: [{lat: 36.86149, lng: 30.63743},{lat: 36.86341, lng: 30.72463}], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
            ];
        }
    }
    
    zoomIn(map) {
        map.setZoom(map.getZoom()+1);
    }
    
    zoomOut(map) {
        map.setZoom(map.getZoom()-1);
    }
    
    clear() {
        this.overlays = [];
    }
}