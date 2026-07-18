import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  availableSlots: string[] = [];
  filterDepartmentId: number | null = null;
  newAppointment: any = { patientId: null, doctorId: null, appointmentDate: '', appointmentTime: '' };

  // When arriving from Quick Search / Registration with a known patient
  lockedPatient: any = null;

  // Date policy: today or tomorrow only
  today = new Date().toISOString().substring(0, 10);
  maxDate = new Date(Date.now() + 86400000).toISOString().substring(0, 10);

  // Booking success (with token)
  bookingResult: any = null;

  constructor(private receptionService: ReceptionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.load();
    this.receptionService.getDoctorsAndDepartments().subscribe((res) => {
      this.doctors = res.doctors ?? [];
      this.departments = res.departments ?? [];
    });

    this.route.queryParams.subscribe((params) => {
      const patientId = params['patientId'] ? Number(params['patientId']) : null;
      if (patientId) {
        this.openBookingForm(patientId);
      }
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

  openBookingForm(patientId?: number): void {
    this.message = '';
    this.error = '';
    this.bookingResult = null;
    this.lockedPatient = null;
    this.newAppointment = { patientId: patientId ?? null, doctorId: null, appointmentDate: '', appointmentTime: '' };
    this.bookedSlots = [];

    this.receptionService.getAppointmentCreateData(patientId ?? undefined).subscribe((res) => {
      this.createData = res;
      if (patientId && res.selectedPatient) {
        this.lockedPatient = res.selectedPatient;
        this.newAppointment.patientId = res.selectedPatient.patientId;
      }
    });

    this.showForm = true;
  }

  // Doctors available for the currently selected department
  get doctorsInDepartment(): any[] {
    if (!this.createData?.doctors) return [];
    if (!this.filterDepartmentId) return this.createData.doctors;
    return this.createData.doctors.filter((d: any) => d.departmentId === this.filterDepartmentId);
  }

  onDepartmentChange(): void {
    this.newAppointment.doctorId = null;
    this.bookedSlots = [];
    this.availableSlots = [];
  }

  // 15-minute slot grid, 09:00–17:00, with booked ones hidden
  onDoctorOrDateChange(): void {
    this.availableSlots = [];
    if (this.newAppointment.doctorId && this.newAppointment.appointmentDate) {
      this.receptionService.getBookedSlots(this.newAppointment.doctorId, this.newAppointment.appointmentDate).subscribe((slots) => {
        this.bookedSlots = (slots ?? []).map((s) => s.substring(0, 5));
        this.availableSlots = this.generateSlots().filter((s) => !this.bookedSlots.includes(s));
      });
    }
  }

  private generateSlots(): string[] {
    const slots: string[] = [];
    for (let h = 9; h < 17; h++) {
      for (let m = 0; m < 60; m += 15) {
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  }

  pickSlot(slot: string): void {
    this.newAppointment.appointmentTime = slot;
  }

  book(): void {
    this.error = '';
    const payload = {
      ...this.newAppointment,
      appointmentTime:
        this.newAppointment.appointmentTime && this.newAppointment.appointmentTime.length === 5
          ? `${this.newAppointment.appointmentTime}:00`
          : this.newAppointment.appointmentTime
    };
    this.receptionService.createAppointment(payload).subscribe({
      next: (res) => {
        this.bookingResult = res;
        this.showForm = false;
        this.load();
      },
      error: (err) => (this.error = err?.error?.message ?? 'Failed to book appointment.')
    });
  }

  dismissBookingResult(): void {
    this.bookingResult = null;
  }

  cancel(id: number): void {
    if (!confirm('Cancel this appointment?')) return;
    this.receptionService.cancelAppointment(id).subscribe({
      next: () => this.load(),
      error: (err) => (this.error = err?.error?.message ?? 'Failed to cancel appointment.')
    });
  }
}