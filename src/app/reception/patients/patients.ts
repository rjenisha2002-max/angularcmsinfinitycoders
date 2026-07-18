import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReceptionService } from '../../services/reception-service';

@Component({
  selector: 'app-reception-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html'
})
export class ReceptionPatients implements OnInit {
  patients: any[] = [];
  searchBy = 'MMR';
  searchText = '';
  loading = true;
  error = '';
  message = '';

  showForm = false;
  form: any = {};
  age: number | null = null;

  // Optional columns are hidden from the table when every visible
  // patient has a blank value for them, so the table doesn't overflow
  // with columns nobody has filled in yet.
  columnVisibility = {
    email: true,
    alternateMobile: true,
    bloodGroup: true,
    aadhaarNumber: true,
    address: true,
    city: true,
    state: true,
    pincode: true,
    emergencyContact: true
  };

  constructor(
    private receptionService: ReceptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.receptionService.getAllPatients().subscribe({
      next: (res) => {
        this.patients = res ?? [];
        this.updateColumnVisibility();
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load patients.';
        this.loading = false;
      }
    });
  }

  search(): void {
    if (!this.searchText.trim()) {
      this.loadAll();
      return;
    }
    this.loading = true;
    this.receptionService.searchPatients(this.searchText).subscribe({
      next: (res) => {
        this.patients = res.patients ?? [];
        this.updateColumnVisibility();
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Search failed.';
        this.loading = false;
      }
    });
  }

  private updateColumnVisibility(): void {
    const anyHasValue = (field: string) =>
      this.patients.some((p) => {
        const v = p?.[field];
        return v !== null && v !== undefined && String(v).trim().length > 0;
      });

    this.columnVisibility = {
      email: anyHasValue('email'),
      alternateMobile: anyHasValue('alternateMobile'),
      bloodGroup: anyHasValue('bloodGroup'),
      aadhaarNumber: anyHasValue('aadhaarNumber'),
      address: anyHasValue('address'),
      city: anyHasValue('city'),
      state: anyHasValue('state'),
      pincode: anyHasValue('pincode'),
      emergencyContact: this.patients.some(
        (p) => p?.emergencyContactNumber || p?.emergencyContactName
      )
    };
  }

  clearSearch(): void {
    this.searchText = '';
    this.loadAll();
  }

  goToRegister(): void {
    this.router.navigate(['/reception/register-patient']);
  }

  bookAppointment(patient: any): void {
    this.router.navigate(['/reception/appointments'], {
      queryParams: { patientId: patient.patientId }
    });
  }

  openEditForm(patient: any): void {
    this.form = {
      ...patient,
      dob: patient.dob ? patient.dob.substring(0, 10) : ''
    };
    this.age = patient.age ?? null;
    this.message = '';
    this.error = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
  }

  // Real-time age calculation as DOB changes, readonly Age box
  onDobChange(): void {
    if (!this.form.dob) {
      this.age = null;
      return;
    }
    const dob = new Date(this.form.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    this.age = age;
  }

  save(): void {
    this.error = '';
    this.message = '';

    const payload = { ...this.form };

    this.receptionService.updatePatient(payload.patientId, payload).subscribe({
      next: (res) => {
        this.message = res.message;
        this.showForm = false;
        this.loadAll();
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to update patient.')
    });
  }
}