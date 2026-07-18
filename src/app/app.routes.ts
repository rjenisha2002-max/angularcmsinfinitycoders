import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

import { Login } from './auth/login/login';

import { DoctorDashboard } from './doctor/dashboard/dashboard';
import { DoctorAppointments } from './doctor/appointments/appointments';
import { DoctorConsultation } from './doctor/consultation/consultation';
import { DoctorPatientSearch } from './doctor/patient-search/patient-search';

import { LabDashboard } from './lab/dashboard/dashboard';
import { LabPendingTests } from './lab/pending-tests/pending-tests';
import { LabResults } from './lab/results/results';
import { LabBilling } from './lab/billing/billing';
import { LabReports } from './lab/reports/reports';
import { LabPatientSearch } from './lab/patient-search/patient-search';

import { ReceptionDashboard } from './reception/dashboard/dashboard';
import { ReceptionPatients } from './reception/patients/patients';
import { ReceptionAppointments } from './reception/appointments/appointments';
import { ReceptionBills } from './reception/bills/bills';
import { ReceptionVisits } from './reception/visits/visits';
import { ReceptionReports } from './reception/reports/reports';
import { ReceptionRegisterPatient } from './reception/register-patient/register-patient';

import { PharmacyDashboard } from './pharmacy/dashboard/dashboard';
import { PharmacyMedicines } from './pharmacy/medicines/medicines';
import { PharmacyMedicineStock } from './pharmacy/medicine-stock/medicine-stock';
import { PharmacyDispensing } from './pharmacy/dispensing/dispensing';
import { PharmacyPrescriptions } from './pharmacy/prescriptions/prescriptions';
import { PharmacyBills } from './pharmacy/bills/bills';
import { PharmacyLogs } from './pharmacy/logs/logs';
import { PharmacyReports } from './pharmacy/reports/reports';

import { NotFound } from './shared/notfound/notfound';
import { Layout } from './reception/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard('Doctor')],
    children: [
      { path: 'dashboard', component: DoctorDashboard },
      { path: 'appointments', component: DoctorAppointments },
      { path: 'consultation/:appointmentId', component: DoctorConsultation },
      { path: 'patient-search', component: DoctorPatientSearch }
    ]
  },

  {
    path: 'lab',
    canActivate: [authGuard, roleGuard('Lab Technician')],
    children: [
      { path: 'dashboard', component: LabDashboard },
      { path: 'pending-tests', component: LabPendingTests },
      { path: 'results/:requestItemId', component: LabResults },
      { path: 'billing', component: LabBilling },
      { path: 'reports', component: LabReports },
      { path: 'patient-search', component: LabPatientSearch }
    ]
  },

  {
    path: 'reception',
    component: Layout,
    canActivate: [authGuard, roleGuard('Receptionist')],
    children: [
      { path: 'dashboard', component: ReceptionDashboard },
      { path: 'register-patient', component: ReceptionRegisterPatient },
      { path: 'patients', component: ReceptionPatients },
      { path: 'appointments', component: ReceptionAppointments },
      { path: 'bills', component: ReceptionBills },
      { path: 'visits', component: ReceptionVisits },
      { path: 'reports', component: ReceptionReports },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'pharmacy',
    canActivate: [authGuard, roleGuard('Pharmacist')],
    children: [
      { path: 'dashboard', component: PharmacyDashboard },
      { path: 'medicines', component: PharmacyMedicines },
      { path: 'medicine-stock', component: PharmacyMedicineStock },
      { path: 'dispensing', component: PharmacyDispensing },
      { path: 'prescriptions', component: PharmacyPrescriptions },
      { path: 'bills', component: PharmacyBills },
      { path: 'logs', component: PharmacyLogs },
      { path: 'reports', component: PharmacyReports }
    ]
  },

  { path: '**', component: NotFound }
];
