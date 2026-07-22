import { Component, OnInit, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PharmacyService } from '../services/pharmacy.service';
import { Prescription, PrescriptionItem } from '../models/prescription.model';

@Component({
  selector: 'app-prescription-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './prescription-details.html',
  styleUrl: './prescription-list.css'
})
export class PrescriptionDetails implements OnInit {
  prescription: Prescription | null = null;
  items:        PrescriptionItem[]  = [];
  loading        = true;
  error          = '';
  successMsg     = '';
  updatingStatus = false;

  private destroyRef = inject(DestroyRef);
  private cdr        = inject(ChangeDetectorRef);

  constructor(
    private pharmacyService: PharmacyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    this.pharmacyService.getPrescriptionDetails(id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: (res) => { this.prescription = res.prescription; this.items = res.items; },
      error: () => { this.error = 'Prescription not found or failed to load. Please go back and try again.'; }
    });
  }

  refNo(id: number): string { return `RX-${String(id).padStart(5, '0')}`; }

  statusClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'dispensed': return 'badge-success';
      case 'pending':   return 'badge-warn';
      case 'cancelled': return 'badge-danger';
      default:          return 'badge-gray';
    }
  }

  markDispensed(): void {
    if (!this.prescription) return;
    this.updatingStatus = true;
    this.error          = '';
    this.successMsg     = '';

    this.pharmacyService.updatePrescriptionStatus(
      this.prescription.prescriptionId, 'Dispensed'
    ).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.updatingStatus = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: (res) => {
        if (this.prescription) this.prescription.status = 'Dispensed';
        this.successMsg = res.message || 'Prescription marked as Dispensed.';
      },
      error: (err) => { this.error = err?.error?.message || 'Failed to update status. Please try again.'; }
    });
  }
}
