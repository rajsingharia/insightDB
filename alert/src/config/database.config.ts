import { PrismaClient } from "@prisma/client";

class prisma {
    private static instance: PrismaClient;
    private constructor() { }
    static getInstance(): PrismaClient {
        if (!prisma.instance) {
            prisma.instance = new PrismaClient();
        }
        return prisma.instance;
    }

    static async connect() {
        try {
            await prisma.instance.$connect();
            console.log("Connected to database");
        } catch (error) {
            console.log(error);
        }
    }
}

export default prisma;
