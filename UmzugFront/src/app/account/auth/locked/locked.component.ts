import { Component } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../core/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SweetAlertService} from "../../../services/sweet-alert.service";

@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.scss']
})
export class LockedComponent {

  authForm!: UntypedFormGroup;
  submitted = false;
  hide = true;
  resetToken: string;
  error = '';
  fieldTextType: any;

  constructor(
      private formBuilder: UntypedFormBuilder,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private authService: AuthenticationService,
      private sweetAlertService: SweetAlertService) {
    this.resetToken = this.activatedRoute.snapshot.paramMap.get('token') || '';
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      password: ['', [Validators.required]],

    });
  }


  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    let message = '';
    if (this.authForm.invalid) {
      return;
    }
    this.authService.resetPassword(this.resetToken,this.authForm.value.password).subscribe({
      next: () => {
       this.sweetAlertService.success('Félicitations votre mot de passe a été renitialisé avec succès')
        this.router.navigate(['/pages']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = err.message;
        } else {
          this.error = 'Une erreur est survenue veuillez essayer plus tard';
        }
        return;
      }
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}








