import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { Client } from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';

import { User } from 'src/app/Models/User/User';
import { ClientService } from 'src/app/Services/client/client.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-displayclient',
  templateUrl: './displayclient.component.html',
  styleUrls: ['./displayclient.component.css'],
})
export class DisplayclientComponent implements OnInit {
  private destroy$ = new Subject<void>();
  clientData: Client[] = [];
  userName: string = '';
  displayedColumns: string[] = [
    'clientName',
    'projectLocation',
    'emailId',
    'phoneNumber',
    'location',
    'pan',
    'gst',
    'actions',
  ];
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  clientName: string = '';
  referenceKey: any;
  client: any;
  projectLocation: any;

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    public clientService: ClientService
  ) {}
  public user: User = new User();
  organizationId: any;
  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
    this.getClientDetails(this.clientName);

    this.client = history.state.client;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getClientDetails();
  }

  onSearch(searchText: any) {
    this.clientName = searchText;
    this.getClientDetails(this.clientName);
  }
  getClientDetails(clientName?: any) {
    this.clientName = clientName;
    this.clientService
      .getAllclients(
        this.clientName,
        this.projectLocation,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientdata) => {
          this.clientData = clientdata.records;
          console.log(clientdata.records);
          this.totalItems = clientdata.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  openConfirmDialog(userId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete User' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteClient(userId);
        }
      });
  }

  deleteClient(clientId: number) {
    this.clientService
      .deleteclient(clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          this.getClientDetails(this.clientName);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }

  addClient() {
    this.router.navigate(['layout/facility/management/addclient'], {});
  }

  editClient(clientData: any) {
    console.log(clientData);
    this.clientService
      .getClientById(clientData.clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.router.navigate(['layout/facility/management/addclient'], {
            state: {
              referenceKey: this.referenceKey,
              client: response,
            },
          });
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }
}
