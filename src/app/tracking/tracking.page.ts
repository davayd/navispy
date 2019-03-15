import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuController, IonSlides, Platform } from "@ionic/angular";
import { TrackerService } from "../core/services/tracker.service";
import { CarInfo, CarMotionBreakdown, CarMotionTotals } from "../core/models/car";
import { Subject, interval, Subscription } from "rxjs";
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  ILatLng,
  Polyline
} from "@ionic-native/google-maps";
import { DatePicker } from "@ionic-native/date-picker/ngx";
import { takeUntil, switchMap, startWith } from "rxjs/operators";
import * as moment from "moment";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.page.html",
  styleUrls: ["./tracking.page.scss"]
})
export class TrackingPage implements OnInit, AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  private timerSub: Subscription;

  carInfo: CarInfo;
  carId: number;
  carName: string;
  defaultHref = "cars";
  segmentSpecification = "info";
  segmentHistory = "basket";
  map: GoogleMap;
  carMarker: Marker;
  carMotionParts: CarMotionBreakdown[];
  carMotionTotals: CarMotionTotals = {};
  moment: moment.Moment;
  currentDate: Date;
  isFollowCar = true;
  loadingPath = false;
  loadingHistory = false;

  // ROUTES
  carAction: Marker | Polyline;
  activeCarActionId: number;

  constructor(
    private route: ActivatedRoute,
    private trackerService: TrackerService,
    private menu: MenuController,
    private platform: Platform,
    private datePicker: DatePicker
  ) {
    // tslint:disable-next-line:no-shadowed-variable
    this.menu.get().then((menu: HTMLIonMenuElement) => {
      menu.swipeGesture = false;
    });
    this.carInfo = {
      DUT1: "",
      DUT2: "",
      DUT3: "",
      latitude: "",
      longitude: "",
      mileage: "",
      other: {},
      speed: "",
      time: "",
      course: 0,
      address: "",
      fuelConsumption: "",
      fuelLevel: 0
    };
    this.moment = moment();
    this.currentDate = new Date();
  }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.loadMap();
  }

  ngAfterViewInit() {}

  ionViewWillEnter() {
    this.carId = +this.route.snapshot.paramMap.get("carId");
    this.carName = this.route.snapshot.queryParamMap.get("name");

    const carInfoPolled$ = interval(10000).pipe(
      startWith(0),
      switchMap(() => this.trackerService.getCar(this.carId))
    );

    this.timerSub = carInfoPolled$.subscribe(res => {
      console.log(res);
      if (this.carInfo.other.open) {
        res.other.open = true;
      } else {
        res.other.open = false;
      }
      this.carInfo = res;
      this.updateMap(this.carInfo);
    });

    this.getHistory(this.moment.format("DD-MM-YYYY"));
  }

  getHistory(date: any) {
    this.carMotionParts = [];
    this.carMotionTotals = null;
    this.loadingHistory = true;
    this.trackerService
      .getCarMotionHistory(this.carId, date)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(history => {
        console.log("history", history);
        this.carMotionTotals = {
          mileage: history.mileageTotal,
          driveTime: history.driveTimeTotal,
          parkingTime: history.parkingTimeTotal
        };
        this.carMotionParts = history.breakdown;
        this.loadingHistory = false;
      });
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
          this.getHistory(formatDate);
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

  toggleSection(section: string) {
    this.carInfo[section].open = !this.carInfo[section].open;
  }

  ionViewWillLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.timerSub.unsubscribe();
  }

  loadMap() {
    this.map = GoogleMaps.create("map_canvas", {
      camera: {
        zoom: 18,
        target: { lat: 53.901792, lng: 27.548565 }
      }
    });

    this.carMarker = this.map.addMarkerSync({
      position: { lat: +this.carInfo.latitude, lng: +this.carInfo.longitude },
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
        this.animateCamera({ lat: +carInfo.latitude, lng: +carInfo.longitude });
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
    if (!this.loadingPath) {
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
      this.loadingPath = true;
      // disable follow
      this.isFollowCar = false;
      this.removeObjects();
      // drawing marker or polyline (focus camera)
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
            this.loadingPath = false;
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
                this.loadingPath = false;
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

  private animateCamera(target: any) {
    this.map.animateCamera({
      target: target,
      duration: 500
    });
  }
}
