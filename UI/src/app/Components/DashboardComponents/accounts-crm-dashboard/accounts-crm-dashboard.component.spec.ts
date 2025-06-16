import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsCrmDashboardComponent } from './accounts-crm-dashboard.component';

describe('AccountsCrmDashboardComponent', () => {
  let component: AccountsCrmDashboardComponent;
  let fixture: ComponentFixture<AccountsCrmDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsCrmDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsCrmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
