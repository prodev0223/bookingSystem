import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { ItsNumber } from "src/app/common/CommonFunctions";
import { FormHelper } from "src/app/common/FormHelper";
import { SweetAlertService } from "src/app/common/SweetAlert.service";
import { PermissionsService } from "src/app/service/permissions.service";
import { ToastService } from "src/app/service/toast.service";
import {
  Booking,
  BookingClient,
  BookingDetailDto,
  BookingStatus,
  BookingType,
  CancelCommand,
  CreateSimpleBookingCommand,
  RoomClient,
  UpdateSimpleBookingCommand,
  UserPermission,
} from "src/app/web-api-client";

@Component({
  selector: "app-RoomBooking",
  templateUrl: "./RoomBooking.component.html",
  styleUrls: ["./RoomBooking.component.css"],
})
export class RoomBookingComponent implements OnInit {
  roomId: number;
  fh: FormHelper;
  modalData: any;
  showCancel = false;
  roomForm!: FormGroup;
  lastModifyDate: Date;
  bookingId: number = -1;
  roomsList: Array<any> = [];
  allowEdit: boolean = false;
  formCaption = "New Booking";
  anyTimeFrame: string = "true";
  public onClose: Subject<boolean>;

  constructor(
    public roomClient: RoomClient,
    public bsModalRef: BsModalRef,
    private toastService: ToastService,
    private bookingClient: BookingClient,
    private sweetAlert: SweetAlertService,
    private permissionsService: PermissionsService
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    if (!this.modalData) {
      return;
    } else {
      this.CreateBookingForm();
      this.GetEventData(this.modalData);
    }
  }

  GetEventData(modalData: any) {
    if (modalData) {
      this.fh.enableDisableMany(
        "roomId,end_time,sel_date,start_time",
        modalData.allowEdit
      );
      this.roomsList = modalData.roomsList;
      this.allowEdit = !modalData.allowEdit;
      if (modalData?.bookingStatus == BookingStatus.ForBooking) {
        if (modalData?.roomId != null) {
          this.roomId = parseInt(modalData.roomId, 10);

          if (this.roomId > 0) {
            this.PatchFormData(modalData);

            this.anyTimeFrame = this.permissionsService
              .checkRoomPermission(
                modalData.roomId,
                UserPermission.BookingMakeAnyTime
              )
              .toString();
          }
        }
      } else {
        let bookingId = ItsNumber(modalData?.bookingId);

        if (bookingId > 0) {
          this.EditBooking(bookingId, modalData.title);
        }
      }
    }
  }

  PatchFormData(eventInfo: any) {
    this.roomForm.patchValue({
      roomId: this.roomId,
      end_time: new Date(eventInfo.end),
      sel_date: new Date(eventInfo.selDate),
      start_time: new Date(eventInfo.start),
      markAsClosed: !!eventInfo?.markAsClosed,
      anyTimeFrame: this.permissionsService
        .checkRoomPermission(eventInfo.id, UserPermission.BookingMakeAnyTime)
        .toString(),
    });
  }

  CreateBookingForm() {
    this.roomForm = new FormGroup({
      roomId: new FormControl(null),
      bookingId: new FormControl(null),
      anyTimeFrame: new FormControl(null),
      markAsClosed: new FormControl(false),
      description: new FormControl(null, Validators.required),
      end_time: new FormControl(new Date(), Validators.required),
      sel_date: new FormControl(new Date(), Validators.required),
      start_time: new FormControl(new Date(), [Validators.required]),
    });
    this.fh = new FormHelper(this.roomForm);
  }

  BookingCancel() {
    if (this.bookingId > 0) {
      this.CancelBooking(this.bookingId);
    }
  }

  CancelBooking(bookingId: number) {
    if (bookingId > 0) {
      let cmd = new CancelCommand();
      cmd.bookingId = bookingId;

      this.sweetAlert.ConfirmDialogue("Confirm cancel?").subscribe((result) => {
        if (result) {
          this.bookingClient.cancelBooking(cmd).subscribe(
            (result) => {
              this.toastService.add({
                severity: "success",
                detail: `Booking cancel successfully.`,
                summary: `Booking cancel successfully.`,
              });
              this.onClose.next(true);
            },
            (error) => {
              console.log(error.response);

              let errors = JSON.parse(error.response);
              this.toastService.add({
                severity: "error",
                summary: `${errors.title}`,
                detail: `${JSON.stringify(errors.errors)}`,
              });
            }
          );
        }
      });
    }
  }

  EditBooking(bookingId: number, description: string) {
    this.roomForm.reset();
    this.showCancel = false;
    this.bookingId = Number(bookingId);
    this.fh.setValue("bookingId", Number(this.bookingId));
    this.formCaption = "Edit Booking: " + description ?? "";

    if (this.bookingId > 0) {
      this.bookingClient.getMyRawBooking(this.bookingId).subscribe(
        (result: any) => {
          let firstInfo: Booking;
          let rawBookingInfo = result;

          if (rawBookingInfo.length > 0) {
            firstInfo = rawBookingInfo[0];
            this.lastModifyDate = firstInfo.created;
            if (firstInfo.bookingStatus != BookingStatus.Cancelled) {
              this.showCancel = true;
            }
          }

          this.roomForm.patchValue({
            roomId: firstInfo.roomId,
            bookingId: firstInfo.id,
            end_time: new Date(firstInfo.end),
            sel_date: new Date(firstInfo.start),
            start_time: new Date(firstInfo.start),
            description: firstInfo.bookingDetails.description,
            markAsClosed: firstInfo.bookingType == BookingType.Closed,
            anyTimeFrame: this.permissionsService
              .checkRoomPermission(
                firstInfo.id,
                UserPermission.BookingMakeAnyTime
              )
              .toString(),
          });
        },
        (error) => console.error(error)
      );
    }
  }

  SaveBooking() {
    if (this.roomForm.valid) {
      if (this.bookingId > 0) {
        let bookingDetails = new BookingDetailDto();
        bookingDetails.description = this.fh.getValue("description");
        bookingDetails.equipmentsID = [];

        let cmd = new UpdateSimpleBookingCommand();
        cmd.date = this.fh.getValue("sel_date");
        cmd.startTime = this.fh.getValue("start_time");
        cmd.endTime = this.fh.getValue("end_time");
        cmd.bookingDetailDto = bookingDetails;
        cmd.roomId = this.fh.getValue("roomId");
        cmd.newRoomId = this.fh.getValue("roomId");
        cmd.bookingId = this.fh.getValue("bookingId");

        if (this.fh.getValue("markAsClosed")) {
          cmd.bookingType = BookingType.Closed;
        }
        this.bookingClient.updateSimpleBooking(cmd).subscribe(
          (result) => {
            this.toastService.add({
              severity: "success",
              detail: `Booking updated successfully.`,
              summary: `Booking updated successfully.`,
            });
            this.onClose.next(true);
          },
          (error) => {
            let errors = JSON.parse(error.response);
            this.toastService.add({
              severity: "error",
              summary: `${errors.title}`,
              detail: `${JSON.stringify(errors.errors)}`,
            });
          }
        );
      } else if (this.bookingId <= 0) {
        let bookingDetails = new BookingDetailDto();
        bookingDetails.description = this.fh.getValue("description");
        bookingDetails.equipmentsID = [];

        let cmd = new CreateSimpleBookingCommand();
        cmd.date = this.fh.getValue("sel_date");
        cmd.startTime = this.fh.getValue("start_time");
        cmd.endTime = this.fh.getValue("end_time");
        cmd.bookingDetailDto = bookingDetails;
        cmd.roomId = this.fh.getValue("roomId");
        if (this.fh.getValue("markAsClosed")) {
          cmd.bookingType = BookingType.Closed;
        }

        this.bookingClient.create(cmd).subscribe(
          (result) => {
            this.toastService.add({
              severity: "success",
              detail: `Booking created successfully.`,
              summary: `Booking created successfully.`,
            });
            this.onClose.next(true);
          },
          (error) => {
            let errors = JSON.parse(error.response);
            this.toastService.add({
              severity: "error",
              summary: `${errors.title}`,
              detail: `${JSON.stringify(errors.errors)}`,
            });
          }
        );
      }
      this.bsModalRef.hide();
    }
  }
}
