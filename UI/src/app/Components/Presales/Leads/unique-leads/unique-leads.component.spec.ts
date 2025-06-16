import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueLeadsComponent } from './unique-leads.component';

describe('UniqueLeadsComponent', () => {
  let component: UniqueLeadsComponent;
  let fixture: ComponentFixture<UniqueLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniqueLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniqueLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
