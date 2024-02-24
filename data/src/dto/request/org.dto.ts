import { IsString } from "class-validator";

export class organisationDTO {
    @IsString()
    organisationName!: string;
} 