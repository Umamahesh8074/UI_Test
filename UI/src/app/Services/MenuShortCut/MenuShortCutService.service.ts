import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface MenuEvent {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuShortCutService {
  private menuSubject = new Subject<MenuEvent | null>();
  menu$ = this.menuSubject.asObservable();

  openMenu(x: number, y: number) {
    this.menuSubject.next({ x, y });
  }

  closeMenu() {
    this.menuSubject.next(null);
  }
}