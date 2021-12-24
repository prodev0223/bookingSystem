import {Component, OnDestroy, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({

  selector: 'app-get-user-raw-info-button',
  styleUrls: ['./get-user-raw-info-button.component.css'],
  template: `
     <button class="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-1 rounded" (click)="onClick($event)">{{label}}</button>
  `
})
export class GetUserRawInfoButtonComponent {
  public cellValue: string;

  params;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.label = this.params.label || null;
    this.cellValue = this.getValueToDisplay(params);
  }

  // gets called whenever the cell refreshes
  label: string;

  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
  }

  buttonClicked() {
    alert(`${this.cellValue} medals won!`)
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
}
