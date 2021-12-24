/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RoomGroupComponent } from "./RoomGroup.component";

describe("RoomGroupComponent", () => {
  let component: RoomGroupComponent;
  let fixture: ComponentFixture<RoomGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoomGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
