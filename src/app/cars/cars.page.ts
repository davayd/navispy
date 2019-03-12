import { Component, OnInit, OnDestroy } from "@angular/core";
import { Car } from "../core/models/car";
import { TrackerService } from "../core/services/tracker.service";
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
    this.init();
  }

  async ngOnInit() {
    await this.platform.ready();
  }

  private init() {
    const login = localStorage.getItem("login");
    const password = localStorage.getItem("password");

    if (!login || !password) {
      this.router.navigate(["/login"]);
    } else {
      this.loading = true;
      this.trackerService
        .getCars(login, password)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(cars => {
          this.cars = cars;
          this.loading = false;
        });
    }
  }

  navigate(car: Car) {
    const navigationExtras: NavigationExtras = {
      queryParams: { name: car.name }
    };

    this.router.navigate(["/track", car.id], navigationExtras);
  }

  private backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      navigator["app"].exitApp();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
