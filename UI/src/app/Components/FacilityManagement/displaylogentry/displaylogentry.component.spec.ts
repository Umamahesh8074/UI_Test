import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Displaylogentry } from './displaylogentry.component';

describe('DisplayclientinvoicereportComponent', () => {
  let component: Displaylogentry;
  let fixture: ComponentFixture<Displaylogentry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Displaylogentry ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Displaylogentry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
