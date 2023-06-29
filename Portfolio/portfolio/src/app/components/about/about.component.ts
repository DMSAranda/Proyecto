import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit{
    
    public title: string;
    public subtitle: string;
    public email: string;
    public habilities: string;
    
    //establecemos los valores de los atributos que luego utilizamos en el fichero html
    
    constructor(){
        this.title = "David Muñoz del Sastre";
        this.subtitle = "Frelance Worker";
        this.habilities = "Web & Graphic Developer, Full Stack Developer, TI, Social Media" 
        this.email = "dmsaranda@informaticos.com";
    }
    
    
    ngOnInit(): void {
       
    }

}
