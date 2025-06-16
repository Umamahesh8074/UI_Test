import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuration-tabs',
  templateUrl: './configuration-tabs.component.html',
  styleUrls: ['./configuration-tabs.component.css'],
})
export class ConfigurationTabsComponent implements OnInit {
  constructor() {
    if (history.state.activeIndex != null) {
      this.activeIndex = history.state.activeIndex;
    }
  }
  ngOnInit(): void {}
  activeIndex: number = 0;
}
