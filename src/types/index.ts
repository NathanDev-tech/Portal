// Data Types & Interfaces for FormsAngel - Ca Đoàn Thiên Thần (Giáo Xứ Bắc Hòa)

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export type MemberStatus = 'hoat_dong' | 'tam_nghi' | 'ngung_phuc_vu';

export type MemberDuty = 
  | 'Ban Điều Hành'
  | 'Nhạc Công'
  | 'Thư Ký'
  | 'Thủ Quỹ'
  | 'Ca Trưởng'
  | 'Ca Viên';

export type CatechismClass =
  | 'Xưng Tội'
  | 'Thêm Sức'
  | 'Sống Đạo'
  | 'Vào Đời'
  | 'GLV/Dự Trưởng';

export interface Member {
  id: string;
  holy_name: string; // Tên Thánh (Giuse, Maria, Teresa, v.v.)
  full_name: string; // Họ và tên
  birth_date: string;
  phone: string;
  duty: MemberDuty;
  status: MemberStatus;
  joined_date: string;
  catechism_class?: CatechismClass | string; // Lớp Giáo Lý
  notes?: string;
  avatar_url?: string;
}

export type AnnouncementCategory = 'Thánh Lễ' | 'Sinh Hoạt' | 'Lịch Tập' | 'Thông Báo Chung' | 'Khác';

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  category: AnnouncementCategory;
  excerpt: string;
  content: string;
  cover_image?: string;
  is_pinned: boolean;
  is_important: boolean;
  published_date: string;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
}

export interface RehearsalSchedule {
  id: string;
  title: string;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  location: string;
  description?: string;
  notes?: string;
  status: 'sap_toi' | 'dang_dien_ra' | 'da_hoan_thanh' | 'da_huy';
}

export type LiturgicalPosition = 'nhap_le' | 'dap_ca' | 'alleluia' | 'dang_le' | 'hiep_le' | 'ket_le';

export interface LiturgicalSongSlot {
  position: LiturgicalPosition;
  song_title?: string;
  composer?: string;
}

export interface LiturgicalService {
  id: string;
  title: string; // Tên Thánh Lễ / Dịp Lễ
  service_date: string; // YYYY-MM-DD
  service_time: string; // HH:mm
  location: string; // Nhà Thờ Giáo Xứ Bắc Hòa
  status: 'sap_toi' | 'da_hoan_thanh' | 'da_huy';
  songs: Record<LiturgicalPosition, LiturgicalSongSlot>;
  notes?: string;
}

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'number' 
  | 'date' 
  | 'phone';

export interface FormField {
  id: string;
  label: string;
  field_type: FieldType;
  placeholder?: string;
  is_required: boolean;
  options?: string[];
  sort_order: number;
}

export interface DynamicForm {
  id: string;
  title: string;
  slug: string;
  description?: string;
  is_active: boolean;
  share_code: string;
  fields: FormField[];
  responses_count: number;
  created_at: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  form_title: string;
  respondent_name: string;
  respondent_phone: string;
  submitted_at: string;
  answers: Record<string, string | string[]>;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface MemberRegistration {
  id: string;
  holy_name: string;
  full_name: string;
  birth_date: string;
  phone: string;
  notes?: string;
  status: RegistrationStatus;
  submitted_at: string;
  admin_notes?: string;
}

export interface SystemStats {
  total_members: number;
  active_members: number;
  upcoming_rehearsals: number;
  pending_registrations: number;
  active_forms: number;
  published_announcements: number;
}
