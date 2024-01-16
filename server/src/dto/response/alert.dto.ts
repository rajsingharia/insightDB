import { AlertDestinations } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export interface AlertDTO {
    id: string; 
    userId: string; 
    title: string; 
    rawQuery: string; 
    destination: AlertDestinations; 
    configuration: JsonValue; 
    cronExpression: string; 
    repeatCount: number;
}