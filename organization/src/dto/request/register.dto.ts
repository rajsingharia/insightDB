import { IsBoolean, IsEmail, IsString } from "class-validator";

export class RegisterDTO {

    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    organizationId!: string;

    @IsBoolean()
    isAdmin!: boolean;

    @IsString()
    password!: string;
    
} 