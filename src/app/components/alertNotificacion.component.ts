import {Component,OnInit} from '@angular/core';

@Component({
    selector: 'app-alertNotif',
    templateUrl	: '../views/alertNotificacion.component.html',
    styleUrls: ['../styles/alertNotificacion.component.css']
})

export class consulAlertNotifComponent implements OnInit{
    mensajes:any[]=[];
    selectedUsers:any[]=[];

    private disFormModMensaje:boolean;
    ngOnInit(){}
    constructor(){
        this.mensajes=[
            {nro:1,tipo:"XK-2334",fecha:"OCTAVIO",Cobrador:"Raul"},
            {nro:2,tipo:"XK-2334",fecha:"HORACIO",Cobrador:"Raul"},
            {nro:3,tipo:"FXE-2334",fecha:"MANUEL",Cobrador:"JOSE"},
            {nro:4,tipo:"XS-2334",fecha:"MIGUEL",Cobrador:"CHICHO"},
            {nro:5,tipo:"GK-2334",fecha:"ARTURO",Cobrador:"KAREN"},
            {nro:6,tipo:"ER-2334",fecha:"ROMULO",Cobrador:"MARIEL"},
            {nro:7,tipo:"HG-2334",fecha:"DANIEL",Cobrador:"ROCIO"},
            {nro:8,tipo:"SD-2334",fecha:"RINGO",Cobrador:"KELLY"},
            {nro:9,tipo:"CV-2334",fecha:"PABLO",Cobrador:"JAQUELINE"},
            {nro:10,tipo:"ZX-2334",fecha:"ANTONIO",Cobrador:"MIA"},
            {nro:11,tipo:"NG-2334",fecha:"CARTAGENA",Cobrador:"PIA"},
            {nro:12,tipo:"FG-2334",fecha:"RAUL",Cobrador:"ANTHUANET"},
            {nro:13,tipo:"UY-2334",fecha:"DENBER",Cobrador:"SANDRO"},
            {nro:14,tipo:"XM-2334",fecha:"ANTHUANT",Cobrador:"BRUNO"}
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