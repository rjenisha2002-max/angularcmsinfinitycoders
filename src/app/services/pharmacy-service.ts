import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PharmacyService {
  private base = `${environment.apiUrl}/pharmacist`;

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get<any>(`${this.base}/dashboard`);
  }

  // ---- Medicines ----
  getMedicines(searchTerm = '') {
    const qs = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : '';
    return this.http.get<any>(`${this.base}/medicines${qs}`);
  }

  getNewMedicineMeta() {
    return this.http.get<any>(`${this.base}/medicines/new`);
  }

  getMedicine(id: number) {
    return this.http.get<any>(`${this.base}/medicines/${id}`);
  }

  createMedicine(medicine: any) {
    return this.http.post<any>(`${this.base}/medicines`, medicine);
  }

  updateMedicine(id: number, medicine: any) {
    return this.http.put<any>(`${this.base}/medicines/${id}`, medicine);
  }

  disableMedicine(id: number) {
    return this.http.post<any>(`${this.base}/medicines/${id}/disable`, {});
  }

  // ---- Medicine Stock ----
  getStock() {
    return this.http.get<any[]>(`${this.base}/medicine-stock`);
  }

  getNewStockMeta() {
    return this.http.get<any>(`${this.base}/medicine-stock/new`);
  }

  createStock(stock: any) {
    return this.http.post<any>(`${this.base}/medicine-stock`, stock);
  }

  getStockById(id: number) {
    return this.http.get<any>(`${this.base}/medicine-stock/${id}`);
  }

  updateStock(id: number, stock: any) {
    return this.http.put<any>(`${this.base}/medicine-stock/${id}`, stock);
  }

  getLowStock() {
    return this.http.get<any[]>(`${this.base}/medicine-stock/low-stock`);
  }

  getExpiring() {
    return this.http.get<any[]>(`${this.base}/medicine-stock/expiring`);
  }

  getExpired() {
    return this.http.get<any[]>(`${this.base}/medicine-stock/expired`);
  }

  // ---- Dispensing ----
  getPendingPrescriptions() {
    return this.http.get<any[]>(`${this.base}/dispensing`);
  }

  dispenseAndBill(prescriptionId: number, remarks?: string) {
    return this.http.post<any>(`${this.base}/dispensing`, { prescriptionId, remarks });
  }

  getDispensingHistory() {
    return this.http.get<any[]>(`${this.base}/dispensing/history`);
  }

  getDispensingItems(dispenseId: number) {
    return this.http.get<any[]>(`${this.base}/dispensing/${dispenseId}/items`);
  }

  // ---- Prescriptions ----
  getPrescriptions() {
    return this.http.get<any[]>(`${this.base}/prescriptions`);
  }

  getPrescriptionDetails(id: number) {
    return this.http.get<any>(`${this.base}/prescriptions/${id}`);
  }

  markPrescriptionDispensed(id: number) {
    return this.http.post<any>(`${this.base}/prescriptions/${id}/dispense`, {});
  }

  updatePrescriptionStatus(id: number, status: string) {
    return this.http.put<any>(`${this.base}/prescriptions/${id}/status`, { status });
  }

  // ---- Bills ----
  getBills() {
    return this.http.get<any[]>(`${this.base}/bills`);
  }

  getNewBillMeta() {
    return this.http.get<any>(`${this.base}/bills/new`);
  }

  createBill(payload: any) {
    return this.http.post<any>(`${this.base}/bills`, payload);
  }

  getBillDetails(id: number) {
    return this.http.get<any>(`${this.base}/bills/${id}`);
  }

  cancelBill(id: number, reason?: string) {
    return this.http.post<any>(`${this.base}/bills/${id}/cancel`, { reason });
  }

  invoicePdfUrl(id: number) {
    return `${this.base}/bills/${id}/invoice/pdf`;
  }

  // ---- Logs ----
  getInventoryLogs() {
    return this.http.get<any[]>(`${this.base}/inventory-logs`);
  }

  getAuditLogs(fromDate?: string, toDate?: string) {
    const qs = new URLSearchParams();
    if (fromDate) qs.set('fromDate', fromDate);
    if (toDate) qs.set('toDate', toDate);
    const s = qs.toString();
    return this.http.get<any>(`${this.base}/audit-logs${s ? '?' + s : ''}`);
  }

  // ---- Reports ----
  getReport(report: string, fromDate?: string, toDate?: string, days?: number) {
    const qs = new URLSearchParams({ report });
    if (fromDate) qs.set('fromDate', fromDate);
    if (toDate) qs.set('toDate', toDate);
    if (days) qs.set('days', String(days));
    return this.http.get<any>(`${this.base}/reports?${qs.toString()}`);
  }

  exportReportUrl(report: string, fromDate?: string, toDate?: string, days?: number) {
    const qs = new URLSearchParams({ report });
    if (fromDate) qs.set('fromDate', fromDate);
    if (toDate) qs.set('toDate', toDate);
    if (days) qs.set('days', String(days));
    return `${this.base}/reports/export?${qs.toString()}`;
  }
}
