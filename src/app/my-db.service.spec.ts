import { TestBed } from '@angular/core/testing';

import { MyDBService } from './my-db.service';

describe('MyDBService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyDBService = TestBed.get(MyDBService);
    expect(service).toBeTruthy();
  });
});
