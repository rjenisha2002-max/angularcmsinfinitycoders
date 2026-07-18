import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy-service';

@Component({
  selector: 'app-pharmacy-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html'
})
export class PharmacyReports implements OnInit {
  report: 'sales' | 'medicinewise' | 'stock' | 'expiry' | 'lowstock' | 'dispensing' = 'sales';
  fromDate = '';
  toDate = '';
  days = 30;
  data: any[] = [];
  loading = true;
  error = '';

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.pharmacyService.getReport(this.report, this.fromDate, this.toDate, this.days).subscribe({
      next: (res) => {
        this.data = res.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load report.';
        this.loading = false;
      }
    });
  }

  exportUrl(): string {
    return this.pharmacyService.exportReportUrl(this.report, this.fromDate, this.toDate, this.days);
  }
}
