import CreateCourseStepper from "@/components/createCourse/create.course.stepper";
import DataTable, { type Column } from "@/components/PaginatedTable";
import { Input } from "@/components/ui/input";
import { useGetAllCourses } from "@/hooks/admin/course/courses.get";
import { useGetCategory } from "@/hooks/shared/category.get";
import { useState } from "react";
import AdminCourseViewPage from "./admin.course.view";
import { Link } from "react-router-dom";
type CourseType = {
  id: string;
  title: string;
  status: string;
  verificationStatus: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
  createdBy: string;
  chapterCount: number;
  thumbnailUrl: string;
  isBlocked: boolean;
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const AdminCourse = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllCourses({
    page,
    limit: 10,
  });

  const categoryData = useGetCategory();

  const columns: Column<CourseType>[] = [
    {
      header: "Thumbnail",
      accessor: "thumbnailUrl",
      cell: (value) => (
        <img src={value as string} alt="thumbnail" className="w-16 h-9 object-cover rounded" />
      ),
    },
    {
      header: "Title",
      accessor: "title",
    },
    // Inside columns array
    {
      header: "Category",
      accessor: "category.name", // This can stay for reference
      cell: (_, row: CourseType) => (
        <span className="text-sm font-medium">{row.category?.name || "Uncategorized"}</span>
      ),
    },
    {
      header: "Verification",
      accessor: "verificationStatus",
      cell: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            statusStyles[value] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Total Chapters",
      accessor: "chapterCount",
    },
    {
      header: "State",
      accessor: "isBlocked",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            value ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {value ? "Blocked" : "Active"}
        </span>
      ),
    },
  ];

  const renderActions = (course: CourseType) => {
    return (
      <div>
        <Link to={`/admin/courses/${course.id}`} className="text-blue-600 hover:underline mr-2">
          View
        </Link>
      </div>
    );
  };

  const courseData: CourseType[] = data?.courseData || [];
  const totalCount: number = data?.TotalCourseCount || 0;
  return (
    <div className="mt-8">
      <div>
        <Input placeholder="Search Courses..." className="max-w-sm mb-4" />
      </div>

      <DataTable
        columns={columns}
        data={courseData}
        renderActions={renderActions}
        isLoading={isLoading}
        page={page}
        pageSize={10}
        total={totalCount}
        rowKey={(value) => value.id}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminCourse;
