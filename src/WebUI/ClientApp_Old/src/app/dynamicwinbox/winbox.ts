import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[pDynamicDialogContent]',
  host: {
    'class': 'p-element'
  }
})
export class WinBoxContent {

	constructor(public viewContainerRef: ViewContainerRef) {}

}
