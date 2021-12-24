import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, NgModule } from '@angular/core';
import { Footer } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { WinBoxConfig } from './winbox-config';
import {WinBoxService} from "./winboxservice";
import {DynamicWinBoxModule} from "./winboxcommponent";
import {WinBoxRef} from "./win-box-ref";


@Component({
    template: `
        <h2>
            PrimeNG ROCKS!
        </h2>
    `
  })
export class TestComponent {
    constructor(public ref: WinBoxRef, public config: WinBoxConfig) { }

}


@Component({
    template: `
    <div class="TestDynamicDialog">
    </div>
    `
  })
export class TestDynamicDialogComponent {
    constructor(public dialogService: WinBoxService) {}

    show() {
        this.dialogService.open(TestComponent, {
            header: 'Demo Header',
            width: '70%',
            contentStyle: {"max-height": "350px", "overflow": "auto"},
            dismissableMask:true,
            baseZIndex: 0
        });
    }
}
@NgModule({
    imports: [CommonModule,DynamicWinBoxModule],
    declarations: [
        TestComponent,
        TestDynamicDialogComponent
    ],
    entryComponents: [TestComponent],
    exports:[TestComponent],
    providers:[WinBoxService]
  })
  export class FakeTestDialogModule {}


describe('DynamicDialog', () => {

    let fixture: ComponentFixture<TestDynamicDialogComponent>;
    let testDynamicDialogComponent: TestDynamicDialogComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                FakeTestDialogModule
            ],
            declarations: [
                Footer,
            ],
        })
        fixture = TestBed.createComponent(TestDynamicDialogComponent);
        testDynamicDialogComponent = fixture.debugElement.componentInstance;
    });

    it('should open dialog and close dialog', fakeAsync(() => {
        fixture.detectChanges();

        testDynamicDialogComponent.show();
        fixture.detectChanges();

        tick(300);
        let dynamicDialogEl = document.getElementsByClassName("p-dialog")[0];
        expect(dynamicDialogEl).toBeTruthy();
        const titleEl = dynamicDialogEl.getElementsByClassName("p-dialog-title")[0];
        const testComponentHeader = dynamicDialogEl.getElementsByTagName("h2")[0];
        expect(titleEl.textContent).toEqual("Demo Header");
        expect(testComponentHeader.textContent).toEqual(" PrimeNG ROCKS! ");
        let dynamicDialogTitlebarIconEl = document.querySelector(".p-dialog-header-icon") as HTMLElement;
        dynamicDialogTitlebarIconEl.click();
        fixture.detectChanges();
        tick(700);

        dynamicDialogEl = document.getElementsByClassName("p-dialog")[0];
        expect(dynamicDialogEl).toBeUndefined();
    }));
});
