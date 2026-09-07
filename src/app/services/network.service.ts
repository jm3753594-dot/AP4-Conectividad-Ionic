import { Service, signal } from '@angular/core';
import { Network } from '@capacitor/network';

@Service()
export class NetworkService {

  isOnline = signal(false);

  async initializeNetworkStatus() {
    // Consultar el estado de red al iniciar
    const status = await Network.getStatus();
    this.isOnline.set(status.connected);

    console.log('Estado inicial de la red:', status.connected);

    // Escuchar cambios de conexión en tiempo real
    await Network.addListener('networkStatusChange', status => {
      this.isOnline.set(status.connected);

      console.log('El estado de la red cambió:', status.connected);
    });
  }
}