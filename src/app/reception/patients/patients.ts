import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionService } from '../../services/reception-service';

const EMPTY_PATIENT = {
  patientId: 0,
  fullName: '',
  gender: '',
  dob: '',
  bloodGroup: '',
  mobileNumber: '',
  email: '',
  address: '',
  emergencyContactNumber: ''
};

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
  isEditMode = false;
  form: any = { ...EMPTY_PATIENT };

  constructor(private receptionService: ReceptionService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.receptionService.getAllPatients().subscribe({
      next: (res) => {
        this.patients = res ?? [];
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
    this.receptionService.searchPatients(this.searchBy, this.searchText).subscribe({
      next: (res) => {
        this.patients = res.results ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Search failed.';
        this.loading = false;
      }
    });
  }

  openAddForm(): void {
    this.isEditMode = false;
    this.form = { ...EMPTY_PATIENT };
    this.message = '';
    this.error = '';
    this.showForm = true;
  }

  openEditForm(patient: any): void {
    this.isEditMode = true;
    this.form = {
      ...patient,
      dob: patient.dob ? patient.dob.substring(0, 10) : ''
    };
    this.message = '';
    this.error = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
  }

  save(): void {
    this.error = '';
    this.message = '';

    const payload = { ...this.form };

    if (this.isEditMode) {
      this.receptionService.updatePatient(payload.patientId, payload).subscribe({
        next: (res) => {
          this.message = res.message;
          this.showForm = false;
          this.loadAll();
        },
        error: (err) => (this.error = err?.error?.message ?? 'Failed to update patient.')
      });
    } else {
      this.receptionService.createPatient(payload).subscribe({
        next: (res) => {
          this.message = `Patient registered successfully. Code: ${res.patientCode}`;
          this.showForm = false;
          this.loadAll();
        },
        error: (err) => (this.error = err?.error?.message ?? 'Failed to register patient.')
      });
    }
  }
}
