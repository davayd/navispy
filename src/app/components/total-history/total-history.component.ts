import { Component, Input, OnInit } from "@angular/core";
import { CarMotionTotals } from "src/app/core/models/car";
import * as moment from "moment";

@Component({
  selector: "app-total-history",
  templateUrl: "total-history.component.html",
  styleUrls: ["total-history.component.scss"]
})
export class CarTotalHistoryComponent implements OnInit {
  timeDriveHours: number;
  timeDriveMinutes: number;

  timeParkingHours: number;
  timeParkingMinutes: number;

  @Input() carMotionTotals: CarMotionTotals;

  constructor() {}

  ngOnInit() {
    const momentjs = moment("2000-01-01 00:00:00");

    this.timeDriveHours = momentjs
      .millisecond(this.carMotionTotals.driveTime)
      .hours();
    this.timeDriveMinutes = momentjs
      .millisecond(this.carMotionTotals.driveTime)
      .minutes();

    this.timeParkingHours = momentjs
      .millisecond(this.carMotionTotals.parkingTime)
      .hours();
    this.timeParkingMinutes = momentjs
      .millisecond(this.carMotionTotals.parkingTime)
      .minutes();
  }
}
