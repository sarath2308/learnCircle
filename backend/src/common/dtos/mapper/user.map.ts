// mappers/user.mapper.ts
import { IUser } from "@/common";
import { UserResponseSchema, UserResponseDto } from "@/common";

export interface IUserDtoMapper {
  toResponse: (user: IUser) => Promise<UserResponseDto>;
}

export class UserDtoMapper implements IUserDtoMapper {
  async toResponse(user: IUser): Promise<UserResponseDto> {
    const plainUser = user.toObject ? user.toObject() : user;
    
    const transformedUser = {
      ...plainUser,
      id: plainUser._id?.toString?.() || plainUser._id,
    };
    delete transformedUser._id;

    const safeUser = UserResponseSchema.parse(transformedUser);

    return safeUser;
  }
}
