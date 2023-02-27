import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  ) { }


  async logout() {
    await this.authService.logout();
    this.isOpen = false;
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
