import { Project } from '../../models/project'
import { ProjectService } from '../../services/project.service'
import { Global } from '../../services/global'
import { Component, DoCheck, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { UploadService } from '../../services/upload.service'
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [ProjectService, UserService]
})
export class ProjectsComponent implements OnInit, DoCheck{
    
    public projects: Project[];
    public url: string;
    public title: string;
    public identity: User;
    public logged: boolean;
    
    //establecemos los valores de los atributos que luego utilizamos en el fichero html
    
    constructor(
        private _projectService: ProjectService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.projects = new Array();
        this.url = Global.url;
        this.title = "Projects";
        this.identity = _userService.getIdentity();
        this.logged = false;
     }
    
    //establecemos el valor del identity 
    
    ngDoCheck(): void {
        this.identity = this._userService.getIdentity();
    }
     
     
    ngOnInit(){
       
        
     /*    if(this.identity !== null){
            this.logged = true;
         }
         
         if(this.logged == true){
             this._route.params.subscribe((params:any) => {
                let id2 = this.identity._id;
                this.getProjects2(id2);
            });
         }
         else{   */
              this.getProjects();
       //  }
    }  
    
    //recuperamos todos los proyectos para mostrarlos en la parte html 
    
    getProjects(){
        this._projectService.getProjects().subscribe(
            (response:any) =>{
                console.log(response);
                this.projects = response.projects;
            },
            (error:any) =>{
                console.log(<any>error);
            }
        );
    }
    
/*    getProjects2(id2:any){
        this._projectService.getProjects2(id2).subscribe({
            next: (response:any) =>{
                console.log(response);
                this.projects = response.projects;
            },
            error: (error:any) =>{
                console.log(<any>error);
            }
        });
    }
    
*/   

}
