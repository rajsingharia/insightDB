
import { IParameters } from "../../../interfaces/IParameters";
import { IsOptional, IsString, IsArray } from 'class-validator';

export class MongoDBParametersDTO implements IParameters {
    type = "mongodb";

    @IsString()
    sourceName!: string;

    @IsOptional()
    @IsArray()
    columns?: string[];

    @IsOptional()
    @IsString()
    timeField?: string;

    @IsOptional()
    @IsArray()
    orderBy?: string[];

    @IsOptional()
    @IsString()
    limit?: string;

    @IsOptional()
    timeRange?: {
        from: string;
        to: string;
    };

    @IsOptional()
    @IsString()
    aggregationType?: string;

    @IsOptional()
    @IsArray()
    filters?: string[];
}