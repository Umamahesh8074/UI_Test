import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';

@Component({
  selector: 'app-viewindent',
  templateUrl: './view-indent.component.html',
  styleUrls: ['./view-indent.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewIndentComponent implements OnInit {
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  destroy$ = new Subject<void>();
  indentId: number = 0;
  indentDetails: any;

  displayColumns: string[] = [
    'itemCategory',
    'subCategory',
    'specification',
    'itemUnit',
    'quantity',
  ];

  ngOnInit(): void {
    this.getIndentData();
    this.getDataFromState();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indentService: IndentService
  ) {
    if (data.indentId != null && data.indentId != undefined) {
      console.log(data.indentId);
      this.indentId = data.indentId;
    }
  }

  //get indent data
  getIndentData() {
    this.indentService
      .getIndentItemsById(this.indentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.indentDetails = response;
          console.log(this.indentDetails.code);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  getDataFromState() {
    const { indentId, indent } = history.state;
    console.log(indent);
    this.indentId = indentId;
  }

  gotoPurchaseOrder() {}

  closeDialog() {}
}
