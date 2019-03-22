import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable()
export class NotificationService {
  toast: any;
  constructor(private toastController: ToastController) {}

  async notify(message) {
    try {
      this.toast.dismiss();
    } catch (e) {}
    this.toast = await this.toastController.create({
      message: message,
      duration: 2000,
      animated: true,
      translucent: true
    });
    this.toast.present();
  }
}
