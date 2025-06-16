import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { User } from 'src/app/Models/User/User';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-channel-partner-approval',
  templateUrl: './channel-partner-approval.component.html',
  styleUrls: ['./channel-partner-approval.component.css'],
})
export class ChannelPartnerApprovalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  destroy$ = new Subject<void>();
  channelPartnerData: any;
  page: number = 0;
  user: User = new User();
  size: number = 10;
  dataSource!: any;
  userId: number = 0;
  name: string = '';
  pageSizeOptions = pageSizeOptions;
  isApproval = true;
  totalItems: number = 0;
  displayedColumns = [
    'name',
    'phoneNumber',
    // 'email',
    'officeNumber',
    'companyName',
    'registrationDate',
    'expirationDate',
    'status',
    // 'Bulk Upload',
    'Upload Limit',
    'rera',
    'pan',
    'aadhar',
    'gst',
    'person',
    'actions',
  ];
  pageSize: number = 14;
  pageIndex: number = 0;
  statusName: string = '';
  imageUrl: any;
  documents = [
    { label: 'Pan', url: 'panUrl' },
    { label: 'Aadhar', url: 'aadharUrl' },
    { label: 'Rera', url: 'reraUrl' },
    { label: 'Behalf Of Person', url: 'personUrl' },
    { label: 'Gst Certificate', url: 'gstCertificate' },
  ];
  documentsByPerson: Map<number, { label: string; url: string }[]> = new Map();
  http: any;

  constructor(
    private channelPartnerService: ChannelPartnerRegisterService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private leadCommonService: LeadsCommonService
  ) {}
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      console.log('user');
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
    }
    this.route.params.subscribe((params: any) => {
      console.log(params);
      console.log(this.isApproval);
      this.isApproval = params['ACP'] === 'ACP';
      console.log(this.isApproval);

      this.getApprovalChannelPartners(
        this.name,
        this.pageIndex,
        this.pageSize,
        this.isApproval,
        this.statusName,
        this.userId
      );
    });
  }
  onSearch(searchText: any) {
    this.name = searchText;
    this.pageIndex = 0;
    this.paginator.firstPage();
    if (this.name?.length === 0) {
      this.getApprovalChannelPartners(
        this.name,
        this.pageIndex,
        this.pageSize,
        this.isApproval,
        this.statusName,
        this.userId
      );
    }
  }

  onClickSearchName() {
    if (this.name?.length > 0) {
      this.getApprovalChannelPartners(
        this.name,
        this.pageIndex,
        this.pageSize,
        this.isApproval,
        this.statusName,
        this.userId
      );
    }
  }
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
  //get approval channel partners
  getApprovalChannelPartners(
    name: string,
    page: number,
    size: number,
    isApproval: boolean,
    statusName: string,
    userId: number
  ) {
    this.name = name;
    this.leadCommonService.showLoading();
    this.channelPartnerService
      .getApprovalChannelPartners(
        page,
        size,
        isApproval,
        this.name,
        this.userId,
        this.statusName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.leadCommonService.hideLoading();
          // Ensure the response contains records and is an array
          if (response && Array.isArray(response.records)) {
            this.channelPartnerData = response.records;
            this.totalItems = response.totalRecords; // Use totalRecords for pagination
            this.dataSource = new MatTableDataSource(this.channelPartnerData);
            // this.setupDocuments();
          } else {
            console.error('No valid records found in response:', response);
            this.channelPartnerData = []; // Handle gracefully
            this.dataSource = new MatTableDataSource([]);
          }
        },
        error: (error: Error) => {
          this.leadCommonService.hideLoading();

          console.error('Error fetching approval channel partners:', error);
          this.channelPartnerData = []; // Handle gracefully
          this.dataSource = new MatTableDataSource([]);
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getApprovalChannelPartners(
      this.name,
      this.pageIndex,
      this.pageSize,
      this.isApproval,
      this.statusName,
      this.userId
    );
  }

  goForApprovals(selectedId: string) {
    console.log('Going to goForApprovals with ID:', selectedId);
    this.router.navigate(['layout/presales/cp/approve'], {
      state: {
        isApproval: true,
        channelPartnerData: this.channelPartnerData,
        selectedId: selectedId,
      },
    });
  }

  goForApprovalsComp(selectedId: string) {
    console.log('Going to goForApprovalsComp with ID:', selectedId);

    this.router.navigate(['layout/presales/cp/approve'], {
      state: {
        isApproval: false,
        channelPartnerData: this.channelPartnerData,
        selectedId: selectedId,
      },
    });
  }
  goToEditCpComp(cpId: number) {
    console.log('Going to Update Cp with ID:', cpId);
    this.channelPartnerService.getCpById(cpId).subscribe({
      next: (data) => {
        this.router.navigate(['layout/presales/update/registeredcp'], {
          state: {
            channelPartnerData: data,
          },
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
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
            text: `The file "${fileNameFromUi}" has been downloaded successfully!`,
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
  // download(phoneNumber: string, name: string, url: string): void {
  //   const cpName = name.replace(' ', '');
  //   if (!url) {
  //     console.error('URL is not provided.');
  //     Swal.fire({
  //       icon: 'error',
  //       text: 'URL not available',
  //       timer: 2000,
  //       timerProgressBar: true,
  //       showConfirmButton: false,
  //     });
  //     return;
  //   }
  // Assuming you need to find a specific record based on some criteria
  // Modify this logic according to your actual needs
  //   this.channelPartnerService
  //     .downloadFileName(phoneNumber, cpName, url)
  //     .subscribe({
  //       next: (response: Blob) => {
  //         this.downloadFile(
  //           response,
  //           `${phoneNumber}_${cpName}_${url.split('/').pop()}`
  //         );
  //         Swal.fire({
  //           icon: 'success',
  //           text: 'File downloaded successfully',
  //           timer: 2000,
  //           timerProgressBar: true,
  //           showConfirmButton: false,
  //         });
  //       },
  //       error: (error: any) => {
  //         Swal.fire({
  //           icon: 'error',
  //           text: 'Error Occurred',
  //           timer: 2000,
  //           timerProgressBar: true,
  //           showConfirmButton: false,
  //         });
  //       },
  //     });
  // }

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
  onStatusSelectionChange(event: any) {
    this.statusName = event.value;
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.getApprovalChannelPartners(
      this.name,
      this.pageIndex,
      this.pageSize,
      this.isApproval,
      this.statusName,
      this.userId
    );
  }
  setupDocuments(): void {
    if (
      Array.isArray(this.channelPartnerData) &&
      this.channelPartnerData.length > 0
    ) {
      this.documentsByPerson.clear(); // Clear previous data

      this.channelPartnerData.forEach((person) => {
        const documents: { label: string; url: string }[] = [];
        if (person.aadharUrl) {
          documents.push({ label: 'Aadhar', url: person.aadharUrl });
        }
        if (person.panUrl) {
          documents.push({ label: 'PAN', url: person.panUrl });
        }
        if (person.reraUrl) {
          documents.push({ label: 'RERA', url: person.reraUrl });
        }
        if (person.gstCertificate) {
          documents.push({
            label: 'GST Certificate',
            url: person.gstCertificate,
          });
        }
        // Add documents for this person to the map
        this.documentsByPerson.set(person.id, documents);
        console.log(this.documentsByPerson);
      });

      // Log documentsByPerson to verify
      console.log('Documents by Person:', this.documentsByPerson);
    } else {
      console.error('No records found in channelPartnerData.');
    }
  }
}
