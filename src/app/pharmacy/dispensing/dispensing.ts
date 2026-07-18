import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy-service';

@Component({
  selector: 'app-pharmacy-dispensing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispensing.html'
})
export class PharmacyDispensing implements OnInit {
  tab: 'pending' | 'history' = 'pending';
  pending: any[] = [];
  history: any[] = [];
  loading = true;
  error = '';
  message = '';
  remarks: { [prescriptionId: number]: string } = {};
  historyItems: { [dispenseId: number]: any[] } = {};
  expandedDispenseId: number | null = null;

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.loadPending();
  }

  switchTab(tab: 'pending' | 'history'): void {
    this.tab = tab;
    if (tab === 'pending') this.loadPending();
    else this.loadHistory();
  }

  loadPending(): void {
    this.loading = true;
    this.pharmacyService.getPendingPrescriptions().subscribe({
      next: (res) => {
        this.pending = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load prescriptions.';
        this.loading = false;
      }
    });
  }

  loadHistory(): void {
    this.loading = true;
    this.pharmacyService.getDispensingHistory().subscribe({
      next: (res) => {
        this.history = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load history.';
        this.loading = false;
      }
    });
  }

  dispense(prescriptionId: number): void {
    this.message = '';
    this.error = '';
    this.pharmacyService.dispenseAndBill(prescriptionId, this.remarks[prescriptionId]).subscribe({
      next: (res) => {
        this.message = res.message;
        this.loadPending();
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to dispense.')
    });
  }

  toggleItems(dispenseId: number): void {
    if (this.expandedDispenseId === dispenseId) {
      this.expandedDispenseId = null;
      return;
    }
    this.expandedDispenseId = dispenseId;
    if (!this.historyItems[dispenseId]) {
      this.pharmacyService.getDispensingItems(dispenseId).subscribe((res) => (this.historyItems[dispenseId] = res ?? []));
    }
  }
}
