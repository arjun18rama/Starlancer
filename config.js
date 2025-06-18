import { config as loadEnv } from "dotenv";

loadEnv();

const envChallenge = process.env.CHALLENGE || "false";
const challenge = ["true", "1", "yes"].includes(envChallenge.toLowerCase());

let users = { starlancer: "password" };
if (process.env.USERS) {
  users = {};
  for (const pair of process.env.USERS.split(",")) {
    const [username, password] = pair.split(":");
    if (username && password) {
      users[username] = password;
    }
  }
}

const config = {
  // Set to true if you want to enable password protection.
  challenge,
  // You can add multiple users by doing username: 'password'.
  users,
};

export default config;
