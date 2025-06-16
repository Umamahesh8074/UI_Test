import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  CommonReferenceType,
  ICommonReferenceType,
} from 'src/app/Models/User/CommonReferenceType';
import { CommonreferencetypeService } from 'src/app/Services/UserService/commonreferencetype.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-common-reference-type',
  templateUrl: './common-reference-type.component.html',
  styleUrls: ['./common-reference-type.component.css'],
})
export class CommonReferenceTypeComponent {
  commonReferenceType: ICommonReferenceType = new CommonReferenceType();
  isAdding: boolean = true;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();
  constructor(
    private commonreferencetypeService: CommonreferencetypeService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.commonReferenceType = history.state.commonReferenceType;
    if (history.state.commonReferenceType != null) {
      this.isAdding = false;
    }
    this.formData = this.builder.group({
      id: this.commonReferenceType.id,
      name: this.builder.control(
        this.commonReferenceType.name,
        Validators.required
      ),
    });
  }
  formData = this.builder.group({
    id: this.builder.control(0),
    name: this.builder.control('', Validators.required),
  });

  save() {
    //adding menu
    if (this.formData.valid) {
      if (this.isAdding) {
        this.commonreferencetypeService
          .addCommonReferenceType(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/commonreferencetype']);
              console.log(resp);
            },
            error: (err) => {
              console.error('Error adding Menu Item:', err);
              this.handleError(err);  // Handle the error
          },
          });
      } else {
        //updating menu
        this.commonreferencetypeService
          .editCommonReferenceType(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/commonreferencetype']);
            },
            error: (err) => {
              console.error('Error updating commonreferencetype', err);
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

  gotoCommonReferenceType() {
    this.router.navigate(['layout/commonreferencetype']);
  }
}
