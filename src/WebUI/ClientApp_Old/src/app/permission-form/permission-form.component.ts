import { Component, OnInit } from '@angular/core';
import { PermissionSet, UserPermissionClient } from '../web-api-client';
import {ToastService} from "../service/toast.service";

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css']
})
export class PermissionFormComponent implements OnInit {

  constructor(private userPermissionClient: UserPermissionClient, private toastService: ToastService) { }

    list1: any[];

    list2: any[];

    ngOnInit() {
      this.userPermissionClient.getPermissionNameList().subscribe(

            result => {
              this.list1 = result;
            },
            error => {
              //this.submitButtonDisabled = false;
              console.log(error.response);

              let errors = JSON.parse(error.response);
              this.toastService.add(
                {
                  severity: 'error',
                  summary: `${errors.title}`,
                  detail: `${JSON.stringify(errors.errors)}`,
                }
              )
            }
          );

        this.list1 = ["asdf"];
        this.list2 = ["asdf2"];
    }

}
