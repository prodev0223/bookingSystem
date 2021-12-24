import {FormlyFieldConfig} from "@ngx-formly/core";

export const GlobalPermissionSetForm : FormlyFieldConfig[] =
  [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'Permission Set Name',
        placeholder: 'Permission Set Name',
        required: true,
      }
    },
    {
      fieldGroup: [
        {
          key: 'permissions',
          type: 'select',

          templateOptions: {
            label: 'Select Multiple',
            placeholder: 'Placeholder',
            description: 'Description',
            required: true,
            multiple: true,
            selectAllOption: 'Select All',
            options: [
              {value: 1, label: 'AllPermission'},
              {value: 2, label: 'BookingViewOnly'},
              {value: 3, label: 'BookingMakeForMyself'},
              {value: 4, label: 'BookingMakeAnyTime'},
              {value: 5, label: 'BookingMakeFixedTime'},
              {value: 6, label: 'BookingMakeAsOtherUserGroup'},
              {value: 7, label: 'BookingModifyCancel'},
              {value: 8, label: 'BookingMakeAsOtherUser'},
              {value: 9, label: 'BookingApprovalPending'},
              {value: 10, label: 'BookingModifyCancelViewRegional'},
              {value: 11, label: 'BookingModifyCancelViewAll'},
              {value: 12, label: 'BookingViewEquipment'},
              {value: 13, label: 'BookingViewAnyBooking'},
              {value: 14, label: 'BookingViewMyBooking'},

              {value: 100, label: 'BookingExtraItem'},
              {value: 110, label: 'FacilityManagement'},
              {value: 130, label: 'AccountManagement'},
              {value: 190, label: 'SmtpSetting'},
              {value: 1000, label: 'ReportsAllUnit'},
              {value: 2000, label: 'ReportsOwnUnit'},
            ],
          }
        }
      ],
    },
  ]
