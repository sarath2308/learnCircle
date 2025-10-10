export const TYPES = {
  LearnerProfileModel: Symbol.for("LearnerModel"),
  UserModel: Symbol.for("UserModel"), //models
  ProfessionalProfileModel: Symbol.for("ProfesionalModel"),
  AdminProfileModel: Symbol.for("AdminModel"),
  LearnerProfileRepo: Symbol.for("LearnerRepo"), //Repos
  ProfesionalProfileRepo: Symbol.for("ProfesionalRepo"),
  RedisRepository: Symbol.for("RedisRepository"),
  AdminProfile: Symbol.for("AdminRepository"),
  IUserRepo: Symbol.for("IUserRepo"),
  LearnerAuthService: Symbol.for("LearnerAuthService"), //role-Services
  ProfesionalAuthService: Symbol.for("ProfesionalAuthService"),
  LearnerHomeService: Symbol.for("LearnerHomeServices"),
  LearnerProfileService: Symbol.for("LearnerProfileService"),
  ProfesionalVerificationService: Symbol.for("ProfesionalVerificationService"),
  AdminAuthService: Symbol.for("AdminAuthService"),
  LearnerAuthController: Symbol.for("LearnerAuthController"), //controllers
  ProfesionalAuthController: Symbol.for("ProfesionalAuthController"),
  LearnerHomeController: Symbol.for("LearnerHomeController"),
  LearnerProfileController: Symbol.for("LearnerProfileController"),
  ProfesionalVerificationController: Symbol.for("ProfesionalVerificationController"),
  AdminAuthController: Symbol.for("AdminAuthController"),
  RefreshController: Symbol.for("RefreshController"),
  IEmailAuthService: Symbol.for("IEmailAuthService"),
  TokenService: Symbol.for("TokenService"), //common-services
  IRoleRepoFactory: Symbol.for("IRoleRepoFactory"),
  EmailService: Symbol.for("EmailService"),
  OtpService: Symbol.for("OtpService"),
  PasswordService: Symbol.for("PasswordService"),
  RefreshService: Symbol.for("RefreshService"),
  CloudinaryService: Symbol.for("CloudinaryService"),
  RoleDtoMapper: Symbol.for("RoleDtoMapper"),
};
