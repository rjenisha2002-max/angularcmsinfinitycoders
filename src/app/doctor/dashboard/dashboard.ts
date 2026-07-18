import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class DoctorDashboard implements OnInit {
  doctorName = '';
  stats: any = {};
  loading = true;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getDashboard().subscribe({
      next: (res) => {
        this.doctorName = res.doctorName;
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
