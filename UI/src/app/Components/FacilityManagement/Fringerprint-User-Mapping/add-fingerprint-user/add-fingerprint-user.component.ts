import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'highcharts';
import { Subject, takeUntil } from 'rxjs';
import { searchTextLength, searchTextZero } from 'src/app/Constants/CommanConstants/Comman';
import { FingerprintUserMappingBean } from 'src/app/Models/Facility Management/FingerprintUserMapping';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { IUser, User } from 'src/app/Models/User/User';
import { AttendanceServiceService } from 'src/app/Services/FacilityManagement/attendance-service.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-fingerprint-user',
  templateUrl: './add-fingerprint-user.component.html',
  styleUrls: ['./add-fingerprint-user.component.css']
})
export class AddFingerprintUserComponent {

  fingerprintUserMapping = new FingerprintUserMappingBean(0, 0, 0, 0, 0, '', 0);
  selectedLocationId: any;
  constructor(
    private router: Router,
    private attendanceService: AttendanceServiceService,
    private builder: FormBuilder,
    private usermanage: UsermanageService,
    private userService:UserService
  ) { }
  private destroy$ = new Subject<void>();
  loginUserId: number = 0;
  userLoggedIn: User = new User();
  userName: string = '';
  userData: IUser[] = [];
  userId: number = 0;
  formData!: FormGroup;
  isAdding: boolean = true;
  selectedUserId: number = 0;
  selectedUser: IUser = new User();
  userControll: any = new FormControl([] as User[]);
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedProject: IProject = new Project();
  projectId: number = 0;
  user: User = new User();
  organizationId: number = 0
  locationsList: Qrgenerator[] = [];
  referanceKry: any = 'SPA';
  nextfingerprintNumber: any;
  
  
  ngOnInit(): void {
   
    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.userLoggedIn = JSON.parse(user);
      this.loginUserId = this.userLoggedIn.userId;
      this.organizationId = this.userLoggedIn.organizationId;
      
    }
   
    this.initializeForm();
    this.getAllProjects();
    this.fetchLocations(this.projectId);
this.fingerprintUserMapping=history.state.fingerPrintUser;
console.log(this.fingerprintUserMapping);
console.log(this.fingerprintUserMapping);
      if (this.fingerprintUserMapping) {
        this.isAdding = false;
        this.selectedLocationId=this.fingerprintUserMapping.locationId;
        this.fetchUserforAuto();
       
        this.fetchLocations(this.projectId)
        this.patchFormWithFingerprintData();
      }


  }
  private initializeForm(): void {
    this.organizationId = this.userLoggedIn.organizationId;

    this.formData = this.builder.group({
      fingerprintUserId: [0],
      userId: [],
      locationId: [],
      employeeId: [],
      fingerprintNumber: [],
      orgId: [this.organizationId],
      status: ['A'],

    });

    

  }
  patchFormWithFingerprintData()
  {
    this.formData.patchValue(
      {
        fingerprintUserId: this.fingerprintUserMapping.fingerprintUserId,
      userId:this.fingerprintUserMapping.userId,
      //const userId=data.userId;
      
      locationId: this.fingerprintUserMapping.locationId,
      employeeId: this.fingerprintUserMapping.employeeId,
      fingerprintNumber:this.fingerprintUserMapping.fingerprintNumber,
      orgId: this.fingerprintUserMapping.orgId,
      status: this.fingerprintUserMapping.status,
      }
    )
    
    const userId=this.formData.value.userId;
    this.fetchUserById(userId);

  }
  fetchUserById(userId:number) {

    this.userService.getUserById(userId).subscribe({
      next: (user) => {

       this.selectedUser = user;
       console.log(this.selectedUser);
        this.formData.patchValue({ userId: user.userId });
 },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }
  clearForm() {
    this.formData.reset();
  }
  searchUserForAuto(event: any) {
    const query = event.target.value;
    console.log(event.target.value, query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.userName = query;
      this.fetchUserforAuto();
    }

    // Fetch users from the server based on the search criteria
  }
  fetchUserforAuto() {
    this.usermanage
      .getUsers(this.referanceKry, this.organizationId, this.projectId, this.userName, this.selectedLocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.userData = user;
          console.log(user);
          
        },
        error: (error: Error) => {
          console.error('Error fetching User : ', error);
        },
      });
  }
  onUserSelectForAuto(event: any): void {
    this.userId = event.option.value.userId;


    this.formData.patchValue({ userId: this.userId });
  }
  displayUserForAuto(userData: User): string {
    console.log(userData);
    return userData && userData.userName ? userData.userName : '';
  }
  gotoDisplay() {
    this.router.navigate(['/layout/displayfingerprintusermapping']);
  }

  getAllProjects() {
    this.attendanceService.getProjectsByOrgId(this.organizationId, this.projectName).pipe(takeUntil(this.destroy$)).subscribe({
      next: (project) => {
        this.projects = project;

      },
      error: (error: Error) => {
        console.error('Error Fetching User :', error);

      }
    })
  }
  displayProject(project: IProject): string {
    return project && project?.projectName ? project?.projectName : '';
  }

  searchProject(event: any) {
    this.projectName = event.target.value;

    this.getAllProjects();
  }
  onProjectSelect(event: any) {
    console.log(event.option?.value);
    this.selectedProject = event.option?.value;
    this.projectId = event.option?.value.projectId;
    this.formData.patchValue({ projectId: this.projectId });
    // this.fetchProject(this.projectId);
    //const role = this.user.roleName.toLocaleLowerCase();

    this.fetchLocations(this.projectId);
  }

  fetchLocations(projectId: number) {
    this.attendanceService
      .getLocationsByOrgId(this.organizationId)
      .subscribe({
        next: (resp) => {
          // Ensure resp is correctly typed as Qrgenerator

          console.log(resp);
          this.locationsList = resp; // Assign the single Qrgenerator object directly
        },
        error: (err) => {
          console.error('Error loading QR generator', err);
        },
      });

  }
  onLocationSelect(event: any): void {
    this.selectedLocationId = event.value;
    console.log(this.selectedLocationId);
    this.fetchUserforAuto();
    this.getFingerPrintNumber();

  }

  getFingerPrintNumber() {
    this.attendanceService.getNextFingerPrintNumber(this.selectedLocationId).subscribe
      (
        {
          next: (resp) => {
            this.nextfingerprintNumber = resp
            this.formData.patchValue({
              fingerprintNumber:this.nextfingerprintNumber
            })
            console.log(resp);

          }
        }
      )
  }
 
  save() {


    if (this.formData.valid) {
      console.log(this.formData.value);
  const data = this.formData.value;
      if (this.isAdding) {
        this.attendanceService
          .addFingerprintUserMapping(this.formData.value)
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
              this.router.navigate(['layout/displayfingerprintusermapping']);
            },
            error: (error: HttpErrorResponse) => {
              const errorMessage =
                error.error?.message || 'An unexpected error occurred';
              Swal.fire({
                icon: 'error',
                text: errorMessage,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              console.error('Error adding users', errorMessage);
            },
          });
      }
      else
      {
        console.log(data);
        this.attendanceService.updateFingerprint(this.formData.value).pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(resp:any)=>
            {
              Swal.fire({
                icon: 'success',
                text: 'Fingerprint Updated successfully',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              this.router.navigate(['layout/displayfingerprintusermapping']);
            },
            error: (error: HttpErrorResponse) => {
              const errorMessage =
                error.error?.message || 'An unexpected error occurred';
              Swal.fire({
                icon: 'error',
                text: errorMessage,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              console.error('Error Updated Fingerprint', errorMessage);
            },

        });
        
      }
  }
}
}
