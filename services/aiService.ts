// Hàm phân loại ngành nghề dựa trên từ khóa (Thay thế cho Gemini AI)
// Giúp Sếp vẫn phân loại được dữ liệu khi import mà không tốn phí API
export const phanLoaiNganhNghe = async (danhSachCongTy: {id: string, ten: string}[]): Promise<Record<string, string>> => {
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