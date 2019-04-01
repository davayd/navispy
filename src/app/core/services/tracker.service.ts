import { Injectable } from "@angular/core";

import { Observable, from } from "rxjs";

import { CarInfo, Car, CarTrack, CarMotionHistory } from "./../models/car";
import { HTTP } from "@ionic-native/http/ngx";
import { map, catchError } from "rxjs/operators";
import { ErrorsHandler } from "../errors/errors-handler/errors-handler.service";

export const KEY_LOGIN = "login";
export const KEY_PASSWORD = "password";
export const KEY_ISAUTH = "auth";

@Injectable({
  providedIn: "root"
})
export class TrackerService {
  apiUrl = "http://www.navispy.com";
  initCar: CarInfo = null;

  constructor(private http: HTTP, private errorsHandler: ErrorsHandler) {}

  login(userName: string, password: string): Observable<Car[] | any> {
    return from(
      this.http.get(
        this.apiUrl +
          `/php/android_test.php?userName=${userName}&password=${password}`,
        {},
        {}
      )
    ).pipe(
      map(res => JSON.parse(res.data)),
      catchError(error => this.errorsHandler.handleError(error))
    );
  }

  logout() {
    localStorage.setItem(KEY_ISAUTH, "false");
    localStorage.setItem(KEY_LOGIN, null);
    localStorage.setItem(KEY_PASSWORD, null);
    this.initCar = null;
  }

  getCars(userName: string, password: string): Observable<Car[]> {
    return from(
      this.http.get(
        this.apiUrl +
          `/php/android_test.php?userName=${userName}&password=${password}`,
        {},
        {}
      )
    ).pipe(
      map(res => JSON.parse(res.data)),
      catchError(error => this.errorsHandler.handleError(error))
    );
  }

  getCar(id: number): Observable<CarInfo> {
    return from(
      this.http.get(
        this.apiUrl + "/php/android_get_dev_stat.php?extended=1&deviceID=" + id,
        {},
        {}
      )
    ).pipe(
      map(res => {
        const response = JSON.parse(res.data);
        const carDetails: CarInfo = { params: [] };
        Object.keys(response).forEach(key => {
          switch (key) {
            case "other":
              carDetails.other = response[key];
              break;
            case "address":
              carDetails.address = response[key];
              break;
            case "time":
              carDetails.time = response[key];
              break;
            case "_latitude":
              carDetails.latitude = response[key].displayValue;
              carDetails.params.push({ ...response[key], key: key });
              break;
            case "_longitude":
              carDetails.longitude = response[key].displayValue;
              carDetails.params.push({ ...response[key], key: key });
              break;
            case "_course":
              carDetails.course = +response[key].displayValue;
              carDetails.params.push({ ...response[key], key: key });
              break;
            default:
              carDetails.params.push({ ...response[key], key: key });
              break;
          }
        });
        if (!this.initCar) {
          this.initCar = {};
          Object.assign(this.initCar, carDetails);
          return this.initCar;
        } else {
          this.initCar.address = carDetails.address;
          this.initCar.course = carDetails.course;
          this.initCar.latitude = carDetails.latitude;
          this.initCar.longitude = carDetails.longitude;
          this.initCar.time = carDetails.time;
          this.initCar.other = carDetails.other;
          carDetails.params.forEach(param => {
            const index = this.initCar.params.findIndex(
              p => p.key === param.key
            );
            if (index >= 0) {
              this.initCar.params[index].displayValue = param.displayValue;
            } else {
              this.initCar.params.push(param);
            }
          });
        }

        return this.initCar;
      }),
      catchError(error => this.errorsHandler.handleError(error))
    );
  }

  getCarMotionHistory(
    carId: number,
    date: string
  ): Observable<CarMotionHistory> {
    return from(
      this.http.get(
        this.apiUrl +
          "/php/api/get_json_motion_breakdown.php?extended=1&deviceID=" +
          carId +
          "&from=" +
          date +
          "&to=" +
          date,
        {},
        {}
      )
    ).pipe(
      map(res => JSON.parse(res.data)),
      catchError(error => this.errorsHandler.handleError(error))
    );
  }

  getCarTrack(
    carId: number,
    startDate: string,
    finishDate: string
  ): Observable<CarTrack> {
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
    ).pipe(
      map(res => JSON.parse(res.data)),
      catchError(error => this.errorsHandler.handleError(error))
    );
  }
}
