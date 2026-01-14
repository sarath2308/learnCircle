import React, { useState } from "react";
import { 
  ChevronLeft, PlayCircle, FileText, HelpCircle, 
  CheckCircle, Clock, Layers, Edit3, Save, Eye, Trash2, PlusCircle 
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import { AdminActionModal } from "@/components/admin/admin.action.modal";

// Hooks & Logic
import { useGetCourse } from "@/hooks/shared/chapter/course.get";
import { useBlockCourse } from "@/hooks/admin/course/course.block";
import { useApproveCourse } from "@/hooks/admin/course/course.approve";
import { useUnblockCourse } from "@/hooks/admin/course/course.unblock";
import { useRejectCourse } from "@/hooks/admin/course/course.reject";
import ChapterItem from "@/components/shared/chapterItem";

type AdminAction = "block" | "reject" | "approve" | "unblock" | null;

interface CourseReviewProps {
  variant: 'admin' | 'creator';
}

export default function CourseReviewPage({ variant }: CourseReviewProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for Admin Actions
  const [action, setAction] = useState<AdminAction>(null);
  const [reason, setReason] = useState("");
  const [previewLesson, setPreviewLesson] = useState<any | null>(null);

  // State for Creator Editing
  const [isEditing, setIsEditing] = useState(false);

  // Mutations
  const blockCourse = useBlockCourse();
  const approveCourse = useApproveCourse();
  const unblockCourse = useUnblockCourse();
  const rejectCourse = useRejectCourse();

  if (!id) throw new Error("Course ID missing");

  const { data, isLoading, isError, refetch } = useGetCourse(id);

  if (isLoading) return <div className="p-10 text-center animate-pulse font-bold text-slate-400">Loading comprehensive course data...</div>;
  if (isError || !data?.courseData) return <div className="p-10 text-center text-red-500">Failed to load course details.</div>;

  const courseData = data.courseData;

  const handleConfirmAction = async () => {
    switch (action) {
      case "approve": await approveCourse.mutateAsync(id); break;
      case "block": await blockCourse.mutateAsync({ courseId: id, reason }); break;
      case "reject": await rejectCourse.mutateAsync({ courseId: id, reason }); break;
      case "unblock": await unblockCourse.mutateAsync(id); break;
    }
    setAction(null);
    setReason("");
    refetch();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-sans text-slate-900 pb-20">
      <AdminActionModal
        open={!!action}
        action={action}
        reason={reason}
        loading={isLoading}
        setReason={setReason}
        onClose={() => { setAction(null); setReason(""); }}
        onConfirm={handleConfirmAction}
      />

      {/* 1. Navigation & Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            size="sm" 
            className="gap-1 pl-0 text-muted-foreground hover:text-foreground mb-2"
          >
            <ChevronLeft className="h-4 w-4" /> Back to List
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Course Submission Review</h1>
          <p className="text-slate-500">Reviewing: <span className="text-blue-600 font-medium">#{id.slice(-6)}</span></p>
        </div>

        {variant === 'creator' && (
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
              isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
            }`}
          >
            {isEditing ? <><Save size={18}/> Save Changes</> : <><Edit3 size={18}/> Edit Details</>}
          </Button>
        )}
      </header>

      {/* 2. Full Width Thumbnail */}
      <div className="w-full h-80 rounded-3xl overflow-hidden shadow-lg mb-8 border border-gray-200 relative group">
        <img 
          src={courseData.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200"} 
          alt="Thumbnail" 
          className="w-full h-full object-cover" 
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm">Update Cover Image</Button>
          </div>
        )}
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle: Details & Curriculum */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {isEditing ? (
                  <input 
                    className="text-2xl font-bold w-full border-b-2 border-blue-500 outline-none mb-2"
                    defaultValue={courseData.title}
                  />
                ) : (
                  <h2 className="text-2xl font-bold mb-2 text-slate-800">{courseData.title}</h2>
                )}
                
                {isEditing ? (
                  <textarea 
                    className="w-full text-slate-600 border rounded-lg p-3 outline-none"
                    defaultValue={courseData.description}
                    rows={3}
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed">{courseData.description}</p>
                )}
              </div>
              <Badge className={`ml-4 capitalize ${courseData.verificationStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {courseData.verificationStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Category</p>
                <p className="font-semibold text-sm">{courseData.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Skill Level</p>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-50">{courseData.skillLevel}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Price</p>
                <p className="font-bold text-sm text-green-600">{courseData.price || "Free"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Curriculum</p>
                <p className="font-semibold text-sm">{courseData.chapterCount} Chapters</p>
              </div>
            </div>
          </section>

          {/* Chapters & Lessons */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Course Curriculum</h3>
              {isEditing && <Button variant="link" className="text-blue-600 gap-1 p-0 h-auto font-bold"><PlusCircle size={16}/> Add Chapter</Button>}
            </div>
            
            {!courseData.chapters || courseData.chapters.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-gray-200 text-center text-slate-400 font-medium">
                No curriculum uploaded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {courseData.chapters.map((chapter: any) => (
                  <Accordion key={chapter.id} type="single" collapsible className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {/* ChapterItem logic is maintained inside your component */}
                    <ChapterItem 
                       chapter={chapter} 
                       variant={variant} 
                       onPreviewLesson={(lesson: any) => setPreviewLesson(lesson)} // Passing handler for Admin Modal
                    />
                  </Accordion>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar: Admin Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Layers size={18} className="text-blue-600"/> Instructor Info</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                  {courseData.createdBy?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{courseData.createdBy?.name}</p>
                  <p className="text-xs text-slate-400">{courseData.createdBy?.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Created On</span>
                  <span className="font-bold">{courseData.createdAt ? new Date(courseData.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </section>

            {variant === 'admin' && (
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <h3 className="font-bold mb-2">Review Actions</h3>
                
                {courseData.verificationStatus === "pending" && (
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl"
                      onClick={() => setAction("approve")}
                    >
                      Approve Course
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full font-bold py-6 rounded-xl"
                      onClick={() => setAction("reject")}
                    >
                      Reject Course
                    </Button>
                  </div>
                )}

                {courseData.isBlocked ? (
                  <Button 
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold" 
                    onClick={() => setAction("unblock")}
                  >
                    Unblock Course
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full border-red-600 text-red-600 hover:bg-red-50 font-bold"
                    onClick={() => setAction("block")}
                  >
                    Block Course
                  </Button>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {/* 4. Lesson Preview Modal (New Feature) */}
      {previewLesson && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">{previewLesson.title}</h3>
              <Button variant="ghost" size="icon" onClick={() => setPreviewLesson(null)}><Trash2/></Button>
            </div>
            <div className="p-8 text-center bg-slate-50 min-h-[300px] flex flex-col items-center justify-center">
              <PlayCircle size={64} className="text-slate-300 mb-4"/>
              <p className="text-xl font-bold text-slate-800">Demo Content Area</p>
              <p className="text-slate-500 italic max-w-sm mx-auto mt-2">
                This is a secure preview mode for administrators to verify resource quality.
              </p>
            </div>
            <div className="p-4 flex justify-end">
              <Button onClick={() => setPreviewLesson(null)} className="px-10 bg-slate-900">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}