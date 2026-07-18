import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy-service';

@Component({
  selector: 'app-pharmacy-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.html'
})
export class PharmacyLogs implements OnInit {
  tab: 'inventory' | 'audit' = 'inventory';
  inventoryLogs: any[] = [];
  auditLogs: any[] = [];
  fromDate = '';
  toDate = '';
  loading = true;
  error = '';

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  switchTab(tab: 'inventory' | 'audit'): void {
    this.tab = tab;
    if (tab === 'inventory') this.loadInventory();
    else this.loadAudit();
  }

  loadInventory(): void {
    this.loading = true;
    this.pharmacyService.getInventoryLogs().subscribe({
      next: (res) => {
        this.inventoryLogs = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load inventory logs.';
        this.loading = false;
      }
    });
  }

  loadAudit(): void {
    this.loading = true;
    this.pharmacyService.getAuditLogs(this.fromDate, this.toDate).subscribe({
      next: (res) => {
        this.auditLogs = res.logs ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load audit logs.';
        this.loading = false;
      }
    });
  }
}
