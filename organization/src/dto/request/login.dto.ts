import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginDTO {

    @IsEmail()
    email!: string;

    @IsStrongPassword() // which means: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
    password!: string;
}