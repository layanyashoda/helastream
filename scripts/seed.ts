
import { CosmosClient } from "@azure/cosmos";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load env vars from .env.local
dotenv.config({ path: ".env.local" });

const endpoint = process.env.AZURE_COSMOS_ENDPOINT || "https://localhost:8081";
const key = process.env.AZURE_COSMOS_KEY || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

async function seed() {
    console.log("🌱 Starting Database Seed...");
    console.log(`Endpoint: ${endpoint}`);

    const client = new CosmosClient({ endpoint, key });

    // 1. Create Database
    const databaseId = "HelaStreamDB";
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    console.log(`✅ Database '${databaseId}' created/verified.`);

    // 2. Create Containers
    const { container: videosContainer } = await database.containers.createIfNotExists({ id: "Videos" });
    console.log(`✅ Container 'Videos' created/verified.`);

    const { container: usersContainer } = await database.containers.createIfNotExists({ id: "Users" });
    console.log(`✅ Container 'Users' created/verified.`);

    // 3. Seed Admin User
    const adminEmail = "admin@helastream.com";

    // Check if admin exists
    const { resources: existingAdmins } = await usersContainer.items
        .query({
            query: "SELECT * FROM c WHERE c.email = @email",
            parameters: [{ name: "@email", value: adminEmail }]
        })
        .fetchAll();

    if (existingAdmins.length === 0) {
        console.log("creating Admin user...");
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const newAdmin = {
            id: "admin-user-01",
            email: adminEmail,
            name: "Super Admin",
            password: hashedPassword,
            role: "admin",
            createdAt: new Date().toISOString()
        };

        await usersContainer.items.create(newAdmin);
        console.log(`✅ Admin user created: ${adminEmail} / admin123`);
    } else {
        console.log("ℹ️ Admin user already exists.");
    }

    console.log("🎉 Seeding completed successfully!");
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
