export type UserRole = "student" | "counselor" | "admin";
export type SessionType = "career" | "mental_health" | "peer_pressure" | "tuition";
export type SlotStatus = "open" | "booked" | "completed" | "cancelled";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  full_name: string;
  user_id: number;
}

export interface UserOut {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  age?: number | null;
  grade?: string | null;
  created_at: string;
}

export interface CounselorOut {
  id: number;
  user_id: number;
  full_name: string;
  specialization: string;
  session_type: SessionType | string;
  bio?: string | null;
  subject?: string | null;
  years_experience?: number | null;
  session_duration_minutes: number;
  rating: number;
}

export interface SlotOut {
  id: number;
  counselor_id: number;
  start_time: string;
  end_time: string;
  status: SlotStatus;
}

export interface SlotWithCounselorOut extends SlotOut {
  counselor_name: string;
  specialization: string;
  session_type: string;
}

export interface BookingDetailOut {
  id: number;
  status: BookingStatus;
  session_type: string;
  notes?: string | null;
  start_time: string;
  end_time: string;
  student_name: string;
  student_age?: number | null;
  counselor_name: string;
  created_at: string;
}

export interface AdminStats {
  total_students: number;
  total_counselors: number;
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_chat_messages: number;
  flagged_chat_messages: number;
}
