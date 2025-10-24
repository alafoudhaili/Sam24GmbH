import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {BehaviorSubject, Subject} from 'rxjs';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  private stompClient: any;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  connect(userLogged: any): void {
    if (!userLogged?.id_user) {
      console.error("User ID is not available.");
      return;
    }

    const socket = new SockJS('http://localhost:82/ws'); // URL de votre WebSocket
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);

      // Abonnement au canal de notifications pour cet utilisateur
      this.stompClient.subscribe('/topic/notifications/' + userLogged.id_user, (message: any) => {

        // Mettre à jour les notifications dans le sujet
        try {
          if (message.body === "Notifications marquées comme lues") {
            this.notificationsSubject.next([]);
          } else {
            const notification = JSON.parse(message.body);
            const currentNotifications = this.notificationsSubject.value || [];
            this.notificationsSubject.next([...currentNotifications, notification]);
          }
        } catch (error) {
          console.error('Erreur lors de l’analyse de la notification :', error);
        }
      });
    });
  }
}