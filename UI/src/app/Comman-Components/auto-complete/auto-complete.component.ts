import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent<T> implements ControlValueAccessor {
  @Input() label!: string;
  @Input() placeholder: string = 'Search/Select..';
  @Input() displayFn!: (item: T) => string;
  @Input() formControl!: FormControl;
  @Output() selectionChange = new EventEmitter<T>();
  @Output() onSearch = new EventEmitter<T>();

  private _options: T[] = [];

  @Input() set options(value: T[]) {
    this._options = value;
    this.cdr.detectChanges();
  }

  

  get options(): T[] {
    return this._options;
  }

  value: T = {} as T;

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log(this.options);
  }

  // This method is required to update the value of the control
  writeValue(value: any): void {
    this.value = value;
  }

  // This method is required to register the callback for value changes
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // This method is required to register the callback for the "touched" state
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // This method is optional and handles setting the disabled state
  setDisabledState(isDisabled: boolean): void {
    // Disable the input if necessary
  }

  // Handle selection change
  onOptionSelected(option: any) {
    this.value = option;
    this.onChange(this.value); // Notify Angular of the value change
    this.selectionChange.emit(option);
  }

  // Handle search input
  search(option: any) {
    this.onSearch.emit(option);
  }
}
