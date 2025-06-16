import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { Role } from 'src/app/Models/User/Role';
import { IUser, User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userlist: IUser = new User();

  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  roles: Role[] = [];
  organizationId: any = '';
  emailExists: boolean = false;
  userData: User[] = [];
  selectedOrganizationId: any;
  formData!: FormGroup;
  organizations: any;
  user: any;
  isCpUser: boolean = false;
  statuses: any = [];
  constructor(
    private router: Router,
    private userService: UserService,
    private builder: FormBuilder,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private commanService: CommanService
  ) {}

  ngOnInit(): void {
    this.getCommonStatuses();
    this.userlist = history.state.userData;
    this.organizationId = history.state.organizationId;
    console.log(history.state.userData);
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
    }
    if (this.user.roleName == 'Channel Partner') {
      this.isCpUser = true;
    }
    this.getAllOrganizations();
    this.initializeForm();
    if (history.state.userData != null) {
      this.isAdding = false;
      this.patchFormData();
    }
    if (this.organizationId > 0) {
      this.fetchUsers();
      this.fetchRoles();
    }

    console.log(this.isCpUser);
  }

  private initializeForm(): void {
    this.formData = this.builder.group({
      userId: [0],
      userName: ['', Validators.required],
      email: ['', this.isCpUser ? [Validators.required, Validators.email] : []],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^(?:[6789]\d{9})$/)],
      ],
      roleId: [0],
      managerId: [0],
      status: ['A'],
      organizationId: [history.state.organizationId],
    });
  }

  saveCpUser() {
    if (this.formData.valid) {
      if (this.isAdding) {
        this.userService
          .saveCpUser(this.formData.value, this.user.userId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              Swal.fire({
                icon: 'success',
                text: 'User Added Successfully',
              });
              this.router.navigate(['layout/users']);
            },
            error: (error: HttpErrorResponse) => {
              const errorMessage =
                error.error?.error || 'An unexpected error occurred';

              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                timerProgressBar: true,
                showConfirmButton: true,
              });
              // this.router.navigate(['layout/users']);
            },
          });
      } else {
        console.log('update');
        this.userService
          .updateUser(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/users']);
            },
            error: (err: any) => {
              console.error('Error updating Workflowstage', err);
            },
          });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill mandatory fields.', // Display the error message from the backend
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }

  patchFormData() {
    console.log(this.userlist);
    this.formData.patchValue(this.userlist);
  }

  save() {
    // const formData = this.formData.value;
    // formData.shiftStartTime = this.formatDateTime(
    //   this.parseTime(formData.shiftStartTime)
    // );
    // formData.shiftEndTime = this.formatDateTime(
    //   this.parseTime(formData.shiftEndTime)
    // );
    //adding workflowstage
    const formData = this.formData.value;

    console.log(formData);
    if (this.formData.valid) {
      console.log('form date vaild');
      if (this.isAdding) {
        this.userService
          .addUser(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              Swal.fire({
                icon: 'success',
                text: 'User added successfully',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              this.router.navigate(['layout/users']);
              this.clearForm();
            },
            error: (error: any) => {
              console.error(error);

              // Assuming the error message comes in the response body like this:
              const errorMessage =
                error?.error?.message || 'An unexpected error occurred';

              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage, // Display the error message from the backend
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
            },
          });
      } else {
        //updating workflowstage
        console.log('update');
        this.userService
          .updateUser(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/users']);
            },
            error: (err: any) => {
              console.error('Error updating Workflowstage', err);
            },
          });
      }
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoUsers() {
    this.router.navigate(['/layout/users']);
  }

  fetchRoles() {
    this.roleService
      .fetchAllRoles(
        '',
        this.selectedOrganizationId > 0
          ? this.selectedOrganizationId
          : this.organizationId
      )
      .subscribe({
        next: (roles: any) => {
          console.log(roles);
          this.roles = roles;
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  fetchUsers() {
    this.userService
      .fetchAllUsers(
        '',
        this.selectedOrganizationId > 0
          ? this.selectedOrganizationId
          : this.organizationId
      )
      .subscribe({
        next: (userData) => {
          console.log(userData);
          this.userData = userData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  onOrganizationSelete = (event: any) => {
    console.log(event.value);
    this.selectedOrganizationId = event.value;
    this.formData.value.organizationId =
      this.selectedOrganizationId > 0
        ? this.selectedOrganizationId
        : this.organizationId;
    this.fetchUsers();
    this.fetchRoles();
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
  getCommonStatuses() {
    this.commanService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  parseTime(timeString: string): Date {
    console.log(timeString, 'parcing');

    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return new Date(1970, 0, 1, hours, minutes); // Use a dummy date
  }
  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  checkEmailUniqueness() {
    const email = this.formData.get('email')?.value;
    this.userService.checkEmail(email).subscribe(
      (response) => {
        // Handle success case if needed
        console.log(response);
      },
      (error) => {
        if (error.status === 409) {
          // Show SweetAlert if email already exists
          Swal.fire({
            icon: 'error',
            title: 'Email already exists',
            text: 'Please enter a different email address.',
            confirmButtonText: 'OK',
          });
        } else {
          // Handle other errors if needed
          console.error('Error occurred:', error);
        }
      }
    );
  }

  checkPhoneNumberExists() {
    const phoneNumber = this.formData.get('phoneNumber')?.value;
    this.userService.checkPhoneNumber(phoneNumber).subscribe(
      (response) => {
        // Handle success case if needed
        console.log(response);
      },
      (error) => {
        if (error.status === 409) {
          // Show SweetAlert if phone number already exists
          Swal.fire({
            icon: 'error',
            title: 'Phone number already exists',
            text: 'Please enter a different phone number.',
            confirmButtonText: 'OK',
          });
        } else {
          // Handle other errors if needed
          console.error('Error occurred:', error);
        }
      }
    );
  }
}
