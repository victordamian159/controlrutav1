import {Component,OnInit} from '@angular/core';

@Component({
    selector: 'app-alertNotif',
    templateUrl	: '../views/alertNotificacion.component.html',
    styleUrls: ['../styles/alertNotificacion.component.css']
})

export class consulAlertNotifComponent implements OnInit{
    usuarios:any[]=[];
    selectedUsers:any[]=[];

    private disFormModMensaje:boolean;
    ngOnInit(){}
    constructor(){
        this.usuarios=[
            {Nro:1,Placa:"XK-2334",Chofer:"OCTAVIO",Cobrador:"Raul"},
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
            {Nro:14,Placa:"XM-2334",Chofer:"ANTHUANT",Cobrador:"BRUNO"}
        ];
        this.disFormModMensaje=false;
    }
    /* PROCEDURES */
    /* FUNCIONES BTN */
        btnNvoMensaje(){
            this.disFormModMensaje=true;
            console.log(this.selectedUsers);
        }
        guardarMsj(){
            this.disFormModMensaje=false;
        }
        cancelarMsj(){
            this.disFormModMensaje=false;
        }
    /* FUNC VARIADAS */

}