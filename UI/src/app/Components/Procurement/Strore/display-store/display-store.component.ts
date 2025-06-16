import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StoreService } from 'src/app/Services/ProcurementService/Store/store.service';
import { IStore, Store, StoreDto } from 'src/app/Models/Procurement/store';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  pageSizeOptions,
  PAGE_SIZE,
  PAGE_INDEX,
  TOTAL_ITEMS,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import { IProject, Project } from 'src/app/Models/Project/project';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { User } from 'src/app/Models/User/User';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommanService } from 'src/app/Services/CommanService/comman.service';

@Component({
  selector: 'app-display-store',
  templateUrl: './display-store.component.html',
  styleUrls: ['./display-store.component.css'],
})
export class DisplayStoreComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  public user: User = new User();
  rowData?: StoreDto[] = [];
  store: IStore = new Store();
  dataSource = [];

  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  selectedProject: IProject = new Project();
  projectId: number = 0;
  organizationId = 0;
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  projectName: string = '';

  contactNumber: string = '';
  storeName: string = '';
  storeStatus: string = '';

  displayedColumns: string[] = [
    'rowNumber',
    'project',
    'storeName',
    'contactNumber',
    'billingGstNumber',
    'billingAddress',
    'actions',
  ];

  constructor(
    private storeService: StoreService,
    private router: Router,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private commonService: CommanService
  ) {}

  ngOnInit(): void {
    this.getDataFromState();
    this.setUserFromLocalStorage();
    this.getProjects();
    this.getStores();
  }

  getDataFromState() {
    const { displayPageData } = history.state;
    console.log(displayPageData);
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.selectedProject = displayStatePageData.selectedProject;
      this.storeName = displayPageData.storeName;
      this.contactNumber = displayPageData.contactNumber;
      this.pageSize = displayPageData.pageSize;
      this.pageIndex = displayPageData.pageIndex;
      this.patchFormValues();
    }
  }

  patchFormValues() {
    if (this.selectedProject) {
      this.project.patchValue(this.selectedProject);
      this.projectId = this.selectedProject.projectId;
    }
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.organizationId = user.organizationId;
    }
  }

  getStores() {
    this.storeService
      .getAllStorePage(
        this.storeName,
        this.projectId,
        this.pageIndex,
        this.pageSize,
        this.contactNumber
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.totalItems = data.totalRecords;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.dataSource = data.records;
        },
        error: (error) => {
          console.error('Error fetching stores:', error);
        },
      });
  }

  onSearch(storeName: string) {
    this.storeName = storeName;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getStores();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getStores();
  }

  addStore() {
    this.router.navigate(['/layout/store/form'], {
      state: {
        isAdding: true,
        displayPage: {
          selectedProject: this.selectedProject,
          storeName: this.storeName,
          contactNumber: this.contactNumber,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  onSearchContactNumber(event: any) {
    const query = event.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.contactNumber = query;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getStores();
    }
  }

  onSearchStoreName(event: any) {
    const query = event.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.storeName = query;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getStores();
    }
  }

  onEdit = (storeId: number) => {
    if (storeId != null) {
      this.storeService.getStore(storeId).subscribe((store) => {
        this.store = store;
        //   this.storeService
        //     .getInchargeByStoreId(storeId)
        //     .subscribe((incharges) => {
        //       this.store.selectedInChargesId = incharges.map(
        //         (incharge: any) => incharge.inchargeId
        //       );
        this.router.navigate(['layout/store/form'], {
          state: {
            store: this.store,
            displayPage: {
              selectedProject: this.selectedProject,
              storeName: this.storeName,
              contactNumber: this.contactNumber,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
            },
          },
        });
        // });
      });
    }
  };

  openConfirmDialog(storeId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Are you sure you want to delete this store?' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteStore(storeId);
        }
      }
    );
  }

  deleteStore(storeId: number) {
    this.storeService.deleteStore(storeId).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
        this.getStores();
      },
      error: (error) => {
        console.error('Error deleting store:', error);
      },
    });
  }
  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  searchProject(event: any): void {
    this.paginator.firstPage();
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.getProjects();
    }
  }

  getProjects() {
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
          allOption.projectName = 'All';
          this.projects = [allOption, ...projects];
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  onProjectSelect(event: any) {
    this.paginator.firstPage();
    this.selectedProject = event.option.value;
    this.projectId = event.option.value.projectId;
    this.getStores();
  }

  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  resetForm() {
    const project = new Project();
    project.projectId = 0;
    project.projectName = 'All';
    this.project.reset(project);
    this.projectId = 0;

    this.storeName = '';
    this.contactNumber = '';
    this.selectedProject = new Project();
    this.getStores();
  }
}
