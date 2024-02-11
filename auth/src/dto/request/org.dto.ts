import { IsEmail, IsString } from "class-validator";

export class OrganizationDTO {
    @IsString()
    organizationName!: string;
} 