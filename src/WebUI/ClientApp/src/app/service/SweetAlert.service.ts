import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class SweetAlertService {
  constructor() {}

  ConfirmDelete(message: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      Swal.fire({
        title: "Not able to recover",
        text: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
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
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          observer.next(true);
        }
      });
    });
  }
}
