"use client";

import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import { useGetCreatorCourses } from "@/hooks/shared/course-creator/creator.courses.get";
import CourseCard from "./CourseCard";

/* -----------------------------
   Tab configuration (NO MAGIC)
--------------------------------*/
const TABS = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
] as const;

type TabValue = typeof TABS[number]["value"];

/* -----------------------------
   Types (STOP USING `any`)
--------------------------------*/
interface Course {
  id: string;
  title: string;
  thumbnail?: string | null;
  status?: "draft" | "published" | "pending";
}

/* -----------------------------
   Reusable Grid Component
--------------------------------*/
function CourseGrid({ courses }: { courses?: Course[] }) {
  if (!courses || courses.length === 0) {
    return (
      <p className="text-sm text-slate-500 mt-6">
        No courses found
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          variant="admin"
        />
      ))}
    </div>
  );
}

/* -----------------------------
   Main Component
--------------------------------*/
export default function MyCourse() {
  const [tab, setTab] = useState<TabValue>("all");

  const { data, isLoading } = useGetCreatorCourses(
    tab === "all" ? undefined : tab
  );

  if (isLoading) {
    return (
      <div className="mt-10 text-sm text-slate-500">
        Loading courses…
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* Header */}
      <div className="mt-6 mb-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          My Courses
        </h1>
      </div>

      {/* Tabs */}
      <Box>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
        >
          {TABS.map((t) => (
            <Tab
              key={t.value}
              label={t.label}
              value={t.value}
            />
          ))}
        </Tabs>

        {/* Content */}
        <Box p={2}>
          <CourseGrid courses={data?.courseData} />
        </Box>
      </Box>
    </div>
  );
}
