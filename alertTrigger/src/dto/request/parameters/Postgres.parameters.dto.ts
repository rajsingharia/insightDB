
import { IParameters } from "../../../interfaces/IParameters";
import { IsOptional, IsString, IsArray } from 'class-validator';

type PostgresFilter = {
    field: string;
    value: string;
    operator: string;
}

export class PostgresParametersDTO implements IParameters {
    type = "postgres";

    @IsString()
    sourceName!: string;

    @IsOptional()
    @IsArray()
    columns?: string[];

    @IsOptional()
    @IsString()
    timeField?: string;

    // @IsOptional()
    // @IsString()
    // timeAggregationType?: string;

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
    filters?: PostgresFilter[];
}