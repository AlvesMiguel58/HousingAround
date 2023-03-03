import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../../app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('popover') popover;

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: FirebaseService
  ) { }


  async logout() {
    await this.authService.logout();
    this.isOpen = false;
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  addUserTest() {
    const user = {
      avatar: 'test',
      name: 'Nicole',
      surname: 'Alves',
      email: 'a@b.com'
    };

    this.firestore.addUser(user);
  }
}
