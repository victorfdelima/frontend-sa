// rabbitmq-client.service.ts

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RabbitMQClientService {
  private hubConnection: signalR.HubConnection;
  private connectionPromise: Promise<void>;
  private messageSubject: Subject<string> = new Subject<string>();
  private parseMessage(message: any): { content: string; isValid: boolean } {
    return { content: message.content, isValid: message.isValid };
  }
  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44363/hubs/contador')
      .build();

    this.connectionPromise = this.hubConnection.start();
    this.connectionPromise.catch(err => console.error(err));

    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messageSubject.next(message);
    });
  }
  isValidMessage(content: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const isValid = content.includes('a');
      observer.next(isValid);
      observer.complete();
    });
  }
  saveMessage(message: { content: string; isValid: boolean }) {
    const savedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    savedMessages.push(JSON.stringify(message));

    if (savedMessages.length > 10) {
      savedMessages.shift();
    }

    localStorage.setItem('messages', JSON.stringify(savedMessages));
  }

  getSavedMessages(): { content: string; isValid: boolean }[] {
    const savedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    return savedMessages.map((message: string) => JSON.parse(message));
  }

  sendMessage(message: string) {
    this.connectionPromise.then(() => {
      this.hubConnection.invoke('SendText', message).catch(err => console.error(err));
    }).catch(err => console.error(err));
  }
  receiveMessage(): Observable<{ content: string; isValid: boolean }> {
    return this.messageSubject.asObservable().pipe(
      map((message: any) => this.parseMessage(message))
    );
}
}
