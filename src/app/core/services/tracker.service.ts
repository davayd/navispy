import { Injectable } from "@angular/core";

import { Observable, from, of } from "rxjs";

import { CarInfo, Car, CarMotionBreakdown, CarTrack } from "./../models/car";
import { HTTP } from "@ionic-native/http/ngx";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TrackerService {
  daysOfYear: string[] = [];
  apiUrl = " http://www.navispy.com";

  constructor(private http: HTTP) {
    this.generateDates();
  }

  login(userName: string, password: string): Observable<Car[] | any> {
    return from(
      this.http.get(
        this.apiUrl +
          `/php/android_test.php?userName=${userName}&password=${password}`,
        {},
        {}
      )
    ).pipe(map(res => JSON.parse(res.data)));
  }

  getCars(userName: string, password: string): Observable<Car[]> {
    return from(
      this.http.get(
        this.apiUrl +
          `/php/android_test.php?userName=${userName}&password=${password}`,
        {},
        {}
      )
    ).pipe(map(res => JSON.parse(res.data)));
  }

  getCar(id: number): Observable<CarInfo> {
    return from(
      this.http.get(
        this.apiUrl + "/php/android_get_dev_stat.php?deviceID=" + id,
        {},
        {}
      )
    ).pipe(map(res => JSON.parse(res.data)[0]));
  }

  getCarMotionBreakdown(
    carId: number,
    date: string
  ): Observable<CarMotionBreakdown[]> {
    return from(
      this.http.get(
        this.apiUrl +
          "/php/api/get_json_motion_breakdown.php?extended=deviceID=" +
          carId +
          "&from=" +
          date +
          "&to=" +
          date,
        {},
        {}
      )
    ).pipe(map(res => JSON.parse(res.data)));
  }

  getCarTrack(carId: number, startDate: string, finishDate: string): Observable<CarTrack> {
    const dateTimeStart = startDate.split(" ");
    const dateTimeFinish = finishDate.split(" ");
    return from(
      this.http.get(
        this.apiUrl +
          "/php/get_json_positions.php?calcTime=1&id=" +
          carId +
          "&dateFrom=" +
          dateTimeStart[0] + // YYYY-MM-DD
          "&timeFrom=" +
          dateTimeStart[1] + // HH:mm:ss
          "&dateTo=" +
          dateTimeFinish[0] + // YYYY-MM-DD
          "&timeTo=" +
          dateTimeFinish[1], // HH:mm:ss
        {},
        {}
      )
    ).pipe(map(res => JSON.parse(res.data)));
  }

  private generateDates() {
    const now = new Date();
    for (const d = new Date(2018, 1, 1); d <= now; d.setDate(d.getDate() + 1)) {
      this.daysOfYear.push(`${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`);
    }
  }
}
