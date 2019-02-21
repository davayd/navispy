import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";

import { Car, CarInfo } from "./../models/car";
import { CARS } from "./mock-cars";
import { CARINFO } from "./mock-info";

@Injectable({
  providedIn: "root"
})
export class TrackerService {
  constructor() {}

  getCars(): Observable<Car[]> {
    return of(CARS);
  }

  getCar(id: number): Observable<Car> {
    return of(CARS.find(car => car.id === id));
  }

  getCarInfo(id: number): Observable<CarInfo> {
    return of(CARINFO.find(car => car.carId === id));
  }
}
