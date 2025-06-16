import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CustomerLegalDocument, ICustomerLegalDocument, IProject, IProjectDocuments, Project, ProjectDocuments, ProjectDto } from 'src/app/Models/Project/project';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { User } from 'src/app/Models/User/User';
import { PageEvent } from '@angular/material/paginator';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';

@Component({
  selector: 'app-customer-legal-document-page',
  templateUrl: './customer-legal-document-page.component.html',
  styleUrls: ['./customer-legal-document-page.component.css']
})
export class CustomerLegalDocumentPageComponent {

  destroy$ = new Subject<void>();
  documentData: ProjectDocuments[] = [];
  documentDetail: IProjectDocuments = new ProjectDocuments();
  user: User = new User();
  organizationId: number = 0;
  displayedColumns: string[] = ['rowNumber', 'documentName','projectName', 'actions'];


  pageSizeOptions = pageSizeOptions;

  pageSize: number = 15;
  pageIndex: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
 formData!: FormGroup;
 projects: Project[] = [];
   project: FormControl = new FormControl('');
    referanceId:number=0;
     projectName: string = '';
     projectId: number = 0;

     selectedProject: IProject = new Project();
     roleName:string=''
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    //this.refreshProject();
    this.fetchProjects();
  }

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private commanService: CommanService,
    private customerStages:CustomerStageService,
    private leadservice:LeadService,
    private loaderService: LoaderService,
    private customerStageService:CustomerStageService

  ) {}

  //getting logged in user data from local storage
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.roleName=this.user.roleName
      this.getDocument();
    }
  }

  

  //get all projects
  getDocument() {
    this.showLoading();
    
    this.projectService
      .getCustomerLegalDocument(

        "CUSTOMER_LEGAL_DOCUMENT", this.projectName,this.projectId
        ,this.pageIndex, this.pageSize,this.roleName
       )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data);
           this.documentData = data.records; // Adjust based on API response
           this.totalItems = data.totalRecords; 
           this.hideLoading();
        },
        error: (error) => {
          this.hideLoading();
          console.log(error.error);
        },
      });
  }

  addDocument() {
    this.router.navigate(['layout/savelegalcustomerdocument']);
  }


  downloadCustomerDocument(demandLetterUrl: string) {


    const decodedUrl = decodeURIComponent(demandLetterUrl);
    let fileName = 'Legal Document'; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.customerStages
    .generateDemandLetterPdf(demandLetterUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          // Swal.fire({
          //   title: 'Downloaded',
          //   text: 'Your Demand Letter has been downloaded successfully!',
          //   icon: 'success',
          //   confirmButtonText: 'OK',
          // });
        },
        error: (error: Error) => {
          console.error('Error downloading PDF:', error);
          // Swal.fire({
          //   title: 'Error',
          //   text: 'Failed to download the PDF. Please try again later.',
          //   icon: 'error',
          //   confirmButtonText: 'OK',
          // });
        },
      });
  }
  downloadFile(response: Blob, fileName: string): void {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getDocument();
  }

  // fetchProject(projectId: number) {
  //   this.projectService.getProjectById(projectId).subscribe({
  //     next: (project) => {
  //       this.selectedProject = project;
  //       this.project.setValue(project);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching project:', error);
  //     },
  //   });
  // }
  
  clearModalFilters() {
    this.projectId = 0;
    console.log(this.selectedProject.projectName);
    this.selectedProject = new Project();
    console.log(this.selectedProject.projectName);
    // this.projects=[];
    // console.log(this.projects)
  }
  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.projectId = event?.option.value?.projectId;
   this.getDocument() ;
    
      

    }
  

    fetchProjects() {
      this.leadservice
        .fetchProjects(this.projectName, this.user.organizationId)
        .subscribe({
          next: (projects) => {
            this.projects = projects;
          },
          error: (error) => {
            console.error('Error fetching projects:', error);
          },
        });
    }
    searchProject(event: any) {
      if (event.target.value.length >= 3) {
        console.log(event.target.value);
        this.projectName = event.target.value;
        this.fetchProjects();
        this.getDocument() ;
      } else if (event.target.value.length == 0) {
        this.projectName = '';
        this.projectId = 0;
        // if (this.dashboard) {
        //   this.getDashBoardLeadsDetailsV1();
        // } else {
        //   this.getDashBoardLeadsDetails();
        // }
        this.fetchProjects();
        this.getDocument() ;
      }
    }

  viewDocument(filePath: string) {
    this.showLoading();
    const documentUrl = filePath;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Demand Letter';
    }

    // Pass the filePath directly to the service method
    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.viewFile(response, fileName);
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error downloading PDF:', error);
        },
      });
  }
  viewFile(response: Blob, fileName: string) {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
   
}

