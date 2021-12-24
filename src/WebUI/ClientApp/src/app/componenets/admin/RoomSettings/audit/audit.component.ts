import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { Audit, UserClient } from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-audit",
  templateUrl: "./audit.component.html",
  styleUrls: ["./audit.component.sass"],
})
export class AuditComponent implements OnInit {
  obj: Observable<Audit[]>;
  public Auditlog: Audit[] = [];
  audit: any;
  roomModalRef?: BsModalRef;
  constructor(
    private userClient: UserClient,
    // private snackbar: SnackbarService,
    //private audit: auditlogs,
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    private swalService: SweetAlertService
  ) {}

  auditForm!: FormGroup;
  formCaption = "New Room";
  Id: number = 0;

  ngOnInit(): void {
    this.getAudit();
    this.CreateAuditForm();
  }

  CreateAuditForm() {
    this.auditForm = new FormGroup({
      rooms: new FormControl(null, Validators.required),
      roomExtraFields: new FormControl(null, Validators.required),
      permissionGroups: new FormControl(null, Validators.required),
      roomGroups: new FormControl(null, Validators.required),
      userGroups: new FormControl(null, Validators.required),
      SMTPServerSetting: new FormControl(new Date(), [Validators.required]),
      booking: new FormControl(new Date(), Validators.required),
      eventDateTime: new FormControl("60", Validators.required),
      bookingUserModeId: new FormControl("0", Validators.required),
      loginAccout: new FormControl("15", Validators.required),
    });
  }

  getControlValue(controlName: string): any {
    return this.auditForm.controls[controlName].value;
  }

  setControlValue(controlName: string, value: any) {
    this.auditForm.controls[controlName].setValue(value);
  }

  GetFormData() {
    var audit: any = {
      Id: Number(this.getControlValue("Id")),
      room: this.getControlValue("room"),
      roomExtraFields: this.getControlValue("roomExtraFields"),
      permissionGroups: this.getControlValue("permissionGroups"),
      roomGroups: this.getControlValue("roomGroups"),
      userGroups: this.getControlValue("userGroups"),
      SMTPServerSetting: this.getControlValue("SMTPServerSetting"),
      eventDateTime: this.getControlValue("eventDateTime"),
      loginAccout: this.getControlValue("loginAccout"),
    };
    return audit;
  }

  AddAudit(template: TemplateRef<any>, resetModal: boolean = true) {
    if (resetModal) {
      this.Id = 0;
      this.formCaption = "auditlog";
      this.setControlValue("rooms", null);
      this.setControlValue("roomExtraFields", null);
      this.setControlValue("permissionGroups", null);
      this.setControlValue("roomGroups", null);
      this.setControlValue("userGroups", 15);
      this.setControlValue("SMTPServerSetting", 10);
      this.setControlValue("booking", this.maxDate);
      this.setControlValue("eventDateTime", this.minDate);
      this.setControlValue("loginAccout", 60);
    }
    this.setControlValue("Id", this.Id);
    this.roomModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }
  minDate(arg0: string, minDate: any) {
    throw new Error("Method not implemented.");
  }
  maxDate(arg0: string, maxDate: any) {
    throw new Error("Method not implemented.");
  }

  getAudit() {
    this.userClient.getaudit().subscribe(
      (result) => {
        this.Auditlog = result;
      },
      (error) => console.error(error)
    );
  }

  SaveAudit() {
    if (this.auditForm.valid) {
      if (this.Id <= 0) {
        let audit = new Audit();
        audit = this.GetFormData();
        this.audit.createAudit(audit).subscribe(
          (result) => {
            this.getAudit();
            this.snackbar.showNotification(
              "success",
              `logs created successfully`
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
    }
  }
}
