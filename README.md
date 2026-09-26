# 🕊️ Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa

> **Cổng Thông Tin & Trung Tâm Điều Hành Ca Đoàn Thiên Thần**
>
> *Giáo Xứ Bắc Hòa — Giáo Hạt Phú Thịnh — Giáo Phận Xuân Lộc*

---

## 📌 Giới Thiệu

Hệ thống là nền tảng quản lý sinh hoạt và phụng vụ dành cho Ca Đoàn Thiên Thần.

Hệ thống gồm 2 không gian chính:

### Public Portal
Dành cho người dùng công cộng, ca viên và những người quan tâm đến hoạt động của ca đoàn.

Các nội dung chính:
- Xem thông tin và hoạt động của Ca Đoàn Thiên Thần.
- Tra cứu lịch tập hát.
- Tra cứu lịch Phụng vụ.
- Xem thông báo và bài viết.
- Gửi nguyện vọng đăng ký tham gia ca đoàn.

### Admin Center
Dành cho Ban Điều Hành Ca Đoàn Thiên Thần.

Các chức năng chính:
- Dashboard tổng quan.
- Quản lý ca viên.
- Quản lý thông báo và bài viết.
- Quản lý lịch tập hát.
- Quản lý nội dung bài hát Phụng vụ.
- Duyệt đăng ký tham gia ca đoàn.

---

## 👥 Quản Lý Ca Viên

### Anchored Contextual Popover
Khi nhấn vào tên hoặc ảnh của ca viên:
- Hiển thị Profile Popover ngay cạnh phần tử được nhấn.
- Không hiển thị popup ở chính giữa viewport.
- Không làm tối toàn bộ màn hình.
- Không blur toàn bộ trang.
- Popup được neo theo vị trí thực tế của phần tử được chọn (`getBoundingClientRect()`).
- Popup tự điều chỉnh vị trí khi gần cạnh màn hình.

### Centered Edit Modal
Khi chọn thao tác Chỉnh sửa từ Profile Popover:
- Đóng Profile Popover.
- Mở Edit Modal riêng.
- Edit Modal được căn giữa viewport.
- Có backdrop nhẹ (`bg-black/40 backdrop-blur-xs`).
- Form chỉnh sửa sử dụng lại logic và validation hiện có.

### CSV Export
- Xuất danh sách ca viên dưới dạng CSV.

---

## ✨ Tính Năng

- **Dashboard**: Thống kê số lượng ca viên, đơn đăng ký chờ duyệt, thông báo đã xuất bản.
- **Quản lý ca viên**: Xem chi tiết bằng Anchored Contextual Popover, chỉnh sửa bằng Centered Edit Modal, xuất danh sách CSV.
- **Quản lý thông báo**: Tạo bài viết tin tức, ghim bài viết, phân loại danh mục thông báo.
- **Quản lý lịch tập hát**: Cập nhật thông tin các buổi tập hát.
- **Quản lý Phụng vụ**: Phân công 6 vị trí bài hát Phụng vụ (*Nhập Lễ, Đáp Ca, Alleluia, Dâng Lễ, Hiệp Lễ, Kết Lễ*).
- **Duyệt đăng ký**: Tiếp nhận, xem nguyện vọng, lưu ghi chú phỏng vấn và duyệt/từ chối đơn đăng ký.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite 6, React Router 7
- **Styling**: Tailwind CSS v4, Catholic-inspired Custom Design System
- **Animation**: Motion (Motion React)
- **Icons**: Lucide React
- **Backend & Data**: Supabase PostgreSQL (`@supabase/supabase-js`), Database API và Event Listener Sync

---

## 🚀 Hướng Dẫn Cài Đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy môi trường phát triển
```bash
npm run dev
```

Truy cập ứng dụng tại:
- **Public Portal**: `http://localhost:5173/`
- **Admin Center**: `http://localhost:5173/admin`

### 3. Đóng gói sản phẩm
```bash
npm run build
```

---

## 📜 Cấu Trúc Thư Mục

```text
src/
├── components/
│   ├── admin/
│   │   ├── AdminAnalytics.tsx
│   │   ├── AdminAnnouncementManager.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminFormBuilder.tsx
│   │   ├── AdminLiturgyManager.tsx
│   │   ├── AdminMemberFormModal.tsx
│   │   ├── AdminMemberManager.tsx
│   │   ├── AdminRegistrationManager.tsx
│   │   ├── AdminScheduleManager.tsx
│   │   ├── AdminSettings.tsx
│   │   └── AdminShell.tsx
│   ├── portal/
│   │   ├── PortalAnnouncements.tsx
│   │   ├── PortalFormFiller.tsx
│   │   ├── PortalForms.tsx
│   │   ├── PortalHome.tsx
│   │   ├── PortalLiturgy.tsx
│   │   ├── PortalRegistration.tsx
│   │   ├── PortalRehearsals.tsx
│   │   └── PortalShell.tsx
│   └── common/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── ConfirmDialog.tsx
│       ├── EmptyState.tsx
│       ├── MemberProfilePopover.tsx
│       ├── Modal.tsx
│       └── SearchInput.tsx
├── lib/
│   └── supabase.ts
├── services/
│   └── dataService.ts
├── types/
│   └── index.ts
└── App.tsx
```

---

## ⛪ Thông Tin Giáo Hội

- **Giáo Xứ**: Bắc Hòa
- **Giáo Hạt**: Phú Thịnh
- **Giáo Phận**: Xuân Lộc
- **Ca đoàn**: Ca Đoàn Thiên Thần
- **Bổn mạng**: Các Thánh Tổng Lãnh Thiên Thần Michael, Gabriel và Raphael

---

## 🎨 Định Hướng Giao Diện

- Thiết kế dành riêng cho Ca Đoàn Thiên Thần.
- Tách biệt rõ Public Portal và Admin Center.
- Giao diện hiện đại, dễ sử dụng.
- Admin tập trung vào thao tác quản lý.
- Profile Popover được neo theo đối tượng được chọn.
- Edit Modal sử dụng cửa sổ riêng khi cần chỉnh sửa.
- Không dùng backdrop toàn màn hình cho Profile Popover.
