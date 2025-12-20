import React, { useState } from 'react';
import { Plus, Search, Shield, User, Edit3, Trash2, Lock, Unlock, X, Save, CheckCircle, Briefcase, BadgeCheck, Eye, EyeOff, Key } from 'lucide-react';
import { danhSachUserMau, toChucHienTai } from '../services/mockData';
import { VaiTro, NguoiDung } from '../types';

const Users = () => {
  // State quản lý danh sách users (Chỉ lấy user thuộc tổ chức hiện tại)
  const [users, setUsers] = useState<NguoiDung[]>(danhSachUserMau.filter(u => u.toChucId === toChucHienTai.id));
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<NguoiDung | null>(null); 
  
  // State Form Data
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    vaiTro: VaiTro.SALE_AGENT,
    matKhau: '' // Thêm trường mật khẩu
  });

  const [showPassword, setShowPassword] = useState(false); // Toggle ẩn hiện pass

  // --- ACTIONS ---

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ hoTen: '', email: '', soDienThoai: '', vaiTro: VaiTro.SALE_AGENT, matKhau: '' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: NguoiDung) => {
    setEditingUser(user);
    // Khi edit, mật khẩu để trống mặc định (nghĩa là không đổi)
    setFormData({ hoTen: user.hoTen, email: user.email, soDienThoai: user.soDienThoai || '', vaiTro: user.vaiTro, matKhau: '' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}" khỏi công ty không?`)) {
        setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
      setUsers(users.map(u => {
          if (u.id === id) {
              const newStatus = u.trangThai === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
              return { ...u, trangThai: newStatus };
          }
          return u;
      }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hoTen || !formData.email) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Validate Password khi tạo mới
    if (!editingUser && !formData.matKhau) {
        alert("Vui lòng nhập mật khẩu cho nhân viên mới!");
        return;
    }

    if (editingUser) {
        // UPDATE
        setUsers(users.map(u => 
            u.id === editingUser.id 
            ? { ...u, hoTen: formData.hoTen, email: formData.email, soDienThoai: formData.soDienThoai, vaiTro: formData.vaiTro } 
            : u
        ));
        
        if (formData.matKhau) {
            alert(`Đã cập nhật thông tin và đổi mật khẩu cho user ${formData.hoTen} thành công!`);
        } else {
            alert(`Đã cập nhật thông tin cho user ${formData.hoTen} thành công!`);
        }
    } else {
        // CREATE (Tự động gán vào Organization hiện tại)
        const newUser: NguoiDung = {
            id: `US${Date.now().toString().slice(-4)}`,
            toChucId: toChucHienTai.id,
            hoTen: formData.hoTen,
            email: formData.email,
            soDienThoai: formData.soDienThoai,
            vaiTro: formData.vaiTro,
            trangThai: 'ACTIVE',
            ngayTao: new Date().toISOString().split('T')[0]
        };
        setUsers([newUser, ...users]);
        alert(`Đã thêm nhân viên mới và gửi thông tin đăng nhập qua email!`);
    }
    setIsModalOpen(false);
  };

  // Filter Search
  const filteredUsers = users.filter(u => 
    u.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quản Lý Nhân Sự</h1>
            <p className="text-sm text-slate-500 mt-1">
                Danh sách nhân viên thuộc: <strong className="text-blue-600">{toChucHienTai.tenToChuc}</strong>
            </p>
        </div>
        <button 
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Thêm Nhân Viên
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
           <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-medium">
                <tr>
                <th className="px-6 py-4">Nhân Viên</th>
                <th className="px-6 py-4">Vai Trò (Role)</th>
                <th className="px-6 py-4">Liên Hệ</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                <tr key={user.id} className={`transition-colors ${user.trangThai === 'INACTIVE' ? 'bg-slate-50 dark:bg-slate-800/50 opacity-75' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                            user.vaiTro === VaiTro.ORG_ADMIN ? 'bg-purple-600' : 
                            user.vaiTro === VaiTro.SALE_MANAGER ? 'bg-indigo-500' : 'bg-blue-500'
                        }`}>
                            {user.hoTen.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.hoTen}</p>
                            <p className="text-xs text-slate-500">ID: {user.id}</p>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4">
                        {user.vaiTro === VaiTro.ORG_ADMIN && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                <Shield size={12}/> Chủ Doanh Nghiệp
                            </span>
                        )}
                        {user.vaiTro === VaiTro.SALE_MANAGER && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                                <BadgeCheck size={12}/> Quản Lý Sales
                            </span>
                        )}
                        {user.vaiTro === VaiTro.SALE_AGENT && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                <Briefcase size={12}/> Nhân Viên Sales
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                            <p className="text-slate-700 dark:text-slate-300 font-medium">{user.email}</p>
                            <p className="text-slate-500">{user.soDienThoai || 'Chưa cập nhật'}</p>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => handleToggleStatus(user.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                user.trangThai === 'ACTIVE' 
                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Click để đổi trạng thái"
                        >
                            {user.trangThai === 'ACTIVE' ? <CheckCircle size={12} /> : <Lock size={12} />}
                            {user.trangThai}
                        </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleOpenEdit(user)}
                                className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" 
                                title="Chỉnh sửa & Đổi mật khẩu"
                            >
                                <Edit3 size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(user.id, user.hoTen)}
                                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Xóa nhân viên"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
                <div className="p-10 text-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <p>Không tìm thấy nhân viên nào.</p>
                </div>
            )}
        </div>
      </div>

      {/* MODAL THÊM / SỬA USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        {editingUser ? <Edit3 size={20} className="text-blue-600"/> : <Plus size={20} className="text-blue-600"/>}
                        {editingUser ? 'Cập Nhật Nhân Sự' : 'Thêm Nhân Sự Mới'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100">
                        <X size={20}/>
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Họ và tên</label>
                        <input 
                            type="text" 
                            required
                            value={formData.hoTen}
                            onChange={(e) => setFormData({...formData, hoTen: e.target.value})}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="VD: Nguyễn Văn A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email đăng nhập</label>
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="VD: a.nguyen@company.com"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
                        <input 
                            type="tel" 
                            value={formData.soDienThoai}
                            onChange={(e) => setFormData({...formData, soDienThoai: e.target.value})}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="VD: 0909xxxxxx"
                        />
                    </div>

                    {/* PASSWORD FIELD */}
                    <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                             {editingUser ? 'Đổi mật khẩu (Tùy chọn)' : 'Mật khẩu đăng nhập'}
                         </label>
                         <div className="relative">
                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                             <input 
                                 type={showPassword ? "text" : "password"} 
                                 value={formData.matKhau}
                                 onChange={(e) => setFormData({...formData, matKhau: e.target.value})}
                                 className="w-full pl-10 pr-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                 placeholder={editingUser ? "Để trống nếu không muốn đổi" : "••••••••"}
                                 required={!editingUser}
                             />
                             <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                             >
                                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                             </button>
                         </div>
                         {editingUser && (
                             <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                 <Key size={10}/> Nếu để trống, mật khẩu cũ sẽ được giữ nguyên.
                             </p>
                         )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vai trò trong doanh nghiệp</label>
                        <div className="grid grid-cols-1 gap-2">
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, vaiTro: VaiTro.ORG_ADMIN})}
                                className={`p-3 rounded-lg border flex items-center gap-3 transition-all text-left ${
                                    formData.vaiTro === VaiTro.ORG_ADMIN 
                                    ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500' 
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                <div className="p-2 bg-white rounded-full border shadow-sm"><Shield size={16}/></div>
                                <div>
                                    <span className="text-xs font-bold block">Chủ Doanh Nghiệp (Admin)</span>
                                    <span className="text-[10px] opacity-75">Toàn quyền quản lý hệ thống & billing.</span>
                                </div>
                            </button>

                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, vaiTro: VaiTro.SALE_MANAGER})}
                                className={`p-3 rounded-lg border flex items-center gap-3 transition-all text-left ${
                                    formData.vaiTro === VaiTro.SALE_MANAGER 
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                <div className="p-2 bg-white rounded-full border shadow-sm"><BadgeCheck size={16}/></div>
                                <div>
                                    <span className="text-xs font-bold block">Quản Lý Sales (Manager)</span>
                                    <span className="text-[10px] opacity-75">Xem báo cáo, chia leads, quản lý team.</span>
                                </div>
                            </button>

                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, vaiTro: VaiTro.SALE_AGENT})}
                                className={`p-3 rounded-lg border flex items-center gap-3 transition-all text-left ${
                                    formData.vaiTro === VaiTro.SALE_AGENT 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                <div className="p-2 bg-white rounded-full border shadow-sm"><Briefcase size={16}/></div>
                                <div>
                                    <span className="text-xs font-bold block">Nhân Viên Sales (Agent)</span>
                                    <span className="text-[10px] opacity-75">Gọi điện, chăm sóc khách hàng được giao.</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {editingUser ? 'Cập Nhật' : 'Lưu Lại'}
                        </button>
                    </div>
                </form>
             </div>
        </div>
      )}
    </div>
  );
};

export default Users;