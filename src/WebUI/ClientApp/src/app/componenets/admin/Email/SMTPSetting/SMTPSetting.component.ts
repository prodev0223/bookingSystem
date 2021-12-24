import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormHelper, ValueType } from "src/app/common/FormHelper";
import {
  SmtpClientOptions,
  TestEmailClient,
  UpdateEmailSettingsCommand,
} from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-SMTPSetting",
  templateUrl: "./SMTPSetting.component.html",
  styleUrls: ["./SMTPSetting.component.sass"],
})
export class SMTPSettingComponent implements OnInit {
  fh!: FormHelper;
  fhEmail!: FormHelper;
  SMTPForm!: FormGroup;
  modalRef?: BsModalRef;
  testMailForm: FormGroup;
  socketList: Array<any> = [];

  constructor(
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    public swalService: SweetAlertService,
    private testEmailClient: TestEmailClient
  ) {}

  ngOnInit() {
    this.CreateForm();
    this.GetSocketList();
    this.CreateMailForm();
    this.GetSMTPSettings();
    this.fh = new FormHelper(this.SMTPForm);
    this.fhEmail = new FormHelper(this.testMailForm);
  }

  CreateForm() {
    this.SMTPForm = new FormGroup({
      port: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]),
      useSsl: new FormControl(false),
      socketOptions: new FormControl(null),
      preferredEncoding: new FormControl(null),
      usePickupDirectory: new FormControl(false),
      mailPickupDirectory: new FormControl(null),
      requiresAuthentication: new FormControl(false),
      user: new FormControl(null, Validators.required),
      server: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  CreateMailForm() {
    this.testMailForm = new FormGroup({
      body: new FormControl("test body", [Validators.required]),
      subject: new FormControl("test subject", [Validators.required]),
      emailId: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  openTestMailModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  EditFormData(data: SmtpClientOptions) {
    this.SMTPForm.patchValue({
      port: data.port,
      user: data.user,
      server: data.server,
      useSsl: data.useSsl,
      password: data.password,
      socketOptions: data.socketOptions,
      preferredEncoding: data.preferredEncoding,
      usePickupDirectory: data.usePickupDirectory,
      mailPickupDirectory: data.mailPickupDirectory,
      requiresAuthentication: data.requiresAuthentication,
    });
  }

  GetSMTPSettings() {
    this.testEmailClient.getRawSmtpInfo().subscribe((res) => {
      this.EditFormData(res);
    });
  }

  GetSocketList() {
    this.socketList = [];
    this.socketList.push({ label: "None", value: 0 });
    this.socketList.push({ label: "Auto", value: 1 });
    this.socketList.push({ label: "Ssl On Connect", value: 2 });
    this.socketList.push({ label: "Start Tls", value: 3 });
    this.socketList.push({
      label: "Start Tls When Available",
      value: 4,
    });
  }

  GetFormData(): any {
    let cmd: any = {
      server: this.fh.getValue("server"),
      port: this.fh.getValue("port", ValueType.Number),
      user: this.fh.getValue("user"),
      password: this.fh.getValue("password"),
      useSsl: this.fh.getValue("useSsl"),
      requiresAuthentication: this.fh.getValue("requiresAuthentication"),
      preferredEncoding: this.fh.getValue("preferredEncoding"),
      usePickupDirectory: this.fh.getValue("usePickupDirectory"),
      mailPickupDirectory: this.fh.getValue("mailPickupDirectory"),
      socketOptions: this.fh.getValue("socketOptions"),
    };

    return cmd;
  }

  SendTestMail() {
    if (this.SMTPForm.valid) {
      this.swalService
        .ConfirmDialogue("Are you sure to sent test mail?", "")
        .subscribe((result) => {
          if (result) {
            var command = {
              settings: this.GetFormData(),
              body: this.fhEmail.getValue("body"),
              subject: this.fhEmail.getValue("subject"),
              receiver: this.fhEmail.getValue("emailId"),
            };

            this.testEmailClient.sendtestmail(command).subscribe(
              (result) => {
                if (result) {
                  this.snackbar.showNotification(
                    "success",
                    "Test email settings ok"
                  );
                } else {
                  this.snackbar.showNotification(
                    "error",
                    "Test email settings error"
                  );
                }
                this.modalRef?.hide();
              },
              (error) => {
                console.log(error.response);
                let errors = JSON.parse(error.response);
                this.snackbar.showNotification(
                  "error",
                  `${JSON.stringify(errors.errors)}`
                );
              }
            );
          }
        });
    }
  }

  SaveFormData() {
    if (this.SMTPForm.valid) {
      this.swalService
        .ConfirmDialogue("Are you sure to save settings?")
        .subscribe((result) => {
          if (result) {
            let newInfo = new UpdateEmailSettingsCommand();
            newInfo.settings = this.GetFormData();

            this.testEmailClient.updateEmailSettings(newInfo).subscribe(
              (result) => {
                this.snackbar.showNotification(
                  "success",
                  "Updated email settings"
                );
              },
              (error) => {
                console.log(error.response);
                let errors = JSON.parse(error.response);
                this.snackbar.showNotification(
                  "error",
                  `${JSON.stringify(errors.errors)}`
                );
              }
            );
          }
        });
    }
  }
}
