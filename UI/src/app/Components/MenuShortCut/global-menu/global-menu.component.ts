import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuShortCutService } from 'src/app/Services/MenuShortCut/MenuShortCutService.service';

@Component({
  selector: 'app-global-menu',
  templateUrl: './global-menu.component.html',
  styleUrls: ['./global-menu.component.css']
})
export class GlobalMenuComponent {
  visible = false;
  x = 0;
  y = 0;

  constructor(private menuService: MenuShortCutService) {}

  ngOnInit(): void {
    this.menuService.menu$.subscribe((data) => {
      if (data) {
        this.visible = true;
        this.x = data.x;
        this.y = data.y;
      } else {
        this.visible = false;
      }
    });
  }

  onOptionClick(option: string) {
    alert(`You clicked: ${option}`);
    this.visible = false;
  }
}