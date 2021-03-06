var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CLIENT_ID: '"' + process.env.CLIENT_ID + '"',
  CLIENT_DOMAIN: '"' + process.env.CLIENT_DOMAIN + '"' ,
  CLIENT_CUSTOM_DOMAIN: '"' + process.env.CLIENT_CUSTOM_DOMAIN + '"' ,
  AUTH0_CALLBACK_REDIRECT: '"' + process.env.AUTH0_CALLBACK_REDIRECT + '"',
  SCOPE: '"full_access"',
  AUTH0_AUDIENCE: '"' + process.env.AUTH0_AUDIENCE + '"',
  JOBS_API_URL: '"' + process.env.JOBS_API_URL + '"',
  LINKEDIN_CLIENT_ID: '"' +  process.env.LINKEDIN_CLIENT_ID + '"',
  LINKEDIN_CALLBACK: '"' +  process.env.LINKEDIN_CALLBACK + '"',
  GOOGLE_API_KEY: '"' +  process.env.GOOGLE_API_KEY + '"',
  FACEBOOK_APP_ID: '"' + process.env.FACEBOOK_APP_ID + '"',
  HOST: '"' + process.env.HOST + '"',
  AWS_S3_BUCKET: '"' + process.env.AWS_S3_BUCKET + '"',
  GOOGLE_ANALITICS_ID: '"' + process.env.GOOGLE_ANALITICS_ID + '"',
  HOTJAR_ID: '"' + process.env.HOTJAR_ID + '"',
  HOTJAR_SNIPPET_VERSION: '"' + process.env.HOTJAR_SNIPPET_VERSION + '"'
})
