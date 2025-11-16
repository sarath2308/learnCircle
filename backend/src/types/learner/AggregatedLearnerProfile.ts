export type AggregatedLearnerProfile = {
  _id: string;
  userId: string;
  name: string;
  role: string;
  email: string;
  isBlocked: boolean;
  profile_key?: string | null;
};
