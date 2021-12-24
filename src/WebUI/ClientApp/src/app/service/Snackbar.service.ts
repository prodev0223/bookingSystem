import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  placementFrom: MatSnackBarVerticalPosition = "top";
  placementAlign: MatSnackBarHorizontalPosition = "right";
  constructor(private snackBar: MatSnackBar) {}

  private error(message: string) {
    return this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: ["error-snackbar"],
      verticalPosition: this.placementFrom,
      horizontalPosition: this.placementAlign,
    });
  }

  private success(message: string) {
    return this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: ["success-snackbar"],
      verticalPosition: this.placementFrom,
      horizontalPosition: this.placementAlign,
    });
  }

  private info(message: string) {
    return this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: ["snackbar-info"],
      verticalPosition: this.placementFrom,
      horizontalPosition: this.placementAlign,
    });
  }

  showNotification(severity: string, detail: string) {
    switch (severity) {
      case "success":
        this.success(detail);
        break;
      case "error":
        this.error(detail);
        break;
      default:
        this.info(detail);
        break;
    }
  }
}
