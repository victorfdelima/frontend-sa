// ConsumidorComponent

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

    savedMessages.forEach((message: string) => {
      this.messages.push({ content: message, isValid: this.rabbitMQClientService.isValidMessage(message) });
    });

    this.messageSubscription = this.rabbitMQClientService.receiveMessage().subscribe((message: string) => {
      const existingMessage = this.messages.find((msg) => msg.content === message);
      if (!existingMessage) {
        const isValid = this.rabbitMQClientService.isValidMessage(message);
        this.messages.push({ content: message, isValid: isValid });
        this.rabbitMQClientService.saveMessage(message);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
