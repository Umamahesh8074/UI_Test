import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  AppNotification,
  INotifications,
} from 'src/app/Models/Project/notifications';
import { NotificationsService } from 'src/app/Services/ProjectService/notificaions/notifications.service';

import { MatSelectChange } from '@angular/material/select';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { Project } from 'src/app/Models/Project/project';
import { User } from 'src/app/Models/User/User';
import { IUserManageDto } from 'src/app/Models/User/UserManage';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @ViewChild('attachmentUrlFileInput')
  attachmentUrlFileInput!: ElementRef<HTMLInputElement>;

  notifications: INotifications = new AppNotification();
  formData!: FormGroup;
  userData: User[] = [];
  projectId: any;
  user: User = new User();
  isView = false;
  isAdding: boolean = true;
  showRecipientId = false;
  showProjectId = false;
  organizationId: number = 0;
  salesProjectTeam: CommonReferenceType[] = [];
  eventList: CommonReferenceType[] = [];
  recipientList: CommonReferenceType[] = [];
  deliveryTypeList: CommonReferenceType[] = [];
  Notification_Event: string = 'Notification_Event';
  Notification_Recipient: string = 'Notification_Recipient';
  Delivery_Type: string = 'Delivery_Type';
  isNotifications: boolean = false;
  projects: Project[] = [];
  projectName: string = '';
  checkedUserTeamsManage: IUserManageDto[] = [] as IUserManageDto[];
  userTeamsManage: IUserManageDto[] = [] as IUserManageDto[];
  referenceId?: number;
  refernceKey: any;
  salesTeams: any = [];

  ngAfterViewInit(): void {
    // Now you can safely access attachmentUrlFileInput
    console.log(this.attachmentUrlFileInput);
  }
  destroy$ = new Subject<void>();

  constructor(
    private NotificationsService: NotificationsService,
    private router: Router,
    private builder: FormBuilder,
    private commonService: CommanService,
    private userService: UserService,
    private projectService: ProjectService,
    private userManageService: UsermanageService
  ) {}

  attachmentUrl: any;

  ngOnDestroy(): void {
    // Your cleanup logic
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    this.initializeForm();

    this.fetchProjects();
    const data = history.state.notificationsData;

    if (data) {
      this.isAdding = false;
      this.patchFormData(data);
    }
    console.log(this.organizationId);

    this.fetchNotificationEvent();

    this.formData
      .get('recipientType')
      ?.valueChanges.subscribe((value: string) => {
        return this.toggleRecipientIdField(value);
      });
    this.fetchNotificationRecipient();

    this.fetchUsers();

    this.fetchDeliveryType();
  }

  private initializeForm(): void {
    this.formData = this.builder.group({
      id: [0],
      eventId: [0],
      recipientId: [0],
      recipientType: [0],
      subject: [''],
      isDocumentAttached: [''],

      messageBody: [''],
      deliveryType: [0],
      status: [''],
      startDate: [],
      endDate: [],
    });
  }

  private patchFormData(data: any): void {
    console.log(data);

    console.log(data.toString + 'data for update');

    this.formData.patchValue(data);
    this.attachmentUrl = data.attachmentUrl || null;
  }
  save(): void {
    console.log(this.formData.value);
    if (this.formData.valid) {
      // Copy form data to avoid modifying the original form data object
      const formData = { ...this.formData.value };
      console.log(formData);

      // Retrieve the selected file
      const file = this.getSelectedFile();

      console.log(file);

      const attachmentUrl: File | null = file['attachmentUrl'];

      if (this.isAdding) {
        console.log('File:', file);

        console.log(formData);

        // Add notification with form data and file
        this.NotificationsService.addNotification(formData, attachmentUrl)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log(response.message);
              Swal.fire('Success', response.message, 'success');
              this.router.navigate(['layout/project/displaynotifications']);
            },
            error: (err) => {
              const errorMessage = err.error.error;
              console.log('Error:', errorMessage);
              if (err.status === 409) {
                Swal.fire('Failed', errorMessage, 'error');
                this.router.navigate(['layout/project/displaynotifications']);
              }
            },
          });
      } else {
        const file = this.getSelectedFile();

        console.log(file);
        const attachmentUrl: File | null = file['attachmentUrl'];
        // const attachmentUrl = history.state.notificationsData.attachmentUrl;

        console.log(attachmentUrl);
        const formData = { ...this.formData.value };
        console.log(formData);
        this.NotificationsService.updateNotification(formData, attachmentUrl)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              console.log('Success' + res);

              Swal.fire(
                'Success',
                'notifications updated successfully',
                'success'
              );
              this.router.navigate(['layout/project/displaynotifications']);
            },
            error: (err) => {
              console.log(err);

              Swal.fire('Error', 'Failed to update notifications', 'error');
            },
          });
      }
    } else {
      Swal.fire(
        'Validation Error',
        'Please fill in all required fields.',
        'warning'
      );
    }
  }

  // Get the selected file (ensure only one file is selected)

  getSelectedFile(): { [key: string]: File | null } {
    const fileInput = this.attachmentUrlFileInput?.nativeElement?.files;
    return {
      attachmentUrl: fileInput && fileInput.length > 0 ? fileInput[0] : null, // Only returning the first file
    };
  }

  // Optionally handle logic here if the form is prefilled

  selectedFileName: string = '';

  onFileSelected(event: Event): void {
    this.handleFileChange(event, 'attachmentUrl');
  }

  handleFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      console.log(`File selected for ${key}:`, file);
    }
  }

  onProjectSelect(event: any) {
    this.checkedUserTeamsManage = [];
    this.userTeamsManage = [];
    console.log(event.option.value);
    this.projectId = event.option.value.projectId;
    this.referenceId = this.projectId;
    {
      this.getAllUserTeamsManage();
    }
  }

  autoExpand(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  filteredDeliveryTypeList = this.deliveryTypeList.filter(
    (item) => item.commonRefValue === 'Website'
  );
  getAllUserTeamsManage() {
    this.userManageService
      .getUserManages(
        this.referenceId,
        this.refernceKey,
        this.organizationId,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userTeamsManage: IUserManageDto[]) => {
          console.log(userTeamsManage);
          this.userTeamsManage = userTeamsManage;
          this.checkedUserTeamsManage = userTeamsManage?.filter(
            (userTeamManage) => userTeamManage.isAssigned === 1
          );
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  // save() {
  //   if (this.formData.valid) {
  //     console.log(this.formData.value);
  //     const formDataCopy = { ...this.formData.value };
  //     console.log(formDataCopy);
  //     if (this.isAdding) {
  //       this.NotificationsService.addNotification(formDataCopy)
  //         .pipe()
  //         .subscribe({
  //           next: () => {
  //             // this.router.navigate(['layout/project/management/projects']);
  //           },
  //           error: (err: any) => {
  //             const errorMessage = err.error.message;
  //             console.error('Error message:', errorMessage);
  //           },
  //         });
  //     }
  //   }
  // }

  fetchProjects() {
    this.projectService.getProjectsByOrgId(this.organizationId).subscribe({
      next: (projects) => {
        console.log(this.projects);
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }

  fetchNotificationEvent(): void {
    console.log(this.Notification_Event);
    this.commonService.getRefDetailsByType(this.Notification_Event).subscribe({
      next: (types) => {
        this.eventList = types;
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }

  fetchNotificationRecipient(): void {
    console.log(this.Notification_Recipient);
    this.commonService
      .getRefDetailsByType(this.Notification_Recipient)
      .subscribe({
        next: (types) => {
          this.recipientList = types;
        },
        error: (error: any) => {
          console.error('Error fetching  types:', error);
        },
      });
  }
  fetchDeliveryType(): void {
    console.log(this.Delivery_Type);
    this.commonService.getRefDetailsByType(this.Delivery_Type).subscribe({
      next: (types) => {
        this.deliveryTypeList = types;
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }

  //initialize form data

  // Initialize the form structure

  // Method to get documents FormArray
  get documents(): FormArray {
    return this.formData.get('documents') as FormArray;
  }

  fetchUsers() {
    this.userService
      .fetchAllUsers(
        '',

        this.organizationId
      )
      .subscribe({
        next: (userData) => {
          this.userData = userData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  onRecipientTypeChange(event: MatSelectChange): void {
    console.log(this.recipientList);
    const eventValue = this.recipientList.filter((v) => v.id == event.value);
    const eventValues = eventValue[0].commonRefValue;
    this.toggleRecipientIdField(eventValues);
    this.toggleProjectIdField(eventValues);
  }

  toggleProjectIdField(eventValues: any): void {
    console.log(eventValues);
    this.showProjectId = eventValues === 'Sales';
  }

  toggleRecipientIdField(eventValues: any): void {
    console.log(eventValues);
    this.showRecipientId = eventValues === 'Individual';
  }

  clearForm(): void {
    this.formData.reset();
  }

  gotoDisplayNotifications(): void {
    this.router.navigate(['layout/project/displaynotifications']);
  }
}
