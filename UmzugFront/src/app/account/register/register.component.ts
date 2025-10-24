import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {User} from "../../models/User";
import {SweetAlertService} from "../../services/sweet-alert.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

/**
 * Register Component
 */
export class RegisterComponent implements OnInit {

    signupForm!: UntypedFormGroup;
    submitted = false;
    error = '';
    year: number = new Date().getFullYear();
    fieldTextType!: boolean;
    file: any;
    showNavigationArrows: any;
    pdfFile: File | null = null;

    constructor(private formBuilder: UntypedFormBuilder, private router: Router,
                private authService: AuthenticationService,
                private sweetAlertService:SweetAlertService
    ) { }

    ngOnInit(): void {

        this.signupForm = this.formBuilder.group({
            societe: ['', Validators.required],
            pays: ['', Validators.required],
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telephone: ['', Validators.required],
            role: ['', [Validators.required]],
            matriculeFiscale: ['', [Validators.required]],
            registerCommerce: ['', [Validators.required]],
            photoProfil: ['', Validators.required],
            password: ['', Validators.required],

        });
    }

    get f() { return this.signupForm.controls; }

    onSubmit() {
        this.submitted = true;

        const user = new User();
        user.nom=this.signupForm.value.nom;
        user.prenom=this.signupForm.value.prenom;
        user.email=this.signupForm.value.email;
        user.telephone=this.signupForm.value.telephone;
        user.role=this.signupForm.value.role;
        user.photoProfil=this.signupForm.value.photoProfil;
        user.password=this.signupForm.value.password;
        user.pays=this.signupForm.value.pays;
        user.societe=this.signupForm.value.societe;
        user.role=this.signupForm.value.role;
        user.matriculeFiscale=this.signupForm.value.matriculeFiscale;
        user.registreCommerce=this.signupForm.value.registerCommerce;


        const formData: FormData = new FormData();
        formData.append('user', JSON.stringify(user));
        if (user.photoProfil && this.file) {
            formData.append('photoProfil', this.file);
        }
        if (user.registreCommerce && this.pdfFile) {
            formData.append('registreCommerce', this.pdfFile);
        }

        this.authService.register(formData).subscribe(
            (data)=>{
                if (data) {
                    this.sweetAlertService.success('An email containing the confirmation code has been sent to you')
                    this.router.navigate(['/auth/pass-reset/cover'], { queryParams: { email: user.email } });
                }
            },
            (error: any) => {
                this.error = error ? error : '';
            });
    }
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            this.file = event.target.files[0] as File;
        }
    }

    onPdfFileChange(event: any) {
        if (event.target.files.length > 0) {
            const selectedFile = event.target.files[0] as File;

            if (selectedFile.type === 'application/pdf') {
                this.pdfFile = selectedFile;
            } else {
                this.sweetAlertService.danger('Le fichier importé n est pas un Pdf !!!')
                this.pdfFile = null;
            }
        }
    }
}
