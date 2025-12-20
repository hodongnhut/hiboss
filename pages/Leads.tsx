import React, { useState, useRef, useMemo, useEffect } from 'react';
// Added Loader2 to the lucide-react import list
import { Upload, Search, Filter, MoreHorizontal, Database, CloudUpload, X, Check, ArrowUpDown, MapPin, Users, Save, Share2, UserCheck, CheckSquare, Square, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { danhSachKhachHangMau, danhSachUserMau, toChucHienTai } from '../services/mockData';
import { phanLoaiNganhNghe } from '../services/aiService';
import { TrangThaiKhachHang, KhachHang, VaiTro } from '../types';

const Leads = () => {
    const [leads, setLeads] = useState<KhachHang[]>(danhSachKhachHangMau);
    const [isImporting, setIsImporting] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Group States
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    // Assignment States
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
    const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSource, setFilterSource] = useState<'ALL' | 'SYSTEM' | 'UPLOAD'>('ALL');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterIndustry, setFilterIndustry] = useState<string>('ALL');
    const [filterCity, setFilterCity] = useState<string>('ALL');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper: Detect city from address
    const getCityFromAddress = (address: string) => {
        if (!address) return 'Khác';
        const lowerAddr = address.toLowerCase();
        if (lowerAddr.includes('hcm') || lowerAddr.includes('hồ chí minh') || lowerAddr.includes('ho chi minh')) return 'TP.HCM';
        if (lowerAddr.includes('hà nội') || lowerAddr.includes('ha noi')) return 'Hà Nội';
        if (lowerAddr.includes('đà nẵng') || lowerAddr.includes('da nang')) return 'Đà Nẵng';
        if (lowerAddr.includes('hải phòng')) return 'Hải Phòng';
        if (lowerAddr.includes('đà lạt') || lowerAddr.includes('lâm đồng')) return 'Đà Lạt';
        return 'Khác';
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsImporting(true);
            setTimeout(async () => {
                const newLeadsMock: any[] = [
                    { id: `KH_NEW_${Date.now()}_1`, tenCongTy: 'Công Ty ABC', email: 'abc@gmail.com', soDienThoai: '0909000111', trangThai: TrangThaiKhachHang.MOI, ngayTao: new Date().toISOString(), nguoiLienHe: 'Mr X', diaChi: 'Quận 3, TP.HCM', nguonGoc: 'UPLOAD' },
                    { id: `KH_NEW_${Date.now()}_2`, tenCongTy: 'Nhà Hàng Biển Đông', email: 'biendong@gmail.com', soDienThoai: '0909000222', trangThai: TrangThaiKhachHang.MOI, ngayTao: new Date().toISOString(), nguoiLienHe: 'Ms Y', diaChi: 'Ba Đình, Hà Nội', nguonGoc: 'UPLOAD' },
                    { id: `KH_NEW_${Date.now()}_3`, tenCongTy: 'Spa Lavender', email: 'spa@gmail.com', soDienThoai: '0909000333', trangThai: TrangThaiKhachHang.MOI, ngayTao: new Date().toISOString(), nguoiLienHe: 'Ms Z', diaChi: 'Quận 1, TP.HCM', nguonGoc: 'UPLOAD' },
                    { id: `KH_NEW_${Date.now()}_4`, tenCongTy: 'Nội Thất Xinh', email: 'noithat@gmail.com', soDienThoai: '0909000444', trangThai: TrangThaiKhachHang.MOI, ngayTao: new Date().toISOString(), nguoiLienHe: 'Mr T', diaChi: 'Đà Nẵng', nguonGoc: 'UPLOAD' }
                ];

                const mapping = await phanLoaiNganhNghe(newLeadsMock.map(l => ({ id: l.id, ten: l.tenCongTy })));
                const enrichedLeads = newLeadsMock.map(l => ({ ...l, nganhNghe: mapping[l.id] || 'Đang cập nhật' }));

                setLeads([...enrichedLeads, ...leads]);
                setIsImporting(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
                alert(`Đã import thành công ${newLeadsMock.length} leads và phân loại ngành nghề bằng AI.`);
            }, 2000);
        }
    };

    const uniqueIndustries = useMemo(() => {
        const industries = new Set(leads.map(l => l.nganhNghe || 'Chưa phân loại'));
        return Array.from(industries);
    }, [leads]);

    const uniqueCities = useMemo(() => {
        const cities = new Set(leads.map(l => getCityFromAddress(l.diaChi)));
        return Array.from(cities);
    }, [leads]);

    // Filtering Logic
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchSearch = lead.tenCongTy.toLowerCase().includes(searchTerm.toLowerCase()) || lead.soDienThoai.includes(searchTerm) || lead.email.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchSearch) return false;
            if (filterSource !== 'ALL' && lead.nguonGoc !== filterSource) return false;
            if (filterStatus !== 'ALL' && lead.trangThai !== filterStatus) return false;
            const leadIndustry = lead.nganhNghe || 'Chưa phân loại';
            if (filterIndustry !== 'ALL' && leadIndustry !== filterIndustry) return false;
            const leadCity = getCityFromAddress(lead.diaChi);
            if (filterCity !== 'ALL' && leadCity !== filterCity) return false;
            return true;
        });
    }, [leads, searchTerm, filterSource, filterStatus, filterIndustry, filterCity]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterSource, filterStatus, filterIndustry, filterCity, itemsPerPage]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const paginatedLeads = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredLeads, currentPage, itemsPerPage]);

    const handleSelectAll = () => {
        if (selectedLeadIds.size === paginatedLeads.length) {
            setSelectedLeadIds(new Set());
        } else {
            setSelectedLeadIds(new Set(paginatedLeads.map(l => l.id)));
        }
    };

    const handleSelectOne = (id: string) => {
        const newSelected = new Set(selectedLeadIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedLeadIds(newSelected);
    };

    const getAssigneeName = (id?: string) => {
        if (!id) return null;
        const user = danhSachUserMau.find(u => u.id === id);
        return user ? user.hoTen : 'Unknown';
    };

    const handleToggleAgent = (agentId: string) => {
        const newSelected = new Set(selectedAgentIds);
        if (newSelected.has(agentId)) newSelected.delete(agentId);
        else newSelected.add(agentId);
        setSelectedAgentIds(newSelected);
    };

    const executeAssignment = () => {
        if (selectedAgentIds.size === 0) {
            alert("Vui lòng chọn ít nhất 1 nhân viên để chia data!");
            return;
        }
        const agents = Array.from(selectedAgentIds);
        const leadsToAssign = Array.from(selectedLeadIds);
        const updatedLeads = [...leads];
        let agentIndex = 0;
        leadsToAssign.forEach(leadId => {
            const leadIndex = updatedLeads.findIndex(l => l.id === leadId);
            if (leadIndex !== -1) {
                updatedLeads[leadIndex] = { ...updatedLeads[leadIndex], nguoiPhuTrachId: agents[agentIndex] };
                agentIndex = (agentIndex + 1) % agents.length;
            }
        });
        setLeads(updatedLeads);
        setIsAssignModalOpen(false);
        setSelectedLeadIds(new Set());
        setSelectedAgentIds(new Set());
        alert(`Đã chia thành công ${leadsToAssign.length} leads cho ${agents.length} nhân viên!`);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterSource('ALL');
        setFilterStatus('ALL');
        setFilterIndustry('ALL');
        setFilterCity('ALL');
    };

    const handleSaveGroup = () => {
        if (!newGroupName) return;
        alert(`Đã tạo nhóm "${newGroupName}" với ${filteredLeads.length} khách hàng!`);
        setNewGroupName('');
        setIsGroupModalOpen(false);
    };

    const availableAgents = danhSachUserMau.filter(u => u.toChucId === toChucHienTai.id && (u.vaiTro === VaiTro.SALE_AGENT || u.vaiTro === VaiTro.SALE_MANAGER) && u.trangThai === 'ACTIVE');

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Dữ Liệu Khách Hàng</h1>
                    <p className="text-sm text-slate-500">Quản lý {leads.length.toLocaleString()} khách hàng từ Hệ thống & Upload.</p>
                </div>
                <div className="flex gap-3">
                    <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg active:scale-95">
                        {isImporting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                        {isImporting ? 'Đang xử lý AI...' : 'Import Excel/CSV'}
                    </button>
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border shadow-sm active:scale-95 ${isFilterOpen ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white'}`}>
                        <Filter size={18} /> Lọc & Tạo Nhóm
                    </button>
                </div>
            </div>

            {isFilterOpen && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-blue-100 dark:border-slate-700 shadow-xl animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Filter size={18} className="text-blue-600" /> Bộ Lọc & Phân Nhóm</h3>
                        <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-blue-600 hover:underline font-bold">ĐẶT LẠI</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nguồn dữ liệu</label>
                            <select value={filterSource} onChange={(e) => setFilterSource(e.target.value as any)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold">
                                <option value="ALL">Tất cả nguồn</option>
                                <option value="SYSTEM">Dữ liệu hệ thống</option>
                                <option value="UPLOAD">File Upload</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Khu Vực (City)</label>
                            <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold">
                                <option value="ALL">Tất cả khu vực</option>
                                {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trạng Thái</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold">
                                <option value="ALL">Tất cả trạng thái</option>
                                {Object.values(TrangThaiKhachHang).map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngành Nghề (AI)</label>
                            <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold">
                                <option value="ALL">Tất cả ngành nghề</option>
                                {uniqueIndustries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-sm text-slate-600 dark:text-slate-400">Tìm thấy <strong className="text-blue-600">{filteredLeads.length}</strong> khách hàng phù hợp.</div>
                        <button onClick={() => setIsGroupModalOpen(true)} className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all">
                            <Users size={16} /> Lưu thành Nhóm
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm relative">
                {selectedLeadIds.size > 0 && (
                    <div className="absolute top-0 left-0 right-0 z-20 bg-blue-50 dark:bg-blue-900/50 p-3 px-6 flex items-center justify-between border-b border-blue-200 dark:border-blue-800 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-blue-800 dark:text-blue-200">Đã chọn {selectedLeadIds.size} khách hàng</span>
                            <button onClick={() => setSelectedLeadIds(new Set())} className="text-xs text-blue-600 hover:underline font-black uppercase">Bỏ chọn</button>
                        </div>
                        <button onClick={() => setIsAssignModalOpen(true)} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                            <Share2 size={16} /> Phân Chia Leads
                        </button>
                    </div>
                )}

                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Tìm kiếm công ty, SĐT, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-semibold text-sm" />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-xs font-black text-slate-400 uppercase">Hiển thị:</label>
                        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold p-1 outline-none">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 w-[50px]">
                                    <button onClick={handleSelectAll} className="flex items-center justify-center text-slate-400 hover:text-blue-600">
                                        {selectedLeadIds.size > 0 && selectedLeadIds.size === paginatedLeads.length ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} />}
                                    </button>
                                </th>
                                <th className="px-6 py-4">Tên Công Ty</th>
                                <th className="px-6 py-4">Liên Hệ</th>
                                <th className="px-6 py-4">Phụ Trách</th>
                                <th className="px-6 py-4">Ngành Nghề (AI)</th>
                                <th className="px-6 py-4">Trạng Thái</th>
                                <th className="px-6 py-4 text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {paginatedLeads.length > 0 ? paginatedLeads.map((lead) => (
                                <tr key={lead.id} className={`transition-colors ${selectedLeadIds.has(lead.id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-700/50'}`}>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleSelectOne(lead.id)} className="flex items-center justify-center text-slate-400 hover:text-blue-600">
                                            {selectedLeadIds.has(lead.id) ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-black text-slate-800 dark:text-slate-200 text-sm leading-tight">{lead.tenCongTy}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border uppercase ${lead.nguonGoc === 'SYSTEM' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>{lead.nguonGoc}</span>
                                            <span className="text-[10px] text-slate-500 font-bold inline-flex items-center gap-1"><MapPin size={10} />{lead.diaChi}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-700 dark:text-slate-300 font-bold">{lead.nguoiLienHe}</p>
                                        <div className="flex flex-col text-[10px] text-slate-400 mt-1 font-bold">
                                            <span className="font-mono">{lead.soDienThoai}</span>
                                            <span className="truncate max-w-[150px]">{lead.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.nguoiPhuTrachId ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-700 border border-blue-200">{getAssigneeName(lead.nguoiPhuTrachId)?.charAt(0)}</div>
                                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 truncate max-w-[100px] uppercase">{getAssigneeName(lead.nguoiPhuTrachId)}</span>
                                            </div>
                                        ) : <span className="text-[10px] text-slate-400 font-black italic uppercase">-- Trống --</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-slate-200 dark:border-slate-600">{lead.nganhNghe || 'KHÁC'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${lead.trangThai === 'MOI' ? 'bg-blue-50 text-blue-700 border-blue-200' : lead.trangThai === 'DA_CHOT' ? 'bg-green-50 text-green-700 border-green-200' : lead.trangThai === 'TU_CHOI' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{lead.trangThai}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600 p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><MoreHorizontal size={20} /></button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={7} className="text-center py-20 text-slate-500 font-bold uppercase text-xs tracking-widest">Không tìm thấy dữ liệu phù hợp.</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/80">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Đang xem <span className="text-slate-800 dark:text-white">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> của <span className="text-slate-800 dark:text-white">{filteredLeads.length}</span> khách hàng
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Chỉ hiển thị vài trang xung quanh trang hiện tại để gọn
                                if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                                    if (Math.abs(pageNum - currentPage) === 3) return <span key={pageNum} className="text-slate-400">...</span>;
                                    return null;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:bg-white border border-transparent hover:border-slate-200'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
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