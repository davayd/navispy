import { Component, OnInit } from "@angular/core";
import { Car } from "../core/models/car";
import { TrackerService } from "../core/services/tracker.service";

@Component({
  selector: "app-cars",
  templateUrl: "cars.page.html",
  styleUrls: ["cars.page.scss"]
})
export class CarsPage implements OnInit {
  cars: Car[] = [];
  constructor(
    private trackerService: TrackerService,
  ) {
  }

  ngOnInit() {
    this.trackerService.getCars().subscribe(cars => {
      this.cars = cars;
    });
  }
}
