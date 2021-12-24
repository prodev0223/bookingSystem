import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { ToastService } from "./service/toast.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [MessageService],
})
export class AppComponent {
  constructor(
    private toastService: ToastService,
    private messageService: MessageService
  ) {
    this.toastService.onShowToast.subscribe((value) => {
      this.messageService.add(value);
    });
  }

  title = "app";

  testMessage() {
    this.messageService.add({
      severity: "success",
      summary: `User role created successfully.`,
      detail: `User role created successfully.`,
    });
  }
}
