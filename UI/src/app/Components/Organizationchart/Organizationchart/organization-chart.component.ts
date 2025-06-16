import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OrgDto, User } from 'src/app/Models/User/User';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { OrgChart } from 'd3-org-chart';

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.css'],
})
export class OrganizationChartComponent implements OnInit, OnDestroy {
  organizationId: number = 0;
  userId: number = 0;
  orgDto: OrgDto = new OrgDto();
  private destroy$ = new Subject<void>();
  public user: User = new User();
  @Input() datasource: any;
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  chart = new OrgChart();

  constructor(private userService: UserService) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      this.userId = this.user.userId;
    }
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService
      .getOrganizationChart(this.organizationId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log('Org Data:', resp);
          this.orgDto = resp;
          this.renderChart();
        },
        error: (err) => {
          console.error('Error fetching organization chart', err);
        },
      });
  }

  selectedNodeId: string | null = null; // Store selected node ID

  renderChart() {
    if (!this.orgDto || !this.chartContainer) return;

    this.chart = new OrgChart()
      .container(this.chartContainer.nativeElement)
      .nodeHeight(() => 25) // Reduced from 30
      .nodeWidth(() => 70) // Reduced from 80
      .childrenMargin(() => 15) // Reduced from 20
      .compactMarginBetween(() => 10) // Reduced from 15
      .compactMarginPair(() => 5) // Reduced from 10
      .neighbourMargin(() => 3) // Reduced from 5
      .nodeContent((d: any) => {
        const isSelected = this.selectedNodeId === d.id;
        const isLoggedInUser = Number(d.data.id) === this.user.userId;
        return `
          <div style="width: 70px; height: 25px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div onclick="window.handleNodeClick('${d.id}')" style="
              font-family: 'Inter', sans-serif;
              background-color: ${
                isLoggedInUser ? '#28A745' : isSelected ? '#007BFF' : '#fff'
              };
              color: ${isLoggedInUser || isSelected ? '#fff' : '#333'};
              width: 65px;
              height: 20px;
              border-radius: 4px;
              border: 1px solid #E4E2E9;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
              padding: 1px;
              transition: background-color 0.3s, color 0.3s;
              cursor: pointer;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 4px; /* Reduced */
            ">
              <div style="font-weight: bold; font-size: 4px;">${
                d.data.name
              }</div>
              <div style="font-size: 3px; color: ${
                isLoggedInUser || isSelected ? '#fff' : 'grey'
              };">
                ${d.data.title}
              </div>
            </div>
          </div>`;
      })
      .data(this.flattenHierarchy(this.orgDto))
      .onNodeClick((d: any) => {
        console.log('Clicked Node:', d);
        setTimeout(() => {
          const chartState = this.chart.getChartState?.();
          if (chartState && chartState['nodes']) {
            const nodeState = chartState['nodes'].find(
              (node: any) => node.id === d.id
            );
            console.log('Node State:', nodeState);

            if (nodeState?._expanded) {
              this.chart.setExpanded(d.id, false);
            } else {
              this.chart.setExpanded(d.id, true);
            }
            this.chart.render().fit();
          } else {
            console.warn("Chart state is missing 'nodes':", chartState);
          }
        }, 100);
      })
      .render();

    this.chart.fit();

    (window as any).handleNodeClick = (id: string) => {
      this.handleNodeClick(id);
    };
  }

  handleNodeClick(id: string) {
    this.selectedNodeId = id;
    const chartState = this.chart.getChartState();
    if (!chartState || !chartState['nodes']) {
      console.error('Chart state is missing nodes', chartState);
      return;
    }

    const clickedNode = chartState['nodes'].find((node: any) => node.id === id);
    if (!clickedNode) {
      return;
    }

    this.chart.setExpanded(id, !clickedNode._expanded);
    this.chart.data(this.flattenHierarchy(this.orgDto)).render().fit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  flattenHierarchy(node: any, parentId: any = null, result: any[] = []) {
    if (!node) return result;

    // Push current node to result with parentId
    result.push({
      id: node.id,
      parentId: parentId, // Maintain parent-child relationship
      name: node.name,
      title: node.title, // Ensure correct field names for the chart
    });

    // Recursively process children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) =>
        this.flattenHierarchy(child, node.id, result)
      );
    }

    return result;
  }
}
