import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProgramador } from './admin-programador';

describe('AdminProgramador', () => {
  let component: AdminProgramador;
  let fixture: ComponentFixture<AdminProgramador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProgramador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProgramador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
