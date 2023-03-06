import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirebaseService, User } from '../../app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  registerForm: FormGroup;
  loginPage = true;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private firestore: FirebaseService
  ) { }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get name() {
    return this.registerForm.get('name');
  }

  get surname() {
    return this.registerForm.get('surname');
  }

  get regEmail() {
    return this.registerForm.get('email');
  }

  get regPassword() {
    return this.registerForm.get('password');
  }

  ngOnInit() {
    // login Page 
    this.credentials = this.fb.group({
      email: ['migz58@gmail.com', [Validators.required, Validators.email]],
      password: ['Fishinatub5', [Validators.required, Validators.minLength(6)]]
    });

    // Register Page
    this.registerForm = this.fb.group({
      name: ['Miguel', [Validators.required]],
      surname: ['Alves', [Validators.required]],
      email: ['migz58@gmail.com', [Validators.required, Validators.email]],
      password: ['Fishinatub5', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();


    const user = await this.authService.register(this.registerForm.value);
    await loading.dismiss();

    if (user) {
      // console.log('Register user:', user);

      const regUser = {
        id: user.user.uid,
        avatar: null,
        name: this.registerForm.value.name,
        surname: this.registerForm.value.surname,
        email: this.registerForm.value.email
      };

      this.firestore.addUser(regUser);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();
    // console.log('user:', user);

    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Login failed', 'Please try again!');
    }
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
