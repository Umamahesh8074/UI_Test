import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { Level } from 'src/app/Models/Project/level';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css'],
})
export class LevelComponent implements OnInit {
  projects: any[] = [];
  blocks: any[] = [];

  isAdding: boolean = true;
  private destroy$ = new Subject<void>();

  noOfLevels: number = 0;
  user: User = new User();
  formData: FormGroup;

  levelsCount: number = 0;
  selectedProjectId: number = 0;
  selectedBlockId: number = 0;

  ngOnInit(): void {
    this.getUser();
    this.getCommonStatuses();
    console.log(history.state.projectLevel);
    if (history.state.projectLevel != null) {
      this.isAdding = false;
      this.bindForm();
    }
    this.getAllProjects();
  }
  statuses: any;
  constructor(
    private levelService: LevelService,
    private builder: FormBuilder,
    private projectService: ProjectService,
    private blockService: BlockService,
    private router: Router,
    private commonService: CommanService,
    private authService: AuthService
  ) {
    this.getAllProjects();

    this.formData = this.builder.group({
      projectId: [0, Validators.required],
      blockId: [0, Validators.required],
      levels: this.builder.array([], Validators.required),
    });
  }
  getUser() {
    const storedUser = this.authService.getUser();
    console.log(storedUser);
    this.user = JSON.parse(storedUser ? storedUser : '');
    console.log(this.user);
  }
  //create sub array
  createLevelGroup(): FormGroup {
    return this.builder.group({
      id: [0],
      noOfUnits: [0, Validators.required],
      name: ['', Validators.required],
      status: ['A'],
    });
  }

  bindForm() {
    const projectLevel = history.state.projectLevel;
    if (projectLevel) {
      const { projectId, blockId, levels } = projectLevel;

      // Set the projectId
      this.formData.patchValue({ projectId });

      // Fetch blocks for the selected project
      this.blockService
        .getBlocks(projectId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Blocks fetched:', response);
            this.blocks = response;

            // Check if the blocks are loaded before setting blockId
            const blockExists = this.blocks.some(
              (block) => block.id === blockId
            );
            if (blockExists) {
              console.log('entered');
              this.formData.patchValue({ blockId });
            } else {
              console.warn(
                `Block with id ${blockId} does not exist in the fetched blocks.`
              );
            }
            console.log('Form after setting blockId:', this.formData.value);

            // Now bind the levels
            const levelsArray = this.formData.get('levels') as FormArray;
            this.noOfLevels = levels.length;
            levels.forEach((level: any) => {
              levelsArray.push(
                this.builder.group({
                  id: new FormControl(level.id),
                  name: new FormControl(level.name),
                  noOfUnits: new FormControl(level.noOfUnits),
                  status: new FormControl(level.status),
                })
              );
            });
            console.log('Form after setting levels:', this.formData.value);
          },
          error: (error) => {
            console.log('Error fetching blocks:', error);
          },
        });
    }
  }

  //get all projects
  getAllProjects() {
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

  //get blocks based on project id
  setSelectedProject(projectId: any) {
    console.log(projectId);
    this.selectedProjectId = projectId;
    this.blockService
      .getBlocks(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.blocks = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  setSelectedBlock(blockId: any) {
    console.log(blockId);
    if (this.selectedBlockId === blockId) {
      console.log('Same block selected, no update needed.');
      return;
    }
    this.selectedBlockId = blockId;
    this.validateLevels(this.selectedProjectId, blockId);
    this.blockService
      .getBlockById(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.noOfLevels = response.noOfLevels;
          this.updateArray();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  updateArray() {
    const formArray = this.formData.get('levels') as FormArray;
    if (formArray) {
      // Clear existing FormArray
      formArray.clear();
      for (let i = 0; i < this.noOfLevels; i++) {
        formArray.push(this.createLevelGroup());
      }
    } else {
      console.error(' FormArray is not defined');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get levels(): FormArray {
    return this.formData.get('levels') as FormArray;
  }

  save() {
    console.log(this.formData.value);
    if (this.formData.valid) {
      if (this.isAdding) {
        this.levelService
          .addLevels(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log(response);
              this.router.navigate(['layout/project/levels']);
            },
            error: (error) => {
              console.log(error);
            },
          });
      } else {
        this.levelService
          .updateLevel(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log(response);
              this.router.navigate(['layout/project/levels']);
            },
            error: (error) => {
              console.log(error);
            },
          });
      }
    }
  }

  gotoLevels() {
    this.router.navigate(['layout/project/levels']);
  }
  clearForm() {
    this.formData.reset();
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

  validateLevels(projectId: number, blockId: number) {
    console.log(projectId, blockId);
    this.levelService
      .validateLevels(projectId, blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.levelsCount = response;
          console.log(this.levelsCount);
          if (this.levelsCount > 0) {
            console.log(this.levelsCount);
            Swal.fire({
              title: 'Error',
              text: 'Levels already exist for this block',
              icon: 'error',
              timerProgressBar: false,
              showConfirmButton: true,
              allowOutsideClick: true,
            }).then(() => {
              this.router.navigate(['layout/project/levels']);
            });
          }
        },
      });
  }
}
