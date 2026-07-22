import { Component, OnInit, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PharmacyService } from '../services/pharmacy.service';
import { Prescription } from '../models/prescription.model';

@Component({
  selector: 'app-dispensing-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dispensing-create.html',
  styleUrl: './dispensing-create.css'
})
export class DispensingCreate implements OnInit {
  prescriptions:         Prescription[] = [];
  loading                = true;
  dispensing             = false;
  selectedPrescriptionId = 0;
  remarks                = '';
  error                  = '';
  successMsg             = '';

  private destroyRef = inject(DestroyRef);
  private cdr        = inject(ChangeDetectorRef);

  constructor(private pharmacyService: PharmacyService, private router: Router) {}

  ngOnInit(): void {
    this.pharmacyService.getDispensablePrescriptions().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: (data) => { this.prescriptions = data; },
      error: (err) => {
        this.error = err?.status === 401
          ? 'Session expired. Please log in again.'
          : 'Failed to load pending prescriptions. Please try again.';
      }
    });
  }

  refNo(id: number): string { return `RX-${String(id).padStart(5, '0')}`; }

  dispense(): void {
    if (!this.selectedPrescriptionId) { this.error = 'Please select a prescription to dispense.'; return; }
    this.dispensing = true;
    this.error      = '';

    this.pharmacyService.dispenseAndBill(
      +this.selectedPrescriptionId,
      this.remarks || undefined
    ).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.dispensing = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: (res) => { this.router.navigate(['/pharmacy/bills', res.result.billId]); },
      error: (err) => { this.error = err?.error?.message || 'Failed to dispense prescription. Please try again.'; }
    });
  }
}
