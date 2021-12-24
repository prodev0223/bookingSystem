import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AddTimeToDate } from "src/app/common/CommonFunctions";
import { FormHelper, ValueType } from "src/app/common/FormHelper";
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
} from "src/app/common/web-api-client";
import { PermissionsService } from "src/app/core/service/permissions.service";
import { APIResponse, ErrorResponse } from "src/app/models/APIResponse";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-MyBookings",
  templateUrl: "./MyBookings.component.html",
  styleUrls: ["./MyBookings.component.sass"],
})
export class MyBookingsComponent implements OnInit {
  fh: FormHelper;
  IsCheckAll: false;
  showCancel = false;
  selected = [];
  filteredData = [];
  roomForm!: FormGroup;
  lastModifyDate: Date;
  bookingId: number = -1;
  ColumnMode = ColumnMode;
  formCaption = "New Room";
  roomModalRef?: BsModalRef;
  roomsList: Array<any> = [];
  columns = [
    { name: "roomName" },
    { name: "start" },
    { name: "end" },
    { name: "bookingStatus" },
    { name: "description" },
  ];
  dt_datas: Array<any> = [];
  SelectionType = SelectionType;
  roomExtraFields: Array<any> = [];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    public roomClient: RoomClient,
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    private bookingClient: BookingClient,
    private sweetAlert: SweetAlertService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit() {
    this.getAllRooms();
    this.GetBookingList();
    this.CreateBookingForm();
    this.fh = new FormHelper(this.roomForm);
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  filterDatatable(event) {
    const all_columns = this.columns;
    // get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable

    this.dt_datas = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (
          item[all_columns[i].name].toString().toLowerCase().indexOf(val) !==
            -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  GetBookingList() {
    this.bookingClient.getMyRawBooking(0).subscribe(
      (result: any) => {
        this.selected = [];
        this.dt_datas = [];
        if (result && Array.isArray(result)) {
          result.forEach((item) => {
            this.dt_datas.push({
              id: item.id,
              end: item.end,
              start: item.start,
              roomName: item.room?.name,
              description: item.bookingDetails?.description,
              bookingStatus: this.GetBookingStatus(item.bookingStatus),
            });
          });
        }
        this.filteredData = this.dt_datas;
      },
      (error) => console.error(error)
    );
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
              this.GetBookingList();
              this.roomModalRef.hide();
              this.snackbar.showNotification(
                "success",
                "Booking cancel successfully"
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

  BulkCancelBookings() {
    var lstSelected: Array<number> = [];
    lstSelected = this.selected.map((item) => item.id);

    if (lstSelected.length > 0) {
      this.sweetAlert
        .ConfirmDialogue("`Are you sure to delete selected room groups ?`")
        .subscribe((result) => {
          if (result) {
            this.bookingClient.cancelBookings(lstSelected).subscribe(
              (result) => {
                this.GetBookingList();
                this.roomModalRef.hide();
                this.snackbar.showNotification(
                  "success",
                  "Selected Booking cancelled successfully"
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
    this.formCaption = "Edit Booking: " + itemData?.description ?? "";

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

          this.AddNewBooking(template, false);
        },
        (error) => console.error(error)
      );
    }
  }

  DeleteBooking(itemData: any) {
    this.sweetAlert
      .ConfirmDelete(`Are you sure to delete Booking : ${itemData.description}`)
      .subscribe((result) => {
        if (result) {
          this.DeleteBookingById(itemData);
        }
      });
  }

  DeleteBookingById(itemData: any) {
    this.roomClient.deleteBooking(itemData.id).subscribe((res) => {
      this.GetBookingList();
      this.snackbar.showNotification("success", "Booking deleted successfully");
    });
  }

  BulkDeleteBookings() {
    var lstSelected: Array<number> = [];
    lstSelected = this.selected.map((item) => item.id);

    if (lstSelected.length > 0) {
      this.sweetAlert
        .ConfirmDelete(`Are you sure to delete selected Bookings ?`)
        .subscribe((result) => {
          if (result) {
            this.roomClient.deleteBookings(lstSelected).subscribe((res) => {
              this.GetBookingList();
              this.snackbar.showNotification(
                "success",
                "Selected Booking groups deleted successfully"
              );
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
          (resp: APIResponse) => {
            if (resp) {
              if (resp.success) {
                this.GetBookingList();
                this.snackbar.showNotification(
                  "success",
                  "Booking updated successfully"
                );
              } else {
                this.snackbar.showNotification("error", resp.message);
              }
            }
          },
          (error) => {
            let errorResponse: ErrorResponse = JSON.parse(error.response);
            if (errorResponse) {
              this.snackbar.showNotification(
                "error",
                `${JSON.stringify(errorResponse.errors)}`
              );
            }
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
          (resp: APIResponse) => {
            if (resp) {
              if (resp.success) {
                this.GetBookingList();
                this.snackbar.showNotification(
                  "success",
                  "Booking updated successfully"
                );
              } else {
                this.snackbar.showNotification("error", resp.message);
              }
            }
          },
          (error) => {
            let errorResponse: ErrorResponse = JSON.parse(error.response);
            if (errorResponse) {
              this.snackbar.showNotification(
                "error",
                `${JSON.stringify(errorResponse.errors)}`
              );
            }
          }
        );
      }
      this.roomModalRef.hide();
    }
  }
}
