import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  COMMON_DASHBOARDS,
  COMMON_STATUS,
} from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { IRole, Role } from 'src/app/Models/User/Role';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css'],
})
export class AddRoleComponent implements OnInit {
  role: IRole = new Role();
  isAdding: boolean = true;
  organizationId: any;
  organizationName: any;
  selectedOrganizationId: any;
  organization = new FormControl<string>('');
  formData!: FormGroup;
  private destroy$ = new Subject<void>();
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private roleService: RoleService,
    private builder: FormBuilder,
    private organizationService: OrganizationService,
    private commonService: CommanService,
    private toastrService: ToastrService

  ) {}
  organizations: any;
  statuses: any;
  dashBoards: CommonReferenceType[] = [];
  ngOnInit(): void {
    this.getCommonStatuses();
    this.getAllOrganizations();
    console.log(JSON.stringify(history.state));
    if (
      history.state.organizationId != null ||
      history.state.organizationId == 0
    ) {
      this.organizationId = history.state.organizationId;
      console.log(this.organizationId);
    }
    this.initializeForm();
    if (history.state.role != null && this.role !== undefined) {
      this.isAdding = false;
      this.role = history.state.role;
      this.patchFormData();
    }

    this.getCommonDashboards();
  }

  initializeForm() {
    this.formData = this.builder.group({
      roleId: [],
      roleName: ['', Validators.required],
      status: ['A'],
      organizationId: [
        this.organizationId == 0
          ? this.selectedOrganizationId
          : this.organizationId,
      ],
      homePageId: ['0', Validators.required],
    });

    console.log(this.formData.value);
  }

  patchFormData() {
    console.log(this.role);
    this.formData.patchValue(this.role);
  }
  save() {
    //adding menu
    console.log(this.formData);
    if (
      this.formData.valid &&
      this.formData.dirty &&
      this.formData.value.homePageId &&
      this.formData.value.homePageId !== 0
    ) {
      if (this.isAdding) {
        this.roleService
          .addRole(
            this.formData.value,
            this.selectedOrganizationId > 0
              ? this.selectedOrganizationId
              : this.organizationId
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/role']);
              console.log(resp);
            },
            error: (err) => {
              console.error('Error adding Menu Item:', err);
              this.handleError(err);  // Handle the error
          },
          });
      } else {
        //updating menu
        this.roleService
          .updateRole(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/role']);
            },
            error: (err) => {
              console.error('Error adding Menu Item:', err);
              this.handleError(err);  // Handle the error
          },
          });
      }
    } else {
      console.error('Form is invalid');
      Object.keys(this.formData.controls).forEach((key) => {
        this.formData.controls[key].markAsTouched(); // Mark each field as touched to trigger error messages
      });
      if (
        !this.formData.value.homePageId ||
        this.formData.value.homePageId === 0 ||
        this.formData.value.homePageId === '0'
      ) {
        this.formData.get('homePageId')?.setErrors({ required: true });
        console.error('homePageId is invalid');
      }
      if (!this.formData.dirty && !this.isAdding) {
        Swal.fire({
          icon: 'info',
          text: 'No changes are detected in page !',
          timerProgressBar: true,
          timer: 2000,
        });
      }
    }
  }



  private handleError(err: any): void {
    console.error('Error saving/updating menu:', err.error.message);
    this.toastrService.error('Failed', err.error.message, {
      timeOut: 3000, // Set success timeout
    });

  }

  clearForm() {
    this.formData.reset();
  }

  gotoRoles() {
    this.router.navigate(['layout/role']);
  }

  onOrganizationSerach(searchText: any) {
    this.organizationName = searchText;
    this.getAllOrganizations();
    //this.getallRoles(this.roleName, this.organizationId);
  }

  onOrganizationSelete = (event: any) => {
    console.log(event.value);
    this.selectedOrganizationId = event.value;
    this.formData.value.organizationId =
      this.selectedOrganizationId > 0
        ? this.selectedOrganizationId
        : this.organizationId;
    console.log(this.formData.value);
  };

  getAllOrganizations() {
    this.organizationService.getAllOrganizations().subscribe({
      next: (data) => {
        console.log(data);
        this.organizations = data.records;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  displayOrganization(organization: any): string {
    return organization && organization.organizationName
      ? organization.organizationName
      : '';
  }

  getCommonStatuses() {
    this.commonService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  getCommonDashboards() {
    this.commonService.fetchCommonReferenceTypes(COMMON_DASHBOARDS).subscribe({
      next: (data) => {
        console.log(data);
        this.dashBoards = data;
        console.log(this.dashBoards);
        this.setDefaultDashBoard();

        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  setDefaultDashBoard() {
    const defaultHomePathId = this.dashBoards.find(
      (dashBoard) => dashBoard.id === this.role.homePageId
    );
    if (defaultHomePathId) {
      this.formData.patchValue({ homePageId: defaultHomePathId.id });
    } else {
      this.formData.patchValue({ homePageId: '0' });
    }
    console.log(this.formData.value);
  }
  dashBoardValue(e: any) {
    console.log(e.value + '- ' + typeof e.value);
    if (e.value === '' || e.value === 0 || e.value === '0') {
      this.formData.get('homePageId')?.setErrors({ required: true });
    } else {
      this.formData.get('homePageId')?.setErrors(null);
    }
  }
}
