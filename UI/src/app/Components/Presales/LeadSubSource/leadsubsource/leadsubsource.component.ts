import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import {
  LeadSubSource,
} from 'src/app/Models/Presales/leadsubsource';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';

@Component({
  selector: 'add-subsource',
  templateUrl: './leadsubsource.component.html',
  styleUrls: ['./leadsubsource.component.css'],
})
export class LeadSubSourceComponent {
  sources: LeadSource[] = [];
  leadSubSource = new LeadSubSource(0, '', 0, '','');
  isAdding: boolean = true;
  SourceDisplay: boolean = true;
  private destroy$ = new Subject<void>();
  formData: any;
  constructor(
    private router: Router,
    private leadSourceService: LeadSourceService,
    private builder: FormBuilder,
    private leadSubService: LeadSubsourceService
  ) {}

  ngOnInit(): void {
    // Fetch lead sources and show the source field initially
    this.SourceDisplay = true;
    this.fetchLeadSources();

    // Initialize the form
    this.formData = this.builder.group({
      leadSubSourceId: this.builder.control(0),
      name: this.builder.control('', Validators.required),
      sourceId: this.builder.control('', Validators.required),
      status: this.builder.control(''),
    });

    // Check if leadSubSource exists in history.state
    const leadSubSource = history.state.leadSubSource;
    if (leadSubSource != null) {
      this.SourceDisplay = false; // Hide the source field if editing
      this.isAdding = false; // Set to editing mode

      // Patch form values with existing leadSubSource data
      this.formData.patchValue({
        leadSubSourceId: Number(leadSubSource.leadSubSourceId),
        name: leadSubSource.name,
        sourceId: Number(leadSubSource.leadSourceId),
        status: leadSubSource.status,
      });
    }
  }

  save() {
    //adding menu
    if (this.formData.valid) {
      if (this.isAdding) {
        console.log(this.formData.value);
        this.leadSubService
          .addLeadSubSource(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/presales/subsource']);
            },
            error: (err) => {
              console.error('Error adding Menu', err);
            },
          });
      } else {
        //updating menu
        console.log(this.formData.value);
        this.leadSubService
          .updateLeadSubSource(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.router.navigate(['layout/presales/subsource']);
            },
            error: (err) => {
              console.error('Error updating Menu', err);
            },
          });
      }
    }
  }
  fetchLeadSources() {
    this.leadSourceService.fetchAllLeadSources().subscribe({
      next: (sources) => {
        console.log(sources);
        this.sources = sources;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  clearForm() {
    this.formData.reset();
  }

  gotoLeadSubSources() {
    this.router.navigate(['layout/presales/subsource']);
  }

  
}
