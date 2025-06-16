import {
  IDisplaySecuritypatrol,
  ScheduleSecurityPatrolDto,
  Securitypatrol,
} from './../../../../Models/Securitypatrol/securitypatrol';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil, startWith } from 'rxjs';
import { Project } from 'src/app/Models/Project/project';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import {
  ISchedule_Item,
  ISecuritypatrol,
  ScheduleItemDto,
  Schedule_Item,
} from 'src/app/Models/Securitypatrol/securitypatrol';
import { Role } from 'src/app/Models/User/Role';
import { User } from 'src/app/Models/User/User';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { SecuritypatrolService } from 'src/app/Services/Securitypatrol/securitypatrol.service';
import { RoleService } from 'src/app/Services/UserService/role.service';

@Component({
  selector: 'app-securitypatrol',
  templateUrl: './securitypatrol.component.html',
  styleUrls: ['./securitypatrol.component.css'],
})
export class AddSecuritypatrolComponent implements OnInit {
  roles: Role[] = [];
  showAdditionalFields: any[] = [];
  building: Project[] = [];
  qr: Qrgenerator[] = [];
  isView = false;
  formData!: FormGroup;
  user: User = new User();
  securitypatrolState: IDisplaySecuritypatrol[] = [];
  securityItemDto: ScheduleItemDto = new ScheduleItemDto();
  ScheduleItem: Schedule_Item = new Schedule_Item();
  securitypatrol: ISecuritypatrol = new Securitypatrol();
  security: ScheduleItemDto = new ScheduleItemDto();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  organizationId = 0;
  buildingId = 0;
  id = 0;
  generatorId: any;
  scheduleHours: any[] = [
    { id: 1, value: '00', value2: '12:00 AM' },
    { id: 2, value: '01', value2: '1:00 AM' },
    { id: 3, value: '02', value2: '2:00 AM' },
    { id: 4, value: '03', value2: '3:00 AM' },
    { id: 5, value: '04', value2: '4:00 AM' },
    { id: 6, value: '05', value2: '5:00 AM' },
    { id: 7, value: '06', value2: '6:00 AM' },
    { id: 8, value: '07', value2: '7:00 AM' },
    { id: 9, value: '08', value2: '8:00 AM' },
    { id: 10, value: '09', value2: '9:00 AM' },
    { id: 11, value: '10', value2: '10:00 AM' },
    { id: 12, value: '11', value2: '11:00 AM' },
    { id: 13, value: '12', value2: '12:00 PM' },
    { id: 14, value: '13', value2: '1:00 PM' },
    { id: 15, value: '14', value2: '2:00 PM' },
    { id: 16, value: '15', value2: '3:00 PM' },
    { id: 17, value: '16', value2: '4:00 PM' },
    { id: 18, value: '17', value2: '5:00 PM' },
    { id: 19, value: '18', value2: '6:00 PM' },
    { id: 20, value: '19', value2: '7:00 PM' },
    { id: 21, value: '20', value2: '8:00 PM' },
    { id: 22, value: '21', value2: '9:00 PM' },
    { id: 23, value: '22', value2: '10:00 PM' },
    { id: 24, value: '23', value2: '11:00 PM' },
  ];
  scheduleMin: any[] = [
    { id: 1, value: '00' },
    { id: 2, value: '15' },
    { id: 3, value: '30' },
    { id: 4, value: '45' },
  ];
  form!: FormGroup;
  filteredScheduleMin = this.scheduleMin;
  scheduleItem: ISchedule_Item = new Schedule_Item();
  location: any;

  constructor(
    private router: Router,
    private securitypatrolService: SecuritypatrolService,
    private builder: FormBuilder,
    private roleService: RoleService,
    private projectService: ProjectService,
    private qrgeneratorService: QrgeneratorService
  ) {}

  ngOnInit(): void {
    this.initialize();

    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    this.fetchRoles();
    this.loadProjects();

    this.security = history.state.securitypatrol;
    this.isAdding = history.state.isAdding;
    this.buildingId = this.security.projectId;
    this.loadQr();
    this.getQrgeneratorId(this.security.generatorId);

    console.log(this.security);

    if (this.security) {
      this.isAdding = false;
      this.patchFormData();
      this.patchScheduleItems();
    }
    console.log(this.securitypatrol);
    if (this.securitypatrol) {
      // this.isAdding = false;
      this.form.get('startTime')?.valueChanges.subscribe((value) => {
        if (value === '00') {
          this.filteredScheduleMin = [{ value: '00' }];
          this.form.get('endTime')?.setValue('00', { emitEvent: false });
          if (this.form.valid) {
            const formData = this.form.value;
            if (formData.startTime === '24' && formData.endTime !== '00') {
              alert('If the start time is 24, the end time must be 00.');
              return;
            }
            // Handle valid form submission
            console.log('Form Submitted', formData);
          } else {
            alert('Form is invalid');
          }
        } else {
          this.filteredScheduleMin = this.scheduleMin;
          if (this.form.get('endTime')?.value === '00') {
            this.form.get('endTime')?.setValue('', { emitEvent: false });
          }
        }
      });
    }
  }

  createScheduleItemGroup(): FormGroup {
    return this.builder.group({
      startTime: new FormControl(''),
      formatedScheduleTime: new FormControl(''),
      endTime: new FormControl(''),
      scheduleTimeId: new FormControl(0),
      scheduleId: new FormControl(0),
    });
  }
  private initialize(): void {
    this.formData = this.builder.group({
      scheduleId: [0, Validators.required],
      scheduleTimeId: [0, Validators.required],
      roleId: ['', Validators.required],
      status: [''],
      projectId: [0, Validators.required],
      generatorId: [0, Validators.required],
      securityPatrolName: [''],
      scheduleItems: this.builder.array([this.createScheduleItemGroup()]),
    });

    this.showAdditionalFields.push({
      startTime: '',
      endTime: '',
      scheduleTimeId: 0,
      scheduleId: 0,
    });
  }

  get scheduleItems(): FormArray {
    return this.formData.get('scheduleItems') as FormArray;
  }
  private loadProjects(): void {
    this.projectService.getProjectsByOrgId(this.user.organizationId).subscribe({
      next: (resp) => {
        this.building = resp;
      },
      error: (err) => {
        console.error('Error loading projects', err);
      },
    });
  }

  onSelect(event: any): void {
    const selectedProjectId = event.value;
    console.log(selectedProjectId);
    this.buildingId = selectedProjectId;
    this.loadQr();
    this.updateSecurityPatrolName();
  }

  onLocationSelect(event: any): void {
    const selectedGeneratorId = event.value;
    this.updateSecurityPatrolName();
  }
  updateSecurityPatrolName(): void {
    const projectId = this.formData.get('projectId')?.value;
    const generatorId = this.formData.get('generatorId')?.value;
    const project = this.building.find((item) => item.projectId === projectId);
    const location = this.qr.find((item) => item.id === generatorId);
    if (project && location) {
      const securityPatrolName = `${project.projectName}-${location.location}-`;
      this.formData.patchValue({
        securityPatrolName: securityPatrolName,
      });
    }
  }
  private loadQr(): void {
    this.qrgeneratorService
      .getQrgeneratorById(this.user.organizationId, this.buildingId)
      .subscribe({
        next: (resp) => {
          // Ensure resp is correctly typed as Qrgenerator

          console.log(resp);
          this.qr = resp; // Assign the single Qrgenerator object directly
        },
        error: (err) => {
          console.error('Error loading QR generator', err);
        },
      });
  }

  fetchRoles() {
    this.roleService.fetchAllRoles('', this.organizationId).subscribe({
      next: (roles: any) => {
        console.log(roles);
        this.roles = roles;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  getQrgeneratorId(generatorId?: any) {
    this.generatorId = generatorId;
    this.qrgeneratorService.getQrgeneratorId(this.generatorId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.location = res?.location;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  save() {
    console.log(this.formData.value);
    if (this.formData.valid) {
      if (this.isAdding) {
        this.formData.value.scheduleItems =
          this.formData.value.scheduleItems.map((value: any) => {
            const selectedHour = this.scheduleHours.find(
              (h) => h.value === value.startTime
            );
            if (selectedHour) {
              value.formatedScheduleTime = selectedHour.value2; // Set startTime2 from the selected hour's value2
            }
            return value; // Return the updated item
          });
        console.log(this.formData.value);
        this.securitypatrolService
          .addSecuritypatrol(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate([
                '/layout/facility/management/displaysecuritypatrol',
              ]);
            },
            error: (err) => {
              console.error('Error adding Securitypatrol', err);
            },
          });
      } else {
        this.formData.value.scheduleItems =
        this.formData.value.scheduleItems.map((value: any) => {
          const selectedHour = this.scheduleHours.find(
            (h) => h.value === value.startTime
          );
          if (selectedHour) {
            value.formatedScheduleTime = selectedHour.value2; // Set startTime2 from the selected hour's value2
          }
          return value; // Return the updated item
        });
      console.log(this.formData.value);
        this.securitypatrolService
          .updateSecuritypatrol(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate([
                '/layout/facility/management/displaysecuritypatrol',
              ]);
            },
            error: (err) => {
              console.error('Error updating Securitypatrol', err);
            },
          });
      }
    } else {
      Object.keys(this.formData.controls).forEach((key) => {
        this.formData.controls[key].markAsTouched();
      });
      console.error('Invalid form');
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoSecuritypatrols() {
    this.router.navigate(['/layout/facility/management/displaysecuritypatrol']);
  }

  private patchFormData(): void {
    const securityData = this.security;
    console.log(securityData);
    this.formData.patchValue(securityData);

    this.patchScheduleItems();
  }

  private patchScheduleItems() {
    const securityPatrolArray = this.formData.get('scheduleItems') as FormArray;
    securityPatrolArray.clear();

    this.security.scheduleItems.forEach((item: any, index: number) => {
      console.log(item.startTime, item.endTime, item.scheduleTimeId);
      const securityGroup = this.builder.group({
        startTime: item.startTime,
        endTime: item.endTime,
        scheduleTimeId: item.scheduleTimeId,
        scheduleId: item.scheduleId,
      });

      securityPatrolArray.push(securityGroup);
    });
  }

  addItems(): void {
    this.showAdditionalFields.push({
      startTime: '',
      endTime: '',
      scheduleTimeId: 0,
      scheduleId: 0,
    });

    const indentItemsArray = this.formData.get('scheduleItems') as FormArray;
    indentItemsArray.push(this.createScheduleItemGroup());
  }

  removeIcons(index: any) {
    if (this.showAdditionalFields.length > 1) {
      this.showAdditionalFields.splice(index, 1);
      const indentItemsArray = this.formData.get('scheduleItems') as FormArray;
      indentItemsArray.removeAt(index);
    } else {
      console.log('item should be at least one');
    }
  }

  onHourChange(hour: any) {
    console.log(hour);
    if (hour === '00') {
      this.filteredScheduleMin = this.scheduleMin.filter(
        (min) => min.value !== '00'
      );
    } else {
      this.filteredScheduleMin = this.scheduleMin;
    }
  }
}
