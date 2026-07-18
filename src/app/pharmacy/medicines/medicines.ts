import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy-service';

const EMPTY_MEDICINE = {
  medicineId: 0,
  medicineCode: '',
  medicineName: '',
  categoryId: null,
  manufacturerId: null,
  unitPrice: 0,
  reorderLevel: 10,
  isActive: true
};

@Component({
  selector: 'app-pharmacy-medicines',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicines.html'
})
export class PharmacyMedicines implements OnInit {
  medicines: any[] = [];
  searchTerm = '';
  loading = true;
  error = '';
  message = '';

  showForm = false;
  isEditMode = false;
  form: any = { ...EMPTY_MEDICINE };
  categories: any[] = [];
  manufacturers: any[] = [];

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.pharmacyService.getMedicines(this.searchTerm).subscribe({
      next: (res) => {
        this.medicines = res.medicines ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load medicines.';
        this.loading = false;
      }
    });
  }

  openAddForm(): void {
    this.isEditMode = false;
    this.form = { ...EMPTY_MEDICINE };
    this.error = '';
    this.message = '';
    this.pharmacyService.getNewMedicineMeta().subscribe((res) => {
      this.categories = res.categories ?? [];
      this.manufacturers = res.manufacturers ?? [];
      this.form.medicineCode = res.nextMedicineCode ?? '';
    });
    this.showForm = true;
  }

  openEditForm(medicine: any): void {
    this.isEditMode = true;
    this.error = '';
    this.message = '';
    this.pharmacyService.getMedicine(medicine.medicineId).subscribe((res) => {
      this.categories = res.categories ?? [];
      this.manufacturers = res.manufacturers ?? [];
      this.form = { ...res.medicine };
    });
    this.showForm = true;
  }

  save(): void {
    this.error = '';
    if (this.isEditMode) {
      this.pharmacyService.updateMedicine(this.form.medicineId, this.form).subscribe({
        next: (res) => {
          this.message = res.message;
          this.showForm = false;
          this.load();
        },
        error: (err) => (this.error = err?.error?.message ?? this.formatModelStateError(err) ?? 'Failed to update medicine.')
      });
    } else {
      this.pharmacyService.createMedicine(this.form).subscribe({
        next: (res) => {
          this.message = res.message;
          this.showForm = false;
          this.load();
        },
        error: (err) => (this.error = err?.error?.message ?? this.formatModelStateError(err) ?? 'Failed to add medicine.')
      });
    }
  }

  disable(id: number): void {
    if (!confirm('Disable this medicine?')) return;
    this.pharmacyService.disableMedicine(id).subscribe({
      next: () => this.load(),
      error: (err) => (this.error = err?.error?.message ?? 'Failed to disable medicine.')
    });
  }

  private formatModelStateError(err: any): string | null {
    const body = err?.error;
    if (body && typeof body === 'object' && !body.message) {
      const messages = Object.values(body).flat();
      if (messages.length) return messages.join(' | ');
    }
    return null;
  }
}
