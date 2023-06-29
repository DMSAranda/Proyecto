import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import { Form, NgForm } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
 
 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService, UploadService ]
})
export class RegisterComponent implements OnInit {
 
  public title: string;
  public user: User;
  public status: string;
  public filesToUpload: Array<File>;
  public save_user: any;
  public url: string;
  public preview: any;
 
  constructor(
             private _userService: UserService,
             private _uploadService: UploadService   
 
    ){
    
    //establecemos los valores de los atributos que luego utilizamos en el fichero html    
        
      this.title = "Register";
      this.status = "";
      this.user = new User('','','','','','','admin','');
      this.url = Global.url;
      this.filesToUpload = new Array();
     }
 
  ngOnInit(){
  }
  
 //funcion que recibe los datos del formulario, y los guarda en un usuario nuevo, 
 //dentro de ella hay otra funcion que se encarga de subir la imagen que añadimos a la carpeta uploads2 de Node
 //tambien si es satisfactorio o no nos da el valor succes o failed para mostrar mensaje en el front 
  
   
  onSubmit(form: NgForm)  {
        
        //guardar datos
        this._userService.createUser(this.user).subscribe(
            (response:any) =>{
                
                if(response.user && response.user._id){
                                     
                  this._uploadService.makeFileRequest(this.url + "upload2/" + response.user._id, [], this.filesToUpload, 'image')
                    .then((result: any)=>{
                       this.save_user = result.user; 
                       this.status = "success"; 
                       form.reset();
                       console.log(result);    
                    });
                                  
                   this.user = new User('','','','','','','admin','');
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
