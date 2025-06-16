import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class LeadsCommonService {
  constructor(private loaderService: LoaderService) {}

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  convertToDateTime(dateString: string): Date {
    // Replace 'T' with a space to create a valid date string
    const formattedString = dateString.replace('T', ' ').substring(0, 26); // Keep only up to 26 characters for microsecond precision
    return new Date(formattedString);
  }

  handleSuccessResponse(response: any): void {
    Swal.fire({
      title: 'Success!',
      text: response.message || 'Operation completed successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  handleErrorResponse(response: any): void {
    Swal.fire({
      title: 'Error!',
      text: response.error?.message || 'An error occurred. Please try again.',
      icon: 'error',
      confirmButtonText: 'Close',
    });
  }

  handleErrorMessage(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message || 'An error occurred. Please try again.',
      icon: 'error',
      confirmButtonText: 'Close',
    });
  }
  handleSuccessMessage(message: string): void {
    Swal.fire({
      title: 'Success!',
      text: message || 'Operation completed successfully.',
      icon: 'success',
      confirmButtonText: 'Ok',
    });
  }
  showLoading() {
    this.loaderService.show();
  }

  hideLoading() {
    this.loaderService.hide();
  }
}
