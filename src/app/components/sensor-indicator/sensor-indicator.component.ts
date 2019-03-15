import { Component, Input } from "@angular/core";
import { CarInfo } from "src/app/core/models/car";

@Component({
  selector: "app-sensor-indicator",
  templateUrl: "sensor-indicator.component.html",
  styleUrls: ["sensor-indicator.component.scss"]
})
export class CarSensorIndicatorComponent {
  @Input() indicatorName: string;
  @Input() indicatorValue: string;
}
