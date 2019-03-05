import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // tslint:disable-next-line:triple-equals
    const isAuth: boolean = localStorage.getItem("auth") == 'true';
    console.log(route);

    if (!isAuth) {
      this.router.navigate(["/login"]);
      return false;
    }

    return true;
  }
}
