import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CommonConfig } from "src/app/common/CommonConfig";
import { AddTimeToDate } from "src/app/common/CommonFunctions";
import { FormHelper, ValueType } from "src/app/common/FormHelper";
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
  selector: "app-MyBookings",
  templateUrl: "./MyBookings.component.html",
  styleUrls: ["./MyBookings.component.css"],
})
export class MyBookingsComponent implements OnInit {
  fh: FormHelper;
  IsCheckAll: false;
  showCancel = false;
  roomForm!: FormGroup;
  lastModifyDate: Date;
  bookingId: number = -1;
  formCaption = "New Room";
  roomModalRef?: BsModalRef;
  roomsList: Array<any> = [];
  dt_datas: Array<Booking> = [];
  roomExtraFields: Array<any> = [];

  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(
    public roomClient: RoomClient,
    private toastService: ToastService,
    private modalService: BsModalService,
    private bookingClient: BookingClient,
    private sweetAlert: SweetAlertService,
    private permissionsService: PermissionsService
  ) {
    this.dtOptions = CommonConfig.getDataTableSettings();
    this.dtOptions.order = [[2, "desc"]];
    this.dtOptions.columnDefs = [{ orderable: false, targets: [0, -1] }];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.getAllRooms();
    this.CreateBookingForm();
    this.GetBookingList(false);
    this.fh = new FormHelper(this.roomForm);
  }

  GetBookingList(isReRender: boolean = true) {
    this.bookingClient.getMyRawBooking(0).subscribe(
      (result: any) => {
        this.dt_datas = result;
        if (isReRender) {
          this.ReRenderDatatable();
        } else {
          this.dtTrigger.next();
        }
      },
      (error) => console.error(error)
    );
  }

  ReRenderDatatable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  checkAll() {
    this.dt_datas.forEach((element) => {
      element.isChecked = this.IsCheckAll;
    });
  }

  getAllRooms() {
    this.roomClient.getFullList().subscribe(
      (result) => {
        result.forEach((element: any) => {
          this.roomsList.push({
            id: element.id,
            name: element.name,
          });
        });
      },
      (error) => console.error(error)
    );
  }

  GetBookingStatus(bookingId: number) {
    return BookingStatus[bookingId];
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
                summary: `Booking cancel successfully.`,
                detail: `Booking cancel successfully.`,
              });
              this.GetBookingList();
              this.roomModalRef.hide();
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

  BulkCancelBookings() {
    var lstSelected: Array<number> = [];
    this.dt_datas.forEach((item: any) => {
      if (item?.isChecked == true) {
        lstSelected.push(Number(item.id));
      }
    });

    if (lstSelected.length > 0) {
      this.sweetAlert
        .ConfirmDialogue("`Are you sure to delete selected room groups ?`")
        .subscribe((result) => {
          if (result) {
            this.bookingClient.cancelBookings(lstSelected).subscribe(
              (result) => {
                this.toastService.add({
                  severity: "success",
                  summary: `Booking cancel successfully.`,
                  detail: `Selected Booking cancelled successfully`,
                });
                this.GetBookingList();
                this.roomModalRef.hide();
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

    this.IsCheckAll = false;
  }

  AddNewBooking(template: TemplateRef<any>, resetModal: boolean = true) {
    if (resetModal) {
      this.bookingId = 0;
      this.roomForm.reset();
      this.formCaption = "New Booking";
    }

    this.fh.getValue("bookingId", this.bookingId);
    this.roomModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }

  EditBooking(itemData: any, template: TemplateRef<any>) {
    this.roomForm.reset();
    this.showCancel = false;
    this.bookingId = Number(itemData.id);
    this.fh.setValue("bookingId", Number(this.bookingId));
    this.formCaption =
      "Edit Booking: " + itemData?.bookingDetails?.description ?? "";

    if (this.bookingId > 0) {
      this.bookingClient.getMyRawBooking(this.bookingId).subscribe(
        (result: any) => {
          console.log(result);
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

          this.AddNewBooking(template, false);
        },
        (error) => console.error(error)
      );
    }
  }

  DeleteBooking(itemData: any) {
    this.sweetAlert
      .ConfirmDelete(
        "Not able to recover",
        `Are you sure to delete Booking : ${itemData.bookingDetails.description}`
      )
      .subscribe((result) => {
        if (result) {
          this.DeleteBookingById(itemData);
        }
      });
  }

  DeleteBookingById(itemData: any) {
    this.roomClient.deleteBooking(itemData.id).subscribe((res) => {
      this.GetBookingList();
      this.toastService.add({
        severity: "success",
        summary: `Delete Booking Group`,
        detail: `Booking deleted successfully`,
      });
    });
  }

  BulkDeleteBookings() {
    var lstSelected: Array<number> = [];
    this.dt_datas.forEach((item: any) => {
      if (item?.isChecked == true) {
        lstSelected.push(Number(item.id));
      }
    });

    if (lstSelected.length > 0) {
      this.sweetAlert
        .ConfirmDelete(
          "Not able to recover",
          `Are you sure to delete selected Bookings ?`
        )
        .subscribe((result) => {
          if (result) {
            this.roomClient.deleteBookings(lstSelected).subscribe((res) => {
              this.GetBookingList();
              this.toastService.add({
                severity: "success",
                summary: `Delete Booking Groups`,
                detail: `Selected Booking groups deleted successfully`,
              });
            });
          }
        });
    }

    this.IsCheckAll = false;
  }

  BookingCancel() {
    if (this.bookingId > 0) {
      this.CancelBooking(this.bookingId);
    }
  }

  SaveBooking() {
    if (this.roomForm.valid) {
      if (this.bookingId > 0) {
        let bookingDetails = new BookingDetailDto();
        bookingDetails.description = this.fh.getValue("description");
        bookingDetails.equipmentsID = [];

        let selDate = this.fh.getValue("sel_date");
        let cmd = new UpdateSimpleBookingCommand();
        cmd.date = this.fh.getValue("sel_date", ValueType.Date);
        cmd.startTime = AddTimeToDate(
          selDate,
          this.fh.getValue("start_time", ValueType.Date)
        );
        cmd.endTime = AddTimeToDate(
          selDate,
          this.fh.getValue("end_time", ValueType.Date)
        );
        cmd.bookingDetailDto = bookingDetails;
        cmd.roomId = this.fh.getValue("roomId");
        cmd.newRoomId = this.fh.getValue("roomId");
        cmd.bookingId = this.fh.getValue("bookingId");

        if (this.fh.getValue("markAsClosed")) {
          cmd.bookingType = BookingType.Closed;
        }
        this.bookingClient.updateSimpleBooking(cmd).subscribe(
          (result) => {
            this.GetBookingList();
            this.toastService.add({
              severity: "success",
              summary: `Booking updated successfully.`,
              detail: `Booking updated successfully.`,
            });
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
      } else if (this.bookingId <= 0) {
        let bookingDetails = new BookingDetailDto();
        bookingDetails.description = this.fh.getValue("description");
        bookingDetails.equipmentsID = [];

        let selDate = this.fh.getValue("sel_date");
        let cmd = new CreateSimpleBookingCommand();
        cmd.date = this.fh.getValue("sel_date", ValueType.Date);
        cmd.startTime = AddTimeToDate(
          selDate,
          this.fh.getValue("start_time", ValueType.Date)
        );
        cmd.endTime = AddTimeToDate(
          selDate,
          this.fh.getValue("end_time", ValueType.Date)
        );
        cmd.bookingDetailDto = bookingDetails;
        cmd.roomId = this.fh.getValue("roomId");
        if (this.fh.getValue("markAsClosed")) {
          cmd.bookingType = BookingType.Closed;
        }

        this.bookingClient.create(cmd).subscribe(
          (result) => {
            this.GetBookingList();
            this.toastService.add({
              severity: "success",
              detail: `Booking created successfully.`,
              summary: `Booking created successfully.`,
            });
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
      this.roomModalRef.hide();
    }
  }
}
