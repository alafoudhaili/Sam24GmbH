import {Component, OnInit} from '@angular/core';
import {MessageLanding} from "../../../models/MessageLanding";
import {User} from "../../../models/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageLandingService} from "../../../services/message-landing.service";

@Component({
  selector: 'app-message-landing',
  templateUrl: './message-landing.component.html',
  styleUrls: ['./message-landing.component.scss']
})
export class MessageLandingComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  messages: MessageLanding[] = [];
  userLogged!: User;
  listMessageForm!: FormGroup;
  messageLandingDetaille!: MessageLanding;
  messageIdToDelete!: number;
  length = 0;
  currentPage: number = 1;
  itemsPerPage = 10;
  intervalId: any;



  constructor(
      private router: Router,
      private modalService: NgbModal,
      private messageLandingService: MessageLandingService
  ) {}

  ngOnInit(): void {

    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Messages' },
      { label: 'Liste', active: true }
    ];

    // this.intervalId = setInterval(() => {
    //   this.loadMessages();
    // }, 15000);


    this.loadMessages();
    this.resetAllUnreadLandings()
    this.listMessageForm = new FormGroup({
      id: new FormControl(null),
      nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      telephone: new FormControl('', [Validators.required]),
      objet: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });

    this.userLogged = JSON.parse(localStorage.getItem('currentUser') || '{}').user;

  }

  loadMessages() {
    this.messageLandingService.getAllMessages().subscribe(
        (data) => {
          this.messages = data.reverse();
          this.length = data.length;
        },
        (error) => {
          console.error('Error loading messages:', error);
        }
    );
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }

  sendMessage() {
    const newMessage = new MessageLanding ();

    newMessage.nom = this.listMessageForm.value.titre;
    newMessage.email = this.listMessageForm.value.email;
    newMessage.objet = this.listMessageForm.value.objet;
    newMessage.message = this.listMessageForm.value.titre;
    newMessage.telephone = this.listMessageForm.value.telephone;

    this.messageLandingService.addMessage(newMessage).subscribe(
        (response) => {
          this.router.navigate(['home']);

        },
        (error) => {
          console.error('Error sending message:', error);
        }
    );
  }

  showDetails(content: any, messageLanding: MessageLanding) {

    this.messageLandingService.getMessageById(messageLanding.id_message_landing).subscribe(
        data => {
          if (data)
            this.updateStatus(messageLanding.id_message_landing);
          this.messages;
          this.messageLandingDetaille = data

        }
    )
    this.modalService.open(content, {size: 'md', centered: true});
  }

  updateStatus(id: number) {
    this.messageLandingService.updateStatut(id).subscribe({
      next: (updateStatus) => {
        this.loadMessages()
      },
      error: (error) => {
        console.error('Failed to update reclamation status', error);
      }
    });
  }

  getMessages(): void {
    this.messageLandingService.getAllMessages().subscribe((data: MessageLanding[]) => {
      this.messages = data.reverse();
      this.length = data.length;
    }, (error) => {
      console.log(error);
    });
  }

  confirm(content: any, id: any) {
    this.messageIdToDelete = id;
    this.modalService.open(content, {centered: true});
  }

  deleteMessage() {
    if (this.messageIdToDelete) {
      this.messageLandingService.deleteMessage(this.messageIdToDelete).subscribe((response) => {
        if (response) {
          this.loadMessages()
          this.messages = this.messages.filter((item) => item.id_message_landing !== this.messageIdToDelete);
        }
      });
      window.location.reload();
      this.modalService.dismissAll();
    }
  }

  resetAllUnreadLandings(): void {
    this.messageLandingService.resetAllUnreadLandings().subscribe({
      next: (response) => {
        if (response === "No unread landing messages to reset.") {
        } else {
        }
      },
    });
  }

}

