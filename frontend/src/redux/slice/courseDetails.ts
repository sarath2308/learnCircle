import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CourseDetailsState {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  skillLevel: "beginner" | "intermediate" | "advanced" | "";
}

const initialState: CourseDetailsState = {
  id: "",
  title: "",
  description: "",
  category: "",
  subCategory: "",
  skillLevel: "", // force user to pick a valid level
};

const courseDetailsSlice = createSlice({
  name: "courseDetails",
  initialState,
  reducers: {
    setCourseDetails: (state, action: PayloadAction<Partial<CourseDetailsState>>) => {
      Object.assign(state, action.payload); // merge incoming fields, avoids boilerplate
    },

    resetCourseDetails: () => initialState,
    setCourseId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setCourseDetails, resetCourseDetails } = courseDetailsSlice.actions;
export default courseDetailsSlice.reducer;
