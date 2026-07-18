import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReceptionService } from '../../services/reception-service';

@Component({
  selector: 'app-reception-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class ReceptionDashboard implements OnInit {
  data: any = {};
  loading = true;
  error = '';

  // ---- Search patient (Quick Search) ----
  searchBy: 'MMR' | 'Mobile' | 'Name' = 'MMR';
  searchText = '';
  patients: any[] = [];
  patientsLoading = false;
  searched = false;
  noResultsFor: string | null = null;

  // ---- Today's Appointments preview ----
  todaysAppointments: any[] = [];
  appointmentsLoading = true;

  constructor(private receptionService: ReceptionService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadTodaysAppointments();
  }

  loadDashboard(): void {
    this.loading = true;
    this.receptionService.getDashboard().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load dashboard.';
        this.loading = false;
      }
    });
  }

  loadTodaysAppointments(): void {
    this.appointmentsLoading = true;
    const today = new Date().toISOString().substring(0, 10);
    this.receptionService.getAppointments({ fromDate: today, toDate: today }).subscribe({
      next: (res) => {
        this.todaysAppointments = (res ?? []).slice(0, 3);
        this.appointmentsLoading = false;
      },
      error: () => {
        this.todaysAppointments = [];
        this.appointmentsLoading = false;
      }
    });
  }

  quickSearch(): void {
    const term = this.searchText.trim();

    if (!term) {
      this.searched = false;
      this.patients = [];
      this.noResultsFor = null;
      return;
    }

    this.patientsLoading = true;
    this.receptionService.searchPatients(term).subscribe({
      next: (res) => {
        this.patients = res?.found ? (res.patients ?? []) : [];
        this.noResultsFor = res?.found ? null : term;
        this.patientsLoading = false;
        this.searched = true;
      },
      error: () => {
        this.patients = [];
        this.noResultsFor = term;
        this.patientsLoading = false;
        this.searched = true;
      }
    });
  }

  clearSearch(): void {
    this.searchText = '';
    this.patients = [];
    this.noResultsFor = null;
    this.searched = false;
  }

  bookForPatient(patient: any): void {
    this.router.navigate(['/reception/appointments'], {
      queryParams: { patientId: patient.patientId }
    });
  }

  registerNew(): void {
    const queryParams: any = {};

    if (this.searchBy === 'Mobile' && /^[0-9]{10}$/.test(this.searchText.trim())) {
      queryParams.prefillMobile = this.searchText.trim();
    } else if (this.searchBy === 'Name') {
      queryParams.prefillName = this.searchText.trim();
    }

    this.router.navigate(['/reception/register-patient'], { queryParams });
  }
}