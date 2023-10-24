
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    // Common
    PORT: Joi.number().default(8080),

    // Database
    DB_URI: Joi.string().required(),

    // JWT
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_VERIFICATION_SECRET: Joi.string().required().description('email verification secret key'),

    SESSION_SECRET: Joi.string().required().description('session secret key'),
    // JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    // JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
   
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_DEFAULT_REGION: Joi.string().required(),
    AWS_BUCKET: Joi.string().required(),
    AWS_BUCKET_BASE_URL: Joi.string().required(),
    
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
  port: envVars.PORT,
  db:{
    dbURI: envVars.DB_URI,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    verificationSecret: envVars.JWT_VERIFICATION_SECRET,
  },
  misc:{
    sessionSecret: envVars.SESSION_SECRET,
  },
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    defaultRegion: envVars.AWS_DEFAULT_REGION,
    bucket: envVars.AWS_BUCKET,
    bucketBaseUrl: envVars.AWS_BUCKET_BASE_URL,
  },

};
