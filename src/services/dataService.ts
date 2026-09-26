import {
  Member,
  MemberDuty,
  CatechismClass,
  Announcement,
  RehearsalSchedule,
  LiturgicalService,
  DynamicForm,
  FormResponse,
  MemberRegistration,
  SystemStats,
  MemberStatus,
  RegistrationStatus
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const ALLOWED_DUTIES: MemberDuty[] = [
  'Ban Điều Hành',
  'Nhạc Công',
  'Thư Ký',
  'Thủ Quỹ',
  'Ca Trưởng',
  'Ca Viên'
];

export const ALLOWED_CATECHISM_CLASSES: string[] = [
  'Xưng Tội',
  'Thêm Sức',
  'Sống Đạo',
  'Vào Đời',
  'GLV/Dự Trưởng'
];

export function normalizeDuty(raw?: string): MemberDuty {
  if (!raw || !raw.trim()) return 'Ca Viên';
  const val = raw.trim();
  if (ALLOWED_DUTIES.includes(val as MemberDuty)) return val as MemberDuty;
  if (val === 'Thành viên' || val.toLowerCase().includes('thành viên') || val.toLowerCase() === 'member') return 'Ca Viên';
  if (val === 'Phó Ca Trưởng') return 'Ca Trưởng';
  if (val.toLowerCase().includes('điều hành') || val.toLowerCase().includes('trưởng ban')) return 'Ban Điều Hành';
  if (val.toLowerCase().includes('nhạc') || val.toLowerCase().includes('đàn')) return 'Nhạc Công';
  if (val.toLowerCase().includes('thư ký')) return 'Thư Ký';
  if (val.toLowerCase().includes('thủ quỹ')) return 'Thủ Quỹ';
  return 'Ca Viên';
}

export function normalizeCatechismClass(raw?: string): string {
  if (!raw || !raw.trim()) return 'Chưa cập nhật';
  const val = raw.trim();
  if (ALLOWED_CATECHISM_CLASSES.includes(val)) return val;
  if (val.startsWith('Thêm Sức')) return 'Thêm Sức';
  if (val.startsWith('Xưng Tội')) return 'Xưng Tội';
  if (val.startsWith('Sống Đạo')) return 'Sống Đạo';
  if (val.startsWith('Vào Đời')) return 'Vào Đời';
  if (val.includes('GLV') || val.includes('Dự Trưởng')) return 'GLV/Dự Trưởng';
  return 'Chưa cập nhật';
}

type Listener = () => void;

class DataService {
  private listeners: Set<Listener> = new Set();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  private getLocal<T>(key: string, initial: T): T {
    try {
      const stored = localStorage.getItem(`formsangel_${key}`);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  }

  private setLocal<T>(key: string, data: T): void {
    try {
      localStorage.setItem(`formsangel_${key}`, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  // --- MEMBERS (`members` hoặc `ca_vien`) ---
  async fetchMembers(): Promise<Member[]> {
    if (isSupabaseConfigured) {
      try {
        let { data, error } = await (supabase as any).from('members').select('*');
        if (error || !data || data.length === 0) {
          const fallback = await (supabase as any).from('ca_vien').select('*');
          if (!fallback.error && fallback.data) data = fallback.data;
        }

        if (data && data.length > 0) {
          const mapped: Member[] = data.map((item: any) => {
            const rawStatus = (item.status || item.trang_thai || 'hoat_dong').toString().toLowerCase();
            let status: MemberStatus = 'hoat_dong';
            if (rawStatus.includes('tạm') || rawStatus.includes('nghỉ') || rawStatus.includes('tam_nghi')) {
              status = 'tam_nghi';
            } else if (rawStatus.includes('ngưng') || rawStatus.includes('ngung')) {
              status = 'ngung_phuc_vu';
            } else {
              status = 'hoat_dong';
            }

            return {
              id: String(item.id || `mem-${Math.random()}`),
              holy_name: item.holy_name || item.ten_thanh || item.holyname || 'Thánh',
              full_name: item.full_name || item.ho_ten || item.ho_va_ten || item.name || item.fullname || item.ten || 'Chưa cập nhật',
              birth_date: item.birth_date || item.ngay_sinh || '',
              phone: item.phone || item.so_dien_thoai || item.sdt || item.dien_thoai || 'N/A',
              duty: normalizeDuty(item.duty || item.bon_phan || item.chuc_vu),
              status: status,
              joined_date: item.joined_date || item.ngay_tham_gia || (item.created_at ? String(item.created_at).substring(0, 10) : ''),
              catechism_class: normalizeCatechismClass(item.catechism_class || item.lop_giao_ly || item.catechismClass),
              notes: item.notes || item.ghi_chu || ''
            };
          });
          this.setLocal('members', mapped);
          return mapped;
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách ca viên từ Supabase:', err);
      }
    }
    return this.getMembers();
  }

  getMembers(): Member[] {
    const rawList: Member[] = this.getLocal('members', []);
    return rawList.map(m => ({
      ...m,
      duty: normalizeDuty(m.duty),
      catechism_class: normalizeCatechismClass(m.catechism_class)
    }));
  }

  async saveMember(memberData: Omit<Member, 'id'> & { id?: string }): Promise<Member> {
    const members = this.getMembers();
    const normalizedData = {
      ...memberData,
      duty: normalizeDuty(memberData.duty),
      catechism_class: normalizeCatechismClass(memberData.catechism_class)
    };
    let updated: Member;
    if (normalizedData.id) {
      updated = normalizedData as Member;
      const index = members.findIndex(m => m.id === normalizedData.id);
      if (index >= 0) members[index] = updated;
    } else {
      updated = {
        ...normalizedData,
        id: `mem-${Date.now()}`
      } as Member;
      members.unshift(updated);
    }
    this.setLocal('members', members);

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('members').upsert([updated]);
      } catch (err) {
        console.error('Lỗi khi lưu ca viên lên Supabase:', err);
      }
    }

    return updated;
  }

  async deleteMember(id: string): Promise<void> {
    const members = this.getMembers().filter(m => m.id !== id);
    this.setLocal('members', members);

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('members').delete().eq('id', id);
      } catch (err) {
        console.error('Lỗi khi xóa ca viên trên Supabase:', err);
      }
    }
  }

  // --- ANNOUNCEMENTS (`portal_announcements` hoặc `announcements` hoặc `thong_bao`) ---
  async fetchAnnouncements(): Promise<Announcement[]> {
    if (isSupabaseConfigured) {
      try {
        let { data, error } = await (supabase as any).from('portal_announcements').select('*');
        if (error || !data || data.length === 0) {
          const fb1 = await (supabase as any).from('announcements').select('*');
          if (!fb1.error && fb1.data && fb1.data.length > 0) data = fb1.data;
          else {
            const fb2 = await (supabase as any).from('thong_bao').select('*');
            if (!fb2.error && fb2.data) data = fb2.data;
          }
        }

        if (data && data.length > 0) {
          const mapped: Announcement[] = data.map((item: any) => ({
            id: String(item.id || `ann-${Math.random()}`),
            title: item.title || item.tieu_de || item.name || 'Thông báo ca đoàn',
            slug: item.slug || (item.title ? item.title.toLowerCase().replace(/\s+/g, '-') : ''),
            category: item.category || item.danh_muc || 'Thông Báo Chung',
            excerpt: item.excerpt || item.tom_tat || item.description || '',
            content: item.content || item.noi_dung || item.description || '',
            cover_image: item.cover_image || item.anh_cover || item.image || `${import.meta.env.BASE_URL}hero-archangels.jpg`,
            is_pinned: Boolean(item.is_pinned || item.ghim),
            is_important: Boolean(item.is_important || item.quan_trong),
            published_date: item.published_date || item.ngay_dang || (item.created_at ? String(item.created_at).substring(0, 10) : new Date().toISOString().substring(0, 10)),
            author_name: item.author_name || item.tac_gia || item.nguoi_dang || 'Ban Điều Hành',
            status: item.status || 'published'
          }));
          this.setLocal('announcements', mapped);
          return mapped;
        }
      } catch (err) {
        console.error('Lỗi tải thông báo từ Supabase:', err);
      }
    }
    return this.getLocal('announcements', []);
  }

  getAnnouncements(): Announcement[] {
    return this.getLocal('announcements', []);
  }

  async saveAnnouncement(data: Omit<Announcement, 'id'> & { id?: string }): Promise<Announcement> {
    const items = this.getAnnouncements();
    let updated: Announcement;
    if (data.id) {
      updated = data as Announcement;
      const index = items.findIndex(a => a.id === data.id);
      if (index >= 0) items[index] = updated;
    } else {
      updated = {
        ...data,
        id: `ann-${Date.now()}`
      } as Announcement;
      items.unshift(updated);
    }
    this.setLocal('announcements', items);

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('portal_announcements').upsert([updated]);
      } catch (err) {
        console.error('Lỗi lưu thông báo lên Supabase:', err);
      }
    }

    return updated;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const items = this.getAnnouncements().filter(a => a.id !== id);
    this.setLocal('announcements', items);

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('portal_announcements').delete().eq('id', id);
      } catch (err) {
        console.error('Lỗi xóa thông báo trên Supabase:', err);
      }
    }
  }

  // --- REHEARSALS (`rehearsal_schedules` hoặc `rehearsals` hoặc `lich_tap`) ---
  async fetchRehearsals(): Promise<RehearsalSchedule[]> {
    if (isSupabaseConfigured) {
      try {
        let { data, error } = await (supabase as any).from('rehearsal_schedules').select('*');
        if (error || !data || data.length === 0) {
          const fb1 = await (supabase as any).from('rehearsals').select('*');
          if (!fb1.error && fb1.data && fb1.data.length > 0) data = fb1.data;
          else {
            const fb2 = await (supabase as any).from('lich_tap').select('*');
            if (!fb2.error && fb2.data) data = fb2.data;
          }
        }

        if (data && data.length > 0) {
          const mapped: RehearsalSchedule[] = data.map((item: any) => ({
            id: String(item.id || `reh-${Math.random()}`),
            title: item.title || item.ten_buoi_tap || item.tieu_de || 'Buổi tập hát ca đoàn',
            event_date: item.event_date || item.ngay_tap || item.date || '',
            start_time: item.start_time || item.gio_bat_dau || item.time || '19:30',
            end_time: item.end_time || item.gio_ket_thuc || '21:00',
            location: item.location || item.dia_diem || 'Phòng Tập Ca Đoàn',
            description: item.description || item.mo_ta || item.noi_dung || '',
            notes: item.notes || item.ghi_chu || '',
            status: item.status || 'sap_toi'
          }));
          this.setLocal('rehearsals', mapped);
          return mapped;
        }
      } catch (err) {
        console.error('Lỗi tải lịch tập từ Supabase:', err);
      }
    }
    return this.getLocal('rehearsals', []);
  }

  getRehearsals(): RehearsalSchedule[] {
    return this.getLocal('rehearsals', []);
  }

  async saveRehearsal(data: Omit<RehearsalSchedule, 'id'> & { id?: string }): Promise<RehearsalSchedule> {
    const items = this.getRehearsals();
    let updated: RehearsalSchedule;
    if (data.id) {
      updated = data as RehearsalSchedule;
      const index = items.findIndex(r => r.id === data.id);
      if (index >= 0) items[index] = updated;
    } else {
      updated = { ...data, id: `reh-${Date.now()}` } as RehearsalSchedule;
      items.unshift(updated);
    }
    this.setLocal('rehearsals', items);

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('rehearsal_schedules').upsert([updated]);
      } catch (err) {
        console.error('Lỗi lưu lịch tập lên Supabase:', err);
      }
    }

    return updated;
  }

  // --- LITURGIES (`liturgical_services` hoặc `liturgies` hoặc `lich_phung_vu`) ---
  async fetchLiturgies(): Promise<LiturgicalService[]> {
    if (isSupabaseConfigured) {
      try {
        let { data, error } = await (supabase as any).from('liturgical_services').select('*');
        if (error || !data || data.length === 0) {
          const fb1 = await (supabase as any).from('liturgies').select('*');
          if (!fb1.error && fb1.data && fb1.data.length > 0) data = fb1.data;
          else {
            const fb2 = await (supabase as any).from('lich_phung_vu').select('*');
            if (!fb2.error && fb2.data) data = fb2.data;
          }
        }

        if (data && data.length > 0) {
          const mapped: LiturgicalService[] = data.map((item: any) => ({
            id: String(item.id || `lit-${Math.random()}`),
            title: item.title || item.ten_le || item.tieu_de || 'Thánh Lễ Phụng Vụ',
            service_date: item.service_date || item.ngay_le || item.date || '',
            service_time: item.service_time || item.gio_le || item.time || '17:30',
            location: item.location || item.dia_diem || 'Nhà Thờ Giáo Xứ Bắc Hòa',
            status: item.status || 'sap_toi',
            songs: item.songs || {
              nhap_le: { position: 'nhap_le', song_title: item.nhap_le || item.bai_nhap_le },
              dap_ca: { position: 'dap_ca', song_title: item.dap_ca || item.bai_dap_ca },
              alleluia: { position: 'alleluia', song_title: item.alleluia || item.bai_alleluia },
              dang_le: { position: 'dang_le', song_title: item.dang_le || item.bai_dang_le },
              hiep_le: { position: 'hiep_le', song_title: item.hiep_le || item.bai_hiep_le },
              ket_le: { position: 'ket_le', song_title: item.ket_le || item.bai_ket_le }
            },
            notes: item.notes || item.ghi_chu || ''
          }));
          this.setLocal('liturgies', mapped);
          return mapped;
        }
      } catch (err) {
        console.error('Lỗi tải lịch phụng vụ từ Supabase:', err);
      }
    }
    return this.getLocal('liturgies', []);
  }

  getLiturgies(): LiturgicalService[] {
    return this.getLocal('liturgies', []);
  }

  async saveLiturgy(data: Omit<LiturgicalService, 'id'> & { id?: string }): Promise<LiturgicalService> {
    const items = this.getLiturgies();
    let updated: LiturgicalService;
    if (data.id) {
      updated = data as LiturgicalService;
      const idx = items.findIndex(l => l.id === data.id);
      if (idx >= 0) items[idx] = updated;
    } else {
      updated = { ...data, id: `lit-${Date.now()}` } as LiturgicalService;
      items.unshift(updated);
    }
    this.setLocal('liturgies', items);

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('liturgical_services').upsert([updated]);
      } catch (err) {
        console.error('Lỗi lưu lịch phụng vụ lên Supabase:', err);
      }
    }

    return updated;
  }

  // --- FORMS (`forms` hoặc `bieu_mau`) ---
  async fetchForms(): Promise<DynamicForm[]> {
    if (isSupabaseConfigured) {
      try {
        let { data, error } = await (supabase as any).from('forms').select('*');
        if (error || !data || data.length === 0) {
          const fb = await (supabase as any).from('bieu_mau').select('*');
          if (!fb.error && fb.data) data = fb.data;
        }

        if (data && data.length > 0) {
          const mapped: DynamicForm[] = data.map((item: any) => ({
            id: String(item.id || `form-${Math.random()}`),
            title: item.title || item.ten_form || item.tieu_de || 'Biểu mẫu trực tuyến',
            slug: item.slug || '',
            description: item.description || item.mo_ta || '',
            is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
            share_code: item.share_code || 'ANGEL2026',
            fields: item.fields || [],
            responses_count: item.responses_count || 0,
            created_at: item.created_at || new Date().toISOString()
          }));
          this.setLocal('forms', mapped);
          return mapped;
        }
      } catch (err) {
        console.error('Lỗi tải biểu mẫu từ Supabase:', err);
      }
    }
    return this.getLocal('forms', []);
  }

  getForms(): DynamicForm[] {
    return this.getLocal('forms', []);
  }

  async saveForm(data: Omit<DynamicForm, 'id'> & { id?: string }): Promise<DynamicForm> {
    const items = this.getForms();
    let updated: DynamicForm;
    if (data.id) {
      updated = data as DynamicForm;
      const idx = items.findIndex(f => f.id === data.id);
      if (idx >= 0) items[idx] = updated;
    } else {
      updated = { ...data, id: `form-${Date.now()}` } as DynamicForm;
      items.unshift(updated);
    }
    this.setLocal('forms', items);

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('forms').upsert([updated]);
      } catch (err) {
        console.error('Lỗi lưu biểu mẫu lên Supabase:', err);
      }
    }

    return updated;
  }

  // --- RESPONSES (`form_responses` hoặc `phan_hoi`) ---
  async fetchFormResponses(): Promise<FormResponse[]> {
    if (isSupabaseConfigured) {
      try {
        let { data, error } = await (supabase as any).from('form_responses').select('*');
        if (error || !data || data.length === 0) {
          const fb = await (supabase as any).from('phan_hoi').select('*');
          if (!fb.error && fb.data) data = fb.data;
        }

        if (data && data.length > 0) {
          const mapped: FormResponse[] = data.map((item: any) => ({
            id: String(item.id || `res-${Math.random()}`),
            form_id: item.form_id || '',
            form_title: item.form_title || 'Biểu mẫu',
            respondent_name: item.respondent_name || item.ho_ten || 'Ẩn danh',
            respondent_phone: item.respondent_phone || item.sdt || 'N/A',
            submitted_at: item.submitted_at || item.created_at || '',
            answers: item.answers || {}
          }));
          this.setLocal('responses', mapped);
          return mapped;
        }
      } catch (err) {
        console.error('Lỗi tải phản hồi biểu mẫu từ Supabase:', err);
      }
    }
    return this.getLocal('responses', []);
  }

  getFormResponses(): FormResponse[] {
    return this.getLocal('responses', []);
  }

  async submitFormResponse(formId: string, formTitle: string, answers: Record<string, string>): Promise<FormResponse> {
    const responses = this.getFormResponses();
    const newRes: FormResponse = {
      id: `res-${Date.now()}`,
      form_id: formId,
      form_title: formTitle,
      respondent_name: answers['f-2'] || answers['name'] || answers['ho_ten'] || 'Người nộp ẩn danh',
      respondent_phone: answers['f-4'] || answers['phone'] || answers['sdt'] || 'N/A',
      submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      answers
    };
    responses.unshift(newRes);
    this.setLocal('responses', responses);

    const forms = this.getForms();
    const target = forms.find(f => f.id === formId);
    if (target) {
      target.responses_count = (target.responses_count || 0) + 1;
      this.setLocal('forms', forms);
    }

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('form_responses').insert([newRes]);
      } catch (err) {
        console.error('Lỗi nộp phản hồi biểu mẫu lên Supabase:', err);
      }
    }

    return newRes;
  }

  // --- REGISTRATIONS (`registrations` hoặc `dang_ky`) ---
  async fetchRegistrations(): Promise<MemberRegistration[]> {
    if (isSupabaseConfigured) {
      try {
        let { data, error } = await (supabase as any).from('registrations').select('*');
        if (error || !data || data.length === 0) {
          const fb = await (supabase as any).from('dang_ky').select('*');
          if (!fb.error && fb.data) data = fb.data;
        }

        if (data && data.length > 0) {
          const mapped: MemberRegistration[] = data.map((item: any) => {
            const raw = (item.status || item.trang_thai || 'pending').toString().toLowerCase();
            let status: RegistrationStatus = 'pending';
            if (raw.includes('duyệt') || raw.includes('approved') || raw.includes('chấp nhận')) status = 'approved';
            else if (raw.includes('chối') || raw.includes('rejected') || raw.includes('từ chối')) status = 'rejected';

            return {
              id: String(item.id || `reg-${Math.random()}`),
              holy_name: item.holy_name || item.ten_thanh || '',
              full_name: item.full_name || item.ho_ten || item.name || '',
              birth_date: item.birth_date || item.ngay_sinh || '',
              phone: item.phone || item.so_dien_thoai || item.sdt || '',
              notes: item.notes || item.ghi_chu || '',
              status: status,
              submitted_at: item.submitted_at || item.created_at || new Date().toISOString().substring(0, 10),
              admin_notes: item.admin_notes || item.ghi_chu_admin || ''
            };
          });
          this.setLocal('registrations', mapped);
          return mapped;
        }
      } catch (err) {
        console.error('Lỗi tải đơn đăng ký từ Supabase:', err);
      }
    }
    return this.getLocal('registrations', []);
  }

  getRegistrations(): MemberRegistration[] {
    return this.getLocal('registrations', []);
  }

  async submitRegistration(data: Omit<MemberRegistration, 'id' | 'status' | 'submitted_at'>): Promise<MemberRegistration> {
    const regs = this.getRegistrations();
    const newReg: MemberRegistration = {
      ...data,
      id: `reg-${Date.now()}`,
      status: 'pending',
      submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    regs.unshift(newReg);
    this.setLocal('registrations', regs);

    if (isSupabaseConfigured) {
      try {
        await (supabase as any).from('registrations').insert([newReg]);
      } catch (err) {
        console.error('Lỗi nộp đơn đăng ký lên Supabase:', err);
      }
    }

    return newReg;
  }

  async updateRegistrationStatus(id: string, status: 'approved' | 'rejected', adminNotes?: string): Promise<void> {
    const regs = this.getRegistrations();
    const target = regs.find(r => r.id === id);
    if (target) {
      target.status = status;
      if (adminNotes) target.admin_notes = adminNotes;
      this.setLocal('registrations', regs);

      if (status === 'approved') {
        await this.saveMember({
          holy_name: target.holy_name,
          full_name: target.full_name,
          birth_date: target.birth_date,
          phone: target.phone,
          duty: 'Ca Viên',
          status: 'hoat_dong',
          joined_date: new Date().toISOString().substring(0, 10),
          notes: `Gia nhập từ đơn đăng ký trực tuyến (${target.notes || ''})`
        });
      }

      if (isSupabaseConfigured) {
        try {
          await (supabase as any).from('registrations').update({ status, admin_notes: adminNotes }).eq('id', id);
        } catch (err) {
          console.error('Lỗi cập nhật trạng thái đơn trên Supabase:', err);
        }
      }
    }
  }

  // --- STATS ---
  getStats(): SystemStats {
    const members = this.getMembers();
    const rehearsals = this.getRehearsals();
    const regs = this.getRegistrations();
    const forms = this.getForms();
    const ann = this.getAnnouncements();

    return {
      total_members: members.length,
      active_members: members.filter(m => m.status === 'hoat_dong').length,
      upcoming_rehearsals: rehearsals.filter(r => r.status === 'sap_toi').length,
      pending_registrations: regs.filter(r => r.status === 'pending').length,
      active_forms: forms.filter(f => f.is_active).length,
      published_announcements: ann.filter(a => a.status === 'published').length
    };
  }

  async fetchAll(): Promise<void> {
    if (!isSupabaseConfigured) return;
    await Promise.allSettled([
      this.fetchMembers(),
      this.fetchAnnouncements(),
      this.fetchRehearsals(),
      this.fetchLiturgies(),
      this.fetchForms(),
      this.fetchFormResponses(),
      this.fetchRegistrations()
    ]);
    this.notify();
  }
}

export const dataService = new DataService();
