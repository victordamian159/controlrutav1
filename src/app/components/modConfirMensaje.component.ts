import {Component,OnInit,Input,Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-ConfMnj',
    templateUrl	: '../views/modConfirMensaje.component.html',
    styleUrls: ['../styles/modConfirMensaje.component.css']
})

export class modConfirMnjComponent implements OnInit{
    @Input() mensaje:string;
    @Output() checked:EventEmitter<boolean>= new EventEmitter<boolean>();
    
    ngOnInit(){}
    constructor(){}

    funcAceptar():void{
        this.checked.emit(true);
    }
}