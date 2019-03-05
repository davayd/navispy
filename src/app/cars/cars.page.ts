import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { Car } from "../core/models/car";
import { TrackerService } from "../core/services/tracker.service";
import { Router, NavigationExtras } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-cars",
  templateUrl: "cars.page.html",
  styleUrls: ["cars.page.scss"]
})
export class CarsPage implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  cars: Car[] = [];
  constructor(
    private trackerService: TrackerService,
    private router: Router,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.platform.ready();
  }

  ngAfterViewInit() {
    const login = localStorage.getItem("login");
    const password = localStorage.getItem("password");

    if (!login || !password) {
      this.router.navigate(["/login"]);
    } else {
      this.trackerService
        .getCars(login, password)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(cars => {
          this.cars = cars;
        });
    }
  }

  navigate(car: Car) {
    const navigationExtras: NavigationExtras = {
      queryParams: { name: car.name }
    };

    this.router.navigate(["/track", car.id], navigationExtras);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
