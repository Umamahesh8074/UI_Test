import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { ChartOptions } from 'chart.js/auto';
import { ApexChart, ApexLegend, ApexNonAxisChartSeries, ApexOptions, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { MapDto } from 'src/app/Models/Presales/lead';
import { User } from 'src/app/Models/User/User';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';

@Component({
  selector: 'app-apex-charts',
  templateUrl: './apex-charts.component.html',
  styleUrls: ['./apex-charts.component.css']
})
export class ApexChartsComponent implements  AfterViewInit {
  ngOnInit(): void {
  }
  user: User = new User();
  userRole: string = '';
  nonContactableLeads: number = 0;
  totalLeads: number = 0;
  bookedLeadsCount: number = 0;
  closedLeads: number = 0;
  lostLeads: number = 0;
  private destroy$ = new Subject<void>();

  // public chartOptions: ApexOptions = {
  //   series: [
  //     this.closedLeads,
  //     this.bookedLeadsCount,
  //     this.lostLeads,
  //     this.nonContactableLeads
  //   ],
  //   chart: {
  //     height: 350,
  //     type: 'donut',
  //   },
  //   plotOptions: {
  //     pie: {
  //       donut: {
  //         labels: {
  //           show: true,
  //           name: {
  //             show: false
  //           },
  //           value: {
  //             show: true,
  //             formatter: (val) => {
  //               const numericVal = Number(val);
  //               const percentage = this.totalLeads === 0 ? 0 : ((numericVal / this.totalLeads) * 100).toFixed(2);
  //               return `${percentage}% (${numericVal} Leads)`;
  //             }
  //           },
  //           total: {
  //             show: true,
  //             showAlways: false,
  //             formatter: () => {
  //               return this.totalLeads + ' Leads';
  //             }
  //           }
  //         }
  //       }
  //     }
  //   },
  //   colors: [
  //     '#FF6F61', // Vibrant color for Closed
  //     '#4CAF50', // Vibrant color for Booked
  //     '#2196F3', // Vibrant color for Lost
  //     '#FFC107'  // Vibrant color for Non-Contactable
  //   ],
  //   labels: ['Closed', 'Booked', 'Lost', 'Non-Contactable'],
  //   dataLabels: {
  //     enabled: true,
  //     formatter: (val) => {
  //       const numericVal = Number(val);
  //       const percentage = this.totalLeads === 0 ? 0 : ((numericVal / this.totalLeads) * 100).toFixed(2);
  //       return `${percentage}%`;
  //     }
  //   },
  //   legend: {
  //     position: 'right',
  //     show: true
  //   }
  // };

  // constructor(private leadService: LeadService, private cdr: ChangeDetectorRef) {}

  // ngOnInit() {
  //   const user = localStorage.getItem('user');
  //   if (user) {
  //     this.user = JSON.parse(user);
  //     this.userRole = this.user.roleName;
  //   }
  //   this.fetchTotalLeadsCount();
  // }

  // fetchTotalLeadsCount() {
  //   this.leadService
  //     .fetchTotalLeadsCount(this.user.userId, this.user.roleId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response: MapDto[]) => {
  //         this.totalLeads = response.reduce((total, lead) => total + lead.value, 0);
  //         this.bookedLeadsCount = 0;
  //         this.closedLeads = 0;
  //         this.lostLeads = 0;
  //         this.nonContactableLeads = 0;

  //         response.forEach((lead) => {
  //           const leadStatus = lead.status.toLowerCase();
  //           if (leadStatus === 'closed') {
  //             this.closedLeads = lead.value;
  //           } else if (leadStatus === 'lost') {
  //             this.lostLeads = lead.value;
  //           } else if (leadStatus === 'rnr') {
  //             this.nonContactableLeads = lead.value;
  //           } else if (leadStatus === 'booked') {
  //             this.bookedLeadsCount = lead.value;
  //           }
  //         });
  //         this.updateChartOptions();
  //       },
  //       error: (error) => console.error(error),
  //     });
  // }

  // updateChartOptions() {
  //   this.chartOptions = {
  //     ...this.chartOptions,
  //     series: [
  //       this.closedLeads,
  //       this.bookedLeadsCount,
  //       this.lostLeads,
  //       this.nonContactableLeads
  //     ]
  //   };
  //   this.cdr.detectChanges(); // Trigger change detection
  // }
  @ViewChild('chart') chart: ChartComponent | undefined;

  public chartOptions: Partial<ApexOptions> = {
    series: [44, 55, 13, 43, 22],
    chart: {
      width: 380,
      type: 'pie'
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  ngAfterViewInit() {
    // Ensure chart is available after view initialization
    if (this.chart) {
      console.log('Chart is initialized');
    }
  }
}

