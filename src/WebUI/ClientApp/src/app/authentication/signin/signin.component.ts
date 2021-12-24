import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/service/auth.service";
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = "";
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["administrator@localhost", Validators.required],
      password: ["Administrator1!", Validators.required],
      rememberMe: [true],
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.error = "";
    if (this.loginForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    } else {
      this.authService
        .login(
          this.f.username.value,
          this.f.password.value,
          this.f.rememberMe.value
        )
        .subscribe((result) => {
          if (result) {
            const token = this.authService.currentUserValue.token;
            if (token) {
              // this.router.navigate(["/dashboard/main"]);
              this.router.navigate(["/roomreservation"]);
            }
          } else {
            this.error = "Invalid Login";
          }
        });
    }
  }
}
