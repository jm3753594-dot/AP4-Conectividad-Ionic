import { Service } from '@angular/core';

export interface PendingRecord {
  id: number;
  medication: string;
  createdAt: string;
}

@Service()
export class OfflineStorageService {

  private readonly storageKey = 'pendingRecords';

  getPendingRecords(): PendingRecord[] {
    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  }

  savePendingRecord(record: PendingRecord): void {
    const pendingRecords = this.getPendingRecords();

    pendingRecords.push(record);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(pendingRecords)
    );
  }

  clearPendingRecords(): void {
    localStorage.removeItem(this.storageKey);
  }
}
