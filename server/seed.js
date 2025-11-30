const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // no .js needed in CJS

// get Mongo URI from .env
const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO_URI);

    // remove old users
    await User.deleteMany({});
    console.log("Old users removed.");

    // password
    const hashedPass = await bcrypt.hash("password123", 10);

    // create users
    const users = [
      {
        name: "Employee One",
        email: "employee@test.com",
        password: hashedPass,
        role: "employee",
        employeeId: "EMP001",
        department: "IT",
      },
      {
        name: "Manager One",
        email: "manager@test.com",
        password: hashedPass,
        role: "manager",
        employeeId: "MGR001",
        department: "Management",
      },
    ];

    await User.insertMany(users);
    console.log("Seeded users:");
    console.log(users);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
