import { GETALLPROJECTBYORGID } from '../../../../Apis/ProjectApis/Project';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Project } from 'src/app/Models/Project/project';

import {
  IQrtransactiondata,
  Qrtransactiondata,
} from 'src/app/Models/Qrtransactiondata/qrtransactiondata';
import { User } from 'src/app/Models/User/User';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrtransactiondataService } from 'src/app/Services/Qrtransactiondata/qrtransactiondata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qrtransactiondata',
  templateUrl: './qrtransactiondata.component.html',

  styleUrls: ['./qrtransactiondata.component.css'],
})
export class AddQrtransactiondataComponent implements OnInit {
  isView = false;
  building: Project[] = [];
  organization: any[] = [];
  location: any[] = [];

  qrtransactiondata: IQrtransactiondata = new Qrtransactiondata();

  private destroy$ = new Subject<void>();
  public user: User = new User();
  isAdding: boolean = true;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private qrtransactiondataService: QrtransactiondataService,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
    }
    this.qrtransactiondata = history.state.qrtransactiondata;
    if (history.state.qrtransactiondata != null) {
      this.isAdding = false;
      this.formData = this.builder.group({
        id: this.qrtransactiondata.id,
        orgId: this.qrtransactiondata.orgId,
        buildingId: this.qrtransactiondata.projectId,
        roleId: this.qrtransactiondata.roleId,
        location: this.qrtransactiondata.location,
        name: this.qrtransactiondata.name,
        latitude: this.qrtransactiondata.latitude,
        longitude: this.qrtransactiondata.longitude,
        radius: this.qrtransactiondata.radius,
        status: this.qrtransactiondata.status,
      });
    }
    console.log(this.user.organizationId);
    this.projectService.getProjectsByOrgId(this.user.organizationId).subscribe({
      next: (resp) => {
        console.log(resp);

        this.building = resp;
      },
      error: (err) => {
        console.error('Error adding Qrtransactiondata', err);
      },
    });
  }

  formData = this.builder.group({
    id: this.builder.control(0),
    orgId: this.builder.control(0, Validators.required),
    buildingId: this.builder.control(0, Validators.required),
    roleId: this.builder.control(0, Validators.required),
    location: this.builder.control('', Validators.required),
    name: this.builder.control('', Validators.required),
    latitude: this.builder.control('', Validators.required),
    longitude: this.builder.control('', Validators.required),

    radius: this.builder.control(0.0, Validators.required),
    status: this.builder.control('', Validators.required),
  });

  save() {
    //adding qrtransactiondata
    if (this.isAdding) {
      this.qrtransactiondataService
        .addQrtransactiondata(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.router.navigate(['layout/qrtransactiondata']);
          },
          error: (err) => {
            console.error('Error adding Qrtransactiondata', err);
          },
        });
    } else {
      //updating qrtransactiondata
      this.qrtransactiondataService
        .updateQrtransactiondata(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['layout/qrtransactiondata']);
          },
          error: (err) => {
            console.error('Error updating Qrtransactiondata', err);
          },
        });
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoQrtransactiondatas() {
    this.router.navigate(['layout/qrtransactiondata']);
  }
}
