import {FormlyFieldConfig} from "@ngx-formly/core";

export const GlobalSimpleMakeBooking: FormlyFieldConfig[] =
  [
    {
      key: 'anyTimeFrame',
      type: 'input',
      templateOptions: {
        label: 'anyTimeFrame',
        placeholder: 'Room ID',
        required: true,
        readonly: true
      }
    },
    {
      key: 'roomId',
      type: 'input',
      templateOptions: {
        label: 'Room ID',
        placeholder: 'Room ID',
        required: true,
        readonly: true
      }
    },

    {
      key: 'start_time',
      type: 'datetimeprimeng',
      templateOptions: {
        label: 'Event Start',
        required: true,
        readonly: true
      },
    },
    {
      key: 'end_time',
      type: 'datetimeprimeng',
      templateOptions: {
        label: 'Event end',
        required: true,
        readonly: false
      }
    },
    {
      key: 'description',
      type: 'input',
      templateOptions: {
        label: 'Description',
        placeholder: 'Description',
        required: true,
      }
    },
  ]
