import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/Models/User/User';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import Chart from 'chart.js/auto';
import { OverlayContainer } from 'ngx-toastr';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-customerunitsdisplay',
  templateUrl: './customerunitsdisplay.component.html',
  styleUrls: ['./customerunitsdisplay.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerunitsdisplayComponent {
  bookingData: any[] = []; // This will hold the list of booking details
  selectedBookingId: number | null = null; // To store the id of the selected booking
  user: User = new User();
  userId: number = 0;
  private destroy$ = new Subject<void>(); // To manage unsubscription
  //booking: any;
  chart: Chart | any;

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private overlayContainer: OverlayContainer,
    private renderer: Renderer2
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
    this.getAllBookingDetailsForCustomer();
    this.renderer.addClass(document.body, 'customer-dashboard-bg');
  }

  // Fetch booking details for customer
  getAllBookingDetailsForCustomer() {
    this.customerService
      .getBookingDetailsByCustomerId(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (booking) => {
          this.bookingData = booking;
          // this.expandedBookingIds.add( // Store the fetched booking data
          if (this.bookingData.length > 0) {
            this.expandedBookingStates[this.bookingData[0].bookingId] = true; // First item expanded
          }
          console.log(this.bookingData);
          console.log(booking); // You can log it for debugging purposes
        },
        error: (error: Error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }
  // Track the currently selected booking ID

  // Method to toggle the booking details view
  //  toggleBookingDetails(bookingId: number) {
  //    // If the clicked booking is already selected, collapse it
  //    if (this.selectedBookingId === bookingId) {
  //      this.selectedBookingId = null;
  //    } else {
  //      // Otherwise, expand the clicked booking and collapse others
  //      this.selectedBookingId = bookingId;
  //    }
  //  }
  // toggleBookingDetails(bookingId: number) {
  //   this.selectedBookingId = this.selectedBookingId === bookingId ? null : bookingId;
  // }

  // Cleanup to avoid memory leaks
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
    this.renderer.addClass(document.body, 'customer-dashboard-bg');
  }

  // Method to toggle the expanded state of a booking
  // toggleExpandedBooking(bookingId: number) {
  //   console.log(bookingId);

  //   if (this.expandedBookingIds.has(bookingId)) {
  //     this.expandedBookingIds.delete(bookingId);  // Close the panel if already expanded
  //   } else {
  //     this.expandedBookingIds.add(bookingId);  // Open the panel if not already expanded
  //   }
  // }

  // ngAfterViewInit() {
  //   // Ensure the first booking is expanded if only one booking exists
  //   console.log(this.bookingData.length)
  //   if (this.bookingData.length === 0) {
  //     this.toggleExpandedBooking(this.bookingData[0].bookingId);
  //   }
  // }

  setExpandedState(bookingId: number, state: boolean) {
    this.expandedBookingStates[bookingId] = state;
  }
}
