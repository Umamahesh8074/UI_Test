import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { searchTextLength, searchTextZero } from 'src/app/Constants/CommanConstants/Comman';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { IUser, User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { AttendanceServiceService } from 'src/app/Services/FacilityManagement/attendance-service.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-additional-shift',
  templateUrl: './add-additional-shift.component.html',
  styleUrls: ['./add-additional-shift.component.css']
})
export class AddAdditionalShiftComponent {



  constructor(
    private router: Router,
    private attendanceService: AttendanceServiceService,
    private builder: FormBuilder,
    private commanService: CommanService,
    private userService: UserService,
    private qrGenerator: QrgeneratorService,
    private projectservice:ProjectService,

  ) {}


  private destroy$ = new Subject<void>();
  selectedUser: IUser = new User();
  formData!: FormGroup;
  isAdding: boolean = true;
  userName: string = '';
  loginUserId: number = 0;
  loginUserOrganizationId: number = 0;
  userData: IUser[] = [];
  userId: number = 0;
  userControll: any = new FormControl([] as User[]);
  userLoggedIn: User = new User();
  projectName: string = '';
  projects: Project[] = [];
  user: User = new User();
  projectId: number = 0;
  project: any = new FormControl([] as IProject[]);
  shiftTiming: string = 'Shift_Timings';
  shiftTimingList:   CommonReferenceDetails[] = [];
  selectedProject: IProject = new Project();
  locationsList: Qrgenerator[] = [];


  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.userLoggedIn = JSON.parse(user);
      this.loginUserId = this.userLoggedIn.userId;
      this.loginUserOrganizationId= this.userLoggedIn.organizationId;
      console.log("logged in ", this.loginUserId);
      this.initializeForm();
      const data = history.state.additionalShiftDetails;
console.log(data);
      if (data) {
        this.isAdding = false;
        this.patchFormData(data);
      }
    }

this.fetchUserforAuto();
//this.fetchProjects();
this.fetchLocations();
this.fetchShiftTimings();

  }

  private initializeForm(): void {


    this.formData = this.builder.group({
      additionalShiftId: [0],
      userId: [0],
      projectId:[0],
      locationId:[0],
      status: ['A'],
      shiftTime: [Validators.required,0],
      additionalShiftDate: [new Date(), Validators.required],
    });

  }
  onChange() {
    const additionalShiftDay = this.formData.get('additionalShiftDate');

  }

  save()
  {
    if (this.formData.valid) {
      console.log(this.formData.value);

      if (this.isAdding) {
        this.attendanceService
          .addAdditionalShift(this.formData.value)
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
              this.router.navigate(['layout/displayAdditionalShift']);
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
      else {
        this.attendanceService
          .updateAdditionalShift(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/displayAdditionalShift']);
            },
            error: (err: any) => {
              console.error('Error updating attendance ', err);
            },
          });
      }
    }
  }
 
  private patchFormData(data: any): void {
    console.log(data);
    const projectId=data.projectId;
    this.fetchProjectById(projectId);
const locationId=data.locationId;
    const userId=data.userId;
    this.fetchUserById(userId);


    console.log(data.toString + 'data for update');

    this.formData.patchValue(data);
  }
  // private fetchUser(userId: number): void {
  //   this.userService
  //     .getUserById(userId)
  //     .pipe(takeUntil(this.destroy$
  //     ))
  //     .subscribe({
  //       next: (userData) => {
  //         console.log(userData);
  //         this.selectedUser = userData;
  //         this.formData.patchValue({ userId: userData.userId });
  //       },
  //       error: (error: Error) => {
  //         console.log(error);
  //       },
  //     });
  // }

  displayUserForAuto(userData: User): string {
    console.log(userData);
    return userData && userData.userName ? userData.userName : '';
  }

  searchUserForAuto(event: any) {
    const query = event.target.value;
    console.log(event.target.value, query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.userName = query;
      this.fetchUserforAuto();
    }


  }
  fetchUserforAuto() {
    this.attendanceService
      .getAllUser(this.loginUserId, this.userName)
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
    console.log(this.userId);


  this.formData.patchValue({ userId: this.userId });
  }
  fetchProjects() {
    this.attendanceService.fetchProjects(this.projectName,this.loginUserOrganizationId).subscribe({
      next: (projects) => {
       this.projects = projects;
 },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }


  fetchProjectById(projectId:number) {

    this.projectservice.getProjectById(projectId).subscribe({
      next: (project) => {

       this.selectedProject = project;
       console.log(this.selectedProject);
        this.formData.patchValue({ projectId: project.projectId });
 },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
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


  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }
  onProjectSelect(event: any) {
    console.log(event.option?.value);
    this.projectId = event.option?.value.projectId;
    this.formData.patchValue({ projectId: this.projectId });
  }
  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      console.log(event.target.value);
      this.projectName = event.target.value;
      this.fetchProjects();
    }  else if (event.target.value.length == 0) {
      this.projectName = '';
      this.fetchProjects();
    }
  }


  fetchShiftTimings() {
    console.log('entering attendance status');

    this.commanService.getRefDetailsByType(this.shiftTiming).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.shiftTimingList = response;
        console.log(this.shiftTimingList);
      },
      error: (error) => console.error(error),
    });
  }
  clearForm() {
    this.formData.reset();
  }

  gotoUsers() {
    this.router.navigate(['layout/displayAdditionalShift']);
  }
  fetchLocations() {
    this.attendanceService
      .getLocationsByOrgId(this.loginUserOrganizationId)
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
}
