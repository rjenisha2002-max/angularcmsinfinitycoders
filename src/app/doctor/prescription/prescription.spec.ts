import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prescription } from './prescription';

describe('Prescription', () => {
  let component: Prescription;
  let fixture: ComponentFixture<Prescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prescription],
    }).compileComponents();

    fixture = TestBed.createComponent(Prescription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
