import { Component, Inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { AvailableUnitsDto } from 'src/app/Models/Project/unit';
import { User } from 'src/app/Models/User/User';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { BookingService } from 'src/app/Services/ProjectService/Booking/booking.service';

@Component({
  selector: 'app-booking-lead',
  templateUrl: './booking-lead.component.html',
  styleUrls: ['./booking-lead.component.css'],
})
export class BookingLeadComponent implements OnInit {
  phoneNumber: string = '';
  name: string = '';
  email: string = '';
  selectedLeadId: number | undefined;
  leads: any[] = [];
  isLoading: boolean = false;
  // public dialog!: MatDialog;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  public user: User = new User();
  roleId:number=0
  userId:number=0
  private destroy$ = new Subject<void>();
  bookedUnitsData:AvailableUnitsDto[]=[]
  displayedColumns: string[] = ['name', 'phoneNumber', 'projectName','blockName','levelName','unitName', 'unitTypeName'];
  constructor(
    // public dialogRef: MatDialogRef<BookingLeadComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,

    private leadService: LeadService,
    private bookingService:BookingService 
  ) {}

  selectNumber(num: number): void {
    this.selectedLeadId = num;
  }
  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user != null) {
      this.user = JSON.parse(user);
      this.userId=this.user.userId
      console.log(this.user.organizationId);
      this.roleId = this.user.roleId;
      console.log(this.roleId);
  }
  this.getBookedUints();
}
  c = true;

  // closeDialog(): void {
  //   console.log('Close button clicked or dialog closing unexpectedly');
  //   this.c = false;
  //   this.dialogRef.close();
  // }

  getAllLeads() {
    console.log('API call initiated');
    this.isLoading = true; // Start loading indicator before API call
    this.leadService
      .fetchAllLead(this.phoneNumber, this.name, this.email)
      .subscribe(
        (results) => {
          console.log('API call succeeded, updating leads');
          //this.dialogRef.disableClose=true;

          this.leads = results;

          console.log(this.leads);
        },
        (error) => {
          //this.dialogRef.disableClose = true;
          console.error('Error fetching leads:', error);
        }
      );
  }

  onPhoneNumberSearch(phoneNumberSearchText: string) {
    console.log(phoneNumberSearchText);
    this.phoneNumber = phoneNumberSearchText;
    if (this.phoneNumber.length >= 3) {
      this.getAllLeads();
    }
  }

  onNameSearch(nameSearchText: string) {
    console.log(nameSearchText);
    this.name = nameSearchText;

    if (this.name.length >= 3) {
      this.test();
    }
  }

  test() {
    this.leadService
      .fetchAllLead(this.phoneNumber, this.name, this.email)
      .subscribe({
        next: (results) => {
          console.log('API call succeeded, updating leads');
          console.log(this.leads);
          // this.openDialog();
        },
        error: (error) => {
          console.error('Error fetching leads:', error);
        },
      });
  }

  onEmailSearch(emailSearchText: string) {
    console.log(emailSearchText);
    this.email = emailSearchText;
    if (this.email.length >= 3) {
      this.getAllLeads();
    }
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(BookingLeadComponent, {
  //     width: '100%',
  //     hasBackdrop: true,
  //     disableClose: true,
  //   });
  // }

  getBookedUints(){
    this.bookingService
        .getBookedUnits(this.userId,this.pageIndex,this.pageSize,this.roleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.bookedUnitsData=resp.records;
            console.log(resp.records);
          this.totalItems = resp.totalRecords;
            // this.formData.reset();
          },
          error: (err) => {
            console.error('Error adding vendor', err);
          },
        });

  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getBookedUints();
  }
}
