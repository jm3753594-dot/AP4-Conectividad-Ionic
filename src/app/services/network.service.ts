import { Service, inject, signal } from '@angular/core';
import { Network } from '@capacitor/network';
import {
  OfflineStorageService,
  PendingRecord
} from './offline-storage';

@Service()
export class NetworkService {

  // Inyecta el servicio encargado de administrar
  // los registros almacenados localmente.
  private offlineStorageService = inject(OfflineStorageService);

  // Señal reactiva que almacena el estado actual de la conexión.
  // true = conectado / false = sin conexión.
  isOnline = signal(false);

  // Mantiene la cantidad de registros que permanecen
  // pendientes de sincronización.
  pendingCount = signal(0);

  /**
   * Inicializa el monitoreo del estado de la red.
   * Primero obtiene el estado actual y luego escucha
   * cualquier cambio de conectividad en tiempo real.
   */
  async initializeNetworkStatus(): Promise<void> {

    // Obtiene el estado de conexión existente
    // en el momento de iniciar la aplicación.
    const status = await Network.getStatus();

    this.isOnline.set(status.connected);

    // Actualiza la cantidad de registros pendientes
    // que puedan existir en el almacenamiento local.
    this.updatePendingCount();

    console.log(
      'Estado inicial de la red:',
      status.connected
    );

    /**
     * Escucha los cambios de conectividad.
     * Se ejecuta cuando el dispositivo pierde
     * o recupera la conexión.
     */
    await Network.addListener(
      'networkStatusChange',
      status => {

        this.isOnline.set(status.connected);

        console.log(
          'El estado de la red cambió:',
          status.connected
        );

        /**
         * Si la conexión se recupera,
         * se intenta sincronizar automáticamente
         * la información guardada localmente.
         */
        if (status.connected) {
          this.syncPendingRecords();
        }
      }
    );
  }

  /**
   * Procesa el registro de un medicamento.
   * Dependiendo del estado de la red,
   * el registro se procesa normalmente
   * o se guarda temporalmente de forma local.
   */
  saveRecord(medication: string): void {

    console.log(
      'Botón Tomar ejecutado:',
      medication
    );

    // Crea el registro que representa
    // la acción realizada por el usuario.
    const record: PendingRecord = {
      id: Date.now(),
      medication: medication,
      createdAt: new Date().toISOString()
    };

    /**
     * Si existe conexión, el registro sigue
     * el flujo normal de procesamiento.
     *
     * En esta versión académica el envío al servidor
     * se representa mediante un mensaje en consola,
     * ya que no se dispone de una API o backend.
     */
    if (this.isOnline()) {

      console.log(
        'Registro enviado normalmente:',
        record
      );

      return;
    }

    /**
     * Si no existe conexión, el registro se guarda
     * localmente para evitar la pérdida de información.
     */
    this.offlineStorageService
      .savePendingRecord(record);

    // Actualiza inmediatamente el contador
    // mostrado en la interfaz.
    this.updatePendingCount();

    console.log(
      'Registro guardado localmente:',
      record
    );
  }

  /**
   * Recupera los registros almacenados sin conexión
   * y ejecuta el proceso de sincronización cuando
   * el dispositivo vuelve a estar conectado.
   */
  private syncPendingRecords(): void {

    const pendingRecords =
      this.offlineStorageService
        .getPendingRecords();

    // Si no existen datos pendientes,
    // no es necesario realizar ninguna acción.
    if (pendingRecords.length === 0) {
      return;
    }

    /**
     * Simula el envío de cada registro pendiente.
     * En una implementación con backend real,
     * aquí se realizarían las solicitudes HTTP
     * correspondientes al servidor.
     */
    pendingRecords.forEach(record => {

      console.log(
        'Sincronizando registro pendiente:',
        record
      );
    });

    /**
     * Una vez completada la sincronización simulada,
     * se eliminan los registros pendientes
     * almacenados localmente.
     */
    this.offlineStorageService
      .clearPendingRecords();

    this.updatePendingCount();

    console.log(
      'Sincronización completada correctamente.'
    );
  }

  /**
   * Consulta cuántos registros se encuentran
   * almacenados localmente y actualiza
   * el contador reactivo de la interfaz.
   */
  private updatePendingCount(): void {

    const pendingRecords =
      this.offlineStorageService
        .getPendingRecords();

    this.pendingCount.set(
      pendingRecords.length
    );
  }
}