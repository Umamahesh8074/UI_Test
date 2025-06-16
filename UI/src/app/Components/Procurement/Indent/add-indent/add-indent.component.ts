import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { DocumentSharedService } from 'src/app/Apis/SharedServices/DocumnetSharedService';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { DocumentComponent } from 'src/app/Comman-Components/Dialog/documentmodel/document.component';
import { StoreItemDialogComponent } from 'src/app/Comman-Components/Dialog/storeitemdialog/storeitemdialog.component';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import {
  PAGE_INDEX,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { ItemCategory } from 'src/app/Models/Procurement/ItemCategory';
import {
  IIndent_Item,
  IndentItemDto,
  Indent_Item,
} from 'src/app/Models/Procurement/indent';
import { ItemSpecification } from 'src/app/Models/Procurement/itemspecification';
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { ItemUnitDto } from 'src/app/Models/Procurement/itemunit';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import { IndentItemService } from 'src/app/Services/ProcurementService/IndentItem/indent-item.service';
import { ItemSpecificationService } from 'src/app/Services/ProcurementService/ItemSpecification/item-specification.service';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';
import { ItemUnitService } from 'src/app/Services/ProcurementService/ItemUnit/item-unit.service';
import { StoreInventoryService } from 'src/app/Services/ProcurementService/StoreInventory/store-inventory.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-indent',
  templateUrl: './add-indent.component.html',
  styleUrls: ['./add-indent.component.css'],
})
export class AddIndentComponent extends ReusableComponent implements OnInit {
  isAdding: boolean = true;
  workTypeId: number = 0;
  materialCodeId: number = 0;
  materialCode: string = '';
  options: CommonReferenceDetails[] = [];
  storeItems: any = [];
  itemUnitIds: number[] = [];
  minDate: Date = new Date();
  minDateControll: Date = new Date();
  indentType: string = '';
  selectedFiles: File[] | undefined;
  //indent fields
  indent: IndentItemDto = new IndentItemDto();
  indentItemDto: IndentItemDto = new IndentItemDto();
  indentItem: IIndent_Item = new Indent_Item();
  showAdditionalFields: any[] = [];
  indentDocuments: any;
  documentType: string = 'INDENT_DOCUMENTS';
  documents: any[] = [];
  //project fields
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);

  //item units fields
  itemUnits: ItemUnitDto[] = [];
  filteredItemUnits: ItemUnitDto[] = [];
  itemUnit: ItemUnitDto = new ItemUnitDto();
  UnitPerIndex: { [key: number]: any[] } = {};
  indentItemControl: any = new FormControl([] as ItemUnitDto[]);
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;
  //model fields
  openDialog: boolean | undefined;

  displayPageData: any;
  status: string = '';
  showPlantCodeError: boolean = false;
  itemCategorySerachText: string = '';
  itemCat: any[] = [];
  category: any = new FormControl([] as ItemCategory[]);
  itemCategoryId: number = 0;
  itemsubcategoryName: string = '';
  itemSubCategoryData: ItemSubCategory[] = [];
  popUpSelectedCategory: ItemCategory = new ItemCategory();
  popUpSelectedSubCategory: ItemSubCategory = new ItemSubCategory();
  popUpSelectedSpecification: ItemSpecification = new ItemSpecification();
  subCategory: FormControl<ItemSubCategory | null> =
    new FormControl<ItemSubCategory | null>(null);

  specificationName: string = '';
  itemSpecifications: ItemSpecification[] = [];
  specification: FormControl<ItemSpecification | null> =
    new FormControl<ItemSpecification | null>(null);
  //model data
  materialCodeDto: any;
  modalMaterilCode: string = '';
  modifiedMaterialCode: ItemUnitDto = new ItemUnitDto();
  materialCodeIdFromModel: number | null = null;
  @ViewChildren('radioButton') radioButtons!: QueryList<ElementRef>;
  materialCodeIndexForModal: number | null = null;
  modalMaterialCode: string = '';
  popUpCcategoryId: any;
  popUpSubCategoryId: any;
  popUpSpecificationId: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isRaiseIndent: boolean = false;

  displayedStoreColumns: string[] = [
    'rowNumber',
    'projectName',
    'storeName',
    'materialType',
    'categoryName',
    'subCategoryName',
    'specificationName',
    'unitName',
    'storeInventory',
  ];

  ngOnInit(): void {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 15);
    super.setUserFromLocalStorage();
    this.initializeFormData();
    this.getDataFromState();
    // this.getWorkTypes();
    this.fetchMaterialCodes();
    this.fetchProjects();
    this.getAllItemCategories();
  }

  constructor(
    private indentService: IndentService,
    commanService: CommanService,
    private commonService: CommanService,
    private projectServie: ProjectService,
    private builder: FormBuilder,
    private itemUnitService: ItemUnitService,
    private dialog: MatDialog,
    private documentService: DocumentSharedService,
    router: Router,
    route: ActivatedRoute,
    private storeInventoryService: StoreInventoryService,
    private loaderService: LoaderService,
    private indentItemService: IndentItemService,
    private itemCategoryService: ItemCategoryService,
    private itemSubCategoryService: ItemSubCategoryService,
    private itemSpecificationService: ItemSpecificationService
  ) {
    super(commanService, router, route);
  }

  private initializeFormData() {
    this.formData = this.builder.group({
      indentId: [0],
      code: [''],
      requiredDate: [
        '',
        [Validators.required, this.minDateValidator.bind(this)],
      ],
      status: [''],
      projectId: ['', Validators.required],
      indentItems: this.builder.array([this.createIndentItemGroup()]),
    });

    if (this.isAdding) {
      this.showAdditionalFields.push({
        itemCategory: '',
        itemSpecification: '',
        itemUnit: '',
        itemSubcategory: '',
        quantity: '',
      });
    }
  }

  createIndentItemGroup(): FormGroup {
    return this.builder.group({
      indentItemId: [0],
      categoryId: [''],
      subCategoryId: [''],
      specificationId: [''],
      unitId: ['', Validators.required],
      // workType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      itemCategory: [''],
      itemSubcategory: [''],
      itemSpecification: [''],
      itemUnit: [''],
    });
  }

  private getDataFromState() {
    const { indent, isAdding, indentType, displayPage, status } = history.state;
    this.status = status;
    this.indentType = indentType;
    this.indent = indent;
    this.isAdding = isAdding;
    !this.isAdding && this.patchIndentWithFormData();
    if (this.indent?.indentId > 0) {
      this.getDocumentsBasedOnId();
    }
    if (displayPage) {
      this.displayPageData = displayPage;
    }
  }

  minDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; // Ignore empty values
    const selectedDate = new Date(control.value);
    return selectedDate < this.minDate ? { minDate: true } : null;
  }

  private patchIndentWithFormData() {
    const projectId = this.indent.projectId;
    if (projectId) {
      this.fetchProject(projectId);
    }
    this.patchBasicFormData();
    this.populateIndentItems();
    this.patchAdditionalFields();
  }

  private patchBasicFormData() {
    this.formData.patchValue({
      indentId: this.indent.indentId,
      projectId: this.indent.projectId,
      requiredDate: this.indent.requiredDate,
    });
  }

  private populateIndentItems() {
    const indentItems = this.indentItems;
    indentItems.clear();
    this.indent.indentItems.forEach((item: any, index: number) => {
      if (item.unitId) {
        this.workTypeId = item.categoryTypeId;
        this.fetchMaterialCodeById(item.unitId, index);
        this.fetchMaterialCodes();
      }
      const indentItemGroup = this.builder.group({
        indentItemId: item.indentItemId,
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        specificationId: item.specificationId,
        unitId: item.unitId,
        quantity: item.quantity,
        workType: item.categoryTypeId,
        itemCategory: item.itemCategory,
        itemSubcategory: item.itemSubcategory,
        itemSpecification: item.itemSpecification,
        itemUnit: item.itemUnit,
      });
      indentItems.push(indentItemGroup);
    });
  }

  private patchAdditionalFields() {
    if (this.indent && this.indent.indentItems) {
      this.showAdditionalFields = this.indent.indentItems.map((item: any) => ({
        itemCategory: item.itemCategoryName,
        itemSubcategory: item.itemSubCategoryName,
        itemSpecification: item.itemSpecificationName,
        itemUnit: item.itemUnit,
        quantity: item.quantity,
      }));
    }
  }

  fetchMaterialCodeById(materialCodeId: number, index: number) {
    this.itemUnitService
      .getMaterialCodes(this.workTypeId, this.materialCode, materialCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ItemUnitDto[]) => {
          if (response.length > 0) {
            const selectedMaterial = response[0];
            const control = this.indentItems.at(index);
            if (control) {
              control.patchValue({
                unitId: selectedMaterial,
                itemCategory: selectedMaterial.itemCategoryName,
                itemSubcategory: selectedMaterial.itemSubCategoryName,
                itemSpecification: selectedMaterial.itemSpecificationName,
                itemUnit: selectedMaterial.inventoryUnitName,
              });
            }
          }
        },
        error: (error: Error) => {
          console.error('Error While Fetching Material Codes', error);
        },
      });
  }

  // save() {
  //   this.markRequiredFields();
  //   //stringify starts
  //   if (this.formData.touched && this.formData.valid) {
  //     const dataToSend = this.preparePayload();

  //     const transformedIndent = {
  //       ...this.formData.value,

  //       indentItems: dataToSend.indentItems.map((item: any) => ({
  //         ...item,
  //         unitId:
  //           typeof item.unitId === 'object' ? item.unitId.unitId : item.unitId,
  //       })),
  //     };

  //     const allUnitIds = transformedIndent.indentItems.map((item: any) =>
  //       typeof item.unitId === 'object' ? item.unitId.unitId : item.unitId
  //     );
  //     console.log('All Unit IDs:', allUnitIds);

  //     this.fetchStockInventory();

  //     const formData = new FormData();
  //     const indentData = transformedIndent;
  //     const documents = this.documents;

  //     // Get an array of files instead of an object
  //     this.selectedFiles = this.getDocumentsArray(documents);

  //     // Check if selectedFiles is empty
  //     if (this.selectedFiles.length === 0) {
  //       formData.append(
  //         'files',
  //         new File([''], '', {
  //           type: '',
  //         })
  //       ); //
  //     } else {
  //       // Append actual files
  //       this.selectedFiles.forEach((file) => {
  //         formData.append('files', file);
  //       });
  //     }
  //     console.log(formData);

  //     formData.append('indentItemDto', JSON.stringify(indentData));
  //     if (this.isAdding) {
  //       formData.append('userId', JSON.stringify(this.userId));
  //     }

  //     if (this.isRaiseIndent) {
  //       console.log('Raise Indent');
  //       this.showLoading();
  //       const saveOrUpdate$ = this.isAdding
  //         ? this.indentService.addIndent(formData)
  //         : this.indentService.updateIndent(formData, this.indentType);
  //       saveOrUpdate$.subscribe({
  //         next: (response) => {
  //           const navigateExtras = {
  //             relativeTo: this.route.parent,
  //           };
  //           this.handleSuccessResponse(response);
  //           // this.router.navigate(['./indent'], navigateExtras);
  //           this.hideLoading();
  //           this.gotoIndents();
  //         },
  //         error: (error) => {
  //           this.handleErrorResponse(error);
  //           this.hideLoading();
  //         },
  //       });
  //     }
  //   }
  // }

  save() {
    this.markRequiredFields();

    if (this.formData.touched && this.formData.valid) {
      const dataToSend = this.preparePayload();

      const transformedIndent = {
        ...this.formData.value,
        indentItems: dataToSend.indentItems.map((item: any) => ({
          ...item,
          unitId:
            typeof item.unitId === 'object' ? item.unitId.unitId : item.unitId,
        })),
      };

      this.itemUnitIds = transformedIndent.indentItems.map((item: any) =>
        typeof item.unitId === 'object' ? item.unitId.unitId : item.unitId
      );

      this.fetchStockInventory().subscribe((canRaise) => {
        if (canRaise) {
          this.performSave(transformedIndent);
        } else {
          console.log('User chose NOT to raise indent.');
        }
      });
    }
  }

  performSave(transformedIndent: any) {
    const formData = new FormData();
    const documents = this.documents;
    this.selectedFiles = this.getDocumentsArray(documents);

    if (this.selectedFiles.length === 0) {
      formData.append('files', new File([''], '', { type: '' }));
    } else {
      this.selectedFiles.forEach((file) => formData.append('files', file));
    }

    formData.append('indentItemDto', JSON.stringify(transformedIndent));
    if (this.isAdding) {
      formData.append('userId', JSON.stringify(this.userId));
    }

    this.showLoading();
    const saveOrUpdate$ = this.isAdding
      ? this.indentService.addIndent(formData)
      : this.indentService.updateIndent(formData, this.indentType);

    saveOrUpdate$.subscribe({
      next: (response) => {
        this.handleSuccessResponse(response);
        this.hideLoading();
        this.gotoIndents();
      },
      error: (error) => {
        this.handleErrorResponse(error);
        this.hideLoading();
      },
    });
  }

  private markRequiredFields() {
    this.showPlantCodeError = false;
    const plantCodeControl = this.formData.get('projectId');
    plantCodeControl?.markAsTouched();
    if (plantCodeControl?.invalid) this.showPlantCodeError = true;
  }

  private preparePayload(): any {
    const formValues = this.formData.value;
    return {
      indentId: formValues.indentId,
      requiredDate: formValues.requiredDate,
      projectId: formValues.projectId,
      indentItems: formValues.indentItems.map((item: any) => ({
        indentItemId: item.indentItemId,
        unitId: item.unitId,
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        specificationId: item.specificationId,
        quantity: item.quantity,
        categoryTypeId: item.workType,
      })),
    };
  }

  fetchMaterialCodes = (): void => {
    this.itemUnitService
      .getMaterialCodes(this.workTypeId, this.materialCode, this.materialCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ItemUnitDto[]) => {
          this.itemUnits = response;
          this.UnitPerIndex = {};
        },
        error: (error: Error) => {
          console.error('error While Fetching Material Codes', error);
        },
      });
  };

  // fetchProjects = (): void => {
  //   this.projectServie
  //     .getProjectsByOrgIdWithProjectFilter(
  //       this.organizationId,
  //       this.projectName
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (projects: Project[]) => {
  //         this.projects = projects;
  //       },
  //       error: (error: Error) => {
  //         console.error('Error fetching projects:', error);
  //       },
  //     });
  // };

  fetchProjects() {
    this.projectServie
      .getProjectsForPO(this.projectName, this.organizationId, this.userId)
      .subscribe({
        next: (data) => {
          this.projects = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  private fetchProject(projectId: number): void {
    this.projectServie
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (project) => {
          this.project.patchValue(project);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  onProjectSelect(project: any) {
    const projectData = project.option.value;
    if (projectData) {
      this.formData.patchValue({
        projectId: projectData.projectId,
      });
    }
    this.showPlantCodeError = false;
  }

  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : '';
  }

  displayUnit = (unitData: any): string => {
    if (!unitData) return '';

    if (!this.itemUnits || !Array.isArray(this.itemUnits)) return '';

    if (typeof unitData === 'number') {
      const found = this.itemUnits.find((u) => u.unitId === unitData);
      return found?.materialCode || '';
    }

    if (typeof unitData === 'object' && unitData.materialCode) {
      return unitData.materialCode;
    }

    return '';
  };

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  searchUnit(event: any, index: number) {
    const query = event.target.value.trim().toLowerCase();
    const filteredUnits = this.itemUnits.filter((unit) =>
      unit.name.toLowerCase().includes(query)
    );
    this.UnitPerIndex[index] = filteredUnits;
  }

  filteredUnits(index: number): any[] {
    const units = this.UnitPerIndex[index] || this.itemUnits;
    return units;
  }

  onUnitSelectionChange(event: any, index: number): void {
    const materialCodeId = event.option.value.unitId;
    if (materialCodeId) {
      this.fetchAndUpdateMaterialCodes(materialCodeId, index);
    }
  }

  private fetchAndUpdateMaterialCodes(
    materialCodeId: number,
    index: number
  ): void {
    this.filteredItemUnits = this.itemUnits.filter(
      (unit) => unit.unitId === materialCodeId
    );
    console.log(this.filteredItemUnits);
    this.updateFormGroupWithmaterialCodeData(index);
  }

  // viewStoreInventory(index: number, items: any) {
  //   if (typeof items.value.unitId == 'object') {
  //     this.itemUnitId = items.value.unitId.unitId;
  //   } else if (typeof items.value == 'object') {
  //     this.itemUnitId = items.value.unitId;
  //   } else {
  //     this.itemUnitId = items.value;
  //   }
  //   if (this.itemUnitId > 0) {
  //     this.fetchStockInventory();
  //   }
  // }

  // fetchStockInventory() {
  //   this.storeInventoryService
  //     .getStoreInventory(this.pageIndex, this.pageSize, this.itemUnitIds)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         console.log(response);
  //         if (!response.records || response.records.length === 0) {
  //           Swal.fire({
  //             icon: 'info',
  //             title: 'No Data Found',
  //             text: 'No Item Available In Store.',
  //             confirmButtonText: 'OK',
  //           });
  //         } else {
  //           this.storeItems = response.records;
  //           this.totalItems = response.totalRecords;
  //           this.openDialog = true;
  //         }
  //       },
  //       error: (error: Error) => {
  //         console.error(error);
  //       },
  //     });
  // }

  fetchStockInventory(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.storeInventoryService
        .getStoreInventory(this.pageIndex, this.pageSize, this.itemUnitIds)
        .subscribe({
          next: (response) => {
            if (!response.records || response.records.length === 0) {
              observer.next(true);
              observer.complete();
            } else {
              const dialogRef = this.dialog.open(StoreItemDialogComponent, {
                width: '800px',
                data: {
                  records: response.records,
                  status: 'raise',
                },
              });

              dialogRef.afterClosed().subscribe((result) => {
                if (result?.status === 'cancel') {
                  // this.router.navigate(['/layout/procurement/indent']);
                  observer.next(false);
                } else if (result?.status === 'raise') {
                  observer.next(true);
                } else {
                  observer.next(false);
                }
                observer.complete();
              });
            }
          },
          error: (error) => {
            console.error(error);
            observer.next(false);
            observer.complete();
          },
        });
    });
  }

  private updateFormGroupWithmaterialCodeData(index: number): void {
    if (index < this.indentItems.length) {
      const indent = this.indentItems.at(index) as FormGroup;
      const itemUnit = this.filteredItemUnits[0];

      indent.patchValue({
        unitId: itemUnit?.unitId || '',
        categoryId: itemUnit?.categoryId || '',
        subCategoryId: itemUnit?.subCategoryId || '',
        specificationId: itemUnit?.specificationId || '',
        itemCategory: itemUnit?.itemCategoryName || '',
        itemSubcategory: itemUnit?.itemSubCategoryName || '',
        itemSpecification: itemUnit?.itemSpecificationName || '',
        itemUnit: itemUnit?.inventoryUnitName || '',
      });
    }
  }

  get indentItems(): FormArray {
    return this.formData.get('indentItems') as FormArray;
  }

  addItems(value: any): void {
    this.indentItems.push(this.createIndentItemGroup());
    this.showAdditionalFields.push({
      itemCategory: '',
      itemSpecification: '',
      itemUnit: '',
      itemSubcategory: '',
      quantity: '',
    });
  }

  removeIcons(index: any, indentItem: any) {
    if (this.showAdditionalFields.length > 1) {
      if (indentItem.value.indentItemId > 0) {
        this.deleteIndent(indentItem?.value.indentItemId);
      }
      this.showAdditionalFields.splice(index, 1);
      this.indentItems.removeAt(index);
    } else {
      console.log('item should be atleast one');
    }
  }

  deleteIndent(indentItemId: number) {
    this.indentItemService
      .deleteIndentItem(indentItemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openConfirmDialog(i: any, items: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Delete Indent' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.removeIcons(i, items);
        }
      }
    );
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchStockInventory();
  }
  onPopUpPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchMaterialCodesForModel();
  }
  gotoIndents() {
    if (this.status === 'PendingIndent') {
      this.router.navigate(['/layout/procurement/indent'], {
        state: {
          displayPageData: this.displayPageData,
        },
      });
    } else if (this.status === 'ApprovedIndent') {
      this.router.navigate(['/layout/procurement/app/rej/rework/Indents'], {
        state: {
          displayPageData: this.displayPageData,
        },
      });
    }
  }

  viewDownLoads() {
    const dialogRef = this.dialog.open(DocumentComponent, {
      width: '60%',
      height: '500px',
      data: {
        documents: this.indentDocuments,
        isAdding: this.isAdding,
        documentType: this.documentType,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadDocuments();
    });
  }

  loadDocuments() {
    const uploadedDocuments = this.documentService.getDocuments();
    this.documents = uploadedDocuments;
  }
  getDocumentsArray(
    documents: { documentName: string; documentPath: File; file: any }[]
  ): File[] {
    const filesArray: File[] = [];
    documents.forEach((document) => {
      const { documentName, documentPath } = document;
      if (documentPath) {
        const originalFileName = document.file;
        const extension = originalFileName.substring(
          originalFileName.lastIndexOf('.')
        );
        const newFileName = `${documentName}${extension}`;
        const newFile = new File([documentPath], newFileName, {
          type: documentPath.type,
        });
        filesArray.push(newFile);
      }
    });
    return filesArray;
  }

  getDocumentsBasedOnId() {
    this.commonService
      .getDocumentById(
        this.indent.indentId,
        this.documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.indentDocuments = response;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  restrictToNumbers(event: KeyboardEvent): boolean {
    const inputElement = event.target as HTMLInputElement;
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
      '.',
    ];
    const isNumber = /^[0-9]$/.test(event.key);
    const isDecimalAllowed =
      event.key === '.' && !inputElement.value.includes('.');
    return isNumber || allowedKeys.includes(event.key) || isDecimalAllowed;
  }

  formatRate(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      value = `${integerPart}.${decimalPart.substring(0, 2)}`;
    }
    inputElement.value = value;
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  //model code

  modalMaterialCodeSearch() {
    console.log(this.modalMaterialCode);
    if (
      this.modalMaterialCode.length > 2 ||
      this.modalMaterialCode.length === 0
    ) {
      this.goToFirstPage();
      this.fetchMaterialCodesForModel();
    }
  }

  fetchMaterialCodesForModel = (): void => {
    this.itemUnitService
      .getAllItemUnit(
        '',
        this.popUpCcategoryId,
        this.popUpSubCategoryId,
        this.popUpSpecificationId,
        '',
        this.pageIndex,
        this.pageSize,
        this.workTypeId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemUnitData) => {
          this.materialCodeDto = itemUnitData.records;

          this.UnitPerIndex = {};
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = itemUnitData.totalRecords;
        },
        error: (error: Error) => {
          console.error('error While Fetching Material Codes', error);
        },
      });
  };

  goToFirstPage() {
    this.pageIndex = PAGE_INDEX;
  }

  setIndentIndexForModal(index: number): void {
    this.materialCodeIndexForModal = index;
    this.fetchMaterialCodesForModel();
  }
  onMaterialCodeSelect(data: any) {
    this.materialCodeIdFromModel = data.unitId;
    this.modifiedMaterialCode = data;
    this.clearModalFilters();
  }
  clearModalFilters() {
    this.modalMaterilCode = '';
  }
  btnModalClear() {
    if (this.modalMaterilCode) {
      this.clearModalFilters();
      this.fetchMaterialCodesForModel();
    }
  }

  selectMaterialCode() {
    if (
      this.materialCodeIdFromModel !== null &&
      this.materialCodeIndexForModal !== null
    ) {
      this.fetchAndUpdateMaterialCodes(
        this.materialCodeIdFromModel,
        this.materialCodeIndexForModal
      );
      this.radioButtons.forEach((radioButton) => {
        radioButton.nativeElement.checked = false;
      });
    } else {
      Swal.fire({
        icon: 'info',
        text: 'No Selection !',
        timerProgressBar: true,
        timer: 2000,
      });
      console.error(
        'Either serviceCodeIdFromModel or serviceCodeIndexForModal is null, skipping fetch.'
      );
    }
    this.materialCodeIdFromModel = null;
    this.materialCodeIndexForModal = null;
  }

  getAllItemCategories() {
    this.itemCategoryService
      .fetchItemCategories(this.itemCategorySerachText, this.workTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.itemCat = response;
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  searchCategory(event: any) {
    this.paginator.firstPage();

    const query = event.target.value;
    console.log(query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemCategorySerachText = query;
      this.getAllItemCategories();
    }
    if (query.length === searchTextZero) {
      this.itemCategoryId = 0;
      this.getAllItemCategories();
    }
  }

  onCategorySelectionChange(event: any) {
    console.log(event.option.value);

    this.paginator.firstPage();
    this.popUpCcategoryId = event.option.value.categoryId
      ? event.option.value.categoryId
      : '';
    this.popUpSelectedCategory = event.option.value;

    if (this.popUpCcategoryId === '') {
      this.popUpSubCategoryId = '';
      this.popUpSpecificationId = '';
      const itemSubCat = new ItemSubCategory();
      itemSubCat.subCategoryId = 0;
      itemSubCat.name = 'All';
      this.subCategory.reset(itemSubCat);
    }

    this.getItemSubCategory();

    this.fetchMaterialCodesForModel();
  }
  displayFn(input: any) {
    return input && input.name ? input.name : 'All';
  }

  getItemSubCategory() {
    this.itemSubCategoryService
      .fetchItemSubCategory(this.popUpCcategoryId, this.itemsubcategoryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSubCategoryData) => {
          this.itemSubCategoryData = itemSubCategoryData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onSearchItemSubCategory(itemSubCategory: any) {
    this.paginator.firstPage();

    const query = itemSubCategory.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemsubcategoryName = query;
      this.getItemSubCategory();
    }
  }

  onSubCategorySelectionChange(event: any) {
    this.paginator.firstPage();
    this.popUpSubCategoryId = event.option.value.subCategoryId
      ? event.option.value.subCategoryId
      : '';
    this.popUpSelectedSubCategory = event.option.value;
    if (this.popUpSubCategoryId === '') {
      this.popUpSpecificationId = '';
    }
    this.getItemSpecification();
    this.fetchMaterialCodesForModel();
  }

  getItemSpecification() {
    this.itemSpecificationService
      .getAllItemSpecificationByItemCategoryId(
        this.popUpSelectedSubCategory,
        this.specificationName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSpecifications: ItemSpecification[]) => {
          this.itemSpecifications = itemSpecifications;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onSearchItemSpecification(itemSpec: any) {
    this.paginator.firstPage();
    console.log(itemSpec.target.value);
    const query = itemSpec.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.specificationName = query;
      this.getItemSpecification();
    }
  }

  onSpecificationSelectionChange(event: any) {
    this.paginator.firstPage();
    this.popUpSpecificationId = event.option.value.specificationId
      ? event.option.value.specificationId
      : '';
    this.popUpSelectedSpecification = event.option.value;
  }
}
