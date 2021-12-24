import {FormlyFieldConfig} from "@ngx-formly/core";

export const GlobalSimpleUpdateBooking: FormlyFieldConfig[] =
  [
    {
      key: 'bookingId',
      type: 'input',
      templateOptions: {
        label: 'Booking ID',
        placeholder: 'Booking ID',
        required: false,
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
        readonly: true
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
