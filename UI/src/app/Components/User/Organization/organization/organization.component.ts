import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { OrganizationBean } from 'src/app/Models/User/Organization';

import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
})
export class OrganizationComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  showAdditionalFields: any[] = [];
  private destroy$ = new Subject<void>();
  statuses: CommonReferenceType[] = [];
  formData!: FormGroup;
  organization: OrganizationBean = new OrganizationBean();
  isAdding: boolean = true; // Assuming this flag controls whether you're adding or editing an item
  saveOrUpdateSubscription: Subscription = new Subscription();
  user: User = new User();

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private commonReferenceDetailsService: CommanService
  ) {
    this.formData = this.builder.group({
      organizationId: [0, Validators.required],
      organizationName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      organizationContact: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      status: ['', [Validators.required]],
      orgAddress1: ['', [Validators.required]],
      orgAddress2: [''],
      orgCity: ['', [Validators.required]],
      orgPincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      orgGstinUin: ['', [Validators.required, Validators.maxLength(15)]],
      orgState: ['', [Validators.required]],
      orgCode: ['', [Validators.required]],
      orgPan: [
        '',
        [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')],
      ],
    });
    this.createFormBuilder();
  }

  ngOnInit(): void {
    this.getCommonStatuses();
    this.initializeForm();
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
    console.log(history.state.organization);
    this.organization = history.state.organization;
    if (this.organization) {
      console.log(this.organization);
      this.isAdding = false;
      this.patchFormData();
    }
  }

  ngOnDestroy(): void {
    console.log('cleared data ngOnDestroy');
    this.saveOrUpdateSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterContentInit(): void {}

  private createFormBuilder(): void {
    this.formData = this.builder.group({
      organizationId: [0, Validators.required],
      name: ['', [Validators.required]],
      organizationContact: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      status: ['', [Validators.required]],
    });
  }

  private initializeForm(): void {
    this.formData = this.builder.group({
      organizationId: [0, Validators.required],
      organizationName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      organizationContact: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      status: ['', [Validators.required]],
      orgAddress1: ['', [Validators.required]],
      orgAddress2: [''],
      orgCity: ['', [Validators.required]],
      orgPincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      orgGstinUin: ['', [Validators.required, Validators.maxLength(15)]],
      orgState: ['', [Validators.required]],
      orgCode: ['', [Validators.required]],
      orgPan: [
        '',
        [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')],
      ],
    });
  }

  save() {
    console.log(this.formData);
    if (this.isAdding) {
      this.formData.patchValue({ status: 'A' });
    }
    if (this.formData.invalid) {
      // Mark all controls as touched to trigger validation messages
      this.formData.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }
    if (this.isAdding) {
      this.organizationService
        .saveOrganization(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['./organizations'], {
              relativeTo: this.route.parent,
            });
          },
          error: (err) => {
            console.error('Error adding Organization', err);
          },
        });
    } else {
      this.organizationService
        .updateOrganization(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['./organizations'], {
              relativeTo: this.route.parent,
            });
          },
          error: (err) => {
            console.error('Error updating Organization', err);
          },
        });
    }
  }

  patchFormData() {
    if (this.organization) {
      this.formData.patchValue(this.organization);
    }
  }

  gotoItemCategory() {
    this.router.navigate(['./organizations'], {
      relativeTo: this.route.parent,
    });
  }

  getCommonStatuses() {
    this.commonReferenceDetailsService
      .fetchCommonReferenceTypes(COMMON_STATUS)
      .subscribe({
        next: (data) => {
          this.statuses = data;
          this.setDefaultStatus();
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }

  setDefaultStatus() {
    const defaultStatus = this.statuses.find(
      (status) => status.commonRefKey === this.organization?.status
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
}
