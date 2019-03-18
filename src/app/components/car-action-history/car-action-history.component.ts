import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CarMotionBreakdown } from "src/app/core/models/car";
import * as moment from "moment";

@Component({
  selector: "app-car-action-history",
  templateUrl: "car-action-history.component.html",
  styleUrls: ["car-action-history.component.scss"]
})
export class CarActionHistoryComponent {
  @Input() carActionHistory: CarMotionBreakdown[];
  @Input() loadingPath = false;
  @Input() activeCarActionId: number;
  @Output() onBuildRoute = new EventEmitter<CarMotionBreakdown>();

  constructor() {}

  driveTimeHours(time: number) {
    return moment("2000-01-01 00:00:00")
      .millisecond(time)
      .hours();
  }

  driveTimeMinutes(time: number) {
    return moment("2000-01-01 00:00:00")
      .millisecond(time)
      .minutes();
  }

  buildRoute(action: CarMotionBreakdown) {
    this.onBuildRoute.emit(action);
  }
}
