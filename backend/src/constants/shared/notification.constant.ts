export enum NotificationType {
  SESSION_BOOKED = "SESSION_BOOKED",
  SESSION_CANCELLED = "SESSION_CANCELLED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  ENROLLMENT = "ENROLLMENT",
  EVENT = "EVENT",
  WELCOME = "WELCOME",
}

export const NotificationTemplates: Record<NotificationType, { title: string; message: string }> = {
  [NotificationType.SESSION_BOOKED]: {
    title: "Session Booked",
    message: "Your session has been successfully booked.",
  },
  [NotificationType.SESSION_CANCELLED]: {
    title: "Session Cancelled",
    message: "Your session has been cancelled.",
  },
  [NotificationType.PAYMENT_SUCCESS]: {
    title: "Payment Successful",
    message: "Your payment was completed successfully.",
  },
  [NotificationType.ENROLLMENT]: {
    title: "Enrollment Confirmed",
    message: "You have been successfully enrolled.",
  },
  [NotificationType.EVENT]: {
    title: "New Event",
    message: "A new event has been scheduled for you.",
  },
  [NotificationType.WELCOME]: {
    title: "Welcome",
    message: "Welcome back Learner",
  },
};
