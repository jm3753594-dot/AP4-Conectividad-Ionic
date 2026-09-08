import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { OfflineStorageService } from './offline-storage';

describe('OfflineStorageService', () => {
  let service: OfflineStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
