import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  CommonReferenceDetails,
  ICommonReferenceDetails,
} from 'src/app/Models/User/CommonReferenceDetails';
import {
  CommonReferenceType,
  CommonReferenceTypeDto,
} from 'src/app/Models/User/CommonReferenceType';
import { User } from 'src/app/Models/User/User';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { CommonreferencetypeService } from 'src/app/Services/UserService/commonreferencetype.service';
@Component({
  selector: 'app-commonreference-details',
  templateUrl: './commonreference-details.component.html',
  styleUrls: ['./commonreference-details.component.css'],
})
export class CommonreferenceDetailsComponent implements OnInit {
  commonReferenceDetails: ICommonReferenceDetails =
    new CommonReferenceDetails();
  isAdding: boolean = true;
  errorMessage: string | null = null;
  organizationId = 0;
  roleId = 0;
  public user: User = new User();
  private destroy$ = new Subject<void>();
  commonReferenceTypes: CommonReferenceType[] = [];

  commonReferenceTypesDto: CommonReferenceTypeDto[] = [];
  constructor(
    private router: Router,
    private commonReferenceDetailsService: CommonreferencedetailsService,
    private builder: FormBuilder,
    private commonReferenceTypeService: CommonreferencetypeService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;

      console.log(this.user.organizationId);
      console.log('role ID ' + this.roleId);
    }
    this.fetchAllCommonReferenceType();
    this.commonReferenceDetails = history.state.commonreferencedetails;
    console.log(history.state.commonreferencedetails);
    if (history.state.commonreferencedetails != null) {
      this.isAdding = false;
    }
    this.formData = this.builder.group({
      id: this.commonReferenceDetails.id,
      referenceTypeId: this.builder.control(
        this.commonReferenceDetails.referenceTypeId,
        Validators.required
      ),
      commonRefKey: this.builder.control(
        this.commonReferenceDetails.commonRefKey,
        Validators.required
      ),
      commonRefValue: this.builder.control(
        this.commonReferenceDetails.commonRefValue,
        Validators.required
      ),
      refValue: this.builder.control(
        this.commonReferenceDetails.refValue ?? null
      ),
      refOrder: this.builder.control(
        this.commonReferenceDetails.refOrder ?? null
      ),
    });
  }

  formData = this.builder.group({
    id: this.builder.control(0),
    referenceTypeId: this.builder.control(0, Validators.required),
    commonRefKey: this.builder.control('', Validators.required),
    commonRefValue: this.builder.control('', Validators.required),
    refValue: this.builder.control(''),
    refOrder: this.builder.control(0),
  });

  save() {
    //adding workflowstage
    if (this.formData.valid) {
      if (this.isAdding) {
        console.log(this.formData.value);
        this.commonReferenceDetailsService
          .addCommonReferenceDetails(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/commonreferencedetails']);
            },
            error: (err) => {
              console.error('Error adding Menu Item:', err);
              this.handleError(err); // Handle the error
            },
          });
      } else {
        this.commonReferenceDetailsService
          .editCommonReferenceDetails(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/commonreferencedetails']);
            },
            error: (err) => {
              console.error('Error updating commonreferencedetails', err);
            },
          });
      }
    }
  }
  private handleError(err: any): void {
    console.error('Error saving/updating menu:', err.error.message);
    this.toastrService.error('Failed', err.error.message, {
      timeOut: 3000, // Set success timeout
    });
  }
  clearForm() {
    this.formData.reset();
  }

  gotoCommonReferenceDetails() {
    this.router.navigate(['layout/commonreferencedetails']);
  }

  fetchAllCommonReferenceType() {
    this.commonReferenceTypeService
      .fetchAllCommonReferenceType('', this.roleId)
      .subscribe({
        next: (commonReferenceTypes) => {
          this.commonReferenceTypesDto = commonReferenceTypes;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
