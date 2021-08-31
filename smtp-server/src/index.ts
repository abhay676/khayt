import express from 'express';
import dotenv from 'dotenv';
import cluster from 'cluster';
import { cpus } from 'os';
import { consumeMessage } from './services/queue.service';
dotenv.config();

const numCPUs = cpus().length;

if (cluster.isMaster) {
  console.log(`This machine has ${numCPUs} CPUs.`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`
    );
    console.log('Starting a new worker...');
    cluster.fork();
  });
} else {
  const app = express();

  setTimeout(() => {
    consumeMessage();
  }, 3000);

  app.listen(process.env.PORT, () => {
    console.log(`Server is listen on ${process.env.PORT}`);
  });
}
