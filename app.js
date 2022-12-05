const strapi = require('strapi');

if (process.env.NODE_ENV == "development")
    strapi({"autoReload": { "enabled": true }}).start();
else
    strapi().start();