import { TestBed } from '@angular/core/testing';

import { Disponibilidades } from './disponibilidades';

describe('Disponibilidades', () => {
  let service: Disponibilidades;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Disponibilidades);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
