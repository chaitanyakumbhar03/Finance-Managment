export type DieType = 
  | 'Bahubali Chain Die'
  | 'Emboss Die'
  | 'Thappa Die'
  | 'Coin Die'
  | 'Bar Minting Die'
  | 'Lakshmi Die'
  | 'Bangle Die'
  | 'Hook Type Die'
  | 'Prong Die (Stone Holding)'
  | 'Other';

export interface LumpsumPayment {
  id: string;
  date: string;
  amount: number;
  notes?: string;
}

export interface DieDetails {
  totalDies: number;
  designs: string;  // e.g., "Floral, Traditional"
  sizes: string;     // e.g., "12mm, 20mm"
  dieType: DieType;
}

export interface AdditionalItem {
  id: string;
  name: string;        // Name of addition (e.g., 'Inner Ring', 'Extra Lakshmi Motif')
  size: string;        // e.g., '14mm', '22mm'
  design: string;      // e.g., 'Leaf pattern', 'Lotus mesh'
  clientRate: number;  // Billing rate for Client
  karagirRate: number; // Wage rate for Karagir
  quantity: number;    // Quantity
  createdAt: string;   // Date of addition
}

export interface CourierCharge {
  id: string;
  senderName: string; // Member of Die Makes who sent it
  courierService: string; // e.g., DTDC, Maruti, Blue Dart
  trackingNumber?: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface KaragirAssignment {
  id: string;
  karagirId: string;
  karagirName: string;
  allottedDies: number; // Quantity of dies distributed
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delivered';
  completionDate?: string; // Deadline or date completed
  designImage?: string; // Base64 design image for backward compatibility
  designImages?: string[]; // Array of base64 design images for multiple images
  totalAmount: number;
  advancePayment: number;
  lumpsumPayments: LumpsumPayment[];
  totalPaid: number;
  pendingPayment: number;
  createdAt: string;
}

export interface ClientProject {
  id: string;
  projectName: string;
  dieDetails: DieDetails;
  totalAmount: number;
  advancePayment: number;
  pendingPayment: number;
  lumpsumPayments: LumpsumPayment[];
  totalPaid: number;
  courierCharges: number; // Sum of courierChargesList, fallback
  courierChargesList?: CourierCharge[]; // List of multiple courier charges
  otherExpenses: number;
  projectImage?: string; // Base64 master design image, fallback
  projectImages?: string[]; // Array of base64 master design images
  assignedKaragirId?: string; // Links to Karagir id
  assignedKaragirProjectId?: string; // Links to Karagir's project id
  additionalItems?: AdditionalItem[]; // List of extra die items added post-launch
  karagirAssignments?: KaragirAssignment[]; // List of multiple karagir assignments
  createdAt: string;
}

export interface Client {
  id: string;
  clientName: string;
  businessName: string;
  address: string;
  phoneNumber: string;
  emailId: string;
  projects: ClientProject[];
  createdAt: string;
}

export interface KaragirProject {
  id: string;
  projectName: string;
  clientProjectId?: string; // Linked client project
  dieDetails: DieDetails;
  totalAmount: number; // Charges by Karagir
  advancePayment: number;
  pendingPayment: number;
  lumpsumPayments: LumpsumPayment[];
  totalPaid: number;
  additionalItems?: AdditionalItem[]; // List of extra die items added post-launch
  createdAt: string;
}

export interface Karagir {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  projects: KaragirProject[];
  createdAt: string;
}

export interface User {
  email: string;
  isAuthenticated: boolean;
}

export type TimeFilter = '24h' | '7d' | 'monthly' | '6m' | '12m' | 'all';
