import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';
import { CRM_MEMBER_ROLL_NAME } from 'src/app/Constants/Crm/CrmConstants';
import {
  DocumentUrlDto,
  IProject,
  Project,
} from 'src/app/Models/Project/project';
import { Unit } from 'src/app/Models/Project/unit';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';

import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customerdocumentdisplay',
  templateUrl: './customerdocumentdisplay.component.html',
  styleUrls: ['./customerdocumentdisplay.component.css'],
})
export class CustomerdocumentdisplayComponent implements OnInit {
  destroy$ = new Subject<void>();
  crmMemberRoleName = CRM_MEMBER_ROLL_NAME;
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    if (this.crmMemberRoleName.includes(this.roleName)) {
      this.getUsermanageByUserId();
    } else {
      this.fetchProjects();
    }
    // this.fetchProjects();
  }

  constructor(
    private applicantInfo: ApplicationInfoService,
    private unitService: UnitService,
    private dialog: MatDialog,
    private commanService: CommanService,
    private leadservice: LeadService,
    private customerStageService: CustomerStageService,
    private usermanageService: UsermanageService,
    private loaderService: LoaderService,
    private projectService: ProjectService
  ) {}
  projects: Project[] = [];
  formData!: FormGroup;
  project: FormControl = new FormControl('');
  referanceId: number = 0;
  projectName: string = '';
  projectId: any = 0;
  selectedProject: IProject = new Project();
  user: User = new User();
  unitId: number = 0;
  unitName: string = '';
  units: Unit[] = [];
  userId: number = 0;
  userManageData: any;

  documentsData: DocumentUrlDto[] = [];
  displayedColumns: string[] = ['documentName', 'actions'];
  unit: any = new FormControl([] as Unit[]);
  roleName: string = '';

  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.roleName = this.user.roleName;
      this.userId = this.user.userId;
    }
  }
  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.projectId = event?.option.value?.projectId;
    this.unit.setValue(null);
    this.unitId = 0;
    this.fetchUnits(this.projectId);
    // this.getDocuments(this.unitId);
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
    } else if (event.target.value.length == 0) {
      this.projectName = '';
      this.projectId = 0;
      this.fetchProjects();
    }
  }

  fetchUnits(projectId: number) {
    this.unitService
      .getAllUnitsBasedOnProjectId(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (units) => {
          console.log(units);
          this.units = units;
        },
        error: (error: Error) => {
          console.error('Error fetching units:', error);
        },
      });
  }
  onUnitSelect(event: any) {
    console.log(event.option.value);

    this.unitName = event.option.value.unitName;
    this.unitId = event.option.value.id;
    this.getDocuments(this.unitId);
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    if (query.length >= 1) {
      this.unitName = query;
      this.getAllUnits(this.unitName);
    } else if (query.length == 0) {
      this.unitName = '';
      this.getAllUnits(this.unitName);
    }
  }

  getAllUnits(unitName: string) {
    this.unitService
      .getUnitByName(this.unitName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.records);
          this.units = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getDocuments(unitId: number): void {
    this.showLoading();
    this.applicantInfo
      .getUnitDocuments(unitId, this.roleName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (documentsData) => {
          // Assuming documentsData is already an array of objects
          this.documentsData = documentsData;
          console.log(this.documentsData);
           this.hideLoading();

          // this.currentPage = 0; // Reset to first page
          // this.updatePaginatedDocuments();
        },
        error: (error) => {
           this.hideLoading();
          console.error('Error fetching documents:', error);
        },
      });
  }
  downloadDocument(filePath: string, fileNameFromUi: string): void {
    const decodedUrl = decodeURIComponent(filePath);
    let fileName = fileNameFromUi; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          Swal.fire({
            title: 'Downloaded',
            text: `The file "${fileNameFromUi}" has been downloaded successfully!`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          console.error('Error downloading PDF:', error);
          Swal.fire({
            title: 'Error',
            text: `Failed to download the file "${fileNameFromUi}". Please try again later.`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
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
  private getUsermanageByUserId(): void {
    console.log(this.userId);
    this.usermanageService.getUserManage(this.userId).subscribe({
      next: (response) => {
        console.log('User manage data:', response);
        this.userManageData = response;
        this.projectId = response[0].projectId;
        console.log(this.projectId);
        this.fetchUnits(this.projectId);
      },

      error: (err) => {
        // Handle the error here
        console.error('Error fetching user manage data:', err);
      },
    });
  }

    viewDocuments(fileType: string, filePath: string): void {
      this.showLoading();
      const decodedUrl = decodeURIComponent(filePath);
      let fileName =
        decodedUrl.split('?')[0].split('/').pop() || `${fileType}-document.pdf`;
  
      this.projectService
        .downloadFile(fileType, filePath)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: Blob) => {
            console.log(`${fileType} file received:`, response);
            this.viewFiles(response, fileName);
            this.hideLoading();
          },
          error: (error: Error) => {
            this.hideLoading();
            console.error(`Error downloading ${fileType} file:`, error);
          },
        });
    }

     viewFiles(response: Blob, fileName: string) {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    let mimeType = 'application/octet-stream'; // default fallback

    switch (fileExtension) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
    }

    const blob = new Blob([response], { type: mimeType });
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
