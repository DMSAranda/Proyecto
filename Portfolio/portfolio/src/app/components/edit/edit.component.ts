import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { UploadService } from '../../services/upload.service';
import { Global } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Form } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
 
 
@Component({
  selector: 'app-edit',
  templateUrl: '../create/create.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ProjectService, UploadService]
})
export class EditComponent implements OnInit {
 
  public title: string;
  public project: Project;
  public save_project:any;
  public status: string;
  public filesToUpload: Array<File>;
  public url: string;
  public edit;
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
      this.edit = true;
      this.title = "Edit project";
      this.status = "";
      this.filesToUpload = [];
      this.project = new Project("","","","","",2023,"",new User('','','','','','','admin',''));
      this.url = Global.url;
      this.identity = this._userService.getIdentity();
     }
 
  //al iniciar nos suscribimos a los cambios de los parametros de la ruta y cuando hay un cambio se extrae el 
  //proyecto con la id 
 
  ngOnInit(){
    this._route.params.subscribe((params:any) => {
      let id = params.id;
 
      this.getProject(id);
    });
  }
  
  //funcion que devuelve el proyecto segun la id que recibe
  
  getProject(id:any) {
    this._projectService.getProject(id).subscribe({
      next: (response:any) => {
        this.project = response.project;
        console.log(response);
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }
 
 //funcion que recibe los datos del formulario, y los actualiza en un proyecto creado, 
 //dentro de ella hay otra funcion que se encarga de subir la imagen que añadimos a la carpeta uploads de Node
 //tambien si es satisfactorio o no nos da el valor succes o failed para mostrar mensaje en el front 
   
  onSubmit(form: Form)  {
        
        //guardar datos
        this._projectService.updateProject(this.project).subscribe(
            (response:any) =>{
                
                if(response.project){
                
                    if(this.filesToUpload){
                    
                        //subir imagen
                        this._uploadService.makeFileRequest(this.url + "upload/" + response.project._id, [], this.filesToUpload, 'image')
                        .then((result: any)=>{
                           this.save_project = result.project; 
                           this.status = "success"; 
                           console.log(result);    
                        });
                        
                    }else {
                        this.save_project = response.project; 
                        this.status = "success";   
                    }
                   
                }else this.status = "failed";
            },
            (error:any) =>{
                console.log(<any>error);
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