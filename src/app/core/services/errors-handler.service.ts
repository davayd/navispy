import { NotificationService } from "./notification.service";
import { HTTPResponse } from "@ionic-native/http/ngx";
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';

@Injectable({ providedIn: "root" })
export class ErrorsHandler {
  constructor(private notificationService: NotificationService) {}

  handleError(error: HTTPResponse): Observable<any> {
    // Server error happened
    if (!navigator.onLine) {
      // No Internet connection
      this.notificationService.notify("Нет соединения с сервером, попробуйте позже.");
      return  throwError(error);
    }
    // Http Error
    // Send the error to the server
    // errorsService.log(error).subscribe();
    // Show notification to the user
    this.notificationService.notify(`${error.status} - ${error.data}`);
    return throwError(error);
  }
}
