import { IParameters } from "../../../interfaces/IParameters";
import { DataBaseType } from "../../../util/constants";
import { MongoDBParametersDTO } from "./Mongodb.parameters.dto";
import { PostgresParametersDTO } from "./Postgres.parameters.dto";

export const createParametersDTO = (type: string): IParameters => {
    switch (type) {
        case DataBaseType.POSTGRES_QL.valueOf():
            return new PostgresParametersDTO();
        case DataBaseType.MONGO_DB.valueOf():
            return new MongoDBParametersDTO();
        default:
            throw new Error("Invalid type");
    }
}