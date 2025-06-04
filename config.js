import dotenv from 'dotenv';

dotenv.config();

function parseUsers(value = '') {
  const users = {};
  for (const pair of value.split(',')) {
    const [user, pass] = pair.split(':');
    if (user && pass) {
      users[user] = pass;
    }
  }
  return users;
}

const config = {
  challenge: process.env.CHALLENGE !== 'false',
  users: process.env.USERS ? parseUsers(process.env.USERS) : { admin: 'password' },
};

export default config;
