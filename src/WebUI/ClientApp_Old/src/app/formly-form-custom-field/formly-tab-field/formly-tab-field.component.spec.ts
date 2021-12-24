import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyTabFieldComponent } from './formly-tab-field.component';

describe('FormlyTabFieldComponent', () => {
  let component: FormlyTabFieldComponent;
  let fixture: ComponentFixture<FormlyTabFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormlyTabFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyTabFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
