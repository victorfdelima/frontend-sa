import { Component } from '@angular/core';
import { RabbitMQClientService } from '../rabbitmq-client.service';

@Component({
  selector: 'app-produtor',
  templateUrl: './produtor.component.html',
  styleUrls: ['./produtor.component.css']
})
export class ProdutorComponent {
  message = '';

  constructor(private rabbitMQClientService: RabbitMQClientService) { }

  generateRandomText() {
    this.message = this.generateRandomString(15, 20);
  }

  generateRandomString(minLength: number, maxLength: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&_';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }



  sendText() {
    if (!this.message) {
      alert('Digite um texto antes de enviar.');
      return;
    }

    this.rabbitMQClientService.sendMessage(this.message);
  }
}
