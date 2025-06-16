import { Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { ConfirmdialogComponent } from '../Dialog/confirmdialog/confirmdialog.component';
import Swal from 'sweetalert2';
import { FormGroup } from '@angular/forms';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export abstract class ReusableComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();

  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  pagination = true;
  formData!: FormGroup;
  userId: number = 0;
  roleId: number = 0;
  organizationId: number = 0;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    protected commanService: CommanService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    this.formData = new FormGroup({});
  }

  protected setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.roleId = user.roleId;
      this.userId = user.userId;
    }
  }

  handleSuccessResponse(response: any): void {
    Swal.fire({
      title: 'Success',
      text: response.message,
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: true,
    }).then(() => {});
  }

  handleErrorResponse(error: any): void {
    Swal.fire({
      title: 'Error',
      text: error?.error?.message || 'An unknown error occurred',
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
      }
    });
  }

  // navigateTo(path: string): void {
  //   this.router.navigate([path], { relativeTo: this.route.parent });
  // }

  navigateTo(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(typeof path === 'string' ? [path] : path, {
      ...extras,
      relativeTo: this.route.parent,
    });
  }
  clearForm() {
    this.formData.reset();
  }
}
