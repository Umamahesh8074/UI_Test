import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { IssuesCountByProjectDto, IssuesCountDto } from 'src/app/Models/Issues/issues';
import { Project } from 'src/app/Models/Project/project';
import { User } from 'src/app/Models/User/User';
import { IssuesService } from 'src/app/Services/Issues/issues.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { ChartConfiguration, ChartData, ChartDataset, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-issue-dashboard',
  templateUrl: './issue-dashboard.component.html',
  styleUrls: ['./issue-dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IssueDashboardComponent implements OnInit{
  today: any;
  user: User = new User();
  projectId:number=0;
  issueStatusDetails:IssuesCountDto[]=[];
  issueStatusCountByProject:IssuesCountByProjectDto[]=[];
  issueStatusCountByIssueType:IssuesCountByProjectDto[]=[];
  private destroy$ = new Subject<void>();
  openStatusCount:number=0;
  closedStatusCount:number=0;
  inprogressStatusCount:number=0
  inprogressCount=0;
  openStatusCountByProject:number=0;
  closedStatusCountByProject:number=0;
  inprogressStatusCountByProject:number=0
  inprogressCountByProject=0;
  projectData:Project[]=[];
  displayedColumns: string[] = ['projectName', 'open','inprogress','closed'];
  open: number=0;
  close:number=0;
  inProgress:number=0


  @ViewChild('outerSort', { static: true })
  sort!: MatSort;
   dataSource!: MatTableDataSource<IssuesCountByProjectDto>;
   issueData = IssuesCountByProjectDto; 
  innerDisplayedColumns = ['typeName', 'open', 'closed', 'inprogress',];
  expandedElement: any | null;
  // @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  // @ViewChild('charts') public chartEl: ElementRef | undefined;
  // public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  //   responsive: true,
  //   scales: {
  //     x: {
  //       stacked: false, // Ensure bars are side by side
  //       title: {
  //         display: true,
  //         text: 'Projects'
  //       }
  //     },
  //     y: {
  //       stacked: false,
  //       beginAtZero: true,
  //       title: {
  //         display: true,
  //         text: 'Count'
  //       }
  //     }
  //   },
  // };

  // public barChartLabels: string[] = [];
  // public barChartLegend = true;
  // public barChartPlugins = [];
  // public barChartData: ChartData<'bar'> = {
  //   labels: [], // Project names
  //   datasets: [
  //     {
  //       data: [],
  //       label: 'Open',
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       borderWidth: 1,
  //       barPercentage: 0.8, // Adjust bar width
  //       categoryPercentage: 0.8 // Adjust category width
  //     },
  //     {
  //       data: [],
  //       label: 'In Progress',
  //       backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //       borderColor: 'rgba(54, 162, 235, 1)',
  //       borderWidth: 1,
  //       barPercentage: 0.8, // Adjust bar width
  //       categoryPercentage: 0.8 // Adjust category width
  //     }
  //   ]
  // };

  // myOptions = {
  //   chart: {
  //     type: 'column'
  //   },
  //   title: {
  //     text: 'Stacked bar chart'
  //   },
  //   xAxis: {
  //     categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
  //   },
  //   yAxis: {
  //     min: 0,
  //     title: {
  //       text: 'Total fruit consumption'
  //     }
  //   },
  //   legend: {
  //     reversed: true
  //   },
  //   plotOptions: {
  //     series: {
  //       stacking: 'normal'
  //     }
  //   },
  //   series: [{
  //     name: 'John',
  //     data: [5, 3, 4, 7, 2]
  //   }, {
  //     name: 'Jane',
  //     data: [2, 2, 3, 2, 1]
  //   }, {
  //     name: 'Joe',
  //     data: [3, 4, 4, 2, 5]
  //   }]
  // };
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: 'Projects'
        }
      },
      y: {
        stacked: false,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      }
    },
  };

  public barChartLabels: string[] = [];
  public barChartLegend = true;
  // public barChartData: ChartData<'bar'> = {
  //   labels: [],
  //   datasets: [
  //     { label: 'Open - Plumbing', data: [], backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1, stack: 'Open' },
  //     { label: 'Open - Electricity', data: [], backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1, stack: 'Open' },
  //     { label: 'Open - Others', data: [], backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1, stack: 'Open' },
  //     { label: 'Closed-Plumbing', data: [], backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1, stack: 'Closed' },
  //     { label: 'Closed-Electricity', data: [], backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1, stack: 'Closed' }
  //   ]
  // };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  
  private generateDatasets(data: any[]): void {
    const datasets: ChartDataset<'bar'>[] = [];
    const labelColorMap = new Map<string, string>();
  
    // Define colors for issue types dynamically
    const getColor = (index: number) => {
      const colors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ];
      return colors[index % colors.length];
    };
  
    // Extract labels and initialize datasets
    const issueTypes = ['PLUMBING', 'ELECTRICITY', 'OTHERS'];
    const statuses = ['OPEN', 'CLOSED'];
  
    // Create datasets for each combination of status and issue type
    statuses.forEach(status => {
      issueTypes.forEach((issueType, index) => {
        const label = `${status} - ${issueType}`;
        datasets.push({
          label: label,
          data: new Array(data.length).fill(0), // Initialize with zeros
          backgroundColor: getColor(index),
          borderColor: getColor(index).replace('0.2', '1'),
          borderWidth: 1,
          stack: status
        });
        labelColorMap.set(label, getColor(index));
      });
    });
  
    // Populate datasets with actual data
    data.forEach((item, index) => {
      statuses.forEach(status => {
        issueTypes.forEach((issueType, i) => {
          const label = `${status} - ${issueType}`;
          const datasetIndex = datasets.findIndex(ds => ds.label === label);
          if (datasetIndex >= 0) {
            datasets[datasetIndex].data[index] = item.statusCountsByIssueType[status][issueType] || 0;
          }
        });
      });
    });
  
    this.barChartData.datasets = datasets;
  }
  constructor(
    private router: Router,
    private issueService: IssuesService,
    private builder: FormBuilder,
    private projectService:ProjectService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
    this.today = new Date().toDateString();
    this.getIssuesCount();
    this.getstatusCountByProject()
    this.getstatusCountByIssueType();
    this.getIssuesforChart();
    // this.issueService.getIssueStatusByIssueType1().subscribe(data => {
    //   if (Array.isArray(data) && data.length > 0) {
    //     const projectNames = data.map((item: any) => item.projectName);
    //     const openPlumbingCounts = data.map((item: any) => item.open?.plumbing || 0);
    //     const openElectricityCounts = data.map((item: any) => item.open?.electricity || 0);
    //     const openOthersCounts = data.map((item: any) => item.open?.others || 0);
    //     const closedPlumbingCounts = data.map((item: any) => item.closed?.plumbing || 0);
    //     const closedElectricty = data.map((item: any) => item.closed?.electricity || 0);

    //     this.barChartLabels = projectNames;
    //     this.barChartData.labels = projectNames;
    //     this.barChartData.datasets[0].data = openPlumbingCounts;
    //     this.barChartData.datasets[1].data = openElectricityCounts;
    //     this.barChartData.datasets[2].data = openOthersCounts;
    //     this.barChartData.datasets[3].data = closedPlumbingCounts;
    //     this.barChartData.datasets[4].data = closedElectricty;

    //     if (this.chart) {
    //       this.chart.update();
    //     }
    //   } else {
    //     console.error('No valid data received.');
    //   }
    // }, error => {
    //   console.error('Error fetching issue data:', error);
    // });
  }
  

getIssuesforChart()
{
  this.issueService.getIssueStatusByIssueType1().subscribe(data => {
    if (Array.isArray(data) && data.length > 0) {
      const projectNames = data.map((item: any) => item.projectName);

      this.barChartLabels = projectNames;
      this.barChartData.labels = projectNames;

      this.generateDatasets(data);

      if (this.chart) {
        this.chart.update();
      }
    } else {
      console.error('No valid data received.');
    }
  }, error => {
    console.error('Error fetching issue data:', error);
  });
}

  
  chartHovered(event: any) {}
  chartClicked(event: any) {}
  toggleRow(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
  getIssuesCount()
  {
    this.issueService.getIssuesCount()
    .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.issueStatusDetails=resp;
            this.issueStatusDetails.forEach(issues=>{
              if(issues.issueStatus=='OPEN')
              {
                this.openStatusCount=issues.count
              }
               if(issues.issueStatus=='closed')
                {
                  this.closedStatusCount=issues.count
                }
               if(issues.issueStatus=='INPROGRESS')
                  {
                    this.inprogressStatusCount=issues.count
                  }
            })
            console.log(this.issueStatusDetails);
    
          },
          error: (err) => {
            console.error('Error adding Issues', err);
          },
        });
  }
  getstatusCountByProject()
  {
    this.issueService.getIssuesCountByProject()
    .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.issueStatusCountByProject=resp;
            console.log(this.issueStatusCountByProject);
          },
          error: (err) => {
            console.error('Error adding Issues', err);
          },
        });
  }
  getstatusCountByIssueType()
  {
    this.issueService.getIssueStatusByIssueType()
    .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.issueStatusCountByIssueType=resp;
            console.log(this.issueStatusCountByIssueType);
            this.dataSource = new MatTableDataSource(this.issueStatusCountByIssueType);
  
          },
          error: (err) => {
            console.error('Error adding Issues', err);
          },
        });
  }
  getIssueTypes(element: any) {
    const issueTypesArray = [];
    console.log('Element:', element);
    
    if (element && element.statusCountsByIssueType) {
        console.log('Issue Status Count:', element.statusCountsByIssueType);
        for (const type in element.statusCountsByIssueType) {
            if (Object.prototype.hasOwnProperty.call(element.statusCountsByIssueType, type)) {
                const issueTypeData = element.statusCountsByIssueType[type];
                issueTypesArray.push({
                    typeName: type,
                    open: issueTypeData.open || 0,
                    closed: issueTypeData.closed || 0,
                    inProgress: issueTypeData.inprogress || 0,
                    // Add other properties as needed
                });
            }
        }
    } else {
        console.log('Issue Status Count is undefined or null.');
    }

    console.log('Issue Types Array:', issueTypesArray);
    return new MatTableDataSource(issueTypesArray);
}



  onRowClick(issue:any)
  {
    console.log(issue);
    this.open=issue.open
    this.close=issue.closed
    this.inProgress=issue.inProgress
    
    
  }
  navigateToIssues(status: string): void {
    this.router.navigate(['/layout/facility/management/issueapproval'], { queryParams: { status } });
  }
 }
 


