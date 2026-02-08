
import { prisma } from "./src/lib/db";

async function main() {
    try {
        console.log("Connecting to database...");
        await prisma.$connect();
        console.log("Connected successfully!");

        const count = await prisma.videoAnalysis.count();
        console.log(`Found ${count} analyses.`);

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

main();
