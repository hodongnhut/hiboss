import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Upload, Search, Filter, Users, ChevronDown, MoreHorizontal, Database, X, Check, MapPin, Loader2, Eye, Edit3, Trash2, Building2, Calendar, CreditCard, Phone, Mail, Globe, Briefcase, CheckSquare, Square, ChevronLeft, ChevronRight, Share2, Save } from 'lucide-react';
import { danhSachUserMau, toChucHienTai } from '../services/mockData';
import { phanLoaiNganhNghe, fetchCompanies, fetchProvinces } from '../services/aiService';
import { TrangThaiKhachHang, KhachHang, VaiTro } from '../types';

const Leads = () => {
    // State dữ liệu từ API
    const [leads, setLeads] = useState<KhachHang[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State dữ liệu Tỉnh Thành (Dropdown)
    const [provinces, setProvinces] = useState<any[]>([]);
    const [provincePage, setProvincePage] = useState(1);
    const [provinceSearch, setProvinceSearch] = useState('');
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [hasMoreProvinces, setHasMoreProvinces] = useState(true);
    const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
    const provinceRef = useRef<HTMLDivElement>(null);

    // Pagination Server-side
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProvince, setFilterProvince] = useState('ALL');
    const [filterIndustry, setFilterIndustry] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterSource, setFilterSource] = useState('ALL');

    // UI States
    const [isImporting, setIsImporting] = useState(false);

    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
    const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());

    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadProvinces = async (page: number, search: string, append: boolean = false) => {
        setLoadingProvinces(true);
        try {
            const res = await fetchProvinces(page, 20, search);
            if (res.success) {
                setProvinces(prev => append ? [...prev, ...res.items] : res.items);
                setHasMoreProvinces(res.page < res.totalPages);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingProvinces(false);
        }
    };

    // Load dữ liệu từ API (Server-side filtering & pagination)
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchCompanies(
                currentPage,
                pageSize,
                searchTerm || undefined,
                filterProvince === 'ALL' ? undefined : filterProvince,
                filterIndustry === 'ALL' ? undefined : filterIndustry
            );

            if (response.success) {
                const mappedLeads: KhachHang[] = response.items.map((item: any) => ({
                    id: item.id.toString(),
                    tenCongTy: item.company_name,
                    email: item.email || '',
                    soDienThoai: item.phone || '',
                    diaChi: item.province || 'Việt Nam',
                    nguoiLienHe: item.legal_representative || item.tax_code || 'Chưa rõ',
                    nganhNghe: item.industry || 'Khác',
                    trangThai: TrangThaiKhachHang.MOI,
                    ngayTao: item.created_at || new Date().toISOString(),
                    nguonGoc: 'SYSTEM',
                    tax_code: item.tax_code,
                    is_active: item.is_active,
                    address: item.address,
                    website: item.website
                }));

                setLeads(mappedLeads);
                setTotalItems(response.total);
                setTotalPages(response.totalPages);
            }
        } catch (err: any) {
            setError(err.message || 'Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentPage, pageSize, filterProvince, filterIndustry]);

    // Theo dõi tìm kiếm tỉnh thành
    useEffect(() => {
        const timer = setTimeout(() => {
            setProvincePage(1);
            loadProvinces(1, provinceSearch, false);
        }, 300);
        return () => clearTimeout(timer);
    }, [provinceSearch]);

    // Khi search, quay về trang 1 và delay gọi API (Debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage !== 1) setCurrentPage(1);
            else loadData();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Danh sách tỉnh thành cố định hoặc lấy từ dữ liệu mẫu
    const uniqueCities = [
        'Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
        'Bình Dương', 'Đồng Nai', 'Quảng Ninh', 'Vĩnh Phúc', 'Khác'
    ];

    const handleOpenDetail = (lead: any) => {
        console.log(lead)
        setSelectedLead(lead);
        setIsDetailOpen(true);
    };


    const handleSelectAll = () => {
        selectedLeadIds.size === leads.length
            ? setSelectedLeadIds(new Set())
            : setSelectedLeadIds(new Set(leads.map(l => l.id)));
    };

    const handleSelectOne = (id: string) => {
        const newSet = new Set(selectedLeadIds);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setSelectedLeadIds(newSet);
    };

    const handleSaveGroup = () => {
        if (!newGroupName) return;
        alert(`Đã lưu nhóm "${newGroupName}" với ${totalItems.toLocaleString()} khách hàng.`);
        setIsGroupModalOpen(false);
        setNewGroupName('');
    };

    const availableAgents = danhSachUserMau.filter(u => u.toChucId === toChucHienTai.id && u.trangThai === 'ACTIVE');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">DỮ LIỆU KHÁCH HÀNG</h1>
                    <p className="text-sm text-slate-500">
                        Hệ thống đang quản lý <strong className="text-blue-600">{totalItems.toLocaleString()}</strong> doanh nghiệp.
                    </p>
                </div>
                <div className="flex gap-3">
                    <input type="file" accept=".csv,.xlsx" ref={fileInputRef} className="hidden" onChange={() => { }} />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition active:scale-95">
                        <Upload size={18} /> Import Excel
                    </button>
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold border shadow-sm transition ${isFilterOpen ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                        <Filter size={18} /> {isFilterOpen ? 'Đóng Lọc' : 'Bộ Lọc'}
                    </button>
                </div>
            </div>

            {isFilterOpen && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-xl animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {/* Dropdown Khu Vực Thông Minh */}
                        <div className="space-y-2 relative" ref={provinceRef}>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Khu vực (Province)</label>
                            <button
                                onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                                className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-left"
                            >
                                <span className="truncate">{filterProvince === 'ALL' ? 'Tất cả tỉnh thành' : filterProvince}</span>
                                <ChevronDown size={18} className={`transition-transform ${isProvinceDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProvinceDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up max-h-[400px] flex flex-col">
                                    <div className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Tìm tỉnh thành..."
                                                value={provinceSearch}
                                                onChange={e => setProvinceSearch(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                                        <button
                                            onClick={() => { setFilterProvince('ALL'); setIsProvinceDropdownOpen(false); }}
                                            className={`w-full text-left px-5 py-3 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${filterProvince === 'ALL' ? 'text-blue-600 bg-blue-50' : ''}`}
                                        >
                                            Tất cả tỉnh thành
                                        </button>
                                        {provinces.map(prov => (
                                            <button
                                                key={prov.id}
                                                onClick={() => { setFilterProvince(prov.title); setIsProvinceDropdownOpen(false); }}
                                                className={`w-full text-left px-5 py-3 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${filterProvince === prov.title ? 'text-blue-600 bg-blue-50' : ''}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{prov.title}</span>
                                                    <span className="text-[9px] text-slate-400 font-black">({prov.total_doanh_nghiep?.toLocaleString()} cty)</span>
                                                </div>
                                            </button>
                                        ))}
                                        {loadingProvinces && (
                                            <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={20} /></div>
                                        )}
                                        {hasMoreProvinces && !loadingProvinces && (
                                            <button
                                                onClick={() => {
                                                    const next = provincePage + 1;
                                                    setProvincePage(next);
                                                    loadProvinces(next, provinceSearch, true);
                                                }}
                                                className="w-full py-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-slate-50 border-t dark:border-slate-700"
                                            >
                                                Tải thêm...
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngành nghề</label>
                            <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold">
                                <option value="ALL">Tất cả ngành nghề</option>
                                <option value="Xây dựng">Xây dựng</option>
                                <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                                <option value="Làm đẹp / Spa">Làm đẹp / Spa</option>
                                <option value="Bất động sản">Bất động sản</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái CRM</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold">
                                <option value="ALL">Tất cả trạng thái</option>
                                {Object.values(TrangThaiKhachHang).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nguồn dữ liệu</label>
                            <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold">
                                <option value="ALL">Tất cả nguồn</option>
                                <option value="SYSTEM">Dữ liệu hệ thống</option>
                                <option value="UPLOAD">File Upload</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-sm text-slate-500 font-medium italic">Kết quả được lọc trực tiếp từ máy chủ...</div>
                        <button onClick={() => setIsGroupModalOpen(true)} className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                            <Users size={16} /> Lưu thành Nhóm (Segment)
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg relative min-h-[500px]">
                {/* Search Header */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Tìm tên công ty, mã số thuế..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium outline-none" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Dòng hiển thị:</span>
                        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-lg font-bold text-sm outline-none">
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                            <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Đang tải dữ liệu từ Server...</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 w-[50px]"><button onClick={handleSelectAll} className="hover:text-blue-600">{selectedLeadIds.size > 0 && selectedLeadIds.size === leads.length ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} />}</button></th>
                                    <th className="px-6 py-4">Doanh Nghiệp</th>
                                    <th className="px-6 py-4">Mã Số Thuế </th>
                                    <th className="px-6 py-4">Ngành Nghề</th>
                                    <th className="px-6 py-4">Tỉnh Thành</th>
                                    <th className="px-6 py-4">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {leads.length > 0 ? leads.map(lead => (
                                    <tr key={lead.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors ${selectedLeadIds.has(lead.id) ? 'bg-blue-50/50' : ''}`}>
                                        <td className="px-6 py-4"><button onClick={() => handleSelectOne(lead.id)}>{selectedLeadIds.has(lead.id) ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} />}</button></td>
                                        <td className="px-6 py-4">
                                            <p className="font-black text-slate-800 dark:text-slate-200 uppercase truncate max-w-[300px]">{lead.tenCongTy}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black uppercase border border-blue-200">SYSTEM</span>
                                                <span className="text-[10px] text-slate-400 font-bold">ID: {lead.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-mono font-bold text-blue-600 text-xs">{lead.nguoiLienHe}</p>
                                            {lead.email && (
                                                <p className="text-[10px] text-slate-500 mt-1">
                                                    {lead.email}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {lead.nganhNghe && lead.nganhNghe.split(',').map((nganh: string, index: number) => {
                                                const trimmedNganh = nganh.trim();
                                                if (!trimmedNganh) return null;
                                                return (
                                                    <span
                                                        key={index}
                                                        className="inline-block px-2 py-1 mr-2 mb-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-black uppercase tracking-tighter border border-slate-200 dark:border-slate-600"
                                                    >
                                                        {trimmedNganh}
                                                    </span>
                                                );
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 max-w-[200px] truncate">
                                                <MapPin size={12} className="shrink-0" /> {lead.diaChi}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => handleOpenDetail(lead)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Xem chi tiết"><Eye size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">Không tìm thấy kết quả nào từ máy chủ.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Server-side Pagination Footer */}
                {/* Pagination */}
                <div className="p-5 border-t flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-xs font-bold text-slate-500 uppercase">
                        Trang {currentPage} / {totalPages} • Tổng {totalItems.toLocaleString()} doanh nghiệp
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading}
                            className="p-2 border rounded-xl disabled:opacity-50"><ChevronLeft size={18} /></button>

                        {/* Hiển thị tối đa 7 trang */}
                        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                            let pageNum = i + 1;
                            if (totalPages > 7 && currentPage > 4) pageNum = currentPage - 3 + i;
                            if (pageNum > totalPages || pageNum < 1) return null;
                            if (i === 6 && totalPages > 7) return <span key="dots" className="px-3">...</span>;

                            return (
                                <button key={pageNum} onClick={() => setCurrentPage(pageNum)} disabled={loading}
                                    className={`w-10 h-10 rounded-xl font-bold ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading}
                            className="p-2 border rounded-xl disabled:opacity-50"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Modal Group */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-fade-in">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-tighter"><Users size={20} className="text-purple-600" /> Lưu Nhóm Khách Hàng</h3>
                            <button onClick={() => setIsGroupModalOpen(false)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/50">
                                <p className="text-xs font-bold text-purple-700 dark:text-purple-400 leading-relaxed uppercase tracking-wider">Lưu <span className="text-lg">{totalItems.toLocaleString()}</span> khách hàng đang lọc vào Segment mới.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên nhóm phân loại</label>
                                <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold text-sm shadow-inner" placeholder="VD: Khách hàng Spa tại TP.HCM..." autoFocus />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-4 bg-slate-50/50">
                            <button onClick={() => setIsGroupModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-white transition-all">Hủy</button>
                            <button onClick={handleSaveGroup} className="flex-1 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"><Save size={18} /> Lưu Nhóm</button>
                        </div>
                    </div>
                </div>
            )}

            {isDetailOpen && selectedLead && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
                        {/* Header Dialog */}
                        <div className="p-8 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-800 shrink-0">
                            <div className="flex gap-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20"><Building2 size={32} /></div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-2">{selectedLead.company_name}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">MST: {selectedLead.tax_code}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedLead.is_active === 1 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{selectedLead.is_active === 1 ? 'ACTIVE' : 'INACTIVE'}</span>
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-200">ID: {selectedLead.id}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"><X size={24} /></button>
                        </div>

                        {/* Body Dialog */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">Hồ sơ doanh nghiệp</h3>
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tên Doanh Nghiệp</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-300 uppercase">{selectedLead.tenCongTy || '-- CHƯA CẬP NHẬT --'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={12} /> Thành lập</p>
                                                <p className="font-bold text-slate-700 dark:text-slate-300">{selectedLead.ngayTao || '--'}</p>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1"><CreditCard size={12} /> Vốn điều lệ</p>
                                                <p className="font-bold text-slate-700 dark:text-slate-300">{selectedLead.capital ? `${selectedLead.capital.toLocaleString()} VND` : '--'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Người đại diện pháp luật || MST</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-300 uppercase">{selectedLead.nguoiLienHe || '-- ĐANG CẬP NHẬT --'}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngành Nghề</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-300 uppercase">{selectedLead.nganhNghe || '-- ĐANG CẬP NHẬT --'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">Liên hệ & Vị trí</h3>
                                    <div className="space-y-4">
                                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100/50 dark:border-blue-800/30">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-blue-600 rounded-2xl text-white"><MapPin size={20} /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-1">Địa chỉ đăng ký</p>
                                                    <p className="font-bold text-slate-700 dark:text-slate-300 leading-tight">{selectedLead.address}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{selectedLead.province}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700 transition-colors hover:bg-white">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500"><Phone size={18} /></div>
                                                <div className="flex-1"><p className="text-[10px] font-black text-slate-400 uppercase">Điện thoại</p><p className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedLead.soDienThoai || '-- CHƯA CÓ --'}</p></div>
                                                {selectedLead.soDienThoai && <button className="p-2 bg-blue-600 text-white rounded-xl shadow-lg active:scale-95"><Phone size={16} /></button>}
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700 transition-colors hover:bg-white">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500"><Mail size={18} /></div>
                                                <div className="flex-1"><p className="text-[10px] font-black text-slate-400 uppercase">Hòm thư (Email)</p><p className="font-bold text-slate-800 dark:text-slate-200">{selectedLead.email || '-- CHƯA CÓ --'}</p></div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700 transition-colors hover:bg-white">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500"><Globe size={18} /></div>
                                                <div className="flex-1"><p className="text-[10px] font-black text-slate-400 uppercase">Trang web</p><p className="font-bold text-slate-800 dark:text-slate-200">{selectedLead.website || '-- CHƯA CÓ --'}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Dialog */}
                        <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4 shrink-0">
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"><Phone size={16} /> Gọi tư vấn</button>
                                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"><Share2 size={16} /> Chia cho Sale</button>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl font-black text-xs text-slate-500 dark:text-slate-300 uppercase tracking-widest hover:bg-slate-50 transition-all"><Save size={16} className="inline mr-2" /> Cập nhật</button>
                                <button onClick={() => setIsDetailOpen(false)} className="px-6 py-3 bg-slate-200 dark:bg-slate-700 rounded-2xl font-black text-xs text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:bg-slate-300 transition-all">Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;