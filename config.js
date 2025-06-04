import dotenv from "dotenv";

dotenv.config();

function parseUsers(value = "") {
  const users = {};
  for (const pair of value.split(",")) {
    const [user, pass] = pair.split(":");
    if (user && pass) {
      users[user] = pass;
    }
  }
  return users;
}

export default {
  challenge: process.env.CHALLENGE !== "false",
  users: parseUsers(process.env.USERS),
};
