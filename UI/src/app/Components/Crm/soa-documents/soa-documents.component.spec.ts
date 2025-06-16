import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoaDocumentsComponent } from './soa-documents.component';

describe('SoaDocumentsComponent', () => {
  let component: SoaDocumentsComponent;
  let fixture: ComponentFixture<SoaDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoaDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoaDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
