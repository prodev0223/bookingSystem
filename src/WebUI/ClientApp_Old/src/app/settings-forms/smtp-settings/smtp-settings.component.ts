
import {Component, OnInit, SimpleChanges} from '@angular/core';
import { FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import { TestEmailClient, UpdateEmailSettingsCommand,
} from "../../web-api-client";
import {WinBoxService} from "../../dynamicwinbox/winboxservice";
import {UserInfoPageComponent} from "../../UserInfo/userinfo-page.component";
import {WinBoxRef} from "../../dynamicwinbox/win-box-ref";
import {ToastService} from "../../service/toast.service";

@Component({
  selector: 'app-smtp-settings',
  templateUrl: './smtp-settings.component.html',
  styleUrls: ['./smtp-settings.component.css']
})
export class SmtpSettingsComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    private winBoxService: WinBoxService,
    private winBoxRef: WinBoxRef,
    private testEmailClient: TestEmailClient
  ) {

  }

  curRoomName: string = "";

  ngOnInit(): void {
    this.winBoxRef.setTitle('SMTP settings');
    this.testEmailClient.getRawSmtpInfo().subscribe(res => {
      console.log(res);
      this.model = res;
    });
  }

  action: 'update' | 'create';
  form = new FormGroup({});
  fields: FormlyFieldConfig[] =
    [
      {
        key: 'server',
        type: 'antInput',
        templateOptions: {
          label: 'Server',
          placeholder: 'Server',
          required: true,

        },
        hideExpression: false,
      },
      {
        key: 'port',
        type: 'antInput',
        templateOptions: {
          type: 'number',
          max: 65535,
          min: 1,
          label: 'Port',
          placeholder: 'Port',
          required: true,
        }
      },
      {
        key: 'user',
        type: 'antInput',
        templateOptions: {
          label: 'User',
          placeholder: 'User',
          required: true,

        },
        hideExpression: false,
      },
      {
        key: 'password',
        type: 'antInput',
        templateOptions: {
          label: 'Password',
          placeholder: 'Password',
          required: true,

        },
        hideExpression: false,
      },

      {
        key: 'useSsl',
        type: 'antCheckbox',
        templateOptions: {
          label: 'Use Ssl',
        },
        hideExpression: false
      },

      {
        key: 'preferredEncoding',
        type: 'antInput',
        templateOptions: {
          label: 'Preferred Encoding',
          placeholder: 'Preferred Encoding',

        },
        hideExpression: false,
      },

      {
        key: 'requiresAuthentication',
        type: 'antCheckbox',
        templateOptions: {
          label: 'Requires Authentication',
        },
        hideExpression: false
      },
      {
        key: 'mailPickupDirectory',
        type: 'antInput',
        templateOptions: {
          label: 'Mail Pickup Directory',
          placeholder: 'Mail Pickup Directory',
        },
        hideExpression: false,
      },
      {
        key: 'socketOptions',
        type: 'antSelect',
        templateOptions: {
          label: 'socketOptions',
          options: [
            {label: 'None', value: 0},
            {label: 'Auto', value: 1},
            {label: 'Ssl On Connect', value: 2},
            {label: 'Start Tls', value: 3},
            {label: 'Start Tls When Available', value: 4},
          ],
        },
      },

      {
        key: 'usePickupDirectory',
        type: 'antCheckbox',
        templateOptions: {
          label: 'Use Pickup Directory',
        },
        hideExpression: false
      },
    ]
  model: any = {};

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

  get showCancel(): boolean {
    return true;
  }

  submitLabel: string = "Submit";
  submitButtonDisabled: any;

  showCreateUpdate() {
  };


  onSubmit() {
    if (this.form.valid) {
      this.submitButtonDisabled = true;
      let newInfo = new UpdateEmailSettingsCommand();
      newInfo.settings = this.model;

      this.testEmailClient.updateEmailSettings(newInfo).subscribe(result => {
          alert(`Update email settings ok`);
          this.toastService.add(
            {
              severity: 'success',
              summary: `Update email settings ok`,
              detail: `Update email settings ok`,
            }
          );
          this.submitButtonDisabled = false;
        },
        error => {
          this.submitButtonDisabled = false;
          console.log(error.response);

          let errors = JSON.parse(error.response);
          this.toastService.add(
            {
              severity: 'error',
              summary: `${errors.title}`,
              detail: `${JSON.stringify(errors.errors)}`,
            }
          )
          setTimeout(() => this.submitButtonDisabled = false, 2000);
        }
      )
      this.submitButtonDisabled = false;
    }
  }

  popout() {
    this.winBoxService.open(UserInfoPageComponent, {});
  }

  cancel() {
    this.winBoxRef.close();
  }

  maxwinbox() {
    this.winBoxRef.maximize();
  }
}
