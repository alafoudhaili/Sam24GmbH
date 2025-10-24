import { Component } from '@angular/core';
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../../core/services/auth.service";
import { UserService } from "../../../services/user.service";
import { SweetAlertService } from "../../../services/sweet-alert.service";
import { User } from "../../../models/User";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  breadCrumbItems: Array<{}> = [];
  addUserForm!: FormGroup;
  file!: any;
  fieldTextType!: boolean;
  submitted = false;

  constructor(
      private router: Router,
      private userService: UserService,
      private formBuilder: FormBuilder,
      private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Benutzer' },
      { label: 'Hinzufügen', active: true },
    ];

    this.addUserForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      photoProfil: [''],
      role: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  saveUser() {
    if (this.addUserForm.valid) {
      const newUser = new User();
      newUser.nom = this.addUserForm.value.nom;
      newUser.prenom = this.addUserForm.value.prenom;
      newUser.email = this.addUserForm.value.email;
      newUser.photoProfil = this.addUserForm.value.photoProfil;
      newUser.password = this.addUserForm.value.password;
      newUser.role = this.addUserForm.value.role;

      const formData: FormData = new FormData();
      formData.append('user', JSON.stringify(newUser));
      if (newUser.photoProfil && this.file) {
        formData.append('photoProfil', this.file);
      }

      this.userService.addUser(formData).subscribe(
        (result) => {
          this.sweetAlertService.success('Benutzer erfolgreich hinzugefügt');
          setTimeout(() => {
            this.router.navigate(['/pages/user']);
          }, 1000);
        },
        error => {
          this.sweetAlertService.danger('Es gab ein Problem beim Hinzufügen des Benutzers!');
        }
      );
    }
  }

  get form() {
    return this.addUserForm.controls;
  }

  get f() {
    return this.addUserForm.controls;
  }

  list() {
    this.router.navigate(['user']);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0] as File;
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  checkValidityAndSubmit() {
    if (this.addUserForm.invalid) {
      for (const i in this.addUserForm.controls) {
        if (this.addUserForm.controls[i].invalid) {
          switch (i) {
            case 'nom':
              this.sweetAlertService.danger('Das Feld Nachname ist erforderlich!');
              break;
            case 'prenom':
              this.sweetAlertService.danger('Das Feld Vorname ist erforderlich!');
              break;
            case 'email':
              this.sweetAlertService.danger('Das Feld E-Mail ist erforderlich!');
              break;
            case 'role':
              this.sweetAlertService.danger('Das Feld Rolle ist erforderlich!');
              break;
            
            case 'password':
              this.sweetAlertService.danger('Das Feld Passwort ist erforderlich!');
              break;
          }
          return;
        }
      }
    }
    else {
      this.isEmailExists(this.addUserForm.controls['email'].value).subscribe(isExists => {
        if (isExists) {
          this.sweetAlertService.danger('Ein Benutzer mit dieser E-Mail existiert bereits!');
        }
        this.saveUser();
      });
    }
  }

  private isEmailExists(email: string): Observable<boolean> {
    return this.userService.getUserByEmail(email).pipe(
        map(data => !!data)
    );
  }
}
