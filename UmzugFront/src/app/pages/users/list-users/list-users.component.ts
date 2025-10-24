import { Component } from '@angular/core';
import { User } from "../../../models/User";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {

  breadCrumbItems!: Array<{}>;
  listUsers!: User[];
  submitted = false;
  listUsersForm!: FormGroup;
  modal: any;
  total!: Observable<number>;
  fieldTextType!: boolean;
  service: any;
  file: any;
  showCollaborateursColumn: boolean = false;
  showRgsColumn: boolean = false;

  selectedUser!: User;
  userLogged!: User;
  userIdToDelete!: number;
  public smallPhoto!: string;
  length = 0;
  searchName: string = '';
  originalListUser: User[] = [];
  searchLetter: string = '';
  users: User[] = [];
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  currentPage = 1;
  itemsPerPage = 10;
  public displayMode: 'cards' | 'table' = 'cards';

  constructor(
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.loadUsers();
    this.breadCrumbItems = [
      { label: 'Benutzer' },
      { label: 'Liste', active: true }
    ];

    this.listUsersForm = this.formBuilder.group({
      id_user: [null],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required]],
      role: ['', [Validators.required]],
      photoProfil: [''],
    });

    this.userLogged = JSON.parse(localStorage.getItem('currentUser') || '{}').user;
  }

  getUsers() {
    this.userService.getUsers().subscribe((data) => {
      if (data) {
        this.listUsers = data;
        this.length = data.length;
      }
    }, (error) => {
      console.log(error);
    });
  }

  

  confirm(content: any, id: any) {
    this.userIdToDelete = id;
    this.modalService.open(content, { centered: true });
  }

  get form() {
    return this.listUsersForm.controls;
  }

  get f() {
    return this.listUsersForm.controls;
  }



  add() {
    this.router.navigate(['/pages/user/add']);
  }

  deleteUser() {
    if (this.userIdToDelete) {
      this.userService.deleteUser(this.userIdToDelete).subscribe((response) => {
        if (response) {
          this.listUsers = this.listUsers.filter((item) => item.id_user !== this.userIdToDelete);
        }
      });
      this.modalService.dismissAll();
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  onFileChangePdf(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  filterUsers() {
    if (this.searchName || this.searchLetter) {
      this.listUsers = this.originalListUser.filter(user => {
        const fullName = `${user.nom} ${user.prenom}`;
        const fullNameLowerCase = fullName.toLowerCase();
        const nameFilter = this.searchName && fullNameLowerCase.includes(this.searchName.toLowerCase());
        const letterFilter = this.searchLetter && user.nom.toLowerCase().startsWith(this.searchLetter.toLowerCase());

        return nameFilter || letterFilter;
      });
    } else {
      this.listUsers = this.originalListUser;
    }
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.originalListUser = data;
        this.listUsers = [...this.originalListUser];
      },
      error => {
        console.error('Fehler beim Laden der Benutzer', error);
      }
    );
  }

  onLetterClick(letter: string) {
    this.searchLetter = letter;
    this.filterUsers();
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }

  toggleDisplayMode() {
    this.displayMode = this.displayMode === 'cards' ? 'table' : 'cards';
  }

  getAll() {
    this.showCollaborateursColumn = true;
    this.showRgsColumn = false;
    this.userService.getUsers().subscribe(data => {
      if (data) {
        this.listUsers = data.reverse();
        this.length = data.length;
      }
    }, error => {
      console.log(error);
    });
  }

  getAdmins() {
    this.userService.getAdmins().subscribe(data => {
      if (data) {
        this.listUsers = data.reverse();
        this.length = data.length;
      }
    }, error => {
      console.log(error);
    });
  }

  getMitarbeiter() {
    this.showCollaborateursColumn = true;
    this.userService.getMitarbeiters().subscribe(data => {
      if (data) {
        this.listUsers = data.reverse();
        this.length = data.length;
      }
    }, error => {
      console.log(error);
    });
  }

 
}
