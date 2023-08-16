import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),

  ACCESS_TOKEN_EXPIRE_SEC: Joi.number().required(),
  REFRESH_TOKEN_EXPIRE_SEC: Joi.number().required(),

  EMAIL_TOKEN_EXPIRE_SEC: Joi.number().required(),
});
