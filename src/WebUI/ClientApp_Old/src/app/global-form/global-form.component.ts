import {Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {Dialog} from "primeng/dialog";
import {SettingsService} from "../service/settings.service";
import {RoomInfoService} from "../service/room-info.service";
import {WinBoxRef} from "../dynamicwinbox/win-box-ref";
import {WinBoxConfig} from "../dynamicwinbox/winbox-config";
import {GlobalListEventService} from "../service/global-list-event.service";
import {format} from "date-fns";

@Component({
  selector: 'app-global-form',
  templateUrl: './global-form.component.html',
  styleUrls: ['./global-form.component.css'],
})
/*
  two-way-binding angular
  https://angular.io/guide/two-way-binding

  How two-way binding works

  For two-way data binding to work, the @Output() property must use the pattern, inputChange, where input is the name of the @Input() property. For example, if the @Input() property is size, the @Output() property must be sizeChange.

  The following sizerComponent has a size value property and a sizeChange event. The size property is an @Input(), so data can flow into the sizerComponent. The sizeChange event is an @Output(), which lets data flow out of the sizerComponent to the parent component.

  Next, there are two methods, dec() to decrease the font size and inc() to increase the font size. These two methods use resize() to change the value of the size property within min/max value constraints, and to emit an event that conveys the new size value.


 */
export class GlobalFormComponent implements OnInit {

  @ViewChild("dialDetail") divView: Dialog;

  @Input('form') form: FormGroup = new FormGroup({});
  @Input('fields') fields: FormlyFieldConfig[];

  @Input() model!: any;
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input('submitButtonLabel') submitButtonLabel: string = '';
  @Input('cancelEditingButtonLabel') cancelEditingButtonLabel: string = '';
  @Input('cancelButtonLabel') cancelButtonLabel: string = '';

  @Output('submitClick') submitClick: EventEmitter<any> = new EventEmitter<any>();
  @Output('cancelEditingClick') cancelEditingClick: EventEmitter<any> = new EventEmitter<any>();
  @Output('cancelClick') cancelClick: EventEmitter<any> = new EventEmitter<any>();

  @Output('onSubmitForm') onSubmitForm: EventEmitter<any> = new EventEmitter<any>();

  updateChanges() {
    this.modelChange.emit(this.model);
  }

  @Output('updateDialogData') updateDialogData: EventEmitter<object> = new EventEmitter<object>();
  @Output('bookingEventDone') bookingEventDone: EventEmitter<object> = new EventEmitter<object>();


  constructor(
    @Optional() private winBoxRef: WinBoxRef,
    @Optional() private config: WinBoxConfig,
    private roomInfoService: RoomInfoService,
    private settingsService: SettingsService,
    private globalListEventService: GlobalListEventService
  ) {
  }


  ngOnInit(): void {
    console.log(this.submitButtonLabel)
    this.hideSubmitButton = this.submitButtonLabel === '';
    console.log(this.cancelEditingButtonLabel)
    this.hideCancelEditingButton = this.cancelEditingButtonLabel === '';
    console.log(this.cancelButtonLabel === '')
    this.hideCancelButton = this.cancelButtonLabel === '';
  }

  hideSubmitButton: boolean = false;
  hideCancelEditingButton: boolean = false;
  hideCancelButton: boolean = false;


  showCancel: boolean = false;

  submitLabel: string = "Submit";

  submitButtonDisabled: any;

  @Input('roomName') roomName: string;
  @Input('userFriendlyMessage') userFriendlyMessage: string;
  @Input('lastModifyDate') lastModifyDate: Date;

  get showHidden(): boolean {
    return this.settingsService.showDebug();
  }

  onSubmit() {
    this.onSubmitForm.emit('submitform');
  }

  endEditing() {
    this.cancelEditingClick.emit('cancelEditingClick');
  }

  onBookingEventDone(): void {
    let bookingMessage = {'booking': 'bookingOk'};
    this.globalListEventService.updateList();
    this.winBoxRef.close();
  }
}
