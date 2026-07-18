import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabService } from '../../services/lab-service';

@Component({
  selector: 'app-lab-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-search.html'
})
export class LabPatientSearch {
  term = '';
  results: any[] = [];
  loading = false;
  error = '';

  constructor(private labService: LabService) {}

  search(): void {
    if (!this.term.trim()) return;
    this.loading = true;
    this.labService.searchPatientByMmr(this.term).subscribe({
      next: (res) => {
        this.results = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Search failed.';
        this.loading = false;
      }
    });
  }
}
