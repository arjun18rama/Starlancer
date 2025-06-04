import cluster from 'node:cluster';
import os from 'node:os';

const numWorkers = Number.parseInt(process.env.WORKERS || os.cpus().length, 10);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code || 'unknown'} and signal ${signal || 'none'}. Restarting.`,
    );
    cluster.fork();
  });
} else {
  await import('./index.js');
}
