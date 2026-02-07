export type AggregatedProfessionalProfile = {
  _id: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  status?: string | null;
  rating?: number | null;
  isBlocked: boolean;
  totalSessions?: number | null;
  profile_key?: string | null;
  resume_key?: string | null;
  title?: string | null;
};
