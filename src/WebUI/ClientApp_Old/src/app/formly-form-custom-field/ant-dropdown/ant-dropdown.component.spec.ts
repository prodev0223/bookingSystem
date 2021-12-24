import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntDropdownComponent } from './ant-dropdown.component';

describe('AntDropdownComponent', () => {
  let component: AntDropdownComponent;
  let fixture: ComponentFixture<AntDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AntDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
