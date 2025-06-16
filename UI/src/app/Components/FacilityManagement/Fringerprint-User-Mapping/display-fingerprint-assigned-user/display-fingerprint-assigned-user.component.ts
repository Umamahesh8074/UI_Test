import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { error } from 'highcharts';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { fingerPrintUserDto } from 'src/app/Models/Facility Management/fingerPrintUserDto';
import { FingerprintUserMappingBean } from 'src/app/Models/Facility Management/FingerprintUserMapping';
import { Project } from 'src/app/Models/Project/project';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { IUser, User } from 'src/app/Models/User/User';
import { AttendanceServiceService } from 'src/app/Services/FacilityManagement/attendance-service.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import {
  pageSizeOptions,
  PAGE_INDEX,
  PAGE_SIZE,
} from 'src/app/Constants/CommanConstants/Comman';
@Component({
  selector: 'app-display-fingerprint-assigned-user',
  templateUrl: './display-fingerprint-assigned-user.component.html',
  styleUrls: ['./display-fingerprint-assigned-user.component.css']
})
export class DisplayFingerprintAssignedUserComponent {
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  userId: number = 0;
 listOfFingetPrintUser:fingerPrintUserDto[]=[];
 totalItems: number = 0;
  user: User = new User();
  
  pageSizeOptions = pageSizeOptions;
  selectedLocation: any;
  selectedUser: IUser = new User();
  UserName: string = '';
  formData: any;
  projectId: any;
  locations:Qrgenerator[]=[];
  projectName:string='';
  organizationId: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  ngOnInit(): void {
    this.initializeState();
    const user = localStorage.getItem('user');
    if (user) {
    //  console.log(user, 'user');

      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.organizationId = this.user.organizationId;
    }
    this.getFingerPrintUserList()
    this.getAllLocation();
   
   
  }
  displayedColumns: string[] = [
    'name',
    'location',
    'fingerprintNumber',
    'actions',
  ];

  constructor(
    private attnedanceService:AttendanceServiceService
    , private router: Router,
    public dialog: MatDialog,
  

  ) {}

  private initializeState() {

  }
  getAllLocation() {
    this.attnedanceService.getLocationsByOrgId(this.organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (location) => {
        this.locations = location;
        console.log(this.locations);
        

      },
      error: (error: Error) => {
        console.error('Error Fetching User :', error);

      }
    })
  }
  onLocationSelect(event: any) {
    console.log(event.value);
    this.selectedLocation = event.value;
    this.getFingerPrintUserList();
   //this.formData.patchValue({ projectId:  this.selectedProject  });
    // this.fetchProject(this.projectId);
    //const role = this.user.roleName.toLocaleLowerCase();

  }
  addFingerPrint() {
    this.router.navigate(['layout/fingerprintusermapping'], {
      state: { isAdding:true},
    });
  }
  getFingerPrintUserList()
  {

    this.attnedanceService.fetchAllFingerPrints(  this.pageIndex,
      this.pageSize,this.UserName ,this.selectedLocation).pipe(takeUntil(this.destroy$)).subscribe
    ({
      next:(listOfFingetPrintUsers)=>
      {
        this.listOfFingetPrintUser=listOfFingetPrintUsers.records
       
        this.totalItems = listOfFingetPrintUsers.totalRecords;
        console.log(this.totalItems);
        
      },
      error:(error:Error)=>
      {
        console.error('error while fetching : ',error);
        
      }
    })
    
  }



  editFingerPrint(fingerPrint: any) {
    console.log("edit",fingerPrint);
   const fingerprintUserId= fingerPrint.fingerprintUserId;
    this.attnedanceService.getFingerPrintUserById(fingerprintUserId).pipe(takeUntil(this.destroy$)).subscribe
    ({
      next:(fingerToBeUpdated)=>
      {
        this.router.navigate(['layout/fingerprintusermapping'], {
          state: { fingerPrintUser: fingerToBeUpdated ,isAdding:false,
           
          },
        });
      }
    })   
  }

  openConfirmDialog(AttendanceId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete attendanceUser' }, // Pass the property as data to the dialog
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getFingerPrintUserList();
   
  }
  onSearch(searchText: any) {
    this.UserName = searchText;
    this.getFingerPrintUserList();
    
  }
}
