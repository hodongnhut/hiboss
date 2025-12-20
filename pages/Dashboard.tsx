import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, PhoneCall, Mail } from 'lucide-react';

const data = [
  { name: 'T2', calls: 400, emails: 240, amt: 2400 },
  { name: 'T3', calls: 300, emails: 139, amt: 2210 },
  { name: 'T4', calls: 200, emails: 980, amt: 2290 },
  { name: 'T5', calls: 278, emails: 390, amt: 2000 },
  { name: 'T6', calls: 189, emails: 480, amt: 2181 },
  { name: 'T7', calls: 239, emails: 380, amt: 2500 },
  { name: 'CN', calls: 349, emails: 430, amt: 2100 },
];

const StatCard = ({ title, value, sub, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-[400px]">
          <h3 className="font-semibold text-lg mb-6 text-slate-800 dark:text-white">Tỷ Lệ Mở Email & SMS</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Line type="monotone" dataKey="emails" stroke="#8b5cf6" strokeWidth={3} />
              <Line type="monotone" dataKey="calls" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
