import { Component, OnInit } from "@angular/core";
import { Car } from "../core/models/car";
import { TrackerService } from "../core/services/tracker.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  cars: Car[] = [];
  constructor(private trackerService: TrackerService) {}

  ngOnInit() {
    this.trackerService.getCars().subscribe(cars => {
      this.cars = cars;
    });
  }
}
