export interface ISessionBookingService {
  bookSession: (data: any) => Promise<any>;
  cancelBooking?: (sessionBookingId: string) => Promise<any>;
  confirmBooking?: () => Promise<any>;
  getAllBookingForUser?: (userId: string) => Promise<any>;
  getAllBoookingForInstructor?: (instructorId: string) => Promise<any>;
  getBookings: (date: Date, instructorId: string) => Promise<any>;
}
