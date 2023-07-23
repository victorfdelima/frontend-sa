// rabbitmq-client.service.ts

import { ElementRef, Injectable, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RabbitMQClientService {
  private hubConnection: signalR.HubConnection;
  private connectionPromise: Promise<void>;
  private apitoAudio: HTMLAudioElement | undefined  
  private messageSubject: Subject<string> = new Subject<string>();
  private parseMessage(message: any): { content: string; isValid: boolean } {
    return { content: message.content, isValid: message.isValid };
  }

  constructor() {
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:47662/hubs/contador')
      .build();

    this.connectionPromise = this.hubConnection.start();
    this.connectionPromise.catch(err => console.error(err));

    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messageSubject.next(message);
    });
    this.apitoAudio = new Audio('assets/notifyaudio.mp3');
  }
  private playApitoSound() {
    if (this.apitoAudio) {
      this.apitoAudio.currentTime = 0;
      this.apitoAudio.play().catch(err => console.error('Erro ao reproduzir áudio:', err));
    }
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
      this.hubConnection.invoke('SendText', message).catch((err: any) => console.error(err));
    }).catch(err => console.error(err));
  }

  receiveMessage(): Observable<{ content: string; isValid: boolean } | null> {
    return this.messageSubject.asObservable().pipe(
      filter((message) => typeof message === 'object'), // Filtra mensagens não vazias
      map((message: any) => {
        this.playApitoSound();
        return this.parseMessage(message);
      })
    );
  }
  
  private filterNonEmptyMessages(messages: any[]): { content: string; isValid: boolean }[] {
    return messages.filter((message) => message.trim() !== '').map((message) => JSON.parse(message));
  }
}
