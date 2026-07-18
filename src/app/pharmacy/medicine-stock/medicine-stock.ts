import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy-service';

const EMPTY_STOCK = {
  stockId: 0,
  medicineId: null,
  batchNumber: '',
  quantity: 0,
  purchasePrice: null,
  expiryDate: '',
  purchaseDate: ''
};

@Component({
  selector: 'app-pharmacy-medicine-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-stock.html'
})
export class PharmacyMedicineStock implements OnInit {
  view: 'all' | 'low' | 'expiring' | 'expired' = 'all';
  stock: any[] = [];
  loading = true;
  error = '';
  message = '';

  showForm = false;
  isEditMode = false;
  form: any = { ...EMPTY_STOCK };
  medicines: any[] = [];

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const obs =
      this.view === 'low'
        ? this.pharmacyService.getLowStock()
        : this.view === 'expiring'
        ? this.pharmacyService.getExpiring()
        : this.view === 'expired'
        ? this.pharmacyService.getExpired()
        : this.pharmacyService.getStock();

    obs.subscribe({
      next: (res) => {
        this.stock = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load stock.';
        this.loading = false;
      }
    });
  }

  switchView(v: 'all' | 'low' | 'expiring' | 'expired'): void {
    this.view = v;
    this.load();
  }

  openAddForm(): void {
    this.isEditMode = false;
    this.form = { ...EMPTY_STOCK };
    this.error = '';
    this.message = '';
    this.pharmacyService.getNewStockMeta().subscribe((res) => (this.medicines = res.medicines ?? []));
    this.showForm = true;
  }

  openEditForm(row: any): void {
    this.isEditMode = true;
    this.error = '';
    this.message = '';
    this.pharmacyService.getStockById(row.stockId).subscribe((res) => {
      this.form = {
        ...res,
        expiryDate: res.expiryDate ? res.expiryDate.substring(0, 10) : '',
        purchaseDate: res.purchaseDate ? res.purchaseDate.substring(0, 10) : ''
      };
    });
    this.pharmacyService.getNewStockMeta().subscribe((res) => (this.medicines = res.medicines ?? []));
    this.showForm = true;
  }

  save(): void {
    this.error = '';
    const action = this.isEditMode
      ? this.pharmacyService.updateStock(this.form.stockId, this.form)
      : this.pharmacyService.createStock(this.form);

    action.subscribe({
      next: (res) => {
        this.message = res.message;
        this.showForm = false;
        this.load();
      },
      error: (err) => (this.error = this.formatError(err))
    });
  }

  private formatError(err: any): string {
    const body = err?.error;
    if (body?.message) return body.message;
    if (body && typeof body === 'object') {
      const messages = Object.values(body).flat();
      if (messages.length) return messages.join(' | ');
    }
    return 'Failed to save stock.';
  }
}
