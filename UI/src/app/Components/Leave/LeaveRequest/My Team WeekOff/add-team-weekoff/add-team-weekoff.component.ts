import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { UserDto } from 'src/app/Models/Leave/UserDto';
import { IWeekOff, WeekOff } from 'src/app/Models/Leave/WeekOff';
import { WeekOffDto } from 'src/app/Models/Leave/WeekOffDto';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { WeekOffService } from 'src/app/Services/LeaveService/WeekOff/week-off.service';

@Component({
  selector: 'app-add-team-weekoff',
  templateUrl: './add-team-weekoff.component.html',
  styleUrls: ['./add-team-weekoff.component.css'],
})
export class AddTeamWeekoffComponent {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  weekOff: IWeekOff = new WeekOff(0, 0, '', '', '');
  isAdding: boolean = true;
  totalReporteeCount: number = 0;
  WeekOffDtoData: WeekOffDto[] = [];
  userData: UserDto[] = [];
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  user: User = new User();
  userId: number | null = null;
  statuses: any;
  @ViewChild('endDatePicker') endDatePicker!: MatDatepicker<Date>;
  weekDays: string[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  constructor(
    private weekOffService: WeekOffService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
    private commonService: CommanService,
    private leadCommonService: LeadsCommonService
  ) {}
  ngOnInit(): void {
    this.initializeForm();
    this.getCommonStatuses();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userId = this.user.userId;
      // Fetch team leave requests after userId is set
      this.fetchTeamWeekOffs();
    }
    // Check if there's a leave request in the history state
    if (history.state.weekOff) {
      this.isAdding = false;
      this.weekOff = history.state.weekOff;
      this.formData.patchValue(this.weekOff);
      this.formData.get('userId')?.disable();
    }
  }

  initializeForm() {
    this.formData = this.builder.group({
      id: [null],
      userId: [null],
      weekOffDay: ['', Validators.required],
      status: [],
    });
  }

  fetchTeamWeekOffs(): void {
    if (this.userId) {
      this.weekOffService
        .getTeamWeekOffsByManagerId(this.userId, 'A')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (weekoffs: WeekOffDto[]) => {
            this.userData = weekoffs.map((record: WeekOffDto) => ({
              userId: record.userId,
              userName: record.userName,
              email: '', // Populate with actual email if available, or leave empty
            }));
          },
          error: (error: any) =>
            console.error('Error fetching team WeekOff:', error),
        });
    }
  }
  save(): void {
    if (this.formData.valid) {
      if (this.isAdding) {
        console.log(this.formData.value);
        this.weekOffService
          .addWeekOff(this.formData.getRawValue(), this.user.organizationId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.leadCommonService.handleSuccessResponse(resp);
              this.router.navigate(['layout/teamweekoff']);
            },
            error: (err) => {
              this.leadCommonService.handleErrorResponse(err);
              console.error('Error adding team weekoff', err);
            },
          });
      } else {
        this.weekOffService
          .editWeekOff(this.formData.getRawValue())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.leadCommonService.handleSuccessResponse(resp);
              this.router.navigate(['layout/teamweekoff']);
            },
            error: (err) => {
              this.leadCommonService.handleErrorResponse(err);
              console.error('Error updating  team weekoff', err);
            },
          });
      }
    }
  }

  clearForm(): void {
    this.formData.reset();
  }
  gotoWeekOff(): void {
    this.router.navigate(['layout/teamweekoff']);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
}
