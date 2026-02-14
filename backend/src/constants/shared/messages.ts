export const Messages = {
  // Auth related
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  PASSWORD_CHANGED: "Password changed successfully",
  UNAUTHORIZED: "You are not authorized to perform this action",
  FORBIDDEN: "Access forbidden - insufficient permissions",
  TOKEN_EXPIRED: "Token has expired, please login again",
  TOKEN_INVALID: "Invalid token",
  TOKEN_REVOKED: "Token has been revoked",
  OTP_REQUIRED: "OTP verification is required",
  OTP_INVALID: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired, request a new one",
  EMAIL_EXISTS: "Email is already registered",
  GOOGLE_AUTH_FAILED: "Google authentication failed. Please try again",
  USED_GOOGLE_AUTH:
    "This email is linked to a Google account. Please use Google Sign-In to access your account",
  // General errors
  SERVER_ERROR: "Something went wrong, please try again later",
  BAD_REQUEST: "Bad request - invalid input",
  VALIDATION_ERROR: "Validation failed - check your input",
  NOT_FOUND: "Resource not found",
  BLOCKED_USER: "Your account has been blocked. Please contact support.",
  OTP_SESSION_OUT: "Resend OTP request invalid. OTP session timed out.",
  // Success messages
  LOGIN_SUCCESS: "Logged in successfully",
  LOGOUT_SUCCESS: "Logged out successfully",
  REGISTER_SUCCESS: "Account created successfully",
  REFRESH_SUCCESS: "Token refreshed successfully",
  PROFILE_FETCHED: "Profile fetched Successfully",

  // User actions
  PROFILE_UPDATED: "Profile updated successfully",
  USER_DELETED: "User deleted successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  PROFILE_NOT_UPDATED: "Profile Not Updated,Try After Sometimes",
  PROFILE_NOT_FOUND: "Profile Not Found",
  INCORRECT_PASSWORD: "Incorrect Password",
  OTP_SENT_SUCCESS: "Otp sent for verification",
  EMAIL_CHANGED: "Email updated",
  PROFILE_URL_GENERATED: "new Profile Url Generated",

  //home realted
  HOME_RENDERED: "Home Page rendered",

  //professional
  DASHBOARD_FETCHED: "Dashboard Successfully fetched",

  //admin
  USER_MANAGEMENT_FETCHED: "User Data fetched",
  USER_BLOCKED: "User Blocked",
  USER_UNBLOCKED: "User UNblocked",
  USER_APPROVED: "Application Approved",
  USER_REJECTED: "User Application Rejected",

  //Category
  CATEGORY_NOT_CREATED: "Category Not Created",
  CATEGORY_NOT_FOUND: "Category Not Found",
  CATEGORY_ALREADY_EXISTS: "Category with this name already exists.",
  //Sub Category
  SUBCATEGORY_NOT_CREATED: "Sub Category Not Created",
  SUBCATEGORY_NOT_FOUND: "Sub Category Not Found",
  SUBCATEGORY_ALREADY_EXISTS: "Sub Category with this name already exists.",
  SUBCATEGORY_CREATION_FAILED: "Failed to create subcategory. Please try again later.",

  //course
  COURSE_NOT_CREATED: "Failed to create course. Please try again later.",
  COURSE_NOT_FOUND: "Course Not found",
  COURSE_DUPLICATE: "A Course with this title already exists.",
  COURSE_NOT_UPDATED: "Course not Updated",
  //chapter
  CHAPTER_NOT_UPDATED: "Chapter Not Updated",
  CHAPTER_NOT_FOUND: "Chapter not found",
  CHAPTERS_NOT_FOUND: "there are no chapters for this course",
  CHAPTER_DUPLICATE: "Chapter title must be unique within a course.",
  CHAPTER_NOT_CREATED: "Chapter Not Created",

  //lesson
  LESSON_NOT_FOUND: "Lesson not found",
  LESSON_NOT_UPDATED: "Lesson Not Updated",
  LESSON_NOT_CREATED: "Lesson Not Created",
  LESSON_DUPLICATE: "Lesson title must be unique within a chapter.",
  RESOURCE_FILE_MISSING: "Resource file is missing for the lesson.",
  THUMBNAIL_FILE_MISSING: "Thumbnail file is missing for the lesson.",

  //Conversation
  CONVERSATION_NOT_STARTED: "Conversation Not Started",
  CONVERSATION_NOT_FOUND: "Conversation Not found",

  //Availability
  AVAILABILITY_NOT_FOUND: "Availability Not Found",

  // Availability-exception
  AVAILABILITY_EXCEPTION_NOT_FOUND: "Availability Exception Not found",
  AVAILABILITY_EXCEPTION_FOUND: "There are no available Slot",

  //Session Booking
  SESSION_BOOKING_NOT_CREATED: "Session Booking Not Created",
  SESSION_BOOKING_NOT_FOUND: "Session Booking Not Found",
  SLOT_NOT_AVAILABLE: "The selected time slot is not available. Please choose a different time.",
  SESSION_IS_NOT_CONFIRM: "Session is not confirm yet, Please wait for confirmation",
  NO_PERMISSION_TO_JOIN: "You do not have permission to join this session",
  SESSION_NOT_AVAILABLE_AT_THIS_TIME:
    "Session is not available at this time. You can join 5 minutes before and leave 5 minutes after the scheduled time.",
  SESSION_MARKED_COMPLETED: "Session marked as completed successfully",
};
