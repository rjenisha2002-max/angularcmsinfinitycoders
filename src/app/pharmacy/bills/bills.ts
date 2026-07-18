import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy-service';

@Component({
  selector: 'app-pharmacy-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.html'
})
export class PharmacyBills implements OnInit {
  bills: any[] = [];
  loading = true;
  error = '';
  message = '';

  showForm = false;
  patients: any[] = [];
  medicines: any[] = [];
  newBill: any = { patientId: null, billItems: [] as any[] };
  cancelReasons: { [billId: number]: string } = {};

  selectedBill: any = null;
  selectedItems: any[] = [];
  prescriptionLink: any = null;

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.pharmacyService.getBills().subscribe({
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
    this.error = '';
    this.message = '';
    this.newBill = { patientId: null, billItems: [] };
    this.pharmacyService.getNewBillMeta().subscribe((res) => {
      this.patients = res.patients ?? [];
      this.medicines = res.medicines ?? [];
    });
    this.showForm = true;
  }

  addItemRow(): void {
    this.newBill.billItems.push({ medicineId: null, quantity: 1 });
  }

  removeItemRow(index: number): void {
    this.newBill.billItems.splice(index, 1);
  }

  medicinePrice(medicineId: number): number {
    return this.medicines.find((m) => m.medicineId === medicineId)?.unitPrice ?? 0;
  }

  lineTotal(item: any): number {
    return this.medicinePrice(item.medicineId) * (item.quantity || 0);
  }

  get grandTotal(): number {
    return this.newBill.billItems.reduce((sum: number, i: any) => sum + this.lineTotal(i), 0);
  }

  create(): void {
    this.error = '';
    const payload = {
      patientId: this.newBill.patientId,
      billItems: this.newBill.billItems.map((i: any) => ({
        medicineId: i.medicineId,
        quantity: i.quantity,
        unitPrice: this.medicinePrice(i.medicineId),
        amount: this.lineTotal(i)
      })),
      totalAmount: this.grandTotal
    };

    this.pharmacyService.createBill(payload).subscribe({
      next: (res) => {
        this.message = res.message;
        this.showForm = false;
        this.load();
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to create bill.')
    });
  }

  view(id: number): void {
    this.pharmacyService.getBillDetails(id).subscribe({
      next: (res) => {
        this.selectedBill = res.bill;
        this.selectedItems = res.items ?? [];
        this.prescriptionLink = res.prescriptionLink;
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to load bill.')
    });
  }

  cancel(id: number): void {
    this.pharmacyService.cancelBill(id, this.cancelReasons[id]).subscribe({
      next: (res) => {
        this.message = res.message;
        this.load();
        if (this.selectedBill?.billId === id) this.selectedBill = null;
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to cancel bill.')
    });
  }

  invoicePdfUrl(id: number): string {
    return this.pharmacyService.invoicePdfUrl(id);
  }
}
