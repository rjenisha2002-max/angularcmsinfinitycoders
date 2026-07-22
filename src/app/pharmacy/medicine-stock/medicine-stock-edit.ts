import { Component, OnInit, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PharmacyService } from '../services/pharmacy.service';
import { futureDateValidator, notFutureDateValidator } from '../validators/pharmacy-validators';

@Component({
  selector: 'app-medicine-stock-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './medicine-stock-edit.html',
  styleUrl: './medicine-stock.css'
})
export class MedicineStockEdit implements OnInit {
  form!: FormGroup;
  loading      = true;
  submitting   = false;
  errorMsg     = '';
  stockId      = 0;
  medicineName = '';
  batchNumber  = '';

  private destroyRef = inject(DestroyRef);
  private cdr        = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private pharmacyService: PharmacyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.stockId = +this.route.snapshot.paramMap.get('id')!;

    this.form = this.fb.group({
      medicineId:    [0],
      batchNumber:   [''],
      quantity:      [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]],
      purchasePrice: [null, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(999999.99)
      ]],
      expiryDate:    ['', [Validators.required, futureDateValidator]],
      purchaseDate:  ['', [notFutureDateValidator]]
    });

    this.pharmacyService.getStockById(this.stockId).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: (s) => {
        this.medicineName = s.medicineName ?? '';
        this.batchNumber  = s.batchNumber;
        this.form.patchValue({
          medicineId:    s.medicineId,
          batchNumber:   s.batchNumber,
          quantity:      s.quantity,
          purchasePrice: s.purchasePrice,
          expiryDate:    s.expiryDate   ? s.expiryDate.split('T')[0]   : '',
          purchaseDate:  s.purchaseDate ? s.purchaseDate.split('T')[0] : ''
        });
      },
      error: () => { this.errorMsg = 'Stock record not found or failed to load. Please go back and try again.'; }
    });
  }

  f(n: string) { return this.form.get(n); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.errorMsg   = '';

    this.pharmacyService.updateStock(this.stockId, this.form.value).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.submitting = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: () => this.router.navigate(['/pharmacy/stock']),
      error: (err) => {
        if (err?.error) {
          const errors = err.error.errors || err.error;
          const msgs: string[] = [];
          if (typeof errors === 'object') {
            Object.values(errors).forEach((v: any) => {
              if (Array.isArray(v)) msgs.push(...v); else msgs.push(String(v));
            });
          }
          this.errorMsg = msgs.length ? msgs.join(' | ') : (err.error?.message || 'Failed to update stock.');
        } else {
          this.errorMsg = 'Failed to update stock. Please try again.';
        }
      }
    });
  }
}
