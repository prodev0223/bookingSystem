import {
  Component,
  OnInit
} from '@angular/core';
import {DialogService,} from "primeng/dynamicdialog";

import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormlyFieldConfig} from "@ngx-formly/core";


@Component({
  selector: 'app-draft-paper',
  templateUrl: './draft-paper.component.html',
  styleUrls: ['./draft-paper.component.css'],
  providers: [DialogService]
})

export class DraftPaperComponent {

  fields: FormlyFieldConfig[] =
    [
      {
        key: 'bookingId',
        type: 'antInput',
        templateOptions: {
          label: 'Booking ID',
          placeholder: 'Booking ID',
          required: false,
          readonly: true
        }
      },
      {
        key: 'roomId',
        type: 'antInput',
        templateOptions: {
          label: 'Room ID',
          placeholder: 'Room ID',
          required: true,
          readonly: true
        },
        hideExpression: true
      },
      {
        className: 'col-md-6',
        type: 'datetimeprimeng',
        key: 'start_time',
        templateOptions: {
          label: 'Date',
        },
      },
      {
        className: 'col-6 col-md-3 my-2',
        key: 'start_time',
        type: 'datetimeprimeng',
        templateOptions: {
          label: 'Start',
          required: true,
          //readonly: true
        },
      },
      {
        className: 'col-6 col-md-3 my-2',
        key: 'end_time',
        type: 'datetimeprimeng',
        templateOptions: {
          type: 'datetime',
          label: 'End',
          required: true
        }
      },
      {
        key: 'description',
        type: 'antInput',
        templateOptions: {
          label: 'Description',
          placeholder: 'Description',
          required: true,
        }
      },
      {
        key: 'markAsClosed',
        type: 'antCheckbox',
        templateOptions: {
          indeterminate: false,
          label: 'Mark as closed',
          placeholder: 'Mark as closed',
          required: false,
        }
      },
    ];
  model: any;
  form = new FormGroup({});

  onSubmit() {
    alert('')
  }
}
