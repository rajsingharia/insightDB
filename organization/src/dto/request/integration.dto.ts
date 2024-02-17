import { IsString } from "class-validator";

export class IntegrationDTO {

    @IsString()
    name!: string;

    @IsString()
    type!: string;

    @IsString()
    credentials!: string;
}