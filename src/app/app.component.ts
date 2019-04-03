import { Component, ViewChildren, QueryList } from "@angular/core";

import {
  Platform,
  MenuController,
  Events,
  IonRouterOutlet
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router, NavigationEnd } from "@angular/router";
import {
  TrackerService,
  KEY_LOGIN,
  KEY_ISAUTH
} from "./core/services/tracker.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  public appPages = [
    {
      title: "Автомобили",
      url: "/cars",
      icon: "home"
    }
  ];
  public exitBtn = {
    title: "Выход",
    url: "/login",
    icon: "exit"
  };

  userName: string;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private router: Router,
    private events: Events,
    private trackerService: TrackerService
  ) {
    const isAuth = localStorage.getItem(KEY_ISAUTH);
    if (!isAuth) {
      localStorage.setItem(KEY_ISAUTH, "false");
    }
    if (isAuth === "true") {
      this.router.navigate(["/cars"]);
    } else {
      this.router.navigate(["/login"]);
    }
    this.initializeApp();
    this.backButtonEvent();

    // tslint:disable-next-line:no-shadowed-variable
    this.menu.get().then((menu: HTMLIonMenuElement) => {
      menu.swipeGesture = false;
    });
    this.userName = localStorage.getItem(KEY_LOGIN);
    this.events.subscribe("user:login", () => {
      this.userName = localStorage.getItem(KEY_LOGIN);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("356D92");
      this.splashScreen.hide();
    });
  }

  logout() {
    this.trackerService.logout();
    this.router.navigate(["/login"]);
  }

  private backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (this.router.url === "/login") {
          navigator["app"].exitApp();
        } else if (this.router.url === "/cars") {
          this.menu.isOpen().then(isOpen => {
            if (isOpen) {
              this.menu.close();
            } else {
              navigator["app"].exitApp();
            }
          });
        } else if (outlet && outlet.canGoBack()) {
          outlet.pop();
        }
      });
    });
  }
}
