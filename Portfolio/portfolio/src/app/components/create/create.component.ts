import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { UploadService } from '../../services/upload.service'
import { Global } from '../../services/global'
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [ProjectService, UploadService, UserService]
})
export class CreateComponent implements OnInit{
    
    public title: string;
    public project: Project;
    public status: string;
    public filesToUpload: Array<File>;
    public save_project: any;
    public url: string;
    public token: string;
    public identity: User;
    public preview: any;
    
     //establecemos los valores de los atributos que luego utilizamos en el fichero html
    
    constructor(
        private _projectService: ProjectService,
        private _uploadService: UploadService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = "Create Project";
        this.project = new Project('','','','','',2023,'',new User('','','','','','','admin',''));   
        this.status = "";  
        this.filesToUpload = new Array();
        this.url = Global.url;
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
    }
    
  //al iniciar nos suscribimos a los cambios de los parametros de la ruta y cuando hay un cambio se extrae el 
  //proyecto con la id 
    
    ngOnInit() {
        
        this._route.params.subscribe((params:any) => {
         let id = params.id;
 
         this.getProject(id);
        });
    }
    
    //funcion que devuelve el proyecto segun la id que recibe
    
    getProject(id:any) {
        this._userService.getUser(id).subscribe({
          next: (response:any) => {
            this.project = response.project;
            console.log(response);
          },
          error: (error:any) => {
            console.log(error);
          }
        });
    }
   
   //funcion que recibe los datos del formulario, y los guarda en un proyecto nuevo, 
   //dentro de ella hay otra funcion que se encarga de subir la imagen que añadimosa la carpeta uploads de Node
   //tambien si es satisfactorio o no nos da el valor succes o failed para mostrar mensaje en el front
   
    onSubmit(form: NgForm) {
        
        //guardar datos
        this._projectService.saveProject(this.project).subscribe(
            (response:any) =>{
                
                if(response.project){
                    
                    //subir imagen
                    this._uploadService.makeFileRequest(this.url + "upload/" + response.project._id, [], this.filesToUpload, 'image')
                    .then((result: any)=>{
                       this.save_project = result.project; 
                       this.status = "success"; 
                       console.log(result);    
                    });
                    
                }else {
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
    
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;

            if (fileInput.target.files && fileInput.target.files.length > 0) {
              const reader = new FileReader();
                    reader.onload = (event: any) => {
                      this.preview = event.target.result;
                    };
              reader.readAsDataURL(fileInput.target.files[0]);
            }
    }

}
