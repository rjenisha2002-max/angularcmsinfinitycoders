import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionService } from '../../services/reception-service';

@Component({
  selector: 'app-reception-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html'
})
export class ReceptionAppointments implements OnInit {
  appointments: any[] = [];
  doctors: any[] = [];
  departments: any[] = [];
  loading = true;
  error = '';
  message = '';

  filter = { departmentId: '', doctorId: '', patientCode: '', fromDate: '', toDate: '' };

  showForm = false;
  createData: any = null;
  bookedSlots: string[] = [];
  newAppointment: any = { patientId: null, doctorId: null, appointmentDate: '', appointmentTime: '' };

  constructor(private receptionService: ReceptionService) {}

  ngOnInit(): void {
    this.load();
    this.receptionService.getDoctorsAndDepartments().subscribe((res) => {
      this.doctors = res.doctors ?? [];
      this.departments = res.departments ?? [];
    });
  }

  load(): void {
    this.loading = true;
    const f: any = {};
    Object.entries(this.filter).forEach(([k, v]) => {
      if (v) f[k] = v;
    });
    this.receptionService.getAppointments(f).subscribe({
      next: (res) => {
        this.appointments = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load appointments.';
        this.loading = false;
      }
    });
  }

  openBookingForm(): void {
    this.message = '';
    this.error = '';
    this.newAppointment = { patientId: null, doctorId: null, appointmentDate: '', appointmentTime: '' };
    this.bookedSlots = [];
    this.receptionService.getAppointmentCreateData().subscribe((res) => (this.createData = res));
    this.showForm = true;
  }

  onDoctorOrDateChange(): void {
    if (this.newAppointment.doctorId && this.newAppointment.appointmentDate) {
      this.receptionService.getBookedSlots(this.newAppointment.doctorId, this.newAppointment.appointmentDate).subscribe((slots) => {
        this.bookedSlots = slots ?? [];
      });
    }
  }

  book(): void {
    this.error = '';
    this.receptionService.createAppointment(this.newAppointment).subscribe({
      next: () => {
        this.message = 'Appointment booked successfully.';
        this.showForm = false;
        this.load();
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to book appointment.')
    });
  }

  cancel(id: number): void {
    if (!confirm('Cancel this appointment?')) return;
    this.receptionService.cancelAppointment(id).subscribe({
      next: () => this.load(),
      error: (err) => (this.error = err?.error?.message ?? 'Failed to cancel appointment.')
    });
  }
}
