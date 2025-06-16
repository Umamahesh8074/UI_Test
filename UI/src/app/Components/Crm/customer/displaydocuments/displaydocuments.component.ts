import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApplicantInfo } from 'src/app/Models/Crm/ApplicantInfo';
import { User } from 'src/app/Models/User/User';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import { DocumentUrlDto } from 'src/app/Models/Project/project';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-displaydocuments',
  templateUrl: './displaydocuments.component.html',
  styleUrls: ['./displaydocuments.component.css'],
})
export class DisplaydocumentsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  private overlayClass = 'customerdocuments-overlay-class';
  units: any[] = [];
  selectedUnitId: number = 0;
  user: User = new User();
  documentsData: any = {};
  userId: number = 0;
  paginatedDocuments: any = [];
  currentPage = 0;
  itemsPerPage = 6;

  constructor(
    private customerService: CustomerService,
    private applicantInfo: ApplicationInfoService,
    private renderer: Renderer2,
    private customerStageService: CustomerStageService,
    private overlayContainer: OverlayContainer
  ) {}

  ngOnInit(): void {
    
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
    }
    this.getUnitsBookedByCustomerId();
    this.renderer.addClass(document.body, 'customer-dashboard-bg');
    this.updatePaginatedDocuments();
  }

  ngAfterViewInit(): void {
    // Add styles to headDivs after the view is initialized
    const headDivs = document.querySelectorAll('.head-div');
    headDivs.forEach((element) => {
      this.renderer.setStyle(
        element,
        'background-color',
        'rgba(213, 216, 220, 0.9)'
      );
    });
    //Change CSS in particular Component and update css in style.css
    this.overlayContainer
      .getContainerElement()
      .classList.add(this.overlayClass);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(document.body, 'customer-dashboard-bg');
    // Reset the CSS for customer layout `head-div` class
    const headDivs = document.querySelectorAll('.head-div');
    headDivs.forEach((element) => {
      this.renderer.removeStyle(element, 'background-color'); // Reset the style
    });
    //Change CSS in particular Component
    this.overlayContainer
      .getContainerElement()
      .classList.remove(this.overlayClass);
  }

  getUnitsBookedByCustomerId() {
    this.customerService
      .getUnitsBookedByCustomerId(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (units) => {
          this.units = units;
          if (units.length === 1) {
            this.selectedUnitId = units[0].unitId;
            this.getDocuments(this.selectedUnitId);
          }
        },
        error: (error) => {
          console.error('Error fetching Units:', error);
        },
      });
  }

  // onUnitSelected(event: any) {
  //   // Access the selected value (event.value contains the selected id)
  //   this.selectedUnitId = event.value;
  //   this.getDocuments(this.selectedUnitId);
  // }

  getDocuments(unitId: number): void {
    this.applicantInfo
      .getUnitDocuments(unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (documentsData) => {
          // Assuming documentsData is already an array of objects
          this.documentsData = documentsData;
          this.currentPage = 0; // Reset to first page
          this.updatePaginatedDocuments();
        },
        error: (error) => {
          console.error('Error fetching documents:', error);
        },
      });
  }

  onUnitSelected(event: any) {
    this.selectedUnitId = event.value;
    this.getDocuments(this.selectedUnitId);
  }

  // Number of documents per page


  downloadDocument(filePath: string, fileNameFromUi: string): void {
    const decodedUrl = decodeURIComponent(filePath);
    let fileName = fileNameFromUi; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.customerStageService
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

  downloadFile(response: Blob, fileName: string): void {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  updatePaginatedDocuments(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDocuments = this.documentsData.slice(startIndex, endIndex);
  }
  
  goToNextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.updatePaginatedDocuments();
    }
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedDocuments();
    }
  }
  
  hasNextPage(): boolean {
    return (this.currentPage + 1) * this.itemsPerPage < this.documentsData.length;
  }
  

  
}
