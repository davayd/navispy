import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CarMotionBreakdown } from 'src/app/core/models/car';

@Component({
  selector: "app-car-action-history",
  templateUrl: "car-action-history.component.html",
  styleUrls: ["car-action-history.component.scss"]
})
export class CarActionHistoryComponent {
  @Input() carActionHistory: CarMotionBreakdown[];
  @Input() loadingPath: boolean = false;
  @Input() activeCarActionId: number;
  @Output() onBuildRoute = new EventEmitter<CarMotionBreakdown>();

  constructor() {

  }

  buildRoute(action: CarMotionBreakdown) {
    this.onBuildRoute.emit(action);
  }
}