// Enum cho vai trò người dùng trong tổ chức
export enum VaiTro {
  ORG_ADMIN = 'ORG_ADMIN',       // Quản trị viên của doanh nghiệp (Chủ doanh nghiệp)
  SALE_MANAGER = 'SALE_MANAGER', // Trưởng phòng kinh doanh
  SALE_AGENT = 'SALE_AGENT',     // Nhân viên kinh doanh
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'  // Admin hệ thống SaaS (Super Admin)
}

// Enum trạng thái khách hàng
export enum TrangThaiKhachHang {
  MOI = 'MOI',
  TIEM_NANG = 'TIEM_NANG',
  KHONG_NGHE_MAY = 'KHONG_NGHE_MAY',
  DA_CHOT = 'DA_CHOT',
  TU_CHOI = 'TU_CHOI',
  DNC = 'DNC' // Do Not Call
}

// Enum kênh marketing
export enum KenhMarketing {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  ZALO = 'ZALO'
}

// --- MULTI-TENANCY MODELS ---

// Interface Tổ Chức (Doanh Nghiệp mua phần mềm)
export interface ToChuc {
    id: string;
    tenToChuc: string; // VD: Bất Động Sản Hưng Thịnh
    maSoThue?: string;
    goiDichVu: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
    ngayHetHan: string;
    trangThai: 'ACTIVE' | 'LOCKED';
}

// User Interface (Nhân viên thuộc tổ chức)
export interface NguoiDung {
    id: string;
    toChucId: string; // Link user với tổ chức
    hoTen: string;
    email: string;
    soDienThoai?: string;
    vaiTro: VaiTro;
    trangThai: 'ACTIVE' | 'INACTIVE';
    avatarUrl?: string;
    ngayTao: string;
}

// Interface Khách Hàng (Lead) - Phải thuộc về 1 tổ chức
export interface KhachHang {
  id: string;
  toChucId?: string; // Data Isolation
  nguoiPhuTrachId?: string; // ID của nhân viên Sale đang chăm sóc (null = chưa chia)
  tenCongTy: string;
  nguoiLienHe: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  nganhNghe?: string; 
  trangThai: TrangThaiKhachHang;
  nguonGoc: 'SYSTEM' | 'UPLOAD';
  ghiChu?: string;
  ngayTao: string;
}

// Interface Nhóm Khách Hàng (Segment)
export interface NhomKhachHang {
    id: string;
    tenNhom: string;
    soLuong: number;
    moTa?: string;
    ngayTao: string;
}

// Interface Chiến Dịch
export interface ChienDich {
  id: string;
  tenChienDich: string;
  kenh: KenhMarketing[];
  trangThai: 'DANG_CHAY' | 'TAM_DUNG' | 'HOAN_THANH' | 'NHAP';
  soLuongLead: number;
  tienDo: number; // Phần trăm
  nganSachDuKien: number;
}

// Interface Lịch sử cuộc gọi
export interface LichSuCuocGoi {
  id: string;
  khachHangId: string;
  agentId: string;
  thoiGianBatDau: string;
  thoiLuongGiay: number;
  trangThai: 'ANSWERED' | 'MISSED' | 'BUSY' | 'FAILED';
  ghiAmUrl?: string;
}

// DTO cho Template
export interface MauTinNhan {
  id: string;
  tenMau: string;
  loai: KenhMarketing;
  noiDung: string; // Hỗ trợ {{tenCongTy}}, {{soDienThoai}}
}

// Transaction Interface
export interface GiaoDich {
    id: string;
    loai: 'NAP_TIEN' | 'TRU_PHI';
    soTien: number;
    noiDung: string;
    thoiGian: string;
    trangThai: 'THANH_CONG' | 'THAT_BAI';
}

// Interface Thông Báo (Notification)
export interface ThongBao {
    id: string;
    tieuDe: string;
    noiDung: string;
    loai: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    thoiGian: string; // ISO String
    daXem: boolean;
}