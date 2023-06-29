import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import { Form, NgForm } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { ActivatedRoute, Router } from '@angular/router';
 
 
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [UserService, UploadService ]
})
export class AccountComponent implements OnInit {
 
  public title: string;
  public user: User;
  public status: string;
  public filesToUpload: Array<File>;
  public save_user: any;
  public url: string;
  public token: string;
  public identity: User;
  public preview: any;
 
 
 
  constructor(
             private _userService: UserService,
             private _uploadService: UploadService,  
             private _route: ActivatedRoute,
             private _router: Router
             
         //establecemos los valores de los atributos que luego utilizamos en el fichero html
    ){
      this.title = "Account";
      this.status = "";
      this.identity = this._userService.getIdentity()
      this.token = this._userService.getToken();
      this.user = this.identity;
      this.url = Global.url;
      this.filesToUpload = new Array();
     }
 
  //al iniciar nos suscribimos a los cambios de los parametros de la ruta y cuando hay un cambio se extrae el 
  //usuario con la id del identity almacenada
     
  ngOnInit(){
      this._route.params.subscribe((params:any) => {
      let id = params.id;
 
      this.getUser(this.identity._id);
    });
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
 
  //funcion que comprueba si hay cambios en el identity o el token y los actualiza
 
  ngDoCheck() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
  }
   
  //funcion que recibe los datos del formulario, y los actualiza, dentro de ella hay otra funcion que 
  //actualiza la imagen si cambia y el identity
  //tambien si es satisfactorio o no nos da el valor succes o failed para mostrar mensaje en el front
   
  onSubmit(form: NgForm)  {
        
        //guardar datos
        this._userService.updateUser(this.user).subscribe(
            (response:any) =>{
                
                if(response.user && response.user._id){
                        
                    if(this.filesToUpload){

                        this._uploadService.makeFileRequest(this.url + "upload2/" + response.user._id, [], this.filesToUpload, 'image')
                          .then((result: any)=>{
                             this.save_user = result.user; 
                             localStorage.setItem('identity', JSON.stringify(this.user));
                             this.status = "success"; 
                             
                          });

                    }else {
                        this.save_user = response.user; 
                        localStorage.setItem('identity', JSON.stringify(this.user));
                        this.status = "success";   
                        
                    } 
                      
                }else{
                   this.status = "failed";
                }   
                
            },
            (error:any) =>{
                console.log(<any>error);
                this.status = "failed";
            }
        );
    }
    
    //funcion que detecta cuando hay un cambio en la imagen y la cambia
    
     fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>> fileInput.target.files;
        
          if (fileInput.target.files && fileInput.target.files.length > 0) {
              const reader = new FileReader();
                    reader.onload = (event: any) => {
                      this.preview = event.target.result;
                    };
              reader.readAsDataURL(fileInput.target.files[0]);
            }
    }
    
   
 
}
