import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';

@Component({
  selector: 'app-cp-lead-register',
  templateUrl: './cp-lead-register.component.html',
  styleUrls: ['./cp-lead-register.component.css'],
})
export class CPLeadRegisterComponent implements OnInit {
  destroy$ = new Subject<void>();
  isAdding: boolean = true;
  formData!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private leadService: LeadService
  ) {}
  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      id: [0],
      name: [''],
      phoneNumber: [''],
      altContactNumber: [''],
      email: [''],
      location: [''],
      pincode: [],
      designation: [''],
      gender: [''],
      address: [''],
      companyName: [''],
    });
  }

  // //saving or updating cp
  // save() {
  //   this.leadService
  //     .saveLead(this.formData.value,this.user.roleId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         console.log(response);
  //       },
  //     });
  // }

  save(){
    
    
  }
  gotoLeadRegister() {
    this.router.navigate(['layout/presales/leads']);
  }

  clearForm() {
    this.formData.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
