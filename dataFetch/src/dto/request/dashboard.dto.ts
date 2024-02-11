import { IsOptional, IsString } from "class-validator";
export class DashboardDTO {

    @IsString()
    title!: string;

    @IsString()
    @IsOptional()
    description!: string;

} 