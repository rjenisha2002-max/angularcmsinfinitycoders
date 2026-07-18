import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionService } from '../../services/reception-service';

@Component({
  selector: 'app-reception-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html'
})
export class ReceptionReports implements OnInit {
  filter = { reportType: 'Appointment', fromDate: '', toDate: '', doctorId: '', departmentId: '' };
  data: any = null;
  loading = true;
  error = '';

  constructor(private receptionService: ReceptionService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const params: any = {};
    Object.entries(this.filter).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    this.receptionService.getReceptionistReport(params).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load report.';
        this.loading = false;
      }
    });
  }
}
