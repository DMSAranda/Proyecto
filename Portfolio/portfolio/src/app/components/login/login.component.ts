import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Form } from '@angular/forms';
 
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
 
  public title: string;
  public user: User;
  public status: string;
  public login_user: any;
  public url: string;
  public token: string;
  public gettoken: string;
  public identity: User;
  
  //establecemos los valores de los atributos que luego utilizamos en el fichero html
 
  constructor(
    private _userService: UserService,
    private _route : ActivatedRoute,
    private _router: Router
 
    ){
      this.title = "Login";
      this.status = "";
      this.user = new User("","","","","","","admin","");
      this.url = Global.url;
      this.token = '';
      this.gettoken = '';
      this.identity = new User("","","","","","","admin","");
     }
     
  //al iniciar tomamos los valores del token e identity por consola para comprobar el login   
 
  ngOnInit(){
      
      console.log(localStorage.getItem('identity'));
      console.log(localStorage.getItem('token'));
  }
 
   
  onSubmit(form: Form)  {
        
        //login de usuario guardando objeto usuario
        this._userService.loginUser(this.user, this.gettoken).subscribe(
            (response:any) =>{
                        //PEDIMOS TODOS LOS DATOS DEL USUARIO DE LA API
                        this.identity = response.user;
                        
                        //SI HAY DATOS ENTRAMOS AL IF
                        if(this.identity && this.identity._id){
                               
                               //PONEMOS LA VARIABLE GETTOKEN A TRUE
                               this.gettoken = 'true';
                               
                               //GUARDAMOS EL PASS VACIO EN LA VARIABLE IDENTITY
                               this.identity.pass = '';
                               
                               //GUARDAMOS EL USUARIO IDENTITY EN EL LOCALSTORAGE
                               localStorage.setItem('identity', JSON.stringify(this.identity));
                               
                               //obtener token CON DATOS DEL USUARIO
                               this._userService.loginUser(this.user, this.gettoken).subscribe(
                                   (response:any) =>{
                                                 this.token = response.token; 
                                                 
                                                 //SI NO SE GENERA TOKEN DEVOLVEMOS ERROR
                                                 if(this.token.length <= 0){
                                                     alert('El token no se ha generado');
                                                 
                                                 //SI SE GENERA TOKEN LO GUARDAMOS EN EL LOCALSTORAGE   
                                                 }else{
                                                     localStorage.setItem('token', JSON.stringify(this.token));
                                                     this.status = "success";
                                                     this._router.navigate(['/home']);
                                                 }  
                                                 
                                               },
                                    (error:any) =>{
                                                console.log(<any>error);
                                            }
                                         
                               );
                    //SI NO HAY DATOS DEL USUARIO EN LA API DEVOLVEMOS ERROR     
                    }else alert('Error en el login');
            },
            (error:any) =>{
                console.log(<any>error);
                this.status = "failed";
            }
        );
    }
    
    
 
}