import { Integration } from "@prisma/client";
import { IntegrationDTO } from "../dto/response/integration.dto";

export class Converter {
    public static IntegrationEntityToIntegrationDto(integration: Integration): IntegrationDTO {
        return {
            id: integration.id,
            name: integration.name,
            type: integration.type,
            createdAt: integration.createdAt,
            updatedAt: integration.updatedAt
        }
    }
}