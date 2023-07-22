// consumidor.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { RabbitMQClientService } from '../rabbitmq-client.service';
import { Subscription } from 'rxjs';

interface MessageInfo {
  content: string;
  isValid: boolean;
}

@Component({
  selector: 'app-consumidor',
  templateUrl: './consumidor.component.html',
  styleUrls: ['./consumidor.component.css']
})
export class ConsumidorComponent implements OnInit, OnDestroy {
  messages: MessageInfo[] = [];
  private messageSubscription: Subscription | undefined;

  constructor(private rabbitMQClientService: RabbitMQClientService) { }

  ngOnInit(): void {
    const savedMessages = this.rabbitMQClientService.getSavedMessages();

    savedMessages.forEach((message: MessageInfo) => {
      this.messages.push({ ...message });
    });

    this.messageSubscription = this.rabbitMQClientService.receiveMessage().subscribe((message: MessageInfo) => {
      const existingMessage = this.messages.find((msg) => msg.content === message.content);
      if (!existingMessage) {
        this.messages.push({ ...message });
        this.rabbitMQClientService.saveMessage(message);
      }
    });
  }
  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  clearMessages(): void {
    this.messages = [];
    localStorage.removeItem('messages');
  }
}
