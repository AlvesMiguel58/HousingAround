import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { take } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
})
export class PropertyPage implements OnInit {
  currentUser: any = null;

  propertyId = null;
  property = null;
  users = [
    { name: 'Miguel' },
    { name: 'Nicole' },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: FirebaseService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.propertyId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getProperty(this.propertyId);
  }

  async getProperty(id) {
    const loading = await this.loadingController.create();
    await loading.present();

    this.firestore.getPropertyById(id).pipe(take(1)).subscribe((res: any) => {
      this.property = res;

      loading.dismiss();
      console.log('Current Property', this.property)
    });
  }

  getUser(id) {
    this.firestore.getUserById(id).pipe(take(1)).subscribe((res: any) => {
      console.log('Got User', res)
    })
  }
}
