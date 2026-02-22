export type LearnerDataForUserManagement = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  isBlocked: boolean;
  profile_key?: string | null;
  role: string;
};

export type ProfessionalDataForUserManagement = {
  _id: string;
  userId: string;
  email: string;
  name: string;
  status?: string | null;
  rating?: number | null;
  totalSessions?: number | null;
  profile_key?: string | null;
  resume_key?: string | null;
  role: string;
  isBlocked: boolean;
};
