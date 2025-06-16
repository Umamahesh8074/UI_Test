import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { PAGE_INDEX } from 'src/app/Constants/CommanConstants/Comman';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css'],
})
export class DateFilterComponent {
  @Input() formData!: FormGroup;
  @Input() startDateControlName: string = 'customStartDate';
  @Input() endDateControlName: string = 'customEndDate';
  protected destroy$ = new Subject<void>();
  pageIndex: number = PAGE_INDEX;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() dateChanged = new EventEmitter<{
    startDate: string;
    endDate: string;
  }>();
  @Output() clearFilter = new EventEmitter<void>();

  ngOnInit() {
    this.initForm();
  }

  constructor(private formBuilder: FormBuilder) {}

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.dateChanged.emit({ startDate, endDate });
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  clearDateRange(): void {
    this.formData.get(this.startDateControlName)?.setValue('');
    this.formData.get(this.endDateControlName)?.setValue('');
    this.clearFilter.emit();
  }
}
