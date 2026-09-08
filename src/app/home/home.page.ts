import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/angular';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
  ],
})
export class HomePage {

  constructor(public networkService: NetworkService) {
    this.networkService.initializeNetworkStatus();
  }

  takeMedication(medication: string): void {
    console.log('Botón Tomar pulsado:', medication);

    this.networkService.saveRecord(medication);
  }
}