// module.exports = ({env}) => ({
//   host: env('APP_HOST', '0.0.0.0'),
//   port: env.int('NODE_PORT', 1337),
//   admin: {
//     host: env('APP_HOST', '127.0.0.1'), // only used along with `strapi develop --watch-admin` command
//     port: 3000, // only used along with `strapi develop --watch-admin` command
//     auth: {

//       secret: env('ADMIN_JWT_SECRET', '9d171538301dbab75abffc96e7c60f11'),
//     },
//   },
//   cron: {
//     enabled: true
//   }
// });


module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // url: env('MY_HEROKU_URL'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'someSecretKey'),
    },
  },
  app: { 
    keys: env.array('APP_KEYS')
  },
});
 