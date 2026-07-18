import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy-service';

@Component({
  selector: 'app-pharmacy-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescriptions.html'
})
export class PharmacyPrescriptions implements OnInit {
  prescriptions: any[] = [];
  loading = true;
  error = '';
  message = '';
  selected: any = null;
  selectedItems: any[] = [];

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.pharmacyService.getPrescriptions().subscribe({
      next: (res) => {
        this.prescriptions = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load prescriptions.';
        this.loading = false;
      }
    });
  }

  view(id: number): void {
    this.pharmacyService.getPrescriptionDetails(id).subscribe({
      next: (res) => {
        this.selected = res.prescription;
        this.selectedItems = res.items ?? [];
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to load details.')
    });
  }

  updateStatus(id: number, status: string): void {
    this.message = '';
    this.pharmacyService.updatePrescriptionStatus(id, status).subscribe({
      next: (res) => {
        this.message = res.message;
        this.load();
        if (this.selected?.prescriptionId === id) this.view(id);
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to update status.')
    });
  }
}
