import { ProfileInfo } from "../../models/profesionals";

const profileInfoFields: (keyof ProfileInfo)[] = [
  "title",
  "bio",
  "companyName",
  "experience",
  "skills",
  "typesOfSessions",
  "sessionPrice",
  "rating",
  "totalSessions",
  "resumeId",
];

export const mapToProfileInfo = (input: any): Partial<ProfileInfo> => {
  const mapped: Partial<ProfileInfo> = {};

  for (const key of profileInfoFields) {
    if (input[key] !== undefined) {
      mapped[key] = input[key];
    }
  }

  return mapped;
};
