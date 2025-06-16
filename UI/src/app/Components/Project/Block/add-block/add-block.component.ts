import { AuthService } from './../../../../Services/CommanService/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { IBlock, Block } from 'src/app/Models/Block/block';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',

  styleUrls: ['./add-block.component.css'],
})
export class AddBlockComponent implements OnInit {
  block: IBlock = new Block();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  responseBlocks: any[] = [];

  //auto complete for projects
  projects: any[] = [];
  filteredProjects: Observable<any> | undefined;
  user: User = new User();
  //number of blocks
  noOfBlocks: number = 0;
  formData: FormGroup;
  statuses: any;
  selectedProjectId: number = 0;

  blocksCount: number = 0;

  constructor(
    private router: Router,
    private blockService: BlockService,
    private projectService: ProjectService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private authService: AuthService
  ) {
    this.getAllProjects();
    this.formData = this.builder.group({
      projectId: [0, Validators.required],
      blocks: this.builder.array([], Validators.required),
    });
  }

  createBlockGroup(): FormGroup {
    return this.builder.group({
      id: [,],
      name: [, Validators.required],
      noOfLevels: [, Validators.required],
      status: ['A'],
    });
  }

  ngOnInit(): void {
    this.getUser();
    // this.block = history.state.projectBlock;
    this.getCommonStatuses();
    this.getAllProjects();
    console.log(history.state.projectBlock);
    if (history.state.projectBlock != null) {
      this.isAdding = false;
    }
    this.bindFormData();
  }

  getUser() {
    const storedUser = this.authService.getUser();
    console.log(storedUser);
    this.user = JSON.parse(storedUser ? storedUser : '');
    console.log(this.user);
  }

  bindFormData() {
    const projectId = history.state.projectBlock.projectId;
    const blocks = history.state.projectBlock.blocks;
    console.log(blocks);
    // this.setSelectedProject(projectId);
    if (history.state.projectBlock) {
      this.formData.patchValue({
        projectId: projectId,
      });
      const blocksArray = this.formData.get('blocks') as FormArray;
      blocks.forEach((block: any) => {
        blocksArray.push(
          this.builder.group({
            id: [block.id],
            name: [block.name],
            noOfLevels: [block.noOfLevels],
            status: [block.status],
          })
        );
      });
    }
  }
  save() {
    //adding block
    console.log(this.formData.value);
    console.log(this.formData.valid);

    this.validateBlocks(this.selectedProjectId);
    if (this.formData.valid) {
      if (this.isAdding) {
        this.blockService
          .addBlock(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/project/management/blocks']);
            },
            error: (err: any) => {
              console.error('Error adding Block', err);
            },
          });
      } else {
        //updating block
        console.log(this.formData.value);
        this.blockService
          .updateBlock(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/project/management/blocks']);
            },
            error: (err: any) => {
              console.error('Error updating Block', err);
            },
          });
      }
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoBlocks() {
    this.router.navigate(['layout/project/management/blocks']);
  }

  //fetching all projects for autocomplete to select project
  getAllProjects() {
    console.log(this.user);
    this.projectService
      .getProjectsByOrgId(this.user.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.projects = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  setSelectedProject(projectId: number) {
    console.log(projectId);
    console.log(this.selectedProjectId);
    if (this.selectedProjectId === projectId) {
      console.log('Same project selected, no update needed.');
      return;
    }

    this.validateBlocks(projectId);

    this.selectedProjectId = projectId;
    console.log(projectId);
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);

          // this.responseBlocks = response;
          this.noOfBlocks = response.blocks;
          console.log(response.blocks);

          console.log(this.noOfBlocks);
          this.updateBlockArray();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  updateBlockArray() {
    const blocksArray = this.formData.get('blocks') as FormArray;
    if (blocksArray) {
      blocksArray.clear();
      for (let i = 0; i < this.noOfBlocks; i++) {
        blocksArray.push(this.createBlockGroup());
      }
    } else {
      console.error('projectBlocks FormArray is not defined');
    }
  }

  validateBlocks(projectId: number) {
    console.log(projectId);
    this.blockService
      .validateBlocks(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.blocksCount = response;
          if (this.blocksCount > 0) {
            console.log(this.blocksCount);
            Swal.fire({
              title: 'Error',
              text: 'Blocks already exist for this project',
              icon: 'error',
              timerProgressBar: false,
              showConfirmButton: true,
              allowOutsideClick: true,
            }).then(() => {
              this.router.navigate(['layout/project/management/blocks']);
            });
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get blocks(): FormArray {
    return this.formData.get('blocks') as FormArray;
  }
  getCommonStatuses() {
    this.commonService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
}
