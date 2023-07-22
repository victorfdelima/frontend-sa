// RabbitMQClientService

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RabbitMQClientService {
  private hubConnection: signalR.HubConnection;
  private connectionPromise: Promise<void>;
  private messageSubject: Subject<string> = new Subject<string>();

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

  saveMessage(message: string) {
    const savedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    savedMessages.push(message);

    if (savedMessages.length > 10) {
      savedMessages.shift();
    }

    localStorage.setItem('messages', JSON.stringify(savedMessages));
  }

  getSavedMessages(): string[] {
    return JSON.parse(localStorage.getItem('messages') || '[]');
  }

  sendMessage(message: string) {
    this.connectionPromise.then(() => {
      this.hubConnection.invoke('SendText', message).catch(err => console.error(err));
    }).catch(err => console.error(err));
  }

  isValidMessage(content: string): boolean {
    const lowerCaseCount = (content.match(/[a-z]/g) || []).length;
    const upperCaseCount = (content.match(/[A-Z]/g) || []).length;
    const repeatedCharsCount = this.countRepeatedCharacters(content);
    const specialCharCount = (content.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;

    return (
      content.length >= 15 &&
      content.length <= 20 &&
      lowerCaseCount >= 2 &&
      upperCaseCount >= 5 &&
      repeatedCharsCount >= 4 &&
      specialCharCount >= 2
    );
  }

  private countRepeatedCharacters(content: string): number {
    const charMap = new Map<string, number>();
    for (const char of content) {
      charMap.set(char, (charMap.get(char) || 0) + 1);
    }
    let count = 0;
    for (const charCount of charMap.values()) {
      if (charCount >= 4) {
        count++;
      }
    }
    return count;
  }

  receiveMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
