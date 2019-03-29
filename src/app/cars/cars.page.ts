import { Component, OnInit, OnDestroy } from "@angular/core";
import { Car } from "../core/models/car";
import { TrackerService, KEY_LOGIN, KEY_PASSWORD } from "../core/services/tracker.service";
import { Router, NavigationExtras } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Platform, MenuController } from "@ionic/angular";

@Component({
  selector: "app-cars",
  templateUrl: "cars.page.html",
  styleUrls: ["cars.page.scss"]
})
export class CarsPage implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  cars: Car[] = [];
  carsFilter: any = { name: "" };
  loading = false;
  isError = false;

  login: string;
  password: string;

  constructor(
    private trackerService: TrackerService,
    private router: Router,
    private platform: Platform,
    private menu: MenuController
  ) {
    this.backButtonEvent();
  }

  ionViewWillEnter() {
    this.menu.get().then((menu: HTMLIonMenuElement) => {
      menu.swipeGesture = true;
    });
    this.login = localStorage.getItem(KEY_LOGIN);
    this.password = localStorage.getItem(KEY_PASSWORD);

    if (!this.login || !this.password) {
      this.router.navigate(["/login"]);
    } else {
      this.getCars();
    }
  }

  async ngOnInit() {
    await this.platform.ready();
  }

  getCars() {
    this.loading = true;
    this.isError = false;

    this.trackerService
      .getCars(this.login, this.password)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        cars => {
          this.cars = cars;
          this.loading = false;
        },
        error => {
          this.isError = true;
          this.loading = false;
        }
      );
  }

  navigate(car: Car) {
    const navigationExtras: NavigationExtras = {
      queryParams: { name: car.name }
    };

    this.router.navigate(["/track", car.id], navigationExtras);
  }

  report(car: Car, event: MouseEvent) {
    event.stopPropagation();
    const navigationExtras: NavigationExtras = {
      queryParams: { name: car.name }
    };
    this.router.navigate(["/report", car.id], navigationExtras);
  }

  private backButtonEvent() {
    this.platform.backButton
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        navigator["app"].exitApp();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
