import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
 
    ngOnInit(): void {
          
       /*    $('.bxslider').bxSlider({
                mode: 'fade',
                captions: true,
                slideWidth: 800
           });
        */
     //integramos el carrusel de bootstrap y le damos el tiempo de rotacion de imagenes a 3 seg
        
        $('.carousel').carousel({
             interval: 3000
          })  
    }

}
