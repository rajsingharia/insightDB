import { IsBoolean, IsString } from "class-validator";

export class AlertTriggerDTO {
    @IsString()
    alertId!: string;

    @IsBoolean()
    isSuccessful!: boolean; 

    @IsString()
    errorMessage!: string; 
}