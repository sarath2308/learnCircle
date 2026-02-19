
import { 
  Users, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  MoreHorizontal 
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from "recharts";

// Demo Data
const revenueData = [
  { name: "Jan", revenue: 4000 }, { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 }, { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 }, { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 }, { name: "Aug", revenue: 8500 },
];

const sessionData = [
  { name: "Jan", sessions: 20 }, { name: "Feb", sessions: 25 },
  { name: "Mar", sessions: 45 }, { name: "Apr", sessions: 30 },
  { name: "May", sessions: 50 }, { name: "Jun", sessions: 40 },
];

const topCourses = [
  { id: 1, name: "Advanced React Patterns", students: 4, rating: 4.9, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop" },
  { id: 2, name: "UI/UX Fundamentals", students: 8, rating: 4.8, image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=100&h=60&fit=crop" },
  { id: 3, name: "Node.js Backend Mastery", students: 7, rating: 4.7, image: "https://images.unsplash.com/photo-1502942735232-2307584994e9?w=100&h=60&fit=crop" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-900">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, here is what's happening today.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          Generate Report
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Sessions" value="120" icon={<Calendar size={20}/>} trend="+12%" />
        <StatCard title="Total Courses" value="30" icon={<BookOpen size={20}/>} trend="0%" />
        <StatCard title="Total Learners" value="500" icon={<Users size={20}/>} trend="+5%" />
        <StatCard title="Sessions Conducted" value="100" icon={<TrendingUp size={20}/>} trend="+18%" />
        <StatCard title="Total Earnings" value="$15,000" icon={<DollarSign size={20}/>} trend="+10%" isEarning />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Sessions per Month</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 12}} />
                <Tooltip cursor={{fill: "#f8fafc"}} />
                <Bar dataKey="sessions" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Courses Section (Replacing Recent Activity) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Top Performing Courses</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {topCourses.map((course) => (
            <div key={course.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <img src={course.image} alt={course.name} className="w-16 h-10 object-cover rounded-md bg-gray-200" />
                <div>
                  <h4 className="font-medium text-slate-800">{course.name}</h4>
                  <p className="text-xs text-slate-500">{course.students.toLocaleString()} Students enrolled</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm font-semibold">⭐ {course.rating}</p>
                  <p className="text-xs text-slate-400">Rating</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Stat Cards
const StatCard = ({ title, value, icon, trend, isEarning = false }: any) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${isEarning ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith("+") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  </div>
);

export default Dashboard;