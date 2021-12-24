import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  Type,
  EmbeddedViewRef,
  ComponentRef
} from '@angular/core';
import {WinBoxRef} from "./win-box-ref";
import {WinBoxComponent} from "./winboxcommponent";
import {WinBoxConfig} from "./winbox-config";
import {WinBoxInjector} from "./winbox-injector";

@Injectable()
export class WinBoxService {

  dialogComponentRefMap: Map<WinBoxRef, ComponentRef<WinBoxComponent>> = new Map();

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) {
  }

  public open(componentType: Type<any>, config: WinBoxConfig) {
    const dialogRef = this.appendDialogComponentToBody(config);

    this.dialogComponentRefMap.get(dialogRef).instance.childComponentType = componentType;

    return dialogRef;

  }

  private appendDialogComponentToBody(config: WinBoxConfig) {
    const map = new WeakMap();
    map.set(WinBoxConfig, config);

    const dialogRef = new WinBoxRef();
    map.set(WinBoxRef, dialogRef);

    const sub = dialogRef.onClose.subscribe(() => {
      this.dialogComponentRefMap.get(dialogRef).instance.close();
    });

    const maximizeSub = dialogRef.onMaximize.subscribe(() => {
      this.dialogComponentRefMap.get(dialogRef).instance.maximize();
    });

    const titleSub = dialogRef.onSetTitle.subscribe((t) => {
      this.dialogComponentRefMap.get(dialogRef).instance.setTitle(t);
    });

    const destroySub = dialogRef.onDestroy.subscribe(() => {
      this.removeDialogComponentFromBody(dialogRef);
      destroySub.unsubscribe();
      sub.unsubscribe();
    });

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(WinBoxComponent);
    const componentRef = componentFactory.create(new WinBoxInjector(this.injector, map));

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.dialogComponentRefMap.set(dialogRef, componentRef);

    return dialogRef;
  }

  private removeDialogComponentFromBody(dialogRef: WinBoxRef) {
    if (!dialogRef || !this.dialogComponentRefMap.has(dialogRef)) {
      return;
    }

    const dialogComponentRef = this.dialogComponentRefMap.get(dialogRef);
    this.appRef.detachView(dialogComponentRef.hostView);
    dialogComponentRef.destroy();
    this.dialogComponentRefMap.delete(dialogRef);
  }
}
