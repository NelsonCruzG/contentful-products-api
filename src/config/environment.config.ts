import * as Joi from 'joi';

export const environmentSchema = Joi.object({
  CONTENTFUL_SPACE_ID: Joi.string().required().messages({
    'string.required':
      'CONTENTFUL_SPACE_ID env variable is required but not set',
  }),
  CONTENTFUL_ACCESS_TOKEN: Joi.string().required().messages({
    'string.required':
      'CONTENTFUL_ACCESS_TOKEN env variable is required but not set',
  }),
  CONTENTFUL_ENVIRONMENT: Joi.string().required().messages({
    'string.required':
      'CONTENTFUL_ENVIRONMENT env variable is required but not set',
  }),
  CONTENTFUL_CONTENT_TYPE: Joi.string().required().messages({
    'string.required':
      'CONTENTFUL_CONTENT_TYPE env variable is required but not set',
  }),
  CONTENTFUL_BASE_URL: Joi.string().required().messages({
    'string.required':
      'CONTENTFUL_BASE_URL env variable is required but not set',
  }),
  POSTGRES_DB_HOST: Joi.string().required().messages({
    'string.required': 'POSTGRES_DB_HOST env variable is required but not set',
  }),
  POSTGRES_DB_PORT: Joi.number().required().messages({
    'number.base': 'POSTGRES_DB_PORT env var must be number',
    'number.port': 'POSTGRES_DB_PORT env var must be a valid port',
    'number.required': 'POSTGRES_DB_PORT env var is required but not set',
  }),
  POSTGRES_DB_USERNAME: Joi.string().required().messages({
    'string.required':
      'POSTGRES_DB_USERNAME env variable is required but not set',
  }),
  POSTGRES_DB_PASSWORD: Joi.string().required().messages({
    'string.required':
      'POSTGRES_DB_PASSWORD env variable is required but not set',
  }),
  POSTGRES_DB_NAME: Joi.string().required().messages({
    'string.required': 'POSTGRES_DB_NAME env variable is required but not set',
  }),
  APP_PORT: Joi.number().port().default(3000).messages({
    'number.base': 'APP_PORT env var must be number',
    'number.port': 'APP_PORT env var must be a valid port',
    'number.required': 'APP_PORT env var is required but not set',
  }),
});
