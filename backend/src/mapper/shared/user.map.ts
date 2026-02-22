// mappers/user.mapper.ts
import { IUser } from "@/model/shared/user.model";
import { UserResponseDto, UserResponseSchema } from "@/schema/shared/auth/auth.dto.schema";

export interface IUserDtoMapper {
  toResponse: (user: IUser) => Promise<UserResponseDto>;
}

export class UserDtoMapper implements IUserDtoMapper {
  async toResponse(user: IUser): Promise<UserResponseDto> {
    const transformedUser = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const safeUser = UserResponseSchema.parse(transformedUser);

    return safeUser;
  }
}
