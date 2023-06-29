import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project'
import { ProjectService } from '../../services/project.service'
import { Global } from '../../services/global'
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [ProjectService, UserService]
  
})
export class DetailComponent implements OnInit{
    
    public url: string;
    public project: Project;
    public confirm: boolean;
    public logged: boolean;
    public identity: User;
    public title: string;
    public user: User;
    
    //establecemos los valores de los atributos que luego utilizamos en el fichero html
    
    
    constructor(
        private _projectService: ProjectService,
        private _userService: UserService,
        private _router: Router,
        private _route: ActivatedRoute
    ){
        this.url = Global.url;
        this.title = "Project";
        this.project = new Project("","","","","",0,"",new User('','','','','','','admin',''));
        this.confirm = false;
        this.logged = false;
        this.identity = _userService.getIdentity();
        this.user = new User('','','','','','','admin','');
        
      }
    
    ngOnInit(): void {
       
    //si el valor del identity de localstorage es diferente a null establecemos el valor de logueado en true
       
        if(this.identity !== null){
            this.logged = true;
        }
       
    //al iniciar nos suscribimos a los cambios de los parametros de la ruta y cuando hay un cambio se extrae el 
    //usuario con la id 
  
        this._route.params.subscribe((params: any) => {
            let id = params['id'];
            this.getProject(id);
            
        });
               
    }
    
    //funcion que devuelve el proyecto segun la id que recibe y el usuario segun la id del proyecto asociado que recibe
    
    getProject(id: any): void{
        this._projectService.getProject(id).subscribe(
            (response: any) => {
                this.project = response.project;
                    console.log(this.project);
                this.user = this.project.user;
                    console.log(this.user._id);
            },
            (error: any) => {
                console.log(<any>error);
            }      
        )
    }
    
    //funcion que devuelve el usuario segun la id que recibe
    
    getUser(id: any) {
            this._userService.getUser(id).subscribe({
            next: (response: any) => {
                // Asignar los datos del usuario al atributo usuario del proyecto
                this.user = response.user;
                console.log(response);
            },
            error: (error: any) => {
                console.log(error);
                },
            });
    }
    
    //funcion que establece el valor confirm a true o false
        
    setConfirm(confirm: boolean){
        this.confirm = confirm;
    }
    
    //funcion que borra el proyecto segun la id que recibe
    
    deleteProject(id: any){
        this._projectService.deleteProject(id).subscribe(
             (response: any) => {
                    this._router.navigate(['/projects']);
                    //this.project = response.project;
                              
            },
            (error: any) => {
                console.log(<any>error);
            }      
        )
    }
    
    //funcion que actualiza el proyecto segun el proyecto que recibe
    
    updateProject(project: Project){
        this._projectService.updateProject(project).subscribe(
             (response: any) => {
                    this.project = response.project;
                              
            },
            (error: any) => {
                console.log(<any>error);
            }      
        )
    }

}
