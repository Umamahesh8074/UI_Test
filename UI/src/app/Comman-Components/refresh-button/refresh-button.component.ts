import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-refresh-button',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.css'],
})
export class RefreshButtonComponent {
  @Output() refreshEvent = new EventEmitter<void>();

  refresh() {
    this.refreshEvent.emit(); // Notify parent component
  }
}
