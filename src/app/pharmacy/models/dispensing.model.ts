// Matches C# DispenseMedicineViewModel exactly
export interface DispenseMedicineViewModel {
  medicineId: number;
  medicineName?: string;
  unitPrice: number;
  quantity: number;
}

// Matches C# DispensingHistoryViewModel exactly
export interface DispensingHistoryViewModel {
  dispenseId: number;
  prescriptionId: number;
  patientName?: string;
  pharmacistName?: string;
  dispenseDate: string;
  remarks?: string;
  totalItems: number;
  totalAmount: number;
}

// Matches C# DispenseBillResult exactly
export interface DispenseBillResult {
  dispenseId: number;
  billId: number;
}

// Matches C# MedicineDispensingItem exactly
export interface DispensingItem {
  dispenseItemId: number;       // C# field name
  dispenseId: number;
  medicineId: number;
  medicineName?: string;
  quantityDispensed: number;    // C# field name
  unitPrice: number;
  amount: number;
}

// ─── API Response Shapes ──────────────────────────────────────────────────

/** POST /api/pharmacist/dispensing — returns { message, result } */
export interface DispenseResponse {
  message: string;
  result: DispenseBillResult;
}
