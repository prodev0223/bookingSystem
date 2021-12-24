import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Injectable({
  providedIn: "root",
})
export class SweetAlertService {
  constructor() {}

  ConfirmDelete(title: string, message: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      Swal.fire({
        title: title,
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result: { value: any }) => {
        if (result.value) {
          observer.next(true);
        }
      });
    });
  }

  ConfirmDialogue(
    message: string,
    title: string = "Not able to recover"
  ): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      Swal.fire({
        title: title,
        text: message,
        icon: "warning",
        confirmButton: "btn btn-danger",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result: { value: any }) => {
        if (result.value) {
          observer.next(true);
        }
      });
    });
  }
}
