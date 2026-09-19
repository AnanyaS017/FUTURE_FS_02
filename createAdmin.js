const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function createAdmin() {
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);

        const email = "admin@minicrm.com";
        const password = "Admin@123";

        const existingAdmin = await db.collection("admins").findOne({ email });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.collection("admins").insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        console.log("Admin account created successfully.");
        console.log("Email:", email);
        console.log("Password:", password);
    } catch (error) {
        console.error("Error creating admin:", error.message);
    } finally {
        await client.close();
    }
}

createAdmin();
