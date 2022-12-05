module.exports = ({ env }) => ({
  email: {
    provider: "smtp",
    providerOptions: {
      host: "smtp.gmail.com", //SMTP Host
      port: 465, //SMTP Port
      secure: true,
      username: "assethomezit@gmail.com",
      password: "tlvmzbawysadeaem",
      rejectUnauthorized: true,
      requireTLS: true,
      connectionTimeout: 1,
    },
    settings: {
      from: "noreply@assethomez.com",
      replyTo: "noreply@assethomez.com",
    },
  },
});

module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION"),
        params: {
          Bucket: env("AWS_BUCKET_NAME"),
        },
      },
      // These parameters could solve issues with ACL public-read access — see [this issue](https://github.com/strapi/strapi/issues/5868) for details
      actionOptions: {
        upload: {
          ACL: null,
        },
        uploadStream: {
          ACL: null,
        },
      },
    },
  },
});
