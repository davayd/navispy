import { Component, OnInit, OnDestroy } from "@angular/core";
import { TrackerService } from "../core/services/tracker.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Platform, Events } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit, OnDestroy {
  valueChanges$: Subscription;
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  error = null;

  constructor(
    private trackerService: TrackerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private platform: Platform,
    private events: Events
  ) {
    this.backButtonEvent();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.valueChanges$ = this.loginForm.valueChanges.subscribe(values => {
      this.error = null;
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // this.loading = true;
    this.trackerService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data.error) {
            this.error = "Неверные данные";
          } else {
            localStorage.setItem("auth", "true");
            localStorage.setItem("login", this.f.username.value);
            localStorage.setItem("password", this.f.password.value);
            this.router.navigate(["/cars"]);
            this.events.publish('user:login');
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  private backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      navigator["app"].exitApp();
    });
  }

  ngOnDestroy() {}
}
