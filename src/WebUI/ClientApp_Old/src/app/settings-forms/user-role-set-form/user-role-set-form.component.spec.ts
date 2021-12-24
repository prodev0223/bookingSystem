import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleSetFormComponent } from './user-role-set-form.component';

describe('UserRoleSetFormComponent', () => {
  let component: UserRoleSetFormComponent;
  let fixture: ComponentFixture<UserRoleSetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleSetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleSetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
