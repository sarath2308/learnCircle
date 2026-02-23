import React from "react";
import { Users, Layers, ArrowUpRight, TrendingUp, CreditCard, UserCheck } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Demo Data for Platform Growth
const growthData = [
  { month: "Jan", users: 400, courses: 240, income: 2400 },
  { month: "Feb", users: 700, courses: 280, income: 3600 },
  { month: "Mar", users: 900, courses: 350, income: 4800 },
  { month: "Apr", users: 1200, courses: 400, income: 5900 },
  { month: "May", users: 1500, courses: 480, income: 7200 },
];

const userTypeData = [
  { name: "Students", value: 850, color: "#2563eb" },
  { name: "Instructors", value: 150, color: "#10b981" },
];

const topInstructors = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    totalStudents: 4500,
    platformCut: "$12,400",
    status: "Elite",
  },
  { id: 2, name: "Mark Thompson", totalStudents: 3200, platformCut: "$8,900", status: "Pro" },
  { id: 3, name: "Elena Rodriguez", totalStudents: 2800, platformCut: "$7,200", status: "Pro" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Admin Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Intelligence
          </h1>
          <p className="text-slate-500 font-medium">
            System-wide overview and infrastructure health.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </div>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatCard
          title="Total Platform Users"
          value="12,540"
          subValue="+1.2k this month"
          icon={<Users />}
          color="blue"
        />
        <AdminStatCard
          title="Active Courses"
          value="1,204"
          subValue="42 pending approval"
          icon={<Layers />}
          color="purple"
        />
        <AdminStatCard
          title="Platform Commission"
          value="$48,200"
          subValue="Avg. 15% per sale"
          icon={<CreditCard />}
          color="green"
        />
        <AdminStatCard
          title="Total Sessions"
          value="8,400"
          subValue="Across all instructors"
          icon={<TrendingUp />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">User & Content Scaling</h3>
            <select className="bg-slate-50 border-none text-xs font-bold rounded-md px-2 py-1 outline-none text-slate-500">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">User Segmentation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {userTypeData.map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.name}
                </div>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Instructors (Professional Users) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">
              Top Professional Users (Income Generators)
            </h3>
            <button className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:gap-2 transition-all">
              Manage All Professionals <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Instructor Name</th>
                  <th className="px-6 py-4 font-semibold">Total Students</th>
                  <th className="px-6 py-4 font-semibold">Platform Revenue (Cut)</th>
                  <th className="px-6 py-4 font-semibold">Account Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topInstructors.map((prof) => (
                  <tr key={prof.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {prof.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-semibold text-slate-700">{prof.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {prof.totalStudents.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-bold">{prof.platformCut}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                        {prof.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-blue-600 transition">
                        <UserCheck size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin specific Stat Card
const AdminStatCard = ({ title, value, subValue, icon, color }: any) => {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-semibold">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
      <p className="text-xs text-slate-400 mt-2 font-medium">{subValue}</p>
    </div>
  );
};

export default AdminDashboard;
