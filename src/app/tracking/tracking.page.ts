import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuController, IonSlides, Platform } from "@ionic/angular";
import { TrackerService } from "../core/services/tracker.service";
import { CarInfo, CarMotionBreakdown } from "../core/models/car";
import {
  Subject,
  Observable,
  BehaviorSubject,
  interval,
  Subscription
} from "rxjs";
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  PolylineOptions,
  ILatLng,
  Polyline
} from "@ionic-native/google-maps";
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
  dateNow: moment.Moment;
  currentDate: string;

  daysOfYear: string[] = [];
  @ViewChild(IonSlides) slides: IonSlides;
  slidesOpts = {
    initialSlide: this.daysOfYear.length - 1,
    slidesPerView: 3
  };

  polledCarInfo$: Observable<CarInfo>;
  load$ = new BehaviorSubject("");

  // ROUTES
  historyRoute: Polyline;
  historyParking: Marker;

  constructor(
    private route: ActivatedRoute,
    private trackerService: TrackerService,
    private menu: MenuController,
    private platform: Platform
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
      course: 0
    };
    this.dateNow = moment();
    this.currentDate = this.dateNow.format("DD-MM-YYYY");
  }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.loadMap();
    this.daysOfYear = this.trackerService.daysOfYear;
  }

  ngAfterViewInit() {}

  ionViewWillEnter() {
    this.carId = +this.route.snapshot.paramMap.get("carId");
    this.carName = this.route.snapshot.queryParamMap.get("name");

    this.trackerService
      .getCarMotionBreakdown(this.carId, this.currentDate)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(parts => {
        console.log("parts", parts);
        this.carMotionParts = parts;
      });

    const carInfoPolled$ = this.load$.pipe(
      switchMap(_ =>
        interval(10000).pipe(
          startWith(0),
          switchMap(() => this.trackerService.getCar(this.carId))
        )
      )
    );

    this.timerSub = carInfoPolled$.subscribe(res => {
      console.log(res);
      this.carInfo.other.open
        ? (res.other.open = true)
        : (res.other.open = false);

      this.carInfo = res;
      this.updateMap(this.carInfo);
    });
  }

  refreshDataClick() {
    this.load$.next("");
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
        url: "assets/img/arrow3.png",
        size: {
          width: 30,
          height: 30
        }
      },
      rotation: this.carInfo.course
    });
  }

  updateMap(carInfo: CarInfo) {
    if (this.map) {
      this.map.animateCamera({
        target: { lat: +carInfo.latitude, lng: +carInfo.longitude },
        duration: 1000
      });

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
    // remove past tags
    if (this.historyParking) {
      this.historyParking.remove();
    }
    if (this.historyRoute) {
      this.historyRoute.remove();
    }

    if (action.motion === "P") {
      // draw marker and focus camera on it
      const position = { lat: +action.latStart, lng: +action.lonStart };
      this.historyParking = this.map.addMarkerSync({
        position: position
      });
      this.map.animateCamera({
        target: position,
        duration: 500
      });
    } else if (action.motion === "") {
      this.trackerService
        .getCarTrack(261, "2019-03-06 13:42:30", "2019-03-06 14:26:04")
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(result => {
          console.log(result);
          const route = Object.values(result.route);
          const routeCoords: ILatLng[] = route.map(routePart => {
            return { lat: routePart.latitude, lng: routePart.longitude };
          });
          console.log(routeCoords);
          this.historyRoute = this.map.addPolylineSync({
            color: "#AA00FF",
            width: 5,
            points: []
          });
          this.historyRoute.setPoints(routeCoords);
          this.map.animateCamera({
            target: routeCoords,
            duration: 500
          });
        });
    }
  }
}
