import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../app/services/user.service'
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent implements OnInit, DoCheck{
   
    public title: string;
    public identity: User;
    public token: string;
    public user: User;
    public check_user: any;
    
    //establecemos los valores de los atributos que luego utilizamos en el fichero html

    constructor(
            private _userService : UserService,
            private _route : ActivatedRoute,
            private _router : Router
    ){
        this.title = "Portfolio";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
       
      }
      
    //comprobamos si hay cambio el identity y el token
      
    ngDoCheck() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }
    
    //al arrancar si hay identity en el localstorage sacamos el usuario con su id y 
    //comprobamos si ha expirado el token

    ngOnInit(){
        if(this.identity){
            this.getUser(this.identity._id);
            this.checkExpired();
        }
        
       
    }  
    //funcion para cerrar sesion, borrando el localstorage y borrando los datos del identity y el token
    
    logout(){
        localStorage.clear();
        this.identity = new User('','','','','','','','');
        this.token = '';
        this._router.navigate(['/home'])
    }
    
    //funcion que devuelve el usuario segun la id que recibe
    
    getUser(id:any) {
        this._userService.getUser(id).subscribe({
          next: (response:any) => {
            this.user = response.user;

          },
          error: (error:any) => {
            console.log(error);
          }
        });
      }
    
    checkExpired(){
            
        //COMPROBAMOS SI EL TOKEN SE HA CADUCADO A TRAVES DE LOS DATOS DEL IDENTITY
        this._userService.byPass(this.user).subscribe(
      
               //SI HAY RESPUESTA DE USUARIO ES QUE EL TOKEN NO HA CADUCADO 
                (response: User) => {
                  console.log("verificado");

               //SI LA API NO DEVUELVE UN USUARIO EL TOKEN A CADUCADO Y CERRAMOs SESION       
                },
                (error: any) => {
                  console.error(error);
                  this.logout();
                }
       );
    }
    
    

}



