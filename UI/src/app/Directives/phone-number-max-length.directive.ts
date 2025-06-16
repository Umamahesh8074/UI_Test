import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneNumberMaxLength]',
})
export class PhoneNumberMaxLengthDirective {
  constructor() {}

  private maxLength: number = 10;

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > this.maxLength) {
      event.preventDefault();
    }
  }
}
