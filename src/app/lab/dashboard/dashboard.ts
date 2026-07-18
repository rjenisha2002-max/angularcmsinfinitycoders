import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LabService } from '../../services/lab-service';

@Component({
  selector: 'app-lab-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class LabDashboard implements OnInit {
  technicianName = '';
  stats: any = {};
  loading = true;
  error = '';

  constructor(private labService: LabService) {}

  ngOnInit(): void {
    this.labService.getDashboard().subscribe({
      next: (res) => {
        this.technicianName = res.technicianName;
        this.stats = res.stats ?? {};
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load dashboard.';
        this.loading = false;
      }
    });
  }
}
