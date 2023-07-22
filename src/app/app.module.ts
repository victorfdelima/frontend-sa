import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProdutorComponent } from './produtor/produtor.component';
import { ConsumidorComponent } from './consumidor/consumidor.component';

import { FormsModule } from '@angular/forms'; // Importe o FormsModule

@NgModule({
  declarations: [
    AppComponent,
    ProdutorComponent,
    ConsumidorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
