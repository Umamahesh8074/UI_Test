import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  Client,
  IClient,
} from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';

import { User } from 'src/app/Models/User/User';
import { ClientService } from 'src/app/Services/client/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',

  styleUrls: ['./client.component.css'],
})
export class AddclientComponent implements OnInit {
  client: IClient = new Client();

  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  public user: User = new User();
  organizationId: any;
  formData!: FormGroup;
  constructor(
    private router: Router,
    private clientService: ClientService,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }

    this.initializeForm();
    this.updateProjectLocation();
    if (history.state.client != null) {
      this.client = history.state.client;
      this.isAdding = false;
      this.patchFormData();
    }
  }
  private initializeForm(): void {
    this.formData = this.builder.group({
      clientId: [0],
      clientName: [''],
      emailId: [''],
      phoneNumber: [''],
      location: [''],
      address1: [''],
      address2: [''],
      city: [''],
      pincode: [''],
      state: [''],
      pan: [''],
      gst: [''],
      status: [''],
      organizationId: [0],
      totalServiceNameCount: [0],
      projectLocation: [''],
      orderNumber: [''],
    });
  }

  save() {
    //adding client
    console.log(this.formData.valid);
    if (this.formData.valid) {
      if (this.isAdding) {
        this.formData.patchValue({ organizationId: this.organizationId });
        console.log(this.formData.value);
        this.clientService
          .addclient(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              this.router.navigate(['layout/facility/management/client']);
            },
            error: (err: any) => {
              console.error('Error adding client', err);
            },
          });
      } else {
        this.clientService
          .updateclient(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/facility/management/client']);
            },
            error: (err: any) => {
              console.error('Error updating client', err);
            },
          });
      }
    }
  }

  updateProjectLocation(): void {
    this.formData.get('clientName')?.valueChanges.subscribe(() => {
      this.patchProjectLocation();
    });

    this.formData.get('location')?.valueChanges.subscribe(() => {
      this.patchProjectLocation();
    });
  }

  private patchProjectLocation(): void {
    const clientName = this.formData.get('clientName')?.value || '';
    const location = this.formData.get('location')?.value || '';
    const projectLocation = `${clientName}-${location}`.trim();
    this.formData.patchValue(
      { projectLocation: projectLocation },
      { emitEvent: false } // Prevent looping
    );
  }
  patchFormData() {
    console.log(this.client);
    this.formData.patchValue(this.client);
    console.log(this.formData.value);
  }
  clearForm() {
    this.formData.reset();
  }

  gotoclients() {
    this.router.navigate(['layout/facility/management/client']);
  }
}
