import { AlertDestinations } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { IsJSON, IsNumber, IsOptional, IsString } from "class-validator";

export class AlertDTO {
    @IsString()
    title!: string;

    @IsString()
    integrationId!: string;

    @IsString()
    rawQuery!: string; 

    @IsString()
    destination!: AlertDestinations; 

    @IsJSON()
    configuration!: JsonValue; 

    @IsString()
    cronExpression!: string; 

    @IsNumber()
    @IsOptional()
    repeatCount: number = 0;
}