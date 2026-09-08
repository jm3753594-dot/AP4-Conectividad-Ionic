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

  /**
   * El servicio de red se declara como público
   * para que la plantilla HTML pueda consultar
   * el estado de conexión y los registros pendientes.
   */
  constructor(
    public networkService: NetworkService
  ) {

    /**
     * Inicia la detección del estado de la red
     * cuando se crea la página principal.
     */
    this.networkService
      .initializeNetworkStatus();
  }

  /**
   * Se ejecuta cuando el usuario pulsa
   * el botón "Tomar" de un medicamento.
   *
   * Envía el nombre del medicamento al servicio
   * encargado de decidir si debe procesarse
   * normalmente o guardarse de forma local.
   */
  takeMedication(
    medication: string
  ): void {

    console.log(
      'Botón Tomar pulsado:',
      medication
    );

    this.networkService
      .saveRecord(medication);
  }
}