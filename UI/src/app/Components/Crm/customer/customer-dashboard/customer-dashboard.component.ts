import { ChangeDetectorRef, Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/Models/User/User';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit{
 
  user: User = new User();
  userId:number=0;
  private destroy$ = new Subject<void>(); // To manage unsubscription
//booking: any;
chart: Chart | any;

  constructor(
    private customerService: CustomerService, 
    private cdr: ChangeDetectorRef,
  private overlayContainer: OverlayContainer,
  private router: Router,
  private renderer: Renderer2 /* Baground Applied to Particular Component */
  ) {}


  expandedBookingStates: { [key: number]: boolean } = {};

  ngOnInit() {
    // Fetch booking details for customer with ID 196
    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.user = JSON.parse(user);
      this.userId = this.user.userId;
    }
    console.log('AddLeadComponent initialized');
    
    this.renderer.addClass(document.body, 'customer-dashboard-bg'); /* Baground Applied to Particular Component */
    
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer
      .getContainerElement()
      .classList.remove('customer-dashboard');
      /* Baground Applied to Particular Component */
    if (this.chart) {
      this.chart.destroy();
    }
    this.renderer.removeClass(document.body, 'customer-dashboard-bg');    
  }
  navigateToUnitDetails(): void {
    this.router.navigate(['/custlayout/customerunitsdisplay']);
  }

  // Navigate to Stages And Payments page
  navigateToStagesAndPayments(): void {
    this.router.navigate(['/custlayout/customerstagesdisplay']);
  }
  navigateToCustomerPayments()
  {
    this.router.navigate(['/custlayout/customerpayment']);
  }
  navigateToDisplayDocuments()
  {
    this.router.navigate(['/custlayout/displaydocuments']);
  }
  navigateToCustomerLead()
  {
    this.router.navigate(['/custlayout/customer/lead']);
  }
  
}
