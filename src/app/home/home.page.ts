import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService, User } from '../../app/services/firebase.service';
import { Auth } from '@angular/fire/auth';
import { take } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('popover') popover;
  @ViewChild(IonModal) modal: IonModal;

  newProperty = {
    avatar: null,
    city: null,
    postal_code: null,
    street: null,
    suburb: null,
    unit_number: null,
    userID: null,
    userIDs: null
  };

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
      this.newProperty.userID = this.currentUser.id;
      this.getProperties(this.currentUser.id)
    })

  }

  async getProperties(uid) {
    const loading = await this.loadingController.create();
    await loading.present();

    this.firestore.getProperties(uid).subscribe((res: any) => {
      this.properties = res;
      loading.dismiss();
      console.log('Properties', this.properties)
    })
  }

  // Add Property Modal
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {

    this.newProperty.avatar = 'https://t3.ftcdn.net/jpg/03/22/06/68/360_F_322066808_CANrp7u5Cdiz7700TJReqKD299d2AZtD.jpg';
    this.modal.dismiss(this.newProperty, 'confirm');
  }

  createProperty(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'confirm') {
      console.log('Confirm', this.newProperty);

      this.firestore.addProperty(this.newProperty, this.currentUser.id);
    }
  }
  // ---------------

  viewProperty(property) {
    // this.showAlert('Cant view yet', 'still being worked on!');
    this.router.navigateByUrl('/property/' + property.id, { replaceUrl: true });
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
