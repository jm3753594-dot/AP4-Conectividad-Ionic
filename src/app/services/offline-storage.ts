import { Service } from '@angular/core';

/**
 * Define la estructura de cada registro
 * que puede quedar pendiente de sincronización.
 */
export interface PendingRecord {
  id: number;
  medication: string;
  createdAt: string;
}

@Service()
export class OfflineStorageService {

  /**
   * Clave utilizada para identificar
   * los registros pendientes dentro de localStorage.
   */
  private readonly storageKey = 'pendingRecords';

  /**
   * Recupera todos los registros pendientes
   * que se encuentran almacenados localmente.
   */
  getPendingRecords(): PendingRecord[] {

    const data = localStorage.getItem(
      this.storageKey
    );

    /**
     * Si no existen registros guardados,
     * se devuelve una lista vacía.
     */
    if (!data) {
      return [];
    }

    /**
     * Convierte nuevamente el texto JSON
     * almacenado en una lista de objetos.
     */
    return JSON.parse(data);
  }

  /**
   * Guarda un nuevo registro pendiente
   * dentro del almacenamiento local.
   */
  savePendingRecord(
    record: PendingRecord
  ): void {

    /**
     * Primero recupera los registros
     * que ya estaban almacenados.
     */
    const pendingRecords =
      this.getPendingRecords();

    // Agrega el nuevo registro a la lista.
    pendingRecords.push(record);

    /**
     * Convierte la lista en formato JSON
     * y la almacena nuevamente en localStorage.
     */
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(pendingRecords)
    );
  }

  /**
   * Elimina todos los registros pendientes.
   * Se utiliza después de completar
   * el proceso de sincronización.
   */
  clearPendingRecords(): void {
    localStorage.removeItem(
      this.storageKey
    );
  }
}
