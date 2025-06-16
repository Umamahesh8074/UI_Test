import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  RoleReferencePermission,
  IRoleReferencePermission,
} from 'src/app/Models/User/RoleReferencePermission';
import { CommonReferenceType, CommonReferenceTypeDto } from 'src/app/Models/User/CommonReferenceType';
import { CommonreferencetypeService } from 'src/app/Services/UserService/commonreferencetype.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Models/User/User';
// import { RoleReferencePermissionService } from 'src/app/Services/UserService/RoleReferencePermission.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { Role } from 'src/app/Models/User/Role';
import { RoleReferencePermissionService } from 'src/app/Services/UserService/rolereferencepermission.service';
@Component({
  selector: 'app-rolereferencepermission',
  templateUrl: './rolereferencepermission.component.html',
  styleUrls: ['./rolereferencepermission.component.css'],
})
export class RoleReferencePermissionComponent implements OnInit {
  RoleReferencePermission: IRoleReferencePermission =
    new RoleReferencePermission();
    formData!: FormGroup;
    isModalVisible = false;
  isAdding: boolean = true;
  roles: Role[] = [];
  errorMessage: string | null = null;
  organizationId = 0;
  roleId=0;
public user: User = new User();
  private destroy$ = new Subject<void>();
  commonReferenceTypes: CommonReferenceType[] = [];

  constructor(
    private router: Router,
    private roleReferencePermissionService: RoleReferencePermissionService,
    private builder: FormBuilder,
    private commonReferenceTypeService: CommonreferencetypeService,
    private toastrService: ToastrService,
    private roleService: RoleService,
  ) {}

  ngOnInit(): void {


    const user = localStorage.getItem('user');
    this.initializeForm();
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;

      console.log(this.user.organizationId);
      console.log('role ID ' + this.roleId);
    }
    const data = history.state.RoleReferencePermission;

    if (data) {
      this.isAdding = false;
      this.patchFormData(data);
    }


this.fetchRoles();
this.fetchAllCommonReferenceType();
  }


  private initializeForm(): void {
    this.formData = this.builder.group({
      id: [0],
      roleId:[0],
      referenceTypeId:[0]

    });
  }



  save() {
    //adding workflowstage
    console.log(this.formData.value);
    if (this.formData.valid) {
      if (this.isAdding) {
        console.log(this.formData.value);
        this.roleReferencePermissionService
          .addRoleReferencePermission(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/displayrolereferencepermission']);
            },
            error: (err) => {
              console.error('Error adding Menu Item:', err);
              // this.handleError(err);  // Handle the error
          },
          });
      } else {
        this.roleReferencePermissionService
          .editRoleReferencePermission(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/displayrolereferencepermission']);
            },
            error: (err) => {
              console.error('Error updating RoleReferencePermission', err);
            },
          });
      }
    }
  }
  clearForm() {
    this.formData.reset();
  }

  gotoRoleReferencePermission() {
    this.router.navigate(['layout/displayrolereferencepermission']);
  }

  fetchRoles() {
    this.roleService.fetchAllRoles('', this.organizationId).subscribe({
      next: (roles: any) => {
        console.log(roles);
        this.roles = roles;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  private patchFormData(data: any): void {
    console.log(data);
    const roleId = data.roleId;

    console.log(data.toString + 'data for update');

    this.formData.patchValue(data);
    }





  fetchAllCommonReferenceType() {
    this.commonReferenceTypeService.fetchAllCommonReferenceTypeForRole('').subscribe({
      next: (commonReferenceTypes) => {
        console.log(commonReferenceTypes);
        this.commonReferenceTypes = commonReferenceTypes;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}


