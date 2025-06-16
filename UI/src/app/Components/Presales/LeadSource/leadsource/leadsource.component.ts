import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ILeadSource, LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';

@Component({
  selector: 'add-source',
  templateUrl: './leadsource.component.html',
  styleUrls: ['./leadsource.component.css'],
})
export class LeadSourceComponent {
  leadSource: ILeadSource = new LeadSource(0, '', '');
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private leadSourceService: LeadSourceService,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.leadSource = history.state.leadSource;
    if (history.state.leadSource != null) {
      this.isAdding = false;
    }
    this.formData = this.builder.group({
      leadSourceId: this.leadSource.leadSourceId,
      name: this.builder.control(this.leadSource.name, Validators.required),
      status: this.leadSource.status,
    });
  }
  formData = this.builder.group({
    leadSourceId: this.builder.control(0),
    name: this.builder.control('', Validators.required),
    status: this.builder.control(''),
  });

  save() {
    //adding menu
    if (this.formData.valid) {
      if (this.isAdding) {
        this.leadSourceService
          .addLeadSource(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/presales/source']);
            },
            error: (err) => {
              console.error('Error adding Menu', err);
            },
          });
      } else {
        //updating menu
        this.leadSourceService
          .updateLeadSource(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.router.navigate(['layout/presales/source']);
            },
            error: (err) => {
              console.error('Error updating Menu', err);
            },
          });
      }
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoLeadSources() {
    this.router.navigate(['layout/presales/source']);
  }
}
