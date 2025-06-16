import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { NAVIGATE_TO_ADD_VENDOR } from 'src/app/Constants/WorkOrder/workorder';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IUser, User } from 'src/app/Models/User/User';
import {
  IVendor,
  Vendor,
  VendorDto,
} from 'src/app/Models/WorkOrder/VendorData';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CommanDocumentService } from 'src/app/Services/CommanService/document.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';

@Component({
  selector: 'app-displayvendor',
  templateUrl: './displayvendor.component.html',
  styleUrls: ['./displayvendor.component.css'],
})
export class DisplayvendorComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  vendorData: VendorDto[] = [];
  vendor: IVendor = new Vendor();
  documents: any;
  phoneNumber: string = '';
  openDialog: boolean = false;
  user: IUser = new User();
  loggedInUserId: number = 0;
  organizationId: number = 0;
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  userId: number = 0;
  status: string = '';
  vendorName: string = '';
  vendorCode: string = '';
  vendorType: string = '';
  projectName: string = '';
  vendorEmail: string = '';
  companyName: string = '';
  vendorPhoneNumber: string = '';
  pageSizeOptions = pageSizeOptions;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;
  projectId: number = 0;
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);

  displayedColumns: string[] = [
    'rowNumber',
    'name',
    'vendorCode',
    'vendorType',
    'dateOfJoining',
    'projectName',
    'phonenumber',
    'email',
    'companyname',
    'actions',
  ];
  displayedColumnsDocuments = ['fileName', 'createdDate', 'actions'];

  ngOnInit(): void {
    this.getDataFromState();
    this.fetchVendors();
    this.vendorService.refreshRequired.subscribe(() => {
      this.fetchVendors();
    });
    this.setUserFromLocalStorage();
    this.fetchProjects();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.loggedInUserId = user.userId;
      this.organizationId = user.organizationId;
    }
  }
  constructor(
    private vendorService: vendorService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private commanService: CommanService,
    private commanDocumentService: CommanDocumentService,
    private projectService: ProjectService,
    private loaderService: LoaderService
  ) {}

  getDataFromState() {
    const { statePageSize, statePageIndex } = history.state;
    if (statePageSize && statePageIndex !== undefined) {
      this.pageSize = statePageSize;
      this.pageIndex = statePageIndex;
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchVendors();
  }

  fetchVendors() {
    this.showLoading();
    this.vendorService
      .getAllvendors(
        this.pageIndex,
        this.pageSize,
        this.vendorName,
        this.vendorCode,
        this.vendorType,
        this.phoneNumber,
        this.vendorEmail,
        this.companyName,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorData) => {
          this.totalItems = vendorData.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
          this.vendorData = vendorData.records;
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  onSearch(vendorName: string) {
    if (
      vendorName.length >= searchTextLength ||
      vendorName.length === searchTextZero
    ) {
      this.vendorName = vendorName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchVendors();
    }
  }

  openConfirmDialog(vendorId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Vendor' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.inActivateVendor(vendorId);
        }
      }
    );
  }

  inActivateVendor(vendorId: number) {
    this.showLoading();
    this.vendorService
      .inActivateVendor(vendorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.handleSuccessResponse(response);
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  addVendor() {
    this.router.navigate([NAVIGATE_TO_ADD_VENDOR], {
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
      },
    });
  }

  editVendor(vendorData: Vendor) {
    this.fetchVendorById(vendorData.id);
  }

  fetchVendorById(vendorId: number) {
    this.showLoading();
    this.vendorService
      .getAllvendorsById(vendorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorData) => {
          this.vendor = vendorData;
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_ADD_VENDOR], {
            state: {
              vendor: vendorData,
              isAdding: false,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
            },
          });
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  viewDownLoads(vendorData: Vendor) {
    const vendorId = vendorData.id;
    this.phoneNumber = vendorData.contactNumber;
    if (vendorId) {
      this.getDocumentsBasedOnId(vendorId);
    }
  }

  getDocumentsBasedOnId(vendorId: number) {
    const documentType = 'VENDOR_DOCUMENTS';
    this.commanService
      .getDocumentById(
        vendorId,
        documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.documents = response.records;
          this.documentTotalItems = response.totalRecords;
          if (this.documents) {
            this.openDialog = true;
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  downloadDocument(document: any) {
    this.commanDocumentService.downloadDocument(document);
  }

  onSearchVendorCode(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.vendorCode = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchVendors();
    }
  }
  onSearchVendorType(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.vendorType = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchVendors();
    }
  }

  onSearchPhoneNumber(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.phoneNumber = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchVendors();
    }
  }
  onSearchEmail(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.vendorEmail = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchVendors();
    }
  }
  onSearchCompanyName(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.companyName = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchVendors();
    }
  }

  //fetch projects based on organization id
  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        '',
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          const allOption = new Project();
          allOption.projectId = 0;
          allOption.displayProjectName = 'All';
          this.projects = [allOption, ...projects];
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : '';
  }
  onProjectSelect(project: any) {
    this.projectId = project.option.value.projectId;
    this.fetchVendors();
  }
  searchProject(project: any) {
    const query = project.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.fetchProjects();
    }
    if (query.length === searchTextZero) {
      this.projectId = 0;
      this.fetchVendors();
    }
  }

  onDocumentPageChange(event: any) {
    this.documentPageSize = event.pageSize;
    this.documentPageIndex = event.pageIndex;
    this.getDocumentsBasedOnId(this.vendor.id);
  }

  viewDocument(document: any) {
    const documentUrl = document;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Work_Order';
    }
    this.commanService
      .downLoadDoc(document)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.viewFile(response, fileName);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  private viewFile(data: Blob, _filename: string): void {
    const url = window.URL.createObjectURL(data);
    window.open(url);
  }

  onClose() {
    this.openDialog = false;
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
