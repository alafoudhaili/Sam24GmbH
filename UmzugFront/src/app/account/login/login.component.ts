import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';
import {SweetAlertService} from "../../services/sweet-alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  toast!: false;
  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder,
              private router: Router,
              private authService:AuthenticationService,
              private sweetAlertService:SweetAlertService) {
      if (this.authService.currentUserValue) {
        this.router.navigate(['/']);
      }
     }

  ngOnInit(): void {
    if(localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    /**
     * Form Validatyion
     */
     this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  login() {
      this.submitted = true;

      this.authService.login(this.f['email'].value, this.f['password'].value)
          .subscribe(
              (data: any) => {

                  if (data.token) {
                      this.router.navigate(['/pages']);
                  } else {
                      this.sweetAlertService.danger("Mot de passe ou email erroné!!");
                  }
              },
              (error) => {
                  console.error("Login Error:", error);
                  this.sweetAlertService.danger("Mot de passe ou email erroné!!");
              }
          );
  }

   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
