export type CreateLearnerDTO = {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  profileImg?: string;
  role?: string;
};
