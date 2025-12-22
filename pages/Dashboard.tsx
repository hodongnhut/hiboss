import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, PhoneCall, Mail, Clock, ArrowRight, CheckCircle2, PhoneIncoming, MousePointer2 } from 'lucide-react';

const data = [
  { name: 'T2', calls: 400, emails: 240, amt: 2400 },
  { name: 'T3', calls: 300, emails: 139, amt: 2210 },
  { name: 'T4', calls: 200, emails: 980, amt: 2290 },
  { name: 'T5', calls: 278, emails: 390, amt: 2000 },
  { name: 'T6', calls: 189, emails: 480, amt: 2181 },
  { name: 'T7', calls: 239, emails: 380, amt: 2500 },
  { name: 'CN', calls: 349, emails: 430, amt: 2100 },
];

const activities = [
  { id: 1, type: 'CALL', user: 'Lê Sale 1', target: 'Công ty TNHH Giải Pháp Số 1', result: 'Đã nghe máy', time: '5 phút trước' },
  { id: 2, type: 'EMAIL', user: 'Hệ Thống', target: 'Tập đoàn Xây Dựng Bình An', result: 'Đã mở email (2 lần)', time: '12 phút trước' },
  { id: 3, type: 'LEAD', user: 'Import', target: 'Spa Lavender', result: 'Lead mới từ Excel', time: '25 phút trước' },
  { id: 4, type: 'ZALO', user: 'Hệ Thống', target: 'Nhà Hàng Biển Đông', result: 'Đã nhận tin ZNS', time: '1 giờ trước' },
];

const StatCard = ({ title, value, sub, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white shadow-lg`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm text-green-600">
      <TrendingUp size={16} className="mr-1" />
      <span>{sub} so với tuần trước</span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Leads"
          value="1,540,230"
          sub="+12%"
          icon={<Users size={20} />}
          color="bg-blue-600"
        />
        <StatCard
          title="Cuộc Gọi Kết Nối"
          value="85,302"
          sub="+5%"
          icon={<PhoneCall size={20} />}
          color="bg-green-600"
        />
        <StatCard
          title="Email Đã Gửi"
          value="450,120"
          sub="+22%"
          icon={<Mail size={20} />}
          color="bg-purple-600"
        />
        <StatCard
          title="Doanh Thu"
          value="1.2 Tỷ"
          sub="+8%"
          icon={<TrendingUp size={20} />}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-[400px]">
          <h3 className="font-semibold text-lg mb-6 text-slate-800 dark:text-white">Hiệu Suất Cuộc Gọi (Tuần Này)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-[400px]">
          <h3 className="font-semibold text-lg mb-6 text-slate-800 dark:text-white">Tỷ Lệ Mở Email & SMS</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Line type="monotone" dataKey="emails" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="calls" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            Hoạt động gần đây
          </h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Xem báo cáo chi tiết <ArrowRight size={16} />
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {activities.map((act) => (
            <div key={act.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${act.type === 'CALL' ? 'bg-green-100 text-green-600' :
                  act.type === 'EMAIL' ? 'bg-purple-100 text-purple-600' :
                    act.type === 'ZALO' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                  {act.type === 'CALL' && <PhoneIncoming size={18} />}
                  {act.type === 'EMAIL' && <MousePointer2 size={18} />}
                  {act.type === 'ZALO' && <span className="font-bold text-xs">Z</span>}
                  {act.type === 'LEAD' && <Users size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {act.user} <span className="font-normal text-slate-500 italic mx-1">đã xử lý</span> {act.target}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle2 size={12} /> {act.result}
                    </span>
                    • {act.time}
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors">
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;