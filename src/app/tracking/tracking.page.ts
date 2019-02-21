import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Platform, MenuController } from "@ionic/angular";
import { TrackerService } from "../core/services/tracker.service";
import { Car, CarInfo } from "../core/models/car";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.page.html",
  styleUrls: ["./tracking.page.scss"]
})
export class TrackingPage implements OnInit {
  car: Car;
  carInfo: CarInfo;
  defaultHref = "";
  mapContainerHeight = 300;
  segmentSpecification = "history";
  segmentHistory = "basket";

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private trackerService: TrackerService,
    private menu: MenuController
  ) {
    this.mapContainerHeight = this.platform.height() * 0.4;
    this.menu.enable(false);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    const carId = Number.parseInt(
      this.route.snapshot.paramMap.get("carId"),
      10
    );
    this.trackerService.getCar(carId).subscribe(car => {
      this.car = car;
      console.log(car);
    });
    this.trackerService.getCarInfo(carId).subscribe(info => {
      this.carInfo = info;
    });
  }

  toggleSection(section: string) {
    this.carInfo[section].open = !this.carInfo[section].open;
  }
}
