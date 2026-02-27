import React, { useMemo } from "react";
import { useGetTotalCourseOfInstructor } from "@/hooks/profesional/professiona-course/professional.get.total.course";
import { useGetTotalEnrolledCount } from "@/hooks/profesional/professiona-course/professional.get.total.enrolled";
import { useGetTopCoursesOfInstructor } from "@/hooks/profesional/professiona-course/professional.top.courses";
import { useGetSessionDataForInstructorDashboard } from "@/hooks/profesional/session-booking/professiona.sessionData.dashboard";
import { Users, BookOpen, Calendar, DollarSign, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// 1. Define the interface based on your backend response
export type MonthlySessionData = {
  year: number;
  month: number; // 1-12
  totalRevenue: number;
  totalSessions: number;
};

export type CourseData = {
  id: string;
  title: string;
  averageRating: number;
  thumbnail: string;
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Dashboard = () => {
  const enrolledQuery = useGetTotalEnrolledCount();
  const courseCountQuery = useGetTotalCourseOfInstructor();
  const sessionQuery = useGetSessionDataForInstructorDashboard();
  const topCoursesQuery = useGetTopCoursesOfInstructor();

  // --- DATA TRANSFORMATION ---
  // We use useMemo to prevent re-calculating chart data on every render
  const formattedChartData = useMemo(() => {
    // Backend likely returns an array like: [{ year: 2026, month: 2, totalRevenue: 3000, totalSessions: 12 }]
    const rawData: MonthlySessionData[] = sessionQuery.data?.sessionMonthData ?? [];

    // Map through all 12 months to ensure the chart isn't empty/broken if data is missing
    return MONTH_NAMES.map((name, index) => {
      const monthNumber = index + 1;
      const monthData = rawData.find((d) => d.month === monthNumber);

      return {
        name,
        sessions: monthData?.totalSessions ?? 0,
        revenue: monthData?.totalRevenue ?? 0,
      };
    });
  }, [sessionQuery.data]);

  const isLoading =
    enrolledQuery.isLoading ||
    courseCountQuery.isLoading ||
    sessionQuery.isLoading ||
    topCoursesQuery.isLoading;

  if (isLoading) return <div className="p-8 font-medium">Loading Dashboard Data...</div>;

  const enrolledCount = enrolledQuery.data?.totalEnrolledCount ?? 0;
  const courseEarning = enrolledQuery.data?.courseTotalEarning ?? 0;
  const courseCount = courseCountQuery.data?.totalCourse ?? 0;
  const sessionDataRes = sessionQuery.data ?? { sessionEarning: 0, totalSession: 0 };
  const courseInfo: CourseData[] = topCoursesQuery.data?.courseData ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-900">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-500">Real-time performance metrics for 2026.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Sessions"
          value={sessionDataRes.totalSession}
          icon={<Calendar size={20} />}
          trend="+12%"
        />
        <StatCard
          title="Total Courses"
          value={courseCount}
          icon={<BookOpen size={20} />}
          trend="0%"
        />
        <StatCard
          title="Total Learners"
          value={enrolledCount}
          icon={<Users size={20} />}
          trend="+5%"
        />
        <StatCard
          title="Session Earnings"
          value={`₹${sessionDataRes.sessionEarning}`}
          icon={<TrendingUp size={20} />}
          trend="+18%"
        />
        <StatCard
          title="Course Earnings"
          value={`₹${courseEarning}`}
          icon={<DollarSign size={20} />}
          trend="+10%"
          isEarning
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Line Chart */}
        <ChartContainer title="Revenue Trends (₹)">
          <LineChart data={formattedChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2563eb" }}
            />
          </LineChart>
        </ChartContainer>

        {/* Sessions Bar Chart */}
        <ChartContainer title="Sessions per Month">
          <BarChart data={formattedChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Top Courses Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Top Performing Courses</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {courseInfo.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No course data available.</div>
          ) : (
            courseInfo.map((course) => (
              <div
                key={course.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt=""
                    className="w-16 h-10 object-cover rounded-md bg-gray-200"
                  />
                  <h4 className="font-medium text-slate-800">{course.title}</h4>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">⭐ {course.averageRating}</p>
                  <p className="text-xs text-slate-400">Rating</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Chart Wrapper
const ChartContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {children as any}
      </ResponsiveContainer>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, trend, isEarning = false }: any) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-2 rounded-lg ${isEarning ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}
      >
        {icon}
      </div>
      <span
        className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith("+") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
      >
        {trend}
      </span>
    </div>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
  </div>
);

export default Dashboard;
