import { Service, inject, signal } from '@angular/core';
import { Network } from '@capacitor/network';
import {
  OfflineStorageService,
  PendingRecord
} from './offline-storage';

@Service()
export class NetworkService {

  private offlineStorageService = inject(OfflineStorageService);

  isOnline = signal(false);
  pendingCount = signal(0);

  async initializeNetworkStatus() {
    const status = await Network.getStatus();

    this.isOnline.set(status.connected);
    this.updatePendingCount();

    console.log('Estado inicial de la red:', status.connected);

    await Network.addListener('networkStatusChange', status => {
      this.isOnline.set(status.connected);

      console.log(
        'El estado de la red cambió:',
        status.connected
      );

      if (status.connected) {
        this.syncPendingRecords();
      }
    });
  }

  saveRecord(medication: string): void {
    console.log('Botón Tomar ejecutado:', medication);

    const record: PendingRecord = {
      id: Date.now(),
      medication: medication,
      createdAt: new Date().toISOString()
    };

    if (this.isOnline()) {
      console.log(
        'Registro enviado normalmente:',
        record
      );

      return;
    }

    this.offlineStorageService.savePendingRecord(record);

    this.updatePendingCount();

    console.log(
      'Registro guardado localmente:',
      record
    );
  }

  private syncPendingRecords(): void {
    const pendingRecords =
      this.offlineStorageService.getPendingRecords();

    if (pendingRecords.length === 0) {
      return;
    }

    pendingRecords.forEach(record => {
      console.log(
        'Sincronizando registro pendiente:',
        record
      );
    });

    this.offlineStorageService.clearPendingRecords();

    this.updatePendingCount();

    console.log(
      'Sincronización completada correctamente.'
    );
  }

  private updatePendingCount(): void {
    const pendingRecords =
      this.offlineStorageService.getPendingRecords();

    this.pendingCount.set(pendingRecords.length);
  }
}