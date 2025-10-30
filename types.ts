export enum View {
  LOGIN,
  SIGNUP,
  ADMIN_DASHBOARD,
  USER_DASHBOARD,
}

export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  balance: number;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blocked';
  role: 'Admin' | 'User';
  joined: string;
  password?: string;
}

export type SubmissionType = 'notes' | 'file' | 'link';

export interface Task {
  id: number;
  projectName: string;
  title: string;
  description: string;
  reward: number;
  status: 'Open' | 'In Progress' | 'Completed' | 'Pending Review';
  deadline: string; // ISO string format like '2025-12-31'
  assignedTo: number[]; // Array of user IDs
  submissionType: SubmissionType;
  submission?: {
    notes: string;
    attachments?: string[];
    link?: string;
    submittedAt: string;
  };
}

export interface CoinTransaction {
  id: number;
  userId: number;
  type: 'Deposit' | 'Withdrawal';
  source: string; // e.g., 'Task Reward', 'Admin Adjustment', 'Withdrawal Request'
  amount: number; // The absolute value of the transaction
  date: string; // ISO string
  status: 'Completed' | 'Pending' | 'Rejected';
}

export interface AppSettings {
    siteName: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    contactPhone: string;
}
