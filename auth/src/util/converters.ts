import { User } from "@prisma/client";
import { UserDTO } from "../dto/response/user.dto";

export class Converter {
    public static UserEntityToUserDto(userEntity: User): UserDTO {
        return {
            id: userEntity.id,
            firstName: userEntity.firstName,
            lastName: userEntity.lastName,
            email: userEntity.email,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt
        }
    }
}