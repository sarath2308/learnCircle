import DataTable, { type Column } from "@/components/PaginatedTable";
import { Input } from "@/components/ui/input";
import { useGetAllCourses } from "@/hooks/admin/course/courses.get";
import { useState } from "react";
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

  const columns: Column<CourseType>[] = [
    {
      header: "Thumbnail",
      accessor: "thumbnailUrl",
      cell: (row) => (
        <img src={row.thumbnailUrl} alt="thumbnail" className="w-16 h-9 object-cover rounded" />
      ),
    },
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Category",
      accessor: "category",
      cell: (row) => (
        <span className="text-sm font-medium">{row.category?.name || "Uncategorized"}</span>
      ),
    },
    {
      header: "Verification",
      accessor: "verificationStatus",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            statusStyles[row.verificationStatus] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {row.verificationStatus}
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
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            row.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {row.isBlocked ? "Blocked" : "Active"}
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
