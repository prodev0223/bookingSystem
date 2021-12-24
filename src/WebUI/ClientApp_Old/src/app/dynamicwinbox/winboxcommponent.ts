import {
  Component,
  NgModule,
  Type,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  ComponentRef,
  AfterViewInit,
  ChangeDetectorRef,
  Renderer2,
  NgZone,
  ElementRef,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WinBoxConfig} from "./winbox-config";
import {WinBoxRef} from "./win-box-ref";
import {WinBoxContent} from "./winbox";
import { blue, green } from '@ant-design/colors';

declare const WinBox: any;

@Component({
  selector: 'p-dynamicWinBox',
  template: `
    <div class="p-dialog-content">
      <ng-template pDynamicDialogContent></ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'p-element'
  }
})
export class WinBoxComponent implements AfterViewInit, OnDestroy {

  componentRef: ComponentRef<any>;

  mask: HTMLDivElement;

  @ViewChild(WinBoxContent) insertionPoint: WinBoxContent;

  @ViewChild('mask') maskViewChild: ElementRef;

  childComponentType: Type<any>;

  container: HTMLDivElement;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef, public renderer: Renderer2,
              public config: WinBoxConfig, private dialogRef: WinBoxRef, public zone: NgZone) {
  }

  ngAfterViewInit() {
    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
  }
  myBox: WinBoxRef;

  loadChildComponent(componentType: Type<any>) {
    let factory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    let viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent(factory);
    let element = this.componentRef.location.nativeElement;
    let bookingTitle = this.config?.data?.title ?? "WinBox";
    this.myBox = new WinBox({
      mount: element,
      title: bookingTitle,
      background: blue.primary,
      width: "75%",
      height: "75%",
      x: "center",
      y: "center",
      //border: 4,
      onclose: (force) => {
        console.log("autoclaose");
        viewContainerRef.remove(0);
        //this.hide()
        viewContainerRef.clear();
      }
    });
    /*
    let xx = of(1).pipe(delay(2000))
    xx.subscribe(x => {
        if (viewContainerRef.length == 1) {
          smallBox.close()
        } else {
          console.log("closed");
        }
      }
    );

     */

  }

  onContainerDestroy() {

    if (this.config.modal !== false) {
    }
    this.container = null;
  }

  maximize() {
    this.myBox.maximize();
  }

  setTitle(title: string) {
    this.myBox.setTitle(title);
  }

  close() {
    this.myBox.close(true);
    this.cd.markForCheck();
  }

  hide() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }


  ngOnDestroy() {
    this.onContainerDestroy();

    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [WinBoxComponent, WinBoxContent],
  entryComponents: [WinBoxComponent]
})
export class DynamicWinBoxModule {
}
