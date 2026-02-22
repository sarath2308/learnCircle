import type { ILessons } from "@/interface/lesson.response.interface";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: ILessons[];
}

interface CourseState {
  chapters: Chapter[];
}

const initialState: CourseState = {
  chapters: [],
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // -------------------- CHAPTER ACTIONS --------------------

    addChapter: (state, action: PayloadAction<Omit<Chapter, "lessons">>) => {
      state.chapters.push({
        ...action.payload,
        lessons: [], // ✅ ALWAYS initialize
      });
    },

    updateChapter: (state, action: PayloadAction<{ id: string; data: Partial<Chapter> }>) => {
      const chapter = state.chapters.find((c) => c.id === action.payload.id);
      if (!chapter) return;

      Object.assign(chapter, action.payload.data);
    },

    deleteChapter: (state, action: PayloadAction<string>) => {
      state.chapters = state.chapters.filter((c) => c.id !== action.payload);
    },

    // --------------------- LESSON ACTIONS ---------------------

    addLesson: (state, action: PayloadAction<{ chapterId: string; lesson: ILessons }>) => {
      const chapter = state.chapters.find((c) => c.id === action.payload.chapterId);
      if (!chapter) return;

      chapter.lessons.push(action.payload.lesson);
    },

    updateLesson: (
      state,
      action: PayloadAction<{
        chapterId: string;
        lessonId: string;
        data: Partial<ILessons>;
      }>,
    ) => {
      const chapter = state.chapters.find((c) => c.id === action.payload.chapterId);
      if (!chapter) return;

      const lesson = chapter.lessons.find((l) => l.id === action.payload.lessonId);
      if (!lesson) return;

      Object.assign(lesson, action.payload.data);
    },

    deleteLesson: (state, action: PayloadAction<{ chapterId: string; lessonId: string }>) => {
      const chapter = state.chapters.find((c) => c.id === action.payload.chapterId);
      if (!chapter) return;

      chapter.lessons = chapter.lessons.filter((l) => l.id !== action.payload.lessonId);
    },
    resetChapterState: () => initialState,
  },
});

// export actions
export const {
  addChapter,
  updateChapter,
  deleteChapter,
  addLesson,
  updateLesson,
  deleteLesson,
  resetChapterState,
} = courseSlice.actions;

// export reducer
export default courseSlice.reducer;
