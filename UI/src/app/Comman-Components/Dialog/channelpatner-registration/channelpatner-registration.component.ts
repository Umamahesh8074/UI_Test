import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-channelpatner-registration',
  templateUrl: './channelpatner-registration.component.html',
  styleUrls: ['./channelpatner-registration.component.css'],
})
export class ChannelpatnerRegistrationDailougeComponent implements OnInit {
  errorMessage: string | null = null;
  errorField: string | undefined;
  dataChanged: any;
  constructor() {}

  ngOnInit(): void {}

  setError(message: string, field: string) {
    this.errorMessage = message;
    this.errorField = field;
  }

  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() title: string = '';

  data = {
    name: '',
    contactNumber: '',
    email: '',
    companyName: '',
  };

  closeModal(): void {
    this.close.emit();
  }
  onSave(): void {
    this.errorMessages = {};
    if (!this.data.name.trim()) {
      this.errorMessages['name'] = 'Name is required';
    }
    if (!this.data.contactNumber.trim()) {
      this.errorMessages['contactNumber'] = 'Contact Number is required';
    } else if (!/^[6789]\d{9}$/.test(this.data.contactNumber)) {
      this.errorMessages['contactNumber'] =
        'Contact Number must start with 7, 8, or 9 and be 10 digits long';
    }
    if (!this.data.email.trim()) {
      this.errorMessages['email'] = 'Email is required';
    }

    if (Object.keys(this.errorMessages).length === 0) {
      console.log(this.data);
      this.save.emit(this.data);
    }
  }
  clearErrorMessage(field: string): void {
    if (this.errorMessages[field]) {
      delete this.errorMessages[field]; // Remove the specific field error
    }
  }
}
