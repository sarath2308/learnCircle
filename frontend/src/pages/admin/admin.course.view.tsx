// app/admin/courses/[id]/page.tsx
import { 
  ChevronLeft,  
  PlayCircle, 
  FileText, 
  HelpCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGetCourse } from "@/hooks/admin/course/course.get"
import { useNavigate, useParams } from "react-router-dom"
import type { AdminCourseDetailsResponse } from "@/hooks/admin/course/course.get"
import ChapterItem from "@/components/shared/chapterItem"
import { Accordion } from "@/components/ui/accordion"
import { useBlockCourse } from "@/hooks/admin/course/course.block"
import { useApproveCourse } from "@/hooks/admin/course/course.approve"
import { useUnblockCourse } from "@/hooks/admin/course/course.unblock"
import { useRejectCourse } from "@/hooks/admin/course/course.reject"
import { useState } from "react"
import { Modal } from "@/components/Modal"
import { set } from "zod"
import { AdminActionModal } from "@/components/admin/admin.action.modal"

type AdminAction = "block" | "reject" | "approve" | "unblock" | null

export default function AdminCourseViewPage() {
      const { id } = useParams<{ id: string }>();
      const navigate = useNavigate();
      const blockCourse = useBlockCourse();
      const approveCourse = useApproveCourse();
      const unblockCourse = useUnblockCourse();
      const rejectCourse = useRejectCourse();
        const [action, setAction] = useState<AdminAction>(null)
        const [reason, setReason] = useState("")


if (!id) {
  throw new Error("Course ID missing from route");
}

    const { data, isLoading, isError, refetch } = useGetCourse(id);
    if (isLoading) {
  return <div className="p-6">Loading course…</div>;
}

if (isError || !data?.courseData) {
  return <div className="p-6 text-red-500">Failed to load course</div>;
}


    const courseData:AdminCourseDetailsResponse = data?.courseData;
  // You can later replace this with real data from props or API

  const handleConfirmAction = async () => {
    switch (action) {
      case "approve":
        await approveCourse.mutateAsync(id)
        break
      case "block":
        await blockCourse.mutateAsync({ courseId: id, reason })
        break
      case "reject":
        await rejectCourse.mutateAsync({ courseId: id, reason })
        break
      case "unblock":
        await unblockCourse.mutateAsync(id)
        break
    }

    setAction(null)
    setReason("")
    refetch()
  }



  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <PlayCircle className="h-4 w-4 text-blue-600" />
      case "article": return <FileText className="h-4 w-4 text-amber-600" />
      case "quiz": return <HelpCircle className="h-4 w-4 text-purple-600" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
       <AdminActionModal
        open={!!action}
        action={action}
        reason={reason}
        loading = {isLoading}
        setReason={setReason}
        onClose={() => {
          setAction(null)
          setReason("")
        }}
        onConfirm={handleConfirmAction}
      />
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Back button + Title */}
        <div className="mb-6">
          <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="gap-1 pl-0 text-muted-foreground hover:text-foreground mb-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Courses
          </Button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{courseData.title??""}</h1>
              <p className="text-muted-foreground mt-1">{courseData.description??""}</p>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-amber-800">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="font-medium">Status:</span>{" "}
              <Badge variant="outline" className="ml-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                {courseData?.status}
              </Badge>
            </div>
            <div>
  Created on:{" "}
  {courseData?.createdAt
    ? new Date(courseData.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : ""}
</div>

            <div>Instructor: {courseData?.createdBy?.name ?? ""}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {!courseData?.chapters || courseData?.chapters.length === 0 &&
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        No chapters available for this course.
                    </CardContent>
                </Card>
}
                
            {courseData?.chapters.map((chapter, idx) => (
               <Accordion type="single" collapsible>
            <ChapterItem key={chapter.id} chapter={chapter} variant="admin" />
            </Accordion>
            ))}
          </div>

          {/* Sidebar - Course Info & Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Course Information</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd>{courseData?.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Level</dt>
                    <dd><span className="bg-green-100 text-green-700 p-1">{courseData?.skillLevel}</span></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Price</dt>
                    <dd className="font-medium">{courseData?.price}</dd>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Total Chapters</dt>
                    <dd>{courseData?.chapterCount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Total Lessons</dt>
                    <dd>{courseData?.lessonCount}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Admin Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={()=> setAction("approve")}>
                    Approve
                  </Button>
                  <Button  className="bg-red-500" variant="destructive" onClick={()=> setAction("reject")}>Reject</Button>
                  {courseData?.isBlocked ? (
                    <Button variant="outline" className="col-span-2 bg-blue-600 text-white hover:bg-green-400" onClick={()=> setAction("unblock")}>Unblock</Button>
                   
                  ) : (
                     <Button variant="outline" onClick={()=>setAction("block")} className="border-red-600 text-red-600 hover:bg-red-50 col-span-2">
                      Block
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}