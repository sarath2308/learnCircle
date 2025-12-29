export interface ILearnerHomeService {
  getHome: (userId: string) => Promise<void>;
}
