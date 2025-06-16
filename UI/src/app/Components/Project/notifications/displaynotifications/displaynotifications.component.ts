import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  AppNotification,
  INotifications,
  NotificationsDto,
} from 'src/app/Models/Project/notifications';
import { NotificationsService } from 'src/app/Services/ProjectService/notificaions/notifications.service';

import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { User } from 'src/app/Models/User/User';

@Component({
  selector: 'app-displaynotifications',
  templateUrl: './displaynotifications.component.html',
  styleUrls: ['./displaynotifications.component.css'],
})
export class DisplaynotificationsComponent implements OnInit {
  destroy$ = new Subject<void>();
  notificationsData: NotificationsDto[] = [];
  notifications: INotifications = new AppNotification();
  user: User = new User();

  displayedColumns: string[] = [
    'rowNumber',
    'recipientName',
    'eventId',
    'messageBody',
    'startDate',
    'endDate',
    'actions',
  ];

  pageSizeOptions = pageSizeOptions;

  pageSize: number = 20;
  pageIndex: number = 0;
  totalPages: number = 0;
  eventId: number = 0;

  ngOnInit(): void {
    this.getUserFromLocalStorage();
    this.getAllNotifications(this.eventId); // C
  }

  constructor(
    private NotificationsService: NotificationsService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  //get all projects
  getAllNotifications(eventId: any) {
    this.NotificationsService.getAllNotifications(
      this.pageIndex,
      this.pageSize,
      this.user.organizationId,
      this.user.userId
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notificationsData) => {
          console.log(notificationsData);
          this.notificationsData = notificationsData.records;
          this.totalPages = notificationsData.totalRecords;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  addNotification() {
    this.router.navigate(['/layout/project/notifications']);
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllNotifications(this.eventId);
  }

  editNotification(notifications: any) {
    console.log('id taking ', notifications.id);
    this.getNotificationById(notifications.id).subscribe({
      next: (response) => {
        console.log(response); // Verify if data is correctly fetched
        this.notificationsData = response;
        // Navigate with state once the data is available
        this.router.navigate(['layout/project/notifications'], {
          state: { notificationsData: this.notificationsData },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getNotificationById(id: number) {
    return this.NotificationsService.getNotificationById(id).pipe(
      takeUntil(this.destroy$)
    );
  }

  getUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    const mainUser = localStorage.getItem('Mainuser');
    // if (mainUser) {
    //   this.mainUser = JSON.parse(mainUser);
    // }
    if (user) {
      this.user = JSON.parse(user);
    }
  }
}
