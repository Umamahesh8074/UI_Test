import { Directive, HostListener } from '@angular/core';
import { MenuShortCutService } from '../Services/MenuShortCut/MenuShortCutService.service';

@Directive({
  selector: '[appCtrlClick]'
})
export class CtrlClickDirective {
  constructor(private menuService: MenuShortCutService) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (event.ctrlKey && event.button === 0) {
      event.preventDefault();
      this.menuService.openMenu(event.clientX, event.clientY);
    } else {
      this.menuService.closeMenu();
    }
  }
}
