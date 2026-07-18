import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor-service';

@Component({
  selector: 'app-doctor-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-search.html'
})
export class DoctorPatientSearch {
  searchKeyword = '';
  results: any[] = [];
  report: any = null;
  loading = false;
  error = '';

  constructor(private doctorService: DoctorService) {}

  search(): void {
    this.loading = true;
    this.error = '';
    this.report = null;
    this.doctorService.searchPatients(this.searchKeyword).subscribe({
      next: (res) => {
        this.results = res.results ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Search failed.';
        this.loading = false;
      }
    });
  }

  viewReport(mmrCode: string): void {
    this.loading = true;
    this.doctorService.getPatientReport(mmrCode).subscribe({
      next: (res) => {
        this.report = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load report.';
        this.loading = false;
      }
    });
  }
}
