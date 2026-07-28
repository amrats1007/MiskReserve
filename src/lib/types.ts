export interface User {
  id: number;
  name: string;
  email: string;
  entity_name: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface Room {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  capacity: number;
  location_ar: string;
  location_en: string;
  amenities: string[];
  color: string;
  is_active: boolean;
  created_at?: string;
}

export interface Booking {
  id: number;
  room_id: number;
  room_name_ar?: string;
  room_name_en?: string;
  room_color?: string;
  booker_name: string;
  booker_email?: string;
  booker_phone?: string;
  entity_name: string;
  event_title: string;
  event_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  attendees_count: number;
  requested_equipment?: string[];
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at?: string;
}

export interface BusiestRoomStat {
  name_ar: string;
  name_en: string;
  booking_count: number;
}

export interface TopEntityStat {
  entity_name: string;
  booking_count: number;
}

export interface StatsData {
  totalBookings: number;
  todayBookings: number;
  totalRooms: number;
  busiestRoom: BusiestRoomStat | null;
  topEntity: TopEntityStat | null;
}

export interface AuthSessionPayload {
  id: number;
  name: string;
  email: string;
  entity_name: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
}
