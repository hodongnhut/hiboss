import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Upload, Search, Filter, MoreHorizontal, Users, Save, Share2, UserCheck, CheckSquare, Square, ChevronLeft, ChevronRight, Loader2, AlertCircle, MapPin } from 'lucide-react';
import { danhSachUserMau, toChucHienTai } from '../services/mockData';
import { phanLoaiNganhNghe, fetchCompanies } from '../services/aiService';
import { TrangThaiKhachHang, KhachHang, VaiTro } from '../types';

const Leads = () => {
    // State dữ liệu từ API
    const [leads, setLeads] = useState<KhachHang[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination đồng bộ với backend
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter gửi lên server
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProvince, setFilterProvince] = useState<'ALL' | string>('ALL');
    const [filterIndustry, setFilterIndustry] = useState<'ALL' | string>('ALL');

    // Thêm lại các state này
    const [filterSource, setFilterSource] = useState<'ALL' | 'SYSTEM' | 'UPLOAD'>('ALL');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterCity, setFilterCity] = useState<string>('ALL'); // nếu muốn client-side city filter

    // Và computed filteredLeads (client-side cho Nguồn + Trạng thái + City)
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            if (filterSource !== 'ALL' && lead.nguonGoc !== filterSource) return false;
            if (filterStatus !== 'ALL' && lead.trangThai !== filterStatus) return false;
            if (filterCity !== 'ALL' && getCityFromAddress(lead.diaChi) !== filterCity) return false;
            return true;
        });
    }, [leads, filterSource, filterStatus, filterCity]);

    // Các state UI khác
    const [isImporting, setIsImporting] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
    const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());


    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper lấy tỉnh/thành từ địa chỉ (dùng để hiển thị filter)
    const getCityFromAddress = (address: string): string => {
        if (!address) return 'Khác';
        const lower = address.toLowerCase();
        if (lower.includes('hcm') || lower.includes('hồ chí minh') || lower.includes('ho chi minh')) return 'TP.HCM';
        if (lower.includes('hà nội') || lower.includes('ha noi')) return 'Hà Nội';
        if (lower.includes('đà nẵng') || lower.includes('da nang')) return 'Đà Nẵng';
        if (lower.includes('hải phòng')) return 'Hải Phòng';
        if (lower.includes('cần thơ')) return 'Cần Thơ';
        if (lower.includes('bình dương')) return 'Bình Dương';
        if (lower.includes('đồng nai')) return 'Đồng Nai';
        return 'Khác';
    };

    // Load dữ liệu từ API
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

            const mappedLeads: KhachHang[] = response.items.map((item: any) => ({
                id: item.tax_code || item.id.toString(),
                tenCongTy: item.company_name || 'Chưa có tên',
                email: item.email || '',
                soDienThoai: item.phone || '',
                diaChi: item.address || '',
                nguoiLienHe: item.legal_representative || item.director || 'Chưa rõ',
                nganhNghe: item.industry || 'Đang cập nhật',
                trangThai: TrangThaiKhachHang.MOI,
                ngayTao: item.established_date || item.created_at || new Date().toISOString(),
                nguonGoc: 'SYSTEM' as const,
                nguoiPhuTrachId: undefined,
            }));

            setLeads(mappedLeads);
            setTotalItems(response.total);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            setError(err.message || 'Không thể tải dữ liệu từ server');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentPage, pageSize, searchTerm, filterProvince, filterIndustry]);

    // Reset page 1 khi filter/search/pageSize thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterProvince, filterIndustry, pageSize]);

    // Unique values cho dropdown filter (từ data hiện tại)
    const uniqueProvinces = useMemo(() => {
        const set = new Set(leads.map(l => getCityFromAddress(l.diaChi)));
        return ['ALL', ...Array.from(set).sort()];
    }, [leads]);

    const uniqueIndustries = useMemo(() => {
        const set = new Set(leads.map(l => l.nganhNghe || 'Đang cập nhật'));
        return ['ALL', ...Array.from(set).sort()];
    }, [leads]);

    // Import file + AI phân loại (mock)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setTimeout(async () => {
            const newLeadsMock = [
                { id: `UP_${Date.now()}_1`, tenCongTy: 'Công Ty ABC', email: 'abc@gmail.com', soDienThoai: '0909000111', nguoiLienHe: 'Mr X', diaChi: 'Quận 3, TP.HCM', nguonGoc: 'UPLOAD' },
                { id: `UP_${Date.now()}_2`, tenCongTy: 'Nhà Hàng Biển Đông', email: 'biendong@gmail.com', soDienThoai: '0909000222', nguoiLienHe: 'Ms Y', diaChi: 'Ba Đình, Hà Nội', nguonGoc: 'UPLOAD' },
                { id: `UP_${Date.now()}_3`, tenCongTy: 'Spa Lavender', email: 'spa@gmail.com', soDienThoai: '0909000333', nguoiLienHe: 'Ms Z', diaChi: 'Quận 1, TP.HCM', nguonGoc: 'UPLOAD' },
                { id: `UP_${Date.now()}_4`, tenCongTy: 'Nội Thất Xinh', email: 'noithat@gmail.com', soDienThoai: '0909000444', nguoiLienHe: 'Mr T', diaChi: 'Đà Nẵng', nguonGoc: 'UPLOAD' },
            ];

            const mapping = await phanLoaiNganhNghe(newLeadsMock.map(l => ({ id: l.id, ten: l.tenCongTy })));
            const enriched = newLeadsMock.map(l => ({
                ...l,
                nganhNghe: mapping[l.id] || 'Đang cập nhật',
                trangThai: TrangThaiKhachHang.MOI,
                ngayTao: new Date().toISOString(),
            }));

            setLeads(prev => [...enriched, ...prev]); // Thêm vào đầu danh sách
            setTotalItems(prev => prev + enriched.length); // Cập nhật tổng (ước lượng)
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            alert(`Import thành công ${enriched.length} leads mới!`);
        }, 2000);
    };

    // Select all / one
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

    // Assign leads
    const getAssigneeName = (id?: string) => id ? danhSachUserMau.find(u => u.id === id)?.hoTen || 'Unknown' : null;

    const handleToggleAgent = (agentId: string) => {
        const newSet = new Set(selectedAgentIds);
        newSet.has(agentId) ? newSet.delete(agentId) : newSet.add(agentId);
        setSelectedAgentIds(newSet);
    };

    const executeAssignment = () => {
        if (selectedAgentIds.size === 0) return alert('Chọn ít nhất 1 nhân viên!');
        const agents = Array.from(selectedAgentIds);
        const updated = leads.map(l =>
            selectedLeadIds.has(l.id)
                ? { ...l, nguoiPhuTrachId: agents[Math.floor(Math.random() * agents.length)] } // Round robin đơn giản
                : l
        );
        setLeads(updated);
        setIsAssignModalOpen(false);
        setSelectedLeadIds(new Set());
        setSelectedAgentIds(new Set());
        alert(`Đã phân chia ${selectedLeadIds.size} leads thành công!`);
    };

    const availableAgents = danhSachUserMau.filter(u =>
        u.toChucId === toChucHienTai.id &&
        (u.vaiTro === VaiTro.SALE_AGENT || u.vaiTro === VaiTro.SALE_MANAGER) &&
        u.trangThai === 'ACTIVE'
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">DỮ LIỆU KHÁCH HÀNG</h1>
                    <p className="text-sm text-slate-500">
                        {loading ? 'Đang tải...' : `Tổng ${totalItems.toLocaleString()} doanh nghiệp Việt Nam`}
                    </p>
                    {error && (
                        <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 rounded-xl flex items-center gap-3">
                            <AlertCircle size={18} className="text-red-600" />
                            <span className="text-sm font-medium text-red-700 dark:text-red-300">{error}</span>
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <input type="file" accept=".csv,.xlsx" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={isImporting}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition">
                        {isImporting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                        {isImporting ? 'Đang xử lý...' : 'Import File'}
                    </button>
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold border shadow-sm transition ${isFilterOpen ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                        <Filter size={18} /> Lọc Dữ Liệu
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-xl animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Filter size={18} className="text-blue-600" /> Bộ Lọc & Phân Nhóm
                        </h3>
                        <button
                            onClick={() => {
                                setFilterSource('ALL');
                                setFilterStatus('ALL');
                                setFilterProvince('ALL');
                                setFilterIndustry('ALL');
                            }}
                            className="text-xs text-slate-500 hover:text-blue-600 hover:underline font-bold uppercase tracking-wider"
                        >
                            Đặt lại tất cả
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* 1. Nguồn dữ liệu (client-side) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Nguồn dữ liệu
                            </label>
                            <select
                                value={filterSource}
                                onChange={(e) => setFilterSource(e.target.value as any)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                            >
                                <option value="ALL">Tất cả nguồn</option>
                                <option value="SYSTEM">Dữ liệu hệ thống</option>
                                <option value="UPLOAD">File Upload</option>
                            </select>
                        </div>

                        {/* 2. Khu vực (City) - server-side */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Khu vực (City)
                            </label>
                            <select
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                            >
                                <option value="ALL">Tất cả khu vực</option>
                                {uniqueCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Trạng thái (client-side) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Trạng thái
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                {Object.values(TrangThaiKhachHang).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {/* 4. Ngành nghề (server-side) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Ngành nghề (AI)
                            </label>
                            <select
                                value={filterIndustry}
                                onChange={(e) => setFilterIndustry(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                            >
                                <option value="ALL">Tất cả ngành nghề</option>
                                {uniqueIndustries.map(ind => (
                                    <option key={ind} value={ind}>{ind}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Hiển thị số lượng */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Tìm thấy <strong className="text-blue-600 font-bold">
                                {filterSource !== 'ALL' || filterStatus !== 'ALL'
                                    ? filteredLeads.length.toLocaleString()
                                    : totalItems.toLocaleString()}
                            </strong> khách hàng phù hợp
                        </div>
                        <button
                            onClick={() => setIsGroupModalOpen(true)}
                            disabled={(filterSource !== 'ALL' || filterStatus !== 'ALL' ? filteredLeads.length : totalItems) === 0}
                            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all disabled:cursor-not-allowed"
                        >
                            <Users size={16} /> Lưu thành Nhóm
                        </button>
                    </div>
                </div>
            )}

            {/* Table + Pagination */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
                {/* Search + PageSize */}
                <div className="p-5 border-b flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm tên công ty, mã số thuế, SĐT..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 uppercase">Hiển thị</span>
                        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
                            className="px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg font-bold">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center">
                            <Loader2 className="animate-spin mb-4" size={48} />
                            <p className="text-slate-500 font-bold">Đang tải dữ liệu doanh nghiệp...</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-black uppercase text-slate-500 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left"><button onClick={handleSelectAll}><CheckSquare size={18} /></button></th>
                                    <th className="px-6 py-4">Tên Công Ty</th>
                                    <th className="px-6 py-4">Liên Hệ</th>
                                    <th className="px-6 py-4">Phụ Trách</th>
                                    <th className="px-6 py-4">Ngành Nghề</th>
                                    <th className="px-6 py-4">Trạng Thái</th>
                                    <th className="px-6 py-4 text-right">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {leads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4"><button onClick={() => handleSelectOne(lead.id)}>{selectedLeadIds.has(lead.id) ? <CheckSquare className="text-blue-600" /> : <Square />}</button></td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold">{lead.tenCongTy}</p>
                                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black ${lead.nguonGoc === 'SYSTEM' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{lead.nguonGoc}</span>
                                                <span className="flex items-center gap-1"><MapPin size={10} />{lead.diaChi}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <p className="font-bold">{lead.nguoiLienHe}</p>
                                            <p className="text-slate-500">{lead.soDienThoai}</p>
                                            <p className="truncate max-w-[150px]">{lead.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {lead.nguoiPhuTrachId ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black">{getAssigneeName(lead.nguoiPhuTrachId)?.[0]}</div>
                                                    <span className="text-xs font-bold">{getAssigneeName(lead.nguoiPhuTrachId)}</span>
                                                </div>
                                            ) : <span className="text-xs text-slate-400 italic">-- Trống --</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold">{lead.nganhNghe}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-black ${lead.trangThai === 'MOI' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {lead.trangThai}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"><MoreHorizontal size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

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

            {isGroupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-tighter"><Users size={20} className="text-purple-600" /> Lưu Nhóm Khách Hàng</h3>
                            <button onClick={() => setIsGroupModalOpen(false)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/50">
                                <p className="text-xs font-bold text-purple-700 dark:text-purple-400 leading-relaxed uppercase tracking-wider">Lưu <span className="text-lg">{filteredLeads.length}</span> khách hàng vào Segment mới để chạy chiến dịch.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên nhóm phân loại</label>
                                <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold text-sm shadow-inner" placeholder="VD: Khách hàng Spa tại TP.HCM..." autoFocus />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-4 bg-slate-50/50">
                            <button onClick={() => setIsGroupModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-white transition-all">Hủy</button>
                            <button onClick={handleSaveGroup} className="flex-1 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"><Save size={18} /> Lưu Nhóm</button>
                        </div>
                    </div>
                </div>
            )}

            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-blue-50/50 dark:bg-slate-700/30">
                            <h3 className="font-black text-lg text-blue-800 dark:text-blue-300 flex items-center gap-2 uppercase tracking-tighter"><Share2 size={20} /> Phân Chia Data</h3>
                            <button onClick={() => setIsAssignModalOpen(false)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8">
                            <div className="mb-6 flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">{selectedLeadIds.size}</div>
                                <div>
                                    <p className="font-black text-slate-800 dark:text-white uppercase text-xs">Đang chọn chia</p>
                                    <p className="text-[10px] text-slate-500 font-bold">Dữ liệu sẽ được chia đều theo cơ chế Round Robin.</p>
                                </div>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto shadow-inner">
                                <div className="bg-slate-50 dark:bg-slate-900 p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">Danh sách Sale ({selectedAgentIds.size} đã chọn)</div>
                                {availableAgents.map(agent => (
                                    <div key={agent.id} onClick={() => handleToggleAgent(agent.id)} className={`flex items-center gap-4 p-4 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all ${selectedAgentIds.has(agent.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedAgentIds.has(agent.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>{selectedAgentIds.has(agent.id) && <Check size={14} />}</div>
                                        <div className="flex-1">
                                            <p className="font-black text-xs text-slate-800 dark:text-white uppercase">{agent.hoTen}</p>
                                            <p className="text-[10px] text-slate-500 font-bold">{agent.email}</p>
                                        </div>
                                        {selectedAgentIds.size > 0 && selectedAgentIds.has(agent.id) && (
                                            <div className="text-[10px] font-black text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full uppercase">+{Math.floor(selectedLeadIds.size / selectedAgentIds.size)} leads</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-4 bg-slate-50/50">
                            <button onClick={() => setIsAssignModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-white transition-all">Bỏ qua</button>
                            <button onClick={executeAssignment} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"><UserCheck size={18} /> Xác Nhận Chia</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;