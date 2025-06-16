import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import {
  COMPANY_TYPE,
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { CRM_MEMBER_ROLL_NAME } from 'src/app/Constants/Crm/CrmConstants';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { DocumentDto, IDocumentDto } from 'src/app/Models/Crm/dashboard';
import { PaymentDetails } from 'src/app/Models/Crm/PaymentDetails';
import { Project, IProject } from 'src/app/Models/Project/project';
import { Unit } from 'src/app/Models/Project/unit';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { CrmDocumentsService } from 'src/app/Services/CrmServices/crm-documents.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { PaymentDetailsService } from 'src/app/Services/CrmServices/payment-details.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-soa-documents',
  templateUrl: './soa-documents.component.html',
  styleUrls: ['./soa-documents.component.css'],
})
export class SoaDocumentsComponent {
  private destroy$ = new Subject<void>();
  soaDocument: IDocumentDto[] = [];
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  displayedColumns: string[] = [
    'rowNumber',
    'customerName',
    'projectName',
    'unitName',
    'companyType',
    'actions',
  ];
  displayedColumnsDocuments = ['fileName', 'createdDate', 'actions'];
  organizationId: number = 0;
  userId: number = 0;
  roleName: string = '';
  projectId: any;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  unitName = '';
  unitId: number = 0;
  units: Unit[] = [];
  unit: any = new FormControl([] as Unit[]);
  openDialog: boolean = false;
  documentType: string = 'CUSTOMER_SOA_DOCUMENT';
  documents: any;
  noDocuments: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  fristapplicantName: string = '';
  userManageData: any;
  crmMemberRoleName = CRM_MEMBER_ROLL_NAME;

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;
  typeId:number= 0;
  typeName: string = '';
  companyType: any;
  constructor(
    private crmDocumentsService: CrmDocumentsService,
    private commonService: CommanService,
    private projectService: ProjectService,
    private unitService: UnitService,
    private paymentDetails: PaymentDetailsService,
    private loaderService: LoaderService,
    private customerStageService: CustomerStageService,
    private usermanageService: UsermanageService
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getCompanyTypes();
    if (this.crmMemberRoleName.includes(this.roleName)) {
      this.getUsermanageByUserId();
    } else {
      this.fetchProjects();
    }

    // this.fetchProjects();
  }
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
      this.roleName = user.roleName;
    }
  }

  getAllSoaDocuments() {
    this.showLoading();
    this.crmDocumentsService
      .getAllSoaDocument(
        this.projectId,
        this.unitId,
        this.pageIndex,
        this.pageSize,
        this.fristapplicantName,
        this.typeId,
        
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.soaDocument = data.records;
          this.totalItems = data.totalRecords;
          console.log(this.soaDocument);
          this.hideLoading();
          console.log(this.soaDocument);
        },
        error: (error: any) => {
          this.hideLoading();
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          this.projects = projects;

          this.fetchUnits(this.projectId);
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(event: any) {
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.unit.setValue(null);
    this.unitId = 0;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllSoaDocuments();
    this.fetchUnits(this.projectId);
  }
  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
      this.getAllSoaDocuments();
    } else if (query.length == 0) {
      this.projectName = '';
      this.projectId = 0;
      this.fetchProjects();
      this.getAllSoaDocuments();
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
    console.log(this.unitId);
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllSoaDocuments();
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    if (query.length >= 1) {
      this.unitName = query;
      this.getAllUnits(this.unitName);
      this.getAllSoaDocuments();
    } else if (query.length == 0) {
      this.unitName = '';
      this.unitId = 0;
      this.getAllUnits(this.unitName);
      this.getAllSoaDocuments();
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
  generateSoaDocument(applicantId: number,projectName:string) {
    console.log(applicantId);

    this.showLoading();
    this.paymentDetails
      .generateSoa(applicantId,projectName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.hideLoading();
          console.log(response);
          Swal.fire({
            title: 'SOA Document',
            text: 'SOA Document  has been generated successfully!',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ok',
            cancelButtonText: 'Close',
          });
        },
        error: (error) => {
          this.hideLoading();
          console.log(error);
          console.log(error.status);

          if (error.status === 404) {
            Swal.fire({
              title: 'Error',
              text: 'No payment details for this customer',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to generate the SOA Document. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllSoaDocuments();
  }
  downloadDocument(document: any) {
    this.showLoading();
    const documentUrl = document.documentPath;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    }
    this.commonService
      .downLoadDoc(document.documentPath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.downloadFile(response, fileName);
          this.hideLoading();
          Swal.fire({
            title: 'SOA Document Dowload',
            text: 'SOA Document  Downloaded successfully!',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ok',
            cancelButtonText: 'Close',
          });
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error(error);
          if (error) {
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to Download the SOA Document. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        },
      });
  }

  private downloadFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.onClose();
  }

  onClose() {
    this.openDialog = false;
  }

  getDocumentsBasedOnId(applicantId: number) {
    console.log(applicantId);

    this.showLoading();
    const documentType = this.documentType;
    this.commonService
      .getDocumentById(
        applicantId,
        documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.documents = response.records;
          this.hideLoading();
          if (this.documents && this.documents.length > 0) {
            this.openDialog = true;
            this.noDocuments = false;
          } else {
            this.noDocuments = true;
            this.openDialog = true;
          }
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error(error);
        },
      });
  }
  onSearch(customerName: string) {
    if (
      customerName.length >= searchTextLength ||
      customerName.length === searchTextZero
    ) {
      this.fristapplicantName = customerName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllSoaDocuments();
    }
  }
  viewDocument(document: any) {
    this.showLoading();
    const documentUrl = document.documentPath;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    }
    this.commonService
      .downLoadDoc(document.documentPath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.viewFile(response, fileName);
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error(error);
        },
      });
  }

  private viewFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
    this.onClose();
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
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
        this.getAllSoaDocuments();
      },

      error: (err) => {
        // Handle the error here
        console.error('Error fetching user manage data:', err);
      },
    });
  }
  onUnitTypeBelongsChange(event: any) {
      console.log(event);
      if (event.value === 'All') {
        let val = 0;
        this.typeId = val;
      } else {
        this.typeId = event.value;
      }
      this.pageIndex = PAGE_INDEX;
      this.getAllSoaDocuments();
    }
  
    getCompanyTypes() {
      this.commonService
        .getCommanReferanceDetailsWithFilters(COMPANY_TYPE)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.companyType = data;
            const allOption = new CommonReferenceType();
            allOption.id = 0;
            allOption.commonRefValue = 'All';
            this.companyType = [allOption, ...data];
            console.log(this.companyType);
            console.log(this.companyType);
          },
          error: (error: any) => {
            console.error('Error fetching Company Types :', error);
          },
        });
    }
}
