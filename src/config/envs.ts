import 'dotenv/config';
import * as joi from 'joi';

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required()
  })
  .unknown(true);

const { error, value: envVars } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error ${error.message}`);
}

export const envs = {
  port: envVars.PORT as number,
  databaseUrl: envVars.DATABASE_URL as string,
};
