import fs from 'fs';
import Bluebird from 'bluebird';
import express, { NextFunction, Request, Response } from 'express';
import { RequestRouter } from './api/request/routes';
import { MongoConnect } from './setup/MongoConnect';
import { RedisConnect } from './setup/RedisConnect';
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from './error/Errors';
import { SkillsRouter } from './api/skills/routes';

global.Promise = <any>Bluebird;

const configFile = fs.readFileSync(
  __dirname + '/../config/config.development.json',
  'utf-8'
);
export const config = JSON.parse(configFile);

const { server, database, redis } = config;
const { port } = server;

async function init() {
  await Promise.all([
    MongoConnect.connect(database),
    RedisConnect.connect(redis),
  ]);

  const app = express();

  app.use(express.json());

  app.get('/health', (req: Request, res: Response) => {
    res.send('Running');
  });

  app.use('/skill', SkillsRouter);

  app.use('/request', RequestRouter);

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name == 'ValidationError') {
      res
        .status(400)
        .json({ error: err.message, code: err.code, details: err.details });
    } else if (err.name == 'NotFoundError') {
      res
        .status(404)
        .json({ error: err.message, code: err.code, details: err.details });
    } else if (err.name == 'AuthenticationError') {
      res
        .status(401)
        .json({ error: err.message, code: err.code, details: err.details });
    } else if (err.name == 'AuthorizationError') {
      res
        .status(403)
        .json({ error: err.message, code: err.code, details: err.details });
    } else {
      res.status(500).json({ details: err.details });
    }
  });

  app.listen(port, (): void => {
    console.log(`Server Running at ${port}`);
  });
}

try {
  init();
} catch (error) {
  console.error(error);
}
