import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuController, Platform } from "@ionic/angular";
import { TrackerService } from "../core/services/tracker.service";
import {
  CarInfo,
  CarMotionBreakdown,
  CarMotionTotals
} from "../core/models/car";
import { Subject, Subscription, timer } from "rxjs";
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  ILatLng,
  Polyline
} from "@ionic-native/google-maps";
import { DatePicker } from "@ionic-native/date-picker/ngx";
import { takeUntil, switchMap } from "rxjs/operators";
import * as moment from "moment";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.page.html",
  styleUrls: ["./tracking.page.scss"]
})
export class TrackingPage implements OnInit {
  private unsubscribe$ = new Subject<void>();
  private timerSub: Subscription;

  carInfo: CarInfo;
  carId: number;
  carName: string;
  activeTab = "info";
  map: GoogleMap;
  carMarker: Marker;
  carMotionParts: CarMotionBreakdown[];
  carMotionTotals: CarMotionTotals = {};
  moment: moment.Moment;
  currentDate: Date;
  isFollowCar = true;

  loading_Path = false; // загрузка построения пути на карте
  loading_Info = false; // загрузка всех данных при входе на страницу
  isError_Info = false; // ошибка загрузки информации по машине
  loading_MotionHistory = false; // загрузка истории передвижений
  isError_MotionHistory = false; // ошибка загрузки истории движения

  // ROUTES
  carAction: Marker | Polyline;
  activeCarActionId: number;

  constructor(
    private route: ActivatedRoute,
    private trackerService: TrackerService,
    private menu: MenuController,
    private platform: Platform,
    private datePicker: DatePicker,
    private router: Router
  ) {
    // tslint:disable-next-line:no-shadowed-variable
    this.menu.get().then((menu: HTMLIonMenuElement) => {
      menu.swipeGesture = false;
    });
    this.carInfo = {
      params: [],
      latitude: 0,
      longitude: 0,
      course: 0,
      other: {
        open: false
      }
    };
    this.moment = moment();
    this.currentDate = new Date();
    this.backButtonEvent();
  }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await setTimeout(() => this.loadMap(), 500);
  }

  ionViewWillEnter() {
    this.carId = +this.route.snapshot.paramMap.get("carId");
    this.carName = this.route.snapshot.queryParamMap.get("name");

    this.getCarDetails();
    this.getMotionHistory(this.moment.format("DD-MM-YYYY"));
  }

  getCarDetails() {
    this.isError_Info = false;
    this.loading_Info = true;
    const carInfoPolled$ = timer(2000, 10000).pipe(
      switchMap(() => this.trackerService.getCar(this.carId))
    );
    this.timerSub = carInfoPolled$.subscribe(
      res => {
        this.loading_Info = false;
        console.log(res);
        if (this.carInfo.other.open) {
          res.other.open = true;
        } else {
          res.other.open = false;
        }
        Object.assign(this.carInfo, res);
        this.updateMap(this.carInfo);
      },
      error => {
        this.isError_Info = true;
        this.loading_Info = false;
        this.timerSub.unsubscribe();
      }
    );
  }

  getMotionHistory(date: any) {
    this.carMotionParts = [];
    this.carMotionTotals = null;
    this.loading_MotionHistory = true;
    this.isError_MotionHistory = false;
    this.trackerService
      .getCarMotionHistory(this.carId, date)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        history => {
          console.log("history", history);
          this.carMotionTotals = {
            mileage: history.mileageTotal,
            driveTime: history.driveTimeTotal,
            parkingTime: history.parkingTimeTotal
          };
          this.carMotionParts = history.breakdown;
          this.loading_MotionHistory = false;
        },
        error => {
          this.loading_MotionHistory = false;
          this.isError_MotionHistory = true;
        }
      );
  }

  selectDate() {
    this.datePicker
      .show({
        date: this.currentDate,
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
      })
      .then(
        date => {
          this.removeObjects();
          this.animateCamera({
            lat: +this.carInfo.latitude,
            lng: +this.carInfo.longitude
          });
          this.currentDate = date;
          const formatDate = moment(date).format("DD-MM-YYYY");
          this.getMotionHistory(formatDate);
        },
        err => console.log("Error occurred while getting date: ", err)
      );
  }

  followCar() {
    this.isFollowCar = !this.isFollowCar;
    if (this.isFollowCar && this.carInfo) {
      this.animateCamera({
        lat: +this.carInfo.latitude,
        lng: +this.carInfo.longitude
      });
    }
  }

  toggleSection() {
    this.carInfo.other.open = !this.carInfo.other.open;
  }

  ionViewWillLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.timerSub.unsubscribe();
    this.carInfo = {};
    this.trackerService.initCar = null;
  }

  loadMap() {
    this.map = GoogleMaps.create("map_canvas", {
      camera: {
        zoom: 18,
        target: { lat: 53.901792, lng: 27.548565 }
      }
    });

    this.carMarker = this.map.addMarkerSync({
      position: {
        lat: +this.carInfo.latitude,
        lng: +this.carInfo.longitude
      },
      id: this.carId,
      icon: {
        url: "assets/img/arrow.png",
        size: {
          width: 20,
          height: 30
        }
      },
      rotation: this.carInfo.course
    });
  }

  updateMap(carInfo: CarInfo) {
    if (this.map) {
      if (this.isFollowCar) {
        this.animateCamera({
          lat: +carInfo.latitude,
          lng: +carInfo.longitude
        });
      }

      if (this.carMarker) {
        this.carMarker.setPosition({
          lat: +carInfo.latitude,
          lng: +carInfo.longitude
        });
        this.carMarker.setRotation(carInfo.course);
      }
    }
  }

  buildRoute(action: CarMotionBreakdown) {
    if (!this.loading_Path) {
      // active/inactive parts
      if (this.activeCarActionId === action.ID) {
        this.activeCarActionId = null;
        this.removeObjects();
        this.animateCamera({
          lat: +this.carInfo.latitude,
          lng: +this.carInfo.longitude
        });
        this.isFollowCar = true;
        return;
      } else {
        this.activeCarActionId = action.ID;
      }
      this.loading_Path = true;
      // disable follow
      this.isFollowCar = false;
      this.removeObjects();
      // drawing marker or polyline + focus camera
      if (action.motion === "P") {
        const position = { lat: +action.latStart, lng: +action.lonStart };
        this.map
          .addMarker({
            position: position,
            icon: {
              url: "assets/img/parking-marker.png",
              size: {
                width: 40,
                height: 40
              }
            }
          })
          .then(marker => {
            this.carAction = marker;
            this.animateCamera(position);
            this.loading_Path = false;
          });
      } else if (action.motion === "") {
        this.trackerService
          .getCarTrack(this.carId, action.timeStart, action.timeFinish)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(result => {
            const routeValues = Object.values(result.route);
            const routeCoords: ILatLng[] = routeValues.map(routePart => {
              return { lat: routePart.latitude, lng: routePart.longitude };
            });
            console.log(routeCoords);

            this.map
              .addPolyline({
                color: "#00C853",
                width: 5,
                points: routeCoords
              })
              .then(polyline => {
                this.carAction = polyline;
                this.animateCamera(routeCoords);
                this.loading_Path = false;
              });
          });
      }
    }
  }

  private removeObjects() {
    if (this.carAction) {
      this.carAction.remove();
    }
  }

  private backButtonEvent() {
    this.platform.backButton
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigate(["/cars"]);
      });
  }

  private animateCamera(target: any) {
    this.map.animateCamera({
      target: target,
      duration: 500
    });
  }
}
