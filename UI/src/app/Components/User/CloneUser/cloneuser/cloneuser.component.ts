import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IUser, User } from 'src/app/Models/User/User';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-cloneuser',
  templateUrl: './cloneuser.component.html',
  styleUrls: ['./cloneuser.component.css'],
})
export class CloneuserComponent {
  public loginUser: User = new User();
  target = new FormControl<IUser>({});
  source = new FormControl<IUser>({});
  sourceUser: IUser = new User();
  targetUser: IUser = new User();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();

  organizationId: any = '';
  sourceUsersList: User[] = [];
  targetUsersList: User[] = [];
  selectedOrganizationId: any;
  formData!: FormGroup;
  organizations: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private builder: FormBuilder,
    private roleService: RoleService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.loginUser = JSON.parse(user);
      console.log(this.loginUser.organizationId);
      this.organizationId = this.loginUser.organizationId;
      console.log(this.organizationId);
    }
    this.getAllOrganizations();

    this.fetchUsers();
    //this.fetchRoles();
  }

  // fetchRoles() {
  //   this.roleService
  //     .fetchAllRoles(
  //       '',
  //       this.selectedOrganizationId > 0
  //         ? this.selectedOrganizationId
  //         : this.organizationId
  //     )
  //     .subscribe({
  //       next: (roles: any) => {
  //         console.log(roles);
  //         this.roles = roles;
  //       },
  //       error: (error: any) => {
  //         console.error(error);
  //       },
  //     });
  // }

  fetchUsers() {
    this.userService.fetchAllUsers('', this.organizationId).subscribe({
      next: (userData) => {
        console.log(userData);
        this.sourceUsersList = userData;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  // onOrganizationSelete = (event: any) => {
  //   console.log(event.value);
  //   this.selectedOrganizationId = event.value;
  //   this.formData.value.organizationId =
  //     this.selectedOrganizationId > 0
  //       ? this.selectedOrganizationId
  //       : this.organizationId;
  //   this.fetchUsers();
  //   // this.fetchRoles();
  //   console.log(this.formData.value);
  // };

  getAllOrganizations() {
    this.organizationService.getAllOrganizations().subscribe({
      next: (data) => {
        console.log(data);
        this.organizations = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }

  onSourceSelete = (event: any) => {
    console.log(event.option.value.userId);
    this.targetUsersList = this.sourceUsersList.filter(
      (u) => u.userId != event.option.value.userId
    );
    console.log(this.targetUsersList);
    this.userService
      .getUserById(event.option.value.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.sourceUser = userData;
          console.log(userData);
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        },
      });
  };

  onTargetSelete = (event: any) => {
    console.log(event.option.value.userId);

    this.userService
      .getUserById(event.option.value.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.targetUser = userData;
          console.log(userData);
        
         ;
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        },
      });
  };
  onUserSerach = (searchText: any) => {};

  onClone = () => {
     this.cloneUser();
  };
  clearForm() {}

  gotoCloneUser() {
    this.router.navigate(['/layout/cloneuser']);
  }
  cloneUser(){
   this.userService
     .cloneUser(this.sourceUser.userId, this.targetUser.userId)
     .subscribe({
       next: () => {
         //this.router.navigate(['layout/users']);
       },
       error: (err: any) => {
         console.error('Error updating user clone', err);
       },
     });
  }
}
