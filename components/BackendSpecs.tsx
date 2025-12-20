import React from 'react';
import { Database, Server, Cpu, Box, Share2, Layers, ShieldCheck } from 'lucide-react';

const prismaSchema = `// schema.prisma

// --- MULTI-TENANCY CORE ---

model Organization {
  id            String   @id @default(uuid())
  name          String
  taxCode       String?
  subscription  String   @default("STARTER") // STARTER, PRO, ENTERPRISE
  status        String   @default("ACTIVE")
  createdAt     DateTime @default(now())

  // Relations (Tất cả dữ liệu đều thuộc về Organization)
  users         User[]
  customers     Customer[]
  campaigns     Campaign[]
  wallet        Wallet?
}

model User {
  id             String       @id @default(uuid())
  organizationId String
  email          String       @unique
  passwordHash   String
  fullName       String
  role           String       // ORG_ADMIN, SALE_MANAGER, SALE_AGENT
  status         String       @default("ACTIVE")
  
  // Relation to Tenant
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  // User activity
  notifications  Notification[]
  interactions   Interaction[]
}

// --- CUSTOMER DATA (Scoped by Organization) ---
model Customer {
  id             String       @id @default(uuid())
  organizationId String
  companyName    String
  contactName    String
  email          String
  phone          String
  // ... other fields
  
  organization   Organization @relation(fields: [organizationId], references: [id])
  interactions   Interaction[]
}

// --- MARKETING ENGINE (Scoped by Organization) ---
model Campaign {
  id             String       @id @default(uuid())
  organizationId String
  name           String
  // ... other fields

  organization   Organization @relation(fields: [organizationId], references: [id])
}

// --- BILLING (Per Organization) ---
model Wallet {
  id             String       @id @default(uuid())
  organizationId String       @unique
  balance        Decimal      @default(0)
  
  organization   Organization @relation(fields: [organizationId], references: [id])
  transactions   Transaction[]
}
`;

const BackendSpecs = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-3">
            <Server className="text-blue-600" />
            Kiến Trúc Multi-tenancy (B2B SaaS)
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          Hệ thống được thiết kế để phục vụ nhiều doanh nghiệp (Tenant) trên cùng một hạ tầng. 
          Mỗi doanh nghiệp có dữ liệu khách hàng, nhân viên và tài chính hoàn toàn độc lập.
        </p>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                <ShieldCheck size={18} /> Nguyên Tắc Isolation
            </h3>
            <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                <li>Mọi request API đều bắt buộc phải có <code>organizationId</code> (lấy từ JWT Token).</li>
                <li>Database sử dụng cột <code>organizationId</code> để phân tách dữ liệu logic (Row-level Security).</li>
                <li>Admin của Doanh nghiệp A không thể xem data của Doanh nghiệp B.</li>
            </ul>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Prisma */}
            <div className="space-y-2">
                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Database size={18} className="text-purple-500" />
                    1. Data Model (Prisma Schema)
                </h3>
                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed h-[500px] overflow-y-auto border border-slate-700 custom-scrollbar shadow-inner">
                    <pre>{prismaSchema}</pre>
                </div>
            </div>

            {/* Tech Stack Info */}
            <div className="space-y-6">
                 <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2">Authentication Flow</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        1. User login (Email/Pass).<br/>
                        2. Server xác định User thuộc <strong>Organization</strong> nào.<br/>
                        3. Trả về JWT Token chứa claims: <code>{`{ userId: "...", role: "ORG_ADMIN", orgId: "..." }`}</code>.<br/>
                        4. Frontend lưu Token và dùng cho mọi request sau đó.
                    </p>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2">Role-Based Access Control (RBAC)</h3>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                        <li><strong>ORG_ADMIN:</strong> Full quyền trong Doanh nghiệp (Thêm user, Nạp tiền, Cấu hình).</li>
                        <li><strong>SALE_MANAGER:</strong> Xem báo cáo toàn team, Quản lý chiến dịch.</li>
                        <li><strong>SALE_AGENT:</strong> Chỉ xem Leads được phân công, Gọi điện, Gửi email.</li>
                    </ul>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BackendSpecs;