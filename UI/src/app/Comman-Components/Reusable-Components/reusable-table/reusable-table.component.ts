import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TeamDashBoardDataDto } from 'src/app/Models/Presales/lead';
import { User } from 'src/app/Models/User/User';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';

@Component({
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.css']
})
export class ReusableTableComponent implements OnInit {
  // @Input() headers: string[] = [];
  // @Input() data: any[] = [];
  // @Input() headerColor: string = '#f5f5f5'; 
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() clickableRows: boolean = false;
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  user: User = new User();
  userRole: any;
  dateRange: number=7;
  startDate: any;
  endDate: any;
  teamData: TeamDashBoardDataDto[] = [];

  constructor(private router: Router,private leadService:LeadService) {}
  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);
      this.userRole=this.user.roleName
  }
  
}


  // onRowClick(row: any) {
  //   if (this.clickable && this.route) {
  //     console.log('Row clicked:', row);
  //     const queryParams = { userId: row.userId };
  //     this.router.navigate([this.route], { queryParams });
  //   }
  // }
  onRowClick(row: TeamDashBoardDataDto): void {
    if (this.clickableRows) {
      console.log(this.userRole);
      
      const userRoleLower = this.userRole?.toLowerCase() || '';
      const route = userRoleLower.includes('presale')
        ? 'layout/presales/leads/PST'
        : 'layout/sales/leads/ST';
  
      // Define the query parameters with the necessary properties
      const queryParams = {
        userId: row.userId,
        userName: row.userName,
      };
  
      // Navigate to the desired route with the query parameters
      this.router.navigate([route], { queryParams });
    }
  } 
}




