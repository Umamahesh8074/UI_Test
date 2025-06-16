import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';

export interface FoodNode {
  name: string;
  children?: FoodNode[];
  total?: number;
  lost?: number;
  siteVisitDone?: number;
  siteVisitConfirm?: number;
  booked?: number;
  closed?: number;
  junk?: number;
  nonContactable?: number;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Leads',
    children: [
      {
        name: 'Digital',
        children: [
          {
            name: 'Facebook',
            total: 100,
            closed: 80,
            lost: 20,
          },
          {
            name: 'Google',
            total: 200,
            closed: 150,
            lost: 50,
          },
        ],
        total: 300,
        closed: 200,
        lost: 100,
      },
      {
        name: 'Channel partner',
        children: [
          { name: 'Ch_p1', total: 100, closed: 80, lost: 20 },
          { name: 'Ch_p2', total: 100, closed: 70, lost: 30 },
        ],
        total: 200,
        closed: 150,
        lost: 50,
      },
    ],
    total: 500,
    closed: 300,
    lost: 200,
  },
];
@Component({
  selector: 'app-show-leads-report',
  templateUrl: './show-leads-report.component.html',
  styleUrls: ['./show-leads-report.component.css'],
})
export class ShowLeadsReportComponent {
  treeData: any;
  private destroy$ = new Subject<void>();
  ngOnInit() {
    this.getLeadReport();
  }

  constructor(private leadService: LeadService, private router: Router) {}

  expandedNodes: { [key: string]: boolean } = {};

  toggle(nodeId: string): void {
    this.expandedNodes[nodeId] = !this.expandedNodes[nodeId];
  }

  isExpanded(nodeId: string): boolean {
    return !!this.expandedNodes[nodeId];
  }

  getUniqueId(node: FoodNode, ...indices: number[]): string {
    return [node.name, ...indices].join('-');
  }
  getLeadReport() {
    this.leadService
      .fetchLeadReport()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.treeData = [resp];
        },
        error: (err) => {},
      });
  }
}
