import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'pharmacy/dashboard', pathMatch: 'full' },

  // Auth — no guard needed on login page
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.Login)
      }
    ]
  },

  // Pharmacy Module — wrapped in PharmacyLayout, protected by authGuard
  {
    path: 'pharmacy',
    loadComponent: () => import('./pharmacy/pharmacy-layout/pharmacy-layout').then(m => m.PharmacyLayout),
    canActivate: [authGuard],
    children: [
      // Dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pharmacy/dashboard/dashboard').then(m => m.PharmacyDashboard)
      },

      // Medicine
      {
        path: 'medicine',
        loadComponent: () => import('./pharmacy/medicine/medicine').then(m => m.Medicine)
      },
      {
        path: 'medicine/add',
        loadComponent: () => import('./pharmacy/medicine-add/medicine-add').then(m => m.MedicineAdd)
      },
      {
        path: 'medicine/edit/:id',
        loadComponent: () => import('./pharmacy/medicine-edit/medicine-edit').then(m => m.MedicineEdit)
      },

      // Stock
      {
        path: 'stock',
        loadComponent: () => import('./pharmacy/medicine-stock/medicine-stock').then(m => m.MedicineStockList)
      },
      {
        path: 'stock/add',
        loadComponent: () => import('./pharmacy/medicine-stock/medicine-stock-add').then(m => m.MedicineStockAdd)
      },
      {
        path: 'stock/edit/:id',
        loadComponent: () => import('./pharmacy/medicine-stock/medicine-stock-edit').then(m => m.MedicineStockEdit)
      },
      {
        path: 'stock/low-stock',
        loadComponent: () => import('./pharmacy/medicine-stock/low-stock').then(m => m.LowStock)
      },
      {
        path: 'stock/expiring',
        loadComponent: () => import('./pharmacy/medicine-stock/expiring-medicines').then(m => m.ExpiringMedicines)
      },
      {
        path: 'stock/expired',
        loadComponent: () => import('./pharmacy/medicine-stock/expired-medicines').then(m => m.ExpiredMedicines)
      },

      // Prescriptions
      {
        path: 'prescription',
        loadComponent: () => import('./pharmacy/prescription/prescription-list').then(m => m.PrescriptionList)
      },
      {
        path: 'prescription/:id',
        loadComponent: () => import('./pharmacy/prescription/prescription-details').then(m => m.PrescriptionDetails)
      },

      // Dispensing
      {
        path: 'dispensing',
        loadComponent: () => import('./pharmacy/dispensing/dispensing-create').then(m => m.DispensingCreate)
      },
      {
        path: 'dispensing/history',
        loadComponent: () => import('./pharmacy/dispensing/dispensing-history').then(m => m.DispensingHistory)
      },
      {
        path: 'dispensing/:id/items',
        loadComponent: () => import('./pharmacy/dispensing/dispensing-detail').then(m => m.DispensingDetail)
      },

      // Bills
      {
        path: 'bills',
        loadComponent: () => import('./pharmacy/billing/billing').then(m => m.Billing)
      },
      {
        path: 'bills/create',
        loadComponent: () => import('./pharmacy/bill-create/bill-create').then(m => m.BillCreate)
      },
      {
        path: 'bills/:id',
        loadComponent: () => import('./pharmacy/bill-details/bill-details').then(m => m.BillDetails)
      },

      // Reports
      {
        path: 'reports',
        loadComponent: () => import('./pharmacy/reports/reports').then(m => m.Reports)
      },

      // Inventory Log
      {
        path: 'inventory-log',
        loadComponent: () => import('./pharmacy/inventory-log/inventory-log').then(m => m.InventoryLog)
      },

      // Audit Log
      {
        path: 'audit-log',
        loadComponent: () => import('./pharmacy/audit-log/audit-log').then(m => m.AuditLog)
      }
    ]
  },

  // Invoice — standalone printable page, also guarded
  {
    path: 'pharmacy/bills/:id/invoice',
    canActivate: [authGuard],
    loadComponent: () => import('./pharmacy/bill-invoice/bill-invoice').then(m => m.BillInvoice)
  },

  // Wildcard
  { path: '**', redirectTo: 'pharmacy/dashboard' }
];
