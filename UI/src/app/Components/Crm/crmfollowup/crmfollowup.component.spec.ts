import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMFollowupComponent } from './crmfollowup.component';

describe('CRMFollowupComponent', () => {
  let component: CRMFollowupComponent;
  let fixture: ComponentFixture<CRMFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRMFollowupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRMFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
