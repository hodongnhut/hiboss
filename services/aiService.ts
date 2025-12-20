// Hàm phân loại ngành nghề dựa trên từ khóa (Thay thế cho Gemini AI)
// Giúp Sếp vẫn phân loại được dữ liệu khi import mà không tốn phí API
export const phanLoaiNganhNghe = async (danhSachCongTy: { id: string, ten: string }[]): Promise<Record<string, string>> => {
  const ketQua: Record<string, string> = {};

  const rules = [
    { keywords: ['spa', 'lavender', 'thẩm mỹ', 'beauty'], industry: 'Làm đẹp / Spa' },
    { keywords: ['công nghệ', 'software', 'giải pháp số', 'it', 'phần mềm'], industry: 'Công nghệ thông tin' },
    { keywords: ['xây dựng', 'kiến trúc', 'construction'], industry: 'Xây dựng' },
    { keywords: ['nội thất', 'decor'], industry: 'Nội thất' },
    { keywords: ['logistics', 'vận tải', 'giao nhận'], industry: 'Vận tải / Logistics' },
    { keywords: ['bất động sản', 'land', 'realty', 'nhà đất'], industry: 'Bất động sản' },
    { keywords: ['thực phẩm', 'sạch', 'nông nghiệp', 'food'], industry: 'Thực phẩm / Nông nghiệp' },
    { keywords: ['nhà hàng', 'cafe', 'restaurant'], industry: 'F&B' }
  ];

  danhSachCongTy.forEach(cty => {
    const tenThap = cty.ten.toLowerCase();
    let nganhFound = 'Khác (Chưa phân loại)';

    for (const rule of rules) {
      if (rule.keywords.some(k => tenThap.includes(k))) {
        nganhFound = rule.industry;
        break;
      }
    }

    ketQua[cty.id] = nganhFound;
  });

  // Giả lập độ trễ xử lý để Sếp thấy UI Loading đẹp mắt
  await new Promise(resolve => setTimeout(resolve, 800));

  return ketQua;
};


const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://api.chaosep.com';

interface ApiResponse {
  success: boolean;
  message: string;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: any[];
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const fetchCompanies = async (
  page: number = 1,
  pageSize: number = 20,
  search?: string,
  province?: string,
  industry?: string,
  taxCode?: string
): Promise<ApiResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Chưa đăng nhập. Vui lòng login lại.');
  }

  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) params.append('company_name', search);
  if (province && province !== 'ALL') params.append('province', province);
  if (industry && industry !== 'ALL') params.append('industry', industry);
  if (taxCode) params.append('tax_code', taxCode);

  const response = await fetch(`${API_BASE_URL}/company/index?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token hết hạn hoặc sai → tự động logout
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login'; // hoặc dùng navigate nếu có router
    throw new Error('Phiên đăng nhập hết hạn. Đang chuyển về trang login...');
  }

  if (!response.ok) {
    throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};