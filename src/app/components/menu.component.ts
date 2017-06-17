import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl	: '../views/menu.component.html',
    styleUrls: ['../styles/menu.component.css']
})

export class menuComponent implements OnInit{
    ngOnInit(){
        console.log("menu principal");
    }
}