import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findMany({
        where: {
            integrations: {
                every: {
                    name: "PostgreSQL",
                }
            }
        }
    });
    console.log(user);
    const integration = await prisma.integration.findMany({
        where: {
            User: {
                is: {
                    firstName: "John",
                },
                isNot: {
                    lastName: "Doe",
                }
            }
        }
    });
    console.log(integration);
}

main()
    .catch(e => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });

