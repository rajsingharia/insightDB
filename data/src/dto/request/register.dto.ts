import { IsBoolean, IsEmail, IsString } from "class-validator";

export class RegisterDTO {

    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    organisationName!: string;

    @IsBoolean()
    isAdmin!: boolean;

    @IsString()
    password!: string;
    
} 