import { KhachHang, TrangThaiKhachHang, ChienDich, KenhMarketing, VaiTro, LichSuCuocGoi, NguoiDung, GiaoDich, ThongBao, NhomKhachHang, ToChuc } from '../types';

// Mock Tổ chức (Doanh nghiệp)
export const toChucHienTai: ToChuc = {
    id: 'ORG_001',
    tenToChuc: 'Công Ty Bất Động Sản Hưng Thịnh',
    goiDichVu: 'ENTERPRISE',
    ngayHetHan: '2025-12-31',
    trangThai: 'ACTIVE'
};

// Mock Users (Nhân viên của tổ chức này)
export const danhSachUserMau: NguoiDung[] = [
    {
        id: 'US001',
        toChucId: 'ORG_001',
        hoTen: 'Nguyễn Văn Giám Đốc',
        email: 'ceo@hungthinh.vn',
        vaiTro: VaiTro.ORG_ADMIN,
        trangThai: 'ACTIVE',
        ngayTao: '2023-01-01',
        soDienThoai: '0909123456'
    },
    {
        id: 'US002',
        toChucId: 'ORG_001',
        hoTen: 'Trần Trưởng Phòng',
        email: 'manager@hungthinh.vn',
        vaiTro: VaiTro.SALE_MANAGER,
        trangThai: 'ACTIVE',
        ngayTao: '2023-02-15',
        soDienThoai: '0909111222'
    },
    {
        id: 'US003',
        toChucId: 'ORG_001',
        hoTen: 'Lê Sale 1',
        email: 'sale1@hungthinh.vn',
        vaiTro: VaiTro.SALE_AGENT,
        trangThai: 'ACTIVE',
        ngayTao: '2023-06-15',
        soDienThoai: '0909333444'
    },
    {
        id: 'US004',
        toChucId: 'ORG_001',
        hoTen: 'Phạm Sale 2',
        email: 'sale2@hungthinh.vn',
        vaiTro: VaiTro.SALE_AGENT,
        trangThai: 'INACTIVE',
        ngayTao: '2023-08-20',
        soDienThoai: '0909555666'
    }
];

export const danhSachKhachHangMau: KhachHang[] = [
    {
        id: 'KH001',
        toChucId: 'ORG_001',
        tenCongTy: 'Công ty TNHH Giải Pháp Số 1',
        nguoiLienHe: 'Nguyễn Văn A',
        soDienThoai: '0901234567',
        email: 'lienhe@so1.vn',
        diaChi: 'Quận 1, TP.HCM',
        nganhNghe: 'Công nghệ thông tin',
        trangThai: TrangThaiKhachHang.MOI,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },
    {
        id: 'KH002',
        toChucId: 'ORG_001',
        tenCongTy: 'Tập đoàn Xây Dựng Bình An',
        nguoiLienHe: 'Trần Thị B',
        soDienThoai: '0912345678',
        email: 'b.tran@binhan.com',
        diaChi: 'Cầu Giấy, Hà Nội',
        nganhNghe: 'Xây dựng',
        trangThai: TrangThaiKhachHang.TIEM_NANG,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },
    {
        id: 'KH003',
        toChucId: 'ORG_001',
        tenCongTy: 'Nội Thất Hoàn Mỹ',
        nguoiLienHe: 'Lê Văn C',
        soDienThoai: '0987654321',
        email: 'c.le@hoanmy.vn',
        diaChi: 'Hải Châu, Đà Nẵng',
        nganhNghe: 'Nội thất',
        trangThai: TrangThaiKhachHang.KHONG_NGHE_MAY,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },
    {
        id: 'KH004',
        toChucId: 'ORG_001',
        tenCongTy: 'Logistics Toàn Cầu',
        nguoiLienHe: 'Phạm D',
        soDienThoai: '0999888777',
        email: 'd.pham@logistics.vn',
        diaChi: 'Ngô Quyền, Hải Phòng',
        nganhNghe: 'Vận tải',
        trangThai: TrangThaiKhachHang.MOI,
        nguonGoc: 'UPLOAD',
        ngayTao: new Date().toISOString()
    },
    {
        id: 'KH005',
        toChucId: 'ORG_001',
        tenCongTy: 'Thực Phẩm Sạch Xanh',
        nguoiLienHe: 'Hoàng E',
        soDienThoai: '0905555666',
        email: 'e.hoang@sachxanh.com',
        diaChi: 'Phường 3, Đà Lạt',
        nganhNghe: 'Nông nghiệp',
        trangThai: TrangThaiKhachHang.TU_CHOI,
        nguonGoc: 'UPLOAD',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH006',
        toChucId: 'ORG_001',
        tenCongTy: 'Công Nghệ Việt Software',
        nguoiLienHe: 'Đỗ F',
        soDienThoai: '0906666777',
        email: 'f.do@vietsoft.vn',
        diaChi: 'Tân Bình, TP.HCM',
        nganhNghe: 'Công nghệ thông tin',
        trangThai: TrangThaiKhachHang.TIEM_NANG,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },
    {
        id: 'KH007',
        toChucId: 'ORG_001',
        tenCongTy: 'Du Lịch Ánh Dương',
        nguoiLienHe: 'Nguyễn Minh G',
        soDienThoai: '0907000007',
        email: 'contact@anhduongtravel.vn',
        diaChi: 'Quận 3, TP.HCM',
        nganhNghe: 'Du lịch',
        trangThai: TrangThaiKhachHang.MOI,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },
    {
        id: 'KH008',
        toChucId: 'ORG_001',
        tenCongTy: 'Giáo Dục Tương Lai',
        nguoiLienHe: 'Phạm Thị H',
        soDienThoai: '0908000008',
        email: 'info@futureedu.vn',
        diaChi: 'Thanh Xuân, Hà Nội',
        nganhNghe: 'Giáo dục',
        trangThai: TrangThaiKhachHang.TIEM_NANG,
        nguonGoc: 'UPLOAD',
        ngayTao: new Date().toISOString()
    },
    {
        id: 'KH009',
        toChucId: 'ORG_001',
        tenCongTy: 'Y Tế An Tâm',
        nguoiLienHe: 'Lê Quốc I',
        soDienThoai: '0909000009',
        email: 'support@antamhealth.vn',
        diaChi: 'Ninh Kiều, Cần Thơ',
        nganhNghe: 'Y tế',
        trangThai: TrangThaiKhachHang.MOI,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH010',
        toChucId: 'ORG_001',
        tenCongTy: 'Thương Mại Đại Phát',
        nguoiLienHe: 'Trần Văn J',
        soDienThoai: '0910000010',
        email: 'sales@daiphat.vn',
        diaChi: 'Biên Hòa, Đồng Nai',
        nganhNghe: 'Thương mại',
        trangThai: TrangThaiKhachHang.KHONG_NGHE_MAY,
        nguonGoc: 'UPLOAD',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH011',
        toChucId: 'ORG_001',
        tenCongTy: 'Bất Động Sản Hưng Thịnh',
        nguoiLienHe: 'Ngô K',
        soDienThoai: '0911000011',
        email: 'contact@hungthinhland.vn',
        diaChi: 'Quận 2, TP.HCM',
        nganhNghe: 'Bất động sản',
        trangThai: TrangThaiKhachHang.TIEM_NANG,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH012',
        toChucId: 'ORG_001',
        tenCongTy: 'Thời Trang An Nhiên',
        nguoiLienHe: 'Võ L',
        soDienThoai: '0912000012',
        email: 'hello@annhienfashion.vn',
        diaChi: 'Quận 10, TP.HCM',
        nganhNghe: 'Thời trang',
        trangThai: TrangThaiKhachHang.MOI,
        nguonGoc: 'UPLOAD',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH013',
        toChucId: 'ORG_001',
        tenCongTy: 'Nhà Hàng Hương Việt',
        nguoiLienHe: 'Trịnh M',
        soDienThoai: '0913000013',
        email: 'nhahang@huongviet.vn',
        diaChi: 'Hoàn Kiếm, Hà Nội',
        nganhNghe: 'Ẩm thực',
        trangThai: TrangThaiKhachHang.TU_CHOI,
        nguonGoc: 'UPLOAD',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH014',
        toChucId: 'ORG_001',
        tenCongTy: 'Sản Xuất Minh Long',
        nguoiLienHe: 'Phan N',
        soDienThoai: '0914000014',
        email: 'info@minhlong.vn',
        diaChi: 'Thuận An, Bình Dương',
        nganhNghe: 'Sản xuất',
        trangThai: TrangThaiKhachHang.MOI,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH015',
        toChucId: 'ORG_001',
        tenCongTy: 'Marketing Sao Việt',
        nguoiLienHe: 'Đinh O',
        soDienThoai: '0915000015',
        email: 'contact@saovietmedia.vn',
        diaChi: 'Quận Phú Nhuận, TP.HCM',
        nganhNghe: 'Marketing',
        trangThai: TrangThaiKhachHang.TIEM_NANG,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH016',
        toChucId: 'ORG_001',
        tenCongTy: 'Cơ Khí Đại Thành',
        nguoiLienHe: 'Nguyễn P',
        soDienThoai: '0916000016',
        email: 'sales@daithanhmech.vn',
        diaChi: 'Dĩ An, Bình Dương',
        nganhNghe: 'Cơ khí',
        trangThai: TrangThaiKhachHang.MOI,
        nguonGoc: 'UPLOAD',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH017',
        toChucId: 'ORG_001',
        tenCongTy: 'Xuất Nhập Khẩu Hòa Bình',
        nguoiLienHe: 'Lưu Q',
        soDienThoai: '0917000017',
        email: 'info@hoabinhimex.vn',
        diaChi: 'Long Biên, Hà Nội',
        nganhNghe: 'Xuất nhập khẩu',
        trangThai: TrangThaiKhachHang.TIEM_NANG,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH018',
        toChucId: 'ORG_001',
        tenCongTy: 'Phần Mềm Cloud One',
        nguoiLienHe: 'Đặng R',
        soDienThoai: '0918000018',
        email: 'hello@cloudone.vn',
        diaChi: 'Quận 7, TP.HCM',
        nganhNghe: 'Công nghệ thông tin',
        trangThai: TrangThaiKhachHang.MOI,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH019',
        toChucId: 'ORG_001',
        tenCongTy: 'Spa & Beauty Ngọc Mai',
        nguoiLienHe: 'Mai S',
        soDienThoai: '0919000019',
        email: 'booking@ngocmaispa.vn',
        diaChi: 'Quận 5, TP.HCM',
        nganhNghe: 'Làm đẹp',
        trangThai: TrangThaiKhachHang.TU_CHOI,
        nguonGoc: 'UPLOAD',
        ngayTao: new Date().toISOString()
    },

    {
        id: 'KH020',
        toChucId: 'ORG_001',
        tenCongTy: 'Thương Mại Điện Tử Nhanh',
        nguoiLienHe: 'Vũ T',
        soDienThoai: '0920000020',
        email: 'support@etnhanh.vn',
        diaChi: 'Quận Nam Từ Liêm, Hà Nội',
        nganhNghe: 'Thương mại điện tử',
        trangThai: TrangThaiKhachHang.TIEM_NANG,
        nguonGoc: 'SYSTEM',
        ngayTao: new Date().toISOString()
    }
];


export const danhSachNhomKhachHangMau: NhomKhachHang[] = [
    {
        id: 'NH001',
        tenNhom: 'Khách hàng tại Hà Nội',
        soLuong: 450,
        moTa: 'Tất cả khách hàng có địa chỉ tại Hà Nội',
        ngayTao: '2023-10-01'
    },
    {
        id: 'NH002',
        tenNhom: 'Công ty Công Nghệ HCM',
        soLuong: 120,
        moTa: 'Ngành IT tại khu vực TP.HCM',
        ngayTao: '2023-10-05'
    }
];

export const danhSachChienDichMau: ChienDich[] = [
    {
        id: 'CD001',
        tenChienDich: 'Chào bán gói CRM Tháng 10',
        kenh: [KenhMarketing.EMAIL],
        trangThai: 'DANG_CHAY',
        soLuongLead: 1500,
        tienDo: 45,
        nganSachDuKien: 5000000
    },
    {
        id: 'CD002',
        tenChienDich: 'CSKH cũ Zalo ZNS',
        kenh: [KenhMarketing.ZALO],
        trangThai: 'DANG_CHAY',
        soLuongLead: 500,
        tienDo: 60,
        nganSachDuKien: 200000
    },
    {
        id: 'CD003',
        tenChienDich: 'Thông báo bảo trì hệ thống',
        kenh: [KenhMarketing.SMS],
        trangThai: 'HOAN_THANH',
        soLuongLead: 2000,
        tienDo: 100,
        nganSachDuKien: 1500000
    }
];

export const lichSuCuocGoiMau: LichSuCuocGoi[] = [
    {
        id: 'CG001',
        khachHangId: 'KH002',
        agentId: 'AG001',
        thoiGianBatDau: new Date(Date.now() - 3600000).toISOString(),
        thoiLuongGiay: 125,
        trangThai: 'ANSWERED'
    },
    {
        id: 'CG002',
        khachHangId: 'KH003',
        agentId: 'AG001',
        thoiGianBatDau: new Date(Date.now() - 7200000).toISOString(),
        thoiLuongGiay: 0,
        trangThai: 'MISSED'
    }
];

export const lichSuGiaoDichMau: GiaoDich[] = [
    {
        id: 'GD001',
        loai: 'NAP_TIEN',
        soTien: 10000000,
        noiDung: 'Nạp tiền tài khoản chính qua VCB',
        thoiGian: new Date(Date.now() - 86400000 * 2).toISOString(),
        trangThai: 'THANH_CONG'
    },
    {
        id: 'GD002',
        loai: 'TRU_PHI',
        soTien: -500000,
        noiDung: 'Chi phí chiến dịch Call Tháng 10 (Ngày 25/10)',
        thoiGian: new Date(Date.now() - 86400000).toISOString(),
        trangThai: 'THANH_CONG'
    },
    {
        id: 'GD003',
        loai: 'TRU_PHI',
        soTien: -250000,
        noiDung: 'Gửi 500 tin nhắn ZNS CSKH',
        thoiGian: new Date().toISOString(),
        trangThai: 'THANH_CONG'
    }
];

// Mock Notifications
export const danhSachThongBaoMau: ThongBao[] = [
    {
        id: 'TB001',
        tieuDe: 'Khách hàng quan tâm',
        noiDung: 'KH Trần Thị B vừa mở email báo giá lần 2. Hãy gọi ngay!',
        loai: 'SUCCESS',
        thoiGian: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        daXem: false
    },
    {
        id: 'TB002',
        tieuDe: 'Cảnh báo số dư',
        noiDung: 'Số dư tài khoản marketing sắp hết (< 500k). Vui lòng nạp thêm.',
        loai: 'WARNING',
        thoiGian: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        daXem: false
    },
    {
        id: 'TB003',
        tieuDe: 'Chiến dịch hoàn thành',
        noiDung: 'Chiến dịch SMS CSKH cũ đã gửi xong 2000 tin nhắn.',
        loai: 'INFO',
        thoiGian: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        daXem: true
    },
    {
        id: 'TB004',
        tieuDe: 'Lỗi gửi ZNS',
        noiDung: 'Có 15 tin nhắn Zalo thất bại do người dùng chặn OA.',
        loai: 'ERROR',
        thoiGian: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        daXem: true
    }
];

// Mock Logs cho màn hình Campaign Detail (EMAIL)
export const logsEmailMau = [
    { time: '10:30:05', type: 'INFO', msg: 'Job #1023: Gửi email tới a.nguyen@companyA.com thành công.' },
    { time: '10:30:06', type: 'INFO', msg: 'Job #1024: Gửi email tới b.tran@companyB.com thành công.' },
    { time: '10:30:08', type: 'WARN', msg: 'Job #1025: Gửi email thất bại. Reason: Bounce (Email không tồn tại).' },
    { time: '10:30:10', type: 'SUCCESS', msg: 'Webhook: Khách hàng A.Nguyễn đã MỞ email.' },
    { time: '10:30:12', type: 'INFO', msg: 'Job #1026: Đang xử lý queue...' },
];

// Mock Logs cho Zalo ZNS
export const logsZaloMau = [
    { time: '10:30:05', type: 'INFO', msg: 'ZNS Job #551: Gửi template OTP đến 090xxxx123' },
    { time: '10:30:06', type: 'SUCCESS', msg: 'Zalo API: Đã gửi thành công (MsgID: 88291)' },
    { time: '10:30:15', type: 'SUCCESS', msg: 'Webhook: User 090xxxx123 ĐÃ XEM tin nhắn.' },
    { time: '10:30:20', type: 'WARN', msg: 'ZNS Job #552: Thất bại. Lý do: User chặn tin nhắn từ OA.' },
    { time: '10:30:22', type: 'INFO', msg: 'Queue: Đang lấy 5 job tiếp theo...' },
];

// Mock Logs cho SMS Brandname
export const logsSmsMau = [
    { time: '10:30:05', type: 'INFO', msg: 'SMS Job #901: Gửi tin Brandname [HISEP] tới 091xxxx456' },
    { time: '10:30:06', type: 'INFO', msg: 'Gateway: Đã chuyển tin sang Telco Viettel.' },
    { time: '10:30:08', type: 'SUCCESS', msg: 'Telco: Viettel xác nhận gửi thành công (Delivered).' },
    { time: '10:30:10', type: 'WARN', msg: 'SMS Job #902: Thuê bao Mobifone 070xxxx789 không liên lạc được.' },
    { time: '10:30:12', type: 'INFO', msg: 'Billing: Trừ 850đ vào tài khoản.' },
];