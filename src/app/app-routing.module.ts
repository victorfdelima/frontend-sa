import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdutorComponent } from './produtor/produtor.component';
import { ConsumidorComponent } from './consumidor/consumidor.component';

const routes: Routes = [
  { path: 'produtor', component: ProdutorComponent },
  { path: 'consumidor', component: ConsumidorComponent },
  { path: '', redirectTo: '/produtor', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
