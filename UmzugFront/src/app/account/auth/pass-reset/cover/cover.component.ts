import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {AuthenticationService} from "../../../../core/services/auth.service";
import {SweetAlertService} from "../../../../services/sweet-alert.service";
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {
    email!: string;
    passresetForm!: UntypedFormGroup;
    submitted = false;
    fieldTextType!: boolean;
    error = '';
    message = '';
    returnUrl!: string;
    // set the current year
    year: number = new Date().getFullYear();
    showNavigationArrows: any;

    constructor(private formBuilder: UntypedFormBuilder,
                private authService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private router: Router,
                private route: ActivatedRoute,

    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'];
        });

        this.passresetForm = this.formBuilder.group({
            code: ['', [Validators.required]]
        });
    }

    get f() {
        return this.passresetForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.passresetForm.invalid) {
            return;
        }
        this.authService.verify(this.email,this.passresetForm.value.code).subscribe(
            response => {
                if (response.token) {
                this.sweetAlertService.success('XsupplY account created successfully')
                    this.router.navigate(['/pages']);
                } else {
                    this.sweetAlertService.danger('Confirmation Code incorrect.');
                }
            },
            error => {
                this.sweetAlertService.danger('Connexion error.');
            }
        );
    }

    checkValidityandSubmit(): boolean {
        const email = this.passresetForm.value.email;
        if (!email || email.trim() === '') {
            this.sweetAlertService.danger('Veuillez saisir une adresse mail valide!!');
            return false;
        }
        this.onSubmit();
        return true;
    }

    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }
}