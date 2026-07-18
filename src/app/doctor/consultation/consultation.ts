import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';

@Component({
  selector: 'app-doctor-consultation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultation.html'
})
export class DoctorConsultation implements OnInit {
  appointmentId = 0;
  model: any = null;
  selectedLabTests: number[] = [];
  prescriptionItems: any[] = [];
  loading = true;
  saving = false;
  error = '';
  summary: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('appointmentId'));
    this.doctorService.getConsultationSetup(this.appointmentId).subscribe({
      next: (res) => {
        this.model = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load consultation.';
        this.loading = false;
      }
    });
  }

  toggleLabTest(testId: number, checked: boolean): void {
    if (checked) {
      this.selectedLabTests.push(testId);
    } else {
      this.selectedLabTests = this.selectedLabTests.filter((id) => id !== testId);
    }
  }

  addPrescriptionItem(): void {
    this.prescriptionItems.push({ medicineId: null, dosage: '', frequency: '', duration: '', quantity: 1, instructions: '' });
  }

  removePrescriptionItem(index: number): void {
    this.prescriptionItems.splice(index, 1);
  }

  submit(): void {
    this.error = '';
    this.saving = true;

    const payload = {
      appointmentId: this.appointmentId,
      mmrCode: this.model.mmrCode,
      fullName: this.model.fullName,
      gender: this.model.gender,
      age: this.model.age,
      mobileNumber: this.model.mobileNumber,
      symptoms: this.model.symptoms,
      diagnosis: this.model.diagnosis,
      notes: this.model.notes,
      followUpDate: this.model.followUpDate || null,
      selectedLabTests: this.selectedLabTests,
      prescriptionItems: this.prescriptionItems
    };

    this.doctorService.submitConsultation(payload).subscribe({
      next: (res) => {
        this.saving = false;
        this.summary = res;
      },
      error: (err) => {
        this.saving = false;
        const errs = err?.error?.errors;
        this.error = errs ? Object.values(errs).flat().join(' | ') : err?.error?.message ?? 'Failed to save consultation.';
      }
    });
  }

  backToAppointments(): void {
    this.router.navigate(['/doctor/appointments']);
  }
}
