import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { WorkflowHistoryDto } from 'src/app/Models/Workflow/workflowHistoryDto';
import { HistoryService } from 'src/app/Services/WorkflowService/history.service';

@Component({
  selector: 'app-display-history-details',
  templateUrl: './display-history-details.component.html',
  styleUrls: ['./display-history-details.component.css']
})
export class DisplayHistoryDetailsComponent implements OnInit {

  private destroy$ = new Subject<void>();
  incidentId: number = 3;
  historyData: WorkflowHistoryDto[] = [];
  flag:boolean = false;
  commonData:any;
  ngOnInit(): void {
  }

  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private historyService: HistoryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    
    if (data != null) {
      this.incidentId = data.incidentId;
      this.commonData = data.data
      this.fetchHistoryDetails(this.incidentId);
    }
  }

  fetchHistoryDetails(incidentId: number) {
    this.historyService
      .getHistoryDetails(incidentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (historyData) => {
          // console.log(approvalIndentData);
          this.historyData = historyData;
          if(this.historyData.length>0){
            this.flag=true
          }
          console.log(this.historyData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  closeDialog() {
    this.onClose.emit();
  }

}
