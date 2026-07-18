import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionService } from '../../services/reception-service';

@Component({
  selector: 'app-reception-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.html'
})
export class ReceptionBills implements OnInit {
  bills: any[] = [];
  loading = true;
  error = '';
  message = '';

  showForm = false;
  appointmentId: number | null = null;
  billPreview: any = null;
  amountReceived = 0;
  paymentMethod = 'Cash';

  selectedBill: any = null;

  constructor(private receptionService: ReceptionService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.receptionService.getAllBills().subscribe({
      next: (res) => {
        this.bills = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load bills.';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.showForm = true;
    this.billPreview = null;
    this.appointmentId = null;
    this.amountReceived = 0;
    this.error = '';
    this.message = '';
  }

  loadPreview(): void {
    if (!this.appointmentId) return;
    this.receptionService.getBillCreateData(this.appointmentId).subscribe({
      next: (res) => (this.billPreview = res),
      error: (err) => {
        this.billPreview = null;
        this.error = err?.error?.message ?? 'Could not load appointment.';
      }
    });
  }

  create(): void {
    if (!this.billPreview) return;
    this.receptionService
      .createBill({
        patientId: this.billPreview.patientId,
        appointmentId: this.billPreview.appointmentId,
        paymentMethod: this.paymentMethod,
        amountReceived: this.amountReceived
      })
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.showForm = false;
          this.load();
        },
        error: (err) => (this.error = err?.error?.message ?? 'Failed to create bill.')
      });
  }

  view(id: number): void {
    this.receptionService.getBillById(id).subscribe({
      next: (res) => (this.selectedBill = res),
      error: (err) => (this.error = err?.error?.message ?? 'Failed to load bill.')
    });
  }

  receivePayment(id: number, method: string): void {
    this.receptionService.receivePayment(id, method).subscribe({
      next: (res) => {
        this.message = res.message;
        this.load();
        if (this.selectedBill?.billId === id) this.view(id);
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to receive payment.')
    });
  }
}
