export const TYPES = {
  LearnerModel: Symbol.for("LearnerModel"), //models
  ProfesionalModel: Symbol.for("ProfesionalModel"),
  LearnerRepo: Symbol.for("LearnerRepo"), //Repos
  ProfesionalRepo: Symbol.for("ProfesionalRepo"),
  RedisRepository: Symbol.for("RedisRepository"),
  LearnerAuthService: Symbol.for("LearnerAuthService"), //role-Services
  ProfesionalAuthService: Symbol.for("ProfesionalAuthService"),
  LearnerHomeService: Symbol.for("LearnerHomeServices"),
  LearnerProfileService: Symbol.for("LearnerProfileService"),
  LearnerAuthController: Symbol.for("LearnerAuthController"), //controllers
  ProfesionalAuthController: Symbol.for("ProfesionalAuthController"),
  LearnerHomeController: Symbol.for("LearnerHomeController"),
  LearnerProfileController: Symbol.for("LearnerProfileController"),
  RefreshController: Symbol.for("RefreshController"),
  TokenService: Symbol.for("TokenService"), //common-services
  EmailService: Symbol.for("EmailService"),
  GenerateOtp: Symbol.for("GenerateOtp"),
  PasswordService: Symbol.for("PasswordService"),
  RefreshService: Symbol.for("RefreshService"),
  CloudinaryService: Symbol.for("CloudinaryService"),
  RoleDtoMapper: Symbol.for("RoleDtoMapper"),
};
