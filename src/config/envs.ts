import 'dotenv/config';
import * as joi from 'joi';

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required()
  })
  .unknown(true);

const { error, value: envVars } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

if (error) {
    throw new Error(`Config validation error ${error.message}`);
}

export const envs = {
  port: envVars.PORT as number,
  databaseUrl: envVars.DATABASE_URL as string,
  natsServers: envVars.NATS_SERVER
};
