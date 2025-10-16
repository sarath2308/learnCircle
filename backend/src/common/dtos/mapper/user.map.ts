// mappers/user.mapper.ts
import { IUser } from "@/common";
import { UserResponseSchema, UserResponseDto, CreateUserRequestDto } from "@/common";
export interface IUserDtoMapper {
  toResponse: (user: IUser) => UserResponseDto;
  toEntity: (data: CreateUserRequestDto) => Partial<IUser>;
}
export class UserDtoMapper {
  static toResponse(user: IUser): UserResponseDto {
    const plainUser = user.toObject ? user.toObject() : user;
    const safeUser = UserResponseSchema.parse(plainUser);

    return safeUser;
  }
  static toEntity(data: CreateUserRequestDto): Partial<IUser> {
    return {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      isBlocked: data.isBlocked ?? false,
      providers: data.providers ?? [],
    };
  }
}
