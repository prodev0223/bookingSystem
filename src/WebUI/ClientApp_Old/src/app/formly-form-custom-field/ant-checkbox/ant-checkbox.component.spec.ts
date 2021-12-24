import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntCheckboxComponent } from './ant-checkbox.component';

describe('AntCheckboxComponent', () => {
  let component: AntCheckboxComponent;
  let fixture: ComponentFixture<AntCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AntCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
