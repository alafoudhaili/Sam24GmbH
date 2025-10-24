import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/User";
import {SweetAlertService} from "../../services/sweet-alert.service";
import {AuthenticationService} from "../../core/services/auth.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProfilService} from "../../services/profil.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {

  // userData: any;
  // updateForm!: FormGroup;
  // submitted = false;
  // fieldTextType!: boolean;
  // file: any;
  // logo:any;
  // userLogged!: any;
  // pdfFile: any;
  //
  // constructor(
  //     private profilService:ProfilService,
  //     private router: Router,
  //     private modalService: NgbModal,
  //     private formBuilder: FormBuilder,
  //     private userService:UserService,
  //     private authService:AuthenticationService,
  //     private sweetAlertService: SweetAlertService
  //
  // ) {
  // }
  // ngOnInit() {
  //
  //   this.userLogged = JSON.parse(localStorage.getItem('currentUser') || '{}').user;
  //       this.updateForm = this.formBuilder.group({
  //         id_user: [null],
  //         nom: [this.userLogged.nom, [Validators.required]],
  //         prenom: [this.userLogged.prenom, [Validators.required]],
  //         email: [this.userLogged.email, [Validators.required]],
  //         telephone: [this.userLogged.telephone, [Validators.required]],
  //         matriculeFiscale: [this.userLogged.matriculeFiscale],
  //         registerCommerce: [this.userLogged.registerCommerce],
  //         societe: [this.userLogged.societe],
  //         logoSociete: [''],
  //         password: ['', [Validators.required]]
  //       });
  // }
  //
  // get f() {
  //   return this.updateForm.controls;
  // }
  //
  // updateUserWithoutPhoto() {
  //
  //   const userUpdated = new User();
  //   if (this.userLogged) {
  //     userUpdated.id_user = this.userLogged.id_user;
  //     userUpdated.nom = this.updateForm.value.nom;
  //     userUpdated.prenom = this.updateForm.value.prenom;
  //     userUpdated.email = this.updateForm.value.email;
  //     userUpdated.telephone = this.updateForm.value.telephone;
  //     userUpdated.matriculeFiscale = this.updateForm.value.matriculeFiscale;
  //     userUpdated.registreCommerce = this.updateForm.value.registerCommerce;
  //     userUpdated.societe = this.updateForm.value.societe;
  //     if (this.updateForm.value.password) {
  //       userUpdated.password = this.updateForm.value.password;
  //     }
  //     const formData: FormData = new FormData();
  //     formData.append('user', JSON.stringify(userUpdated));
  //     if (userUpdated.registreCommerce && this.pdfFile) {
  //       formData.append('registreCommerce', this.pdfFile);
  //     }
  //     if (userUpdated.logoSociete && this.file) {
  //       formData.append('logoSociete', this.file);
  //     }
  //     this.profilService.updateUserWithoutPhoto(formData).subscribe(data => {
  //       if (data) {
  //         this.userData=data;
  //         this.userLogged = { ...this.userLogged, ...data };
  //         const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  //         currentUser.user = this.userLogged;
  //         localStorage.setItem('currentUser', JSON.stringify(currentUser));
  //         window.location.reload();
  //       }
  //       else {
  //         console.log('error');
  //       }
  //     });
  //   }
  // }
  //
  //
  // onLogoChange(event: any) {
  //   if (event.target.files.length > 0) {
  //     this.file = event.target.files[0] as File;
  //   }
  // }
  //
  // onFileChange(event: any) {
  //   const fileList: FileList | null = event.target.files;
  //
  //   if (fileList && fileList.length > 0) {
  //     this.file = fileList[0];
  //     this.updateUserWithPhoto();
  //   }
  // }
  // updateUserWithPhoto() {
  //   if (!this.file) {
  //     return;
  //   }
  //   const formData: FormData = new FormData();
  //   formData.append('id', this.userLogged.id_user);
  //   formData.append('newPhoto', this.file);
  //
  //   this.profilService.updateUserWithPhoto(formData).subscribe(
  //       (data) => {
  //         this.userLogged = {
  //           ...data,
  //           photoProfil: `${data.photoProfil}?timestamp=${new Date().getTime()}`
  //         };
  //         localStorage.setItem('currentUser', JSON.stringify({ user: this.userLogged }));
  //         window.location.reload();
  //       },
  //       (error) => {
  //         console.error('Error updating user photo:', error);
  //       }
  //   );
  // }
  //
  //
  // onPdfFileChange(event: any) {
  //   if (event.target.files.length > 0) {
  //     const selectedFile = event.target.files[0] as File;
  //
  //     if (selectedFile.type === 'application/pdf') {
  //       this.pdfFile = selectedFile;
  //     } else {
  //       this.sweetAlertService.danger('Le fichier importé n est pas un Pdf !!!')
  //       this.pdfFile = null;
  //     }
  //   }
  // }
  //
  // get form() {
  //   return this.updateForm.controls;
  // }
  //
  // toggleFieldTextType() {
  //   this.fieldTextType = !this.fieldTextType;
  // }
  //
  //
  // annuler() {
  //   this.router.navigate(['/pages'])
  // }
  //
  // // checkValidityAndSubmit() {
  // //   if (this.updateForm.invalid) {
  // //     for (const i in this.updateForm.controls) {
  // //       if (this.updateForm.controls[i].invalid) {
  // //         let message = '';
  // //         switch (i) {
  // //           case 'nom':
  // //             message = 'Le champs nom est obligatoire.';
  // //             break;
  // //           case 'prenom':
  // //             message = 'Le champs prénom est obligatoire.';
  // //             break;
  // //           case 'email':
  // //             message = 'Le champs émail est obligatoire.';
  // //             break;
  // //           case 'telephone':
  // //             message = 'Le champs téléphone est obligatoire.';
  // //             break;
  // //           case 'password':
  // //             message = 'Vous devez saisir un mot de passe.';
  // //             break;
  // //           default:
  // //             message = 'Erreur de validation. Veuillez vérifier le formulaire.';
  // //             break;
  // //
  // //         }
  // //         if (message) {
  // //           this.snackBar.open(message, 'Fermer', {
  // //             duration: 3000,
  // //             panelClass: ['my-snackbar'],
  // //             horizontalPosition: 'center',
  // //             verticalPosition: 'bottom',
  // //           });
  // //           return;
  // //         }
  // //       }
  // //     }
  // //   }else {
  // //     this.updateUserWithoutPhoto();
  // //   }
  // // }
  //
  // desactiver() {
  //   this.userService.desactiverCompte(this.userLogged).subscribe(data=>{
  //     if (data) {
  //       this.sweetAlertService.success('Votre compte a été désactivé!');
  //       this.authService.logout();
  //       this.router.navigate(['']);
  //     }
  //     else {
  //       console.log('error');
  //     }
  //       }
  //   )
  // }
}

