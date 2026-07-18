import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LabService } from '../../services/lab-service';

@Component({
  selector: 'app-lab-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.html'
})
export class LabResults implements OnInit {
  requestItemId = 0;
  model: any = null;
  alreadyEntered = false;
  loading = true;
  saving = false;
  error = '';
  successMessage = '';

  constructor(private route: ActivatedRoute, private router: Router, private labService: LabService) {}

  ngOnInit(): void {
    this.requestItemId = Number(this.route.snapshot.paramMap.get('requestItemId'));
    this.labService.getResultEntryForm(this.requestItemId).subscribe({
      next: (res) => {
        if (res.message && res.data) {
          this.alreadyEntered = true;
          this.model = res.data;
        } else {
          this.model = res;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load result form.';
        this.loading = false;
      }
    });
  }

  submit(): void {
    this.saving = true;
    this.error = '';
    this.labService.saveResult(this.model).subscribe({
      next: (res) => {
        this.saving = false;
        this.successMessage = res.message;
      },
      error: (err) => {
        this.saving = false;
        const errs = err?.error?.errors;
        this.error = errs ? errs.join(' | ') : err?.error?.message ?? 'Failed to save result.';
      }
    });
  }

  backToPending(): void {
    this.router.navigate(['/lab/pending-tests']);
  }
}
