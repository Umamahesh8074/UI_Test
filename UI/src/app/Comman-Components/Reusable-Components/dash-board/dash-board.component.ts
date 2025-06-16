import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent {

//   @Input() headerColor: string = 'blue'; // Default color
//   @Input() bodyColor: string = 'lightgray'; // Default color
//   @Input() headerText: string = 'Header';
//   @Input() bodyText: any = 'Body content';
//   @Input() menuItems: { label: string, route: string }[] = [];
//   menuVisible: boolean = false;
//   @Input() icon: string = ''; // Default icon
//    constructor(private router: Router) {}
//   ngOnInit(): void {
   
//   }
  
  
//   @ViewChild(MatMenuTrigger)
//   menuTrigger!: MatMenuTrigger;
//   ngAfterViewInit() {
//     // Ensures that menuTrigger is initialized
//     // if (!this.menuTrigger) {
//     //   console.error('MatMenuTrigger not found');
//     // }
    
   
//   }
//  onHeaderClick(event: MouseEvent) {
//     event.stopPropagation(); // Prevents the click from bubbling up to the container
//     this.toggleMenu();
//   }

//   onBoxClick(event: MouseEvent) {
//     this.toggleMenu();
//   }

//   toggleMenu() {
//     if (this.menuItems.length > 1) {
//       if (this.menuVisible) {
//         this.menuTrigger.closeMenu(); // Close the menu
//       } else {
//         this.menuTrigger.openMenu(); // Open the menu
//       }
//       this.menuVisible = !this.menuVisible;
//     } else if (this.menuItems.length === 1) {
//       this.navigateToPage(this.menuItems[0].route);
//     }
//   }

//   navigateToPage(route: string) {
//     this.router.navigate([`/${route}`]); // Navigate to the route
//     this.menuVisible = false;
//   }

@Input() heading: string = '';
@Input() count: number | string = 0;
@Input() icon: string = '';
@Input() backgroundColor: string = '';
@Input() hoverColor: string = ''; // New property for hover color
@Input() styles: { [key: string]: string } = {};
@Output() cardClick = new EventEmitter<void>();
hover: boolean = false;
onCardClick(): void {
  this.cardClick.emit();
}

}
