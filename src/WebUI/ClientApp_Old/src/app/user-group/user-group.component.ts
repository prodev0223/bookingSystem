import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit {

  constructor() { }
  @Input('userGroupId') userGroupId: number = 0;
  @Output('updateDialogData') updateDialogData: EventEmitter<object> = new EventEmitter<object>();
  @Output('bookingEventDone') bookingEventDone: EventEmitter<object> = new EventEmitter<object>();

  ngOnInit(): void {
  }
}
