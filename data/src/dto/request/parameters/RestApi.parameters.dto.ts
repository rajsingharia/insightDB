
import { IParameters } from "../../../interfaces/IParameters";
import { IsOptional, IsString, IsArray, IsJSON } from 'class-validator';

export class RestApiParametersDTO implements IParameters {
    type = "restApi";

    @IsString()
    endpoint!: string;


    @IsOptional()
    @IsArray()
    columns?: string[];

    @IsOptional()
    @IsArray()
    queryParams?: string[];

    @IsOptional()
    @IsArray()
    headers?: string[];

    @IsOptional()
    @IsJSON()
    body?: JSON;

    @IsOptional()
    @IsString()
    method?: string;
}