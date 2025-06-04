import dotenv from "dotenv";

dotenv.config();

function parseUsers(value) {
  const users = {};
  value
    .split(",")
    .map(entry => entry.trim())
    .forEach(entry => {
      const [username, password] = entry.split(":");
      if (username && password) {
        users[username] = password;
      }
    });
  return users;
}

const DEFAULT_USERS = {
  interstellar: "password",
};

const config = {
  // Set CHALLENGE=true to enable password protection
  challenge: process.env.CHALLENGE
    ? process.env.CHALLENGE.toLowerCase() === "true"
    : false,
  // Provide USERS as "user:pass,user2:pass2"
  users: process.env.USERS ? parseUsers(process.env.USERS) : DEFAULT_USERS,
};

export default config;
