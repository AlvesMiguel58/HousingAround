import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService, User } from '../../app/services/firebase.service';
import { Auth } from '@angular/fire/auth';
import { take } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('popover') popover;

  isOpen = false;

  currentUser: any = null;
  properties: any = null;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: FirebaseService,
    private auth: Auth,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {

    // this.firestore.getUsers().pipe(take(1)).subscribe((res: any) => {
    //   this.users = res;
    //   console.log('Users', this.users)
    // })
    this.getCurrentUser();
  }

  async getCurrentUser() {
    this.firestore.getUserById(this.auth.currentUser.uid).pipe(take(1)).subscribe((res: any) => {
      this.currentUser = res;
      console.log('currentUser', this.currentUser);

      this.getProperties(this.currentUser.id)
    })

  }

  async getProperties(uid) {
    const loading = await this.loadingController.create();
    await loading.present();

    this.firestore.getProperties(uid).pipe(take(1)).subscribe((res: any) => {
      this.properties = res;
      loading.dismiss();
      console.log('Properties', this.properties)
    })
  }

  addProperty() {
    // this.firestore.addProperty(this.currentUser.id);
    // this.getProperties(this.currentUser.id);
  }

  viewProperty(property) {
    this.showAlert('Cant view yet', 'still being worked on!');
  }

  async logout() {
    await this.authService.logout();
    this.isOpen = false;
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
