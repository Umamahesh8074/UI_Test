import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { InventoryReceivablesDto } from 'src/app/Models/Procurement/inventory-receivable';
import {
  IPurcahseOrder,
  PurchaseOrder,
} from 'src/app/Models/Procurement/purchaseorder';
import { IUser, User } from 'src/app/Models/User/User';
import { IUserDto, UserDto } from 'src/app/Models/User/UserDto';
import { InventoryReceivableService } from 'src/app/Services/ProcurementService/InventoryReceivable/inventory-receivable.service';
import { PurchaseOrderService } from 'src/app/Services/ProcurementService/PurchaseOrder/purchaseorder.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
@Component({
  selector: 'inventory-receivable',
  templateUrl: './inventory-receivables.component.html',
  styleUrls: ['./inventory-receivables.component.css'],
})
export class AddInventoryReceivable implements OnInit {
  isAdding: boolean = true;
  formData!: FormGroup;
  poList: any[] = [];
  itemsList: any[] = [];
  itemsData: any[] = [];
  users: User[] = [];
  private destroy$ = new Subject<void>();
  organizationId: any;
  receivedDate: any;
  receivedBy: any;
  public user: User = new User();
  inventoryReceivablesDto: InventoryReceivablesDto[] = [];
  userFc: FormControl = new FormControl([] as User[], Validators.required);
  selectedUser: IUserDto = new UserDto();
  selectedPo: IPurcahseOrder = new PurchaseOrder();
  purchaseOrder: PurchaseOrder[] = [];
  purchaseOrderFc: FormControl = new FormControl([] as PurchaseOrder[]);
  code: any;
  userData: UserDto[] = [];
  userName: string = '';
  poId: any;
  pageSizeOptions = pageSizeOptions;
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  irId: number = 0;
  quantityRecivedCheck: boolean[] = [];
  leastOneQuantity: boolean = false;
  dataSelected: any;
  today = new Date();

  displayedColumns: string[] = [
    'itemCategory',
    'itemSubCategory',
    'itemUnit',
    'itemSpecifications',
    'quantity',
    'quantityReceived',
    'quantityExceeded',
    'totalPendingQuantity',
    'previousQuantityReceived',
  ];

  receivableStatus: string[] = [
    'PARTIALLY RECEIVED',
    'RECEIVED',
    'SHORT CLOSED',
  ];

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private toastrService: ToastrService,
    private userService: UserService,
    private purchaseOrderService: PurchaseOrderService,
    private inventoryReceivableService: InventoryReceivableService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.initializeFormData();
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }

    const { isAdding, displayPage } = history.state;
    const data = displayPage;

    this.isAdding = isAdding;
    if (data) {
      this.patchFormData(data);
    }

    this.getAllPurchaseOrder();
    this.fetchUsers();
  }

  private initializeFormData(): void {
    const group = this.builder.group({
      irId: [0],
      poId: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      invoiceAmount: ['', Validators.required],
      receivableStatus: ['PARTIALLY RECEIVED'],
      receivedBy: ['', Validators.required],
      receivedDate: [new Date().toISOString(), Validators.required],
      quantities: this.builder.array([], this.atLeastOneQuantityRequired()),
    });

    this.formData = group;

    if (this.inventoryReceivablesDto) {
      this.inventoryReceivablesDto.forEach((row) => {
        this.addQuantity(row);
      });
    }
  }

  private addQuantity(row: any, quantityReceived: number = 0): void {
    const quantityFormGroup = this.builder.group({
      categoryId: [row.categoryId || '', Validators.required],
      quotationItemId: [row.quotationItemId || ''],
      quantityReceived: [quantityReceived || ''],
      quantityExceeded: [0],
      itemUnitId: [row.unitId || ''],
    });
    (this.formData.get('quantities') as FormArray).push(quantityFormGroup);
  }

  onPoIdChange(event: any): void {
    const poId = event.value;
  }

  onItemChange(event: any): void {
    const itemId = event.value;
  }

  clearForm() {
    this.formData.reset();
  }

  gotoInventoryReceivables() {
    this.router.navigate(['layout/procurement/goodsreceived'], {
      state: {
        displaypage: this.dataSelected,
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchUsers() {
    this.userService
      .fetchAllUsers(this.userName, this.organizationId)
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  displayUser(user: IUser): string {
    return user && user.userName ? user.userName : '';
  }
  searchPurchaseOrder(event: any): void {
    const query = event.target.value;
    this.code = query;
    this.getAllPurchaseOrder();
  }
  getAllPurchaseOrder() {
    this.purchaseOrderService
      .fetchAllPurchaseOrders(this.code, this.organizationId, this.user.userId)
      .subscribe({
        next: (purchaseOrder) => {
          this.purchaseOrder = purchaseOrder;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  displayPurchaseOrder(purchaseOrder: PurchaseOrder): string {
    return purchaseOrder && purchaseOrder.poCode ? purchaseOrder.poCode : '';
  }

  onPurchaseOrderSelect(event: any): void {
    this.poId = event.option.value.id;
    this.formData.patchValue({ poId: this.poId });
    this.getInventoryReceivables(this.poId);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getInventoryReceivables(this.poId);
  }

  getInventoryReceivables(poId: number): void {
    this.inventoryReceivableService
      .getInventoryReceivables(poId, this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.inventoryReceivablesDto = response.records;

        this.totalItems = response.totalRecords;

        this.inventoryReceivablesDto.forEach((row, index) => {
          const quantityReceived = row.quantityReceived || 0;

          const quantityFormGroup = (
            this.formData.get('quantities') as FormArray
          ).at(index);

          if (quantityFormGroup) {
            quantityFormGroup.patchValue({ quantityReceived });
          } else {
            this.addQuantity(row, quantityReceived);
          }
        });
      });
  }

  // Get quantities as an array (to iterate in the HTML)
  get quantities() {
    return (this.formData.get('quantities') as any).controls;
  }

  save() {
    if (this.formData.get('quantities')?.errors?.['noQuantityReceived']) {
      this.leastOneQuantity = true;
      return;
    }
    if (this.quantityRecivedCheck.includes(false)) {
      return;
    } else {
      if (this.formData.valid) {
        const formValue = this.formData.value;

        // Filter out quantities with 0 or empty quantityReceived
        const filteredQuantities = formValue.quantities.filter(
          (quantity: any) => {
            return (
              quantity.quantityReceived !== 0 &&
              quantity.quantityReceived !== ''
            );
          }
        );

        formValue.quantities = filteredQuantities;

        if (this.isAdding) {
          this.inventoryReceivableService
            .addInventoryReceivable(formValue)
            .subscribe({
              next: () => {
                this.router.navigate(['layout/procurement/goodsreceived'], {
                  state: {
                    displaypage: this.dataSelected,
                  },
                });
              },
              error: (error) => {
                console.error('Error saving data', error);
              },
            });
        } else {
          this.inventoryReceivableService
            .updateInventoryReceivable(formValue)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.router.navigate(['layout/procurement/goodsreceived']);
              },
              error: (error) => {
                console.error('Error saving data', error);
              },
            });
        }
      } else {
        console.log('Form is invalid');
      }
    }
  }

  searchUser(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.userName = query;
      this.fetchUsers();
    } else if (query.length == 0) {
      this.userName = '';
      this.fetchUsers();
    }
  }

  private fetchUserById(userId: number) {
    this.userService
      .getUserDtoByUserId(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedUser = data;
        },
        error: (error: Error) => {},
      });
  }

  private fetchPOById(poId: number) {
    this.purchaseOrderService
      .getPOById(poId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedPo = data;
        },
        error: (error: Error) => {},
      });
  }

  onUserSelect(event: any) {
    this.receivedBy = event.option.value.userId;
    this.formData.patchValue({ receivedBy: this.receivedBy });
  }

  patchFormData(data: any): void {
    this.dataSelected = history.state.displayPage;
    this.formData.patchValue({
      poId: data.poId,
      receivedBy: data.receivedBy,
      receivedDate: data.receivedDate,
    });
    const poId = data.poId;
    const irId = data.irId;
    this.fetchPOById(poId);
    this.getInventoryReceivables(poId);
    const userId = data.receivedBy;
    this.fetchUserById(userId);
    this.formData.patchValue(data);
  }

  checkQuantity(row: any, index: number): void {
    this.leastOneQuantity = false;
    const quantityReceived =
      this.quantities[index].get('quantityReceived')?.value;
    const poId = this.formData.get('poId')?.value;
    const quotationItemId = row.quotationItemId;
    const itemUnitId = row.unitId;
    const irId = this.formData.get('irId')?.value;
    if (quantityReceived == null || quantityReceived <= 0) {
      this.quantityRecivedCheck[index] = true;
      return;
    }

    // Call service for adding quantity
    this.inventoryReceivableService
      .validateQuantity(
        poId,
        quotationItemId,
        itemUnitId,
        quantityReceived,
        irId
      )
      .subscribe({
        next: (response: any) => {
          console.log('Add API Response:', response);
          this.quantityRecivedCheck[index] = response;
        },
        error: (error) => {
          console.error('Error during add operation:', error);
        },
      });
  }

  handleErrorResponse(response: any): void {
    if (response.errorMessage) {
      this.toastrService.error(response.errorMessage, 'Validation Error', {
        timeOut: 5000,
      });
    } else {
      this.toastrService.error(
        'An error occurred while validating the quantity.',
        'Error',
        {
          timeOut: 5000,
        }
      );
    }
  }

  atLeastOneQuantityRequired(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      const hasValue = (formArray as FormArray).controls.some(
        (control) => control.get('quantityReceived')?.value > 0
      );
      return hasValue ? null : { noQuantityReceived: true };
    };
  }

  receivableStatusChange(event: any): void {}
}
