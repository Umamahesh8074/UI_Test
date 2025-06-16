import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ServiceCodeService } from 'src/app/Services/WorkOrderService/ServiceCode/ServiceCode.service';

@Component({
  selector: 'app-autov1',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css'],
})
export class AutoV1Component implements OnInit {
  serviceCodes: any;
  serviceCodeName: string = '';
  private destroy$ = new Subject<void>();

  constructor(private serviceCodeService: ServiceCodeService) {}

  ngOnInit(): void {
    this.fetchServiceCodes();
  }

  fetchServiceCodes(): void {
    this.serviceCodeService
      .getServiceCodeDtosWithOutPage(this.serviceCodeName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceCodes) => {
          this.serviceCodes = serviceCodes;
          console.log(this.serviceCodes);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }
}
