import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { TrackerService } from "../core/services/tracker.service";
import { Car, CarInfo } from "../core/models/car";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.page.html",
  styleUrls: ["./tracking.page.scss"]
})
export class TrackingPage implements OnInit {
  private unsubscribe$ = new Subject<void>();

  car: Car;
  carInfo: CarInfo;
  defaultHref = "cars";
  segmentSpecification = "history";
  segmentHistory = "basket";

  constructor(
    private route: ActivatedRoute,
    private trackerService: TrackerService,
    private menu: MenuController
  ) {
    // tslint:disable-next-line:no-shadowed-variable
    this.menu.get().then((menu: HTMLIonMenuElement) => {
      menu.swipeGesture = false;
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    const carId = Number.parseInt(
      this.route.snapshot.paramMap.get("carId"),
      10
    );
    this.trackerService
      .getCar(carId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(car => {
        this.car = car;
      });
    this.trackerService
      .getCarInfo(carId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => {
        this.carInfo = info;
      });
  }

  toggleSection(section: string) {
    this.carInfo[section].open = !this.carInfo[section].open;
  }

  ionViewWillLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
