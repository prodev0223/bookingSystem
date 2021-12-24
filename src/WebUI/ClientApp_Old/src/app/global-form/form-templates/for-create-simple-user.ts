import {FormlyFieldConfig} from "@ngx-formly/core";

export const GlobalSimpleCreateUser: FormlyFieldConfig[] =
  [
    {
      key: 'username',
      type: 'input',
      templateOptions: {
        label: 'Username',
        placeholder: 'Username',
        required: true,
      }
    },
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        label: 'Password',
        placeholder: 'Password',
        required: true,
      }
    },
  ]
