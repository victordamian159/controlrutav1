import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';

//import {DatosCompartidosService} from '../service/dataComunicationApp.service';




@Component({
    selector: 'app-username',
    templateUrl:'../views/userName.component.html',
    /*styleUrls:['./styles.css']*/
    styleUrls:['../styles/userName.component.css'] 
})

export class userNameComponent implements OnInit{
    //variables
    
    ngOnInit(){

    }
    constructor(){

    }
    showUserName(event):void{
        alert(event);
    }
}