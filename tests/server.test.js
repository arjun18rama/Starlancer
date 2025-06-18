const { spawn } = require("child_process");
const PORT = 31337;
let server;
const fetch = global.fetch;
jest.setTimeout(10000);

beforeAll(done => {
  server = spawn("node", ["index.js"], {
    env: { ...process.env, PORT: PORT.toString() },
    stdio: "ignore",
  });
  // wait briefly for server to start
  setTimeout(done, 1000);
});

afterAll(() => {
  if (server) {
    server.kill();
  }
});

test("GET / returns 200", async () => {
  const res = await fetch(`http://localhost:${PORT}/`);
  expect(res.status).toBe(200);
});
