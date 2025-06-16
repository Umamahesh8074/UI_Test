import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from 'src/app/Models/Project/project';
import { IQrgenerator, Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { User } from 'src/app/Models/User/User';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';

@Component({
  selector: 'app-qrgenerator',
  templateUrl: './qrgenerator.component.html',
  styleUrls: ['./qrgenerator.component.css'],
})
export class AddQrgeneratorComponent implements OnInit {

  isView = false;
  building: Project[] = [];
  location: any[] = [];
  organizationId = 0;
  qrgenerator: IQrgenerator = new Qrgenerator();
  isAdding = true;
  private destroy$ = new Subject<void>();
  user: User = new User();
  statuses: CommonReferenceType[] = [];
  formData!: FormGroup;

  constructor(
    private router: Router,
    private qrgeneratorService: QrgeneratorService,
    private builder: FormBuilder,
    private projectService: ProjectService,
    private commomReferenceDetailsService: CommanService
  ) {

  }

  ngOnInit(): void {
    this.getCommonStatuses();
    const user = localStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user);
    }
    this.qrgenerator = history.state.qrgenerator;
    this.isAdding = !this.qrgenerator;
    this.initializeForm();
    if (history.state.userData != null) {
      this.isAdding = false;
      this.patchFormData();

    }
    this.loadProjects();
    this.patchFormData();

  }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  private initializeForm(): void {
    // this.qrgenerator.status='A'
    console.log(this.user.organizationId);
    this.formData = this.builder.group({
      id: [0],
      orgId: [0],
      projectId: [0, Validators.required],
      location: ['', Validators.required],


      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      radius: [0.0, Validators.required],
      status: [{ value: 'Inactive', disabled: this.isView }],
    });
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

  private getCommonStatuses(): void {
    this.commomReferenceDetailsService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        this.setDefaultStatus();
      },
      error: (error) => {
        console.error('Error fetching common statuses', error);
      },
    });
  }

  private setDefaultStatus(): void {
    const defaultStatus = this.statuses.find(
      (status) => status.commonRefKey === this.qrgenerator.status ? this.qrgenerator.status : "A"
    );
    if (defaultStatus) {
      this.formData.patchValue({ status: defaultStatus.commonRefKey });
    }
  }

  statusValue(e: any) {
    if (e.value === '') {
      this.formData.get('status')?.setErrors({ required: true });
    } else {
      this.formData.get('status')?.setErrors(null);
    }
  }
  save(): void {
    if (this.formData.valid) {
    if (this.isAdding) {
      this.formData.patchValue({ orgId: this.user.organizationId });
      this.addQrgenerator();
    } else {
      this.updateQrgenerator();
    }
  }
  else {
    Object.keys(this.formData.controls).forEach((key) => {
      this.formData.controls[key].markAsTouched();
    });
    console.error('Invalid form');
  }
  }

  private addQrgenerator(): void {
    this.qrgeneratorService.addQrgenerator(this.formData.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.router.navigate(['layout/facility/management/displayqrgenerator']),
      error: (err) => {
        console.error('Error adding Qrgenerator', err);
      },
    });
  }
  patchFormData() {
    console.log(this.qrgenerator);
    this.formData.patchValue(this.qrgenerator);

  }
  private updateQrgenerator(): void {
    this.qrgeneratorService.updateQrgenerator(this.formData.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.router.navigate(['layout/facility/management/displayqrgenerator']),
      error: (err) => {
        console.error('Error updating Qrgenerator', err);
      },
    });
  }

  clearForm(): void {
    this.formData.reset();
  }

  gotoQrgenerators(): void {
    this.router.navigate(['layout/facility/management/displayqrgenerator']);
  }
}
