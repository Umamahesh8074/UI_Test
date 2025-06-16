import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { ItemUnit } from 'src/app/Models/Procurement/itemunit';
import { Store } from 'src/app/Models/Procurement/store';
import { StoreInventory } from 'src/app/Models/Procurement/storeinventory';
import { User } from 'src/app/Models/User/User';
import { ItemUnitService } from 'src/app/Services/ProcurementService/ItemUnit/item-unit.service';
import { StoreService } from 'src/app/Services/ProcurementService/Store/store.service';
import { StoreInventoryService } from 'src/app/Services/ProcurementService/StoreInventory/store-inventory.service';

@Component({
  selector: 'app-addstoreinventory',
  templateUrl: './addstoreinventory.component.html',
  styleUrls: ['./addstoreinventory.component.css'],
})
export class AddstoreinventoryComponent implements OnInit, OnDestroy {
  user: User = new User();
  organizationId: number = 0;
  itemName: string = '';
  isAdding: boolean = true;
  formData!: FormGroup;
  storeFromFc: FormControl = new FormControl([] as Store[]);
  itemUnit: any = new FormControl([] as ItemUnit[]);
  storeName: any;
  storeId: number = 0;
  storeData: Store[] = [];
  itemUnits: ItemUnit[] = [];
  selecteditem: ItemUnit = new ItemUnit();
  displayPage: any;
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private storeService: StoreService,
    private builder: FormBuilder,
    private itemUnitService: ItemUnitService,
    private storeInventory: StoreInventoryService
  ) {}
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    this.fetchStore();
    this.fetchItemUnits();
    this.intilizeForm();
    this.patchFormData();
  }
  patchFormData() {
    console.log(history.state);

    if (history.state) {
      console.log(history.state.displayPage);

      this.displayPage = history.state.displayPage;
      this.isAdding = history.state.isAdding;
      this.formData.patchValue({
        storeInventoryId: history.state.storeInventory.storeInventoryId,
        itemUnitId: history.state.storeInventory.itemUnitId,
        storeId: history.state.storeInventory.storeId,
        storeStock: history.state.storeInventory.storeStock,
      });
      this.fetchToStore(history.state.storeInventory.storeId);
      this.fetchItemUnit(history.state.storeInventory.itemUnitId);
    }
  }
  intilizeForm() {
    this.formData = this.builder.group({
      storeInventoryId: [0],

      itemUnitId: ['', Validators.required],
      storeId: ['', Validators.required],

      storeStock: [0, Validators.required],
    });
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }
  fetchStore() {
    this.storeService
      .getAllStoreWithOutPage(this.storeName, this.user.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (storeData) => {
          this.storeData = storeData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onSearchStore(event: any) {
    const query = event.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.storeName = query;
      this.fetchStore();
    }
    if (query.length === searchTextZero) {
      this.storeId = 0;
      this.fetchStore();
    }
  }
  displayStoreFn(input: any) {
    return input && input.storeName ? input.storeName : 'All';
  }
  onStoreChange(event: any) {
    console.log(event.storeId);
    console.log(this.formData);

    if (event.storeId) {
      this.formData.patchValue({ storeId: event.storeId });
    }
  }

  searchitem(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.itemName = query;
      this.fetchItemUnits();
    } else if (query.length == 0) {
      this.itemName = '';
      this.fetchItemUnits();
    }
  }
  fetchItemUnits() {
    this.itemUnitService
      .getAll(this.itemName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemUnits) => {
          this.itemUnits = itemUnits;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onitemSelect(value: ItemUnit) {
    this.selecteditem = value;

    if (this.selecteditem) {
      this.formData.patchValue({ itemUnitId: this.selecteditem.unitId });
    }

    // this.fetchStockInventory();
  }
  displayitem(item: ItemUnit): string {
    return item && item.materialCode ? item.materialCode : '';
  }

  gotoStoreInventory() {
    this.router.navigate(['/layout/procurement/storeinventory'], {
      state: {
        displayPage: this.displayPage,
      },
    });
  }

  clearForm() {
    this.formData.reset();
  }
  save() {
    if (this.formData.valid) {
      console.log(this.formData);

      const storeInventory: StoreInventory = this.formData.value;
      if (this.isAdding) {
        this.storeInventory
          .addStoreInventory(storeInventory)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () =>
              this.router.navigate(['layout/procurement/storeinventory'], {
                state: {
                  displayPage: this.displayPage,
                },
              }),
            error: (err) =>
              console.error('Error adding Store Inventory  ', err),
          });
      } else {
        this.storeInventory
          .updateInventoryTransfer(storeInventory)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () =>
              this.router.navigate(['layout/procurement/storeinventory'], {
                state: {
                  displayPage: this.displayPage,
                },
              }),
            error: (err) =>
              console.error('Error updating Store Inventory ', err),
          });
      }
    }
  }

  private fetchToStore(storeId: number) {
    this.storeService
      .getStore(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (store) => {
          this.storeFromFc.patchValue(store);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchItemUnit(itemId: number): void {
    this.itemUnitService
      .getItemUnitByUnitId(itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (item) => {
          this.itemUnit.patchValue(item);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
}
