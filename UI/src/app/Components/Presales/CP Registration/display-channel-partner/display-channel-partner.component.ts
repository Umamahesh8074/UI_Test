import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { leadPageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-channel-partner',
  templateUrl: './display-channel-partner.component.html',
  styleUrls: ['./display-channel-partner.component.css'],
})
export class DisplayChannelPartnerComponent {
  destroy$ = new Subject<void>();
  channelPartnerData: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // page: number = 0;
  // size: number = 10;
  phoneNumber: any = '';
  totalItems: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;
  pageSizeOptions = leadPageSizeOptions;
  channelPartnerName: string = '';

  displayedColumns = [
    'rowNumber',
    'name',
    'phoneNumber',
    'officeNumber',
    'email',
    'companyName',
    'registrationDate',
    'reraExpDate',
    'rera',
    'pan',
    'aadhar',
    'gst',
    'person',
    'actions',
  ];
  constructor(
    private channelPartnerService: ChannelPartnerRegisterService,

    private router: Router,
    private cpService: ChannelPartnerRegisterService,
    private leadCommonService: LeadsCommonService
  ) {
    this.getChannelPartners('');
  }

  registerChannelPartner() {
    this.router.navigate(['layout/presales/cpregister']);
  }

  //get all channel partners
  getChannelPartners(cpName: any) {
    this.leadCommonService.showLoading();
    this.cpService
      .getChannelPartnerRegisterDetails(
        cpName,
        this.pageIndex,
        this.pageSize,
        this.phoneNumber
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.channelPartnerData = response.records;
          this.totalItems = response.totalRecords;
          this.leadCommonService.hideLoading();
        },
        error: (error) => {
          console.log(error);
          this.leadCommonService.hideLoading();
        },
      });
  }

  //edit channel partner
  editChannelPartner(channelPartner: any) {
    console.log('id taking ', channelPartner.id);
    this.getCPById(channelPartner.id).subscribe({
      next: (response) => {
        console.log(response); // Verify if data is correctly fetched
        this.channelPartnerData = response;
        // Navigate with state once the data is available
        this.router.navigate(['layout/presales/cpregister'], {
          state: { channelPartnerData: this.channelPartnerData },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getCPById(cpId: any) {
    console.log(cpId);
    return this.cpService
      .getChannelPartner(cpId)
      .pipe(takeUntil(this.destroy$));
  }

  openConfirmDialog(event: any) {
    console.log('event.........', event);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getChannelPartners('');
  }
  onSearch(cpName: any) {
    console.log(cpName);
    // this.channelPartnerName= cpName;
    // this.pageIndex = 0;
    // this.paginator.firstPage();
    // this.getChannelPartners(this.phoneNumber);
    this.channelPartnerName = cpName;
    this.pageIndex = 0;
    this.paginator.firstPage();
    if (this.channelPartnerName?.length === 0) {
      this.getChannelPartners(this.channelPartnerName);
    }
  }

  onClickSearchName() {
    if (this.channelPartnerName?.length > 0) {
      this.getChannelPartners(this.channelPartnerName);
    }
  }
  download(filePath: string, fileNameFromUi: string): void {
    const decodedUrl = decodeURIComponent(filePath);
    let fileName = fileNameFromUi; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.channelPartnerService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          Swal.fire({
            title: 'Downloaded',
            text: `The file  has been downloaded successfully!`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          console.error('Error downloading PDF:', error);
          Swal.fire({
            title: 'Error',
            text: `Failed to download the file "${fileNameFromUi}". Please try again later.`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }
  private downloadFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  onEnterPhNum(phoneNumber: number) {
    this.phoneNumber = phoneNumber;
    if (this.phoneNumber.length == 0) {
      this.getChannelPartners('');
    }
  }
  onClickSearchPhNum() {
    this.getChannelPartners('');
  }
}
