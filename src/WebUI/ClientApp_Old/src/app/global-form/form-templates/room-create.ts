import {FormlyFieldConfig} from "@ngx-formly/core";

export const GlobalVariable = Object.freeze({
  BASE_API_URL: 'http://example.com/',
});

export const GlobalRoomForm : FormlyFieldConfig[] =
[
  {
    key: 'roomName',
    type: 'input',
    templateOptions: {
      label: 'Room Name',
      placeholder: 'Room Name',
      required: true,
    }
  },
  {
    key: 'chineseName',
    type: 'input',
    templateOptions: {
      label: 'Room 中文名',
      placeholder: 'Room 中文名',
      required: true,
    }
  },
  {
    key: 'mappingKey',
    type: 'input',
    templateOptions: {
      label: 'Mapping Key',
      placeholder: 'Mapping Key',
      required: true,
    }
  },
  {
    key: 'startTime',
    type: 'timeprimeng',
    templateOptions: {
      label: 'Start Time',
      placeholder: 'Start Time',
      required: true,
    }
  },
  {
    key: 'endTime',
    type: 'timeprimeng',
    templateOptions: {
      label: 'End Time',
      placeholder: 'End Time',
      required: true,
    }
  }
]


